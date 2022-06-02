import { useState, useEffect } from 'react';
import './App.css';
import { ipcRenderer } from 'electron';
// const { ipcRenderer } = window.require ? window.require("electron") : {};

// 傀儡端代码
import './peer-puppet';

function App() {
  const [localCode, setLocalCode] = useState('');
  const [remoteCode, setRemoteCode] = useState('');
  const [controlText, setControlText] = useState('');

  useEffect(() => {
    // 1. 登陆生成自己的控制码
    login();
    // 2. 监听状态
    ipcRenderer.on('control-state-change', handleControlState);
    // 3. 处理input输入
    // 4. 确定开始连接 弹出新窗体
    
    // 卸载时调用
    return () => {
      ipcRenderer.removeAllListeners('control-state-change',  handleControlState)
    }
  }, [])

  function login() {
    ipcRenderer.invoke('login').then(code => {
      setLocalCode(code);
    })
  }

  function handleControlState(e, name, type) {
    let text = ''
    if(type === 1) {
      text = `正在远程控制${name}`;
    }
    if(type === 2) {
      text = `被${name}控制中`;
    }
    setControlText(text);
  }
  
  function startControl() {
    ipcRenderer.send('control', remoteCode)
  }

  return (
    <div className="App">
      <header className="App-header">
          {
            controlText ?  <div>{controlText}</div> : 
            <>
              <div>你的控制码{ localCode }</div>
              <input value={ remoteCode } onChange={ (e) => setRemoteCode(e.target.value) }></input>
              <button onClick={ startControl }>确认</button>
            </>
          }
      </header>
    </div>
  );
}

export default App;
