const inp = document.querySelector('#inp1');

inp.addEventListener('keydown', function(e) {
    console.log(e);
    document.querySelector('#kar').innerHTML = e.key;
    document.querySelector('#code').innerHTML = e.keyCode;
    document.querySelector('#shift').innerHTML = e.shiftKey ? 'ja' : 'nee ';
});
