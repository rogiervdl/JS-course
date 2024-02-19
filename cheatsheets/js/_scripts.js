/* global hljs*/

// DOM shortcuts
const DOM = {
 	codeBlocks: [...document.querySelectorAll('pre code')],
   nav: document.querySelector('nav'),
	titles: [...document.querySelectorAll('h2,h3,h4,h5')],
	toc: document.querySelector('#toc')
};

function startApp() {
   // part 1: assign id's to titles
	DOM.titles.forEach((title) => {
      const id = createIdFrom(title.textContent);
      title.dataset.id = id;
      title.dataset.text = title.innerHTML;
      title.innerHTML = `<span id="${id}"></span>` + title.innerHTML;
	});

   // part 2: build TOC
	if (!DOM.titles.length) return;
	let toc = '';

	// iterate titles
   const titleNrs = [0, 0, 0, 0, 0, 0];
	DOM.titles.filter(t => !t.dataset.dontlist).forEach((title) => {
      // get title number and create link
      const titleNr = title.nodeName.substring(1);
      const lnk = `<a href="#${title.dataset.id}">${title.dataset.text}</a>`;

      // increment title count
      titleNrs[titleNr - 1]++;
      if (titleNrs[titleNr - 1] == 1) toc += '<ul>';

      // reset all subtitle counts
      for (let i = titleNr; i < titleNrs.length; i++) {
         if (titleNrs[i] == 0) continue;
         toc += '</ul>';
         titleNrs[i] = 0;
      }
      const prefix = titleNrs.filter(t => t != 0).join('.');
      const ispro = title.closest('.pro') != null;
      toc += `<li${ispro ? ' class="pro"' : ''}>${prefix} ${lnk}</li>\n`;
   });

   // add to dom
   DOM.toc.innerHTML = toc;

   // part 3: nav scroll effect
   window.addEventListener('scroll', () => {
      DOM.nav.classList.toggle('condensed', document.body.scrollTop > 50 || document.documentElement.scrollTop > 50);
   });
}

/**
 * Creates id from string by sanatizing it
 *
 * @param {str} str
 */
function createIdFrom(str) {
	if (!str || str == '') return null;
	str = str.toLowerCase().replace(/[^a-zA-Z\d ]/g, '').replace(/ +/g, ' ').replace(/ /g, '-');
	let id = str;
	let i = 2;
	while (document.getElementById(id)) {
		id = `${str}-${i++}`;
	}
	return id;
}

/**
 * Creates title from chapter or slide
 *
 * @param {HTMLElement} section
 */
function createTitle(section) {
	if (section.dataset.title) return section.dataset.title;
	const h2 = section.querySelector('h2');
	if (!h2) return null;
	return stripHTML(h2.innerHTML);
}

/**
 * Strip HTML from a string
 *
 * @param {string} strHtml
 */
function stripHTML(html) {
	let tmp = document.createElement('div');
	tmp.innerHTML = html;
	const toReturn = tmp.textContent || tmp.innerText;
	tmp = null;
	return toReturn;
}

// start your engines!
startApp();


