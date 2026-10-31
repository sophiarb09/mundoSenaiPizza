document.addEventListener('DOMContentLoaded', function() {
    const btnLocalizacao = document.querySelector('.btn-local');
    const listaFiliais = document.querySelector('.filiais');

    if (btnLocalizacao) {
        btnLocalizacao.addEventListener('click', function() {
            btnLocalizacao.textContent = '📍 Obtendo localização...';
            btnLocalizacao.disabled = true;
            btnLocalizacao.style.opacity = '0.7';

            setTimeout(() => {
                btnLocalizacao.textContent = ' Localização identificada!';
                if (listaFiliais) {
                    listaFiliais.style.opacity = '0';
                    listaFiliais.style.transform = 'translateY(10px)';
                    listaFiliais.style.transition = 'all 0.4s ease';
                    setTimeout(() => {
                        listaFiliais.style.opacity = '1';
                        listaFiliais.style.transform = 'translateY(0)';
                    }, 100);
                }
                const distancias = document.querySelectorAll('.distancia');
                distancias.forEach(dist => {
                    dist.style.color = '#2e7d32';
                });
            }, 1500);
        });
    }
});