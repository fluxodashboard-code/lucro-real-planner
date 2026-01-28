import { app, BrowserWindow, Menu } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Detectar se está em development olhando se __dirname contém "node_modules" (development) ou "resources" (production)
const isDev = __dirname.includes('node_modules') || process.env.NODE_ENV === 'development';

let mainWindow;

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

  // Abrir DevTools em modo desenvolvimento para debug
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
