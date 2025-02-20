const inp = document.querySelector('#inp1');

function handleKeyDown(e) {
	console.log(e);
	document.querySelector('#kar').innerHTML = e.key;
	document.querySelector('#code').innerHTML = e.keyCode;
	document.querySelector('#shift').innerHTML = e.shiftKey ? 'ja' : 'nee ';
}

inp.addEventListener('keydown', handleKeyDown);
