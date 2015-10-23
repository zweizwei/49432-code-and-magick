/**
 * Created by zweizwei on 27/09/15.
 */
'use strict';

(function() {

  var ratingClassName = {
    '4': 'review-rating-one',
    '5': 'review-rating-two',
    '6': 'review-rating-three',
    '7': 'review-rating-four',
    '8': 'review-rating-five'
  };

  var readyState = {
    'UNSENT': 0,
    'OPENED': 1,
    'HEADERS_RECEIVED': 2,
    'LOADING': 3,
    'DONE': 4
  };

  var REQUEST_FAILURE_TIMEOUT = 10000;

  var reviews;
  var currentReviews;

  var reviewsContainer = document.querySelector('.reviews-list');

  function renderReviews(reviewsToRender) {
    reviewsContainer.innerHTML = '';

    var reviewTemplate = document.getElementById('review-template');
    var reviewFragment = document.createDocumentFragment();

    if (typeof reviewsToRender === 'object') {
      reviewsToRender.forEach(function(review) {
        //console.log(review.rating);

        var newReviewElement = reviewTemplate.content.children[0].cloneNode(true);

        newReviewElement.querySelector('.review-rating').classList.add(ratingClassName[review.rating]);


        //newReviewElement.querySelector('.review-rating').textContent = review['rating'];
        newReviewElement.querySelector('.review-text').textContent = review['description'];


        reviewFragment.appendChild(newReviewElement);

        var reviewPicture = review['author']['picture'];

        if (reviewPicture) {
          var authorPicture = new Image();
          authorPicture.src = review.author.picture;

          authorPicture.onload = function() {
            newReviewElement.replaceChild(authorPicture, newReviewElement.childNodes[1]);
            authorPicture.classList.add('review-author');
            authorPicture.width = 124;
            authorPicture.height = 124;
          };

          authorPicture.onerror = function() {
            newReviewElement.classList.add('review-load-failure');
          };
        }


      });
    }

    reviewsContainer.appendChild(reviewFragment);
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

  loadReviews(function(loadedReviews) {
    reviews = loadedReviews;
    setActiveFilter(('reviews-all'));
  });


  function filterReviews(reviewsToFilter, filterID) {

    var filteredReviews = reviewsToFilter.slice(0);

    switch (filterID) {
      case 'reviews-recent':
        filteredReviews = reviewsToFilter.filter(function(obj) {
          var reviewDate = new Date(obj.date);
          var recentDate = new Date('2015-04-02');
          return reviewDate >= recentDate;
        });
        filteredReviews.sort(function(a, b) {
          return Date.parse(b.date) - Date.parse(a.date);
        });
        break;

      case 'reviews-good' :
        filteredReviews = reviewsToFilter.filter(function(obj) {
          return obj.rating >= 3;
        });
        filteredReviews.sort(function(a, b) {
          return b.rating - a.rating;
        });
        break;

      case 'reviews-bad' :
        filteredReviews = reviewsToFilter.filter(function(obj) {
          return obj.rating <= 2;
        });
        filteredReviews.sort(function(a, b) {
          return a.rating - b.rating;
        });
        break;

      case 'reviews-popular' :
        filteredReviews = reviewsToFilter.sort(function(a, b) {
          return b['review-rating'] - a['review-rating'];
        });
        break;

      case 'reviews-all':
      default :
        filteredReviews = reviewsToFilter.slice(0);
        break;
    }
    return filteredReviews;
  }

  function initFilters() {
    var filtersContainer = document.querySelector('.reviews-filter');

    filtersContainer.classList.add('invisible');

    filtersContainer.addEventListener('click', function(evt) {
      var clickedFilter = evt.target;
      setActiveFilter(clickedFilter.id);
    });
  }

  function setActiveFilter(filterID) {
    currentReviews = filterReviews(reviews, filterID);
    renderReviews(currentReviews);
  }

  function showFailure() {
    var reviewsSection = document.querySelector('reviews');
    reviewsSection.classList.add('reviews-load-failure');
  }

  initFilters();


})();
