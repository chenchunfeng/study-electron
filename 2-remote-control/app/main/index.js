const { app } = require('electron');

const handleIPC = require('./ipc');
const {create: createMainWindow} = require('./windows/main.js');


app.on('ready', () => {
  handleIPC();
  createMainWindow();
  // 主进程监听控制端键鼠操作
  require('./robot.js')();  
})                                                  