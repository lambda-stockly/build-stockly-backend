const express = require('express');
const authRouter = require('./authRouter');
const server = express();

server.use(express.json());
server.use('/auth', authRouter);

module.exports = server;