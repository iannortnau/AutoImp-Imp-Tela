// Modules to control application life and create native browser window
const {app, BrowserWindow , Menu, Tray , ipcMain , Notification} = require('electron');
const path = require('path');
var fs = require('fs');
//require('electron-reload')(__dirname);

function createWindow () {
  // Create the browser window.
  let mainWindow = new BrowserWindow({
    show: false,
    frame: false,
    icon: path.join(__dirname, 'app/img/icone.ico'),
    width: 700,
    height: 500,
    minWidth: 700,
    minHeight: 500,
    maxWidth: 700,
    maxHeight: 500,
    maximizable: false,
    center:true,
    menuBarVisible: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
        preload: path.join(__dirname, 'preload.js')     
      }
  });
  mainWindow.loadURL(`file://${__dirname}/app/index.html`);
  mainWindow.show();
  mainWindow.hide();

  mainWindow.on('minimize',function(event){
    event.preventDefault();
    mainWindow.hide();
  });
  mainWindow.on('close', function (event) {
    if(!app.isQuiting){
        event.preventDefault();
        mainWindow.hide();
    }

    return false;
  });


  tray = new Tray(__dirname+'/app/img/icone.ico');
  var contextMenu = Menu.buildFromTemplate([
    { label: 'Abrir', click:  function(){
        mainWindow.maximize();
        mainWindow.show();
    } },
    { label: 'Atualizar', click:  function(){
      app.isQuiting = true;
      mainWindow.reload();
    } },
    { label: 'Sair', click:  function(){
        app.isQuiting = true;
        app.quit();
    } }
  ]);
  tray.setContextMenu(contextMenu);
  /*
  let dpWindow = new BrowserWindow({
    maximizable: false,
    icon: path.join(__dirname, 'app/img/icone.ico'),
    width: 1000,
    height: 800,
    minWidth: 1000,
    minHeight: 800,
    maxWidth: 1000,
    maxHeight: 800,
  });
  dpWindow.loadURL(`https://supradelivery.com.br/version-test/pedidos`);

  dpWindow.on('close', function (event) {
    if(!app.isQuiting){
        event.preventDefault();
        dpWindow.minimize();
    }

    return false;
  });*/
}


app.on('ready', createWindow);
app.on('quit', function(){});

ipcMain.on('notificacaoPedido', () =>{
//alert("bbbb");
  const notification = {
    icon: path.join(__dirname+'/app/img/iconeUrl.jpg'),
    title: 'Novo pedido.',
    body: 'Você recebeu um novo pedido.'
  }
  new Notification(notification).show()
});

ipcMain.on('notificacaoImp', (evemt,text) =>{
  //alert("bbbb");
    const notification = {
      icon: path.join(__dirname, 'app/img/icons8_print_64px.png'),
      title: 'Impressora.',
      body: text[0]
    }
    new Notification(notification).show();
});
