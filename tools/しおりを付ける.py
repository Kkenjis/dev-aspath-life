# PPTX→PDF変換で失われる「しおり」と「目次からのジャンプ」を、あとから流し込む。
#
#   使い方: python3 しおりを付ける.py <PDFのパス> [総合版_toc.json のパス]
#
#   ・JSONがある場合   … ビルド時に記録した正確な見出し・ページ番号を使う（総合版）
#   ・JSONがない場合   … PDFの文字を読んで見出しを推測する（基本編などの小冊子）
#
# しおりのほかに、次のリンクも埋め込む。
#   ① 目次スライドの各枠 → その部の扉ページ
#   ② 全ページ右下のページ番号 → 目次ページ（どこからでも戻れる）

import sys, os, json, re
import pymupdf

PT = 72.0                      # 1インチ = 72pt
SLIDE_W_IN = 13.3333           # PPTXのスライド幅（LAYOUT_WIDE）
SLIDE_H_IN = 7.5


def scale(page):
    """スライドのインチ座標 → このPDFページのpt座標 への倍率"""
    return page.rect.width / SLIDE_W_IN, page.rect.height / SLIDE_H_IN


def toc_from_json(data):
    """ビルド時に記録した見出しを、pymupdfのTOC形式 [[level, title, page], ...] にする"""
    out = []
    for e in data["toc"]:
        out.append([int(e["level"]), e["title"], int(e["page"])])
    return out


def toc_from_pdf(doc):
    """JSONが無いPDF向け。各ページのいちばん大きい文字を見出しとみなす。"""
    out = []
    for i, page in enumerate(doc, 1):
        best, size = "", 0
        for blk in page.get_text("dict")["blocks"]:
            for ln in blk.get("lines", []):
                for sp in ln["spans"]:
                    t = sp["text"].strip()
                    if len(t) >= 2 and sp["size"] > size:
                        best, size = t, sp["size"]
        if best:
            out.append([1, f"P{i}　{best}"[:60], i])
    return out


def add_links(doc, data):
    """目次の枠 → 部の扉、ページ番号 → 目次、の2種類を貼る"""
    # 部番号 → 扉のページ番号
    part_page = {e["part"]: int(e["page"]) for e in data["toc"] if e.get("part")}
    n_link = 0

    # ① 目次スライドの枠
    for lk in data.get("links", []):
        pno = int(lk["page"]) - 1
        if not (0 <= pno < doc.page_count):
            continue
        target = part_page.get(str(lk["part"]))
        if not target:
            continue
        page = doc[pno]
        sx, sy = scale(page)
        r = pymupdf.Rect(lk["x"] * sx, lk["y"] * sy,
                         (lk["x"] + lk["w"]) * sx, (lk["y"] + lk["h"]) * sy)
        page.insert_link({"kind": pymupdf.LINK_GOTO, "from": r, "page": target - 1})
        n_link += 1

    # ② 全ページ → 目次へ戻る
    #    右下の「▲ もくじへ」の札（homeLinks）と、右下のページ番号の、両方を押せるようにする。
    tp = int(data.get("tocPage", 0))
    if 1 <= tp <= doc.page_count:
        done = set()
        for hl in data.get("homeLinks", []):
            pno = int(hl["page"]) - 1
            if not (0 <= pno < doc.page_count) or pno == tp - 1:
                continue
            page = doc[pno]
            sx, sy = scale(page)
            r = pymupdf.Rect(hl["x"] * sx, hl["y"] * sy,
                             (hl["x"] + hl["w"]) * sx, (hl["y"] + hl["h"]) * sy)
            page.insert_link({"kind": pymupdf.LINK_GOTO, "from": r, "page": tp - 1})
            done.add(pno)
            n_link += 1
        # ページ番号のほうは、札の有無にかかわらず全ページに付ける
        for i, page in enumerate(doc, 1):
            if i == tp:
                continue
            sx, sy = scale(page)
            r = pymupdf.Rect(12.35 * sx, 7.14 * sy, 12.95 * sx, 7.46 * sy)
            page.insert_link({"kind": pymupdf.LINK_GOTO, "from": r, "page": tp - 1})
            n_link += 1
    return n_link


def main():
    if len(sys.argv) < 2:
        print("使い方: python3 しおりを付ける.py <PDF> [toc.json]"); sys.exit(1)
    pdf = sys.argv[1]
    js = sys.argv[2] if len(sys.argv) > 2 else None

    doc = pymupdf.open(pdf)
    data = None
    if js and os.path.exists(js):
        data = json.load(open(js, encoding="utf-8"))
        toc = toc_from_json(data)
        if data.get("total") and data["total"] != doc.page_count:
            print(f"  ※ページ数が一致しません（JSON {data['total']} / PDF {doc.page_count}）。"
                  f"PPTXとPDFが同じ版か確認してください。")
    else:
        toc = toc_from_pdf(doc)

    # ページ番号がPDFの範囲を超えている項目は落とす（落ちないと set_toc が失敗する）
    toc = [t for t in toc if 1 <= t[2] <= doc.page_count]
    doc.set_toc(toc)

    n_link = add_links(doc, data) if data else 0

    # 開いたときに、しおりパネルを最初から表示する
    doc.set_pagemode("UseOutlines")

    tmp = pdf + ".tmp"
    doc.save(tmp, garbage=3, deflate=True)
    doc.close()
    os.replace(tmp, pdf)
    print(f"  しおり {len(toc)} 件 ／ リンク {n_link} 件 → {os.path.basename(pdf)}")


if __name__ == "__main__":
    main()
