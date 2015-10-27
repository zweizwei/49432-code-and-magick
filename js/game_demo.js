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

  function initScroll() {

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
      console.log('i start game');
    });

    window.addEventListener('stopGame', function() {
      console.log('i stop game');
    });

  }

  initScroll();

})();
