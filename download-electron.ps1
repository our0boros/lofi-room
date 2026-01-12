param(
    [string]$Version = "39.2.7",
    [string]$OutputDir = "$env:USERPROFILE\.electron"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Electron 手动下载工具" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "配置信息:" -ForegroundColor Yellow
Write-Host "  版本: $Version" -ForegroundColor White
Write-Host "  输出目录: $OutputDir" -ForegroundColor White
Write-Host ""

$FileName = "electron-v${Version}-win32-x64.zip"
$OutputFile = Join-Path $OutputDir $FileName

$Url = "https://npmmirror.com/mirrors/electron/v${Version}/$FileName"

Write-Host "下载信息:" -ForegroundColor Yellow
Write-Host "  URL: $Url" -ForegroundColor White
Write-Host "  保存路径: $OutputFile" -ForegroundColor White
Write-Host ""

if (Test-Path $OutputFile) {
    $ExistingSize = (Get-Item $OutputFile).Length / 1MB
    Write-Host "警告: 文件已存在！" -ForegroundColor Yellow
    Write-Host "  文件大小: $([math]::Round($ExistingSize, 2)) MB" -ForegroundColor White
    $Response = Read-Host "是否重新下载？(Y/N)"
    
    if ($Response -ne "Y" -and $Response -ne "y") {
        Write-Host "已取消下载" -ForegroundColor Red
        exit 0
    }
    
    Remove-Item $OutputFile -Force
    Write-Host "已删除旧文件" -ForegroundColor Green
    Write-Host ""
}

Write-Host "开始下载..." -ForegroundColor Cyan
Write-Host ""

try {
    $WebClient = New-Object System.Net.WebClient
    $WebClient.DownloadProgressChanged = {
        $Percent = [math]::Round($_.ProgressPercentage, 2)
        $Received = [math]::Round($_.BytesReceived / 1MB, 2)
        $Total = [math]::Round($_.TotalBytesToReceive / 1MB, 2)
        Write-Progress -Activity "下载 Electron $Version" `
                       -Status "$Received MB / $Total MB ($Percent%)" `
                       -PercentComplete $_.ProgressPercentage
    }
    
    $WebClient.DownloadFileCompleted = {
        Write-Progress -Activity "下载 Electron $Version" -Completed
    }
    
    $WebClient.DownloadFileAsync($Url, $OutputFile)
    
    while ($WebClient.IsBusy) {
        Start-Sleep -Milliseconds 100
    }
    
    Write-Host ""
    Write-Host "下载完成！" -ForegroundColor Green
    
    $FileSize = (Get-Item $OutputFile).Length / 1MB
    Write-Host "文件大小: $([math]::Round($FileSize, 2)) MB" -ForegroundColor White
    
    if ($FileSize -lt 100) {
        Write-Host ""
        Write-Host "警告: 文件大小异常（小于 100 MB），可能下载不完整！" -ForegroundColor Red
        Write-Host "建议重新下载或检查网络连接" -ForegroundColor Red
    } elseif ($FileSize -gt 200) {
        Write-Host ""
        Write-Host "警告: 文件大小异常（大于 200 MB），可能下载错误！" -ForegroundColor Red
    } else {
        Write-Host "文件大小正常" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "下一步操作:" -ForegroundColor Yellow
    Write-Host "  1. 验证文件: Test-Path `"$OutputFile`"" -ForegroundColor White
    Write-Host "  2. 重新安装: npm install --save-dev electron electron-builder concurrently wait-on cross-env --legacy-peer-deps" -ForegroundColor White
    Write-Host "  3. 打包应用: npm run electron-pack-win" -ForegroundColor White
    
} catch {
    Write-Host ""
    Write-Host "下载失败！" -ForegroundColor Red
    Write-Host "错误信息: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "可能的解决方案:" -ForegroundColor Yellow
    Write-Host "  1. 检查网络连接" -ForegroundColor White
    Write-Host "  2. 尝试使用浏览器手动下载" -ForegroundColor White
    Write-Host "  3. 使用其他镜像源" -ForegroundColor White
    Write-Host ""
    Write-Host "手动下载链接:" -ForegroundColor Cyan
    Write-Host "  $Url" -ForegroundColor White
    
    if (Test-Path $OutputFile) {
        Remove-Item $OutputFile -Force
        Write-Host "已删除不完整的文件" -ForegroundColor Yellow
    }
    
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  下载完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan