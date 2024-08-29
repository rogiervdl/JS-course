const currentYear = new Date().getFullYear();
const years = document.querySelectorAll('#jaar li');
years.forEach(li => {
    if (li.innerHTML == currentYear) {
        li.classList.add('todayYear')
    }    
});
