const peer = require('./peer-control');

// 播放傀儡端发送过来的视频流
peer.on('add-stream', (stream) => {
    console.log('play stream');
    play(stream)
});

const video = document.getElementById('videoID');

function play(stream) {
    video.srcObject = stream;
    video.onloadedmetadata = () => {
        video.play();
    }
}

// 监听键鼠的操作，通过peer发送给服务端，服务端接收后发给傀儡端
window.onkeydown = function(e) {
    // data {keyCode, meta, alt, ctrl, shift}
    let data = {
        keyCode: e.keyCode,
        shift: e.shiftKey,
        meta: e.metaKey,
        control: e.ctrlKey,
        alt: e.altKey
    }
    peer.emit('robot', 'key', data);
}

window.onmouseup = function(e) {
    // data {clientX, clientY, screen: {width, height}, video: {width, height}}
    let data = {}
    data.clientX = e.clientX
    data.clientY = e.clientY
    data.video = {
        width: video.getBoundingClientRect().width,
        height: video.getBoundingClientRect().height
    }
    peer.emit('robot', 'mouse', data);
}
