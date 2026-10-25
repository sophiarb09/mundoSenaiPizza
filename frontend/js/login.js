/*
document.getElementById('botaoEntrar').addEventListener('click', fazerLogin);

function fazerLogin() {
    const usuario = document.getElementById('campoUsuario').value;
    const senha = document.getElementById('campoSenha').value;

    if (usuario && senha) {
        
        localStorage.setItem('usuarioLogado', JSON.stringify({
            nome: usuario,
            logado: true
        }));

        window.location.href = 'home.html';

    } else {
        alert('Preencha usuário e senha!');
    }
}
*/

function teste(){
    window.location.href = 'home.html';
} 