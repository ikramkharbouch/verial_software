import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('popupAPI', {
  sendCloseRequest: (title: string) => {
    ipcRenderer.send(`close-popup-${title}`);
  },
  onPopupTitle: (callback: (title: string) => void) => {
    ipcRenderer.on('popup-title', (event, title) => callback(title));
  }
});