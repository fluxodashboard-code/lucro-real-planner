# 🔄 Auto-Update Automático - Como Funciona

## ✨ O Que Foi Implementado

O **Lucro Real Planner** agora possui **atualização automática** usando `electron-updater`. Os usuários **não precisam mais baixar e instalar manualmente**.

---

## 🚀 Como Funciona (Para o Usuário)

### Experiência do Usuário:

1. **Detecção Automática**
   - O app verifica atualizações automaticamente:
     - 3 segundos após abrir
     - A cada 10 minutos em background

2. **Download Automático**
   - Quando detecta nova versão:
     - Começa a baixar automaticamente em background
     - Mostra notificação no canto inferior direito
     - Barra de progresso em tempo real

3. **Instalação**
   - **Opção 1**: Usuário clica "Instalar Agora" → fecha e instala imediatamente
   - **Opção 2**: Usuário clica "Depois" → instala automaticamente quando fechar o app
   - **Zero download manual necessário** 🎉

---

## 📋 Fluxo Técnico

### 1. Verificação de Atualização

```javascript
// electron/main.js
autoUpdater.checkForUpdatesAndNotify();
```

**Quando verifica:**
- ✅ 3 segundos após abrir o app
- ✅ A cada 10 minutos (em background)
- ✅ Quando usuário clica "Verificar Atualizações" (manual)

### 2. Download Automático

```javascript
autoUpdater.autoDownload = true; // Download automático ativado
```

**O que faz:**
- ✅ Compara versão atual com GitHub Releases
- ✅ Se houver nova versão → baixa `.exe` automaticamente
- ✅ Mostra progresso em tempo real
- ✅ Verifica integridade com blockmap

### 3. Instalação

```javascript
autoUpdater.autoInstallOnAppQuit = true; // Instala ao fechar
```

**Duas opções:**
- **Imediata**: `autoUpdater.quitAndInstall()` → fecha e instala agora
- **Ao fechar**: Instala automaticamente quando usuário fechar o app

---

## 🔧 Configuração Necessária

### electron-builder.json

O `publish` deve apontar para GitHub:

```json
{
  "publish": {
    "provider": "github",
    "owner": "fluxodashboard-code",
    "repo": "lucro-real-planner"
  }
}
```

✅ **Já configurado!**

### GitHub Release

Quando fizer release:

```powershell
gh release create v0.0.5 "dist\Lucro Real Planner Setup 0.0.5.exe" `
  --title "v0.0.5 - Nova Feature" `
  --notes "Changelog aqui"
```

O `electron-updater` verifica:
- ✅ Tag de versão (v0.0.5)
- ✅ Arquivo `.exe` anexado
- ✅ `latest.yml` gerado automaticamente

---

## 📊 Eventos de Auto-Update

### No Electron (electron/main.js)

```javascript
autoUpdater.on('checking-for-update', () => {
  console.log('Verificando atualizações...');
});

autoUpdater.on('update-available', (info) => {
  console.log('Atualização disponível:', info.version);
  // Notifica o React
  mainWindow.webContents.send('update-available', info);
});

autoUpdater.on('download-progress', (progressObj) => {
  console.log(`Baixando: ${progressObj.percent}%`);
  // Envia progresso para React
  mainWindow.webContents.send('download-progress', progressObj.percent);
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('Atualização pronta para instalar!');
  // Notifica o React
  mainWindow.webContents.send('update-downloaded', info);
});
```

### No React (AutoUpdateNotification.tsx)

```typescript
// Escuta eventos do Electron
window.electron.onUpdateAvailable((info) => {
  setUpdateState('downloading');
});

window.electron.onDownloadProgress((percent) => {
  setDownloadProgress(percent);
});

window.electron.onUpdateDownloaded((info) => {
  setUpdateState('ready');
});
```

---

## ✅ Vantagens do Auto-Update

| Antes | Agora |
|-------|-------|
| ❌ Usuário precisa ir no GitHub | ✅ Detecta automaticamente |
| ❌ Baixar .exe manualmente | ✅ Baixa em background |
| ❌ Fechar app e instalar | ✅ Instala ao fechar (ou agora) |
| ❌ Muitos passos | ✅ Zero interação necessária |

---

## 🎯 Testando Auto-Update Localmente

### Simular Atualização:

1. **Criar versão 0.0.5 (nova)**
   ```powershell
   node scripts/update-version.js 0.0.5 "Teste auto-update"
   npm run build
   npm run build:exe
   ```

2. **Fazer release no GitHub**
   ```powershell
   git add .
   git commit -m "v0.0.5: Teste auto-update"
   git push origin main
   git tag -a v0.0.5 -m "v0.0.5"
   git push origin v0.0.5
   
   gh release create v0.0.5 "dist\Lucro Real Planner Setup 0.0.5.exe" `
     --title "v0.0.5 - Teste" `
     --notes "Teste de auto-update"
   ```

3. **Instalar versão antiga (0.0.4)**
   - Execute: `dist\Lucro Real Planner Setup 0.0.4.exe`
   - Instale normalmente

4. **Abrir app versão 0.0.4**
   - Aguarde 3 segundos
   - Deve aparecer notificação: "Baixando Atualização v0.0.5"
   - Progresso em tempo real
   - Quando terminar: "Atualização Pronta!"

5. **Instalar**
   - Clique "Instalar Agora" → fecha e instala v0.0.5 imediatamente
   - OU fecha o app normalmente → instala automaticamente

---

## 🔍 Verificação de Integridade

O `electron-updater` usa **blockmap** para:
- ✅ Download incremental (baixa só o que mudou)
- ✅ Verificação de checksums
- ✅ Retomar download interrompido
- ✅ Economia de banda

Arquivo gerado automaticamente: `Lucro Real Planner Setup 0.0.5.exe.blockmap`

---

## ⚠️ Troubleshooting

### Problema: "Não detecta atualização"

**Soluções:**
1. Verificar se `latest.yml` existe no release
2. Verificar se versão do release é maior que a instalada
3. Verificar logs do Electron: DevTools → Console

### Problema: "Erro ao baixar"

**Soluções:**
1. Verificar conexão com internet
2. Verificar se release é público (não draft)
3. Verificar se `.exe` está anexado no release

### Problema: "Instalação falha"

**Soluções:**
1. Windows Defender pode bloquear → adicionar exceção
2. Fechar completamente o app antes
3. Rodar como administrador

---

## 📦 Arquivos Importantes

| Arquivo | Função |
|---------|--------|
| `electron/main.js` | Configuração do autoUpdater |
| `electron/preload.js` | API bridge para React |
| `components/AutoUpdateNotification.tsx` | UI de notificação |
| `electron-builder.json` | Configuração de publish |
| `latest.yml` | Metadados de versão (gerado automaticamente) |

---

## 🎉 Resultado Final

**Usuário abre o app:**
1. ✅ App verifica atualizações sozinho
2. ✅ Baixa nova versão em background
3. ✅ Mostra notificação discreta
4. ✅ Instala ao fechar (ou agora se quiser)

**Zero fricção! Zero passos manuais!** 🚀

---

## 🔐 Segurança

- ✅ Verifica assinatura digital do GitHub
- ✅ Usa HTTPS para download
- ✅ Checksum validation via blockmap
- ✅ Só aceita releases do repositório oficial

---

*Última atualização: 28/01/2026*
