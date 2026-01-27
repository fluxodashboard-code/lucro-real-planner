# 🔨 Como Compilar para Executável (.exe)

## Pré-requisitos

- ✅ Node.js instalado
- ✅ Projeto funcionando em desenvolvimento
- ✅ npm/yarn funcionando

---

## Opção 1: Usando Electron (Recomendado)

### 1.1 Instale Electron e dependências
```bash
npm install --save-dev electron electron-builder electron-updater
```

### 1.2 Crie estrutura de Electron
```
projeto/
├── public/
├── src/
├── electron/
│   ├── main.js          (processo principal)
│   └── preload.js       (bridge para APIs)
└── package.json
```

### 1.3 Crie `electron/main.js`
```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

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

  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(startUrl);

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
```

### 1.4 Atualize `package.json`
```json
{
  "homepage": "./",
  "main": "electron/main.js",
  "homepage": "./",
  "scripts": {
    "dev": "concurrently \"npm start\" \"wait-on http://localhost:3000 && electron .\"",
    "build": "vite build && electron-builder"
  },
  "build": {
    "appId": "com.lucroreal.planner",
    "productName": "Lucro Real Planner",
    "files": [
      "dist/**/*",
      "electron/**/*",
      "node_modules/**/*"
    ],
    "win": {
      "target": ["nsis", "portable"],
      "certificateFile": null,
      "certificatePassword": null
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true
    }
  }
}
```

### 1.5 Build para .exe
```bash
npm run build
```

**Resultado:** Arquivo em `dist/Lucro Real Planner.exe` ✅

---

## Opção 2: Usando Tauri (Alternativa Leve)

Tauri é mais leve que Electron:

### 2.1 Instale Tauri
```bash
npm install --save-dev @tauri-apps/cli
npm install @tauri-apps/api
```

### 2.2 Inicialize
```bash
npx tauri init
```

### 2.3 Build
```bash
npm run tauri build
```

---

## Opção 3: PyInstaller + Servidor Local (Rápido)

Se não quiser complexidade de Electron:

### 3.1 Crie `app.py`
```python
import subprocess
import webbrowser
import time

# Inicia servidor Vite
process = subprocess.Popen(['npm', 'run', 'preview'], shell=True)

# Espera servidor subir
time.sleep(3)

# Abre navegador
webbrowser.open('http://localhost:4173')

# Mantém processo rodando
process.wait()
```

### 3.2 Build com PyInstaller
```bash
pip install pyinstaller
pyinstaller --onefile --windowed app.py
```

---

## Integração do Sistema de Atualização com Electron

### Adicione auto-updater ao hook

Edite `hooks/useUpdater.ts`:

```typescript
export const useUpdater = () => {
  // ... código existente ...

  const performUpdate = useCallback(async () => {
    try {
      setIsChecking(true);
      
      // Para Electron
      if (window.electronAPI?.updateApp) {
        await window.electronAPI.updateApp();
      } else {
        // Fallback: hard refresh
        caches.keys().then(names => {
          names.forEach(name => caches.delete(name));
        });
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } catch (err) {
      setError('Erro ao atualizar aplicação');
    } finally {
      setIsChecking(false);
    }
  }, []);

  return { /* ... */ };
};
```

---

## Fluxo de Deploy com Atualizações

```
┌──────────────────┐
│ Modifique código │
└────────┬─────────┘
         │
         v
┌──────────────────────────────────┐
│ node scripts/update-version.js   │
│ 0.1.0 "nova feature"             │
└────────┬─────────────────────────┘
         │
         v
┌──────────────────┐
│ npm run build    │
└────────┬─────────┘
         │
         v
┌──────────────────────────┐
│ npm run tauri build      │ OU
│ npm run electron build   │
└────────┬─────────────────┘
         │
         v
┌─────────────────────────────────┐
│ Distribua .exe gerado           │
│ ou upload em servidor           │
└────────┬────────────────────────┘
         │
         v
┌──────────────────────────────────┐
│ Usuários veem notificação!       │
│ Clicam "Atualizar Agora"         │
│ Recebem nova versão              │
└──────────────────────────────────┘
```

---

## Checklist de Build

- [ ] `npm install` rodou sem erros
- [ ] `npm run build` criou pasta `dist/`
- [ ] Electron/Tauri está instalado
- [ ] `package.json` tem configuração de build
- [ ] Assets estão em `public/`
- [ ] `version.json` existe
- [ ] Sistema de atualização testado
- [ ] Build executável gerado
- [ ] .exe testado em outra máquina (opcional)

---

## Dicas Importantes

### Para Electron:
- Use `electron-updater` para atualizações automáticas
- Crie servidor para hospedar releases
- Assine seu executável (produção)

### Para Tauri:
- Mais leve que Electron (~10MB vs ~150MB)
- Melhor performance
- Ainda suporta auto-update

### Para PyInstaller:
- Mais rápido de implementar
- Funciona bem para pequenos apps
- Menos profissional

---

## Exemplo Completo com Electron

```bash
# 1. Instale dependências
npm install

# 2. Instale Electron
npm install --save-dev electron electron-builder

# 3. Modifique seu código
# ... edite components, adicione features ...

# 4. Atualize versão
node scripts/update-version.js 1.0.0 "Release oficial"

# 5. Build
npm run build

# 6. Gere .exe
npx electron-builder

# Resultado: dist/Lucro Real Planner.exe ✅
```

---

## Próximos Passos

1. **Escolha uma opção** (Electron recomendado)
2. **Instale as dependências** necessárias
3. **Configure o build** em `package.json`
4. **Teste localmente** antes de distribuir
5. **Crie um servidor** para hospedar atualizações (opcional)

---

## Suporte

Se encontrar problemas:
- Verifique documentação do Electron/Tauri
- Teste em outra máquina
- Verifique permissões de arquivo
- Rode `npm cache clean` se houver erros

Sucesso! 🚀
