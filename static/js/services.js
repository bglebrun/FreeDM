// Free DM, a Dungeon Master management Utility
// Copyright (C) 2017  Onyx Zero Software

var app = angular.module('FreeDM.services', []);

app.factory('FreeDMService', function($http) {
  var api = {};
  const host = '/freedm';

// ************* getters ******************************//
  api.getPlayer = function(gamecode, name) {
    return $http({
      method: 'GET',
      url: host + '/player/' + gamecode + '?name=' + name
    });
  };

  api.getAllPlayers = function(gamecode) {
    return $http({
      method: 'GET',
      url: host + '/all/players/' + gamecode
    });
  };

  api.getAllGames = function() {
    return $http({
      method: 'GET',
      url: host + '/all/games/'
    });
  };
  // ************* setters ******************************//
  api.savePlayer = function(gamecode, player) {
    var name = player.name;
    return $http({
      method: 'PUT',
      url: host + '/edit/player/' + gamecode + '?name=' + name,
      data: {
        player: player
      }
    });
  };

  api.damagePlayer = function(gamecode, playername, amount) {
    return $http({
      method: 'PUT',
      url: host + '/damage/' + gamecode + '?name=' + playername,
      data: {
        amount: amount
      }
    });
  };

  api.healPlayer = function(gamecode, playername, amount) {
    return $http({
      method: 'PUT',
      url: host + '/heal/' + gamecode + '?name=' + playername,
      data: {
        amount: amount
      }
    });
  };

  api.createGame = function(code, name) {
    return $http({
      method: 'POST',
      url: host + '/create/game',
      data: {
        code: code,
        name: name
      }
    });
  };

// ************* login ********************************//
  api.playerJoin = function(code, name, isnewplayer) {
    return $http({
      method: 'GET',
      url: host + '/join/' + code + '?name=' + name + "&new=" + isnewplayer
    });
  };

  return api;
});
