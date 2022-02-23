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
│       ├── pages 
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