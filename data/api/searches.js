const db = require('../dbConfig');

module.exports = {
    insert,
    getAll,
    getByTicker,
    getByUser,
}

function insert(payload) {
    return db('searches')
        .insert(payload, 'id')
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
    return db('searches')
        .where({
            ticker,
            new_response: true
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