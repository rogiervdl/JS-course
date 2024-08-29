const zaden = document.querySelectorAll('#zaden li');
console.log(zaden.length);

zaden.forEach(zaad => {
   console.log(`
plant: ${zaad.innerHTML}
planttijd: ${zaad.dataset.zaaitijd}
afstand: ${zaad.dataset.afstand}`);
});
