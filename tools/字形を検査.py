# -*- coding: utf-8 -*-
"""PDFの漢字が日本語(JP)の字形かどうかを判定する。
   日本語と中国語で形が変わる文字を実際に切り出し、
   Noto Sans CJK の JP面 / SC面 の描画と重ね合わせて、近いほうを答える。"""
import sys, glob, io
import pymupdf
from PIL import Image, ImageDraw, ImageFont
import numpy as np

TARGET = "直真者令海説増産具収番次骨"
TTC = "/usr/share/fonts/opentype/noto/NotoSansCJK-%s.ttc"

def tight(im, size=200):
    a = np.array(im); ys, xs = np.where(a < 160)
    if len(xs) == 0: return None
    return im.crop((xs.min(), ys.min(), xs.max()+1, ys.max()+1)).resize((size, size), Image.LANCZOS)

_ref = {}
def ref(ch, face, weight):
    k = (ch, face, weight)
    if k not in _ref:
        idx = {"JP": 0, "SC": 2}[face]
        f = ImageFont.truetype(TTC % weight, 300, index=idx)
        im = Image.new("L", (460, 460), 255); ImageDraw.Draw(im).text((60, 40), ch, font=f, fill=0)
        t = tight(im)
        _ref[k] = None if t is None else 1 - np.array(t).astype(float)/255
    return _ref[k]

def check(path):
    d = pymupdf.open(path)
    res = {"JP": 0, "SC": 0}
    bad = []
    for ch in TARGET:
        got = 0
        for pno in range(d.page_count):
            if got >= 3: break
            p = d[pno]
            for r in p.search_for(ch):
                if r.height < 9: continue
                clip = pymupdf.Rect(r.x0, r.y0, r.x1, r.y1)
                pm = p.get_pixmap(dpi=900, clip=clip)
                im = Image.open(io.BytesIO(pm.tobytes("png"))).convert("L")
                if np.array(im).mean() < 120: continue      # 濃い背景は白抜き文字なので飛ばす
                t = tight(im)
                if t is None: continue
                A = 1 - np.array(t).astype(float)/255
                dist = {}
                for face in ("JP", "SC"):
                    dist[face] = min(float(np.abs(A - ref(ch, face, w)).mean())
                                     for w in ("Regular", "Bold") if ref(ch, face, w) is not None)
                dJP, dSC = dist["JP"], dist["SC"]
                # 差がはっきりしているときだけ数える（2割以上の差）
                if dSC < dJP * 0.8:   best = "SC"
                elif dJP < dSC * 0.8: best = "JP"
                else: continue
                res[best] += 1
                if best == "SC": bad.append((pno+1, ch, round(dSC,3)))
                got += 1
                break
    d.close()
    return res, bad

for path in sorted(glob.glob(sys.argv[1])):
    res, bad = check(path)
    name = path.split("/")[-1]
    total = res["JP"] + res["SC"]
    if total == 0:
        print(f"{name[:46]:48s} 判定できる文字なし")
    elif res["SC"] == 0:
        print(f"{name[:46]:48s} ○ 日本語の字形（{res['JP']}字を照合）")
    else:
        print(f"{name[:46]:48s} × 中国語の字形あり（JP {res['JP']} / SC {res['SC']}）")
        for b in bad[:8]: print("      P%-4d %s  一致度%.3f" % b)
