document.addEventListener('DOMContentLoaded', function() {

    const links = document.querySelectorAll('nav a');
    const paginaAtual = window.location.pathname.split('/').pop();

    links.forEach(link => {
        if (link.getAttribute('href') === paginaAtual) {
            link.style.backgroundColor = '#ffccbc';
            link.style.color = '#b71c1c';
        }
    });

    const cards = document.querySelectorAll('.card');
    cards.forEach((card, indice) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `all 0.5s ease ${indice * 0.1}s`;
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100);
    });
});