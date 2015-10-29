/* global Gallery: true */

'use strict';

define(function() {

  var key = {
    'LEFT': 37,
    'RIGHT': 39,
    'ESC': 27
  };


  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }


  var Gallery = function() {
    this._element = document.querySelector('.overlay-gallery');
    this._closeButton = this._element.querySelector('.overlay-gallery-close');
    this._leftButton = this._element.querySelector('.overlay-gallery-control-left');
    this._rightButton = this._element.querySelector('.overlay-gallery-control-right');
    this._pictureElement = this._element.querySelector('.overlay-gallery-preview');

    this._photos = [];
    this._currentPhoto = 0;

    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._onLeftArrowClick = this._onLeftArrowClick.bind(this);
    this._onRightArrowClick = this._onRightArrowClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
  };

  Gallery.prototype.show = function(src) {
    this._element.classList.remove('invisible');
    this._closeButton.addEventListener('click', this._onCloseButtonClick);
    this._leftButton.addEventListener('click', this._onLeftArrowClick);
    this._rightButton.addEventListener('click', this._onRightArrowClick);
    document.body.addEventListener('keydown', this._onDocumentKeyDown);

    this.setCurrentPhoto(this._photos.indexOf(src));
  };

  Gallery.prototype.hide = function() {
    this._element.classList.add('invisible');
    this._closeButton.removeEventListener('click', this._onCloseButtonClick);
    this._leftButton.removeEventListener('click', this._onLeftArrowClick);
    this._rightButton.removeEventListener('click', this._onRightArrowClick);
    document.body.removeEventListener('keyDown', this._onDocumentKeyDown);

    this._currentPhoto = 0;
  };

  Gallery.prototype.setPhotos = function(photos) {
    this._photos = photos;
  };

  Gallery.prototype._onCloseButtonClick = function(evt) {
    evt.preventDefault();
    this.hide();
  };

  Gallery.prototype._onLeftArrowClick = function(evt) {
    evt.preventDefault();
    this.setCurrentPhoto(this._currentPhoto - 1);
  };

  Gallery.prototype._onRightArrowClick = function(evt) {
    evt.preventDefault();
    this.setCurrentPhoto(this._currentPhoto + 1);
  };

  Gallery.prototype._onDocumentKeyDown = function(evt) {
    switch (evt.keyCode) {
      case key.LEFT :
        this.setCurrentPhoto(this._currentPhoto - 1);
        break;
      case key.RIGHT :
        this.setCurrentPhoto(this._currentPhoto + 1);
        break;
      case key.ESC :
        this.hide();
        break;
    }
  };

  Gallery.prototype.setCurrentPhoto = function(index) {


    index = clamp(index, 0, this._photos.length - 1);

    this._currentPhoto = index;
    var previewNumberContainer = this._pictureElement.children[0].cloneNode(true);
    var numberCurrent = previewNumberContainer.querySelector('.preview-number-current');
    var numberTotal = previewNumberContainer.querySelector('.preview-number-total');
    numberCurrent.textContent = this._currentPhoto + 1;
    numberTotal.textContent = this._photos.length;

    this._pictureElement.innerHTML = '';

    var imageElement = new Image();
    imageElement.src = this._photos[this._currentPhoto];
    imageElement.onload = function() {
      this._pictureElement.appendChild(previewNumberContainer);
      this._pictureElement.appendChild(imageElement);
    }.bind(this);

  };

  return Gallery;

});
