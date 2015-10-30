/**
 * Created by zweizwei on 27/09/15.
 */
/* global Review: true Gallery: true */

'use strict';

define([
  'review',
  'gallery'
], function(Review, Gallery) {

  /**
   * Константы, описывающие состояние ReadyState.
   * @enum {number}
   */

  var readyState = {
    'UNSENT': 0,
    'OPENED': 1,
    'HEADERS_RECEIVED': 2,
    'LOADING': 3,
    'DONE': 4
  };

  /**
   * Константа, через сколько объявить failure загрузки.
   * @const
   * @enum {number}
   */

  var REQUEST_FAILURE_TIMEOUT = 10000;

  /**
   * Константа, количество отзывов на страницу.
   * @const
   * @enum {number}
   */

  var PAGE_SIZE = 3;

  /**
   * Список отзывов (данные).
   * @type {Array}
   */

  var reviews;

  /**
   * Список Review (данные).
   * @type {Array}
   */

  var renderedReviews = [];

  /**
   * контейнер для отзывов.
   * @type {Element}
   */

  /**
   * Секция с reviews - контролы, список ревью, фильтрация.
   * @type {Array}
   */

  var reviewsSection = document.querySelector('reviews');

  var currentReviews;

  /**
   * текущая страница.
   * @type {number}
   */

  var currentPage = 0;

  /**
   * контейнер с reviews - только отзывы.
   * @type {Element}
   */

  var reviewsContainer = document.querySelector('.reviews-list');

  /**
   * Выводит на страницу список отзывов постранично.
   * @param {Array.<Object>} reviewsToRender
   * @param {number} pageNumber
   * @param {boolean=} replace
   */


  function renderReviews(reviewsToRender, pageNumber, replace) {

    replace = typeof replace !== 'undefined' ? replace : true;

    pageNumber = pageNumber || 0;
    var reviewsFrom = pageNumber * PAGE_SIZE;
    var reviewsTo = reviewsFrom + PAGE_SIZE;
    reviewsToRender = reviewsToRender.slice(reviewsFrom, reviewsTo);


    var reviewsFragment = document.createDocumentFragment();

    if (replace) {
      var el;
      while ((el = renderedReviews.shift())) {
        el.unrender();
      }
    }


    if (typeof reviewsToRender === 'object') {
      reviewsToRender.forEach(function(reviewData) {
        var newReviewElement = new Review(reviewData);
        newReviewElement.render(reviewsFragment);
        renderedReviews.push(newReviewElement);
      });

      reviewsContainer.appendChild(reviewsFragment);
    }

  }

  /**
   * Добавляет класс ошибки контейнеру с отзывами. Используется в случае
   * если произошла ошибка загрузки отелей или загрузка прервалась
   * по таймауту.
   */

  function showFailure() {
    reviewsSection.classList.add('reviews-load-failure');
  }

  /**
   * Загрузка списка отелей. После успешной загрузки вызывается функция
   * callback, которая передается в качестве аргумента.
   * @param {function} callback
   */

  function loadReviews(callback) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = REQUEST_FAILURE_TIMEOUT;
    xhr.open('get', 'data/reviews.json');
    xhr.send();

    xhr.onreadystatechange = function(evt) {
      var loadedXhr = evt.target;

      switch (loadedXhr.readyState) {
        case readyState.OPENED:
          reviewsContainer.classList.add('reviews-list-loading');
          break;

        case readyState.DONE:
          if (loadedXhr.status === 200) {
            var data = loadedXhr.response;
            reviewsContainer.classList.remove('reviews-list-loading');
            reviewsContainer.classList.remove('reviews-load-failure');
            callback(JSON.parse(data));
          }

          if (loadedXhr.status > 400) {
            showFailure();
          }
          break;
        default :
          break;
      }
    };
    xhr.ontimeout = function() {
      showFailure();
    };
  }

  /**
   * Фильтрация списка отзывов. Принимает на вход список отелей
   * и ID фильтра. В зависимости от переданного ID применяет
   * разные алгоритмы фильтрации. Возвращает отфильтрованный
   * список и записывает примененный фильтр в адресную строку.
   * Не изменяет исходный массив.
   * @param {Array.<Object>} reviewToFilter
   * @param {string} filterID
   * @return {Array.<Object>}
   */

  function filterReviews(reviewsToFilter, filterID) {

    var filteredReviews = reviewsToFilter.slice(0);

    switch (filterID) {
      case 'reviews-recent':
        filteredReviews = reviews.filter(function(obj) {
          var reviewDate = new Date(obj.date);
          var recentDate = new Date('2015-04-02');
          return reviewDate >= recentDate;
        });
        filteredReviews.sort(function(a, b) {
          return Date.parse(b.date) - Date.parse(a.date);
        });
        break;

      case 'reviews-good' :
        filteredReviews = reviews.filter(function(obj) {
          return obj.rating >= 3;
        });
        filteredReviews.sort(function(a, b) {
          return b.rating - a.rating;
        });
        break;

      case 'reviews-bad' :
        filteredReviews = reviews.filter(function(obj) {
          return obj.rating <= 2;
        });
        filteredReviews.sort(function(a, b) {
          return a.rating - b.rating;
        });
        break;

      case 'reviews-popular' :
        filteredReviews = reviews.sort(function(a, b) {
          return b['review-rating'] - a['review-rating'];
        });
        break;

      case 'reviews-all':
      default :
        filteredReviews = reviews.slice(0);
        break;
    }
    return filteredReviews;
  }

  /**
   * Вызывает функцию фильтрации на списке отелей с переданным fitlerID
   * и подсвечивает кнопку активного фильтра.
   * @param {string} filterID
   */

  function setActiveFilter(filterID) {
    currentPage = 0;
    currentReviews = filterReviews(reviews, filterID);
    renderReviews(currentReviews, currentPage, true);
  }

  /**
   * Инициализация подписки на клики по кнопкам фильтра.
   * Используется делегирование событий: события обрабатываются на объекте,
   * содержащем все фильтры, и в момент наступления события, проверяется,
   * произошел ли клик по фильтру или нет и если да, то вызывается функция
   * установки фильтра.
   */

  function initFilters() {
    var filtersContainer = document.querySelector('.reviews-filter');
    filtersContainer.addEventListener('click', function(evt) {
      var clickedFilter = evt.target;
      location.hash = 'filters/' + clickedFilter.id;
    });
  }

  /**
   * Проверяет можно ли отрисовать следующую страницу списка отелей.
   * @return {boolean}
   */

  function isNextPageAvailable() {
    return currentPage < Math.ceil(reviews.length / PAGE_SIZE);
  }

  var moreReviews = document.querySelector('.reviews-controls-more');
  moreReviews.addEventListener('click', function() {
    if (isNextPageAvailable()) {
      renderReviews(currentReviews, ++currentPage, false);
    }
  });

  /**
   * Получает значение адресной строки после #.
   * Сравнивает ее с заданным значением
   * Записывает подходящие после сравнения данные в новый массив
   * выбирает из массива значение без пути
   * записывает его в filterID (текущий фильтр) и устанавливает фильтрацию
   * по выбранному фильтру
   * @return {boolean}
   */

  function parseUrl() {
    var match = /^#filters\/(\S+)$/;
    var parsedUrl = location.hash.match(match);
    var filterId;
    if (parsedUrl) {
      filterId = parsedUrl[1];
    } else {
      filterId = 'reviews-all';
    }

    setActiveFilter(filterId);
  }

  window.addEventListener('hashchange', function() {
    parseUrl();
  });

  loadReviews(function(loadedReviews) {
    reviews = loadedReviews;
    parseUrl();
  });
  initFilters();

  var galleryContainer = document.querySelector('.photogallery');
  var gallery;

  /**
   * Добавляет обработчик события клика по картинке для открытия галереи
   * При наступлении этого события, показывает фотогалерею и загружает в нее фотографии,
   * фотографии выбираются из блока галлереи на страницы
   */

  function initGallery() {
    galleryContainer.addEventListener('click', function(evt) {
      if (evt.target.parentNode.classList.contains('photogallery-image')) {
        var currentImage = evt.target.src;
        if (!gallery) {
          gallery = new Gallery();
          var images = document.querySelectorAll('.photogallery-image img');
          var photos = [];
          for (var i = 0; i < images.length; i++) {
            photos.push(images[i].src);
          }
          gallery.setPhotos(photos);
        }
        gallery.show(currentImage);
      }
    });
  }

  initGallery();

});
