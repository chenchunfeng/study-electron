const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');

let win;

// app.allowRendererProcessReuse = true;
app.on('ready', () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      // contextIsolation: false,
    }
  })

  if (isDev)  {
    win.webContents.openDevTools();
    win.loadURL('http://localhost:3000');
  } else {
    // 加载打包好的前端项目
    win.loadFile(path.resolve(__dirname, '../../renderer/pages/main/index.html'))
  }
  ipcMain.on('hello', (e, remote) => {
    console.log('hello');
  })
})