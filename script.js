// Função para pedido no WhatsApp
function pedir(produto) {
    let numero = "5518996622714"; // COLOQUE SEU NÚMERO
    let mensagem = `Olá, gostaria de pedir: ${produto}`;
    let url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}



// Gerar QR Code do WhatsApp
window.onload = function() {

    let numero = "5518996622714"; // 55 + DDD + número
    let mensagem = "Olá, vim pelo QR Code e gostaria de fazer um pedido!";
    let linkWhatsApp = `https://api.whatsapp.com/send?phone=${numero}?text=${encodeURIComponent(mensagem)}`;

    new QRCode(document.getElementById("qrcode"), {
        text: linkWhatsApp,
        width: 200,
        height: 200
    });
};


