'use strict';

(function() {

  var clouds = document.querySelector('.header-clouds');


  function isContainerInTheWindow() {
    return clouds.getBoundingClientRect().bottom > 0;
  }

  function turnCloudsParallaxOff() {
    window.dispatchEvent(new CustomEvent('stopParallax'));
  }

  function showClouds() {
    window.dispatchEvent(new CustomEvent('startParallax'));
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

    if (isContainerInTheWindow()) {
      console.log('start showing clouds');
      showClouds();
    } else {
      console.log('stop showing clouds');
      turnCloudsParallaxOff();
    }
  }

  function initScroll() {

    var scrollTimeout;

    window.addEventListener('scroll', function() {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(checkParallax, 100);
    });

    window.addEventListener('startParallax', startParallax);
    window.addEventListener('stopParallax', stopParallax);

  }


  initScroll();

})();
