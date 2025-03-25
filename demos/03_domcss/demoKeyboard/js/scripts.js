// declaraties
const inpMessage = document.querySelector('#inpMessage');

// event handlers
function handleKeyDown(e) {
	console.log(e);
	document.querySelector('#spnKey').innerHTML = e.key;
	document.querySelector('#spnCode').innerHTML = e.code;
	document.querySelector('#spnShift').innerHTML = e.shiftKey ? 'ja' : 'nee ';
	document.querySelector('#spnControl').innerHTML = e.ctrlKey ? 'ja' : 'nee ';
}

// events
inpMessage.addEventListener('keydown', handleKeyDown);
