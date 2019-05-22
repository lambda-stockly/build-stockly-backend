const express = require('express');
const dataScienceApi = require('../data/api/datascience');
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
                return dataScienceApi();
            } else if (Date.parse(stocksApiResponse.updated_at) > new Date(Date.now() - 86400 * 1000).getTime()) {
                const actionThresholds = stocksApiResponse.data.actionThresholds;
                res.status(200).send({
                    ticker: req.params.ticker,
                    actionThresholds 
                });
            } else {
                return dataScienceApi();
            }
        })
        .then(apiResponse => {
            if (apiResponse !== undefined && typeof apiResponse.data === 'object') {
                stocksApi.insert({
                    ticker: req.params.ticker,
                    data: JSON.stringify({actionThresholds: apiResponse.data})
                });
                res.status(200).send({
                    ticker: req.params.ticker,
                    actionThresholds: apiResponse.data
                });
            } else if(apiResponse !== undefined && apiResponse.data.contains('Thank you for using Alpha Vantage!')) {
                res.status(500).send({
                    message: 'Alpha Vantage Rate Limited'
                });
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).send({
                message: 'Internal Server Error'
            });
        });
});

router.get('/', (req, res) => {

    stocksApi.getAll()
        .then(stocksApiResponse => {
            const responseWithParsedJSON = stocksApiResponse.map(({
                id,
                ticker,
                created_at,
                updated_at,
                data
            }) => {
                
                const actionThresholds = data.actionThresholds;

                return {
                    id,
                    ticker,
                    created_at,
                    updated_at,
                    actionThresholds
                }
            })

            res.status(200).send(responseWithParsedJSON);
        })
        .catch(err => {
            res.status(500).send({
                message: 'Internal Server Error'
            });
        });
});

module.exports = router;