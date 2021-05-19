//pega o email e conefere se é válido e salva ele no txt
async function loga(event){
    const email = event.target.email.value;

    const usuarios = await axios.get(apiUrl+'/Loja')
    .then(function (response) {
        // handle success
        return response.data.response.results;
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    });

    let saida = 0;
    for (let i = 0; i < usuarios.length; i++) {
        const element = usuarios[i];
        const elementEmail = usuarios[i].email_text;
        const elementId = usuarios[i]._id;
        if(email === elementEmail){
            saida = 1;
            fs.writeFile(__dirname+'/txt/id.txt', elementId,{enconding:'utf-8',flag: 'w'}, function (err) {
                if (err) throw err;
                console.log('Arquivo salvo!');
            });
        }
        //console.log(element);
    }
    if(saida == 1){
        notifica('notificacao','Logado com sucesso');
        window.location.reload();
    }else{
        notifica('erro','ERRO: Email inválido');
    }
}
//contato@brasileiroburguer.com.br