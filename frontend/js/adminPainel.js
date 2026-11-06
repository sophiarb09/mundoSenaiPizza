document.addEventListener('DOMContentLoaded', function() {

    const perfil = localStorage.getItem('perfilLogado');
    if (perfil !== 'admin') {
        alert('⚠️ Acesso restrito! Faça index como Administrador.');
        window.location.href = '../html/index.html';
        return;
    }

    const nomeUsuario = localStorage.getItem('nomeUsuario') || 'Admin';
    const elNome = document.getElementById('nomeAdmin');
    if (elNome) elNome.textContent = nomeUsuario;

    const formSabor = document.getElementById('formSabor');
    const listaSabores = document.getElementById('listaSabores');
    const btnSair = document.getElementById('btnSairAdmin');

    let sabores = JSON.parse(localStorage.getItem('saboresCardapio') || '[]');

    function renderizarSabores() {
        if (!listaSabores) return;
        listaSabores.innerHTML = '';

        if (sabores.length === 0) {
            listaSabores.innerHTML = '<p class="vazio">Nenhum sabor cadastrado ainda. Adicione o primeiro!</p>';
            return;
        }

        sabores.forEach((sabor, indice) => {
            const card = document.createElement('div');
            card.className = 'sabor-card';
            card.innerHTML = `
                <div class="sabor-info">
                    <h4>${sabor.nome} <span class="categoria">${sabor.categoria === 'salgado' ? 'Salgado' : 'Doce'}</span></h4>
                    <p>${sabor.ingredientes}</p>
                    <span class="sabor-preco">R$ ${sabor.preco.toFixed(2).replace('.', ',')}</span>
                </div>
                <button class="btn-excluir" data-indice="${indice}">🗑️ Excluir</button>
            `;
            listaSabores.appendChild(card);
        });

        document.querySelectorAll('.btn-excluir').forEach(btn => {
            btn.addEventListener('click', function() {
                const indice = parseInt(this.dataset.indice);
                if (confirm(`Tem certeza que deseja excluir "${sabores[indice].nome}"?`)) {
                    sabores.splice(indice, 1);
                    salvarERenderizar();
                }
            });
        });
    }

    function salvarERenderizar() {
        localStorage.setItem('saboresCardapio', JSON.stringify(sabores));
        renderizarSabores();
    }

    if (formSabor) {
        formSabor.addEventListener('submit', function(e) {
            e.preventDefault();

            const novoSabor = {
                nome: document.getElementById('nomeSabor').value.trim(),
                categoria: document.getElementById('categoriaSabor').value,
                preco: parseFloat(document.getElementById('precoSabor').value),
                ingredientes: document.getElementById('ingredientesSabor').value.trim()
            };

            if (!novoSabor.nome || !novoSabor.categoria || isNaN(novoSabor.preco) || !novoSabor.ingredientes) {
                alert('⚠️ Preencha todos os campos corretamente!');
                return;
            }

            sabores.push(novoSabor);
            salvarERenderizar();
            formSabor.reset();
            alert(` Sabor "${novoSabor.nome}" adicionado com sucesso!`);
        });
    }

    if (btnSair) {
        btnSair.addEventListener('click', function() {
            localStorage.removeItem('perfilLogado');
            localStorage.removeItem('nomeUsuario');
            window.location.href = '../html/index.html';
        });
    }

    renderizarSabores();
});