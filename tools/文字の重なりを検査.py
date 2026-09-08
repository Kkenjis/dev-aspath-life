# -*- coding: utf-8 -*-
"""納品PDFの文字まわり検査
  ① スライド外／フッター帯に落ちた文字
  ② 図形に隠れた文字（あとから描いた不透明な塗りに覆われている）
  ③ 文字どうしの重なり
  ④ 旧字体・異体字・互換漢字・豆腐（描画できない字）
"""
import sys, glob, unicodedata, pymupdf

# 旧字体（新字体があるのに旧い形で書かれているもの）
OLD = "舊學圖眞廣國藝齒體醫讀變應點檢實榮營學驛鐵應臺灣單彌辭殘濕縣總聽藏續數變獨拂佛豫餘與譽譯驛圓緣鹽壓穩假價畫會囘壞懷樂惡關觀歸氣龜舉據峽狹曉勳徑經繼缺劍險顯驗嚴戀效廣鑛號濟碎齋雜殘贊蠶殘齒實舍寫釋收從澁獸縱肅處敍將燒稱證乘剩壤孃條淨繩眞盡髓數樞瀨齊靜攝專戰淺潛纖踐錢禪雙壯搜插巢爭莊裝藻臟卽屬續墮體對帶滯瀧單擔膽團斷彈遲晝蟲鑄廳徵聽鎭傳點轉澱黨盜燈當鬪德獨讀屆貳惱腦廢賣麥發髮拔繁晚祕濱拂佛倂竝變邊辨瓣辯步寶豐墨飜每萬滿默彌藥譯豫餘與譽搖樣謠來賴亂覽兩獵綠壘勵禮隸曆歷戀爐勞郞錄灣"
BAD_RANGES = [(0xF900,0xFAFF,"互換漢字"),(0x2E80,0x2EFF,"CJK部首補助"),
              (0x2F00,0x2FDF,"康熙部首"),(0xFE00,0xFE0F,"異体字セレクタ"),
              (0xE0100,0xE01EF,"異体字セレクタ")]

def area(r):
    return max(0.0, r.x1-r.x0) * max(0.0, r.y1-r.y0)

def check(path, footer_y_ratio=None):
    d = pymupdf.open(path)
    W, H = d[0].rect.width, d[0].rect.height
    # A4（Markdown由来）の資料は、表のセルをPDFがひとまとまりで持つため、
    # 文字どうしの重なり判定が当てにならない。実画面では重なっていない。
    A4 = W < 700
    out = {"外":[], "隠れ":[], "重なり":[], "旧字":[], "豆腐":[]}
    for pno in range(d.page_count):
        p = d[pno]
        spans = [s for s in p.get_texttrace() if s.get("chars")]
        # 不透明な塗り図形（seqno付き）
        fills = [g for g in p.get_drawings() if g.get("fill") is not None
                 and g.get("fill_opacity",1) >= 0.95 and g.get("type") in ("f","fs")]
        boxes = []
        for s in spans:
            txt = "".join(chr(c[0]) for c in s["chars"])
            if not txt.strip(): continue
            r = pymupdf.Rect(s["bbox"])
            boxes.append((r, txt, s["seqno"]))
            # ① 版面外
            if r.x0 < -1 or r.y0 < -1 or r.x1 > W+1 or r.y1 > H+1:
                out["外"].append((pno+1, txt[:26]))
            # ② 隠れ
            cov = 0.0
            for g in fills:
                if g["seqno"] <= s["seqno"]: continue
                inter = pymupdf.Rect(g["rect"]) & r
                cov = max(cov, area(inter)/area(r) if area(r) else 0)
            if cov > 0.10:
                out["隠れ"].append((pno+1, txt[:26], round(cov,2)))
            # ④ 字種
            for ch in txt:
                o = ord(ch)
                if ch in OLD:
                    out["旧字"].append((pno+1, ch, txt[:26]))
                for a,b,name in BAD_RANGES:
                    if a <= o <= b:
                        out["旧字"].append((pno+1, "U+%04X(%s)"%(o,name), txt[:26]))
                if ch == "�":
                    out["豆腐"].append((pno+1, txt[:26]))
        # ③ 文字どうしの重なり
        for i in ([] if A4 else range(len(boxes))):
            r1,t1,_ = boxes[i]
            for j in range(i+1, len(boxes)):
                r2,t2,_ = boxes[j]
                inter = r1 & r2
                a = area(inter)
                if a <= 0: continue
                sm = min(area(r1), area(r2))
                if sm > 0 and a/sm > 0.35 and abs(r1.y0-r2.y0) > 1.5 \
                        and not (len(t1.strip())<=2 and len(t2.strip())<=2):
                    out["重なり"].append((pno+1, t1[:18], t2[:18], round(a/sm,2)))
    d.close()
    return out

for path in sorted(glob.glob(sys.argv[1])):
    r = check(path)
    name = path.split("/")[-1]
    tot = sum(len(v) for v in r.values())
    print("="*70)
    print(name, "→", "問題なし" if tot==0 else "要確認 %d件"%tot)
    for k,v in r.items():
        if not v: continue
        print("  【%s】%d件"%(k,len(v)))
        for x in v[:12]: print("    ", x)
        if len(v)>12: print("     … 他", len(v)-12, "件")
