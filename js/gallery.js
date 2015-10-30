/* global Gallery: true */

'use strict';

define(function() {

  /**
   * Список констант кодов нажатых клавиш для обработки
   * клавиатурных событий.
   * @enum {number}
   */

  var key = {
    'LEFT': 37,
    'RIGHT': 39,
    'ESC': 27
  };


  /**
   * Функция, "зажимающая" переданное значение value между значениями
   * min и max. Возвращает value которое будет не меньше min
   * и не больше max.
   * @param {number} value
   * @param {number} min
   * @param {number} max
   * @return {number}
   */

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Конструктор объекта фотогалереи. Создает свойства, хранящие ссылки на элементы
   * галереи, служебные данные (номер показанной фотографии и список фотографий)
   * и фиксирует контекст у обработчиков событий.
   * @constructor
   */

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

  /**
   * Показывает фотогалерею, убирая у контейнера класс hidden. Затем добавляет
   * обработчики событий и показывает текущую фотографию.
   */

  Gallery.prototype.show = function(src) {
    this._element.classList.remove('invisible');
    this._closeButton.addEventListener('click', this._onCloseButtonClick);
    this._leftButton.addEventListener('click', this._onLeftArrowClick);
    this._rightButton.addEventListener('click', this._onRightArrowClick);
    document.body.addEventListener('keydown', this._onDocumentKeyDown);

    this.setCurrentPhoto(this._photos.indexOf(src));
  };

  /**
   * Убирает фотогалерею и обработчики событий. Очищает служебные свойства.
   */

  Gallery.prototype.hide = function() {
    this._element.classList.add('invisible');
    this._closeButton.removeEventListener('click', this._onCloseButtonClick);
    this._leftButton.removeEventListener('click', this._onLeftArrowClick);
    this._rightButton.removeEventListener('click', this._onRightArrowClick);
    document.body.removeEventListener('keyDown', this._onDocumentKeyDown);

    this._currentPhoto = 0;
  };

  /**
   * Записывает список фотографий.
   * @param {Array.<string>} photos
   */

  Gallery.prototype.setPhotos = function(photos) {
    this._photos = photos;
  };

  /**
   * Обработчик события клика по крестику закрытия. Вызывает метод hide.
   * @param {Event} evt
   * @private
   */

  Gallery.prototype._onCloseButtonClick = function(evt) {
    evt.preventDefault();
    this.hide();
  };

  /**
   * Обработчик события клика по стрелке влево.
   * @param {Event} evt
   * @private
   */

  Gallery.prototype._onLeftArrowClick = function(evt) {
    evt.preventDefault();
    this.setCurrentPhoto(this._currentPhoto - 1);
  };

  /**
   * Обработчик события клика по стрелке вправо.
   * @param {Event} evt
   * @private
   */

  Gallery.prototype._onRightArrowClick = function(evt) {
    evt.preventDefault();
    this.setCurrentPhoto(this._currentPhoto + 1);
  };

  /**
   * Обработчик клавиатурных событий. Прячет галерею при нажатии Esc
   * и переключает фотографии при нажатии на стрелки.
   * @param {Event} evt
   * @private
   */

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

  /**
   * Устанавливает номер фотографии, которую нужно показать, предварительно
   * "зажав" его между 0 и количеством фотографий в галерее минус 1 (чтобы нельзя
   * было показать фотографию номер -1 или номер 100 в массиве из четырех
   * фотографий), и показывает ее на странице.
   * @param {number} index
   */

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
