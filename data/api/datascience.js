const axios = require('axios');
module.exports = ticker => axios.post(`https://dsstockly.herokuapp.com/api?ticker=${ticker}`);

    // Can be used if data science API is down
    // Promise.resolve({
    //     data: {
    //         "TA": {
    //             "sell": 0.28,
    //             "hold": 0.52,
    //             "buy": 0.2
    //         },
    //         "Sentiment": {
    //             "sell": 0.5,
    //             "hold": 0.25,
    //             "buy": 0.25
    //         }
    //     }
    // });