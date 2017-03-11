// Free DM, a Dungeon Master management Utility
// Copyright (C) 2017  Onyx Zero Software

var app = angular.module('FreeDM.controllers', []);

app.controller('PlayerController',
function($scope, $window, FreeDMService) {
  $scope.gamecode = $window.sessionStorage.gamecode;
  $scope.gamename = $window.sessionStorage.gamename;

  $scope.name = $window.sessionStorage.name;
  $scope.maxHealth = $window.sessionStorage.maxHealth;
  $scope.currentHealth = $window.sessionStorage.currentHealth;
  $scope.ac = $window.sessionStorage.ac;

  $scope.getInfo = function(code, player) {
    FreeDMService.playerJoin(code, player, false)
    .then(function(response) {
      if (response.status === 200 && $scope.editing === false) {
        $scope.name = response.data.name;
        $scope.maxHealth = response.data.maxHealth;
        $scope.currentHealth = response.data.currentHealth;
        $scope.ac = response.data.ac;
        $window.sessionStorage.maxHealth = $scope.maxHealth;
        $window.sessionStorage.currentHealth = $scope.currentHealth;
        $window.sessionStorage.ac = $scope.ac;
      }
    });
  };

  $scope.editInfo = function() {
    FreeDMService.savePlayer($scope.gamecode,
      {name: $scope.name, maxHealth: $scope.maxHealth, ac: $scope.ac})
    .then(function(response) {
      if (response.status === 200 && $scope.editing === false) {
        $scope.maxHealth = response.data.maxHealth;
        $scope.currentHealth = response.data.currentHealth;
        $scope.ac = response.data.ac;
        $window.sessionStorage.maxHealth = $scope.maxHealth;
        $window.sessionStorage.currentHealth = $scope.currentHealth;
        $window.sessionStorage.ac = $scope.ac;
      }
    });
  };

  // fill player info in a loop
  $scope.loop = $window.setInterval(function() {
    $scope.getInfo($scope.gamecode, $scope.name);
  }, 5000);
});

app.controller('DMController',
function($scope, $window, FreeDMService) {
  $scope.gamename = $window.sessionStorage.gamename;
  $scope.gamecode = $window.sessionStorage.gamecode;
  $scope.allplayers = $window.sessionStorage.allplayers;

  $scope.refreshPlayers = function() {
    FreeDMService.getAllPlayers($scope.gamename)
    .then(function(response) {
      if (response.status === 200) {
        $scope.allplayers = response.data;
        $window.sessionStorage.players = $scope.allplayers;
      }
    });
  };

  $scope.damage = function(index, amount) {
    FreeDMService
    .damagePlayer($scope.gamecode, $scope.allplayers[index].name, amount)
    .then(function(response) {
      if (response.status === 200) {
        $scope.refreshPlayers();
      }
    });
  };

  $scope.heal = function(index, amount) {
    FreeDMService
    .healPlayer($scope.gamecode, $scope.allplayers[index].name, amount)
    .then(function(response) {
      if (response.status === 200) {
        $scope.refreshPlayers();
      }
    });
  };

  $scope.refreshPlayers();
});

app.controller('LoginController',
function($scope, $window, $location, FreeDMService) {
  $scope.allgames = $window.sessionStorage.allgames;
  $scope.code = $window.sessionStorage.gamecode || '';
  $scope.name = $window.sessionStorage.name || '';
  $scope.newplayer = false;
  $scope.dm = false;

  $scope.playerJoin = function() {
    FreeDMService.playerJoin($scope.code, $scope.name, $scope.newplayer)
    .then(function(response) {
      if (response.status === 200) {
        $window.sessionStorage.name = response.data.name;
        $window.sessionStorage.maxHealth = response.data.maxHealth;
        $window.sessionStorage.currentHealth = response.data.currentHealth;
        $window.sessionStorage.ac = response.data.ac;
        $window.sessionStorage.gamename = response.data.game;
        $window.sessionStorage.gamecode = $scope.code;

        $window.location = '/freedm/player_home';
      } else if (response.status === 400) {
        $window.alert("That Player Does not exist unfortunately");
      }
    });
  };

  $scope.dmGame = function(index) {
    $window.sessionStorage.gamecode = $scope.allgames[index].code;
    $window.sessionStorage.gamename = $scope.allgames[index].name;
    console.log($scope.allgames[index]);
    $window.location = '/freedm/dm_home';
  };

  $scope.createGame = function() {
    FreeDMService.createGame($scope.g_code, $scope.g_name)
    .then(function(response) {
      if (response.status === 200) {
        $window.sessionStorage.gamecode = $scope.g_code;
        $window.sessionStorage.gamename = $scope.g_name;

        console.log("Creation Success");
        $window.location = '/freedm/dm_home';
      } else {
        console.error(response);
        $window.alert("Uh Oh...");
      }
    });
  };

  FreeDMService.getAllGames().then(function(response) {
    if (response.status === 200) {
      $scope.allgames = response.data;
    }
  });
});
