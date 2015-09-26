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

//validate function

  var formElement = document.querySelector('.review-form'),
      reviewName = document.querySelector('.review-form-field-name'),
      reviewText = document.querySelector('.review-form-field-text'),
      reviewMark = document.querySelectorAll('[name=review-mark]');
      reviewNameLenght = 0,
      reviewTextLenght = 0,

      reviewFormControls = document.querySelector('.review-form-controls'),
      reviewFieldslName = document.querySelector('.review-fields-name'),
      reviewFieldsText = document.querySelector('.review-fields-text');

    console.log(formElement);

  function validate(){

    var reviewNameLenght = reviewName.value.length,
        reviewTextLenght = reviewText.value.length;

    reviewFormControls.classList.add('hide');
    reviewFieldslName.classList.add('hide');
    reviewFieldsText.classList.add('hide');

    if (reviewNameLenght === 0 || reviewTextLenght === 0) {
      reviewFormControls.classList.remove('hide');
      if (reviewNameLenght === 0){
        reviewFieldslName.classList.remove('hide');
      }
      if  (reviewTextLenght === 0 ){
        reviewFieldsText.classList.remove('hide');
      }
      return false;
    }   else    {
      console.log('validated');
      reviewFormControls.classList.add('hide');
      return  true;
    }
  }

  reviewName.onchange = function(){
      validate();
  }
  reviewText.onchange = function () {
      validate();
  }

  formElement.onsubmit = function(evt){

    var form = formElement,
        reviewNameLenght = reviewName.value.length,
        reviewTextLenght = reviewText.value.length;

    if (validate()) {
        console.log('validated');
      evt.preventDefault();
      console.log('validated');
      for (var i = 0; i < reviewMark.length; i++) {
        if (reviewMark[i].checked) {
          docCookies.removeItem('review-mark');
          docCookies.setItem('review-mark', reviewMark[i].value,
              calculateDateExpire());
        }
      }
      docCookies.removeItem('review-name');
      docCookies.setItem('review-name', reviewName.value,
          calculateDateExpire());
      formElement.submit();
    } else {
        console.log('notvalidated');
    }
  };





  var calculateDateExpire = function () {
    var dateCurrent = new Date();
    var dateBirthday = new Date(dateCurrent.getFullYear(), 9, 25);
    var dateBirthdayDelta = dateCurrent - dateBirthday;
    if (+dateBirthdayDelta < 0) {
      dateBirthdayDelta = 31536000000 + dateBirthdayDelta;

    }
    return (new Date(+dateCurrent + +dateBirthdayDelta));
  };





})();
