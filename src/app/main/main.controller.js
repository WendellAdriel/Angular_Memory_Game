(function() {
  'use strict';

  angular
    .module('memoryGameAngular')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($scope, $timeout) {

    $scope.numberRows = 6;
    $scope.numberColumns = 6;
    $scope.numberMatches = ($scope.numberRows * $scope.numberColumns) / 2;

    $scope.openSession = false;
    $scope.guarding = true;
    $scope.gameOn = false;
    $scope.finished = false;

    $scope.answers = null;
    $scope.cardsDeck = null;
    $scope.previousCard = null;
    $scope.pairsMade = 0;

    $scope.timer = null;
    $scope.moves = 0;
    $scope.timePassed = 0;

    $scope.randomize = function() {
      var pool = [];
      var answers = [];
      var items = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
        'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'W', 'Y', 'Z'];

      for (var i = 0; i < $scope.numberMatches; i++) {
        pool.push(i);
      }

      for (var j = 0; j < $scope.numberMatches; j++) {
        var randomNumber = Math.floor((Math.random() * items.length));
        var selectedItem = items[randomNumber];
        items.splice(randomNumber, 1);

        for (var k = 0; k < 2; k++) {
          var poolRandom = Math.floor((Math.random() * pool.length));
          answers.splice(pool[poolRandom], 0, selectedItem);
          pool.splice(poolRandom, 1);
        }
      }
      $scope.answers = answers;
    };

    $scope.createCardsDeck = function() {
      var deck = {
        'rows' : []
      };
      $scope.randomize();
      console.log($scope.answers);

      for (var i = 0; i < $scope.numberRows; i++) {
        var row = {};
        row.cards = [];

        for (var j = 0; j < $scope.numberColumns; j++) {
          var card = {};
          var randomNumber = Math.floor((Math.random() * $scope.answers.length));
          var randomItem = $scope.answers[randomNumber];
          card.faceUp = false;
          card.item = randomItem;
          $scope.answers.splice(randomNumber, 1);
          row.cards.push(card);
        }
        deck.rows.push(row);
      }
      $scope.cardsDeck = deck;
    };

    $scope.checkCard = function(card) {
      if ($scope.openSession && $scope.previousCard != card &&
        $scope.previousCard.item == card.item && !card.faceUp) {
          card.faceUp = true;
          $scope.previousCard = null;
          $scope.openSession = false;
          $scope.pairsMade++;
          $scope.moves++;
        } else if ($scope.openSession && $scope.previousCard != card &&
            $scope.previousCard.item != card.item && !card.faceUp) {
              $scope.guarding = true;
              card.faceUp = true;
              $scope.openSession = false;
              $timeout(function() {
                $scope.previousCard.faceUp = card.faceUp = false;
                $scope.previousCard = null;
                $scope.guarding = false;
                $scope.moves++;
              }, 700);
            } else {
              card.faceUp = true;
              $scope.openSession = true;
              $scope.previousCard = card;
            }
      if ($scope.pairsMade == $scope.numberMatches) {
        $scope.stopTimer();
      }
    };

    $scope.startTimer = function() {
      $scope.timePassed += 1000;
      $scope.timer = $timeout($scope.startTimer, 1000);
    };

    $scope.stopTimer = function() {
      $timeout.cancel($scope.timer);
  	  $scope.gameOn = false;
  	  $scope.previousCard = null;
  	  $scope.openSession = false;
  	  $scope.pairsMade = 0;
      $scope.cardsDeck = null;
      $scope.finished = true;
    };

    $scope.startGame = function() {
      $scope.finished = false;
      $scope.createCardsDeck();
      $scope.moves = 0;
      $scope.timePassed = 0;
      $scope.guarding = false;
      $scope.gameOn = true;
      $scope.startTimer();
    };
  }
})();
