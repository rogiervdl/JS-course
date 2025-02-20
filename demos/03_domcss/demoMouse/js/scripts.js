const body = document.querySelector('body');

function handleMouse(e) {
	console.log(body)
	console.log(e);
	document.querySelector('#pos').innerHTML
		= `(${e.clientX}, ${e.clientY})`;
}
body.addEventListener('click', handleMouse);
