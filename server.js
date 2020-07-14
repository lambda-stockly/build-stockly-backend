const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const auth = require('./middleware/auth');
const authRouter = require('./config/authRouter');
const stocksRouter = require('./config/stocksRouter');
const favoritesRouter = require('./config/favoritesRouter');
const topRouter = require('./config/topRouter');
const server = express();

const whitelist = [
  'https://app.getstockly.com',
  'https://stockly.netlify.app',
  'http://localhost:3000',
];

const corsOptions = {
  origin: function (origin, callback) {
    // checking for `!origin` allows requests from REST tools
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

server.use(cors(corsOptions));
server.use(helmet());
server.use(express.json());
server.use('/auth', authRouter);
server.use('/stocks', auth, stocksRouter);
server.use('/favorites', auth, favoritesRouter);
server.use('/top', auth, topRouter);

module.exports = server;
