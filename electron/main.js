const { app, BrowserWindow } = require('electron');
const path = require('path');
const detectPort = require('detect-port');

let mainWindow;

async function getAvailablePort(port) {
  try {
    const availablePort = await detectPort(port);
    if (availablePort === port) {
      return port;
    }
    console.log(`Port ${port} is occupied, using ${availablePort} instead`);
    return availablePort;
  } catch (error) {
    console.error('Error detecting port:', error);
    return port;
  }
}

async function createWindow() {
  const port = process.env.ELECTRON_DEV_PORT || await getAvailablePort(3005);
  
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../public/assets/icons/lofi-logo.png')
  });

  const startUrl = !app.isPackaged
    ? `http://localhost:${port}`
    : `file://${path.join(__dirname, '../build/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});