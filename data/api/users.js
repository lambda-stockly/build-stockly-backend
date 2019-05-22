const db = require('../dbConfig');

module.exports = {
    getByEmail,
    getByUsername
}

function getByEmail(email) {
    return db('users')
        .where({email})
        .first();
}

function getByUsername(username) {
    return db('users')
        .where({username})
        .first();
}