const {desktopCapturer} = require('electron');



async function getScreenStream() {
  const sources = await desktopCapturer.getSources({ types: ['window', 'screen'] });

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
      const video = document.getElementById('videoID');
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        video.play();
      }
  }, (err) => {
      //handle err
      console.error(err)
  })

}

getScreenStream();