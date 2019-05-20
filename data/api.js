const db = require('./dbConfig');

module.exports = {
    register,
    login
}

function register(user) {
    return db('users')
        .insert(user);
}

function login(email) {
    return db('users')
        .where({
            email
        })
        .first();
}