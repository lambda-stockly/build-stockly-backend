const express = require('express');
const searchesApi = require('../data/api/searches');
const router = express.Router();

router.get('/', (req, res) => {

    searchesApi.getTopSearched()
        .then(stocksApiResponse => {
            const responseWithParsedJSON = stocksApiResponse.map(({
                id,
                ticker,
                created_at,
                updated_at,
                data
            },rank) => {

                let actionThresholds;
                if (process.env.DB_ENV === 'development' || process.env.DB_ENV === 'testing') {
                    actionThresholds = JSON.parse(data).actionThresholds;
                } else {
                    actionThresholds = data.actionThresholds;
                }

                return {
                    rank: rank+1,
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
            console.log(err)
            res.status(500).send({
                message: 'Internal Server Error'
            });
        });
});

module.exports = router;