const express = require('express');
const cors = require('cors');
const helmet = require('helmet')
const authRouter = require('./authRouter');
const server = express();

server.use(cors());
server.use(helmet());
server.use(express.json());
server.use('/auth', authRouter);

module.exports = server;