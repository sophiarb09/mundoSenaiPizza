document.addEventListener('DOMContentLoaded', function() {
    const containerPreparo = document.querySelector('.em-preparo');
    const containerFinalizados = document.querySelector('.finalizados');
    
    let pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');

    if (pedidos.length === 0) {
        pedidos = [
            {
                id: '042',
                data: '30/10/2026 — 19:45',
                itens: [
                    { nome: 'Pizza MammaMia Especial', preco: 55.00, quantidade: 1 },
                    { nome: 'Pizza Chocolate com Morango', preco: 45.00, quantidade: 1 },
                    { nome: 'Refrigerante Lata', preco: 5.00, quantidade: 2 }
                ],
                status: 'em-preparo'
            },
            {
                id: '043',
                data: '30/10/2026 — 20:10',
                itens: [
                    { nome: 'Pizza Calabresa', preco: 42.00, quantidade: 1 }
                ],
                status: 'saiu-entrega'
            },
            {
                id: '039',
                data: '28/10/2026 — 20:30',
                itens: [
                    { nome: 'Pizza Quatro Queijos', preco: 48.50, quantidade: 1 },
                    { nome: 'Refrigerante 2L', preco: 8.00, quantidade: 1 }
                ],
                status: 'entregue'
            },
            {
                id: '035',
                data: '25/10/2026 — 19:15',
                itens: [
                    { nome: 'Pizza Marguerita', preco: 39.90, quantidade: 2 },
                    { nome: 'Pizza Banana com Canela', preco: 38.00, quantidade: 1 }
                ],
                status: 'entregue'
            }
        ];
    }

    function renderizarPedidos() {
        if (containerPreparo) {
            const titulo = containerPreparo.querySelector('h3');
            containerPreparo.innerHTML = '';
            containerPreparo.appendChild(titulo);
        }
        if (containerFinalizados) {
            const titulo = containerFinalizados.querySelector('h3');
            containerFinalizados.innerHTML = '';
            containerFinalizados.appendChild(titulo);
        }

        pedidos.forEach(pedido => {
            const ehPreparo = pedido.status === 'em-preparo' || pedido.status === 'saiu-entrega';
            const container = ehPreparo ? containerPreparo : containerFinalizados;
            if (!container) return;

            let classeStatus = 'preparo';
            let textoStatus = 'Em Preparo';
            if (pedido.status === 'saiu-entrega') {
                textoStatus = 'Saiu para Entrega';
            } else if (pedido.status === 'entregue') {
                classeStatus = 'finalizado';
                textoStatus = 'Entregue';
            }

            const total = pedido.itens.reduce((soma, item) => soma + (item.preco * item.quantidade), 0);

            const card = document.createElement('div');
            card.className = 'pedido-card';
            card.innerHTML = `
                <div class="pedido-header">
                    <span class="pedido-numero">Pedido #${pedido.id}</span>
                    <span class="status ${classeStatus}">${textoStatus}</span>
                </div>
                <p class="pedido-data">Data: ${pedido.data}</p>
                <ul class="pedido-itens">
                    ${pedido.itens.map(i => `<li>${i.quantidade}x ${i.nome} — R$ ${(i.preco * i.quantidade).toFixed(2).replace('.', ',')}</li>`).join('')}
                </ul>
                <p class="pedido-total">Total: R$ ${total.toFixed(2).replace('.', ',')}</p>
            `;
            container.appendChild(card);
        });

        if (containerPreparo && containerPreparo.children.length === 1) {
            const vazio = document.createElement('p');
            vazio.className = 'vazio';
            vazio.textContent = 'Nenhum pedido em preparo no momento 🕐';
            containerPreparo.appendChild(vazio);
        }
        if (containerFinalizados && containerFinalizados.children.length === 1) {
            const vazio = document.createElement('p');
            vazio.className = 'vazio';
            vazio.textContent = 'Nenhum pedido finalizado ainda';
            containerFinalizados.appendChild(vazio);
        }
    }

    renderizarPedidos();
});