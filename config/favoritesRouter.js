const express = require('express');
const favoritesApi = require('../data/api/favorites');
const stocksApi = require('../data/api/stocks');
const dataScienceApi = require('../data/api/datascience');
const router = express.Router();

router.get('/', (req, res) => {
    favoritesApi
        .getByUserId(req.headers.user.id)
        .then(allFavorites => {
            res
                .status(200)
                .send(allFavorites);
        })
        .catch(err => {
            res
                .status(500)
                .send({
                    message: 'Internal Server Error'
                });
        });
});

router.post('/', (req, res) => {
    if (req.body.ticker === undefined || req.body.ticker.trim().length === 0) {
        res
            .status(400)
            .send({
                message: 'Please provide a ticker'
            });
    } else {
        let applicableStock;
        stocksApi
            .getByTicker(req.body.ticker)
            .then(response => {
                if (response !== undefined) {
                    applicableStock = response;
                    return favoritesApi.getByUserId(req.headers.user.id);
                } else {
                    return dataScienceApi()
                        .then(dataScienceResponse => {
                            return stocksApi.insert({
                                ticker: req.body.ticker,
                                data: JSON.stringify({
                                    actionThresholds: dataScienceResponse.data
                                })
                            });
                        })
                        .then(response2 => {
                            applicableStock = response2;
                            return favoritesApi.getByUserId(req.headers.user.id);
                        });
                }
            })
            .then(allFavorites => {
                if (allFavorites.find(stock => stock.stock_id === applicableStock.id)) {
                    res
                        .status(422)
                        .send({
                            message: 'This stock has already been added to favorites'
                        });
                } else {
                    return favoritesApi.insert({
                        user_id: req.headers.user.id,
                        stock_id: applicableStock.id
                    });
                }
            })
            .then(allFavorites => {
                if (allFavorites !== undefined) {
                    res
                        .status(200)
                        .send(allFavorites);
                }
            })
            .catch(err => {
                res
                    .status(500)
                    .send({
                        message: 'Internal Server Error'
                    });
            });
    }
});

router.delete('/', (req, res) => {
    if (req.body.ticker === undefined || req.body.ticker.trim().length === 0) {
        res
            .status(400)
            .send({
                message: 'Please provide a ticker'
            });
    } else {
        stocksApi
            .getByTicker(req.body.ticker)
            .then(applicableStock => {
                return favoritesApi.remove({
                    user_id: req.headers.user.id,
                    stock_id: applicableStock.id
                });
            })
            .then(allFavorites => {
                res
                    .status(200)
                    .send(allFavorites);
            })
            .catch(err => {
                res
                    .status(500)
                    .send({
                        message: 'Internal Server Error'
                    });
            });
    }
});

module.exports = router;