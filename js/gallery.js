(function() {

          var key = {
            'LEFT' : 37,
            'RIGHT' : 39,
            'ESC' : 27
      }

  var galleryContainer = document.querySelector('.photogallery');
  var galleryElement = document.querySelector('.overlay-gallery');
  var galleryClose = document.querySelector('.overlay-gallery-close');

      function hideGallery() {
            galleryElement.classList.add('invisible');
            galleryClose.removeEventListener('click', closeButton);
            document.body.removeEventListener('keydown', keyHandler);
          }

  function closeButton(evt) {
        evt.preventDefault();
        hideGallery();
      }

  function showGallery() {
        galleryElement.classList.remove('invisible');
        galleryClose.addEventListener('click', closeButton);
        document.body.addEventListener('keydown', keyHandler);
      }

  function keyHandler(evt) {
        switch (evt.keyCode) {
              case key.LEFT :
                    console.log('left');
                    break;
                  case key.RIGHT :
                    console.log('right');
                    break;
                  case key.ESC :
                    hideGallery();
                    break;
                  default: break;
                }
      }

  galleryContainer.addEventListener('click', function(evt) {
        evt.preventDefault();

        if (evt.target.parentNode.classList.contains('photogallery-image')) {
              showGallery();
            }
      })

})();
