
var formElement = document.forms['review-form'],
    reviewName = formElement['review-name'],
    reviewText = formElement['review-text'],
    reviewMark = document.querySelectorAll('[name=review-mark]');
    reviewNameLenght = 0,
    reviewTextLenght = 0,

    reviewFormControls = document.querySelector('#review-form-controls'),
    reviewFieldslName = document.querySelector('#review-fields-name'),
    reviewFieldsText = document.querySelector('#review-fields-text');


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

formElement.onsubmit = function(evt){

    var form = formElement,
        reviewNameLenght = reviewName.value.length,
        reviewTextLenght = reviewText.value.length;

    if (validate()) {
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
