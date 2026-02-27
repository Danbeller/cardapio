let carrinho = [];
let numeroWhatsApp = "5518996622714";
let tempoExpiracao = 36 * 60 * 60 * 1000; // 36 horas em ms

// =============================
// SALVAR HISTÓRICO
// =============================
function salvarHistorico(pedido) {

    let historico = JSON.parse(localStorage.getItem("historicoPedidos")) || [];

    historico.push({
        data: new Date().getTime(),
        conteudo: pedido
    });

    localStorage.setItem("historicoPedidos", JSON.stringify(historico));
}

// =============================
// CARREGAR HISTÓRICO
// =============================
function carregarHistorico() {

    let historico = JSON.parse(localStorage.getItem("historicoPedidos")) || [];
    let agora = new Date().getTime();

    let historicoFiltrado = historico.filter(pedido => {
        return (agora - pedido.data) < tempoExpiracao;
    });

    localStorage.setItem("historicoPedidos", JSON.stringify(historicoFiltrado));

    let container = document.getElementById("lista-historico");
    container.innerHTML = "";

    historicoFiltrado.forEach(pedido => {
        container.innerHTML += pedido.conteudo;
    });
}

// =============================
// ADICIONAR AO CARRINHO
// =============================
function adicionarAoCarrinho(nome, preco) {

    let item = carrinho.find(produto => produto.nome === nome);

    if (item) {
        item.quantidade++;
    } else {
        carrinho.push({
            nome: nome,
            preco: preco,
            quantidade: 1
        });
    }

    atualizarCarrinho();
}

// =============================
// ATUALIZAR CARRINHO
// =============================
function atualizarCarrinho() {

    let lista = document.getElementById("lista-carrinho");
    let totalElemento = document.getElementById("total-carrinho");
    let contador = document.getElementById("cart-count");

    lista.innerHTML = "";

    let total = 0;
    let totalItens = 0;

    carrinho.forEach(item => {

        let subtotal = item.preco * item.quantidade;
        total += subtotal;
        totalItens += item.quantidade;

        lista.innerHTML += `
            <p>
                ${item.nome} - ${item.quantidade}x 
                (R$ ${subtotal.toFixed(2)})
            </p>
        `;
    });

    totalElemento.innerText = "Total: R$ " + total.toFixed(2);
    contador.innerText = totalItens;
}

// =============================
// TOGGLE CARRINHO
// =============================
function toggleCarrinho() {
    document.getElementById("carrinho").classList.toggle("ativo");
}

// =============================
// FINALIZAR PEDIDO
// =============================
function finalizarPedido() {

    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    let mensagem = "Olá, gostaria de fazer o seguinte pedido:%0A%0A";
    let total = 0;
    let resumoPedidoHTML = "";

    carrinho.forEach(item => {

        let subtotal = item.preco * item.quantidade;
        total += subtotal;

        mensagem += `• ${item.nome} - ${item.quantidade}x - R$ ${subtotal.toFixed(2)}%0A`;

        resumoPedidoHTML += `
            <p>• ${item.nome} - ${item.quantidade}x - R$ ${subtotal.toFixed(2)}</p>
        `;
    });

    mensagem += `%0ATotal: R$ ${total.toFixed(2)}`;

    let url = `https://wa.me/${numeroWhatsApp}?text=${mensagem}`;
    window.open(url, "_blank");

    let blocoPedido = `
        <div class="pedido-finalizado">
            <strong>Pedido Finalizado</strong>
            ${resumoPedidoHTML}
            <p><strong>Total: R$ ${total.toFixed(2)}</strong></p>
            <hr>
        </div>
    `;

    salvarHistorico(blocoPedido);
    carregarHistorico();

    carrinho = [];
    atualizarCarrinho();
}

// =============================
// MOSTRAR CATEGORIA
// =============================
function mostrarCategoria(id) {

    let categorias = document.querySelectorAll(".categoria");

    categorias.forEach(secao => {
        secao.style.display = "none";
    });

    document.getElementById(id).style.display = "grid";
}

// =============================
// QR CODE + HISTÓRICO AO ABRIR
// =============================
window.onload = function() {

    let mensagem = "Olá, vim pelo QR Code e gostaria de fazer um pedido!";
    let linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

    new QRCode(document.getElementById("qrcode"), {
        text: linkWhatsApp,
        width: 200,
        height: 200
    });

    carregarHistorico();
};