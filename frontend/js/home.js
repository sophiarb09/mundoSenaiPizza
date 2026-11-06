document.addEventListener('DOMContentLoaded', function() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const perfil = usuarioLogado?.tipo || localStorage.getItem('perfilLogado');

    const linkAdmin = document.getElementById('linkAdmin');
    const linkPedidosPizzaiolo = document.getElementById('linkPedidosPizzaiolo');
    const linkMeusPedidos = document.getElementById('linkMeusPedidos');

    linkAdmin.style.display = 'none';
    linkPedidosPizzaiolo.style.display = 'none';
    linkMeusPedidos.style.display = 'inline-block';

    if (perfil === 'admin') {
    linkAdmin.style.display = 'inline-block';
    linkPedidosPizzaiolo.style.display = 'inline-block';
    linkMeusPedidos.style.display = 'none';
    }
    
    else if (perfil === 'pizzaiolo') {
        linkPedidosPizzaiolo.style.display = 'inline-block';
        linkMeusPedidos.style.display = 'none';
    }
});