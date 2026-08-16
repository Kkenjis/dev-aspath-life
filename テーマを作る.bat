@echo off
chcp 65001 > nul
cd /d "%~dp0"

echo ==========================================
echo  ASPATH テーマzip 作成
echo ==========================================
echo.
echo 実行フォルダ: %CD%
echo.

if not exist "build_wp_theme.py" (
  echo [エラー] build_wp_theme.py が見つかりません。
  echo このbatファイルは、build_wp_theme.py と同じフォルダに置いてください。
  echo.
  pause
  exit /b 1
)

set PY=
where py >nul 2>&1 && set PY=py
if "%PY%"=="" ( where python >nul 2>&1 && set PY=python )

if "%PY%"=="" (
  echo [エラー] Python が見つかりません。
  echo.
  echo 対処:
  echo   1. https://www.python.org/downloads/ からインストール
  echo   2. インストール画面で「Add python.exe to PATH」に必ずチェック
  echo   3. PCを再起動してから、もう一度このファイルを実行
  echo.
  echo ※ Python を入れたくない場合は、メイン機で作った
  echo    _wp移行素材\aspath-theme.zip をコピーして持ち込んでも構いません。
  echo.
  pause
  exit /b 1
)

echo 使用するPython: %PY%
%PY% --version
echo.
echo ---- 生成を開始します ----
echo.

%PY% build_wp_theme.py

echo.
if exist "_wp移行素材\aspath-theme.zip" (
  echo ==========================================
  echo  成功しました
  echo ==========================================
  for %%F in ("_wp移行素材\aspath-theme.zip") do echo  サイズ: %%~zF バイト
  echo  場所  : %CD%\_wp移行素材\aspath-theme.zip
  echo.
  echo  このzipを WordPress の
  echo  外観 → テーマ → 新規追加 → テーマのアップロード
  echo  からアップロードしてください。
  echo.
  echo  エクスプローラーで開きますか？ 開く場合は何かキーを押してください。
  pause > nul
  explorer "%CD%\_wp移行素材"
) else (
  echo ==========================================
  echo  失敗しました
  echo ==========================================
  echo  上に表示されているエラーメッセージを、
  echo  そのままコピーして共有してください。
  echo.
  pause
)
