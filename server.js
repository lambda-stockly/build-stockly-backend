const express = require('express');
const cors = require('cors');
const helmet = require('helmet')
const authRouter = require('./config/authRouter');
const stocksRouter = require('./config/stocksRouter');
const server = express();

server.use(cors());
server.use(helmet());
server.use(express.json());
server.use('/auth', authRouter);
server.use('/stocks', stocksRouter);

module.exports = server;