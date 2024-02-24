// n00b/pro mode
const chbMode = document.querySelector('#mode [type=checkbox]');
chbMode.addEventListener('change', function() {
   document.body.classList.toggle('showpro', this.checked);
   localStorage.setItem('showpro', this.checked ? 'true' : 'false');
});
const showPro = localStorage.getItem('showpro') != 'false';
document.body.classList.toggle('showpro', showPro);
chbMode.checked = showPro;
