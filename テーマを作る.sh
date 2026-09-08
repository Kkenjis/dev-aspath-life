#!/bin/bash
# ============================================================
#  ASPATH テーマzip 作成（Linux / WSL / その他 UNIX 系）
#
#  使い方: ターミナルで、このフォルダに移動して
#            bash テーマを作る.sh
#
#  Windows は「テーマを作る.bat」、Mac は「テーマを作る.command」を
#  ダブルクリックしてください。中身はどれも同じです。
# ============================================================

set -u
cd "$(dirname "$0")" || exit 1

echo "=========================================="
echo " ASPATH テーマzip 作成"
echo "=========================================="
echo
echo "実行フォルダ: $(pwd)"
echo

if [ ! -f "build_wp_theme.py" ]; then
  echo "[エラー] build_wp_theme.py が見つかりません。"
  echo "このスクリプトは、build_wp_theme.py と同じフォルダに置いてください。"
  exit 1
fi

PY=""
if command -v python3 >/dev/null 2>&1; then PY="python3"
elif command -v python  >/dev/null 2>&1; then PY="python"
fi

if [ -z "$PY" ]; then
  echo "[エラー] Python が見つかりません。"
  echo
  echo "対処の例:"
  echo "  Ubuntu / Debian : sudo apt install python3"
  echo "  Fedora          : sudo dnf install python3"
  echo "  Arch            : sudo pacman -S python"
  echo
  echo "※ 外部ライブラリは不要です。標準の Python 3 だけで動きます。"
  exit 1
fi

echo "使用するPython: $PY"
"$PY" --version
echo
echo "---- 生成を開始します ----"
echo

"$PY" build_wp_theme.py

echo
if [ -f "_wp移行素材/aspath-theme.zip" ]; then
  SIZE=$(wc -c < "_wp移行素材/aspath-theme.zip" | tr -d ' ')
  echo "=========================================="
  echo " 成功しました"
  echo "=========================================="
  echo " サイズ: ${SIZE} バイト"
  echo " 場所  : $(pwd)/_wp移行素材/aspath-theme.zip"
  echo
  echo " このzipを WordPress の"
  echo " 外観 → テーマ → 新規追加 → テーマのアップロード"
  echo " からアップロードしてください。"
else
  echo "=========================================="
  echo " 失敗しました"
  echo "=========================================="
  echo " 上に表示されているエラーメッセージを、"
  echo " そのままコピーして共有してください。"
  exit 1
fi
