'use strict';

(function() {
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');

  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };

  var formElement = document.querySelector('.review-form'),
    reviewName = document.querySelector('.review-form-field-name'),
    reviewText = document.querySelector('.review-form-field-text'),
    reviewMark = document.querySelectorAll('[name=review-mark]'),

    reviewFormControls = document.querySelector('.review-form-controls'),
    reviewFieldslName = document.querySelector('.review-fields-name'),
    reviewFieldsText = document.querySelector('.review-fields-text');


  function validate() {

    var reviewNameLength = reviewName.value.length,
      reviewTextLength = reviewText.value.length;

    reviewFormControls.classList.add('hide');
    reviewFieldslName.classList.add('hide');
    reviewFieldsText.classList.add('hide');

    if (reviewNameLength === 0 || reviewTextLength === 0) {
      reviewFormControls.classList.remove('hide');
      if (reviewNameLength === 0) {
        reviewFieldslName.classList.remove('hide');
      }
      if (reviewTextLength === 0) {
        reviewFieldsText.classList.remove('hide');
      }
      return false;

    } else {
      reviewFormControls.classList.add('hide');
    }
  }


  function calculateDateExpire() {
    var dateCurrent = new Date();
    var dateBirthday = new Date(dateCurrent.getFullYear(), 9, 25);
    var dateBirthdayDelta = dateCurrent - dateBirthday;
    if (+dateBirthdayDelta < 0) {
      dateBirthdayDelta = 31536000000 + dateBirthdayDelta;

    }
    return (new Date(+dateCurrent + +dateBirthdayDelta));
  }

  reviewName.onchange = validate;
  reviewText.onchange = validate;

  formElement.onsubmit = function(evt) {
    evt.preventDefault();

    if (validate) {
      for (var i = 0; i < reviewMark.length; i++) {
        if (reviewMark[i].checked) {
          docCookies.removeItem('review-mark');
          docCookies.setItem('review-mark', reviewMark[i].value,
            calculateDateExpire());
        }
      }
      docCookies.removeItem('review-name');
      docCookies.setItem('review-name', reviewName.value, calculateDateExpire());
      formElement.submit();
    }
  };





})();
