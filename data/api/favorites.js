const db = require('../dbConfig');

module.exports = {
    insert,
    getByUserId,
    remove
}

function insert(payload) {
    return db('favorites')
        .insert({
            ...payload,
            created_at: Date.now()
        }, 'id')
        .then(id => {
            return db('favorites')
                .where({
                    user_id: payload.user_id
                });
        });
}

function getByUserId(user_id) {
    return db('favorites')
        .where({
            user_id
        });
}

function remove({
    user_id,
    stock_id
}) {
    return db('favorites')
        .where({
            stock_id,
            user_id
        })
        .del()
        .then(() => {
            return db('favorites')
                .where({
                    user_id
                });
        })
}