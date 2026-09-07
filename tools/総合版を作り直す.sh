#!/bin/bash
# 総合ドキュメントを PPTX → PDF → しおり付き まで一気に作り直す。
#
#   使い方:  bash 総合版を作り直す.sh
#
# PPTX→PDF変換ではしおり（ブックマーク）が作られないため、
# 変換のあとに しおりを付ける.py で流し込むところまでが1セット。
set -e
cd "$(dirname "$0")"

OUT=/tmp/deck9
DEST="../_wp移行素材/★引継ぎ資料"
NAME="ASPATH_ウェブサイト総合ドキュメント"

mkdir -p "$OUT"
rm -f "$OUT/$NAME.pdf"

# ── 日本語の字形（JP）を強制する ─────────────────────────
# Meiryo が無い環境では、LibreOffice が中国語(簡体字)の字形を選んでしまい、
# 「直」などが別の形で出力される。実際にこの不具合が起きたため、
# 変換前に必ずフォント設定を入れておく。
mkdir -p "$HOME/.config/fontconfig"
cp -f assets/fonts.conf "$HOME/.config/fontconfig/fonts.conf"
fc-cache -f >/dev/null 2>&1

echo "① PPTXを作る"
NODE_PATH=${NODE_PATH:-/sessions/compassionate-sweet-heisenberg/node_modules} node 総合版pptxを作る.js

echo "② PDFに変換する（数分かかります）"
libreoffice --headless --convert-to pdf --outdir "$OUT" "$OUT/$NAME.pptx" >/dev/null 2>&1

echo "③ しおりと目次リンクを埋め込む"
python3 しおりを付ける.py "$OUT/$NAME.pdf" "$OUT/総合版_toc.json"

echo "④ 納品フォルダへ置く"
cp -f "$OUT/$NAME.pptx" "$DEST/★$NAME.pptx"
cp -f "$OUT/$NAME.pdf"  "$DEST/★$NAME.pdf"
echo "   完了 → $DEST/★$NAME.pdf"
