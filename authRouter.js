const express = require('express');

const router = express.Router();

router.post('/login', (req, res) => {
    res.status(200).send({
        message: 'yoo'
    });
});

router.post('/register', (req, res) => {
    res.status(200).send({
        message: 'yoo'
    });
});

module.exports = router;