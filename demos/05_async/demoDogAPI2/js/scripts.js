const btnRandomDogs = document.querySelector('#btnRandomDogs');
const divDogs = document.querySelector('#dogs');

async function fetchRandomDogs() {
	// build request
	const url = 'https://dog.ceo/api/breed/hound/images/random/5';

	// fetch data
	const resp = await fetch(url);
	if (!resp.ok) {
		console.log('opvragen random dogs mislukt');
		return;
	}
	const data = await resp.json();

	// process data
	data.message.forEach(url => {
		divDogs.innerHTML += `<img src="${url}" alt="">`;
	});
}

// start fetching on click
btnRandomDogs.addEventListener('click', async function() {
	console.log('start feching dogs...');
	await fetchRandomDogs();
	console.log('...fetch finished');
});
