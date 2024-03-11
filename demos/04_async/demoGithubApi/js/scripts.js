const lstRepos = document.querySelector('#lstRepos');
async function getMyRepos() {
   // build request
   const username = 'rogiervdl';
   const url = `https://api.github.com/users/${username}/repos`;
   const options = {
      headers: {
         'Authorization': 'Bearer ghp_fIWhq1Dr....' // vul je eigen token in!
      }
   };

   // fetch
   const resp = await fetch(url, options);
   if (!resp.ok) {
      console.log('opvragen github repos mislukt');
      return;
   }

   // get json data
   const data = await resp.json();

   // process data
   data.forEach(entry => {
      lstRepos.innerHTML += `<li>
    <a href="${entry.html_url}">${entry.full_name}</a> &mdash; ${entry.description}
</li>`;
   });
}
async function doGetRepos() {
	console.log('fetching repos...');
	await getMyRepos();
	console.log('...done');
}

doGetRepos();
