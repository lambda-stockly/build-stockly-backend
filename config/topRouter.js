const express = require('express');
const searchesApi = require('../data/api/searches');
const router = express.Router();

router.get('/', (req, res) => {

    searchesApi.getTopSearched()
        .then(stocksApiResponse => {
            res.status(200).send(stocksApiResponse);
        })
        .catch(err => {
            res.status(500).send({
                message: 'Internal Server Error'
            });
        });
});

module.exports = router;