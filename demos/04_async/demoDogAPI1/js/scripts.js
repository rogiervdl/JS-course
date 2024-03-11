const btnRandomDogs = document.querySelector('#btnRandomDogs');
const divDogs = document.querySelector('#dogs');

function fetchRandomDogs() {
	// data
	const data = {
		message: [
			'https://images.dog.ceo/breeds/hound-afghan/n02088094_2292.jpg',
			'https://images.dog.ceo/breeds/hound-blood/n02088466_7091.jpg',
			'https://images.dog.ceo/breeds/hound-blood/n02088466_7609.jpg',
			'https://images.dog.ceo/breeds/hound-english/n02089973_208.jpg',
			'https://images.dog.ceo/breeds/hound-ibizan/n02091244_2820.jpg'
		],
		status: 'success'
	};

	// generate images
	if (data.status == 'success') {
		data.message.forEach(url => {
			const img = `<img src="${url}" alt="">`;
			divDogs.innerHTML += img;
		});
	}
}

btnRandomDogs.addEventListener('click', function() {
   fetchRandomDogs();
});

