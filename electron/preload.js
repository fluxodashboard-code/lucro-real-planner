const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // Você pode adicionar APIs aqui se precisar
});
