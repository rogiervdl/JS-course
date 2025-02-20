// declaraties
const figBig = document.querySelector('#figBig');
const thumbs = document.querySelectorAll('.thumbs div');

// functies
function handleThnClick(e) {
	// verwijder current class van vorige thumb
	document.querySelector('.current').classList.remove('current');

	// voeg current en visited class toe aan huidige thumb
	this.classList.add('current');
	this.classList.add('visited');

	// pas afbeelding en beschrijving aan
	figBig.querySelector('img').src = this.dataset.photo;
	figBig.querySelector('figcaption').innerHTML = this.dataset.desc;
}

// events
thumbs.forEach(thn => {
	thn.addEventListener('click', handleThnClick);
});
