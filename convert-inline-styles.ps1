# PowerShell script to help convert inline styles to SCSS classes
# This script assists in identifying and converting common inline style patterns

$srcPath = "C:\Users\TRABAJO\code\rentoso\lovable\lovable-rentoso\src"

# Common inline style patterns to convert
$patterns = @{
    'style=\{\{ width: ''100%'' \}\}' = 'className="w-full"'
    'style=\{\{ display: ''flex'' \}\}' = 'className="d-flex"'
    'style=\{\{ gap: ''16px'' \}\}' = 'className="gap-16"'
    'style=\{\{ gap: ''24px'' \}\}' = 'className="gap-24"'
    'style=\{\{ marginBottom: 24 \}\}' = 'className="mb-24"'
    'style=\{\{ marginBottom: 16 \}\}' = 'className="mb-16"'
    'style=\{\{ marginTop: 16 \}\}' = 'className="mt-16"'
    'style=\{\{ marginTop: 24 \}\}' = 'className="mt-24"'
    'style=\{\{ padding: ''24px'' \}\}' = 'className="p-24"'
    'style=\{\{ padding: ''16px'' \}\}' = 'className="p-16"'
    'style=\{\{ textAlign: ''center'' \}\}' = 'className="text-center"'
    'style=\{\{ color: ''#ffffff'' \}\}' = 'className="text-white"'
    'style=\{\{ color: ''#9CA3AF'' \}\}' = 'className="text-gray"'
}

# Find all TypeScript/TSX files with inline styles
Write-Host "Scanning for files with inline styles..." -ForegroundColor Cyan
$filesWithStyles = Get-ChildItem -Path $srcPath -Recurse -Filter "*.tsx" |
    Select-String -Pattern "style=\{\{" -List |
    Select-Object -ExpandProperty Path -Unique

Write-Host "Found $($filesWithStyles.Count) files with inline styles" -ForegroundColor Yellow

# Count occurrences per file
$fileCounts = @{}
foreach ($file in $filesWithStyles) {
    $count = (Select-String -Path $file -Pattern "style=\{\{" -AllMatches).Matches.Count
    $fileCounts[$file] = $count
}

# Sort by count and display top 20
Write-Host "`nTop 20 files by inline style count:" -ForegroundColor Cyan
$fileCounts.GetEnumerator() |
    Sort-Object -Property Value -Descending |
    Select-Object -First 20 |
    ForEach-Object {
        $fileName = Split-Path $_.Key -Leaf
        Write-Host "$fileName - $($_.Value) occurrences" -ForegroundColor White
    }

Write-Host "`nTotal files: $($filesWithStyles.Count)" -ForegroundColor Green
Write-Host "Total occurrences: $(($fileCounts.Values | Measure-Object -Sum).Sum)" -ForegroundColor Green
