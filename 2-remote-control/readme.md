### 目录结构

```shell
├── package.json 
├── app 
│   ├── common                    // 公共代码 存放渲染进程、主进程可复用代码
│   │   ├── ipc-channel.js 
│   │   └── util.js 
│   ├── main                      // 主进程
│   │   ├── index.js 
│   │   └── windows 
│   │       ├── control.js 
│   │       └── main.js 
│   └── renderer                 // 渲染进程
│       ├── pages                // 放react | vue  build的产物
│       │   ├── control 
│       │   │   └── index.html 
│       │   └── main 
│       └── src                 // 放react | vue
├── resource 
├── release 
└── dist

```

• common 存放渲染进程、主进程可复用代码 
• 前端框架在 render/src/页面，构建产物在 pages/ 页面 
• 纯 JS 直接在 Pages 页面下

1. 在src 使用react 项目 npx create-react-app main --use-npm   node 版本要求 >= 14
2. 在package.json里面配置启动指令

```javascript
{
    "start:main": "electron .",
    "start:renderer": "cd app/renderer/src/react-web && npm start"
}

```

3. react-web 启动加上BROWSER=none 就会不启动浏览器
  "start": "react-scripts start",  -> "start": "cross-env BROWSER=none react-scripts start", 

需要安装 npm install cross-env -D

4. 使用electron is dev 判断是否为开发 生产环境
通过是否设置环境变量 ELECTRON_IS_DEV 是否设置 是否等于1判断
如果没设置，通过electron.app.isPackaged 是否打包判断
```javascript

'use strict';
  const electron = require('electron');

  if (typeof electron === 'string') {
    throw new TypeError('Not running in an Electron environment!');
  }

  const isEnvSet = 'ELECTRON_IS_DEV' in process.env;
  const getFromEnv = Number.parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;

  module.exports = isEnvSet ? getFromEnv : !electron.app.isPackaged;

```

5. renderer 页面需要引入electron 

 > nodejs 运行时的 require 与编译时 webpack 的 require 是不同的。默认情况下，window 是全局的，然而在 webpack 编译时会忽略 window 。
  所以，可以使用window.require来引入electron
  const { ipcRenderer } = window.require ? window.require("electron") : {};
  window还要配置才有值
  ```javascript
    win = new BrowserWindow({
    width: 600,
    height: 300,
    webPreference: {
      nodeIntegration: true,
      contextIsolation: false,  // 不隔离
    }
  })
  ```

  如果要使用import from 语法

  需要重写webpack target

  使用customize-cra react-app-rewired 这两个包处理
  添加config-overrides.js
  修改start指令

6. 使用concurrently wait-on 包，编写先打开一个指令，等待后再打开一个指令
  concurrently 同时执行指令
  ```javascript
    "start": "concurrently \"npm run start:render\" \"wait-on http://localhost:3000 && npm run start:main\" ",
  ```

### 回顾ipc
ipc inter-process communication  进程间通信
rpc remote procedure call 远程程序调用

• 渲染进程请求+主进程响应（获取自己的控制码） ipcRenderer.invoke + ipcMain.handle 
• 主进程推送（告知状态），webContents.send，ipcRenderer.on 
• 渲染进程发起请求（申请控制），ipcRenderer.send，ipcMain.on

需求梳理

1. login 生成自己的连接码
2. 监听状态 0 未连接 1 控制别人  2 被控制
3. 输入别人的状态码，后端校验，响应状态监听，弹出新窗口。


> Fragments的短语法，其不占用dom节点，https://zh-hans.reactjs.org/docs/fragments.html#gatsby-focus-wrapper   <></>
> 微信小程序也有一个block标签


### 傀儡端实现：捕获桌面视频流
```javascript
// 例子：捕获音视频媒体流
let promise = navigator.mediaDevices.getUserMedia({ 
    audio: true,  
    video: { 
        width: { min: 1024, ideal: 1280, max: 1920 }, 
        height: { min: 576, ideal: 720, max: 1080 }, 
        frameRate: { max: 30 } 
    } 
})

// 如何播放媒体流对象
promise.then(stream => {
  var video = document.querySelector('video') 
  video.srcObject = stream 
  video.onloadedmetadata = function(e) { 
      video.play(); 
  }
})

```

### 控制端 键盘鼠标事件监听

1. html 监听控制端的操作。
2. 传到主进程，主进程使用robot.js在傀儡端执行指令。

使用安装
- robotjs 执行键盘鼠标指令
  - 先使用管理员权限的power shell 安装npm install --global --production windows-build-tools
  - 如果不成功能，手动安装 windows-build-tools目录下的python各vs tools
  - npm install -g node-gyp@7 p(要安装7.x版本的，这个版本的python才能用2.x的)
  - npm install
  - node-gyp rebuild 如果电脑有其它版本的 加 --python C:\Python27\python.exe
  - npx electron-rebuild
  - 搞了我三天的时候上面的可忽略，还是得靠npm安装 cnpm有问题
    -  npm install -g windows-build-tools 这里安装c++ 和python
    -  npm install -g node-gyp v8.4.1
    -  npm install robotjs -S
  
- vkey     keyCode 转 keyName
- electron-rebuild 根据当前环境编译robotjs  npx electron-rebuild