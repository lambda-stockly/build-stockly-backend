const db = require('./dbConfig');

module.exports = {
    register,
    login
}

function register(user) {
    return db('users')
        .insert(user)
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