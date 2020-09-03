const express = require('express');
const server = express();
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const authenticate = require('../auth/auth-middleware');

const usersRouter = require('../users/users-router');
const authRouter = require('../auth/auth-router');
const db = require('../data/connection');

const sessionConfiguration = {
    name: 'session',
    secret: process.env.SESSION_SECRET || 'keep it secret, keep it safe!',
    cookie: {
        maxAge: 1000 * 60 * 10,
        secure: process.env.USE_SECURE_COOKIES || false,
        httpOnly: true,
    },
    resave: false,
    saveUninitialized: true,
    store: new KnexSessionStore({
        knex: db,
        tablename: 'session',
        sidfieldname: 'sid',
        createtable: true,
        clearInterval: 1000 * 60 * 30,
    })
}

server.use(session(sessionConfiguration));
server.use(express.json());

server.use('/api/users', authenticate, usersRouter);
server.use('/api/auth', authRouter);

server.get('/', (req, res) => {
    res.status(200).json({ message: 'api up' });
})

module.exports = server;