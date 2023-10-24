/*
 * Main scripts
 *
 * @author Rogier van der Linde
 */

// error messages shortcuts
const errStreet = document.getElementById('errStreet');
const errZip = document.getElementById('errZip');
const errCity = document.getElementById('errCity');
const errMessages = document.querySelectorAll('.message--error');

// input shortcuts
const qstStreet = document.getElementById('qstStreet');
const qstZip = document.getElementById('qstZip');
const qstCity = document.getElementById('qstCity');

// disable HTML5 form validation
document.getElementById('form1').setAttribute('novalidate', 'novalidate');

// intercept document submit
document.getElementById('form1').addEventListener('submit', function (e) {
	// halt event
	e.preventDefault();
	e.stopPropagation();

	// form checking
	let isValid = true;

	// hide all error messages
	for (let i = 0; i < errMessages.length; i++) {
		errMessages[i].innerHTML = '&nbsp;';
	}

	// check street and number
	if (qstStreet.value == '') {
		isValid = false;
		errStreet.innerHTML = 'gelieve een straat en nummer in te vullen';
	}

	// check zip
	if (qstZip.value == '') {
		isValid = false;
		errZip.innerHTML = 'gelieve een postcode in te vullen';
	}

	// check city
	if (qstCity.value == '') {
		isValid = false;
		errCity.innerHTML = 'gelieve een gemeente in te vullen';
	}

	// draw conclusion
	if (isValid) {
		console.log('all ok');
	} else {
		console.log('form contains errors');
	}

});
