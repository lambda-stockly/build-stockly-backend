const express = require('express');
const dataScienceApi = require('../data/api/datascience');
const stocksApi = require('../data/api/stocks');
const searchesApi = require('../data/api/searches');
const router = express.Router();

router.get('/:ticker', (req, res) => {

    //Ensure a ticker was provided
    if (req.params.ticker === undefined || req.params.ticker.trim().length === 0) {
        res.status(400).send({
            message: 'Please provide a ticker'
        });
    }

    //See if the stock is already in the stocks table
    stocksApi.getByTicker(req.params.ticker)
        .then(stocksApiResponse => {

            //If the stock is not in the stocks table then insert it
            if (stocksApiResponse === undefined) {

                return stocksApi.insert({
                    ticker: req.params.ticker
                }).then(_ => {
                    //Request data from data science API
                    return dataScienceApi(req.params.ticker);
                });
            }

            //Else the stock is in the stocks table already
            //See if the cached data is more than 24 hours old
            else if (stocksApiResponse.data !== null && stocksApiResponse.updated_at > new Date(Date.now() - 86400 * 1000).getTime()) {

                //parseJson() is necessary because of differences in SQLITE and Postgres
                //Postgres will break if JSON.parse is used, and Sqlite will break if it's not used
                const actionThresholds = parseJson(stocksApiResponse.data)

                //Update the searches table
                searchesApi.insert({
                    user_id: req.headers.user.id,
                    ticker: req.params.ticker,
                    new_response: 0,
                    response: JSON.stringify(actionThresholds)
                }).then(_ => {

                    //Send the cached data response to the client
                    res.status(200).send({
                        ticker: req.params.ticker,
                        actionThresholds
                    });
                })

                //The undefined variable is automatically returned
                //It will ensure the rest of the .then() chain is skipped
                //Since cached data was server to the client it is all unnecessary
                return undefined;

            } else {

                //Else the stock is in the database but the cached data is older than 24 hours
                //Return the data science API response
                return dataScienceApi(req.params.ticker);
            }
        })
        .then(apiResponse => {

            
            //The response will be undefined if cached data was already returned to the client
            //If apiResponse.data is not an object, then the alpha vantage API limits have been reached.
            if (apiResponse !== undefined && typeof apiResponse.data === 'object') {

                //Update the stocks table with the response from data science
                const update = stocksApi.update(
                    req.params.ticker, {
                        data: JSON.stringify(apiResponse.data)
                    });

                //Insert the search into the search table
                const search = searchesApi.insert({
                    user_id: req.headers.user.id,
                    ticker: req.params.ticker,
                    new_response: 1,
                    response: JSON.stringify(apiResponse.data)
                });

                //Wait for both promises to resolve
                Promise.all([update, search]).then(_ => {

                    //Then get the applicable stock's updated row
                    return stocksApi.getByTicker(req.params.ticker);

                }).then(({
                    data
                }) => {

                    
                    //parseJson() is necessary because of differences in SQLITE and Postgres
                    //Postgres will break if JSON.parse is used, and Sqlite will break if it's not used
                    const actionThresholds = parseJson(data);

                    res.status(200).send({
                        ticker: req.params.ticker,
                        actionThresholds
                    });
                })
            }

            //If the response is not undefined and not an object
            //Then the alpha vantage API limits have probably been reached
            //Send error to the client
            else if (apiResponse !== undefined) {
                res.status(500).send({
                    message: 'Alpha Vantage Rate Limited'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message: 'Internal Server Error'
            });
        });
});

router.get('/', (req, res) => {

    //Get all stocks
    stocksApi.getAll()
        .then(stocksApiResponse => {

            //Map over each and parse if necessary
            const responseWithParsedJSON = stocksApiResponse.map(({
                id,
                ticker,
                created_at,
                updated_at,
                data
            }) => {

                //parseJson() is necessary because of differences in SQLITE and Postgres
                //Postgres will break if JSON.parse is used, and Sqlite will break if it's not used
                const actionThresholds = parseJson(data);

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
            console.log(err);
            res.status(500).send({
                message: 'Internal Server Error'
            });
        });
});

module.exports = router;

//The following code is necessary because of differences in SQLITE and Postgres
//Postgres will break if JSON.parse is used, and Sqlite will break if it's not used
function parseJson(data) {

    //If using sqlite3
    if (process.env.DB_ENV === 'development' || process.env.DB_ENV === 'testing') {
        //Then use JSON.parse()
        return JSON.parse(data);
    } else {
        return data;
    }

}