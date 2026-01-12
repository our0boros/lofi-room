param(
    [string]$CacheDir = ".winCodeSign-cache"
)

$Url = "https://npmmirror.com/mirrors/electron-builder-binaries/winCodeSign-2.6.0/winCodeSign-2.6.0.7z"
$ZipFile = Join-Path $CacheDir "winCodeSign-2.6.0.7z"

Write-Host "Downloading winCodeSign tool..." -ForegroundColor Cyan

try {
    $WebClient = New-Object System.Net.WebClient
    
    $Uri = New-Object System.Uri($Url)
    $Request = [System.Net.WebRequest]::Create($Uri)
    $Request.Method = "GET"
    $Response = $Request.GetResponse()
    $TotalBytes = $Response.ContentLength
    $Response.Close()
    
    $FileStream = [System.IO.File]::Create($ZipFile)
    $Buffer = New-Object byte[] 1048576
    $DownloadedBytes = 0
    
    $Stream = $WebClient.OpenRead($Url)
    
    while (($BytesRead = $Stream.Read($Buffer, 0, $Buffer.Length)) -gt 0) {
        $FileStream.Write($Buffer, 0, $BytesRead)
        $DownloadedBytes += $BytesRead
        $Percent = [math]::Round(($DownloadedBytes / $TotalBytes) * 100, 2)
        $ReceivedMB = [math]::Round($DownloadedBytes / 1MB, 2)
        $TotalMB = [math]::Round($TotalBytes / 1MB, 2)
        Write-Progress -Activity "Downloading winCodeSign" `
                       -Status "$ReceivedMB MB / $TotalMB MB ($Percent%)" `
                       -PercentComplete $Percent
    }
    
    $Stream.Close()
    $FileStream.Close()
    
    Write-Progress -Activity "Downloading winCodeSign" -Completed
    Write-Host "Download completed!" -ForegroundColor Green
    
    Write-Host "Extracting..." -ForegroundColor Cyan
    
    $7zaPath = "node_modules\7zip-bin\win\x64\7za.exe"
    
    if (-not (Test-Path $7zaPath)) {
        Write-Host "Error: 7za.exe not found" -ForegroundColor Red
        exit 1
    }
    
    $ExtractDir = Join-Path $CacheDir "winCodeSign"
    
    & $7zaPath x -y "-o$ExtractDir" $ZipFile | Out-Null
    
    Write-Host "Extraction completed!" -ForegroundColor Green
    Write-Host "Cache directory: $ExtractDir" -ForegroundColor Yellow
    
} catch {
    Write-Host "Download failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    Write-Host ""
    Write-Host "You can manually download:" -ForegroundColor Yellow
    Write-Host "1. Visit: $Url" -ForegroundColor Yellow
    Write-Host "2. Place file at: $ZipFile" -ForegroundColor Yellow
    exit 1
}