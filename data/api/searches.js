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
        .distinct()
        .pluck('ticker')
        .then(tickers => {

            const promiseArray = [];

            tickers.forEach(ticker => {

                promiseArray.push(
                    db('searches')
                    .where({
                        ticker
                    })
                    .then(result => {
                        return {
                            ticker,
                            count: result.length
                        }
                    }));
            });

            return Promise.all(promiseArray)
                .then(results => {
                    return results.sort((a, b) => a.count < b.count).slice(0, 5).map(a => a.ticker);
                })
        }).then(tickerArray => {
            return stocksApi.getAllByTicker(tickerArray);
        });
}