# Electron 打包指南

本指南说明如何将 React 项目打包成 Windows exe 文件。

## 推荐方式：使用 GitHub Actions（推荐）

由于本地构建可能遇到网络问题和权限问题，推荐使用 GitHub Actions 进行云端构建。

### 快速开始

1. 运行 `setup-github-actions.bat` 脚本自动设置
2. 在 GitHub 网页上点击 Actions 标签
3. 选择 "Build Windows EXE" 工作流
4. 点击 "Run workflow" 开始构建
5. 等待 5-10 分钟后下载生成的 exe 文件

详细说明请参考 [GITHUB_ACTIONS_BUILD.md](GITHUB_ACTIONS_BUILD.md)

### 优势

- 无需本地安装 Electron
- 自动处理网络和权限问题
- 构建环境稳定可靠
- 自动缓存依赖，构建速度快
- 免费使用（公开仓库或私有仓库每月 2000 分钟）

---

## 本地构建方式

如果需要在本地构建，请按照以下步骤操作。

## 前置要求

1. Node.js 已安装
2. npm 或 yarn 已安装
3. 项目已构建完成（`npm run build`）

## 安装依赖

由于 Electron 下载可能遇到网络问题，建议使用以下步骤：

### 方法一：使用国内镜像（推荐）

```bash
# 设置 Electron 镜像（PowerShell）
$env:ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"

# 安装依赖
npm install --save-dev electron electron-builder concurrently wait-on cross-env --legacy-peer-deps
```

### 方法二：手动下载

如果自动下载失败，可以手动下载 Electron：

1. 访问 [Electron 官方下载页面](https://npmmirror.com/mirrors/electron/)
2. 下载对应版本的 zip 文件
3. 解压到 `%USERPROFILE%\.electron\` 目录

### 方法三：使用代理

```bash
# 如果有代理，设置代理后安装
npm config set proxy http://your-proxy:port
npm config set https-proxy http://your-proxy:port
npm install --save-dev electron electron-builder concurrently wait-on cross-env --legacy-peer-deps
```

## 配置说明

### 已创建的文件

1. **electron/main.js** - Electron 主进程文件
   - 创建应用窗口
   - 加载 React 应用
   - 处理窗口事件

2. **electron/preload.js** - 预加载脚本
   - 安全地暴露 Electron API

3. **package.json** - 已更新配置
   - 添加了 Electron 相关脚本
   - 配置了 electron-builder 打包设置

### package.json 新增脚本

- `npm run electron` - 直接运行 Electron（需要先构建）
- `npm run electron-dev` - 开发模式运行（同时启动 React 开发服务器和 Electron）
- `npm run electron-pack` - 打包所有平台
- `npm run electron-pack-win` - 仅打包 Windows 版本

## 打包步骤

### 1. 开发模式测试（可选）

```bash
npm run electron-dev
```

这将同时启动 React 开发服务器和 Electron 应用，方便调试。

### 2. 生产构建

```bash
npm run build
```

这将在 `build/` 目录生成生产版本的 React 应用。

### 3. 打包成 exe 文件

```bash
npm run electron-pack-win
```

这将：
1. 执行 `npm run build` 构建生产版本
2. 使用 electron-builder 打包成 Windows 安装程序
3. 在 `dist/` 目录生成 exe 文件

## 输出文件

打包完成后，在 `dist/` 目录会生成：

- **Lofi Music Setup 0.1.0.exe** - 安装程序（推荐）
- **Lofi Music 0.1.0.exe** - 免安装版本

## 自定义配置

### 修改应用名称

编辑 `package.json` 中的 `build.productName`：

```json
"build": {
  "productName": "你的应用名称",
  ...
}
```

### 修改应用图标

将图标文件（建议 256x256 PNG 或 ICO 格式）放在 `public/assets/icons/icon.png`，然后更新 `package.json`：

```json
"win": {
  "icon": "public/assets/icons/icon.png"
}
```

### 修改窗口大小

编辑 `electron/main.js`：

```javascript
mainWindow = new BrowserWindow({
  width: 1280,  // 窗口宽度
  height: 800,  // 窗口高度
  minWidth: 800,  // 最小宽度
  minHeight: 600,  // 最小高度
  ...
});
```

### 添加其他平台支持

编辑 `package.json` 的 `build` 配置：

```json
"build": {
  "win": {
    "target": ["nsis", "portable"]
  },
  "mac": {
    "target": ["dmg", "zip"]
  },
  "linux": {
    "target": ["AppImage", "deb"]
  }
}
```

## 常见问题

### 1. Electron 下载失败

**问题**：`unable to verify the first certificate`

**解决方案**：
- 使用国内镜像（见方法一）
- 或手动下载 Electron 二进制文件
- 或配置 npm 代理

### 2. 打包后应用无法启动

**问题**：双击 exe 文件后无反应

**解决方案**：
- 检查 `electron/main.js` 中的路径是否正确
- 确保 `build/` 目录存在且包含所有必要文件
- 检查控制台错误日志

### 3. 资源文件加载失败

**问题**：图片、音频等资源无法加载

**解决方案**：
- 确保使用相对路径
- 在 React 中使用 `process.env.PUBLIC_URL` 获取资源路径
- 检查 `public/` 目录的资源是否正确复制到 `build/` 目录

### 4. 窗口大小不合适

**问题**：窗口太大或太小

**解决方案**：
- 修改 `electron/main.js` 中的窗口尺寸
- 或在应用中添加响应式设计

### 5. 打包文件过大

**问题**：exe 文件超过 100MB

**解决方案**：
- Electron 应用本身较大（约 50-100MB），这是正常的
- 可以使用 `asar` 压缩（electron-builder 默认启用）
- 移除不必要的依赖

## 性能优化

### 1. 减小打包体积

```json
"build": {
  "files": [
    "build/**/*",
    "electron/**/*",
    "package.json"
  ],
  "asar": true,  // 启用 asar 压缩
  "compression": "maximum"  // 最大压缩
}
```

### 2. 优化启动速度

- 使用生产构建（`npm run build`）
- 减少初始加载的资源
- 使用代码分割（React.lazy）

### 3. 减少内存占用

- 及时清理不用的组件
- 避免内存泄漏
- 使用 React.memo 优化渲染

## 发布

### 1. 版本管理

更新 `package.json` 中的版本号：

```json
{
  "version": "1.0.0"
}
```

### 2. 自动更新

可以集成 `electron-updater` 实现自动更新功能：

```bash
npm install electron-updater
```

### 3. 代码签名

发布到公网时，建议对 exe 文件进行代码签名，避免安全警告。

## 参考资料

- [Electron 官方文档](https://www.electronjs.org/docs)
- [electron-builder 文档](https://www.electron.build/)
- [React + Electron 教程](https://www.electronjs.org/docs/tutorial/tutorial-1-prerequisites)

## 快速命令参考

```bash
# 安装依赖（使用镜像）
$env:ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
npm install --save-dev electron electron-builder concurrently wait-on cross-env --legacy-peer-deps

# 开发模式运行
npm run electron-dev

# 生产构建
npm run build

# 打包 Windows 版本
npm run electron-pack-win

# 打包所有平台
npm run electron-pack
```

## 注意事项

1. 首次打包可能需要较长时间（5-15分钟）
2. 确保 Node.js 版本兼容（建议 14+）
3. 打包前请先测试应用功能是否正常
4. 打包后的应用在无网络环境下也能运行
5. 如遇到问题，请查看 `dist/` 目录下的日志文件