const express = require('express');
const cors = require('cors');
const helmet = require('helmet')
const auth = require('./middleware/auth');
const authRouter = require('./config/authRouter');
const stocksRouter = require('./config/stocksRouter');
const favoritesRouter = require('./config/favoritesRouter');
const topRouter = require('./config/topRouter');
const server = express();

server.use(cors());
server.use(helmet());
server.use(express.json());
server.use('/auth', authRouter);
server.use('/stocks', auth, stocksRouter);
server.use('/favorites', auth, favoritesRouter);
server.use('/top', auth, topRouter);

module.exports = server;