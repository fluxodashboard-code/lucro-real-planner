import { app, BrowserWindow, Menu, ipcMain, shell } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { autoUpdater } = require('electron-updater');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Detectar se está em development olhando se __dirname contém "node_modules" (development) ou "resources" (production)
const isDev = __dirname.includes('node_modules') || process.env.NODE_ENV === 'development';

let mainWindow;

// Configurar auto-updater
autoUpdater.autoDownload = true; // Baixa automaticamente
autoUpdater.autoInstallOnAppQuit = false; // Permitir instalação manual via botão

// Logs do auto-updater
autoUpdater.on('checking-for-update', () => {
  console.log('Verificando atualizações...');
});

autoUpdater.on('update-available', (info) => {
  console.log('Atualização disponível:', info.version);
  mainWindow?.webContents.send('update-available', info);
});

autoUpdater.on('update-not-available', (info) => {
  console.log('Você está na versão mais recente:', info.version);
});

autoUpdater.on('error', (err) => {
  console.error('Erro ao verificar atualizações:', err);
});

autoUpdater.on('download-progress', (progressObj) => {
  console.log(`Baixando: ${progressObj.percent.toFixed(1)}%`);
  mainWindow?.webContents.send('download-progress', progressObj.percent);
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('Atualização baixada! Será instalada ao fechar o app.');
  mainWindow?.webContents.send('update-downloaded', info);
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Remove menu padrão (File, Edit, View, Window, Help)
  Menu.setApplicationMenu(null);

  let startUrl;
  if (isDev) {
    // Development: conectar ao Vite dev server
    startUrl = 'http://localhost:3000';
  } else {
    // Production: carregar arquivo local empacotado
    // Em produção, o path é: resources/app.asar/dist/index.html
    const indexPath = path.join(__dirname, '../dist/index.html');
    startUrl = `file://${indexPath}`;
  }

  mainWindow.loadURL(startUrl);

  // Abrir links externos no navegador padrão (Chrome, Firefox, etc)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Interceptar navegação para abrir links externos no navegador
  mainWindow.webContents.on('will-navigate', (event, url) => {
    // Permitir navegação interna do app
    if (url.startsWith('file://') || url.startsWith('http://localhost')) {
      return;
    }
    // Abrir links externos no navegador
    event.preventDefault();
    shell.openExternal(url);
  });

  // Abrir DevTools em modo desenvolvimento para debug
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Configurar auto-updater para GitHub
  if (!isDev) {
    autoUpdater.setFeedURL({
      provider: 'github',
      owner: 'fluxodashboard-code',
      repo: 'lucro-real-planner'
    });

    // Verificar atualizações após 3 segundos (dar tempo do app carregar)
    setTimeout(() => {
      console.log('Verificando atualizações...');
      autoUpdater.checkForUpdatesAndNotify();
    }, 3000);

    // Verificar atualizações a cada 10 minutos
    setInterval(() => {
      console.log('Verificando atualizações (intervalo)...');
      autoUpdater.checkForUpdatesAndNotify();
    }, 10 * 60 * 1000);
  }
}

// IPC para verificar atualizações manualmente
ipcMain.on('check-for-updates', () => {
  if (!isDev) {
    autoUpdater.checkForUpdatesAndNotify();
  }
});

// IPC para instalar atualização imediatamente
ipcMain.on('install-update', () => {
  autoUpdater.quitAndInstall(false, true);
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
