const jwt = require('jsonwebtoken');
const usersApi = require('../data/api/users');
const jwtSecret = process.env.JWT_SECRET || 'Need an environment variable for JWT secret';

module.exports = (req, res, next) => {
    if (req.headers.authorization === undefined || req.headers.authorization.trim() === 0) {
        res.status(422).send({
            message: 'Log in first'
        });
    } else {
        const decodedToken = jwt.decode(req.headers.authorization, jwtSecret);

        if (decodedToken.email !== undefined) {
            usersApi.getByEmail(decodedToken.email)
                .then(userApiResponse => {
                    if (userApiResponse.email !== undefined && decodedToken.email === userApiResponse.email) {
                        req.headers.user = userApiResponse;
                        next()
                    } else {
                        res.status(422).send({
                            message: 'Invalid Credentials'
                        });
                    }
                })
                .catch(err => {
                    res.status(500).send({
                        message: 'Internal Server Error'
                    });
                })
        } else {
            res.status(422).send({
                message: 'Invalid Credentials'
            });
        }
    }
}