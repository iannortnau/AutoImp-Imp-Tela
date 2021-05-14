const { ipcRenderer } = require('electron');
window.$ = window.jQuery = require('jquery');  
const axios = require('axios');
var fs = require('fs');
const { event } = require('jquery');
const token = "e83721659fb721f0164c36718e4bbc17";
const apiUrl = "https://supradelivery.com.br/version-test/api/1.1/obj";

class Ipressora {
  constructor(tipo, nome, auto, padrao) {
    this.tipo = tipo;
    this.nome = nome;
    this.auto = auto;
    this.padrao = padrao
  }
}
class Pedido {
  constructor(id, pedidoImpresso, pedidoLayoutCompleto, createdDate, statusPedido, pedidoLayoutCozinha, pedidoLayoutCurto){
    this.id = id;
    this.pedidoImpresso = pedidoImpresso;
    this.pedidoLayoutCompleto = pedidoLayoutCompleto;
    this.createdDate = createdDate;
    this.statusPedido = statusPedido;
    this.pedidoLayoutCozinha = pedidoLayoutCozinha;
    this.pedidoLayoutCurto = pedidoLayoutCurto;
  }
}


var listaPedidos;
var pedidos = [];
var impressorasAtivas = [];
var impressorasExistentes = null;
var ativo = false;
var id;

verificaUser();
getImpsEx();
getImpsAt();

//registraImpsAt("Cozinha","impTermica",true);

function getImpsAt(){
  fs.readFile(__dirname+'/../app/txt/impressoras.txt', 'utf-8', function (err, data) {
    if(err) throw err;
    if(data.length == 0){
      let text = ["Você não tem impressoras registradas."];
      ipcRenderer.send("notificacaoImp", text);
    }else{
      impressorasAtivas = JSON.parse(data);
      console.log(impressorasAtivas);
    }
  });
}

function registraImpsAt(tipo, nome, auto){
  var imp = new Ipressora(tipo, nome, auto);
  impressorasAtivas.push(imp);

  fs.writeFile(__dirname+'/../app/txt/impressoras.txt', JSON.stringify(impressorasAtivas),{enconding:'utf-8',flag: 'w'}, function (err) {
    if (err) throw err;
    console.log('Arquivo salvo!');
  });
}

function deletaImpspAt(nome){
  const save=-1;
  for (let i = 0; i < impressorasAtivas.length; i++) {
    const element = impressorasAtivas[i];
    if(element.nome == nome){
      save = i;
    }
    
  }
  if (save > -1) {
    impressorasAtivas.splice(save, 1);
  }

  fs.writeFile(__dirname+'/../app/txt/impressoras.txt', JSON.stringify(impressorasAtivas),{enconding:'utf-8',flag: 'w'}, function (err) {
    if (err) throw err;
    console.log('Arquivo salvo!');
  });
}

//pega as impressoras disponiveis no sistema
function getImpsEx(){
  fs.readFile(__dirname+'/../app/txt/impressorasEx.txt', 'utf-8', function (err, data) {
    if(err) throw err;
    if(data.length == 0){
      getImpsEx();
    }else{
      impressorasExistentes = JSON.parse(data);
      console.log(impressorasExistentes);
    }
  }); 
}

//verifica se existe um id já salvo
function verificaUser(){
	fs.readFile(__dirname+'/../app/txt/id.txt', 'utf-8', function (err, data) {
    	if(err) throw err;
    	
		if(data.length == 0){
      $('#btSair').hide();
      $('#btMenu').hide();
			$.ajax({
				url: "telas/login.html",
				context: document.body,
				success: function(response){
					$('#frame').html(response);
				}
			});
		}else{
      $('#btSair').show();
      $('#btMenu').show();
      ativo = true;
			id = data;
      console.log(id);
      $.ajax({
				url: "telas/controle.html",
				context: document.body,
				success: function(response){
					$('#frame').html(response);
				}
			});
		}
	});
}

//função de notificação do 
var intervalo;
function notifica(tipo,mensagem){
    //console.log("passou aqui");
    if(tipo == 'erro'){
      $.ajax({
        url: "telas/campoErro.html",
        context: document.body,
        success: function(response){
            $('#notificacoes').html(response);
            $('#campoTexto').text(mensagem);
        }
     });
    }
    if(tipo == 'notificacao'){
        $.ajax({
          url: "telas/campoNotificacao.html",
          context: document.body,
          success: function(response){
              $('#notificacoes').html(response);
              $('#campoTexto').html(mensagem);
          }
       });
      }

    clearTimeout(intervalo);
    intervalo = setTimeout(function() { $('#notificacoes').html('');}, 5000);
}

$('#btSair').on('click', function (event) {
  fs.writeFile(__dirname+'/txt/id.txt', "",{enconding:'utf-8',flag: 'w'}, function (err) {
    if (err) throw err;
    console.log('Arquivo salvo!');
  });
  window.location.reload()
});

function indexClick(aux){
  expoTabelaAtivo = 0;
  var iframe = $("#frame");

  if(aux == 1){
      $.ajax({
          url: "telas/controle.html",
          context: document.body,
          success: function(response){
              $('#frame').html(response);
          }
      }); 
  }
  if(aux == 2){
      $.ajax({
          url: "telas/pedidos.html",
          context: document.body,
          success: function(response){
              $('#frame').html(response);
          }
      });    
  }
  if(aux == 3){
      $.ajax({
          url: "telas/configuracoes.html",
          context: document.body,
          success: function(response){
              $('#frame').html(response);
          }
      }); 
  }
}

setInterval(buscadorDePedidos, 3000);

async function buscadorDePedidos(){
  if(ativo == true){
    await getListaPedidos();
    //console.log("lista pedidos"+listaPedidos.length);
    await getPedidos();
    //console.log("pedidos"+pedidos.length);

    await verificaAlarme();

    //await vericaImprecao();

  }
}

async function getListaPedidos(){
  listaPedidos = await axios.get(apiUrl+'/Loja/'+id)
    .then(function (response) {
        // handle success
        //return response.data.response.results;
        //console.log(response.data.response.pedidos_list_custom_pedido);
        return response.data.response.loja_pedidos_list_custom_pedido;
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    });
}

async function getPedidos(){
  pedidos = [];
  const auxlistapedidos = await axios.get(apiUrl+'/Pedido?constraints=[ { "key": "loja_custom_loja", "constraint_type": "equals", "value": "1619644442000x112250985724510200" } ,{ "key": "status_pedido_option_status_pedido", "constraint_type": "not equal", "value": "Cancelado"},{ "key": "status_pedido_option_status_pedido", "constraint_type": "not equal", "value": "Em trânsito"},{ "key": "status_pedido_option_status_pedido", "constraint_type": "not equal", "value": "Entregue"}]')
  .then(function (response) {
    return response.data.response.results;
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });
  //console.log(auxlistapedidos);
  for (let j = 0; j < auxlistapedidos.length; j++) {
    const element2 = auxlistapedidos[j];

    if(id == element2.loja_custom_loja){
      var pedido = new Pedido();
      //console.log(response.data.response);
      pedido.id = element2._id;
      pedido.createdDate = element2["Created Date"];
      pedido.pedidoImpresso = element2.pedido_impresso_boolean;
      pedido.pedidoLayoutCompleto = element2.pedido_layout_completo_text;
      pedido.pedidoLayoutCozinha = element2.pedido_layout_cozinha_text;
      pedido.pedidoLayoutCurto = element2.pedido_layout_curto_text;
      pedido.statusPedido = element2.status_pedido_option_status_pedido;

      pedidos.push(pedido);
      }
  }                
}


var alarmeDisparado = false;
var intervaloAlarme;
var tamanhoAnterior=0;
var tamanhoAtual=0;
var inicial = true;
async function verificaAlarme(){
  var filaAutoImp = [];
  var alarme = false;
  var contPendente = 0;

  if(tamanhoAtual == 0){
    tamanhoAtual = listaPedidos.length;
    tamanhoAnterior =listaPedidos.length;
  }else{
    tamanhoAtual = listaPedidos.length;
  }
  const diferenca = tamanhoAtual - tamanhoAnterior;
  //console.log(pedidos.length);
  for (let i = 0; i < pedidos.length; i++) {
    const element = pedidos[i];
    if(element.statusPedido == "Pendente"){
      alarme = true;
      contPendente++;
    }
  }

  //console.log(tamanhoAtual+">"+tamanhoAnterior+" "+diferenca+" "+alarme);
  if(alarme == true && tamanhoAtual > tamanhoAnterior){
    for (let i = 0; i < diferenca; i++) {
      ipcRenderer.send("notificacaoPedido",);
      filaAutoImp.push(listaPedidos[(listaPedidos.length-1)-i]);
      //console.log("aqui");
    }
    //console.log(filaAutoImp);
    autoImprecao(filaAutoImp);
  }else if(alarme == true && inicial == true){
    for (let i = 0; i < contPendente; i++) {
      ipcRenderer.send("notificacaoPedido",);
      filaAutoImp.push(listaPedidos[(listaPedidos.length-1)-i]);
      //console.log("aqui2");
    }
    //console.log(filaAutoImp);
    autoImprecao(filaAutoImp);
  }

  if(alarme == true && alarmeDisparado == false){
    alarmeDisparado = true;
    intervaloAlarme = setInterval(() => {
        document.getElementById("audio").play();
    }, 500);
  }else if(alarme == false){
    clearInterval(intervaloAlarme);
    alarmeDisparado = false;
  }
  tamanhoAnterior = tamanhoAtual;
  inicial = false;
}

async function autoImprecao(lista){
  for (let i = 0; i < lista.length; i++) {
    const element = lista[i];
    
  }
}


/*
var pedido = new Pedido();
        //console.log(response.data.response);
        pedido.id = response.data.response._id;
        pedido.createdDate = response.data.response["Created Date"];
        pedido.pedidoImpresso = response.data.response.pedido_impresso_boolean;
        pedido.pedidoLayoutCompleto = response.data.response.pedido_layout_completo_text;
        pedido.pedidoLayoutCozinha = response.data.response.pedido_layout_cozinha_text;
        pedido.pedidoLayoutCurto = response.data.response.pedido_layout_curto_text;
        pedido.statusPedido = response.data.response.status_pedido_option_status_pedido;

        pedidos.push(pedido);*/