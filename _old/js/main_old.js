window.addEventListener('load', function()
{

    // first add id's to sections without one
    var slides = document.querySelectorAll('.slides > section > section');
    for (var i = 0; i < slides.length; i++) {
        var slide = slides[i];
        if (!slide.hasAttribute('id')) {
            var h2 = slide.querySelector('h2');
            if (!h2 || !h2.textContent || h2.textContent == '') continue;
            var str = h2.textContent.toLowerCase().replace(/[^a-zA-Z\d ]/g,'').replace(/ +/g,' ').replace(/ /g,'\-');
            var id = str;
            var j = 2;
            while(document.getElementById(id)) id = str + '-' + j++;
            slide.id = id;
        }
    }

    // Init Reveal
    // ===================================

    // Initialize Reveal.js Slideshow Engine
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
        { src: 'vendor/reveal/lib/js/classList.js', condition: function() { return !document.body.classList; } },
        { src: 'vendor/reveal/plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
        { src: 'vendor/reveal/plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
        { src: 'vendor/reveal/plugin/zoom-js/zoom.js', async: true },
        { src: 'vendor/reveal/plugin/notes/notes.js', async: true }
      ]
    });


    // Create table of contents
    // ===================================

    // table of contents holder
    var toc = [];

    // find and iterate all main sections (= vertical stacks)
    var mainSections = document.querySelectorAll('.slides > section');
    for(var i = 1, len = mainSections.length; i < len ; i++)
    {
        // get shorthand to main section element
        var mainSection = mainSections[i];

        // make sure main section has an id
        if(!mainSection.id) mainSection.id = 'slide_' + i;

        // get main section title (= title of first slide of the stack)
        var mainSectionTitle = mainSection.hasAttribute('data-title') ? mainSection.getAttribute('data-title') : undefined;
        if(mainSectionTitle == undefined)
        {
            var h2 = document.querySelector('#' + mainSection.id + ' > section > h2');
            if(h2) mainSectionTitle = h2.innerText || h2.innerHTML.replace(/<br[^>]*>/g, ' ');
        }

        // ignore sections without title
        if(!mainSectionTitle) continue;

        // find subsections (= slides within vertical stacks)
        var subSections = document.querySelectorAll('#' + mainSection.id + ' > section');
        var subSlides = [];
        if(subSections.length)
        {
            // iterate, but ignore first
            for(var j = 1; j < subSections.length; j++)
            {
                // Get subsection title
                var subSectionTitle = subSections[j].hasAttribute('data-title') ? subSections[j].getAttribute('data-title') : undefined;
                if(subSectionTitle == undefined)
                {
                    var subh2 = document.querySelector('#' + mainSection.id + ' > section:nth-child(' + (j + 1) + ') > h2');
                    if(subh2) subSectionTitle = subh2.innerText || subh2.innerHTML.replace(/<br[^>]*>/g, ' ');
                }

                // ignore subsections without title
                if(!subSectionTitle) continue;

                // add subsection title to toc
                subSlides.push(
                {
                    num: i + '/' + j,
                    title: subSectionTitle
                });
            }
        }

        // add main section title and sub section titles to toc
        toc.push(
        {
            num : i,
            title: mainSectionTitle,
            subSlides : subSlides
        });
    }

    // build TOC HTML and overwrite backlink
    var tocHTML = '<nav><p>Slides Navigator</p><ul><li><a href="index.html">&larr; Back to index</a></li></ul>';
    tocHTML += '<ul><li><a href="#/">' + document.querySelector('h1').innerHTML + '</a></li></ul>';
    if(toc.length)
    {
        tocHTML += '<ul>';
        for(var i = 0, l = toc.length; i < l; i++)
        {
            var mainSection = toc[i];
            tocHTML += '<li><a href="#/' + mainSection.num + '">' + mainSection.title + '</a>';
            if(mainSection.subSlides.length)
            {
                tocHTML += '<ul>';
                for(var j = 0, k = mainSection.subSlides.length; j < k; j++)
                {
                    var subSection = mainSection.subSlides[j];
                    tocHTML += '<li><a href="#/' + subSection.num + '">' + subSection.title + '</a><span class="pagenr">' + subSection.num + '</span></li>';
                }
                tocHTML += '</ul>';
            }
            tocHTML += '</li>';
        }
        tocHTML += '</ul>';
    }
    document.querySelector('.back').innerHTML = tocHTML;

    /**
     *
     * Chapter index slides
     *
     */

    // Fetch chapter index
    var mainSections = document.querySelectorAll('.slides > section');
    var chapterIndex = [];
    for(var i = 1, len = mainSections.length; i < len ; i++)
    {

        // Get shorthand to section element
        var mainSection = mainSections[i];

        // Give secion an id. This to byspass the fact that querySelectorAll later on is root based
        if(!mainSection.id) mainSection.id = 'index_slide_' + i;
		 console.log(mainSection.id)

        // Get index title
        var mainSectionTitle = mainSection.hasAttribute('data-index-title') ? mainSection.getAttribute('data-index-title') : undefined;
        if(mainSectionTitle == undefined)
        {
            var h2 = document.querySelector('#' + mainSection.id + ' > section > h2');
            if(h2) mainSectionTitle = h2.innerText || h2.innerHTML.replace(/<br[^>]*>/g, ' ');
        }

        // Ignore sections without title
        if(!mainSectionTitle) continue;

        chapterIndex.push(
        {
            num : i,
            title: mainSectionTitle
        });
    }

    // create chapter titles list from chapter index
    var chapterlistHTML = '';
    for(var i = 0, l = chapterIndex.length; i < l; i++)
    {
        var mainSection = chapterIndex[i];
        chapterlistHTML += '<li><a href="#/' + mainSection.num + '">' + (i + 1) + '. <span class="title">' + mainSection.title + '</span></a>';
    }

    // replace on each ul with class 'chapterlist'
    $('.reveal ul.chapterlist').each(function()
    {
        $(this).html(chapterlistHTML);
    });

    // highlight current chapter in each chapter list
    $('.reveal ul.chapterlist').each(function()
    {
        // find title of active chapter
        var activeTitle = $(this).parent().parent().attr('data-index-title');
        if(activeTitle == undefined)
        {
            $h2 = $(this).prev('h2').first();
            if($h2.size() > 0)
            {
                activeTitle = $h2.text();
            }
        }

        // highlight
        if(activeTitle != undefined)
        {
            $(this).find('a .title').filter(function(i)
            {
                return $(this).text().toLowerCase() == activeTitle.toLowerCase();
            }).parent().parent().addClass('active');
        }
    });

    /**
     *
     * Helper functions
     *
     */

    // Helper Function to strip HTML from a string
    function stripHTML(html)
    {
        var tmp = document.createElement('div');
        tmp.innerHTML = html;
        toReturn = tmp.textContent || tmp.innerText;
        tmp = null;
        return toReturn;
    }

    // Helper Function for htmlentities encode
    function htmlentities(str)
    {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML.replace(/"/g, '"').replace(/'/g, '\'');
    }

    // Helper Function for htmlentities decode
    function html_entity_decode(str)
    {
        var tmp = document.createElement('textarea');
        tmp.innerHTML = str.replace(/</g,"&lt;").replace(/>/g,"&gt;");
        toReturn = tmp.value;
        tmp = null;
        return toReturn;
    }

    /**
     *
     * Code blocks: add caption
     *
     */

     var codeBlocks = document.querySelectorAll('code');
     for(var i = 0; i < codeBlocks.length; i++)
     {

        // Local reference
        var codeBlock = codeBlocks[i];

        // add caption
        if (codeBlock.hasAttribute('data-caption')) {
            // find type
            var classList = codeBlock.classList;
            for (var j = 0; j < classList.length; j++) {
                // type found; add caption
                if (classList[j].indexOf('language-') == 0) {
                    var type = classList[j].substring(9);
                    var caption = document.createElement('p');
                    caption.innerHTML = codeBlock.getAttribute('data-caption') == '' ? type : codeBlock.getAttribute('data-caption');
                    caption.style.position = 'absolute';
                    caption.style.right = codeBlock.scrollHeight > codeBlock.clientHeight ? '25px' : '5px';
                    caption.style.top = '2px';
                    caption.className = 'caption';
                    codeBlock.parentNode.appendChild(caption);
                    break;
                }
            }
        }
    }

    /**
     *
     * Javascript blocks: add run buttons + make incrementable (
     *
     * To use add class 'overlayrun' to the code container
     *
     */

     var jsBlocks = document.querySelectorAll('code.language-javascript');
     for(var i = 0, len = jsBlocks.length; i < len ; i++)
     {

        // Local reference
        var jsBlock = jsBlocks[i];

        // may we add the run button to it?
        if(!jsBlock.className.match(new RegExp('(\\s|^)overlayrun(\\s|$)'))) continue;

        // Add Run button
        var button = document.createElement('input');
        button.type = 'submit';
        button.value = 'Run';
        button.className = 'run';
        var strUseStrict = jsBlock.className.match(new RegExp('(\\s|^)strict(\\s|$)')) ? "'use strict'; " : "";
        button.addEventListener('click', function()
        {
            eval(strUseStrict + stripHTML(this.parentNode.querySelector('code').innerHTML)); // Yeah, that's effin' dangerous!
        });
        jsBlock.parentNode.appendChild(button);

        // Hook ctrl+enter to run the code
        jsBlock.addEventListener('keypress', function(evt)
        {
            if(evt.ctrlKey && (evt.keyCode == 13))
            {
                evt.preventDefault();
                evt.stopPropagation();
                eval(stripHTML(this.innerHTML));
            }
        }, false);

        // Make Incrementable
        new Incrementable(jsBlock);

    }

    /**
     *
     * CSS blocks: keep referenced elements up to date + make incrementable
     *
     * If the code only contains properties: add class 'contenteditable' and 'data-subject'
     * If the code also contains selectors: add class 'contenteditable' and 'data-selector'
     *
     */

     var applyCssBlock = function(strSelector, strCss)
     {
        var demostyles = document.getElementById('demostyles');
        if(!demostyles)
        {
            demostyles = document.createElement('style');
            demostyles.id = "demostyles";
            document.head.appendChild(demostyles);
        };
        // minimize css
        strCss = strCss.replace( /(\/\*.*\*\/)|(\n|\r)+|\t*/g, '' );
        strCss = strCss.replace( /\s{2,}/g, ' ' );
        // split
        if(strCss.indexOf('}') == -1) return;
        var arrParts = strCss.split('}')
        for(var i = 0; i < arrParts.length; i++) arrParts[i] = strSelector + ' ' + arrParts[i] + '}';
        arrParts.length = arrParts.length - 1; // remove last
        var strInjectCss = '/* ' + strSelector + ' */' + arrParts.join('') + '/* /' + strSelector + ' */';
        // remove existing style
        var rex = new RegExp('\\/\\* ' + strSelector + ' \\*\\/[^\\/]*\\/\\* \\/' + strSelector + ' \\*\\/');
        demostyles.innerHTML = demostyles.innerHTML.replace(rex, '');
        // append updated style
        demostyles.innerHTML += strInjectCss;
    }

    var cssBlocks = document.querySelectorAll('code.language-css');
    for(var i = 0; i < cssBlocks.length; i++)
    {

        // local reference
        var cssBlock = cssBlocks[i];
        if (!cssBlock.hasAttribute('contenteditable')) continue;

        // css block only contains properties
        if(cssBlock.hasAttribute('data-subject'))
        {
            // Apply style to referenced element(s)
            new CSSSnippet(cssBlock);
            cssBlock.addEventListener('keydown', function()
            {
                new CSSSnippet(this);
            });

            // Make Incrementable
            new Incrementable(cssBlock);

        }

        // css block contains selectors
        if(cssBlock.hasAttribute('data-selector'))
        {
            // Make Incrementable
            new Incrementable(cssBlock);

            applyCssBlock(cssBlock.getAttribute('data-selector'), cssBlock.innerHTML);
            cssBlock.addEventListener('keydown', function()
            {
                applyCssBlock(this.getAttribute('data-selector'), this.innerHTML);
            });

        }

    }

    /**
     *
     * HTML blocks: keep referenced elements up to date + make incrementable
     *
     * To use add class 'contenteditable' and 'data-subject' to the code container
     *
     */

     var htmlBlocks = document.querySelectorAll('code.language-html');
     for(var i = 0, len = htmlBlocks.length; i < len; i++)
     {
        var htmlBlock = htmlBlocks[i];
        if (!htmlBlock.hasAttribute('contenteditable')) continue;

        new Incrementable(htmlBlock);

        htmlBlock.addEventListener('keydown', function(evt)
        {
            var subject = document.querySelector(this.getAttribute('data-subject'));
            if(subject == null) return;
            var str = this.innerHTML;
            // convert tags
            str = html_entity_decode(str);
            // TODO: check if HTML is well-formed before injection
            // ...
            // inject
            subject.innerHTML = str;
        }, false);

     }

    /**
     *
     * HTML blocks
     *
     * Add Show in Overlay Button to HTML Blocks
     *
     * To use add class 'overlayrun' to the code container
     *
     */

     var htmlBlocks = document.querySelectorAll('code.language-html');
     for(var i = 0, len = htmlBlocks.length; i < len ; i++)
     {

        // Local reference
        var htmlBlock = htmlBlocks[i];

        // may we add the run button to it?
        if(!htmlBlock.className.match(new RegExp('(\\s|^)overlayrun(\\s|$)'))) continue;

        // Add Run button
        var button = document.createElement('input');
        button.type = 'submit';
        button.value = 'Show in overlay';
        button.className = 'run';
        button.addEventListener('click', function()
        {
            var codeBlock = this.parentNode.querySelector('code');
            showInOverlay(codeBlock, htmlentities(stripHTML(codeBlock.innerHTML)));
        });
        htmlBlock.parentNode.appendChild(button);

        // Hook ctrl+enter to run the code
        htmlBlock.addEventListener('keypress', function(evt)
        {
            if(evt.ctrlKey && (evt.keyCode == 13))
            {
                evt.preventDefault();
                evt.stopPropagation();
                showInOverlay(this, this.innerHTML);
            }
        }, false);

    }

    // show a blob of HTML inside an overlay
    var showInOverlay = function(codeBlock, html, url)
    {
        codeBlock.blur();

        var height = parseInt(codeBlock.getAttribute('data-overlayheight') || 460, 10);
        var width = parseInt(codeBlock.getAttribute('data-overlaywidth') || 680, 10);
        var url = url || 'assets/blank.html';

        // Make sure overlay UI elements are present
        if(!document.getElementById('overlayBack'))
        {
            var overlayBack = document.createElement('div');
            overlayBack.id = "overlayBack";
            overlayBack.addEventListener('click', function(e)
            {
                e.stopPropagation();

                // erase contents (to prevent movies from playing in the back for example)
                document.getElementById('daframe').src = 'assets/blank.html';

                // hide
                document.getElementById('overlayBack').style.display = 'none';
                document.getElementById('overlayContent').style.display = 'none';
            });
            document.body.appendChild(overlayBack);
        }

        if(!document.getElementById('overlayContent'))
        {
            var overlayContent = document.createElement('div');
            overlayContent.id = "overlayContent";
            document.body.appendChild(overlayContent);
        }

        // reference elements we'll be needing
        var ob = document.getElementById('overlayBack');
        var oc = document.getElementById('overlayContent');

        // Position oc
        oc.style.width = width + 'px';
        oc.style.height = height + 'px';
        oc.style.marginTop = '-' + (height/2) + 'px';
        oc.style.marginLeft = '-' + (width/2) + 'px';

        // inject iframe
        oc.innerHTML = '<iframe src="' + url + '" height="' + height + '" width="' + width + '" border="0" id="daframe"></iframe>';

        // inject HTML
        if(html)
        {
            var oIframe = document.getElementById('daframe');
            var oDoc = (oIframe.contentWindow || oIframe.contentDocument);
            if(oDoc.document) oDoc = oDoc.document;
            oDoc.write(html_entity_decode(html));
        }

        // Show me the money!
        ob.style.display = 'block';
        oc.style.display = 'block';

    }

    /**
     *
     * All blocks
     *
     * Add syntax highlighting + play nice contenteditable
     *
     */

     var codeBlocks = document.querySelectorAll('pre code');
     for(var i = 0, len = codeBlocks.length; i < len ; i++)
     {

        // Local reference
        var codeBlock = codeBlocks[i];

        // May we highlight it?
        if(codeBlock.className.match(new RegExp('(\\s|^)donthighlight(\\s|$)'))) continue;

        // Highlight it
        hljs.highlightBlock(codeBlock, '    ');

        // If it's editable, add listeners to it to disable/enable Syntax Highlighting when necessary
        if(codeBlock.hasAttribute('contenteditable'))
        {

            // Disable on focus
            codeBlock.addEventListener('focus', function()
            {
                if(this.className.match(new RegExp('(\\s|^)language-html(\\s|$)')) || this.className.match(new RegExp('(\\s|^)language-php(\\s|$)'))) {
                    this.innerHTML = htmlentities(stripHTML(this.innerHTML));
                }
                else
                {
                    this.innerHTML = stripHTML(this.innerHTML);
                }
            });

            // Re-enable on blur
            codeBlock.addEventListener('blur', function()
            {
                // @note <div> is needed for Chrome which inserts one when ENTER is pressed.
                this.innerHTML = this.innerHTML.replace(/<br>/gm, '\r\n').replace(/<br\/>/gm, '\r\n').replace(/<br \/>/gm, '\r\n').replace(/<div>/gm, '\r\n').replace(/<\/div>/gm, '');
                hljs.highlightBlock(this, '    ');
            });

        }

        // linked examples
        if(codeBlock.hasAttribute('data-overlayexample'))
        {

            // Add Show Example button
            var button = document.createElement('input');
            button.type = 'submit';
            button.value = 'Show Example';
            button.className = 'run';
            button.addEventListener('click', function()
            {
                showInOverlay(codeBlock, null, this.parentNode.querySelector('code').getAttribute('data-overlayexample'));
            });
            codeBlock.parentNode.appendChild(button);

        }

    }

}, false);
