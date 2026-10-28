/*
window.addEventListener('load', () => {
    const salvo = localStorage.getItem('usuarioLogado');
    
    if (!salvo) {
        window.location.href = '../index.html';
        return;
    }

    const usuario = JSON.parse(salvo);
    if (!usuario.logado) {
        window.location.href = '../index.html';
        return;
    }

    document.getElementById('nomeUsuario').textContent = usuario.nome;
});
*/

function sair() {
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('pedidos');
    window.location.href = '../index.html';
}