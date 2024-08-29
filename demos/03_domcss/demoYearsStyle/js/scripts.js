const currentYear = new Date().getFullYear();
const years = document.querySelectorAll('#jaar li');
years.forEach(li => {
    if (li.innerHTML == currentYear) {
        li.style.border = '3px dotted black';
        li.style.backgroundColor = '#aaf';
        li.style.color = 'white';
        li.style.fontStyle = 'italic';
    }    
});
