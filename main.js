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
    menuBarVisible: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
        preload: path.join(__dirname, 'preload.js')     
      }
  });
  const contents = mainWindow.webContents;
  mainWindow.maximize();
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

  tray = new Tray("app/img/icone.ico");
  var contextMenu = Menu.buildFromTemplate([
    { label: 'Abrir', click:  function(){
        mainWindow.maximize();
        mainWindow.show();
    } },
    { label: 'Sair', click:  function(){
        app.isQuiting = true;
        app.quit();
    } }
  ]);
  tray.setContextMenu(contextMenu);

  //console.log(contents.getPrinters());
  mainWindow.webContents.on('did-finish-load', () => {
    fs.writeFile(__dirname+'/app/txt/impressorasEx.txt', JSON.stringify(contents.getPrinters()),{enconding:'utf-8',flag: 'w'}, function (err) {
      if (err) throw err;
      console.log('Arquivo salvo!');
    });
  });
}


app.on('ready', createWindow);
app.on('quit', function(){
  fs.writeFile(__dirname+'/app/txt/impressorasEx.txt', "",{enconding:'utf-8',flag: 'w'}, function (err) {
    if (err) throw err;
    console.log('Arquivo Limpo');
  });
 });

ipcMain.on('notificacaoPedido', () =>{
//alert("bbbb");
  const notification = {
    icon: path.join(__dirname, 'app/img/icone.ico'),
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
    new Notification(notification).show()
  });