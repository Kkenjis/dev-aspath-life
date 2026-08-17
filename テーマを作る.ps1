<#
==============================================================================
 ASPATH テーマ更新スクリプト（PowerShell版）

 使い方（どちらでも可）
   ・このファイルを右クリック →「PowerShell で実行」
   ・PowerShell を開いて、次の1行を貼る（実行ポリシーで止まる場合はこちら）
       powershell -ExecutionPolicy Bypass -File ".\テーマを作る.ps1"

 やること
   1. Pythonを探す
   2. build_wp_theme.py を実行して aspath-theme.zip を作る
   3. 出来たzipのバージョン・サイズ・中身の点数を表示する
   4. gitの未Pushコミットがあれば知らせる
==============================================================================
#>

# 日本語が文字化けしないように出力をUTF-8に固定
try {
  [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
  $OutputEncoding = [System.Text.Encoding]::UTF8
} catch { }

$ErrorActionPreference = 'Continue'
Set-Location -LiteralPath $PSScriptRoot

function Write-Head($text) {
  Write-Host ''
  Write-Host ('=' * 62) -ForegroundColor DarkCyan
  Write-Host "  $text" -ForegroundColor Cyan
  Write-Host ('=' * 62) -ForegroundColor DarkCyan
}
function Write-Ok  ($t) { Write-Host "  [OK]   $t" -ForegroundColor Green }
function Write-Ng  ($t) { Write-Host "  [NG]   $t" -ForegroundColor Red }
function Write-Info($t) { Write-Host "         $t" -ForegroundColor Gray }

Write-Head 'ASPATH テーマ zip を作成します'
Write-Info "作業フォルダ : $PSScriptRoot"

# ---------------------------------------------------------------- 1. 前提確認
if (-not (Test-Path -LiteralPath 'build_wp_theme.py')) {
  Write-Ng 'build_wp_theme.py が見つかりません。'
  Write-Info 'このスクリプトは build_wp_theme.py と同じフォルダに置いてください。'
  Read-Host "`n  Enterキーで終了します"
  exit 1
}
Write-Ok 'build_wp_theme.py を確認'

# ---------------------------------------------------------------- 2. Pythonを探す
$py = $null
foreach ($cand in @('py', 'python', 'python3')) {
  $cmd = Get-Command $cand -ErrorAction SilentlyContinue
  if ($cmd) { $py = $cand; break }
}
if (-not $py) {
  Write-Ng 'Python が見つかりません。'
  Write-Host ''
  Write-Info '対処:'
  Write-Info '  1. https://www.python.org/downloads/ からインストール'
  Write-Info '  2. インストール画面で「Add python.exe to PATH」に必ずチェック'
  Write-Info '  3. PowerShell を開き直してから、もう一度実行'
  Write-Host ''
  Write-Info '※ Python を入れたくない場合は、メイン機で作った'
  Write-Info '   _wp移行素材\aspath-theme.zip をコピーして持ち込んでも構いません。'
  Read-Host "`n  Enterキーで終了します"
  exit 1
}
$pyVer = (& $py --version 2>&1) -join ' '
Write-Ok "Python を確認 : $py ($pyVer)"

# ---------------------------------------------------------------- 3. 生成
$zipPath = Join-Path $PSScriptRoot '_wp移行素材\aspath-theme.zip'
$before = $null
if (Test-Path -LiteralPath $zipPath) {
  $before = (Get-Item -LiteralPath $zipPath).LastWriteTime
}

Write-Head '生成中'
& $py build_wp_theme.py
$code = $LASTEXITCODE

if ($code -ne 0) {
  Write-Head '失敗しました'
  Write-Ng "build_wp_theme.py が終了コード $code で終わりました。"
  Write-Info '上に表示されているエラーメッセージを、そのままコピーして共有してください。'
  Read-Host "`n  Enterキーで終了します"
  exit $code
}

if (-not (Test-Path -LiteralPath $zipPath)) {
  Write-Head '失敗しました'
  Write-Ng 'aspath-theme.zip が作られませんでした。'
  Read-Host "`n  Enterキーで終了します"
  exit 1
}

$zip = Get-Item -LiteralPath $zipPath
if ($before -and $zip.LastWriteTime -le $before) {
  Write-Ng 'zipの更新時刻が変わっていません。生成に失敗している可能性があります。'
}

# ---------------------------------------------------------------- 4. 中身を確認
Write-Head '成功しました'

$version = '(取得できず)'
$phpCount = 0; $cssCount = 0; $imgCount = 0
try {
  Add-Type -AssemblyName System.IO.Compression.FileSystem
  $arc = [System.IO.Compression.ZipFile]::OpenRead($zip.FullName)
  try {
    foreach ($e in $arc.Entries) {
      if     ($e.FullName -like '*.php')  { $phpCount++ }
      elseif ($e.FullName -like '*.css')  { $cssCount++ }
      elseif ($e.FullName -match '\.(webp|png|jpg|jpeg|svg|gif)$') { $imgCount++ }
    }
    $style = $arc.Entries | Where-Object { $_.FullName -like '*style.css' } | Select-Object -First 1
    if ($style) {
      $sr = New-Object System.IO.StreamReader($style.Open(), [System.Text.Encoding]::UTF8)
      $head = $sr.ReadToEnd(); $sr.Close()
      $m = [regex]::Match($head, 'Version:\s*([0-9A-Za-z\.\-]+)')
      if ($m.Success) { $version = $m.Groups[1].Value }
    }
  } finally { $arc.Dispose() }
} catch {
  Write-Info "zipの中身の確認だけスキップしました（$($_.Exception.Message)）"
}

Write-Host ''
Write-Host "  テーマのバージョン : " -NoNewline -ForegroundColor Gray
Write-Host $version -ForegroundColor Yellow
Write-Info ("サイズ             : {0:N1} MB  ({1:N0} バイト)" -f @(($zip.Length / 1MB), $zip.Length))
Write-Info "中身               : PHP $phpCount 本 / CSS $cssCount 本 / 画像 $imgCount 点"
Write-Info "場所               : $($zip.FullName)"

Write-Host ''
Write-Host '  ▼ このあとの操作' -ForegroundColor Cyan
Write-Info '  1. WordPress で 外観 → テーマ → 新規追加 → テーマのアップロード'
Write-Info '  2. 上のzipを選び「既存のものを置き換える」'
Write-Info '  3. Super Page Cache のキャッシュを削除 → ブラウザで Ctrl+F5'
Write-Host ''
Write-Host "     外観 → テーマ のバージョンが " -NoNewline -ForegroundColor Gray
Write-Host $version -NoNewline -ForegroundColor Yellow
Write-Host " になっていれば更新済みです。" -ForegroundColor Gray

# ---------------------------------------------------------------- 5. gitの状態
$git = Get-Command git -ErrorAction SilentlyContinue
if ($git) {
  Write-Head 'gitの状態'
  $branch = (& git rev-parse --abbrev-ref HEAD 2>$null)
  if ($LASTEXITCODE -eq 0) {
    Write-Info "ブランチ : $branch"

    # git fetch はしない（認証待ちで固まることがあるため）。
    # GitHub Desktop が取得済みの情報で「未Push」を判定する。
    # 上流(@{u})が設定されていない環境もあるので、origin/<branch> も試す
    $ahead = (& git rev-list --count "@{u}..HEAD" 2>$null)
    if ($LASTEXITCODE -ne 0 -or $null -eq $ahead -or $ahead -eq '') {
      $ahead = (& git rev-list --count "origin/$branch..HEAD" 2>$null)
    }

    if ($LASTEXITCODE -ne 0 -or $null -eq $ahead -or $ahead -eq '') {
      Write-Info 'Push漏れの判定はできませんでした（上流ブランチが未設定）。'
      Write-Info 'GitHub Desktop の画面で「Push origin」の表示をご確認ください。'
    } elseif ([int]$ahead -gt 0) {
      Write-Host "  [要対応] 未Pushのコミットが $ahead 件あります。" -ForegroundColor Yellow
      Write-Info '         GitHub Desktop で「Push origin」を押してください。'
    } else {
      Write-Ok 'Push漏れはありません。'
    }

    $dirty = (& git status --porcelain 2>$null)
    if ($dirty) {
      $n = ($dirty | Measure-Object).Count
      Write-Info "未コミットの変更 : $n 件（zipや画像は対象外の設定です）"
    }
  }
}

# ---------------------------------------------------------------- 6. 後始末
Write-Host ''
$ans = Read-Host '  エクスプローラーでzipの場所を開きますか？ [Y/n]'
if ($ans -eq '' -or $ans -match '^[Yy]') {
  Start-Process explorer.exe -ArgumentList $zip.DirectoryName
}
Write-Host ''
Read-Host '  Enterキーで終了します'
