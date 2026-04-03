Add-Type -AssemblyName System.Drawing

$sourcePath = 'a:\GlobalAgencies\frontend\mobile\assets\images\GLOBAL2.png'
$destPath = 'a:\GlobalAgencies\frontend\mobile\assets\images\GLOBAL2_padded.png'

$img = [System.Drawing.Image]::FromFile($sourcePath)
$newImg = New-Object System.Drawing.Bitmap($img.Width, $img.Height)
$g = [System.Drawing.Graphics]::FromImage($newImg)

$g.Clear([System.Drawing.Color]::Transparent)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Calculate 70% of the size (adding 15% padding on each side)
$targetWidth = $img.Width * 0.7
$targetHeight = $img.Height * 0.7
$x = ($img.Width - $targetWidth) / 2
$y = ($img.Height - $targetHeight) / 2

$g.DrawImage($img, $x, $y, $targetWidth, $targetHeight)

$newImg.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$img.Dispose()
$newImg.Dispose()

Write-Host "Padded icon created at $destPath"
