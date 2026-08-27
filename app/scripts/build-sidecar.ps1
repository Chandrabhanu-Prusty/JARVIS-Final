param([ValidateSet("x86_64-pc-windows-msvc", "aarch64-pc-windows-msvc")][string]$TargetTriple = "x86_64-pc-windows-msvc")

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$BackendRoot = Join-Path $ProjectRoot "backend"
$TauriBinaries = Join-Path $ProjectRoot "src-tauri\\binaries"
Push-Location $BackendRoot
try {
    python -m PyInstaller --noconfirm --clean --onefile --name jarvis-backend --paths $BackendRoot sidecar.py
    New-Item -ItemType Directory -Force -Path $TauriBinaries | Out-Null
    Move-Item -Force (Join-Path $BackendRoot "dist\\jarvis-backend.exe") (Join-Path $TauriBinaries "jarvis-backend-$TargetTriple.exe")
} finally { Pop-Location }
