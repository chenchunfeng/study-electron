const { ipcMain } = require('electron');
const { send: sendMainWindow } = require('./windows/main.js');
const { create: createControlWindow, send: sendControlWindow } = require('./windows/control.js');

const signal = require('./signal');
module.exports = function () {

  ipcMain.handle('login', async () => {
    // 发送登录信息
    let { code } = await signal.invoke('login', null, 'logined');
    return code;
  })

  // 状态 0 未连接 1 控制别人  2 被控制
  ipcMain.on('control', (e, remote) => {
      // 这里是跟服务端的交互，成功后我们会唤起面板
      signal.send('control', { remote });
  })

  signal.on('controlled', (data) => {
      sendMainWindow('control-state-change', data.remote, 1);
      createControlWindow();
  })

  signal.on('be-controlled', (data) => {
      sendMainWindow('control-state-change', data.remote, 2);
  })

  // puppet、control共享的信道，就是转发
  ipcMain.on('forward', (e, event, data) => {
      signal.send('forward', { event, data });
  })

  // 收到offer，puppet响应
  signal.on('offer', (data) => {
      sendMainWindow('offer', data)
  })
  
  // 收到puppet证书，answer响应
  signal.on('answer', (data) => {
      sendControlWindow('answer', data)
  })
  
  // 收到control证书，puppet响应
  signal.on('puppet-candidate', (data) => {
      sendControlWindow('candidate', data)
  })
  
  // 收到puppet证书，control响应
  signal.on('control-candidate', (data) => {
      sendMainWindow('candidate', data)
  })
} 