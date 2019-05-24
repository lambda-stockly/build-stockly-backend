const db = require('../dbConfig');
const stocksApi = require('./stocks');

module.exports = {
    insert,
    getAll,
    getByTicker,
    getByUser,
    getTopSearched
}

function insert(payload) {
    return db('searches')
        .insert({
            ...payload,
            created_at: Date.now()
        }, 'id')
        .then(id => {
            return db('searches')
                .where({
                    id: id[0]
                })
                .first();
        });
}

function getAll() {
    return db('searches');
}

function getByTicker(ticker) {
    //tODO: SORT may be broken now that dates are strings???
    return db('searches')
        .where({
            ticker,
            new_response: 1
        })
        .orderBy('created_at', 'desc')
        .first();
}

function getByUser(user_id) {
    return db('searches')
        .where({
            user_id
        });
}

function getTopSearched() {
    return db('searches')
        .select('ticker')
        .count('ticker as number_of_searches')
        .groupBy('ticker')
        .orderBy('number_of_searches', 'desc')
        .limit(5)
        .then(topFive => {
            const allStocks = topFive.map((stock,rank) => {

                return stocksApi.getByTicker(stock.ticker).then(stockFromDb => {

                    let actionThresholds;
                    if (process.env.DB_ENV === 'development' || process.env.DB_ENV === 'testing') {
                        actionThresholds = JSON.parse(stockFromDb.data);
                    } else {
                        actionThresholds = stockFromDb.data;
                    }

                    stock.actionThresholds = actionThresholds;
                    delete stockFromDb.data;
                    
                    return {
                        rank: rank+1,
                        ...stock,
                        actionThresholds: stockFromDb.actionThresholds,
                        created_at: stockFromDb.created_at,
                        updated_at: stockFromDb                   
                    };
                })
            });

            return Promise.all(allStocks);
        });
}