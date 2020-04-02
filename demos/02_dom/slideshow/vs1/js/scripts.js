/*
 * Page-specific scripts
 *
 * @author Rogier van der Linde <rogier.vanderlinde@odisee.be>
 */

// start scripts
window.addEventListener('load', function() {
    // aliases
	let thumbs = document.querySelectorAll('#thumbsmenu li');
    let big = document.querySelector('#big');
    let photo = big.querySelector('img');

    // attach events
	for (let thumb of thumbs) {
        let link = thumb.querySelector('a');
        let img = thumb.querySelector('img');
        link.addEventListener('click', function(e) {
            // prevent default
            e.preventDefault();

            // show image
            photo.src = link.href;
            photo.alt = img.alt;

            // change active state
            document.querySelector('#thumbsmenu .active').classList.remove('active');
            thumb.classList.add('active');
        });
	}
});


