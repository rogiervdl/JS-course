/* eslint-disable no-magic-numbers */
/* global Prism, HystModal, cssjs */

// DOM shortcuts
const DOM = {
	codeBlocks: [...document.querySelectorAll('pre code')],
	diaDemoWindow: document.querySelector('#diaDemo .hystmodal__window'),
	h1: document.querySelector('h1'),
	nav: document.querySelector('nav'),
	tips: [...document.querySelectorAll('.tips')],
	titles: [...document.querySelectorAll('main > h2, main > h3, main > h4, main > h5, main > .pre > h2, main > .pre > h3, main > .pre > h4, main > .pre > h5, .pro > h2, .pro > h3, .pro > h4, .pro > h5')],
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
 * Minimizes CSS: remove comments and newlines
 *
 * @param {string} strCss
 */
function minimizeCss(strCss) {
	strCss = strCss.replace(/(\/\*.*\*\/)|(\n|\r)+|\t*/g, '');
	strCss = strCss.replace(/\s{2,}/g, ' ');
	return strCss;
}

/**
 * Applies CSS snippet to selector, basically by prefixing snippet rule selectors with selector
 *
 * @param {str} strSelector selector to apply CSS to
 * @param {str} strCss string containing CSS snippet
 */
function cssApplySnippet(strSelector, strCss) {
	// create <style> block
	let demostyles = document.querySelector('#demostyles');
	if (!demostyles) {
		demostyles = document.createElement('style');
		demostyles.id = 'demostyles';
		document.head.appendChild(demostyles);
	}

	// parse css
	const parser = new cssjs();
	strCss = parser.stripComments(strCss);
	const parsed = parser.parseCSS(strCss);

	// prefix rules
	const prefixed = [];
	for (const style of parsed) {
		if (style.styles) {
			prefixed.push(style.styles);
		} else {
			prefixed.push(`${strSelector} ${style.selector} { ${parser.getCSSOfRules(style.rules)} }`);
		}
	}

	// remove existing style block
	const rex = new RegExp(`\\s*\\/\\* ${strSelector} \\*\\/[^\\/]*\\/\\* \\/${strSelector} \\*\\/\\s*`, 'm');
	demostyles.innerHTML = demostyles.innerHTML.replace(rex, '\n\n');

	// inject new style block
	const strPrefixed = minimizeCss(prefixed.join(' '));
	const strInjectCss = `/* ${strSelector} */
${strPrefixed}
/* /${strSelector} */

`;
	demostyles.innerHTML += strInjectCss;
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
 * Startup function
 *
 * @param {string} str
 */
function startApp() {
	// part 1: assign id's to titles and toctitles
	DOM.h1.innerHTML = DOM.h1.innerHTML + '<span class="title__anchor"></span>';
	DOM.titles.forEach((title) => {
		const id = title.id || createIdFrom(title.textContent);
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
	if (DOM.titles.length) {
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
		document.querySelector('h1 .title__anchor').scrollIntoView({
			behavior: 'smooth', // Optional: makes the scroll smooth
			block: 'start' // Scrolls to the top of the element
		});
	}

	// part 3: nav scroll effect
	window.addEventListener('scroll', () => {
		// if (document.body.scrollTop < 200) {
		// 	document.body.style.paddingTop = `${parseInt(document.querySelector('.site__nav').clientHeight) + 50}px`;
		// }
		if (DOM.nav.classList.contains('condensed') && !(document.body.scrollTop > 50 || document.documentElement.scrollTop > 50)) {
			DOM.nav.classList.remove('condensed');
			setTimeout(function() { 
				document.body.style.paddingTop = `${document.querySelector('nav').offsetHeight}px`; 
			}, 500);
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

	// part 6: apply css snippets to targets
	document.querySelectorAll('[data-target][contenteditable]').forEach(cssBlock => {
		const targetId = cssBlock.dataset.target;
		if (!targetId || !document.querySelector(targetId)) return;
		cssApplySnippet(targetId, cssBlock.innerText);
		cssBlock.addEventListener('keyup', function() {
			cssApplySnippet(targetId, this.innerText);
		});
	});

	// part 7: make code editable
	document.querySelectorAll('pre code').forEach(c => {
		c.setAttribute('contenteditable', 'true');
	});
	document.querySelectorAll('[contenteditable]').forEach(prismBlock => {
		prismBlock.addEventListener('blur', () => {
			Prism.highlightElement(prismBlock);
		});
	});

	// part 7: container range slider
	document.querySelectorAll('.range-container-width').forEach(rcw => {
		const container = rcw.parentNode.querySelector('.container');
		const btnReset = rcw.parentNode.querySelector('.range-reset');
		const min = parseInt(rcw.min ?? 0);
		const max = parseInt(rcw.max ?? 9999);
		const width = parseInt(container.offsetWidth);
		rcw.value = width < min ? min : width > max ? max : width;
		btnReset.dataset.initvalue = rcw.value;
		rcw.addEventListener('input', () => {
			container.style.width = `${rcw.value}px`;
		});
		btnReset.addEventListener('click', () => {
			rcw.value = btnReset.dataset.initvalue;
			container.style.width = `${rcw.value}px`;
		});
	});
}

// start your engines!
document.addEventListener('DOMContentLoaded', () => {
	repaint();
	startApp();
});

// toolbar buttons
(function() {
	if (typeof Prism === 'undefined' || typeof document === 'undefined' || !document.querySelector) return;

	// demo button
	Prism.plugins.toolbar.registerButton('Demo', (env) => {
		const pre = env.element.parentNode;
		if (pre.dataset.demo == undefined) return;
		const button = document.createElement('button');
		button.textContent = 'Demo';
		button.onclick = function() {
			const src = env.element.parentNode.dataset.demo;
			if (src === undefined) return;
			if (env.element.parentNode.dataset.demoTarget == '_blank') {
				const specs = 'width=1200,height=900,menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes';
				window.open(src, '_blank', specs);
				return;
			}
			DOM.diaDemoWindow.innerHTML = '<iframe title="demo"></iframe>';
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
					if (demoContainer) {
						const demoCss = demoContainer?.querySelector('pre.language-css')?.innerText ?? '';
						const demoJs = demoContainer?.querySelector('pre.language-javascript')?.innerText ?? '';
						const demoHtml = demoContainer?.querySelector('pre.language-html')?.innerText ?? '';
						html = `<html><head><style>${demoCss}</style></head><body>${demoHtml}</body><script>${demoJs}</script></html>`;
					} else {
						html = `<html><body>${html}</body></html>`;
					}
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
			let caption = pre.dataset.caption || pre.getAttribute('data-language');
			if (!caption && pre.hasAttribute('data-caption')) caption = env.language;
			if (!caption) return;
			const element = document.createElement('span');
			element.textContent = caption == 'cs' ? 'c#' : caption;
			return element;
		});
	}
}());

