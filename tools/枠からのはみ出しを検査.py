# -*- coding: utf-8 -*-
"""文字が「自分の入っている枠」からはみ出していないかを調べる。
   直前に描かれた塗り図形のうち、その文字を含む一番小さいものを「枠」とみなし、
   文字の下端・右端が枠を越えていたら報告する。"""
import sys, glob, collections, pymupdf

def area(r): return max(0.0, r.x1-r.x0) * max(0.0, r.y1-r.y0)

for path in sorted(glob.glob(sys.argv[1])):
    d = pymupdf.open(path)
    if d[0].rect.width < 700:   # A4（Markdown由来）は表の抽出順で誤検出するため対象外
        print("%-46s − A4版のため対象外（表の抽出順で誤検出するため）" % path.split("/")[-1][:44])
        d.close(); continue
    hits = collections.defaultdict(list)
    for pno in range(d.page_count):
        p = d[pno]
        fills = [g for g in p.get_drawings()
                 if g.get("fill") is not None and g.get("type") in ("f", "fs")]
        for s in p.get_texttrace():
            if not s.get("chars"): continue
            txt = "".join(chr(c[0]) for c in s["chars"])
            if not txt.strip(): continue
            r = pymupdf.Rect(s["bbox"])
            cx, cy = (r.x0+r.x1)/2, (r.y0+r.y1)/2
            box, ba = None, 1e18
            for g in fills:
                if g["seqno"] >= s["seqno"]: continue          # 文字より後に描いた図形は「枠」ではない
                gr = pymupdf.Rect(g["rect"])
                if gr.x0 <= cx <= gr.x1 and gr.y0 <= cy <= gr.y1 and area(gr) < ba:
                    ba, box = area(gr), gr
            if box is None or ba > 400000: continue            # ページ全面の背景は枠とみなさない
            over_b = r.y1 - box.y1
            over_r = r.x1 - box.x1
            if over_b > 1.5 or over_r > 1.5:
                hits[pno+1].append((round(max(over_b, over_r), 1), txt[:24]))
    name = path.split("/")[-1]
    if not hits:
        print("%-46s ○ はみ出しなし" % name[:44])
    else:
        print("%-46s × %d ページ" % (name[:44], len(hits)))
        for pg in sorted(hits)[:12]:
            v, t = max(hits[pg])
            print("      P%-4d %.1fpt はみ出し 「%s」" % (pg, v, t))
    d.close()
