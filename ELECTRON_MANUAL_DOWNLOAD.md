# Electron 手动下载指南

由于网络问题导致 Electron 自动下载失败，可以使用以下方法手动下载和配置。

## 方法一：配置缓存目录并手动下载（推荐）

### 1. 查看 package.json 中的 Electron 版本

首先查看已安装的 Electron 版本：

```bash
npm list electron
```

或者查看 package.json 中的 electron 版本。

### 2. 配置 Electron 缓存目录

Electron 默认缓存目录位置：
- **Windows**: `%USERPROFILE%\.electron\`
- **macOS**: `~/Library/Caches/electron/`
- **Linux**: `~/.cache/electron/`

在 PowerShell 中设置环境变量：

```powershell
# 设置 Electron 缓存目录（可选，如果使用默认目录则不需要）
$env:ELECTRON_CACHE="$env:USERPROFILE\.electron"
```

### 3. 手动下载 Electron

#### 方式 A：使用国内镜像下载（推荐）

访问国内镜像站点下载对应版本的 Electron：

**下载地址**：
- 主镜像：https://npmmirror.com/mirrors/electron/
- 备用镜像：https://cdn.npmmirror.com/binaries/electron/

**下载步骤**：
1. 访问上述镜像网站
2. 找到对应版本的文件夹（例如：v39.2.7）
3. 下载 `electron-v39.2.7-win32-x64.zip` 文件（约 137 MB）
4. 下载对应的 SHASUMS256.txt 文件（用于校验）

#### 方式 B：使用浏览器直接下载

直接在浏览器中打开以下链接下载：

```
https://npmmirror.com/mirrors/electron/v39.2.7/electron-v39.2.7-win32-x64.zip
```

### 4. 将下载的文件放到缓存目录

将下载的 zip 文件放到以下位置：

```powershell
# 创建缓存目录（如果不存在）
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.electron\"

# 将下载的 zip 文件复制到缓存目录
# 假设文件下载到了 Downloads 文件夹
Copy-Item "$env:USERPROFILE\Downloads\electron-v39.2.7-win32-x64.zip" "$env:USERPROFILE\.electron\"
```

### 5. 验证文件

确保文件完整：

```powershell
# 检查文件是否存在
Test-Path "$env:USERPROFILE\.electron\electron-v39.2.7-win32-x64.zip"

# 查看文件大小（应该约为 137 MB）
(Get-Item "$env:USERPROFILE\.electron\electron-v39.2.7-win32-x64.zip").Length / 1MB
```

### 6. 重新安装或运行

现在可以重新运行安装命令：

```bash
npm install --save-dev electron electron-builder concurrently wait-on cross-env --legacy-peer-deps
```

或者直接运行打包命令：

```bash
npm run electron-pack-win
```

## 方法二：使用下载脚本（自动化）

### 创建下载脚本

创建 `download-electron.ps1` 文件：

```powershell
# download-electron.ps1
param(
    [string]$Version = "39.2.7",
    [string]$OutputDir = "$env:USERPROFILE\.electron"
)

Write-Host "正在下载 Electron $Version..." -ForegroundColor Green

# 创建输出目录
New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

# 下载 URL
$Url = "https://npmmirror.com/mirrors/electron/v${Version}/electron-v${Version}-win32-x64.zip"
$OutputFile = Join-Path $OutputDir "electron-v${Version}-win32-x64.zip"

Write-Host "下载地址: $Url" -ForegroundColor Yellow
Write-Host "保存位置: $OutputFile" -ForegroundColor Yellow

# 使用 Invoke-WebRequest 下载
try {
    Write-Host "开始下载..." -ForegroundColor Cyan
    Invoke-WebRequest -Uri $Url -OutFile $OutputFile -UseBasicParsing

    # 检查文件大小
    $FileSize = (Get-Item $OutputFile).Length / 1MB
    Write-Host "下载完成！文件大小: $([math]::Round($FileSize, 2)) MB" -ForegroundColor Green

    if ($FileSize -lt 100) {
        Write-Host "警告：文件大小异常，可能下载不完整" -ForegroundColor Red
    }
}
catch {
    Write-Host "下载失败: $_" -ForegroundColor Red
    exit 1
}

Write-Host "Electron 下载完成！" -ForegroundColor Green
```

### 使用脚本下载

```powershell
# 下载默认版本 (39.2.7)
.\download-electron.ps1

# 下载指定版本
.\download-electron.ps1 -Version "39.2.7"

# 指定输出目录
.\download-electron.ps1 -OutputDir "D:\electron-cache"
```

## 方法三：使用代理或加速器

### 使用代理

```powershell
# 设置 HTTP 代理
$env:HTTP_PROXY="http://127.0.0.1:7890"
$env:HTTPS_PROXY="http://127.0.0.1:7890"

# 然后运行安装命令
npm install --save-dev electron electron-builder concurrently wait-on cross-env --legacy-peer-deps
```

### 使用下载加速器

如果下载速度慢，可以使用下载加速器（如 IDM、迅雷等）：

1. 复制下载链接：
   ```
   https://npmmirror.com/mirrors/electron/v39.2.7/electron-v39.2.7-win32-x64.zip
   ```
2. 使用下载加速器下载
3. 将下载的文件放到 `%USERPROFILE%\.electron\` 目录

## 方法四：使用淘宝镜像（npm 配置）

```bash
# 设置 npm 镜像
npm config set registry https://registry.npmmirror.com

# 设置 Electron 镜像
npm config set electron_mirror https://npmmirror.com/mirrors/electron/

# 设置 Electron 自定义目录
npm config set electron_cache "$env:USERPROFILE\.electron"

# 重新安装
npm install --save-dev electron electron-builder concurrently wait-on cross-env --legacy-peer-deps
```

## 验证安装

安装完成后，验证 Electron 是否正确安装：

```bash
# 检查 Electron 版本
npx electron --version

# 或者
npm list electron
```

## 常见问题

### 1. 文件损坏或解压失败

**问题**：`cannot unpack electron zip file`

**解决方案**：
- 重新下载 zip 文件
- 确保下载完整（文件大小约为 137 MB）
- 使用校验和验证文件完整性

### 2. 权限问题

**问题**：无法写入缓存目录

**解决方案**：
```powershell
# 以管理员身份运行 PowerShell
# 或修改缓存目录权限
icacls "$env:USERPROFILE\.electron" /grant "${env:USERNAME}:(OI)(CI)F"
```

### 3. 版本不匹配

**问题**：下载的版本与 package.json 不一致

**解决方案**：
- 检查 package.json 中的 electron 版本
- 下载对应版本的文件
- 或更新 package.json 中的版本号

### 4. 磁盘空间不足

**问题**：下载失败，提示磁盘空间不足

**解决方案**：
- 清理缓存目录：`Remove-Item -Recurse -Force "$env:USERPROFILE\.electron\*"`
- 更改缓存目录到其他磁盘
- 清理系统临时文件

## 快速命令参考

```powershell
# 1. 设置镜像
$env:ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"

# 2. 创建缓存目录
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.electron\"

# 3. 手动下载（在浏览器中打开）
# https://npmmirror.com/mirrors/electron/v39.2.7/electron-v39.2.7-win32-x64.zip

# 4. 将下载的文件复制到缓存目录
Copy-Item "$env:USERPROFILE\Downloads\electron-v39.2.7-win32-x64.zip" "$env:USERPROFILE\.electron\"

# 5. 验证文件
Test-Path "$env:USERPROFILE\.electron\electron-v39.2.7-win32-x64.zip"

# 6. 重新安装
npm install --save-dev electron electron-builder concurrently wait-on cross-env --legacy-peer-deps

# 7. 打包
npm run electron-pack-win
```

## 下载链接汇总

### Electron v39.2.7（当前版本）

- **主镜像**: https://npmmirror.com/mirrors/electron/v39.2.7/electron-v39.2.7-win32-x64.zip
- **备用镜像**: https://cdn.npmmirror.com/binaries/electron/v39.2.7/electron-v39.2.7-win32-x64.zip
- **GitHub 官方**: https://github.com/electron/electron/releases/download/v39.2.7/electron-v39.2.7-win32-x64.zip

### 其他版本

将版本号替换为所需版本即可，例如 v30.0.0：
- https://npmmirror.com/mirrors/electron/v30.0.0/electron-v30.0.0-win32-x64.zip

## 注意事项

1. **文件大小**：Electron zip 文件通常在 100-150 MB 之间
2. **下载时间**：根据网络速度，可能需要 5-30 分钟
3. **版本匹配**：确保下载的版本与 package.json 中的一致
4. **文件完整性**：下载后检查文件大小，确保下载完整
5. **缓存清理**：如果遇到问题，可以删除缓存目录重新下载

## 联系支持

如果以上方法都无法解决问题，请：
1. 检查网络连接
2. 尝试使用不同的镜像源
3. 查看错误日志
4. 寻求技术支持