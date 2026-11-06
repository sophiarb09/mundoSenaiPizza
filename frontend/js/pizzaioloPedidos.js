document.addEventListener('DOMContentLoaded', function () {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const perfil = usuarioLogado?.tipo || localStorage.getItem('perfilLogado');

    if (perfil !== 'admin' && perfil !== 'pizzaiolo') {
        alert('⚠️ Acesso restrito!');
        window.location.href = '/home.html';
        return;
    }

    const nomeUsuario = localStorage.getItem('nomeUsuario') ||
                        (perfil === 'admin' ? 'Administrador' : 'Pizzaiolo');
    const elNome = document.getElementById('nomePizzaiolo');
    if (elNome) elNome.textContent = nomeUsuario;

    const btnSair = document.getElementById('btnSairPizzaiolo');
    const botoesAba = document.querySelectorAll('.aba-btn');
    const conteudosAba = document.querySelectorAll('.aba-conteudo');
    const containerRecebidos = document.getElementById('pedidosRecebidos');
    const containerPreparo = document.getElementById('pedidosEmPreparo');
    const containerEntrega = document.getElementById('pedidosEmEntrega');

    function carregarPedidos() {
        const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
        
        return pedidos.map(pedido => {
            const status = (pedido.status || '').trim().toLowerCase();
            
            if (!pedido._processado && (status === 'em-preparo' || !status)) {
                pedido.status = 'recebido';
                pedido._processado = true;
            }
            return pedido;
        });
    }

    function salvarPedidos(pedidos) {
        localStorage.setItem('pedidos', JSON.stringify(pedidos));
    }

    function formatarData(dataStr) {
        return dataStr || '';
    }

    function calcularTotal(itens) {
        if (!itens || !Array.isArray(itens)) return 0;
        return itens.reduce((soma, item) => {
            const preco = item.preco || 0;
            const qtd = item.quantidade || 0;
            return soma + (preco * qtd);
        }, 0);
    }

    function normalizarStatus(pedido) {
        const status = (pedido.status || '').trim().toLowerCase();

        if (!status || ['recebido', 'recebida', 'novo'].includes(status)) {
            return 'recebido';
        }
        if (['preparo', 'em-preparo', 'preparando'].includes(status)) {
            return 'preparo';
        }
        if (['entrega', 'saiu-entrega', 'saindo', 'em-entrega', 'a caminho'].includes(status)) {
            return 'entrega';
        }
        if (['entregue', 'concluido', 'finalizado'].includes(status)) {
            return 'entregue';
        }
        return 'recebido';
    }

    function trocarAba(nomeAba) {
        botoesAba.forEach(btn => {
            btn.classList.toggle('ativa', btn.dataset.alvo === nomeAba);
        });
        conteudosAba.forEach(aba => {
            aba.classList.toggle('ativa', aba.id === `aba-${nomeAba}`);
        });
    }

    function renderizar() {
        const pedidos = carregarPedidos();
        salvarPedidos(pedidos);

        containerRecebidos.innerHTML = '';
        containerPreparo.innerHTML = '';
        containerEntrega.innerHTML = '';

        const temRecebidos = pedidos.some(p => normalizarStatus(p) === 'recebido');
        const temPreparo = pedidos.some(p => normalizarStatus(p) === 'preparo');
        const temEntrega = pedidos.some(p => normalizarStatus(p) === 'entrega');

        if (!temRecebidos) {
            containerRecebidos.innerHTML =
                '<p class="vazio">📭 Nenhum pedido recebido ainda. Aguardando os pedidos dos clientes!</p>';
        }
        if (!temPreparo) {
            containerPreparo.innerHTML =
                '<p class="vazio">🔥 Nenhum pedido em preparo no momento.</p>';
        }
        if (!temEntrega) {
            containerEntrega.innerHTML =
                '<p class="vazio">🚚 Nenhum pedido saindo para entrega agora.</p>';
        }

        pedidos.forEach((pedido, indice) => {
            const status = normalizarStatus(pedido);
            const total = calcularTotal(pedido.itens);
            const card = document.createElement('div');
            card.className = `pedido-card status-${status}`;

            let botoes = '';

            if (status === 'recebido') {
                botoes = `<button class="btn-acao btn-preparo" data-indice="${indice}" data-acao="preparo">
                            🔥 Iniciar Preparo
                        </button>`;
            } else if (status === 'preparo') {
                botoes = `<button class="btn-acao btn-saida" data-indice="${indice}" data-acao="entrega">
                            🚚 Sair para Entrega
                        </button>`;
            } else if (status === 'entrega') {
                botoes = `<button class="btn-acao btn-entregue" data-indice="${indice}" data-acao="entregue">
                            ✅ Marcar Entregue
                        </button>`;
            } else {
                botoes = `<button class="btn-acao btn-desativado" disabled>
                            Concluído
                        </button>`;
            }

            card.innerHTML = `
                <div class="pedido-cabecalho">
                    <span class="pedido-id">Pedido #${pedido.id}</span>
                    <span class="pedido-data">${formatarData(pedido.data)}</span>
                </div>
                <div class="pedido-itens">
                    ${(pedido.itens || []).map(item => `
                        <p class="pedido-item">
                            • ${item.nome} × ${item.quantidade} — R$ ${((item.preco || 0) * (item.quantidade || 0)).toFixed(2).replace('.', ',')}
                        </p>
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

            if (status === 'recebido') {
                containerRecebidos.appendChild(card);
            } else if (status === 'preparo') {
                containerPreparo.appendChild(card);
            } else if (status === 'entrega') {
                containerEntrega.appendChild(card);
            }
        });

        document.querySelectorAll('.btn-acao:not(:disabled)').forEach(btn => {
            btn.addEventListener('click', alterarStatus);
        });
    }

    function alterarStatus(e) {
        const indice = parseInt(e.target.dataset.indice);
        const acao = e.target.dataset.acao;
        const pedidos = carregarPedidos();

        if (acao === 'preparo') {
            pedidos[indice].status = 'preparo';
        } else if (acao === 'entrega') {
            pedidos[indice].status = 'saiu-entrega';
        } else if (acao === 'entregue') {
            pedidos[indice].status = 'entregue';
            alert(`Pedido #${pedidos[indice].id} entregue!`);
        }

        salvarPedidos(pedidos);
        renderizar();
    }

    botoesAba.forEach(btn => {
        btn.addEventListener('click', () => trocarAba(btn.dataset.alvo));
    });

    if (btnSair) {
        btnSair.addEventListener('click', function (e) {
            e.preventDefault();

            const desejaSair = confirm(
                'Deseja sair da conta?\n\n' +
                'OK = Sair\n' +
                'Cancelar = Permanecer na tela'
            );

            if (desejaSair) {
                localStorage.removeItem('usuarioLogado');
                localStorage.removeItem('perfilLogado');
                localStorage.removeItem('nomeUsuario');
                localStorage.removeItem('idUsuario');
                localStorage.removeItem('logado');
                window.location.href = '/index.html';
            }
        });
    }

    renderizar();
    setInterval(renderizar, 10000);
});