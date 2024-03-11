const selBreeds = document.querySelector('#selBreeds');
const parMessage = document.querySelector('#parMessage');
const divImages = document.querySelector('#divImages');

selBreeds.addEventListener('change', async function() {
   // build request
   parMessage.innerHTML = `fetching images for ${this.value}`;
   const url = `https://dog.ceo/api/breed/${this.value}/images`;

   // fetch data
   const resp = await fetch(url);
   const data = await resp.json();
   if (data.status != 'success') {
      console.log('fetching breeds failed');
      return;
   }

   // show photos
   data.message.forEach(src => {
      divImages.innerHTML += `<img src="${src}" alt="">`;
   });
   parMessage.innerHTML = `done fetching images for ${this.value}!`;
});

async function fetchBreeds() {
   // build request
   const url = 'https://dog.ceo/api/breeds/list/all';

   // fetch data
   const resp = await fetch(url);
   const data = await resp.json();
   if (data.status != 'success') {
      console.log('fetching breeds failed');
      return;
   }

   // populate list of breeds and show list
   for (const breed in data.message) {
      selBreeds.innerHTML += `<option>${breed}</option>`;
   }
   selBreeds.classList.remove('hide');
}

async function doFetch() {
   parMessage.innerHTML = 'fetching breeds...';
	await fetchBreeds();
   parMessage.innerHTML = 'done fetching';
}

doFetch();
