const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/:ticker', (req, res) => {
    console.log(req.params.ticker);
    axios.get('https://dsstockly.herokuapp.com/')
        .then(apiResponse => {
            res.status(200).send({
                ticker: req.params.ticker,
                actionThresholds: apiResponse.data
            });
        })
        .catch(err => {
            res.status(500).send({
                message: 'Internal Server Error'
            });
        });
});

module.exports = router;