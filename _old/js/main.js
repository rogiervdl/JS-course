/* global CSSSnippet, hljs, Incrementable, Reveal */

// #region INITS
// =============

const DOM = {
	chapters: [...document.querySelectorAll('.slides .chapter')],
	chapterLists: [...document.querySelectorAll('.slides ul.chapterlist')],
	codeblocks: [...document.querySelectorAll('.slides code')],
	preCodeBlocks: [...document.querySelectorAll('.slides pre code')],
	navigator: document.querySelector('#navigator'),
	slides: [...document.querySelectorAll('.slides .chapter > section')]
};

function startApp() {
	// build functions
	buildAssignIds();
	buildTOC();
	buildChapterLists();

	// css functions
	cssMakeEditable();

	// html functions
	htmlMakeEditable();
	htmlOverlayRun();

	// javascript functions
	codeJsRunAndInc();

	// code functions
	codeAddCaptions();
	codeSyntaxHighlight();

	// init reveal
	Reveal.initialize({
		controls: true,
		progress: true,
		history: true,
		center: true,
		slideNumber: true,
		transitionSpeed: 'fast',
		transition: 'slide', // none/fade/slide/convex/concave/zoom
		// More info https://github.com/hakimel/reveal.js#dependencies
		dependencies: [
			{ src: 'vendor/reveal/lib/js/classList.js', condition: function () { return !document.body.classList; } },
			{ src: 'vendor/reveal/plugin/markdown/marked.js', condition: function () { return !!document.querySelector('[data-markdown]'); } },
			{ src: 'vendor/reveal/plugin/markdown/markdown.js', condition: function () { return !!document.querySelector('[data-markdown]'); } },
			{ src: 'vendor/reveal/plugin/zoom-js/zoom.js', async: true },
			{ src: 'vendor/reveal/plugin/notes/notes.js', async: true }
		]
	});

	// add reveal events
	Reveal.addEventListener('ready', (e) => {
		setTocActive(e.indexh, e.indexv);
	});
	Reveal.addEventListener('slidechanged', (e) => {
		setTocActive(e.indexh, e.indexv);
	});
}

// #endregion INITS

// #region HELPERS
// ===============

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
 * Encodes string with html entities
 *
 * @param {string} str
 */
function htmlEntityEncode(str) {
	const div = document.createElement('div');
	div.appendChild(document.createTextNode(str));
	return div.innerHTML.replace(/"/g, '"').replace(/'/g, '\'');
}

/**
 * Decodes string from html entities
 *
 * @param {string} str
 */
function htmlEntityDecode(str) {
	let tmp = document.createElement('textarea');
	tmp.innerHTML = str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
	const toReturn = tmp.value;
	tmp = null;
	return toReturn;
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

/**
 * Set active link in TOC
 *
 * @param {int} indexh chapter nr
 * @param {int} indexv slide nr
 */
function setTocActive(indexh, indexv) {
	// remove previous active
	const prevActive = DOM.navigator.querySelector('.active');
	if (prevActive) prevActive.classList.remove('active');

	// find next TOC active
	const url = `#/${indexh}/${indexv}`;
	const link = DOM.navigator.querySelector(`a[href="${url}"]`);
	if (link) link.classList.add('active');
}

// #endregion HELPERS

// #region BUILDERS
// ================

/**
 * Assign id's to chapters and slides
 *
 */
function buildAssignIds() {
	// assign ids to chapters and slides
	DOM.chapters.forEach((chapter, i) => {
		if (!chapter.id) chapter.id = 'chapter_' + i;
	});
	DOM.slides.forEach((slide) => {
		if (!slide.id) slide.id = createIdFrom(slide.querySelector('h2')?.textContent);
	});
}

/**
 * Build table of contents in DOM.navigator node
 *
 * @param {string} str
 */
function buildTOC() {
	if (!DOM.chapters.length) return;
	const toc = [];

	// iterate chapters
	DOM.chapters.forEach((chapter, i) => {
		// get chapter title; ignore if not exists
		if (chapter.dataset.title === '') return;
		const chapterTitle = createTitle(chapter);
		if (!chapterTitle) return;

		// iterate chapter slides, but ignore first
		const tocSlides = [];
		const chapterSlides = chapter.querySelectorAll(':scope > section + section');

		chapterSlides.forEach((slide, j) => {
			// get slide title; ignore if not exists
			if (slide.dataset.title === '') return;
			const slideTitle = createTitle(slide);
			if (!slideTitle) return;

			// add slide TOC
			tocSlides.push({
				num: j + 1,
				title: slideTitle
			});
		});

		// add chapter TOC
		const tocChapter = {
			num: i + 1,
			title: chapterTitle,
			tocSlides: tocSlides
		};
		toc.push(tocChapter);
	});

	// build TOC HTML and overwrite backlink
	let tocHTML = '<h2 class="navigator__title">Slides Navigator</h2><p class="navigator__back"><a href="index.html">&larr; terug naar index</a></p>';
	tocHTML += `<ul class="toc"><li class="toc__chapter"><a href="#/0/0" class="active">${document.querySelector('h1').innerHTML}</a></li>`;
	for (const tocChapter of toc) {
		tocHTML += `<li class="toc__chapter"><a href="#/${tocChapter.num}/0">${tocChapter.title}</a>`;
		if (tocChapter.tocSlides.length) tocHTML += '<ul>';
		for (const tocSlide of tocChapter.tocSlides) {
			tocHTML += `<li class="toc__slide"><a href="#/${tocChapter.num}/${tocSlide.num}">${tocChapter.num}.${tocSlide.num} ${tocSlide.title}</a></li>`;
		}
		if (tocChapter.tocSlides.length) tocHTML += '</ul>';
		tocHTML += '</li>';
	}
	tocHTML += '</ul>';
	DOM.navigator.innerHTML = tocHTML;
}

/**
 * Build chapter lists in each chapter in node with class .chapterlist
 *
 */
function buildChapterLists() {
	// create chapter list HTML
	let chapterlistHTML = '';
	let i = 1;
	for (const chapter of DOM.chapters) {
		const title = createTitle(chapter);
		if (!title) continue;
		chapterlistHTML += `<li><a href="#/${i}">${i}. ${title}</a>`;
		i++;
	}

	// assign
	for (const list of DOM.chapterLists) {
		list.innerHTML = chapterlistHTML;
	}

	// set active
	DOM.chapters.forEach((ch, i) => {
		const chapterlist = ch.querySelector('.chapterlist');
		if (!chapterlist || chapterlist.children.length < i) return;
		chapterlist.children[i].classList.add('active');
	});
}

// #endregion BUILDERS

// #region CODE
// ============

/**
 * Add captions to code blocks
 *
 * Usage: specify data-caption (empty or with specifi value)
 */
function codeAddCaptions() {
	for (const codeblock of DOM.codeblocks) {
		if (codeblock.dataset.caption === undefined) continue;
		const language = [...codeblock.classList].find(c => c.startsWith('language-'));
		if (!language) continue;
		const type = language.split('-')[1];
		const caption = document.createElement('p');
		caption.innerHTML = codeblock.dataset.caption == '' ? type : codeblock.dataset.caption;
		caption.style.position = 'absolute';
		caption.style.right = codeblock.scrollHeight > codeblock.clientHeight ? '25px' : '5px';
		caption.style.top = '2px';
		caption.classList.add('caption');
		codeblock.parentNode.appendChild(caption);
	}
}

/**
 * Add syntax highlighting + play nice contenteditable
 *
 */
function codeSyntaxHighlight() {
	for (const preBlock of DOM.preCodeBlocks) {

		// Highlight it
		if (preBlock.classList.contains('donthighlight')) continue;
		hljs.highlightBlock(preBlock, '    ');

		// If it's editable, add listeners to it to disable/enable Syntax Highlighting when necessary
		if (preBlock.hasAttribute('contenteditable')) {
			// Disable on focus
			preBlock.addEventListener('focus', function () {
				this.innerHTML = stripHTML(this.innerHTML);
				if (this.classList.contains('language-html') || this.classList.contains('language-php')) {
					this.innerHTML = htmlEntityEncode(this.innerHTML);
				}
			});

			// re-enable on blur
			preBlock.addEventListener('blur', function () {
				// @note <div> is needed for Chrome which inserts one when ENTER is pressed.
				this.innerHTML = this.innerHTML.replace(/<br>/gm, '\r\n').replace(/<br\/>/gm, '\r\n').replace(/<br \/>/gm, '\r\n').replace(/<div>/gm, '\r\n').replace(/<\/div>/gm, '');
				hljs.highlightBlock(this, '    ');
			});

		}

		// linked examples
		if (preBlock.dataset.overlayexample) {
			// Add run button
			const button = document.createElement('input');
			button.type = 'button';
			button.value = 'Show Example';
			button.className = 'run';
			button.addEventListener('click', function () {
				showInOverlay(preBlock, null, this.parentNode.querySelector('code').dataset.overlayexample);
			});
			preBlock.parentNode.appendChild(button);
		}
	}
}

/**
 *
 * Show a blob of HTML inside an overlay
 *
 * To use add class 'overlayrun' to the code container
 *
 */
//
function showInOverlay(codeBlock, html, url) {
	codeBlock.blur();

	const height = parseInt(codeBlock.dataset.overlayheight || 460, 10);
	const width = parseInt(codeBlock.dataset.overlaywidth || 680, 10);
	url = url || 'assets/blank.html';

	// Make sure overlay UI elements are present
	if (!document.getElementById('overlayBack')) {
		const overlayBack = document.createElement('div');
		overlayBack.id = 'overlayBack';
		overlayBack.addEventListener('click', function (e) {
			e.stopPropagation();

			// erase contents (to prevent movies from playing in the back for example)
			document.getElementById('daframe').src = 'assets/blank.html';

			// hide
			document.getElementById('overlayBack').style.display = 'none';
			document.getElementById('overlayContent').style.display = 'none';
		});
		document.body.appendChild(overlayBack);
	}

	if (!document.getElementById('overlayContent')) {
		const overlayContent = document.createElement('div');
		overlayContent.id = 'overlayContent';
		document.body.appendChild(overlayContent);
	}

	// reference elements we'll be needing
	const ob = document.getElementById('overlayBack');
	const oc = document.getElementById('overlayContent');

	// Position oc
	oc.style.width = width + 'px';
	oc.style.height = height + 'px';
	oc.style.marginTop = '-' + (height / 2) + 'px';
	oc.style.marginLeft = '-' + (width / 2) + 'px';

	// inject iframe
	oc.innerHTML = '<iframe src="' + url + '" height="' + height + '" width="' + width + '" border="0" id="daframe"></iframe>';

	// inject HTML
	if (html) {
		const oIframe = document.getElementById('daframe');
		let oDoc = (oIframe.contentWindow || oIframe.contentDocument);
		if (oDoc.document) oDoc = oDoc.document;
		oDoc.write(htmlEntityDecode(html));
	}

	// Show me the money!
	ob.style.display = 'block';
	oc.style.display = 'block';

}

// #endregion CODE

// #region CSS
// ===========

/**
 * Applies CSS snippet to selector, basically by prefixing snippet rule selectors with selector
 *
 * @param {str} strSelector selector to apply CSS to
 * @param {str} strCss string containing CSS snippet
 */
function cssApplySnippet(strSelector, strCss) {
	let demostyles = document.querySelector('#demostyles');
	if (!demostyles) {
		demostyles = document.createElement('style');
		demostyles.id = 'demostyles';
		document.head.appendChild(demostyles);
	}

	// minimize css
	strCss = minimizeCss(strCss);

	// split
	if (strCss.indexOf('}') == -1) return;
	const ruleBlocks = strCss.split('}').filter(b => b.indexOf('{') != -1);
	for (let i = 0; i < ruleBlocks.length; i++) {
		const ruleBlockParts = ruleBlocks[i].split('{');
		ruleBlocks[i] = ruleBlockParts[0].trim().split(',').map(s => `${strSelector} ${s}`).join(',') + ' { ' + ruleBlockParts[1];
	}
	const strInjectCss = `/* ${strSelector} */
${ruleBlocks.join('}\n')}}
/* /${strSelector} */

`;

	// remove existing style
	const rex = new RegExp(`\\s*\\/\\* ${strSelector} \\*\\/[^\\/]*\\/\\* \\/${strSelector} \\*\\/\\s*`, 'm');
	demostyles.innerHTML = demostyles.innerHTML.replace(rex, '\n\n');

	// append updated style
	demostyles.innerHTML += strInjectCss;
}

/**
 * CSS blocks: keep referenced elements up to date + make incrementable
 *
 * If the code only contains properties: add class 'contenteditable' and 'data-subject'
 * If the code also contains selectors: add class 'contenteditable' and 'data-selector'
 *
 */
function cssMakeEditable() {
	for (const cssBlock of DOM.codeblocks.filter(b => b.classList.contains('language-css'))) {
		if (!cssBlock.hasAttribute('contenteditable')) continue;

		// css block contains properties without selector
		if (cssBlock.dataset.subject) {
			// Apply style to referenced element(s)
			new CSSSnippet(cssBlock);
			cssBlock.addEventListener('keyup', function () {
				new CSSSnippet(this);
			});
			new Incrementable(cssBlock);
		}

		// css block contains selector
		if (cssBlock.dataset.selector) {
			new Incrementable(cssBlock);
			cssApplySnippet(cssBlock.dataset.selector, cssBlock.innerHTML);
			cssBlock.addEventListener('keyup', function () {
				cssApplySnippet(this.dataset.selector, this.innerHTML);
			});
		}
	}
}

// #endregion CODE

// #region HTML
// ============

/**
 *
 * HTML blocks: keep referenced elements up to date + make incrementable
 *
 * To use add class 'contenteditable' and 'data-subject' to the code container
 *
 */
function htmlMakeEditable() {
	for (const htmlBlock of DOM.codeblocks.filter(b => b.classList.contains('language-html'))) {
		if (!htmlBlock.hasAttribute('contenteditable')) continue;

		// make incrementable
		new Incrementable(htmlBlock);
		htmlBlock.addEventListener('keydown', () => {
			if (!this.dataset.subject) return;
			const subject = document.querySelector(this.dataset.subject);
			if (subject == null) return;
			let str = this.innerHTML;

			// convert tags
			str = htmlEntityDecode(str);

			// inject
			subject.innerHTML = str;
		});
	}
}

/**
 *
 * HTML blocks: add run Button to HTML Blocks
 *
 * To use add class 'overlayrun' to the code container
 *
 */
function htmlOverlayRun() {
	for (const htmlBlock of DOM.codeblocks.filter(b => b.classList.contains('language-html'))) {
		if (!htmlBlock.classList.contains('overlayrun')) continue;

		// add Run button
		const button = document.createElement('input');
		button.type = 'button';
		button.value = 'Toon in popup';
		button.className = 'run';
		button.addEventListener('click', function () {
			const codeBlock = this.parentNode.querySelector('code');
			showInOverlay(codeBlock, htmlEntityEncode(stripHTML(codeBlock.innerHTML)));
		});
		htmlBlock.parentNode.appendChild(button);
	}
}

// #endregion HTML

// #region Javascript
// ==================

// Javascript blocks: add run buttons (add class 'overlayrun' to the code container) + make incrementable
function codeJsRunAndInc() {
	for (const jsBlock of DOM.codeblocks.filter(b => b.classList.contains('language-javascript'))) {
		if (!jsBlock.classList.contains('overlayrun')) continue;

		// add Run button
		const button = document.createElement('input');
		button.type = 'button';
		button.value = 'Run';
		button.classList.add('run');
		button.addEventListener('click', function () {
			eval(stripHTML(this.parentNode.querySelector('code').innerHTML));
		});
		jsBlock.parentNode.appendChild(button);

		// make Incrementable
		new Incrementable(jsBlock);
	}
}

// #endregion Javascript

// start your engines!
startApp();
