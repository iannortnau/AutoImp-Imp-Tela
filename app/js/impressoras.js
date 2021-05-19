printaImpressoras();
listaImpressoras();
mudaTextoSeletor("Selecione a impressora");

function mudaTextoSeletor(texto) {
    $("#seletorImp").text(texto);
}

async function listaImpressoras() {
    $("#listaImpressorasEx").html('<a href="#" class="w3-bar-item w3-button w3-center"><i id="controleSpin" class="fas fa-circle-notch w3-spin"></i></a>');
    const impressorasExistentes = await qz.printers.find().then(function (data) {
        return data;
    }).catch(function (e) {
        console.error(e);
    });
    $("#listaImpressorasEx").html('');
    for (let i = 0; i < impressorasExistentes.length; i++) {
        const element = impressorasExistentes[i];
        $("#listaImpressorasEx").append(`<a href="#" class="w3-bar-item w3-button w3-center" onclick="mudaTextoSeletor('` + element + `')">` + element + `</a>`);
    }

}

$("#btImpsAdiciona").on("click",function(event){
    const nome = event.target.nextElementSibling.children[0].children[1].textContent;
    if(nome != "Selecione a impressora"){
        registraImpsAt("Completa", nome, false, false, 1, uuid.v4(), false);
    }
});

async function printaImpressoras(){
    $("#impressorasAtivasLista").html('');
    var htmlBase;
    await $.ajax({
        url: "telas/from.html",
        context: document.body,
        dataType: "html",
        async: false,
     }).done(function(response){
        htmlBase = response;
     });

    for (let i = 0; i < impressorasAtivas.length; i++) {
        var htmlCopia = htmlBase;
        const element = impressorasAtivas[i];
        console.log(element);

        htmlCopia = htmlCopia.replaceAll("auxId", element.id);
        htmlCopia = htmlCopia.replaceAll("auxNome", element.nome);

        if(element.tipo == "Cozinha"){
            htmlCopia = htmlCopia.replace("auxCozinha", "selected");
            htmlCopia = htmlCopia.replace("auxCurta", "");
            htmlCopia = htmlCopia.replace("auxCompleta", "");
        }
        if(element.tipo == "Curta"){
            htmlCopia = htmlCopia.replace("auxCozinha", "");
            htmlCopia = htmlCopia.replace("auxCurta", "selected");
            htmlCopia = htmlCopia.replace("auxCompleta", "");
        }
        if(element.tipo == "Completa"){
            htmlCopia = htmlCopia.replace("auxCozinha", "");
            htmlCopia = htmlCopia.replace("auxCurta", "");
            htmlCopia = htmlCopia.replace("auxCompleta", "selected");
        }

        if(element.auto == true){
            htmlCopia = htmlCopia.replace("auxAutoTrue", "selected");
            htmlCopia = htmlCopia.replace("auxAutoFalce", "");
        }else{
            htmlCopia = htmlCopia.replace("auxAutoTrue", "");
            htmlCopia = htmlCopia.replace("auxAutoFalce", "selected");
        }

        if(element.pdv == true){
            htmlCopia = htmlCopia.replace("auxpdvTrue", "selected");
            htmlCopia = htmlCopia.replace("auxpdvFalce", "");
        }else{
            htmlCopia = htmlCopia.replace("auxpdvTrue", "");
            htmlCopia = htmlCopia.replace("auxpdvFalce", "selected");
        }

        if(element.padrao == true){
            htmlCopia = htmlCopia.replace("auxPadraoTrue", "selected");
            htmlCopia = htmlCopia.replace("auxPadraoFalce", "");
        }else{
            htmlCopia = htmlCopia.replace("auxPadraoTrue", "");
            htmlCopia = htmlCopia.replace("auxPadraoFalce", "selected");
        }

        htmlCopia = htmlCopia.replaceAll("auxVias", element.vias);
        
        console.log(htmlCopia);

        $("#impressorasAtivasLista").append(htmlCopia);
    }
}

async function registraImpsAt(tipo, nome, auto, padrao, vias, id, pdv) {
    var save = -1;
    for (let i = 0; i < impressorasAtivas.length; i++) {
        const element = impressorasAtivas[i];
        if(element.id == id){
            save = i;
        }
    }
    if(save == -1){
        var imp = new Ipressora(tipo, nome, auto, padrao, vias, id, pdv);
        impressorasAtivas.push(imp);
    }else{
        impressorasAtivas[save].tipo = tipo;
        impressorasAtivas[save].nome = nome;
        impressorasAtivas[save].auto = auto;
        impressorasAtivas[save].padrao = padrao;
        impressorasAtivas[save].vias = vias;
        impressorasAtivas[save].pdv = pdv;
    }

    await fs.writeFile(__dirname + '/../app/txt/impressoras.txt', JSON.stringify(impressorasAtivas), {
        enconding: 'utf-8',
        flag: 'w'
    }, function (err) {
        if (err) throw err;
        console.log('Arquivo salvo!');
    });

    await getImpsAt();
    if(save == -1){
        printaImpressoras();
    }
}

//deleta impressora
async function deletaImpspAt(id) {
    var save = -1;
    for (let i = 0; i < impressorasAtivas.length; i++) {
        const element = impressorasAtivas[i];
        if (element.id == id) {
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

    await getImpsAt();
    printaImpressoras();
}


function attImp(id) {
    var tipo = $("#layouts"+id)[0].value;
    var nome = $("#nome"+id)[0].textContent;
    var auto = $("#auto"+id)[0].value;
    if(auto == "true"){auto = true};
    if(auto == "falce"){auto = false};
    var padrao = $("#padrao"+id)[0].value;
    if(padrao == "true"){padrao = true};
    if(padrao == "falce"){padrao = false};
    var pdv = $("#pdv"+id)[0].value;
    if(pdv == "true"){pdv = true};
    if(pdv == "falce"){pdv = false};
    var vias = parseInt($("#vias"+id)[0].value);
    //console.log(tipo+" "+nome+" "+auto+" "+padrao+" "+pdv+" "+vias);
    registraImpsAt(tipo, nome, auto, padrao, vias, id, pdv);
    //console.log(val);
}

function tesstImp(nome,id){
    var impp = new Impp;
    for (let i = 0; i < impressorasAtivas.length; i++) {
        const element = impressorasAtivas[i];

        if(element.id == id){
            var tipo = element.tipo;
        }
        
    }
    impp.nome = nome;
    if(tipo == "Cozinha"){
        impp.texto = "COZINHA:\n"+
        "\n"+
        "\n"+
        "LOJA: LOJA TESTE\n"+
        "PEDIDO: #0001\n"+
        "\n"+
        "===================COMPRAS======================\n"+
        "\n"+
        "1X PIZZA GRANDE\n"+
        "    1X FRANGO  COM CATUPIRY \n"+
        "    1X CALABRESA\n"+
        "    1X ATUM\n"+
        "\n"+
        "1X COCACOLA 2LT\n"+
        "\n"+
        "2X CERVEJAS LATA 350ML\n"+
        "\n"+
        "OBS: SEM CEBOLA!\n"+
        "*\n"+
        "*\n"+
        "*\n"+
        "*\n";
    }
    if(tipo == "Completa"){
        impp.texto = "COMPLETA:\n"+
        "\n"+
        "LOJA: LOJA TESTE\n"+
        "PEDIDO: #0001\n"+
        "DATA: 25/05/2021 22:55:02\n"+
        "NOME: CLIENTE TESTE\n"+
        "TELEFONE: (00) 00000-0000\n"+
        "\n"+
        "===================COMPRAS======================\n"+
        "\n"+
        "1X PIZZA GRANDE                         R$38,00\n"+
        "    1X FRANGO  COM CATUPIRY \n"+
        "    1X CALABRESA\n"+
        "    1X ATUM\n"+
        "\n"+
        "1X COCACOLA 2LT                         R$5,00\n"+
        "\n"+
        "2X CERVEJAS LATA 350ML                  R$7,00\n"+
        "\n"+
        "OBS: SEM CEBOLA!\n"+
        "\n"+
        "\n"+
        "===================PAGAMENTO====================\n"+
        "\n"+
        "SUBTOTAL:                              R$50,00\n"+
        "TAXA DE ENTREGA:                       R$5,00\n"+
        "TOTAL:                                 R$55,00\n"+
        "DINHEIRO NA ENTREGA:       TROCO PARA: R$100,00\n"+
        "\n"+
        "===================ENTREGA======================\n"+
        "\n"+
        "ENTREGA NO LOCAL:\n"+
        "RUA TESTE, 1000 - BAIRRO TESTE\n"+
        "OBS: PRÓXIMO AO POSTO TESTE\n";
    }
    if(tipo == "Curta"){
        impp.texto = "CURTA:\n"+
        "\n"+
        "\n"+
        "LOJA: LOJA TESTE\n"+
        "PEDIDO: #0001\n"+
        "DATA: 25/05/2021 22:55:02\n"+
        "NOME: CLIENTE TESTE\n"+
        "TELEFONE: (00) 00000-0000\n"+
        "\n"+
        "===================COMPRAS======================\n"+
        "\n"+
        "1X PIZZA GRANDE                         R$38,00\n"+
        "\n"+
        "1X COCACOLA 2LT                          R$5,00\n"+
        "\n"+
        "2X CERVEJAS LATA 350ML                   R$7,00\n"+
        "\n"+
        "OBS: SEM CEBOLA!\n"+
        "\n"+
        "\n"+
        "===================PAGAMENTO====================\n"+
        "\n"+
        "TOTAL:                                R$55,00\n"+
        "DINHEIRO NA ENTREGA:      TROCO PARA: R$100,00\n"+
        "\n"+
        "===================ENTREGA======================\n"+
        "\n"+
        "ENTREGA NO LOCAL:\n"+
        "RUA TESTE, 1000 - BAIRRO TESTE\n"+
        "OBS: PRÓXIMO AO POSTO TESTE.\n";
    }
    listaImpp.push(impp);
}
//<a href="#" class="w3-bar-item w3-button w3-center" onclick="selectImp('auxNomeImp')">auxNomeImp</a>