import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  // Você pode adicionar APIs aqui se precisar
});
