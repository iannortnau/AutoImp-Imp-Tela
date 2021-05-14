 //verifica por novos pedidos
 hideAndShow();

 function hideAndShow(){
     if(ativo == true){
         $("#controleX").hide();
         $("#btControleIniciar").hide();
         $("#controleSpin").show();
         $("#btControleParar").show();  
     }else{
        $("#controleX").show();
         $("#btControleIniciar").show();
         $("#controleSpin").hide();
         $("#btControleParar").hide();  
     }
 }

 $('#btControleParar').on('click', function (event) {
    ativo = false;
    hideAndShow();
  });
  $('#btControleIniciar').on('click', function (event) {
    ativo = true;
    hideAndShow();
  });

