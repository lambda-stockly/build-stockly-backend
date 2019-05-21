const express = require('express');
const dsApi = require('../data/api/ds');
const stocksApi = require('../data/api/stocks');
const router = express.Router();

router.get('/:ticker', (req, res) => {

    if (req.params.ticker === undefined || req.params.ticker.trim().length === 0) {
        res.status(400).send({
            message: 'Please provide a ticker'
        });
    }

    stocksApi.getByTicker(req.params.ticker)
        .then(stocksApiResponse => {
            if (stocksApiResponse === undefined) {
                return dsApi();
            } else if (Date.parse(stocksApiResponse.updated_at) > new Date(Date.now() - 86400 * 1000).getTime()) {
                res.status(200).send({
                    ticker: req.params.ticker,
                    actionThresholds: JSON.parse(stocksApiResponse.data)
                });
            } else {
                return dsApi();
            }
        })
        .then(apiResponse => {
            if (apiResponse !== undefined) {
                stocksApi.insert({
                    ticker: req.params.ticker,
                    data: JSON.stringify({
                        actionThresholds: apiResponse.data
                    })
                });
                res.status(200).send({
                    ticker: req.params.ticker,
                    actionThresholds: apiResponse.data
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: 'Internal Server Error'
            });
        });
});

router.get('/', (req, res) => {

    stocksApi.getAll()
        .then(stocksApiResponse => {
            const responseWithParsedJSON = stocksApiResponse.map(({id,ticker,created_at,updated_at,data}) => ({
                id,
                ticker,
                created_at,
                updated_at,
                actionThresholds: JSON.parse(data)
            }))

            res.status(200).send(responseWithParsedJSON);
        })
        .catch(err => {
            console.log(err)
            res.status(500).send({
                message: 'Internal Server Error'
            });
        });
});

module.exports = router;