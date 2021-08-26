// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  Menu,
  Tray,
  ipcMain,
  Notification
} = require('electron');
const path = require('path');
var fs = require('fs');
var fss = require('fs').promises;
var AutoLaunch = require('auto-launch');
var validador = 0;
//require('electron-reload')(__dirname);

let dpWindow = null;
let mainWindow = null;
class Configuracao {
  constructor(autoAc, segundaTela, alarm) {
    this.autoAc = autoAc;
    this.segundaTela = segundaTela;
    this.alarm = alarm;
  }
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
}


async function criaDir() {
  var dir = 'C:/Supra_Delivery';
  var config = new Configuracao(false, true, true);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);

    await fss.writeFile("C:/Supra_Delivery/id.txt", "").then(function () {
      console.log("The file was saved!");
    });

    await fss.writeFile("C:/Supra_Delivery/impressoras.txt", "").then(function () {
      console.log("The file was saved!");
    });

    await fss.writeFile("C:/Supra_Delivery/configuracoes.txt", JSON.stringify(config)).then(function () {
      console.log("The file was saved!");
    });
  }
}

async function createWindow() {
  let autoLaunch = new AutoLaunch({
    name: 'Supra_Delivery',
    path: app.getPath('exe'),
  });
  autoLaunch.enable();
  await criaDir();

  var config = await fss.readFile('C:/Supra_Delivery/configuracoes.txt', 'utf-8').then(function (data) {
    return JSON.parse(data);
  });

  /*
  if (config.aberto == 1) {
    app.quit();
  } else {
    config.aberto = 1;
    fs.writeFile('C:/Supra_Delivery/configuracoes.txt', JSON.stringify(config), {
      enconding: 'utf-8',
      flag: 'w'
    }, function (err) {
      if (err) throw err;
      console.log('Arquivo salvo!');
    });
  }*/
  dpWindow = new BrowserWindow({
    show: false,
    maximizable: false,
    icon: path.join(__dirname, 'app/img/icone.ico'),
    width: 1000,
    height: 800,
    minWidth: 1000,
    minHeight: 800,
    maxWidth: 1000,
    maxHeight: 800,
  });


  //console.log(config);
  dpWindow.loadURL(`https://supradelivery.com.br/pedidos`);
  //dpWindow.loadURL(`https://supradelivery.com.br/version-test/pedidos`);
  dpWindow.setMenu(null);
  // Create the browser window.
  dpWindow.on('close', function (event) {
    if (!app.isQuiting) {
      event.preventDefault();
      dpWindow.minimize();
    }
    return false;
  });
  mainWindow = new BrowserWindow({
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
    center: true,
    menuBarVisible: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  mainWindow.loadURL(`file://${__dirname}/app/index.html`);

  require('dns').resolve('www.google.com', function(err) {
    if (err) {
      console.log("No connection");
    } else {
      mainWindow.show();
      if (config.segundaTela === true) {
        dpWindow.show();
      }
      validador = 1;
    }
  });

  mainWindow.on('minimize', function (event) {
    event.preventDefault();
    mainWindow.hide();
  });
  mainWindow.on('close', function (event) {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }

    return false;
  });


  tray = new Tray(__dirname + '/app/img/icone.ico');
  var contextMenu = Menu.buildFromTemplate([{
      label: 'Configuração',
      click: function () {
        mainWindow.maximize();
        mainWindow.show();
      }
    },
    {
      label: 'Atualizar',
      click: function () {
        mainWindow.reload();
        if (config.segundaTela == true){
          dpWindow.reload();
        }
      }
    },
    {
      label: 'Fechar',
      click: async function () {
        app.isQuiting = true;
        var config2 = await fss.readFile('C:/Supra_Delivery/configuracoes.txt', 'utf-8').then(function (data) {
          return JSON.parse(data);
        }).catch(function (erro) {
          console.log(erro);
        });

        config2.aberto = 0;
        await fss.writeFile('C:/Supra_Delivery/configuracoes.txt', JSON.stringify(config2), {
          enconding: 'utf-8',
          flag: 'w'
        }).then(function () {
          console.log('Arquivo salvo!');
        });
        console.log("aaaa");
        app.quit();
      }
    }
  ]);
  tray.setContextMenu(contextMenu);
}


app.on('ready', createWindow);
app.on('quit', function () {});

ipcMain.on('notificacaoPedido', () => {
  //alert("bbbb");
  const notification = {
    icon: path.join('C:/Supra_Delivery/iconeUrl.jpg'),
    title: 'Novo pedido.',
    body: 'Você recebeu um novo pedido.'
  }
  new Notification(notification).show()
});

ipcMain.on('notificacaoImp', (evemt, text) => {
  //alert("bbbb");
  const notification = {
    icon: path.join(__dirname, 'app/img/icons8_print_64px.png'),
    title: 'Impressora.',
    body: text[0]
  }
  new Notification(notification).show();
});

ipcMain.on('notificacaoQz', (evemt, text) => {
  //alert("bbbb");
  const notification = {
    icon: path.join(__dirname, 'app/img/icons8_printer_error_48px.png'),
    title: 'Erro no QZ',
    body: 'Qz não conectado.'
  }
  new Notification(notification).show();
});
let alerta = 0;
ipcMain.on('notificacaoErroInternet', (evemt, text) => {
  const notification = {
    icon: path.join(__dirname, 'app/img/icons8_wi-fi_off_48px.png'),
    title: 'Erro na conexão',
    body: 'Erro na internet.'
  }
  if(validador === 1){
    //new Notification(notification).show();
  }

  console.log("reload");
  app.relaunch();
  app.exit(0);
});
////electron-forge package --arch=ia32 --platform=win32
