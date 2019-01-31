/*
 * Page-specific scripts
 *
 * @author Rogier van der Linde <rogier.vanderlinde@odisee.be>
 */

// sets the mood image
let setMood = function(nr) {
	// check boundaries
	if (nr < 0) nr = 0;
	if (nr > 5) nr = 5;

	// adjust image
	document.getElementById('imgMood').src = 'img/mood' + nr + '.gif';
}

// start scripts
window.addEventListener('load', function() {
	document.getElementById('selMood').addEventListener('change', function() {
		setMood(this.value);
	});
});
