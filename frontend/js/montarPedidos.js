document.addEventListener('DOMContentLoaded', function() {
    const containerCarrinho = document.querySelector('.carrinho');
    const formEndereco = document.getElementById('formEndereco');
    let carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');

    function renderizarCarrinho() {
        if (!containerCarrinho) return;
        containerCarrinho.innerHTML = '';
        let totalGeral = 0;

        if (carrinho.length === 0) {
            containerCarrinho.innerHTML = `
                <p class="vazio">Seu carrinho está vazio 😢</p>
                <a href="cardapio.html" style="display:block;text-align:center;margin-top:15px;color:#e64a19;font-weight:bold;text-decoration:none;">Ir ao Cardápio</a>
            `;
            if (formEndereco) formEndereco.style.display = 'none';
            return;
        }

        if (formEndereco) formEndereco.style.display = 'block';

        carrinho.forEach((item, indice) => {
            const subtotal = item.preco * item.quantidade;
            totalGeral += subtotal;
            const elemento = document.createElement('div');
            elemento.className = 'item';
            elemento.innerHTML = `
                <div>
                    <p class="item-nome">${item.nome}</p>
                    <p class="item-detalhe">${item.descricao || ''}</p>
                </div>
                <div class="item-qtd">
                    <button class="qtd-btn" data-indice="${indice}" data-acao="diminuir">−</button>
                    <span>${item.quantidade}</span>
                    <button class="qtd-btn" data-indice="${indice}" data-acao="aumentar">+</button>
                </div>
                <p class="item-preco">R$ ${subtotal.toFixed(2).replace('.', ',')}</p>
                <button class="remover" data-indice="${indice}">🗑️</button>
            `;
            containerCarrinho.appendChild(elemento);
        });

        const elTotal = document.createElement('p');
        elTotal.className = 'total';
        elTotal.textContent = `Total: R$ ${totalGeral.toFixed(2).replace('.', ',')}`;
        containerCarrinho.appendChild(elTotal);

        document.querySelectorAll('.qtd-btn').forEach(btn => btn.addEventListener('click', alterarQtd));
        document.querySelectorAll('.remover').forEach(btn => btn.addEventListener('click', removerItem));
    }

    function alterarQtd(e) {
        const indice = parseInt(e.target.dataset.indice);
        const acao = e.target.dataset.acao;

        if (acao === 'aumentar') carrinho[indice].quantidade++;
        else if (acao === 'diminuir') {
            carrinho[indice].quantidade--;
            if (carrinho[indice].quantidade <= 0) carrinho.splice(indice, 1);
        }

        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        renderizarCarrinho();
    }

    function removerItem(e) {
        const indice = parseInt(e.target.dataset.indice);
        carrinho.splice(indice, 1);
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        renderizarCarrinho();
    }

    const campoCep = document.getElementById('cep');
    if (campoCep) {
        campoCep.addEventListener('input', function() {
            let valor = this.value.replace(/\D/g, '');
            if (valor.length > 5) valor = valor.slice(0, 5) + '-' + valor.slice(5);
            this.value = valor;
        });
    }

    const enderecoSalvo = JSON.parse(localStorage.getItem('enderecoEntrega') || 'null');
    if (enderecoSalvo) preencherEndereco(enderecoSalvo);

    function preencherEndereco(dados) {
        document.getElementById('cep').value = dados.cep || '';
        document.getElementById('logradouro').value = dados.logradouro || '';
        document.getElementById('numero').value = dados.numero || '';
        document.getElementById('complemento').value = dados.complemento || '';
        document.getElementById('bairro').value = dados.bairro || '';
        document.getElementById('cidade').value = dados.cidade || '';
        document.getElementById('estado').value = dados.estado || '';
        document.getElementById('pontoReferencia').value = dados.pontoReferencia || '';
    }

    // === Finalizar Pedido ===
    if (formEndereco) {
        formEndereco.addEventListener('submit', function(e) {
            e.preventDefault();

            if (carrinho.length === 0) {
                alert('⚠️ Adicione itens ao carrinho primeiro!');
                return;
            }

            const endereco = {
                cep: document.getElementById('cep').value.trim(),
                logradouro: document.getElementById('logradouro').value.trim(),
                numero: document.getElementById('numero').value.trim(),
                complemento: document.getElementById('complemento').value.trim(),
                bairro: document.getElementById('bairro').value.trim(),
                cidade: document.getElementById('cidade').value.trim(),
                estado: document.getElementById('estado').value,
                pontoReferencia: document.getElementById('pontoReferencia').value.trim()
            };

            if (endereco.cep.replace(/\D/g, '').length < 8) {
                alert('⚠️ Digite um CEP válido!');
                campoCep.focus();
                return;
            }
            if (!endereco.estado) {
                alert('⚠️ Selecione o estado!');
                document.getElementById('estado').focus();
                return;
            }

            localStorage.setItem('enderecoEntrega', JSON.stringify(endereco));

            const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
            const novoPedido = {
                id: String(pedidos.length + 1).padStart(3, '0'),
                data: new Date().toLocaleString('pt-BR'),
                itens: carrinho,
                enderecoEntrega: endereco,
                status: 'em-preparo'
            };

            pedidos.unshift(novoPedido);
            localStorage.setItem('pedidos', JSON.stringify(pedidos));

            carrinho = [];
            localStorage.setItem('carrinho', '[]');

            alert(`🎉 Pedido finalizado!\n\n📍 Entrega para:\n${endereco.logradouro}, ${endereco.numero}\n${endereco.bairro} — ${endereco.cidade}/${endereco.estado}\n\nAcompanhe em "Meus Pedidos"!`);

            window.location.href = 'meusPedidos.html';
        });
    }

    renderizarCarrinho();
});