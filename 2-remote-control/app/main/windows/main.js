const { BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');

let win;

function create() {
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
}

// 主进程 向 渲染线程发送消息
function send(channel, ...args) {
  win.webContents.send(channel, ...args)
}

module.exports = {
  create,
  send
}
