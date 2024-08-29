const body = document.querySelector('body');
body.addEventListener('click', function(e) {
   console.log(body)
   console.log(e);
    document.querySelector('#pos').innerHTML 
        = `(${e.clientX}, ${e.clientY})`;
});
