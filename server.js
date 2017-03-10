const express = require('express');
const morgan = require('morgan');
const httpstatus = require('http-status-codes');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const serveStatic = require('serve-static');
const compression = require('compression');

// connect mongoose to the database
mongoose.connect('mongodb://localhost:27017/freeDM');

// files that manipulate the database
const manager = require('manager');

// instantiate express
var app = express();

// morgan allows us to view a log of requests
app.use(morgan('combined'));
// body parser allows us to parse body,header,and url of request
app.use(bodyParser.json());
// disable caching, allows multiple consecutive accesses of same data
app.disable('etag');
// enable express to use compression
app.use(compression());

app.route('/')
.get(function(req, res) {
  // display list of games
  manager.getAllGames(function(games) {
    res.send(games);
  });
});

module.exports = app;
