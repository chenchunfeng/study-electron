const {app, BrowserWindow, Notification, ipcMain} = require('electron')
const Notifier = require('node-notifier');
let win
app.on('ready', () => {
    win = new BrowserWindow({
        width: 300,
        height: 300,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.loadFile('./index.html')
    handleIPC()
})

function handleIPC() {
  ipcMain.handle('work-notification', async function () {
      let res = await new Promise((resolve, reject) => {
          Notifier.notify({
              title: '任务结束',
              message: '是否开始休息',
              actions: ['ok','cancel'],
              wait: true,
          }, function (err, response) {

            if (response === 'ok') {
                return resolve('rest');
            }

            return resolve('work')
          });
          // Built-in actions:
            // Notifier.on('timeout', () => {
            //     console.log('Timed out!');
            // });
            // Notifier.on('activate', () => {
            //     console.log('Clicked!');
            // });
            // Notifier.on('dismissed', () => {
            //     resolve('work')
            //     console.log('Dismissed!');
            // });
            
            // // Buttons actions (lower-case):
            // Notifier.on('ok', () => {
            //     resolve('rest')
            //     console.log('"Ok" was pressed');
            // });
            // Notifier.on('cancel', () => {
            //     resolve('work')
            //     console.log('"Cancel" was pressed');
            // });
      })
      return res
  })
}