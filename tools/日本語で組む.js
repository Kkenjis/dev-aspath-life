// ASPATH ── PPTX を「日本語の字形」で組むための共通パッチ
//
// 【なぜ必要か】
//   PPTX を LibreOffice で PDF に変換すると、文字に言語の指定が無い場合、
//   Noto Sans CJK の中から「簡体字(SC)の面」が選ばれてしまう。
//   その結果、「直」「真」「者」などが中国語の字形で出力される。
//   （fonts.conf で Meiryo → Noto Sans CJK JP に寄せても、
//     TTC の中のどの面を使うかは、文字ごとの言語指定で決まるため防げない）
//
// 【対処】
//   すべての addText / addTable に lang:"ja-JP" を付ける。
//   実測で、付けない場合は SC の字形、付けた場合は JP の字形になることを確認済み。
//
// 【使い方】
//   const { 日本語で組む } = require("./日本語で組む.js");
//   const P = new pptx();  日本語で組む(P);
//   ※ P を作った直後、addSlide を呼ぶ前に1回だけ実行すること。

const LANG = "ja-JP";

function withLang(opts) {
  const o = Object.assign({}, opts || {});
  if (!o.lang) o.lang = LANG;
  return o;
}

// 表のセルは {text, options} の形なので、セルごとにも入れる
function cellsWithLang(rows) {
  if (!Array.isArray(rows)) return rows;
  return rows.map(function (row) {
    if (!Array.isArray(row)) return row;
    return row.map(function (cell) {
      if (cell && typeof cell === "object" && !Array.isArray(cell)) {
        return Object.assign({}, cell, { options: withLang(cell.options) });
      }
      return { text: String(cell == null ? "" : cell), options: { lang: LANG } };
    });
  });
}

function 日本語で組む(P) {
  if (!P || P.__jaPatched) return P;
  P.__jaPatched = true;

  const origAddSlide = P.addSlide.bind(P);
  P.addSlide = function () {
    const s = origAddSlide.apply(null, arguments);

    const origAddText = s.addText.bind(s);
    s.addText = function (text, opts) {
      return origAddText(text, withLang(opts));
    };

    if (typeof s.addTable === "function") {
      const origAddTable = s.addTable.bind(s);
      s.addTable = function (rows, opts) {
        return origAddTable(cellsWithLang(rows), withLang(opts));
      };
    }
    return s;
  };
  return P;
}

module.exports = { 日本語で組む, LANG };
