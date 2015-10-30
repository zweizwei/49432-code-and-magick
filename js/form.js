'use strict';

define(function() {
  /**
   * Контейнер оверлейя поверх страницы где находится форма.
   * @type {Element}
   */
  var formContainer = document.querySelector('.overlay-container');

  /**
   * Контейнер с кнопкой добавить новый отзыв.
   * @type {Element}
   */
  var formOpenButton = document.querySelector('.reviews-controls-new');
  /**
   * Крестик закрыть форму.
   * @type {Element}
   */
  var formCloseButton = document.querySelector('.review-form-close');

  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };

  /**
   * Контейнер формы.
   * @type {Element}
   */
  var formElement = document.querySelector('.review-form'),
    /**
     * Поле заполнить имя.
     * @type {Element}
     */
    reviewName = document.querySelector('.review-form-field-name'),
    /**
     * Поле заполнить отзыв.
     * @type {Element}
     */
    reviewText = document.querySelector('.review-form-field-text'),
    /**
     * Поставить оценку.
     * @type {Element}
     */
    reviewMark = document.querySelectorAll('[name=review-mark]'),

    reviewFormControls = document.querySelector('.review-form-controls'),
    reviewFieldslName = document.querySelector('.review-fields-name'),
    reviewFieldsText = document.querySelector('.review-fields-text');


  /**
   * Валидация формы отправки нового отзыва
   * проверяет если хотя бы один символ поля имени
   * и отзыва заполнены - можно отправлять
   * если хотя бы одно из полей не заполнено -
   * отправлять нельзя
   * как только поле заполнено его элемент "необходимо заполнить"
   * скрывается
   */

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

  /**
   * Рассчет даты истечения действия куки
   */

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

    if (validate()) {
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


});
