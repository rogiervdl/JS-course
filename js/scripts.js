/* global Prism, HystModal */

// DOM shortcuts
const DOM = {
	codeBlocks: [...document.querySelectorAll('pre code')],
	diaDemoWindow: document.querySelector('#diaDemo .hystmodal__window'),
	nav: document.querySelector('nav'),
	tips: [...document.querySelectorAll('.tips')],
	titles: [...document.querySelectorAll('h2,h3,h4,h5')],
	toc: document.querySelector('#toc')
};
const myHistModal = new HystModal({});

/**
 * Startup function
 *
 * @param {string} str
 */
function startApp() {
	// part 1: assign id's to titles
	DOM.titles.forEach((title) => {
		const id = createIdFrom(title.textContent);
		title.dataset.id = id;
		title.dataset.text = title.innerHTML;
		title.innerHTML = `<span id="${id}"></span>` + title.innerHTML;
	});

	// part 2: handle tips

	// part 3: build TOC
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

	// part 4: nav scroll effect
	window.addEventListener('scroll', () => {
		DOM.nav.classList.toggle('condensed', document.body.scrollTop > 50 || document.documentElement.scrollTop > 50);
	});

	// part 5: prism
	Prism.plugins.toolbar.registerButton('Demo', (env) => {
		const pre = env.element.parentNode;
		if (pre.dataset.demo == undefined) return;
		const button = document.createElement('button');
		button.textContent = 'Demo';
		button.onclick = function() {
			DOM.diaDemoWindow.innerHTML = '<iframe title="demo"></iframe>';
			const src = env.element.parentNode.dataset.demo;
			if (src === undefined) return;
			myHistModal.open('#diaDemo');
			const diaDemoIframe = document.querySelector('#diaDemo iframe');
			if (src == '') {
				let oDoc = (diaDemoIframe.contentWindow || diaDemoIframe.contentDocument);
				if (oDoc.document) oDoc = oDoc.document;
				let html = env.element.innerText;
				if (env.language == 'javascript' && !html.includes('<html')) html = `<html><body><p><em>open chrome inspector en bekijk de output in de console!</em></p><script>${html}</script></body></html>`;
				if (env.language == 'html' && !html.includes('<html')) html = `<html><body>${html}</body></html>`;
				oDoc.write(html);
			} else {
				diaDemoIframe.src = src;
			}
		};
		return button;
	});
	Prism.plugins.toolbar.registerButton('show-language', (env) => {
		const pre = env.element.parentNode;
		if (!pre || !/pre/i.test(pre.nodeName)) return;
		const caption = pre.getAttribute('data-caption') || pre.getAttribute('data-language') || env.language;
		if (!caption) return;
		const element = document.createElement('span');
		element.textContent = caption;
		return element;
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

// start your engines!
startApp();


