/**
 * Created by zweizwei on 27/09/15.
 */

(function () {


  var readyState = {
    'UNSENT': 0,
    'OPENED': 1,
    'HEADERS_RECEIVED': 2,
    'LOADING': 3,
    'DONE': 4
  };

  var REQUEST_FAILURE_TIMEOUT = 10000;
  var FILTER_ID = 'filterID';


  var PAGE_SIZE = 3;
  var reviews;
  var renderedReviews = [];

  var currentReviews;
  var currentPage = 0;

  var reviewsContainer = document.querySelector('.reviews-list');

  function renderReviews(reviewsToRender, pageNumber, replace) {

    var reviewsContainer = document.querySelector('.reviews-list');

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


    if (typeof reviewsToRender == 'object') {
      reviewsToRender.forEach(function (reviewData, i) {

        var newReviewElement = new Review(reviewData);
        newReviewElement.render(reviewsFragment);
        renderedReviews.push(newReviewElement);
      });

      reviewsContainer.appendChild(reviewsFragment);
    }

  }


  function loadReviews(callback) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = REQUEST_FAILURE_TIMEOUT;
    xhr.open('get', 'data/reviews.json');
    xhr.send();

    xhr.onreadystatechange = function (evt) {
      var loadedXhr = evt.target;

      switch (loadedXhr.readyState) {
        case readyState.OPENED:
          reviewsContainer.classList.add('reviews-list-loading');
          break;

        case readyState.DONE:
          if (loadedXhr.status == 200) {
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
    xhr.ontimeout = function () {
      showFailure();
    }
  }


  //XHR Р·Р°РїРёСЃР°Р» РґР°РЅРЅС‹Рµ РІ reviews - РєРѕС‚РѕСЂР°СЏ РіР»РѕР±Р°Р»СЊРЅР°СЏ

  loadReviews(function (loadedReviews) {
    reviews = loadedReviews;
    setActiveFilter(localStorage.getItem('filterID') || 'reviews-all');
  });

  //РЅРѕ РµСЃР»Рё РѕРЅР° РіР»РѕР±Р°Р»СЊРЅР°СЏ Рё С„СѓРЅРєС†РёСЏ Р±С‹Р»Р° РІС‹Р·РІР°РЅР°, РїРѕС‡РµРјСѓ СЏ РЅРµ РјРѕРіСѓ Р·Р°РїСЂРѕСЃРёС‚СЊ РµРµ Р·РЅР°С‡РµРЅРёРµ С‚СѓС‚?


  function filterReviews(reviewsToFilter, filterID) {

    var filteredReviews = reviewsToFilter.slice(0);

    switch (filterID) {
      case 'reviews-recent':
        filteredReviews = reviews.filter(function (obj) {
          var reviewDate = new Date(obj.date);
          var recentDate = new Date('2015-04-02');
          return reviewDate >= recentDate;
        });
        filteredReviews.sort(function (a, b) {
          return Date.parse(b.date) - Date.parse(a.date);
        });
        break;

      case 'reviews-good' :
        filteredReviews = reviews.filter(function (obj) {
          return obj.rating >= 3;
        });
        filteredReviews.sort(function (a, b) {
          return b.rating - a.rating;
        });
        break;

      case 'reviews-bad' :
        filteredReviews = reviews.filter(function (obj) {
          return obj.rating <= 2;
        });
        filteredReviews.sort(function (a, b) {
          return a.rating - b.rating;
        });
        break;

      case 'reviews-popular' :
        filteredReviews = reviews.sort(function (a, b) {
          return b['review-rating'] - a['review-rating'];
        });
        break;

      case 'reviews-all':
      default :
        filteredReviews = reviews.slice(0);
        break;
    }
    localStorage.setItem('filterID', filterID);
    return filteredReviews;
  }

  function initFilters() {
    var filtersContainer = document.querySelector('.reviews-filter');
    filtersContainer.addEventListener('click', function (evt) {
      var clickedFilter = evt.target;
      setActiveFilter(clickedFilter.id);
    });
  }

  function setActiveFilter(filterID) {
    currentPage = 0;
    currentReviews = filterReviews(reviews, filterID);
    renderReviews(currentReviews, currentPage, true);

  }

  var moreReviews = document.querySelector('.reviews-controls-more');
  console.log(moreReviews);

  moreReviews.addEventListener('click', function () {
    if (isNextPageAvailable()) {
      renderReviews(currentReviews, currentPage++, false);

    }
  });

  function isNextPageAvailable() {
    return currentPage < Math.ceil(reviews.length / PAGE_SIZE);
  }

  initFilters();


})();
