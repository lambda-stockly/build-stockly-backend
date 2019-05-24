const db = require('../dbConfig');
const knex = require('knex');

module.exports = {
    deleteByTicker,
    insert,
    getAll,
    getAllById,
    getAllByTicker,
    getByTicker,
    getById,
    update,
}

function insert(payload) {
    return db('stocks')
        .insert({
            ...payload,
            created_at: Date.now(),
            updated_at: Date.now()
        }, 'id')
        .then(id => {
            return db('stocks')
                .where({
                    id: id[0]
                })
                .first();
        });
}

function getAll() {
    return db('stocks');
}

function getAllById(arrayOfIds) {
    return db('stocks')
        .whereIn('id', arrayOfIds)
}

function getAllByTicker(arrayOfTickers) {
    return db('stocks')
        .whereIn('ticker', arrayOfTickers)
}

function getByTicker(ticker) {
    return db('stocks')
        .where({
            ticker
        })
        .first();
}

function getById(id) {
    return db('stocks')
        .where({
            id
        })
        .first();
}

function deleteByTicker(ticker) {
    return db('stocks')
        .where({
            ticker
        })
        .del();
}

function update(ticker, payload) {
    return db('stocks')
        .where({
            ticker
        })
        .update({
            ...payload,
            updated_at: Date.now()
        });
}