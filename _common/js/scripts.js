/* eslint-disable no-magic-numbers */
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
const myHistModal = typeof HystModal === 'undefined' ? undefined : new HystModal({});

/**
 * Draws code markers
 */
function drawCodeMarkers() {
	document.querySelectorAll('.precontainer').forEach(pc => {
		// remove previous markers
		pc.querySelectorAll('.marker').forEach(m => m.remove());

		// find container bounds, markers, <pre> and <code>
		const pcBounds = pc.getBoundingClientRect();
		const markers = pc.querySelectorAll('.codemarker');
		const code = pc.querySelector('code');

		// backup innerHTML, and replace with innerText
		const innerHTML = code.innerHTML;
		code.innerHTML = code.innerText.replaceAll('<', '&lt;').replaceAll('>', '&gt;');

		// iterate markers
		markers.forEach(m => {
			const text = m.dataset.text;
			if (!text) return;
			const nth = m.dataset.nth ?? 1;
			const index = code.textContent.split(text, nth).join(text).length;
			if (index < 0 || index > code.textContent.length - text.length) return;
			const range = document.createRange();
			range.setStart(code.firstChild, index);
			range.setEnd(code.firstChild, index + text.length);
			const rangeBounds = range.getBoundingClientRect();
			const coords = {
				top: parseInt(rangeBounds.top + code.scrollTop - pcBounds.top),
				left: parseInt(rangeBounds.left + code.scrollLeft - pcBounds.left),
				height: parseInt(rangeBounds.height),
				width: parseInt(rangeBounds.width)
			};
			const div = document.createElement('div');
			div.classList.add('marker');
			div.style.left = `${parseInt(m.dataset.left ?? coords.left - 4)}px`;
			div.style.top = `${m.dataset.top ?? coords.top - 4}px`;
			div.style.height = `${m.dataset.height ?? coords.height + 8}px`;
			div.style.width = `${m.dataset.width ?? coords.width + 8}px`;
			if (m.dataset.color) {
				if (m.dataset.color.startsWith('#')) div.style.borderColor = m.dataset.color;
				else div.classList.add(m.dataset.color);
			}
			code.parentNode.appendChild(div);
		});

		// restore innerHTML
		code.innerHTML = innerHTML;
	});
}

/**
 * Handles window changes
 */
function repaint() {
	drawCodeMarkers();
	document.body.style.paddingTop = `${document.querySelector('nav').offsetHeight}px`;
}

/**
 * Startup function
 *
 * @param {string} str
 */
function startApp() {
	// part 1: assign id's to titles and toctitles
	DOM.titles.forEach((title) => {
		const id = createIdFrom(title.textContent);
		title.dataset.id = id;
		title.dataset.text = title.innerHTML;
		title.innerHTML = title.innerHTML + `<span class="title__anchor" id="${id}"></span>`;
	});
	const anchor = location.hash.substring(1);
	if (anchor.length) {
		const elem = document.getElementById(anchor);
		if (elem) elem.scrollIntoView();
	}

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
		if (titleNrs[titleNr - 1] == 1) toc += `${toc.includes('<li>') ? '<li>' : ''}<ul>`;

		// reset all subtitle counts
		for (let i = titleNr; i < titleNrs.length; i++) {
			if (titleNrs[i] == 0) continue;
			toc += `</ul>${toc.includes('</li>') ? '</li>' : ''}`;
			titleNrs[i] = 0;
		}
		const prefix = titleNrs.filter(t => t != 0).join('.');
		const ispro = title.closest('.pro') != null;
		toc += `<li${ispro ? ' class="pro"' : ''}>${prefix} ${lnk}</li>\n`;
	});

	// add to dom
	if (DOM.toc) DOM.toc.innerHTML = toc;

	// part 3: nav scroll effect
	window.addEventListener('scroll', () => {
		// if (document.body.scrollTop < 200) {
		// 	document.body.style.paddingTop = `${parseInt(document.querySelector('.site__nav').clientHeight) + 50}px`;
		// }
		if (DOM.nav.classList.contains('condensed') && !(document.body.scrollTop > 50 || document.documentElement.scrollTop > 50)) {
			DOM.nav.classList.remove('condensed');
			setTimeout(function () { document.body.style.paddingTop = `${document.querySelector('nav').offsetHeight}px`; }, 500);
		}
		if (!DOM.nav.classList.contains('condensed') && (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50)) {
			DOM.nav.classList.add('condensed');
		}
		DOM.nav.classList.toggle('condensed', document.body.scrollTop > 50 || document.documentElement.scrollTop > 50);
	});

	// part 4: code markers
	window.addEventListener('resize', repaint);

	// part 5: error comment markers
	document.querySelectorAll('code .token.comment').forEach(t => {
		if (t.innerText.toLowerCase().includes('// fout')) t.classList.add('error');
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
window.addEventListener('load', function () {
	repaint();
	startApp();
});

// toolbar buttons
(function () {
	if (typeof Prism === 'undefined' || typeof document === 'undefined' || !document.querySelector) return;

	// demo button
	Prism.plugins.toolbar.registerButton('Demo', (env) => {
		const pre = env.element.parentNode;
		if (pre.dataset.demo == undefined) return;
		const button = document.createElement('button');
		button.textContent = 'Demo';
		button.onclick = function () {
			DOM.diaDemoWindow.innerHTML = '<iframe title="demo"></iframe>';
			const src = env.element.parentNode.dataset.demo;
			if (src === undefined) return;
			myHistModal.open('#diaDemo');
			const diaDemoIframe = document.querySelector('#diaDemo iframe');
			if (src == '') {
				let oDoc = (diaDemoIframe.contentWindow || diaDemoIframe.contentDocument);
				if (oDoc.document) oDoc = oDoc.document;
				let html = env.element.innerText;
				if (env.language == 'javascript' && !html.includes('<html')) {
					html = `<html><body><p><em>open chrome inspector en bekijk de output in de console!</em></p><script>${html}</script></body></html>`;
				}
				else if (env.language == 'html' && !html.includes('<html')) {
					const demoContainer = pre.closest('.democontainer');
					const demoCss = demoContainer?.querySelector('pre.language-css')?.innerText ?? '';
					const demoJs = demoContainer?.querySelector('pre.language-javascript')?.innerText ?? '';
					const demoHtml = demoContainer?.querySelector('pre.language-html')?.innerText ?? '';
					html = `<html><head><style>${demoCss}</style></head><body>${demoHtml}</body><script>${demoJs}</script></html>`;
				}
				oDoc.write(html);
			} else {
				diaDemoIframe.src = src;
			}
		};
		return button;
	});

	// show caption
	if (Prism.plugins.toolbar) {
		Prism.plugins.toolbar.registerButton('show-caption', (env) => {
			const pre = env.element.parentNode;
			if (!pre || !/pre/i.test(pre.nodeName)) return;
			if (pre.dataset.notoolbar != undefined) return;
			const caption = pre.getAttribute('data-caption') || pre.getAttribute('data-language');
			if (!caption) return;
			const element = document.createElement('span');
			element.textContent = caption == 'cs' ? 'c#' : caption;
			return element;
		});
	}
}());

