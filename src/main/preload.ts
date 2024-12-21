import { contextBridge, ipcRenderer } from 'electron';

interface ElectronHandler {
  ipcRenderer: {
    sendMessage(channel: string, ...args: unknown[]): void;
    on(channel: string, func: (...args: unknown[]) => void): () => void;
    once(channel: string, func: (...args: unknown[]) => void): void;
  };
  getCompanyInfo: () => Promise<{ name: string; address: string; email: string; website: string }>;
}

const electronHandler: ElectronHandler = {
  ipcRenderer: {
    sendMessage(channel, ...args) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel, func) {
      const subscription = (_event: Electron.IpcRendererEvent, ...args: unknown[]) => func(...args);
      ipcRenderer.on(channel, subscription);
      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel, func) {
      ipcRenderer.once(channel, (_event, ...args: unknown[]) => func(...args));
    },
  },
  getCompanyInfo: async () => ipcRenderer.invoke('get-company-info'),
};

// Expose in the renderer process
contextBridge.exposeInMainWorld('electron', electronHandler);
