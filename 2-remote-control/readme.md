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