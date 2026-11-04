document.addEventListener('DOMContentLoaded', function() {

    const perfil = localStorage.getItem('perfilLogado');
    if (perfil !== 'pizzaiolo') {
        alert('⚠️ Acesso restrito! Faça login como Pizzaiolo.');
        window.location.href = 'login.html';
        return;
    }

    const nomeUsuario = localStorage.getItem('nomeUsuario') || 'Pizzaiolo';
    const elNome = document.getElementById('nomePizzaiolo');
    if (elNome) elNome.textContent = nomeUsuario;

    const btnSair = document.getElementById('btnSairPizzaiolo');
    const containerRecebidos = document.getElementById('pedidosRecebidos');
    const containerPreparo = document.getElementById('pedidosEmPreparo');
    const containerEntrega = document.getElementById('pedidosEmEntrega');

    function carregarPedidos() {
        return JSON.parse(localStorage.getItem('pedidos') || '[]');
    }

    function salvarPedidos(pedidos) {
        localStorage.setItem('pedidos', JSON.stringify(pedidos));
    }

    function formatarData(dataStr) {
        if (!dataStr) return '';
        return dataStr;
    }

    function calcularTotal(itens) {
        return itens.reduce((soma, item) => soma + (item.preco * item.quantidade), 0);
    }

    function renderizar() {
        const pedidos = carregarPedidos();

        containerRecebidos.innerHTML = '';
        containerPreparo.innerHTML = '';
        containerEntrega.innerHTML = '';

        if (pedidos.length === 0) {
            containerRecebidos.innerHTML = '<p class="vazio">Nenhum pedido recebido ainda.</p>';
            return;
        }

        pedidos.forEach((pedido, indice) => {
            const total = calcularTotal(pedido.itens);
            const card = document.createElement('div');
            card.className = `pedido-card status-${pedido.status || 'recebido'}`;

            let botoes = '';
            if (pedido.status === 'recebido' || !pedido.status) {
                botoes = `<button class="btn-acao btn-preparo" data-indice="${indice}" data-acao="preparo">🔥 Iniciar Preparo</button>`;
            } else if (pedido.status === 'preparo') {
                botoes = `<button class="btn-acao btn-saida" data-indice="${indice}" data-acao="entrega">🚚 Sair para Entrega</button>`;
            } else if (pedido.status === 'entrega') {
                botoes = `<button class="btn-acao btn-entregue" data-indice="${indice}" data-acao="entregue">✅ Marcar Entregue</button>`;
            } else {
                botoes = `<button class="btn-acao btn-desativado" disabled>Concluído</button>`;
            }

            card.innerHTML = `
                <div class="pedido-cabecalho">
                    <span class="pedido-id">Pedido #${pedido.id}</span>
                    <span class="pedido-data">${formatarData(pedido.data)}</span>
                </div>
                <div class="pedido-itens">
                    ${pedido.itens.map(item => `
                        <p class="pedido-item">• ${item.nome} × ${item.quantidade} — R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</p>
                    `).join('')}
                </div>
                <div class="pedido-endereco">
                    <strong>📍 Entrega:</strong><br>
                    ${pedido.enderecoEntrega?.logradouro || ''}, ${pedido.enderecoEntrega?.numero || 's/n'}
                    ${pedido.enderecoEntrega?.complemento ? ` — ${pedido.enderecoEntrega.complemento}` : ''}<br>
                    ${pedido.enderecoEntrega?.bairro || ''} — ${pedido.enderecoEntrega?.cidade || ''}/${pedido.enderecoEntrega?.estado || ''}
                </div>
                <p class="pedido-total">Total: R$ ${total.toFixed(2).replace('.', ',')}</p>
                <div class="botoes-acao">${botoes}</div>
            `;

            if (!pedido.status || pedido.status === 'recebido') {
                containerRecebidos.appendChild(card);
            } else if (pedido.status === 'preparo') {
                containerPreparo.appendChild(card);
            } else if (pedido.status === 'entrega') {
                containerEntrega.appendChild(card);
            }
        });

        document.querySelectorAll('.btn-acao:not([disabled])').forEach(btn => {
            btn.addEventListener('click', alterarStatus);
        });
    }

    function alterarStatus(e) {
        const indice = parseInt(e.target.dataset.indice);
        const acao = e.target.dataset.acao;
        let pedidos = carregarPedidos();

        if (acao === 'preparo') {
            pedidos[indice].status = 'preparo';
        } else if (acao === 'entrega') {
            pedidos[indice].status = 'entrega';
        } else if (acao === 'entregue') {
            pedidos[indice].status = 'entregue';
            alert(`✅ Pedido #${pedidos[indice].id} entregue!`);
        }

        salvarPedidos(pedidos);
        renderizar();
    }

    if (btnSair) {
        btnSair.addEventListener('click', function() {
            localStorage.removeItem('perfilLogado');
            localStorage.removeItem('nomeUsuario');
            window.location.href = 'login.html';
        });
    }

    renderizar();
    setInterval(renderizar, 10000);
});