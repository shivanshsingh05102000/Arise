const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('arise', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  store: {
    get: () => ipcRenderer.invoke('store-get'),
    set: (state) => ipcRenderer.invoke('store-set', state),
    reset: () => ipcRenderer.invoke('store-reset'),
  },
})
