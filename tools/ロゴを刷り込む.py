# PPTXから作っていないPDF（Markdown由来のA4資料など）の右上に、
# ロゴと肩書きをあとから刷り込む。
#
#   使い方: python3 ロゴを刷り込む.py <PDF> [<PDF> ...]
#
# PPTX由来の資料は各生成スクリプトが ブランドヘッダー.js で入れているので対象外。
#
# 肩書きは「文字」ではなく「画像」として貼る。
#   PDFに日本語のフォントを埋め込むと、見た目は正しくても
#   コピーしたときに別の文字コード（互換漢字）になることがあり、
#   実際に「鹿」が U+F940 になる不具合が出たため。
#
# 何度実行しても二重にならないよう、貼る前に上端の帯を消してから貼り直す。

import sys, os, glob
import pymupdf
from PIL import Image, ImageDraw, ImageFont

HERE  = os.path.dirname(os.path.abspath(__file__))
LOGO  = os.path.join(HERE, "assets", "logo-deck.png")
RATIO = 424 / 518
TAGLINE = "鹿児島のパーキンソン病専門トレーニングスタジオ"   # ブランドヘッダー.js と同じ文言
INK = (0x8F, 0xA3, 0xAA)

BAND_TOP, BAND_BOTTOM = 12, 50      # ここを消してから貼り直す（本文は y>=50 から始まる）
LOGO_H = 26


def _find_font():
    cands = ["/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
             "/usr/share/fonts/opentype/noto/NotoSansCJKjp-Regular.otf",
             "/usr/share/fonts/truetype/fonts-japanese-gothic.ttf"]
    cands += sorted(glob.glob("/usr/share/fonts/**/NotoSansCJK*", recursive=True))
    for c in cands:
        if os.path.exists(c):
            return c
    return None


def _tagline_png(path, px_h=48):
    """肩書きを透過PNGに描いて返す（幅, 高さ）"""
    fp = _find_font()
    if fp is None:
        return None
    font = ImageFont.truetype(fp, px_h)
    tmp = ImageDraw.Draw(Image.new("RGBA", (1, 1)))
    x0, y0, x1, y1 = tmp.textbbox((0, 0), TAGLINE, font=font)
    im = Image.new("RGBA", (x1 - x0 + 4, y1 - y0 + 4), (0, 0, 0, 0))
    ImageDraw.Draw(im).text((-x0 + 2, -y0 + 2), TAGLINE, font=font, fill=INK + (255,))
    im.save(path)
    return im.size


def stamp(path):
    doc = pymupdf.open(path)
    tag_png = "/tmp/_aspath_tagline.png"
    size = _tagline_png(tag_png)

    for page in doc:
        W = page.rect.width
        band = pymupdf.Rect(0, BAND_TOP, W, BAND_BOTTOM)
        # 前回貼ったものを、文字ごと画像ごと消す
        page.add_redact_annot(band)
        page.apply_redactions(images=pymupdf.PDF_REDACT_IMAGE_REMOVE)

        right = W - 26
        lw = LOGO_H * RATIO
        page.insert_image(pymupdf.Rect(right - lw, 18, right, 18 + LOGO_H),
                          filename=LOGO, keep_proportion=True)
        if size:
            th = 9.0                                  # 肩書きの高さ(pt)
            tw = th * size[0] / size[1]
            x1 = right - lw - 7
            page.insert_image(pymupdf.Rect(x1 - tw, 26.5, x1, 26.5 + th),
                              filename=tag_png, keep_proportion=True)

    tmp = path + ".tmp"
    doc.save(tmp, garbage=3, deflate=True)
    doc.close()
    os.replace(tmp, path)
    print(f"  {os.path.basename(path)} … 全ページに貼り直しました")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("使い方: python3 ロゴを刷り込む.py <PDF> [<PDF> ...]"); sys.exit(1)
    for p in sys.argv[1:]:
        stamp(p)
