
'use strict';

define(function() {

  /**
   * @type {Object.<string, string>}
   */

  var ratingClassName = {
    '4': 'review-rating-one',
    '5': 'review-rating-two',
    '6': 'review-rating-three',
    '7': 'review-rating-four',
    '8': 'review-rating-five'
  };

  /**
   * @const
   * @type {number}
   */

  var PICTURE_SIDE_SIZE = 124;

  /**
   * Конструктор объекта Review. Создает новый объект типа Review,
   * фильтрует данные полученные из файла,
   * грузит данные о review в html шаблон,
   * осуществляет постраничный вывод Review по клику на кнопку
   * @param {Element} container
   * @constructor
   */

  var Review = function(data) {
    this._data = data;
    this.element = null;
  };

  /**
   * Отрисовка одного Review
   * клонирует html шаблон для вывода ревью из элемента
   * записывает полученные данные description в текст описания
   * создает новый элемент картинка, проставляет ему размеры,
   * записывает адрес для показа картинки в src
   * проставляет размеры контейнера картинки
   * добавляет в дом дерево клонированную ноду
   * @param {Element} container
   *
   */


  Review.prototype.render = function(container) {
    var reviewTemplate = document.getElementById('review-template');
    var newReviewElement = reviewTemplate.content.children[0].cloneNode(true);

    newReviewElement.querySelector('.review-rating').classList.add(ratingClassName[this._data.rating]);
    newReviewElement.querySelector('.review-text').textContent = this._data.description;

    if (this._data.author.picture) {
      var authorPicture = new Image();
      authorPicture.src = this._data.author.picture;

      authorPicture.addEventListener('load', function() {
        newReviewElement.replaceChild(authorPicture, newReviewElement.childNodes[1]);
        authorPicture.classList.add('review-author');
        authorPicture.width = PICTURE_SIDE_SIZE;
        authorPicture.height = PICTURE_SIDE_SIZE;
      });


      authorPicture.addEventListener('error', function() {
        newReviewElement.classList.add('review-load-failure');
      });

      container.appendChild(newReviewElement);

      this.element = newReviewElement;
    }
  };

  /**
   * разотрисовка одного Review
   * убирает ноды review из дом дерева если нужно его очистить
   * @param {Element} container
   *
   */

  Review.prototype.unrender = function() {
    this.element.parentNode.removeChild(this.element);
    this.element = null;
  };

  return Review;

});

