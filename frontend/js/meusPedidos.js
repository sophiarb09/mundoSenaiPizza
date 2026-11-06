document.addEventListener('DOMContentLoaded', function() {

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const perfil = usuarioLogado?.tipo || localStorage.getItem('perfilLogado');

    const linkMeusPedidos = document.getElementById('linkMeusPedidos');
    const linkAdmin = document.getElementById('linkAdmin');
    const linkPedidosPizzaiolo = document.getElementById('linkPedidosPizzaiolo');

    linkMeusPedidos.style.display = 'none';
    linkAdmin.style.display = 'none';
    linkPedidosPizzaiolo.style.display = 'none';

  
    if (perfil === 'cliente') {
        linkMeusPedidos.style.display = 'inline-block';
    }
    else if (perfil === 'admin') {
        linkAdmin.style.display = 'inline-block';
        linkPedidosPizzaiolo.style.display = 'inline-block';
        linkMeusPedidos.style.display = 'none'; 
    }
    else if (perfil === 'pizzaiolo') {
        linkPedidosPizzaiolo.style.display = 'inline-block';
        linkMeusPedidos.style.display = 'none';
    }

    const containerPreparo = document.querySelector('.em-preparo');
    const containerFinalizados = document.querySelector('.finalizados');
    const idCliente = localStorage.getItem('idUsuario');
    
    let pedidos = [];
    if (idCliente) {
        pedidos = JSON.parse(localStorage.getItem(`pedidos_${idCliente}`) || '[]');
    }

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
            let textoStatus = 'Aguardando Preparo';
            if (['preparo', 'em-preparo'].includes(status)) {
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

    if (perfil === 'cliente') {
        renderizarPedidos();
    }
});