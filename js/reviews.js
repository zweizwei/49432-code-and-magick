/**
 * Created by zweizwei on 27/09/15.
 */
'use strict';

(function() {

  var readyState = {
    'UNSENT': 0,
    'OPENED': 1,
    'HEADERS_RECEIVED': 2,
    'LOADING': 3,
    'DONE': 4
  };

  var REQUEST_FAILURE_TIMEOUT = 10000;
  var PAGE_SIZE = 3;
  var reviews;
  var renderedReviews = [];
  var reviewsSection = document.querySelector('reviews');
  var currentReviews;
  var currentPage = 0;

  var reviewsContainer = document.querySelector('.reviews-list');

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

  function showFailure() {
    reviewsSection.classList.add('reviews-load-failure');
  }


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

  function setActiveFilter(filterID) {
    currentPage = 0;
    currentReviews = filterReviews(reviews, filterID);
    renderReviews(currentReviews, currentPage, true);
  }

  function initFilters() {
    var filtersContainer = document.querySelector('.reviews-filter');
    filtersContainer.addEventListener('click', function(evt) {
      var clickedFilter = evt.target;
      location.hash = 'filters/' + clickedFilter.id;
    });
  }

  function isNextPageAvailable() {
    return currentPage < Math.ceil(reviews.length / PAGE_SIZE);
  }

  var moreReviews = document.querySelector('.reviews-controls-more');
  moreReviews.addEventListener('click', function() {
    if (isNextPageAvailable()) {
      renderReviews(currentReviews, ++currentPage, false);
    }
  });

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



})();
