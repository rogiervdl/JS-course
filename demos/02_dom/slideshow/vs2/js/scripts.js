/*
 * Page-specific scripts
 *
 * @author Rogier van der Linde <rogier.vanderlinde@odisee.be>
 */

// start scripts
window.addEventListener('load', function() {
    // aliases
    let imglinks = document.querySelectorAll('#thumbsmenu li>a');
    let photoBig = document.getElementById('photoBig');

    // attach events
    for (let i = 0; i < imglinks.length; i++) {
        imglinks[i].addEventListener('click', function(e) {
            // prevent default
            e.preventDefault();

            // show image
            let img = this.querySelector('img');
            photoBig.src = img.getAttribute('data-src-l');
            photoBig.alt = img.alt;
        });
    }
});
