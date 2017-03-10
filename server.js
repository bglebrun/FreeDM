const express = require('express');
const morgan = require('morgan');
const httpstatus = require('http-status-codes');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Players = require('./models/player');
const Games = require('./models/game');
const serveStatic = require('serve-static');
const compression = require('compression');
const path = require('path');

// connect mongoose to the database
mongoose.connect('mongodb://localhost:27017/freeDM');

// files that manipulate the database
// const manager = require('manager');

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
app.use(helmet());

const webOptions = {
  index: ['enter.html', 'enter.html'],
  extensions: ['html', 'htm', 'js', 'css'],
  dotfiles: 'deny'
};

app.use(serveStatic(path.join(__dirname, '/static'), webOptions));

app.route('/all/games')
.get(function(req, res) {
  Games.find({}, function(err, games) {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send(games);
    }
  });
  // display list of games
  // manager.getAllGames(function(games) {
  //   res.send(games);
  // });
});

app.route('/all/players/:game')
.get(function(req, res) {
  Players.find({game: req.params.game}, function(err, players) {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send(players);
    }
  });
  // display list of games
  // manager.getAllGames(function(games) {
  //   res.send(games);
  // });
});

app.route('/create/game')
.post(function(req, res) {
  Games.create({name: req.body.name, code: req.body.code}, function(err, game) {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send(game);
    }
  });
  // display list of games
  // manager.getAllGames(function(games) {
  //   res.send(games);
  // });
});

app.route('/join/:gamecode')
.get(function(req, res) {
  var playername = req.query.name;
  var gamecode = req.params.gamecode;
  var newplayer = req.query.new !== 'false';

  Games.findOne({code: gamecode}, function(err, game) {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else if (game) {
      var gamename = game.name;
      Players
      .findOne({game: gamename, name: playername}, function(err, player) {
        if (err) {
          console.error(err);
          res.status(500).send(err);
        } else if (player) {
          // player exists, send info back
          res.send(player);
        } else if (newplayer === true) {
          // player does not exist, create player
          Players.create({
            name: playername,
            game: gamename
          }, function(err, player) {
            if (err) {
              console.error(err);
              res.status(500).send(err);
            } else {
              res.send(player);
            }
          });
        } else {
          console.log("Player DNE...");
          res.status(400).send("Player Does Not Exist...");
        }
      });
    } else {
      res.status(404).send();
    }
  });
});

app.route('/edit/player/:gamecode')
.put(function(req, res) {
  var update = {
    $set: {
      maxHealth: Number(req.body.player.maxHealth),
      ac: Number(req.body.player.ac)
    }
  };

  Games.findOne({code: req.params.gamecode}, function(err, game) {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else if (game) {
      console.log(game);
      Players.findOneAndUpdate({game: game.name, name: req.query.name},
        update,
        {new: true},
      function(err, player) {
        if (err) {
          console.error(err);
          res.status(500).send(err);
        } else {
          console.log(player);
          res.send(player);
        }
      });
    } else {
      console.log("Game not found");
      res.status(400).send();
    }
  });
});

app.route('/player/:gamecode')
.get(function(req, res) {
  Players.findOne({game: req.params.gamecode, name: req.query.name},
    function(err, player) {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        res.send(player);
      }
    });
});

module.exports = app;
