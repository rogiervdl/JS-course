// declarations
const frmLogin = document.querySelector('#frmLogin');
const inpEmail = frmLogin.querySelector('#email');
const inpPw = frmLogin.querySelector('#pw');
const msgEmailIsEmpty = inpEmail.parentNode.querySelector('.message.is-empty');
const msgPwIsEmpty = inpPw.parentNode.querySelector('.message.is-empty');
const msgPwHasNoCapital = inpPw.parentNode.querySelector('.message.has-no-capital');

// functions
function handleFormSubmit(e) {
	// prevent form submit
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
   if (inpPw.value.toLowerCase() == inpPw.value) {
      msgPwHasNoCapital.classList.add('show');
   }

	// password can't be empty
   if (inpPw.value == '') {
      msgPwIsEmpty.classList.add('show');
   }

	// if all ok; submit form
   if (this.querySelector('.message.show').length == 0) this.submit();
}

// disable HTML5 validation
frmLogin.setAttribute('novalidate', 'novalidate');

// event: halt form submissions and check form
frmLogin.addEventListener('submit', handleFormSubmit);
