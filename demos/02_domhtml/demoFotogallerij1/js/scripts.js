// declaraties
const figBig = document.querySelector('#figBig');
const thumbLinks = document.querySelectorAll('.thumbs a');

// event handler
function handleLinkClick(e) {
   e.preventDefault();
   figBig.querySelector('img').src = this.href;
   figBig.querySelector('figcaption').innerHTML = this.querySelector('img').alt;
}

// event
thumbLinks.forEach(lnk => {
    lnk.addEventListener('click', handleLinkClick);
});
