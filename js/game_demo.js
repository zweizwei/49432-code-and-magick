'use strict';

(function() {

  var clouds = document.querySelector('.header-clouds');
  var gameRect = document.querySelector('.demo');


  function isContainerInTheWindow(container) {
    return container.getBoundingClientRect().bottom > 0;
  }

  function turnCloudsParallaxOff() {
    window.dispatchEvent(new CustomEvent('stopParallax'));
  }

  function showClouds() {
    window.dispatchEvent(new CustomEvent('startParallax'));
  }

  function stopGame() {
    window.dispatchEvent(new CustomEvent('stopGame'));
  }

  function startGame() {
    window.dispatchEvent(new CustomEvent('startGame'));
  }


  function cloudsPosition() {
    clouds.style.backgroundPosition = '-' + scrollY / 10 + '%' + '0%';
  }

  function stopParallax() {
    window.removeEventListener('scroll', cloudsPosition);
  }

  function startParallax() {
    window.addEventListener('scroll', cloudsPosition);
  }

  function checkParallax() {

    if (isContainerInTheWindow(clouds)) {
      showClouds();
    } else {
      turnCloudsParallaxOff();
    }

    if (isContainerInTheWindow(gameRect)) {
      startGame();
    } else {
      stopGame();
    }
  }

  function init() {

    var game = new Game(document.querySelector('.demo'));

    game.initializeLevelAndStart();
    game.setGameStatus(Game.Verdict.INTRO);


    var scrollTimeout;

    window.addEventListener('scroll', function() {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(checkParallax, 100);
    });

    window.addEventListener('startParallax', function() {
      startParallax();

    });


    window.addEventListener('stopParallax', function() {
      stopParallax();
    });

    window.addEventListener('startGame', function() {
      game.setGameStatus(Game.Verdict.CONTINUE);
    });

    window.addEventListener('stopGame', function() {
      game.setGameStatus(Game.Verdict.PAUSE);
    });

  }

  init();


})();
