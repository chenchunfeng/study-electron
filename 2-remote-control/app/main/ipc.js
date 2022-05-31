const { ipcMain } = require('electron');
const {send: sendMainWindow} = require('./windows/main.js');
const {create: createControlWindow} = require('./windows/control.js');

module.exports = function () {
  ipcMain.handle('login', () => {
    // 随机6位数字
    return Math.floor(Math.random() * (999999 - 100000)) + 100000;
  })

  ipcMain.on('control', (e, remoteCode) => {
    // 0 未连接 1 控制别人  2 被控制
    sendMainWindow('control-state-change', remoteCode, 1);
    createControlWindow();
  })

  
} 