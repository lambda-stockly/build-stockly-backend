const db = require('../dbConfig');

module.exports = {
    insert,
    getByUser,
    delete
}

function insert(user) {
    // return db('users')
    //     .insert(user, 'id')
    //     .then(id => {
    //         return db('users')
    //             .where({
    //                 id: id[0]
    //             })
    //             .first();
    //     });
}

function getByUser(email) {
    // return db('users')
    //     .where({
    //         email
    //     })
    //     .first();
}

function delete(email) {
    // return db('users')
    //     .where({
    //         email
    //     })
    //     .first();
}