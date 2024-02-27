const figBig = document.querySelector('#figBig');
const thumbs = document.querySelectorAll('.thumbs div');

thumbs.forEach(thn => {
  thn.addEventListener('click', function () {
    // verwijder current class van vorige thumb
    document.querySelector('.current').classList.remove('current');

    // voeg current en visited class toe aan huidige thumb
    thn.classList.add('current');
    thn.classList.add('visited');

    // pas afbeelding en beschrijving aan
    figBig.querySelector('img').src = thn.dataset.photo;
    figBig.querySelector('figcaption').innerHTML = thn.dataset.desc;
  });
});
