import {ipcRenderer, desktopCapturer} from 'electron';

// 监听控制端 发送过来的offer消息
ipcRenderer.on('offer', (e, offer) => {

    console.log('init pc', offer);
    const pc = new window.RTCPeerConnection();
	
    pc.ondatachannel = (e) => {
        console.log('data', e);
        e.channel.onmessage = (e)  => {
          console.log('onmessage', e, JSON.parse(e.data));
          let {type, data} = JSON.parse(e.data);
          console.log('robot', type, data);
          if(type === 'mouse') {
              data.screen = {
                  width: window.screen.width, 
                  height: window.screen.height
              }
          }
          // 收到控制端发过来的键鼠操作接口，发送给主进程的robotjs操作
          ipcRenderer.send('robot', type, data);
        }
	  }

    async function getScreenStream() {
        const sources = await desktopCapturer.getSources({types: ['screen']})
        return new Promise((resolve, reject) => {
            navigator.webkitGetUserMedia({
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: sources[0].id,
                        maxWidth: window.screen.width,
                        maxHeight: window.screen.height
                    }
                }
            }, (stream) => {
                console.log('add-stream', stream)
                resolve(stream)
            }, reject)
        })
    }
    // ICE（Interactive Connectivity Establishment）交互式连接创建
    pc.onicecandidate = (e) => {
        // 告知其他人
        ipcRenderer.send('forward', 'puppet-candidate', e.candidate)
    }

    async function createAnswer(offer) {
        let stream = await getScreenStream();
        pc.addStream(stream);
        await pc.setRemoteDescription(offer);
        await pc.setLocalDescription(await pc.createAnswer());
        console.log('create answer \n', JSON.stringify(pc.localDescription));
        // send answer
        return pc.localDescription;
    }
    createAnswer(offer).then((answer) => {
        ipcRenderer.send('forward', 'answer', {type: answer.type, sdp: answer.sdp});
    })
	
})

