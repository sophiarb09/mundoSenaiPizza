document.addEventListener('DOMContentLoaded', function() {
    const perfil = localStorage.getItem('perfilLogado');
    const btnAddSabor = document.getElementById('btnAddSabor');
    const gridPizzas = document.getElementById('gridPizzas');
    const buscaSabor = document.getElementById('buscaSabor');
    const categorias = document.querySelectorAll('.categoria');

    // MOSTRA BOTÃO SÓ PARA ADMIN
    if (perfil === 'admin' && btnAddSabor) {
        btnAddSabor.style.display = 'block';
        btnAddSabor.addEventListener('click', function() {
            window.location.href = '../adminHtml/adminPainel.html';
        });
    }

    // Pizzas fixas
    const pizzasFixas = [
        { nome: 'Marguerita', preco: 39.90, categoria: 'salgado', descricao: 'Molho de tomate, mussarela de búfala, tomate fatiado, manjericão fresco e azeite de oliva extra virgem.' },
        { nome: 'Calabresa', preco: 42.00, categoria: 'salgado', descricao: 'Linguiça calabresa fatiada, cebola roxa, azeitonas pretas, mussarela e orégano.' },
        { nome: 'Quatro Queijos', preco: 48.50, categoria: 'salgado', descricao: 'Mussarela, provolone, gorgonzola e parmesão ralado com molho branco.' },
        { nome: 'Chocolate com Morango', preco: 45.00, categoria: 'doce', descricao: 'Chocolate meio amargo derretido, morangos frescos fatiados e granulado belga.' },
        { nome: 'Banana com Canela', preco: 38.00, categoria: 'doce', descricao: 'Fatias de banana dourada, açúcar, canela em pó e leite condensado.' },
        { nome: 'Vegetariana Completa', preco: 46.00, categoria: 'vegetariano', descricao: 'Molho de tomate, abobrinha, berinjela, pimentão colorido, cenoura ralada, milho e ervilha.' },
        { nome: 'MammaMia Especial', preco: 55.00, categoria: 'especiais', descricao: 'Molho de tomate, mussarela, presunto, calabresa, frango desfiado, catupiry, ovos e azeitonas.' }
    ];

    // CARREGA SABORES CADASTRADOS PELO ADMIN
    const saboresCadastrados = JSON.parse(localStorage.getItem('saboresCardapio') || '[]');
    
    // Junta tudo: fixas + cadastradas
    const todasPizzas = [...pizzasFixas, ...saboresCadastrados];

    function renderizarPizzas(filtro = 'todos', termoBusca = '') {
        if (!gridPizzas) return;
        gridPizzas.innerHTML = '';

        todasPizzas.forEach(pizza => {
            const combinaFiltro = filtro === 'todos' || pizza.categoria === filtro;
            const combinaBusca = termoBusca === '' || pizza.nome.toLowerCase().includes(termoBusca.toLowerCase());

            if (combinaFiltro && combinaBusca) {
                const card = document.createElement('div');
                card.className = 'pizza-card';
                card.dataset.categoria = pizza.categoria;
                card.innerHTML = `
                    <h3>${pizza.nome}</h3>
                    <p class="preco">R$ ${pizza.preco.toFixed(2).replace('.', ',')}</p>
                    <p class="descricao">${pizza.descricao || pizza.ingredientes || ''}</p>
                    <div class="botoes">
                        <button class="btn-comprar" data-nome="${pizza.nome}" data-preco="${pizza.preco}">Adicionar ao Pedido</button>
                        <button class="btn-favorito">🤍</button>
                    </div>
                `;
                gridPizzas.appendChild(card);
            }
        });

        atualizarBotoesFavoritos();
    }

    // Busca
    if (buscaSabor) {
        buscaSabor.addEventListener('input', function() {
            const filtroAtivo = document.querySelector('.categoria.ativa')?.dataset.filtro || 'todos';
            renderizarPizzas(filtroAtivo, this.value);
        });
    }

    // Filtro por categoria
    categorias.forEach(cat => {
        cat.addEventListener('click', function() {
            categorias.forEach(c => c.classList.remove('ativa'));
            this.classList.add('ativa');
            renderizarPizzas(this.dataset.filtro, buscaSabor?.value || '');
        });
    });

    // Adicionar ao pedido
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-comprar')) {
            const nome = e.target.dataset.nome;
            const preco = parseFloat(e.target.dataset.preco);
            
            let carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
            const indice = carrinho.findIndex(i => i.nome === nome);
            
            if (indice >= 0) {
                carrinho[indice].quantidade += 1;
            } else {
                carrinho.push({ nome, preco, quantidade: 1 });
            }
            
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            alert(`✅ ${nome} adicionada ao carrinho!`);
        }
    });

    // Favoritos
    function atualizarBotoesFavoritos() {
        const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
        document.querySelectorAll('.btn-favorito').forEach((btn, indice) => {
            const pizza = todasPizzas[indice];
            btn.textContent = favoritos.some(f => f.nome === pizza?.nome) ? '❤️' : '🤍';
        });
    }

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-favorito')) {
            const card = e.target.closest('.pizza-card');
            if (!card) return;
            const indice = Array.from(gridPizzas.children).indexOf(card);
            const pizza = todasPizzas[indice];
            if (!pizza) return;

            let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
            const existe = favoritos.some(f => f.nome === pizza.nome);

            if (existe) {
                favoritos = favoritos.filter(f => f.nome !== pizza.nome);
                e.target.textContent = '🤍';
            } else {
                favoritos.push({ nome: pizza.nome, preco: pizza.preco, descricao: pizza.descricao || pizza.ingredientes });
                e.target.textContent = '❤️';
            }

            localStorage.setItem('favoritos', JSON.stringify(favoritos));
        }
    });

    renderizarPizzas();
});