$path = "C:\Users\shiva\Downloads\SoloLeveling_TrainingSystem_Blueprint.pdf"
$bytes = [System.IO.File]::ReadAllBytes($path)
$text = [System.Text.Encoding]::UTF8.GetString($bytes)

# Extract readable text between BT/ET markers and plain strings
$matches = [regex]::Matches($text, '\(([^\)]+)\)')
$output = @()
foreach ($m in $matches) {
    $val = $m.Groups[1].Value
    # Filter to lines with actual readable content
    $clean = $val -replace '[^\x20-\x7E]', ''
    if ($clean.Length -gt 2 -and $clean -match '[a-zA-Z]{2,}') {
        $output += $clean.Trim()
    }
}
$output | Select-Object -First 1000
