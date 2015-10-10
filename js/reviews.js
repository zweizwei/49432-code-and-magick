/**
 * Created by zweizwei on 27/09/15.
 */

(function(){

    var ratingClassName = {
        '4': 'review-rating-one',
        '5': 'review-rating-two',
        '6': 'review-rating-three',
        '7': 'review-rating-four',
        '8': 'review-rating-five'
        };

    var readyState = {
        'UNSENT' : 0,
        'OPENED' : 1,
        'HEADERS_RECEIVED' : 2,
        'LOADING' : 3,
        'DONE' : 4
    };

    var REQUEST_FAILURE_TIMEOUT = 10000;

    var reviewsContainer = document.querySelector('.reviews-list');

    function renderReviews(reviewsToRender){

    var reviewsContainer = document.querySelector('.reviews-list');
        reviewsContainer.innerHTML = '';

        var reviewTemplate = document.getElementById('review-template');
        var reviewFragment = document.createDocumentFragment();

    if (typeof reviews == 'object') {
        reviews.forEach(function(review) {
            var newReviewElement = reviewTemplate.content.children[0].cloneNode(true);

            newReviewElement.querySelector('.review-rating').classList.add(ratingClassName[Math.floor(review['rating'])]);
            //newReviewElement.querySelector('.review-rating').textContent = review['rating'];
            newReviewElement.querySelector('.review-text').textContent = review['description'];


            reviewFragment.appendChild(newReviewElement);

            var reviewPicture = review['author']['picture'];

            if (reviewPicture) {
                var reviewBackground = new Image();

                reviewBackground.src = reviewPicture;

                var imageLoadTimeout = setTimeout(function() {
                    newReviewElement.querySelector('.review-author').classList.add('review-load-failure');
                }, REQUEST_FAILURE_TIMEOUT);

                reviewBackground.onload = function() {
                    newReviewElement.style.backgroundImage = 'url(\'' + reviewBackground.src + '\')';
                    newReviewElement.style.backgroundSize = '124px 124px';
                    newReviewElement.style.backgroundRepeat = 'no-repeat';
                    clearTimeout(imageLoadTimeout);
                };

                reviewBackground.onerror = function() {
                    newReviewElement.querySelector('.review-author').classList.add('review-load-failure');
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
                default : break;
            }
        };
        xhr.ontimeout = function() {
            showFailure();
        }
    }

    loadReviews(function(loadedReviews) {
        reviews = loadedReviews;
        renderReviews(reviews);
    });

})();
