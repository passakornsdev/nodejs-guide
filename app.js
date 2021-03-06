const http = require('http');

const express = require('express');

//create express app
const app = express();

app.use((req, res, next) => {
    console.log('In the middleware');
    next(); // continue to next middleware
});

app.use((req, res, next) => {
    console.log('In the another middleware');
    res.send('<h1>hello from express! </h1>');
});

const server = http.createServer(app);

server.listen(3000);
