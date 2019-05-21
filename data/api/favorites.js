const db = require('../dbConfig');

module.exports = {
    insert,
    getByUser,
    delete
}

function insert(payload) {
    return db('favorites')
        .insert(payload, 'id')
        .then(id => {
            return db('favorites')
                .where({
                    user_id: favorite.user_id
                });
        });
}

function getByUser(user_id) {
    return db('favorites')
        .where({
            user_id
        });
}

function delete(user_id,ticker) {
    return db('users')
        .where({
            user_id,
            ticker
        })
        .del();
}