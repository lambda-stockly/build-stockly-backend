const db = require('../dbConfig');

module.exports = {
    insert,
    getAll,
    getByTicker,
    getByUser,
}

function insert(user) {
    // return db('users')
    //     .insert(user, 'id')
    //     .then(id => {
    //         return db('users')
    //         .where({
    //             id: id[0]
    //         })
    //         .first();
    //     });
}

function getAll(email) {
    // return db('users')
    //     .where({
    //         email
    //     })
    //     .first();
}

function getByTicker(email) {
    // return db('users')
    //     .where({
    //         email
    //     })
    //     .first();
}

function getByUser(email) {
    // return db('users')
    //     .where({
    //         email
    //     })
    //     .first();
}