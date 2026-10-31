document.addEventListener('DOMContentLoaded', function() {
    const formLogin = document.getElementById('formLogin');

    if (!formLogin) return;

    const dadosSalvos = JSON.parse(localStorage.getItem('dadosUsuario') || 'null');
    if (dadosSalvos) {
        document.getElementById('campoUsuario').value = dadosSalvos.usuario || '';
        document.getElementById('campoEmail').value = dadosSalvos.email || '';
    }

    formLogin.addEventListener('submit', function(e) {
        e.preventDefault();

        const usuario = document.getElementById('campoUsuario').value.trim();
        const email = document.getElementById('campoEmail').value.trim();
        const senha = document.getElementById('campoSenha').value;

        if (usuario.length < 3) {
            alert('⚠️ O nome de usuário precisa ter pelo menos 3 caracteres!');
            document.getElementById('campoUsuario').focus();
            return;
        }

        if (!email.includes('@') || !email.includes('.')) {
            alert('⚠️ Por favor, insira um e-mail válido!');
            document.getElementById('campoEmail').focus();
            return;
        }

        if (senha.length < 6) {
            alert('⚠️ A senha precisa ter pelo menos 6 caracteres!');
            document.getElementById('campoSenha').focus();
            return;
        }

        localStorage.setItem('dadosUsuario', JSON.stringify({
            usuario: usuario,
            email: email
        }));

        localStorage.setItem('logado', 'true');
        localStorage.setItem('usuarioAtual', usuario);

        alert(`Bem-vindo, ${usuario}!`);
        
        window.location.href = 'home.html';
    });

    const linkSenha = document.querySelector('.link-senha');
    if (linkSenha) {
        linkSenha.addEventListener('click', function(e) {
            e.preventDefault();
            alert(' Função de recuperação de senha em manutenção.\nEntre em contato pelo telefone (XX) XXXXX-XXXX ou compareça à loja!');
        });
    }
});