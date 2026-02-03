[System.Reflection.Assembly]::LoadWithPartialName("System.Drawing") | Out-Null

function Compress-Image {
    param(
        [string]$ImagePath,
        [int]$Quality = 75
    )
    
    try {
        $image = [System.Drawing.Image]::FromFile($ImagePath)
        $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $Quality)
        
        $tempPath = $ImagePath + ".tmp"
        $image.Save($tempPath, $codec, $encoderParams)
        
        # Reemplazar el original
        Remove-Item $ImagePath -Force
        Rename-Item $tempPath $ImagePath
        
        $image.Dispose()
        Write-Host "✓ Comprimido: $ImagePath"
    } catch {
        Write-Host "✗ Error en $ImagePath : $_"
    }
}

# Comprimir JPGs
Get-ChildItem -File *.jpg | ForEach-Object {
    $sizeBefore = $_.Length / 1KB
    Compress-Image -ImagePath $_.FullName -Quality 80
    $sizeAfter = (Get-Item $_.FullName).Length / 1KB
    Write-Host "  Tamaño: $([math]::Round($sizeBefore, 2)) KB → $([math]::Round($sizeAfter, 2)) KB"
}

Write-Host "`n✓ Imágenes comprimidas exitosamente"
