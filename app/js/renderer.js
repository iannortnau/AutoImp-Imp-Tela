const {
  ipcRenderer
} = require('electron');
window.$ = window.jQuery = require('jquery');
const http = require('http');
const axios = require('axios');
const axios2 = axios.create();
axios2.defaults.timeout = 5000;
var fs = require('fs');
const {
  event
} = require('jquery');
const {
  url
} = require('inspector');
const uuid = require("uuid");
const token = "e83721659fb721f0164c36718e4bbc17";
const apiUrl = "https://supradelivery.com.br/api/1.1/obj";
//const apiUrl = "https://supradelivery.com.br/version-test/api/1.1/obj";
const fss = require('fs').promises;

class Impp {
  constructor(nome, texto) {
    this.nome = nome;
    this.texto = texto;
  }
}
class Ipressora {
  constructor(tipo, nome, auto, padrao, vias, id, pdv) {
    this.tipo = tipo;
    this.nome = nome;
    this.auto = auto;
    this.padrao = padrao;
    this.vias = vias;
    this.id = id;
    this.pdv = pdv;
  }
}
class Pedido {
  constructor(id, pedidoImpresso, pedidoLayoutCompleto, createdDate, statusPedido, pedidoLayoutCozinha, pedidoLayoutCurto, pdv, pedido_aprovado_boolean) {
    this.id = id;
    this.pedidoImpresso = pedidoImpresso;
    this.pedidoLayoutCompleto = pedidoLayoutCompleto;
    this.createdDate = createdDate;
    this.statusPedido = statusPedido;
    this.pedidoLayoutCozinha = pedidoLayoutCozinha;
    this.pedidoLayoutCurto = pedidoLayoutCurto;
    this.pdv = pdv;
    this.pedido_aprovado_boolean = pedido_aprovado_boolean;
  }
}

var listaImpp = [];
var listaPedidos = [];
var pedidos = [];
var impressorasAtivas = [];
var ativo = false;
var id;
var autoAceita = false;
var config = null;
var alarm;

//carrega funções inicias
getImpsAt();
verificaUser();

//abre e fecha e menu de impressoras
function myFunction() {
  var x = document.getElementById("listaImpressorasEx");
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
  } else {
    x.className = x.className.replace(" w3-show", "");
  }
}

//pega as confifurações atuais
async function getConfig() {
  config = await fss.readFile('C:/Supra_Delivery/configuracoes.txt', 'utf-8').then(function (data) {
    return JSON.parse(data);
  });
}

function mudaAlerta() {
  alarm = $("#autoAlerta")[0].value;
  if (alarm == "true") {
    alarm = true
  };
  if (alarm == "falce") {
    alarm = false
  };
  console.log(alarm);

  config.alarm = alarm;
  fs.writeFile('C:/Supra_Delivery/configuracoes.txt', JSON.stringify(config), {
    enconding: 'utf-8',
    flag: 'w'
  }, function (err) {
    if (err) throw err;
    console.log('Arquivo salvo!');
  });

}


//muda o auto aceitar pedidos
function mudaAutoAc() {
  autoAceita = $("#autoAc")[0].value;
  if (autoAceita == "true") {
    autoAceita = true
  };
  if (autoAceita == "falce") {
    autoAceita = false
  };
  console.log(autoAceita);

  config.autoAc = autoAceita;
  fs.writeFile('C:/Supra_Delivery/configuracoes.txt', JSON.stringify(config), {
    enconding: 'utf-8',
    flag: 'w'
  }, function (err) {
    if (err) throw err;
    console.log('Arquivo salvo!');
  });
}

//muda se deve ou n carregas o espelhamento
async function mudaSegundatela() {
  autoS = $("#autoSegundaTela")[0].value;
  if (autoS == "true") {
    autoS = true
  };
  if (autoS == "falce") {
    autoS = false
  };
  console.log(autoS);

  config.segundaTela = autoS;
  fs.writeFile('C:/Supra_Delivery/configuracoes.txt', JSON.stringify(config), {
    enconding: 'utf-8',
    flag: 'w'
  }, function (err) {
    if (err) throw err;
    console.log('Arquivo salvo!');
    ipcRenderer.send("recarrega", );
  })
}

//pega as impressoras atuais
function getImpsAt() {
  fs.readFile('C:/Supra_Delivery/impressoras.txt', 'utf-8', function (err, data) {
    if (err) throw err;
    if (data.length == 0) {
      let text = ["Você não tem impressoras registradas."];
      //ipcRenderer.send("notificacaoImp", text);
    } else {
      impressorasAtivas = JSON.parse(data);
      console.log(impressorasAtivas);
    }
  });
}

//verifica se existe um id já salvo
async function verificaUser() {
  await getConfig();
  autoAceita = config.autoAc;
  alarm = config.alarm;
  /*
  if(autoAceita == true){
    $("#placeh").html("Sim");
  }else{
    $("#placeh").html("Não");
  }
  if(config.segundaTela == true){
    $("#placehS").html("Sim");
  }else{
    $("#placehS").html("Não");
  }*/
  fs.readFile('C:/Supra_Delivery/id.txt', 'utf-8', async function (err, data) {
    if (err) throw err;

    if (data.length == 0) {
      $('#test').hide();
      $('#nomeRestaurante').hide();
      $('#btSair').hide();
      $('#btMenu').hide();
      $.ajax({
        url: "telas/login.html",
        context: document.body,
        success: function (response) {
          $('#frame').html(response);
        }
      });
    } else {
      $('#test').show();
      $('#btSair').show();
      $('#btMenu').show();
      id = data;
      //getImpsAt();
      await getLogo();
      var nome = await axios2.get(apiUrl + '/Loja/' + id)
        .then(function (response) {
          // handle success
          //return response.data.response.results;
          //console.log(response.data.response.pedidos_list_custom_pedido);
          return response.data.response.nome_text;
        })
        .catch(function (error) {
          // handle error
          ipcRenderer.send("notificacaoErroInternet", );
          console.log(error);
        });
      setTimeout(() => {
        $('#nomeRestaurante').html('<img src="C:/Supra_Delivery/iconeUrl.jpg" class="" style="height:40px;width:40px" alt="Avatar"> <b>' + nome + '<b>');
        $('#nomeRestaurante').show();
      }, 2000);
      ativo = true;
      //console.log(id);
      $.ajax({
        url: "telas/controle.html",
        context: document.body,
        success: function (response) {
          $('#frame').html(response);
        }
      });
    }
  });
}

//pega o logo mais atual para botar na notificação
async function getLogo() {
  var logoUrl = await axios2.get(apiUrl + '/Loja/' + id)
    .then(function (response) {
      // handle success
      //return response.data.response.results;
      //console.log(response.data.response.pedidos_list_custom_pedido);
      return response.data.response.logotipo_image;
    })
    .catch(function (error) {
      // handle error
      ipcRenderer.send("notificacaoErroInternet", );
      console.log(error);
    });
  const file = fs.createWriteStream('C:/Supra_Delivery/iconeUrl.jpg');

  const request = http.get("http:" + logoUrl, function (response) {
    response.pipe(file);
  });
}


//função de notificação
var intervalo;

function notifica(tipo, mensagem) {
  //console.log("passou aqui");
  if (tipo == 'erro') {
    $.ajax({
      url: "telas/campoErro.html",
      context: document.body,
      success: function (response) {
        $('#notificacoes').html(response);
        $('#campoTexto').text(mensagem);
      }
    });
  }
  if (tipo == 'notificacao') {
    $.ajax({
      url: "telas/campoNotificacao.html",
      context: document.body,
      success: function (response) {
        $('#notificacoes').html(response);
        $('#campoTexto').html(mensagem);
      }
    });
  }

  clearTimeout(intervalo);
  intervalo = setTimeout(function () {
    $('#notificacoes').html('');
  }, 5000);
}

//botão sair desloga do programa
$('#btSair').on('click', function (event) {
  var x;
  var r=confirm("Deseja sair da conta?");
  if (r==true){
    fs.writeFile('C:/Supra_Delivery/id.txt', "", {
      enconding: 'utf-8',
      flag: 'w'
    }, function (err) {
      if (err) throw err;
      console.log('Arquivo salvo!');
    });
    window.location.reload()
  }else{
  }


});

//escuta os botões do menu
function indexClick(aux) {
  expoTabelaAtivo = 0;
  var iframe = $("#frame");

  if (aux == 1) {
    $.ajax({
      url: "telas/controle.html",
      context: document.body,
      success: function (response) {
        $('#frame').html(response);
      }
    });
  }
  if (aux == 2) {
    $.ajax({
      url: "telas/configuracoes.html",
      context: document.body,
      success: function (response) {
        $('#frame').html(response);
      }
    });
  }
  if (aux == 3) {
    $.ajax({
      url: "telas/impressoras.html",
      context: document.body,
      success: function (response) {
        $('#frame').html(response);
      }
    });
  }
}

setInterval(main, 1000);

//rotina de atualizações do programa
var livre = 1;
async function main() {
  if (ativo == true && livre == 1) {
    console.log("rodando");
    livre = 0;
    await getListaPedidos();
    await getPedidos();
    await verificaAlarmeNotificacaoPedidos();
    await manualImprecao();
    livre = 1;
  }
}

//pega a lista mais atual de pedidos
async function getListaPedidos() {
  listaPedidos = await axios2.get(apiUrl + '/Loja/' + id)
    .then(function (response) {
      // handle success
      //return response.data.response.results;
      //console.log(response.data.response.pedidos_list_custom_pedido);
      return response.data.response.loja_pedidos_list_custom_pedido;
    })
    .catch(function (error) {
      // handle error
      ipcRenderer.send("notificacaoErroInternet", );
      console.log(error);
      listaPedidos = [];
    });

  if (listaPedidos == undefined) {
    listaPedidos = [];
  }
}

//pega as informações dos pedidos
async function getPedidos() {
  var d = new Date();
  var ano = d.getFullYear();
  var mes = d.getMonth() + 1;
  var dia = d.getDate();
  //console.log('"'+ano+'-'+mes+'-'+dia+'"');
  pedidos = [];
  const auxlistapedidos = await axios2.get(apiUrl + '/Pedido?constraints=[ { "key": "loja_custom_loja", "constraint_type": "equals", "value": "' + id + '" } ,{ "key": "status_pedido_option_status_pedido", "constraint_type": "not equal", "value": "Cancelado"},{ "key": "status_pedido_option_status_pedido", "constraint_type": "not equal", "value": "Em trânsito"},{ "key": "status_pedido_option_status_pedido", "constraint_type": "not equal", "value": "Entregue"},{ "key": "Created Date", "constraint_type": "greater than", "value": "' + ano + '-' + mes + '-' + dia + '"}]')
    .then(function (response) {
      //console.log(response.data.response.results);
      return response.data.response.results;
    })
    .catch(function (error) {
      // handle error
      ipcRenderer.send("notificacaoErroInternet", );
      console.log(error);
      return [];
    });

  for (let j = 0; j < auxlistapedidos.length; j++) {
    const element2 = auxlistapedidos[j];

    if (id == element2.loja_custom_loja) {
      var pedido = new Pedido();

      pedido.id = element2._id;
      pedido.createdDate = element2["Created Date"];
      pedido.pedidoImpresso = element2.pedido_impresso_boolean;
      pedido.pedidoLayoutCompleto = element2.pedido_layout_completo_text;
      pedido.pedidoLayoutCozinha = element2.pedido_layout_cozinha_text;
      pedido.pedidoLayoutCurto = element2.pedido_layout_curto_text;
      pedido.statusPedido = element2.status_pedido_option_status_pedido;
      pedido.pdv = element2.pdv_boolean;
      pedido.pedido_aprovado_boolean = element2.pedido_aprovado_boolean;

      pedidos.push(pedido);
    }
  }
}

//controle da logica de notificação alarme e impreção de pedidos
var alarmeDisparado = false;
var intervaloAlarme;
var tamanhoAnterior = 0;
var tamanhoAtual = 0;
var inicial = true;
async function verificaAlarmeNotificacaoPedidos() {
  //console.log("entrou");
  var filaAutoImp = [];
  var alarme = false;
  var contPendente = 0;
  var contImprimir = [];
  var contImprimirPdv = [];

  if (tamanhoAtual == 0) {
    tamanhoAtual = listaPedidos.length;
    tamanhoAnterior = listaPedidos.length;
  } else {
    tamanhoAtual = listaPedidos.length;
  }
  const diferenca = tamanhoAtual - tamanhoAnterior;

  for (let i = 0; i < pedidos.length; i++) {
    //console.log("for: "+i);
    const element = pedidos[i];
    if (autoAceita == false) {
      if (element.statusPedido == "Pendente" && element.pdv != true && element.pedido_aprovado_boolean == true) {
        alarme = true;
        contPendente++;
      }
    }
    if (element.statusPedido != "Pendente" && element.pedidoImpresso == false && element.pdv != true) {
      contImprimir.push(element);
      var data = {
        pedido_impresso_boolean: true
      };
      await axios2
        .patch(apiUrl + "/Pedido/" + element.id, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          ipcRenderer.send("notificacaoErroInternet", );
          console.log(error);
        });
    }
    if (element.statusPedido != "Pendente" && element.pedidoImpresso == false && element.pdv == true) {
      contImprimirPdv.push(element);
      var data = {
        pedido_impresso_boolean: true
      };
      await axios2
        .patch(apiUrl + "/Pedido/" + element.id, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          ipcRenderer.send("notificacaoErroInternet", );
          console.log(error);
        });
    }
    if (autoAceita == true) {
      console.log("aa");
      if (element.statusPedido == "Pendente" && element.pdv != true && element.pedido_aprovado_boolean == true) {
        alarme = true;
        contPendente++;
        ipcRenderer.send("notificacaoPedido", );
        var data = {
          status_pedido_option_status_pedido: "Em preparo",
        };
        await axios2
          .patch(apiUrl + "/Pedido/" + element.id, data, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            ipcRenderer.send("notificacaoErroInternet", );
            console.log(error);
          });

      }
    }
  }
  //console.log("fim for");

  if (contImprimir.length > 0) {
    normalImprecao(contImprimir);
  }
  if (contImprimirPdv.length > 0) {
    normalImprecaoPdv(contImprimirPdv);
  }

  if (alarme == true && tamanhoAtual > tamanhoAnterior) {
    for (let i = 0; i < diferenca; i++) {
      if (autoAceita == false) {
        ipcRenderer.send("notificacaoPedido", );
      }
      filaAutoImp.push(listaPedidos[(listaPedidos.length - 1) - i]);

    }

    autoImprecao(filaAutoImp);
  } else if (alarme == true && inicial == true) {
    if (autoAceita == false) {
      ipcRenderer.send("notificacaoPedido", );
    }
    for (let i = 0; i < contPendente; i++) {
      filaAutoImp.push(listaPedidos[(listaPedidos.length - 1) - i]);

    }

    autoImprecao(filaAutoImp);
  }

  if (alarme == true && alarmeDisparado == false) {
    alarmeDisparado = true;
    intervaloAlarme = setInterval(() => {
      if(alarm == true){
        document.getElementById("audio").play();
      }
    }, 500);
  } else if (alarme == false) {
    clearInterval(intervaloAlarme);
    alarmeDisparado = false;
  }
  tamanhoAnterior = tamanhoAtual;
  inicial = false;
}

//impressão manual
async function manualImprecao() {
  var d = new Date();
  var ano = d.getFullYear();
  var mes = d.getMonth() + 1;
  var dia = d.getDate();
  const manualPedidos = await axios2.get(apiUrl + '/Pedido?constraints=[ { "key": "loja_custom_loja", "constraint_type": "equals", "value": "' + id + '" } ,{ "key": "print_manual_boolean", "constraint_type": "equals", "value": true},{ "key": "Created Date", "constraint_type": "greater than", "value": "' + ano + '-' + mes + '-' + dia + '"}]')
    .then(function (response) {
      //console.log(response.data.response.results);
      return response.data.response.results;
    })
    .catch(function (error) {
      // handle error
      ipcRenderer.send("notificacaoErroInternet", );
      console.log(error);
      return [];
    });

  for (let i = 0; i < manualPedidos.length; i++) {
    const impPedido = manualPedidos[i];
    var data = {
      print_manual_boolean: false
    };
    await axios2
      .patch(apiUrl + "/Pedido/" + impPedido._id, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        ipcRenderer.send("notificacaoErroInternet", );
        console.log(error);
      });
    console.log(impPedido);
    for (let j = 0; j < impressorasAtivas.length; j++) {
      const element2 = impressorasAtivas[j];
      if (element2.padrao == true) {
        for (let y = 0; y < element2.vias; y++) {
          var impp = new Impp;
          if (element2.tipo == "Cozinha") {
            //console.log("cz");
            impp.nome = element2.nome;
            impp.texto = impPedido.pedido_layout_cozinha_text;
            listaImpp.push(impp);
          }
          if (element2.tipo == "Curta") {
            //console.log("cu");
            impp.nome = element2.nome;
            impp.texto = impPedido.pedido_layout_curto_text;
            listaImpp.push(impp);
          }
          if (element2.tipo == "Completa") {
            //console.log("co");
            impp.nome = element2.nome;
            impp.texto = impPedido.pedido_layout_completo_text;
            listaImpp.push(impp);
          }
        }
      }

    }
  }
}

//percorre as impressoras marcadas como auto e manda a requsição para imprimir em cada uma
async function autoImprecao(lista) {
  for (let i = 0; i < lista.length; i++) {
    const element = lista[i];
    var impPedido;
    for (let j = 0; j < pedidos.length; j++) {
      const element2 = pedidos[j];

      if (element2.id == element) {
        impPedido = element2;
        break;
      }
    }
    if (impPedido.pdv != true) {
      for (let j = 0; j < impressorasAtivas.length; j++) {
        const element2 = impressorasAtivas[j];
        if (element2.auto == true) {
          for (let y = 0; y < element2.vias; y++) {
            var impp = new Impp;
            if (element2.tipo == "Cozinha") {
              //console.log("cz");
              impp.nome = element2.nome;
              impp.texto = impPedido.pedidoLayoutCozinha;
              listaImpp.push(impp);
            }
            if (element2.tipo == "Curta") {
              //console.log("cu");
              impp.nome = element2.nome;
              impp.texto = impPedido.pedidoLayoutCurto;
              listaImpp.push(impp);
            }
            if (element2.tipo == "Completa") {
              //console.log("co");
              impp.nome = element2.nome;
              impp.texto = impPedido.pedidoLayoutCompleto;
              listaImpp.push(impp);
            }
          }
        }
      }
    }
  }
}

//impressão apos confirmação de pedido
async function normalImprecao(lista) {
  for (let i = 0; i < lista.length; i++) {
    const impPedido = lista[i];
    for (let j = 0; j < impressorasAtivas.length; j++) {
      const element2 = impressorasAtivas[j];
      if (element2.auto == false) {
        for (let y = 0; y < element2.vias; y++) {
          var impp = new Impp;
          if (element2.tipo == "Cozinha") {
            //console.log("cz");
            impp.nome = element2.nome;
            impp.texto = impPedido.pedidoLayoutCozinha;
            listaImpp.push(impp);
          }
          if (element2.tipo == "Curta") {
            //console.log("cu");
            impp.nome = element2.nome;
            impp.texto = impPedido.pedidoLayoutCurto;
            listaImpp.push(impp);
          }
          if (element2.tipo == "Completa") {
            //console.log("co");
            impp.nome = element2.nome;
            impp.texto = impPedido.pedidoLayoutCompleto;
            listaImpp.push(impp);
          }
        }
      }
    }
  }
}

//impressão depois de aceitar o pedido
async function normalImprecaoPdv(lista) {
  for (let i = 0; i < lista.length; i++) {
    const impPedido = lista[i];
    for (let j = 0; j < impressorasAtivas.length; j++) {
      const element2 = impressorasAtivas[j];
      if (element2.pdv == true) {
        for (let y = 0; y < element2.vias; y++) {
          var impp = new Impp;
          if (element2.tipo == "Cozinha") {
            //console.log("cz");
            impp.nome = element2.nome;
            impp.texto = impPedido.pedidoLayoutCozinha;
            listaImpp.push(impp);
          }
          if (element2.tipo == "Curta") {
            //console.log("cu");
            impp.nome = element2.nome;
            impp.texto = impPedido.pedidoLayoutCurto;
            listaImpp.push(impp);
          }
          if (element2.tipo == "Completa") {
            //console.log("co");
            impp.nome = element2.nome;
            impp.texto = impPedido.pedidoLayoutCompleto;
            listaImpp.push(impp);
          }
        }
      }
    }
  }
}


//encontra e lista as impressoras
function findPrinters() {
  qz.printers.find().then(function (data) {
    console.log(data);
  }).catch(function (e) {
    console.error(e);
  });
}

//loop de impressão a cada um segundo manda imprimir os pedidos na lista de impressão
var indexListaImpp = 0;
var intert = setInterval(function () {
  if (indexListaImpp == listaImpp.length) {
    //clearInterval(intert);
  } else {
    const element = listaImpp[indexListaImpp];
    sendPrint(element.nome, element.texto);
    //console.log(element);
    indexListaImpp++;
  }
}, 1000);

//manda imprimir
function sendPrint(imp, text) {
  var config = qz.configs.create(imp);

  var data = [text.normalize('NFD').replace(/[\u0300-\u036f]/g, ""), '\x0A' + '\x0A' + '\x0A' + '\x0A' + '\x0A' + '\x0A' + '\x0A', '\x1B' + '\x69', ];

  qz.print(config, data).then(function () {
    return true
  }).catch(function (e) {
    console.error(e);
  });

  return 0;
}
