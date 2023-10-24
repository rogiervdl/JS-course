/*
 * Page-specific scripts
 *
 * @author Rogier van der Linde
 */

// aliases
const thumbs = document.querySelectorAll('#thumbsmenu li');
const big = document.querySelector('#big');
const photo = big.querySelector('img');

// attach events
for (let thumb of thumbs) {
	const link = thumb.querySelector('a');
	const img = thumb.querySelector('img');
	link.addEventListener('click', function (e) {
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


