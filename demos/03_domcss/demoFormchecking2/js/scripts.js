const frmLogin = document.querySelector('#frmLogin');
const inpEmail = frmLogin.querySelector('#email');
const inpPw = frmLogin.querySelector('#pw');
const msgEmailIsEmpty = inpEmail.parentNode.querySelector('.message.is-empty');
const msgPwIsEmpty = inpPw.parentNode.querySelector('.message.is-empty');
const msgPwHasNoCapital = inpPw.parentNode.querySelector('.message.has-no-capital');

// disable HTML5 validation
frmLogin.setAttribute('novalidate', 'novalidate');

// halt form submissions and check form
frmLogin.addEventListener('submit', function (e) {
   e.preventDefault();
   // clear all messages
   msgEmailIsEmpty.classList.remove('show');
   msgPwIsEmpty.classList.remove('show')
   msgPwHasNoCapital.classList.remove('show')
   // email can't be empty
   if (inpEmail.value == '') {
      msgEmailIsEmpty.classList.add('show');
   }
   // password must have at least one capital letter
   if (inpPw.value.toUpperCase() == inpPw.value) {
      msgPwHasNoCapital.classList.add('show');
   }
   // password can't be empty
   if (inpPw.value == '') {
      msgPwIsEmpty.classList.add('show');
   }
   // if all ok; submit form
   if (frmLogin.querySelector('.message.show').length == 0) frmLogin.submit();
});
