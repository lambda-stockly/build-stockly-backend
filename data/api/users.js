const db = require('../dbConfig');

module.exports = {
    getByEmail
}

function getByEmail(email) {
    return db('users')
        .where({email})
        .first();
}