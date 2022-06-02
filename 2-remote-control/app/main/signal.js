const WebSocket = require('ws');
const EventEmitter = require('events');
const signal = new EventEmitter();
const { dialog } = require('electron');

// 部署后要使用websocket server服务器IP
const ws = new WebSocket('ws://127.0.0.1:8010'); 

// ws 监听open事件
ws.on('open', () => {
    console.log('ws open');
})

// ws 监听message事件
ws.on('message', (data) => {
    console.log('ws message', data);
    let message = JSON.parse(data);
    signal.emit(message.event, message.data);
})

// ws 监听close事件
ws.on('close', () => {
    console.log('ws close');
})

// signal 监听error事件
signal.on('error', (data) => {
    console.log('ws error');
    dialog.showMessageBox({
        type: 'error',
        title: 'error',
        message: JSON.stringify(data)
    })
})

// 创建一个发送信息的方法
function send(event, data) {
    let message = JSON.stringify({ event, data });
    ws.send(message);
}
// 创建一个invoke发送信息的方法
function invoke(event, data, answerEvent) {
    return new Promise((resolve, reject) => {
        let message = JSON.stringify({ event, data });
        ws.send(message, (err) => {
            if(err) {
                reject(err);
            } else {
                signal.once(answerEvent, (data) => {
                    resolve(data);
                });
            }
        });

    })
}
// 把send invoke 放在signal对象上
signal.send = send;
signal.invoke = invoke;                             

// 导出signal
module.exports = signal;