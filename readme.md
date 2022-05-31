### windows 安装流程
1. [Electron](https://github.com/coreybutler/nvm-windows/releases) 下载nvm-setup.zip
2. 安装node npm
3. npm install --arch=ia32 --platform=win32 -save-dev  electron  指定32位平台开发
4. 验证是安装成功
  - npx electron -v 
  - ./node_modules/.bin/electron -v


>  set "ELECTRON_MIRROR=http://npm.taobao.org/mirrors/electron" && npm install


### Notification actions closeButtonText macOs特有

win8以上使用 [node-notifier](https://github.com/mikaelbr/node-notifier)




