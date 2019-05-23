const db = require('../dbConfig');

module.exports = {
    register,
    login,
}

function register(user) {
    return db('users')
        .insert({
            ...user,
            created_at: Date.now(),
            updated_at: Date.now()
        }, 'id')
        .then(id => {
            return db('users')
                .where({
                    id: id[0]
                })
                .first();
        });
}

function login(email) {
    return db('users')
        .where({
            email
        })
        .first();
}