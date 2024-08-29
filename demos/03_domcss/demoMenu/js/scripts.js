const menu = document.querySelector('#mainmenu');

console.log(`menu's parent node:`);
console.log(menu.parentNode);
console.log(`menu's child nodes:`);
console.log(menu.children);

const nav = document.querySelector('nav');
console.log(`nav's previous sibling:`);
console.log(nav.previousElementSibling);

const btnNext = document.querySelector('#btnNext');

btnNext.addEventListener('click', function() {
   let currItem = document.querySelector('.active');
   if (currItem == null) return;
   let nextItem = currItem.nextElementSibling;
   if (nextItem == null) nextItem = document.querySelector('#mainmenu li');
   currItem.classList.remove('active');
   nextItem.classList.add('active');
});


// const items = document.querySelectorAll('#mainmenu li');
// let currItem = 0;
// btnNext.addEventListener('click', function() {
//    items[currItem].classList.remove('active');
//    currItem++;
//    if (currItem >= items.length) currItem = 0;
//    items[currItem].classList.add('active');
// });