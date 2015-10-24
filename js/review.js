
'use strict';

(function() {

  var ratingClassName = {
    '4': 'review-rating-one',
    '5': 'review-rating-two',
    '6': 'review-rating-three',
    '7': 'review-rating-four',
    '8': 'review-rating-five'
  };


  var Review = function(data) {
    this._data = data;
    this.element = null;
  };

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
        authorPicture.width = 124;
        authorPicture.height = 124;
      });


      authorPicture.addEventListener('error', function() {
        newReviewElement.classList.add('review-load-failure');
      });

      container.appendChild(newReviewElement);

      this.element = newReviewElement;
    }
  };

  Review.prototype.unrender = function() {
    this.element.parentNode.removeChild(this.element);
    this.element = null;
  };

  window.Review = Review;

})();

