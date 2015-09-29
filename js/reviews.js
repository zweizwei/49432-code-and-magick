/**
 * Created by zweizwei on 27/09/15.
 */

(function(){

    var reviewsContainer = document.querySelector('.reviews-list'),
        REQUEST_FAILURE_TIMEOUT = 10000;

        reviewsContainer.innerHTML = '';

        var reviewTemplate = document.getElementById('review-template');
        var reviewFragment = document.createDocumentFragment();

    if (typeof reviews == 'object') {
        reviews.forEach(function(review) {
            var newReviewElement = reviewTemplate.content.children[0].cloneNode(true);

            //newReviewElement.querySelector('.hotel-name').textContent = review['name'];
            newReviewElement.querySelector('.review-rating').textContent = review['rating'];
            newReviewElement.querySelector('.review-text').textContent = review['description'];


            reviewFragment.appendChild(newReviewElement);

            var reviewPicture = review['author']['picture'];

            if (reviewPicture) {
                var reviewBackground = new Image();

                reviewBackground.src = reviewPicture;

                var imageLoadTimeout = setTimeout(function() {
                    newReviewElement.classList.add('review-nophoto');
                }, REQUEST_FAILURE_TIMEOUT);

                reviewBackground.onload = function() {
                    newReviewElement.style.backgroundImage = 'url(\'' + reviewBackground.src + '\')';
                    newReviewElement.style.backgroundSize = '100% auto';
                    clearTimeout(imageLoadTimeout);
                };

                reviewBackground.onerror = function() {
                    newReviewElement.classList.add('review-nophoto');
                };
            }
        });
    }

    reviewsContainer.appendChild(reviewFragment);


})();
