const pics = document.querySelector('#pics');
const frmSearch = document.querySelector('#frmSearch');
const inpSearch = frmSearch.querySelector('#inpSearch');
const API_KEY = '60dce28390e0a3564cef489f60b749be';

// fetch settings
async function makeSearch(searchval) {
   // build request
   let url = 'https://api.flickr.com/services/rest/';
   const params = new URLSearchParams();
   params.append('api_key', API_KEY); // vraag een API key aan op https://www.flickr.com/services/apps/create/apply/
   params.append('extras', 'url_m');
   params.append('format', 'json');
   params.append('method', 'flickr.photos.search');
   params.append('per_page', 20);
   params.append('nojsoncallback', 1);
   params.append('text', searchval);
   url += '?' + params.toString();

   // fetch url
   const resp = await fetch(url);
   if (!resp.ok) {
      console.log('opvragen foto\'s mislukt');
      return;
   }
   const data = await resp.json();

   // process data
   data.photos.photo.forEach(photo => {
      pics.innerHTML += `<img src="${photo.url_m}" alt="">`;
   });
}

frmSearch.addEventListener('submit', async function(e) {
	e.preventDefault();
	pics.innerHTML = '';
	console.log('start fetching photos...');
	await makeSearch(inpSearch.value);
	console.log('...done!');
 });

