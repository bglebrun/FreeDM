// Free DM, a Dungeon Master management Utility
// Copyright (C) 2017  Onyx Zero Software
var app = require('./lib/server');
// Free DM is a simple open source DM tool for managing a campaign
// It provides a simple to use web interface with which to apply damage,
// and manage player's health, stats, etc.
// It provides players a simple dice rolling protocol, along with a simple healing interface

app.listen(80, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('APP IS LISTENING ON INSECURE SERVER');
  }
});
