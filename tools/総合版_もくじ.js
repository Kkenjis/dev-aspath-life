// ASPATH 総合版 ── 巻頭の「もくじ（各部で扱うこと）」
//
//   「この資料の使い方」は1行の説明だけなので、章に入る前に
//   各部が具体的に何を扱うのかを見渡せるページを置く。
//
//   内容は各部の扉に書いた箇条書きをそのまま使う。
//   二重管理にならないよう、1回目のビルドで集めたものを流し込む方式にした
//   （集める仕組みは 総合版pptxを作る.js の先頭を参照）。
const { C, F, MONO } = require("./総合版_lib.js");

const MAX_PER_PAGE = 8;   // 1ページに最大8部（2列 × 4行）
const CELL_H   = 1.18;
const STEP     = 1.24;

module.exports = function build(P, B){
  const topics = (B.detailToc || []).filter(t => /^\d+$/.test(t.num));
  if (!topics.length) return;

  // ページ数を決めてから均等に割る（20部なら 7・7・6 になる）
  const pages = Math.ceil(topics.length / MAX_PER_PAGE);
  const PER_PAGE = Math.ceil(topics.length / pages);

  for (let pg = 0; pg < pages; pg++) {
    const s = P.addSlide();
    const from = pg * PER_PAGE, to = Math.min(from + PER_PAGE, topics.length);
    B.head(s,
      "もくじ ─ 各部で扱うこと" + (pages > 1 ? "（" + (pg + 1) + "/" + pages + "）" : ""),
      "第" + topics[from].num + "部 〜 第" + topics[to - 1].num + "部。枠を押すと、その部の先頭に飛べます",
      { lv: "read" });

    topics.slice(from, to).forEach((t, i) => {
      const x = 0.65 + (i % 2) * 6.07;
      const y = 1.5 + Math.floor(i / 2) * STEP;

      // PDF化したあとに押せるようにする（しおりを付ける.py が使う）
      B.links.push({ page: B.page, x: x, y: y, w: 5.9, h: CELL_H, part: t.num });

      s.addShape(P.ShapeType.roundRect, { x, y, w: 5.9, h: CELL_H, rectRadius: 0.1,
        fill: { color: "F7FAFA" }, line: { color: C.LINE, width: 1 } });
      s.addShape(P.ShapeType.roundRect, { x: x + 0.18, y: y + 0.1, w: 0.85, h: 0.3,
        rectRadius: 0.07, fill: { color: t.tone } });
      s.addText("第" + t.num + "部", { x: x + 0.18, y: y + 0.1, w: 0.85, h: 0.3,
        align: "center", valign: "middle", fontSize: 9.5, bold: true, color: C.WHITE,
        fontFace: F, isTextBox: true, margin: 0 });
      s.addText(t.title, { x: x + 1.13, y: y + 0.08, w: 4.6, h: 0.32, fontSize: 12.5,
        bold: true, color: C.NAVY, fontFace: F, isTextBox: true, margin: 0, valign: "middle" });

      // 扉の箇条書きを「／」でつないで、3行に収まる長さに切る
      let body = t.lines.map(v => String(v).replace(/\s*─\s*/g, "：")).join("／");
      if (body.length > 175) body = body.slice(0, 173) + "…";
      s.addText(body, { x: x + 0.24, y: y + 0.46, w: 5.45, h: 0.66, fontSize: 9,
        color: C.MUTED, fontFace: F, isTextBox: true, margin: 0, lineSpacingMultiple: 1.12 });
    });

    if (pg === pages - 1) {
      B.box(s, 0.65, 1.5 + Math.ceil((to - from) / 2) * STEP + 0.04, 11.97, 0.62,
        "どのページからでも、右下の「▲ 使い方・もくじ」を押せば、この資料の使い方のページに戻れます。", "", "ok");
    }
    s.addNotes("巻頭のもくじ。各部の扉の箇条書きをそのまま流用している。");
  }
};
