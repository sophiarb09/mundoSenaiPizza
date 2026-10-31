document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.grid-favoritos');
    let favoritosSalvos = JSON.parse(localStorage.getItem('favoritos') || []);

    const precos = {
        'Marguerita': 39.90,
        'Calabresa': 42.00,
        'Quatro Queijos': 48.50,
        'Chocolate com Morango': 45.00,
        'Banana com Canela': 38.00,
        'Vegetariana Completa': 46.00,
        'Pizza MammaMia Especial': 55.00
    };

    const descricoes = {
        'Marguerita': 'Molho de tomate, mussarela de búfala, tomate fatiado, manjericão fresco e azeite de oliva extra virgem.',
        'Calabresa': 'Linguiça calabresa fatiada, cebola roxa, azeitonas pretas, mussarela e orégano.',
        'Quatro Queijos': 'Mussarela, provolone, gorgonzola e parmesão ralado com molho branco.',
        'Chocolate com Morango': 'Chocolate meio amargo derretido, morangos frescos fatiados e granulado belga.',
        'Banana com Canela': 'Fatias de banana dourada, açúcar, canela em pó e leite condensado.',
        'Vegetariana Completa': 'Molho de tomate, abobrinha, berinjela, pimentão colorido, cenoura ralada, milho e ervilha.',
        'Pizza MammaMia Especial': 'Molho de tomate, mussarela, calabresa, champignon, pimentão e azeitonas.'
    };

    function carregarFavoritos() {
        if (!container) return;
        container.innerHTML = '';

        if (favoritosSalvos.length === 0) {
            container.innerHTML = `
                <div class="vazio" style="grid-column: 1/-1; padding: 60px 20px; text-align: center; color: #777; font-style: italic;">
                    <p>Você ainda não tem pizzas favoritas 😢</p>
                    <p style="margin-top: 10px;">Visite o <a href="cardapio.html" style="color: #e64a19; font-weight: bold; text-decoration: none;">Cardápio</a> e clique no ❤️ para salvar!</p>
                </div>
            `;
            return;
        }

        favoritosSalvos.forEach(nome => {
            const preco = precos[nome] || 0;
            const descricao = descricoes[nome] || 'Sua pizza favorita salva!';

            const card = document.createElement('div');
            card.className = 'favorito-card';
            card.innerHTML = `
                <h3>${nome} <span class="coracao">❤️</span></h3>
                <p class="preco">R$ ${preco.toFixed(2).replace('.', ',')}</p>
                <p class="descricao">${descricao}</p>
                <div class="botoes">
                    <button class="btn-comprar" data-nome="${nome}" data-preco="${preco}">Adicionar ao Pedido</button>
                    <button class="btn-remover" data-nome="${nome}">Remover</button>
                </div>
            `;
            container.appendChild(card);
        });
    }

    document.addEventListener('click', function(e) {
        // Botão REMOVER
        if (e.target.classList.contains('btn-remover')) {
            const nome = e.target.dataset.nome;
            favoritosSalvos = favoritosSalvos.filter(n => n !== nome);
            localStorage.setItem('favoritos', JSON.stringify(favoritosSalvos));
            carregarFavoritos();
        }

        // Botão ADICIONAR AO PEDIDO
        if (e.target.classList.contains('btn-comprar')) {
            const nome = e.target.dataset.nome;
            const preco = parseFloat(e.target.dataset.preco);
            const descricao = descricoes[nome] || 'Sua pizza favorita salva!';

            let carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
            const indiceExistente = carrinho.findIndex(item => item.nome === nome);
            
            if (indiceExistente > -1) {
                carrinho[indiceExistente].quantidade++;
            } else {
                carrinho.push({
                    nome: nome,
                    preco: preco,
                    descricao: descricao,
                    quantidade: 1
                });
            }

            localStorage.setItem('carrinho', JSON.stringify(carrinho));

            // Feedback visual
            const textoOriginal = e.target.textContent;
            e.target.textContent = ' Adicionado!';
            e.target.style.backgroundColor = '#2e7d32';
            e.target.style.color = 'white';
            
            setTimeout(() => {
                e.target.textContent = textoOriginal;
                e.target.style.backgroundColor = '';
                e.target.style.color = '';
            }, 1500);
        }
    });

    carregarFavoritos();
});