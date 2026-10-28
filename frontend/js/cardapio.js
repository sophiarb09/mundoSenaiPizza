
/* LISTA DE SABORES */

const sabores = [
    {
        numero: "02",
        nome: "Quatro Queijos",
        ingredientes: "Mussarela, orégano, molho de tomate, azeitonas, requeijão cremoso, provolone e parmesão."
    },
    {
        numero: "03",
        nome: "Tomate Seco com Rúcula",
        ingredientes: "Mussarela, orégano, molho de tomate, azeitonas, tomate seco e rúcula."
    },
    {
        numero: "04",
        nome: "Calabresa",
        ingredientes: "Mussarela, orégano, molho de tomate, azeitonas, calabresa e cebola em rodelas."
    },
    {
        numero: "06",
        nome: "Portuguesa",
        ingredientes: "Mussarela, orégano, molho de tomate, azeitonas, presunto picado, cebola em rodelas e ovos."
    },
    {
        numero: "07",
        nome: "Paulista",
        ingredientes: "Mussarela, orégano, molho de tomate, azeitonas, presunto picado, palmito e ervilhas."
    },
    {
        numero: "08",
        nome: "Bacon",
        ingredientes: "Mussarela, orégano, molho de tomate, azeitonas e bacon."
    },
    {
        numero: "09",
        nome: "Fiorentina",
        ingredientes: "Mussarela, orégano, molho de tomate, azeitonas, presunto picado, champignon e ovos."
    },
    {
        numero: "10",
        nome: "Lombinho",
        ingredientes: "Mussarela, orégano, molho de tomate, azeitonas, lombinho defumado, tomate e parmesão."
    },
    {
        numero: "11",
        nome: "Frango Catupiry",
        ingredientes: "Mussarela, orégano, molho de tomate, azeitonas, frango e requeijão cremoso."
    },
    {
        numero: "12",
        nome: "Marguerita",
        ingredientes: "Mussarela, orégano, molho de tomate, azeitonas, parmesão, manjericão e tomates."
    },
    {
        numero: "14",
        nome: "Romanesca",
        ingredientes: "Mussarela, orégano, molho de tomate, azeitonas, presunto picado, ervilhas, requeijão cremoso e ovos."
    },
    {
        numero: "15",
        nome: "Palmito",
        ingredientes: "Mussarela, orégano, molho de tomate, azeitonas e palmito."
    },
    {
        numero: "16",
        nome: "Aglio",
        ingredientes: "Mussarela, orégano, molho de tomate, azeitonas, alho frito e parmesão."
    },
    {
        numero: "17",
        nome: "Vegetariana",
        ingredientes: "Mussarela, orégano, molho de tomate, azeitonas, brócolis, palmito, tomate, champignon e parmesão."
    }
];

/* VARIÁVEIS */

const precoPizza = 73.90;

let quantidade = 1;
let selecionados = [];
let carrinho = [];

/* ELEMENTOS HTML */

const listaSabores = document.getElementById("lista-sabores");
const quantidadeTexto = document.getElementById("quantidade");
const totalTexto = document.getElementById("total");
const resumoSabores = document.getElementById("sabores-selecionados");
const itensCarrinho = document.getElementById("itens-carrinho");
const totalCarrinho = document.getElementById("total-carrinho");

/* FORMATAR MOEDA */

function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

/* MOSTRAR SABORES */

function mostrarSabores() {
    listaSabores.innerHTML = "";

    sabores.forEach((sabor, indice) => {
        const ativo = selecionados.includes(indice);

        const div = document.createElement("div");
        div.className = ativo ? "sabor ativo" : "sabor";

        div.innerHTML = `
            <div class="icone-pizza">🍕</div>

            <div class="info-sabor">
                <h4>${sabor.numero} ${sabor.nome}</h4>
                <p>${sabor.ingredientes}</p>
            </div>

            <button
                class="btn-sabor"
                aria-label="${ativo ? "Remover" : "Adicionar"} ${sabor.nome}"
                aria-pressed="${ativo}"
            >
                ${ativo ? "−" : "+"}
            </button>
        `;

        div.querySelector("button").addEventListener("click", () => {
            selecionarSabor(indice);
        });

        listaSabores.appendChild(div);
    });
}

/* SELECIONAR OU REMOVER SABOR */

function selecionarSabor(indice) {
    if (selecionados.includes(indice)) {
        selecionados = selecionados.filter(
            item => item !== indice
        );
    } else {
        selecionados.push(indice);
    }

    mostrarSabores();
    atualizarTotal();
}

/* ATUALIZAR PREÇO */

function atualizarTotal() {
    quantidadeTexto.textContent = quantidade;

    if (selecionados.length === 0) {
        totalTexto.textContent = formatarMoeda(0);
        resumoSabores.textContent = "Nenhum sabor selecionado";
        return;
    }

    const total = precoPizza * quantidade;

    totalTexto.textContent = formatarMoeda(total);

    const nomes = selecionados.map(
        indice => sabores[indice].nome
    );

    resumoSabores.textContent =
        "Sabores selecionados: " + nomes.join(", ");
}

/* AUMENTAR QUANTIDADE */

document.getElementById("aumentar").addEventListener("click", () => {
    quantidade++;
    atualizarTotal();
});

/* DIMINUIR QUANTIDADE */

document.getElementById("diminuir").addEventListener("click", () => {
    if (quantidade > 1) {
        quantidade--;
        atualizarTotal();
    }
});

/* ADICIONAR AO CARRINHO */

document.getElementById("adicionar-pedido")
    .addEventListener("click", () => {

        if (selecionados.length === 0) {
            alert("Selecione pelo menos um sabor!");
            return;
        }

        const nomes = selecionados.map(
            indice => sabores[indice].nome
        );

        const pedido = {
            quantidade: quantidade,
            sabores: nomes,
            preco: precoPizza * quantidade
        };

        carrinho.push(pedido);

        mostrarCarrinho();

        alert("Pizza adicionada ao pedido!");

        selecionados = [];
        quantidade = 1;

        mostrarSabores();
        atualizarTotal();
    });

/* MOSTRAR CARRINHO */

function mostrarCarrinho() {
    itensCarrinho.innerHTML = "";

    if (carrinho.length === 0) {
        itensCarrinho.innerHTML =
            "<p>Seu carrinho está vazio.</p>";
    }

    let total = 0;

    carrinho.forEach((pedido, indice) => {
        total += pedido.preco;

        const div = document.createElement("div");
        div.className = "item-carrinho";

        const info = document.createElement("div");

        const titulo = document.createElement("strong");
        titulo.textContent =
            `${pedido.quantidade}x Pizza Gigante + Pureza 1,5L`;

        const descricao = document.createElement("p");
        descricao.textContent =
            "Sabores: " + pedido.sabores.join(", ");

        const preco = document.createElement("p");
        preco.textContent = formatarMoeda(pedido.preco);

        info.append(titulo, descricao, preco);

        const botao = document.createElement("button");
        botao.className = "btn-remover";
        botao.textContent = "Remover";

        botao.addEventListener("click", () => {
            removerPedido(indice);
        });

        div.append(info, botao);
        itensCarrinho.appendChild(div);
    });

    totalCarrinho.textContent = formatarMoeda(total);
}

/* REMOVER PEDIDO */

function removerPedido(indice) {
    carrinho.splice(indice, 1);
    mostrarCarrinho();
}

/* FINALIZAR PEDIDO */

document.getElementById("finalizar")
    .addEventListener("click", () => {

        if (carrinho.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }

        alert(
            "Pedido registrado na demonstração! " +
            "A integração com o sistema de pedidos " +
            "ainda precisa ser implementada."
        );
    });

/* INICIAR SISTEMA */

mostrarSabores();
atualizarTotal();
mostrarCarrinho();
