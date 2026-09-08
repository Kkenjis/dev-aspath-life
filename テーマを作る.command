#!/bin/bash
# ============================================================
#  ASPATH テーマzip 作成（Mac 用）
#
#  使い方: このファイルをダブルクリックしてください。
#
#  初回だけ、実行の許可が必要です。
#    ・「開発元が未確認のため開けません」と出た場合
#        → このファイルを右クリック →「開く」→ もう一度「開く」
#    ・それでも開かない場合
#        → ターミナルを開き、次の1行を貼り付けて Enter
#          chmod +x "（このファイルをターミナルにドラッグ）"
#
#  Windows 用の「テーマを作る.bat」と、やっていることは同じです。
# ============================================================

cd "$(dirname "$0")" || exit 1

echo "=========================================="
echo " ASPATH テーマzip 作成"
echo "=========================================="
echo
echo "実行フォルダ: $(pwd)"
echo

if [ ! -f "build_wp_theme.py" ]; then
  echo "[エラー] build_wp_theme.py が見つかりません。"
  echo "このファイルは、build_wp_theme.py と同じフォルダに置いてください。"
  echo
  read -n 1 -s -r -p "何かキーを押すと閉じます..."
  exit 1
fi

# Python を探す。Mac には python3 が入っていることが多いが、
# 標準のものが古い場合があるので python3 → python の順で見る。
PY=""
if command -v python3 >/dev/null 2>&1; then PY="python3"
elif command -v python  >/dev/null 2>&1; then PY="python"
fi

if [ -z "$PY" ]; then
  echo "[エラー] Python が見つかりません。"
  echo
  echo "対処（どちらか1つ）:"
  echo "  A. ターミナルで次を実行し、画面の案内どおりに進める"
  echo "       xcode-select --install"
  echo "  B. https://www.python.org/downloads/ から macOS 版を入れる"
  echo
  echo "※ Python を入れたくない場合は、メイン機で作った"
  echo "   _wp移行素材/aspath-theme.zip をコピーして持ち込んでも構いません。"
  echo
  read -n 1 -s -r -p "何かキーを押すと閉じます..."
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
  echo
  read -n 1 -s -r -p " Finder で開きます。何かキーを押してください..."
  echo
  open "_wp移行素材"
else
  echo "=========================================="
  echo " 失敗しました"
  echo "=========================================="
  echo " 上に表示されているエラーメッセージを、"
  echo " そのままコピーして共有してください。"
  echo
  read -n 1 -s -r -p "何かキーを押すと閉じます..."
fi
