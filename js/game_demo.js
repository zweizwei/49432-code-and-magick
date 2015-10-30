/* global Game: true */

'use strict';

define([
  'game'
], function(Game) {

  /**
   * @type {Element}
   */
  var clouds = document.querySelector('.header-clouds');

  /**
   * @type {Element}
   */
  var gameRect = document.querySelector('.demo');

  /**
   * проверяет, находится ли контейнер чего-либо в пределах вьюпорта
   * @param {Element} container
   * @boolean
   */

  function isContainerInTheWindow(container) {
    return container.getBoundingClientRect().bottom > 0;
  }

  /**
   * Делает ивент 'остановить паралакс для облачков'
   */

  function turnCloudsParallaxOff() {
    window.dispatchEvent(new CustomEvent('stopParallax'));
  }

  /**
   * Делает ивент 'начать паралакс для облачков'
   */

  function showClouds() {
    window.dispatchEvent(new CustomEvent('startParallax'));
  }

  /**
   * Делает ивент 'поставить игру на паузу'
   */

  function stopGame() {
    window.dispatchEvent(new CustomEvent('stopGame'));
  }

  /**
   * Делает ивент 'снова начать игру'
   */

  function startGame() {
    window.dispatchEvent(new CustomEvent('startGame'));
  }

  /**
   * Двигает облачка
   */

  function cloudsPosition() {
    clouds.style.backgroundPosition = '-' + scrollY / 10 + '%' + '0%';
  }

  /**
   * Убирает listener скролла и параллакс если контейнер параллакса не видно
   */

  function stopParallax() {
    window.removeEventListener('scroll', cloudsPosition);
  }

  /**
   * Возвращает listener скролла и параллакс если контейнер параллакса видно
   */

  function startParallax() {
    window.addEventListener('scroll', cloudsPosition);
  }


  /**
   * Инициализирует проверку параллакса
   * для всех объектов которые его используют
   */

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

  /**
   * Инициализирует старт игры (Game)
   * отслеживает, находится ли контейнер с игрой в видмпой части экрана
   * выключает игру если ее не видно - и включает когда видно
   */

  function init() {

    /**
     * Новая Игра
     * @type {Game}
     */

    var game = new Game(document.querySelector('.demo'));

    game.initializeLevelAndStart();
    game.setGameStatus(Game.Verdict.INTRO);

    /**
     * таймаут для проверки паралалкса
     * @type {number}
     */
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


});
