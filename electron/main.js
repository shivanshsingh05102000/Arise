const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

let mainWindow
let store

async function loadStore() {
  if (!store) {
    const Store = (await import('electron-store')).default
    store = new Store({ name: 'arise-state' })
  }
  return store
}

async function loadDevUrlWithRetry(retries = 50) {
  const devUrl = 'http://localhost:5173'
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await mainWindow.loadURL(devUrl)
      return
    } catch (error) {
      if (attempt === retries) throw error
      await new Promise((resolve) => setTimeout(resolve, 200))
    }
  }
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    transparent: true,
    hasShadow: false,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })
  mainWindow.setBackgroundColor('#00000000')

  if (!app.isPackaged) {
    await loadDevUrlWithRetry()
    if (process.env.ARISE_OPEN_DEVTOOLS === '1') mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    await mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  }
}

ipcMain.on('window-minimize', () => mainWindow?.minimize())
ipcMain.on('window-maximize', () => {
  if (!mainWindow) return
  mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
})
ipcMain.on('window-close', () => mainWindow?.close())

ipcMain.handle('store-get', async () => {
  const activeStore = await loadStore()
  return activeStore.get('state')
})

ipcMain.handle('store-set', async (_event, state) => {
  const activeStore = await loadStore()
  activeStore.set('state', state)
  return state
})

ipcMain.handle('store-reset', async () => {
  const activeStore = await loadStore()
  activeStore.delete('state')
  return true
})

app.whenReady().then(createWindow)

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
