document.addEventListener('DOMContentLoaded', function() {
    const inputBusca = document.querySelector('.busca input');
    const categorias = document.querySelectorAll('.categoria');
    const cardsPizza = document.querySelectorAll('.pizza-card');
    const botoesFavoritar = document.querySelectorAll('.btn-favorito');
    const botoesComprar = document.querySelectorAll('.btn-comprar');

    let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');

    botoesFavoritar.forEach(botao => {
        const card = botao.closest('.pizza-card');
        const nome = card.querySelector('h3').textContent;

        if (favoritos.includes(nome)) {
            botao.classList.add('favoritado');
            botao.innerHTML = '❤️';
        } else {
            botao.classList.remove('favoritado');
            botao.innerHTML = '🤍';
        }
    });

    if (inputBusca) {
        inputBusca.addEventListener('input', function() {
            const termo = this.value.toLowerCase();
            cardsPizza.forEach(card => {
                const nome = card.querySelector('h3').textContent.toLowerCase();
                const descricao = card.querySelector('.descricao').textContent.toLowerCase();
                card.style.display = (nome.includes(termo) || descricao.includes(termo)) ? 'block' : 'none';
            });
        });
    }

    categorias.forEach(cat => {
        cat.addEventListener('click', function() {
            categorias.forEach(c => c.classList.remove('ativa'));
            this.classList.add('ativa');
            const catSelecionada = this.textContent.toLowerCase();
            cardsPizza.forEach(card => {
                const catCard = card.getAttribute('data-categoria');
                card.style.display = (catSelecionada === 'todos' || catCard === catSelecionada) ? 'block' : 'none';
            });
        });
    });

    botoesFavoritar.forEach(botao => {
        botao.addEventListener('click', function() {
            const card = this.closest('.pizza-card');
            const nomePizza = card.querySelector('h3').textContent;

            favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');

            if (this.classList.contains('favoritado')) {

                favoritos = favoritos.filter(n => n !== nomePizza);
                this.classList.remove('favoritado');
                this.innerHTML = '🤍';
            } else {

                favoritos.push(nomePizza);
                this.classList.add('favoritado');
                this.innerHTML = '❤️';
            }

            localStorage.setItem('favoritos', JSON.stringify(favoritos));
        });
    });

    botoesComprar.forEach(botao => {
        botao.addEventListener('click', function() {
            const card = this.closest('.pizza-card');
            const item = {
                nome: card.querySelector('h3').textContent,
                preco: parseFloat(card.querySelector('.preco').textContent.replace('R$ ', '').replace(',', '.')),
                descricao: card.querySelector('.descricao').textContent,
                quantidade: 1
            };
            let carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
            const indice = carrinho.findIndex(i => i.nome === item.nome);
            if (indice > -1) {
                carrinho[indice].quantidade++;
            } else {
                carrinho.push(item);
            }
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            
            this.textContent = ' Adicionado!';
            setTimeout(() => {
                this.textContent = 'Adicionar ao Pedido';
            }, 1500);
        });
    });
});