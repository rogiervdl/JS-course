/*
* Example with generators and promises in Node
* @author Rogier van der Linde <rogier.vanderlinde@odisee.be>
* Date:   2017/02/14
*/

// require modules
let hget = require('hget');
let marked = require('marked');
let MarkedTerminal = require('marked-terminal');
let request = require('request');

// define and create a generator for URL's
let urlGenerator = function*(){
  let urls = [
    'https://ikdoeict.be/',
    'https://ikdoeict.be/opleiding-ict/'
  ];
  while (urls.length) yield urls.shift();
}
let urlGen = urlGenerator();

// returns a promise to return the content found at an URL
let getNextPage = function () {
  let url = urlGen.next();
  return new Promise((resolve, reject) => {
    if (url.done) {
      reject('Done! No more pages');
      return;
    } 
    console.log(`Fetching next page at ${url.value}...`);
    request(url.value, (err, res, body) => {
      if (err) {
        reject(err); 
        return;
      }
      resolve(body);
    });
  });
};

// displays and parses the content
let displayNextPage = function() {
  getNextPage()
    .then(html => hget(html, {
      markdown: true,
      root: 'div.main-content',
      ignore: '.at-subscribe,.mm-comments,.de-sidebar'
    }))
    .then(md => marked(md, {
      renderer: new MarkedTerminal()
    }))
    .then(txt => { 
      console.log(txt); 
      displayNextPage(); 
    })
    .catch(reason => console.error(reason));
}

// start recursive page call
displayNextPage();