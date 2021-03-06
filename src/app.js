'use strict';

require('dotenv').config();
const express = require('express')
const bodyParser = require("body-parser");
const routerAuth = require('./routes/auth');
const routerUser = require('./routes/user');
const routerBus = require('./routes/bus');
const routerTicket = require('./routes/ticket');
const routerPassenger = require('./routes/passenger');
const extract_token_info = require('./middlewares/extract_token_info');
const path = require('path');
const cors = require('cors');
const jwt = require('express-jwt');

const app = express();

app.use(cors())
app.use(`/${process.env.APP_STORAGE}`, express.static(path.join(__dirname, `../${process.env.APP_STORAGE}`)));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  jwt({
    secret: process.env.APP_JWT_SECRET,
    algorithms: ['HS256']
  })
  .unless({path: [
    '/',
    { url: '/auth/login', methods: ['POST'] },
    { url: '/user', methods: ['POST'] },
    { url: '/user/avatar', methods: ['POST'] },
    { url: '/user/all', methods: ['GET'] }
  ]})
);

app.use(extract_token_info);

app.use('/auth', routerAuth);
app.use('/user', routerUser);
app.use('/bus', routerBus);
app.use('/passenger', routerPassenger);
app.use('/ticket', routerTicket);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/README.html'));
});

module.exports = app;
