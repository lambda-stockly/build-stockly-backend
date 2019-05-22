const express = require('express');
const dataScienceApi = require('../data/api/datascience');
const stocksApi = require('../data/api/stocks');
const searchesApi = require('../data/api/searches');
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
                let actionThresholds;                
                if(process.env.DB_ENV === 'development' || process.env.DB_ENV === 'testing') {
                    actionThresholds = JSON.parse(stocksApiResponse.data).actionThresholds;
                } else {
                    actionThresholds = stocksApiResponse.data.actionThresholds;
                }
                res.status(200).send({
                    ticker: req.params.ticker,
                    actionThresholds 
                });
                searchesApi.insert({
                    user_id: req.headers.user.id,
                    ticker: req.params.ticker,
                    new_response: 0,
                    response: JSON.stringify(actionThresholds)
                })
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
                searchesApi.insert({
                    user_id: req.headers.user.id,
                    ticker: req.params.ticker,
                    new_response: 1,
                    response: JSON.stringify(apiResponse.data)
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
                
                let actionThresholds;                
                if(process.env.DB_ENV === 'development' || process.env.DB_ENV === 'testing') {
                    actionThresholds = JSON.parse(data).actionThresholds;
                } else {
                    actionThresholds = data.actionThresholds;
                }

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