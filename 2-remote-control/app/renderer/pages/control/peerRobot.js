const { ipcRenderer } = require('electron');

window.onkeydown = function(e) {
  // data {keyCode, meta, alt, ctrl, shift}
  let data = {
      keyCode: e.keyCode,
      shift: e.shiftKey,
      meta: e.metaKey,
      control: e.ctrlKey,
      alt: e.altKey
  }
  sendRobotToMain('key', data);

}

window.onmouseup = function(e) {
  // data {clientX, clientY, screen: {width, height}, video: {width, height}}
  let data = {};
  data.clientX = e.clientX;
  data.clientY = e.clientY;
  const video = document.getElementById('videoID');
  data.video = {
      width: video.getBoundingClientRect().width,
      height: video.getBoundingClientRect().height
  }
  sendRobotToMain('mouse', data);
}


function sendRobotToMain(type, data) {
  if(type === 'mouse') {
    data.screen = {
        width: window.screen.width, 
        height: window.screen.height
    }
  }
  setTimeout(() => {
    ipcRenderer.send('robot', type, data)
  }, 2000)
}