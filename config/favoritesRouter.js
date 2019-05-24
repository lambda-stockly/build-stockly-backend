const express = require('express');
const favoritesApi = require('../data/api/favorites');
const stocksApi = require('../data/api/stocks');
const dataScienceApi = require('../data/api/datascience');
const searchesApi = require('../data/api/searches');
const router = express.Router();

router.get('/', (req, res) => {
    favoritesApi
        .getByUserId(req.headers.user.id)
        .then(allFavorites => {
            console.log(allFavorites)
            return stocksApi.getAllById(allFavorites.map(fav => fav.stock_id));
        })
        .then(allStocks => {
            console.log(allStocks)
            const parsedStocks = allStocks.map(stock => {

                let actionThresholds;
                if (process.env.DB_ENV === 'development' || process.env.DB_ENV === 'testing') {
                    actionThresholds = JSON.parse(stock.data).actionThresholds;
                } else {
                    actionThresholds = stock.data.actionThresholds;
                }

                stock.actionThresholds = actionThresholds;
                delete stock.data;
                return stock;
            })
            res
                .status(200)
                .send(parsedStocks);
        })
        .catch(err => {
            console.log(err)
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

                //The stock is already in the stocks table
                if (response !== undefined) {

                    //Save stock info for later down the .then() chain
                    applicableStock = response;

                    //Get all of the user's favorites
                    return favoritesApi.getByUserId(req.headers.user.id);
                } else {

                    //Insert the ticker into stocks to avoid duplicates
                    stocksApi.insert({
                        ticker: req.params.ticker
                    });

                    return dataScienceApi(req.body.ticker)
                        .then(dataScienceResponse => {

                            //See if the API is rate limited
                            if (dataScienceResponse !== undefined && typeof dataScienceResponse.data !== 'object') {
                                throw new Error('Alpha Vantage API Limit Reached')
                            }
                            
                            //Else, data science returned a proper answer
                            else {

                                //Update the searches table
                                searchesApi.insert({
                                    user_id: req.headers.user.id,
                                    ticker: req.body.ticker,
                                    new_response: 1,
                                    response: JSON.stringify(dataScienceResponse.data)
                                });

                                //Update the stocks table with the data science response
                                return stocksApi.update(
                                    req.body.ticker, {
                                        data: JSON.stringify({
                                            actionThresholds: dataScienceResponse.data
                                        })
                                    }
                                );
                            }
                        })
                        .then(response2 => {
                            
                            //Save the applicable stock for later
                            applicableStock = response2[0];
                            
                            //Get the user's favorites
                            return favoritesApi.getByUserId(req.headers.user.id);
                        });
                }
            })
            .then(allFavorites => {

                //See if this stock is already in the user's favorites
                if (allFavorites.find(stock => stock.stock_id === applicableStock.id)) {
                    res
                        .status(422)
                        .send({
                            message: 'This stock has already been added to favorites'
                        });

                        //Undefined is return so the rest of the .then() chain doesn't run
                        return undefined;
                } else {

                    //Otherwise, insert it into the favorites 
                    return favoritesApi.insert({
                        user_id: req.headers.user.id,
                        stock_id: applicableStock.id
                    });
                }
            })
            .then(allFavorites => {

                //If allFavorites is undefined then the user already added this stock to their favorites
                if (allFavorites !== undefined) {
                    return stocksApi.getAllById(allFavorites.map(fav => fav.stock_id));
                }
            })
            .then(allStocks => {

                //If the response hasn't been sent
                if (allStocks !== undefined) {

                    //Parse the response (an array of objects) to match common response format
                    const parsedStocks = allStocks.map(stock => {

                        let actionThresholds;
                        if (process.env.DB_ENV === 'development' || process.env.DB_ENV === 'testing') {
                            actionThresholds = JSON.parse(stock.data).actionThresholds;
                        } else {
                            actionThresholds = stock.data.actionThresholds;
                        }
                        stock.actionThresholds = actionThresholds;
                        delete stock.data;
                        return stock;
                    })

                    res
                        .status(200)
                        .send(parsedStocks);
                }
            })
            .catch(err => {
                console.log(err)
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

        //Get the stocks table data for the applicable stock
        stocksApi
            .getByTicker(req.body.ticker)
            .then(applicableStock => {

                //Use the stock's id to remove it from favorites
                return favoritesApi.remove({
                    user_id: req.headers.user.id,
                    stock_id: applicableStock.id
                });
            })
            .then(allFavorites => {
                
                //Get all of the new favorites by ID
                return stocksApi.getAllById(allFavorites.map(fav => fav.stock_id));
            })
            .then(allStocks => {

                //Parse the response into an array of objects in common format with other endpoints
                const parsedStocks = allStocks.map(stock => {

                    let actionThresholds;
                    if (process.env.DB_ENV === 'development' || process.env.DB_ENV === 'testing') {
                        actionThresholds = JSON.parse(stock.data).actionThresholds;
                    } else {
                        actionThresholds = stock.data.actionThresholds;
                    }
                    stock.actionThresholds = actionThresholds;
                    delete stock.data;
                    return stock;
                });

                res
                    .status(200)
                    .send(parsedStocks);
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