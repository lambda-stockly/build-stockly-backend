const express = require('express');
const authApi = require('../data/api/auth');
const usersApi = require('../data/api/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET || 'Need an environment variable for JWT secret';

/*
POST /auth/login

Expected Payload:
{
    email: "bob@gmail.com",
    password: "pass123"
}
Returns:
{
    token: "token"
    user: {
        username: "bob",
        email: "bob@gmail.com"
    }
}
*/
router.post('/login', (req, res) => {

    if (req.body.email === undefined || req.body.email.trim().length === 0) {
        res.status(400).send({
            message: 'Please provide an email'
        });
    } else if (req.body.password === undefined || req.body.email.trim().length === 0) {
        res.status(400).send({
            message: 'Please provide a password'
        });
    } else {

        authApi.login(req.body.email)
            .then(user => {
                if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
                    res.status(422).send({
                        message: 'Invalid credentials'
                    });
                } else {
                    const sanitizedUser = {
                        username: user.username,
                        email: user.email,
                        created_at: user.created_at
                    };

                    const token = jwt.sign(sanitizedUser, jwtSecret, {
                        expiresIn: '1h'
                    });

                    res.status(200).send({
                        token,
                        user: sanitizedUser
                    });
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: 'Internal Server Error'
                });
            })
    }

});


/*
POST /auth/register

Expected Payload:
{
    email: "bob@gmail.com",
    username: "bob",
    password: "pass123"
}

Returns:
{
    token: "token"
    user: {
        username: "bob",
        email: "bob@gmail.com"
    }
}
*/
router.post('/register', (req, res) => {

    if (req.body.email === undefined || req.body.email.trim().length === 0) {
        res.status(400).send({
            message: 'Please provide an email'
        });
    } else if (req.body.username === undefined || req.body.username.trim().length === 0) {
        res.status(400).send({
            message: 'Please provide a username'
        });
    } else if (req.body.password === undefined || req.body.email.trim().length === 0) {
        res.status(400).send({
            message: 'Please provide a password'
        });
    } else {

        const hashedPass = bcrypt.hashSync(req.body.password, 14);

        usersApi.getByEmail(req.body.email)
            .then(user => {
                if (user === undefined) return usersApi.getByUsername(req.body.username);
                else res.status(422).send({
                    message: 'This email is already registered'
                });
                return null;
            })
            .then(user => {
                if (user === undefined) return authApi.register({
                    username: req.body.username,
                    email: req.body.email,
                    password: hashedPass,
                })
                else if(user !== null) res.status(422).send({
                    message: 'This username is already registered'
                });
            })
            .then(user => {

                if (user !== undefined) {

                    const sanitizedUser = {
                        username: user.username,
                        email: user.email,
                        created_at: user.created_at
                    };

                    const token = jwt.sign(sanitizedUser, jwtSecret, {
                        expiresIn: '1h'
                    });

                    res.status(200).send({
                        token,
                        user: sanitizedUser
                    });
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: 'Internal Server Error'
                });
            });
    }
});

module.exports = router;