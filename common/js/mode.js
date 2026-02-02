// n00b/pro mode checkbox
const chbMode = document.querySelector('#mode [type=checkbox]');

// handle change event
const handleChangeEvent = () => {
	document.body.classList.toggle('showpro', chbMode.checked);
	localStorage.setItem('showpro', chbMode.checked ? 'true' : 'false');
};
chbMode.addEventListener('change', handleChangeEvent);

// restore from localstorage
const showPro = localStorage.getItem('showpro') == 'true';
document.body.classList.toggle('showpro', showPro);
chbMode.checked = showPro;

// set mode with URL parameter
const url = new URL(window.location.href);
if (url.searchParams.has('pro') || url.searchParams.get('mode') === 'pro') {
	chbMode.checked = true;
	handleChangeEvent();
}
if (url.searchParams.has('n00b') || url.searchParams.get('mode') === 'n00b') {
	chbMode.checked = false;
	handleChangeEvent();
}
