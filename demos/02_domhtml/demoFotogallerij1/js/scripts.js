const figBig = document.querySelector('#figBig');
const thumbLinks = document.querySelectorAll('.thumbs a');

thumbLinks.forEach(lnk => {
    lnk.addEventListener('click', handleLinkClicks);
});
function handleLinkClicks(e) {
   e.preventDefault();
   figBig.querySelector('img').src = this.href;
   figBig.querySelector('figcaption').innerHTML = this.querySelector('img').alt;
}
