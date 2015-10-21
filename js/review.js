(function () {

  var ratingClassName = {
    '4': 'review-rating-one',
    '5': 'review-rating-two',
    '6': 'review-rating-three',
    '7': 'review-rating-four',
    '8': 'review-rating-five'
  };


  var Review = function (data) {
    this.data_ = data;
    this.element = null;

    //this.onclick_ = this.onclick_.bind(this);
  }

  Review.prototype.render = function (container) {
    var reviewTemplate = document.getElementById('review-template');
    var newReviewElement = reviewTemplate.content.children[0].cloneNode(true);

    newReviewElement.querySelector('.review-rating').classList.add(ratingClassName[this.data_.rating]);
    newReviewElement.querySelector('.review-text').textContent = this.data_.description;

    if (this.data_.author.picture) {
      var authorPicture = new Image();
      authorPicture.src = this.data_.author.picture;

      authorPicture.addEventListener('load', function () {
        newReviewElement.replaceChild(authorPicture, newReviewElement.childNodes[1]);
        authorPicture.classList.add('review-author');
        authorPicture.width = 124;
        authorPicture.height = 124;
      });


      authorPicture.addEventListener('error', function (evt) {
        newReviewElement.classList.add('review-load-failure');
      });

      container.appendChild(newReviewElement);

      this._element = newReviewElement;
    }
  }

  Review.prototype.unrender = function () {
    this._element.parentNode.removeChild(this._element);
    this._element = null;
  };

  window.Review = Review;

})();
