document.addEventListener('DOMContentLoaded', function() {
    const containerPreparo = document.querySelector('.em-preparo');
    const containerFinalizados = document.querySelector('.finalizados');
    
    let pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');


    if (pedidos.length === 0) { }

    function renderizarPedidos() {
        if (containerPreparo) {
            const titulo = containerPreparo.querySelector('h3');
            containerPreparo.innerHTML = '';
            if (titulo) containerPreparo.appendChild(titulo);
        }
        if (containerFinalizados) {
            const titulo = containerFinalizados.querySelector('h3');
            containerFinalizados.innerHTML = '';
            if (titulo) containerFinalizados.appendChild(titulo);
        }

        pedidos.forEach(pedido => {

            const status = (pedido.status || 'recebido').trim().toLowerCase();
            
            const ehPreparo = ['recebido', 'preparo', 'em-preparo', 'saiu-entrega'].includes(status);
            const container = ehPreparo ? containerPreparo : containerFinalizados;
            if (!container) return;

            let classeStatus = 'preparo';
            let textoStatus = 'Recebido';
            if (status === 'recebido') {
                textoStatus = 'Aguardando Preparo';
            } else if (['preparo', 'em-preparo'].includes(status)) {
                textoStatus = 'Em Preparo';
            } else if (['saiu-entrega', 'entrega', 'em-entrega'].includes(status)) {
                textoStatus = 'Saiu para Entrega';
            } else if (['entregue', 'concluido', 'finalizado'].includes(status)) {
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