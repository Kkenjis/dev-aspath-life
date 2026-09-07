// 全資料の共通ヘッダー（ロゴ＋肩書き）
//
// 各資料の head() / heading() の先頭で brand(s, dark) を呼ぶだけで、
// 右上に「鹿児島初のパーキンソン病専門トレーニングスタジオ ＋ ロゴ」が入る。
//
// 置き場所は、スライド上端（y 0.14〜0.46）。
// 見出しは y 0.3〜0.92 なので重ならない。
// 難易度バッジだけは、この帯とぶつかるので y 0.56 へ下げてある（総合版_lib.js 側）。
//
// ロゴは cwd に依存しないよう、このファイルからの相対で絶対パスにしている。
// （build_kihon.js のように別フォルダから実行されるものがあるため）

const path = require("path");

const LOGO_DARK  = path.join(__dirname, "assets", "logo-deck.png");        // 白地・紙地に置く用（紺のロゴ）
const LOGO_LIGHT = path.join(__dirname, "assets", "logo-deck-white.png");  // 紺地に置く用（紙色のロゴ）
const RATIO = 424 / 518;   // ロゴの 横 ÷ 縦

const TAGLINE = "鹿児島のパーキンソン病専門トレーニングスタジオ";
const CATCH   = "動くことを楽しむ。明日につながる。";
const SITE    = "aspath-life.com";
const FONT = "Meiryo";

// ブランドの色
const CL = {
  NAVY:"264653", DEEP:"1E3A44", SUN:"F4A261", PAPER:"F4E9D8",
  PAPERLINE:"E2D5BE", MUTED:"52707A", WHITE:"FFFFFF",
};

/**
 * 各ページ右上の小さなロゴと肩書き。
 * 見出し（y0.3〜0.92）や難易度バッジ（y0.58〜1.00）とぶつからないよう、
 * ロゴは高さ0.28inに抑え、y0.12〜0.40 に収めている。
 *
 * @param {object} s     スライド
 * @param {boolean} dark 背景が濃紺のスライドなら true
 */
function brand(s, dark, opt) {
  const o = opt || {};
  const h = o.h || 0.28;
  const w = h * RATIO;
  const right = o.right || 12.76;
  const x = right - w;

  s.addImage({ path: dark ? LOGO_LIGHT : LOGO_DARK, x, y: 0.12, w, h });

  // 肩書きはロゴの左に、右寄せ。長い見出しとぶつからないよう幅は3.0inまで。
  const tw = 3.0;
  s.addText(TAGLINE, {
    x: x - 0.1 - tw, y: 0.14, w: tw, h: 0.26,
    align: "right", valign: "middle",
    fontSize: 7.5, color: dark ? "9FBAC1" : "97A9AF",
    fontFace: FONT, isTextBox: true, margin: 0,
  });
}

/**
 * 表紙。ブランドのバナー（紙色の地に紺のロゴ）と同じ雰囲気にそろえる。
 * 左にロゴ、右に文字、という構成。
 *
 * @param {object} P     pptxgenjs インスタンス（ShapeType を使うため）
 * @param {object} s     スライド
 * @param {object} d     { title, badge, sub, note }
 */
function cover(P, s, d) {
  s.background = { color: CL.PAPER };

  // 上下の細い帯で、紙のような余白を締める
  s.addShape(P.ShapeType.rect, { x:0, y:0,    w:13.34, h:0.16, fill:{ color: CL.NAVY } });
  s.addShape(P.ShapeType.rect, { x:0, y:7.34, w:13.34, h:0.16, fill:{ color: CL.SUN  } });

  // 左：ロゴ
  s.addImage({ path: LOGO_DARK, x: 1.15, y: 2.05, h: 3.1, w: 3.1 * RATIO });

  // 右：文字
  const X = 5.35, W = 7.3;
  s.addText("ASPATH", { x:X, y:1.72, w:W, h:0.42, fontSize:15, bold:true,
    color: CL.SUN, charSpacing:6, fontFace:FONT, isTextBox:true, margin:0 });
  // タイトルが2行のときは枠を広げ、続く要素も下げる（下の文と重なるため）
  const nLine = String(d.title).split("\n").length;
  const tSize = d.titleSize || 36;
  const tH = nLine > 1 ? nLine * (tSize / 72) * 1.32 + 0.10 : 1.0;
  const tY = nLine > 1 ? 2.05 : 2.18;
  s.addText(d.title, { x:X, y:tY, w:W, h:tH, fontSize:tSize, bold:true,
    color: CL.NAVY, fontFace:FONT, isTextBox:true, margin:0, lineSpacingMultiple:1.2 });

  let y = nLine > 1 ? tY + tH + 0.14 : 3.24;
  if (d.badge) {
    s.addShape(P.ShapeType.roundRect, { x:X, y, w:d.badgeW||2.1, h:0.6, rectRadius:0.3, fill:{ color: CL.SUN } });
    s.addText(d.badge, { x:X, y, w:d.badgeW||2.1, h:0.6, align:"center", valign:"middle",
      fontSize:17, bold:true, color: CL.WHITE, fontFace:FONT, isTextBox:true, margin:0 });
    y += 0.86;
  }
  if (d.sub) {
    s.addText(d.sub, { x:X, y, w:W, h:0.6, fontSize:15, color: CL.MUTED,
      fontFace:FONT, isTextBox:true, margin:0, lineSpacingMultiple:1.3 });
  }

  // 下：区切り線と、ブランドの一行
  s.addShape(P.ShapeType.rect, { x:X, y:5.18, w:2.0, h:0.02, fill:{ color: CL.SUN } });
  s.addText(TAGLINE, { x:X, y:5.32, w:W, h:0.32, fontSize:12.5, bold:true,
    color: CL.NAVY, fontFace:FONT, isTextBox:true, margin:0 });
  s.addText(CATCH,   { x:X, y:5.68, w:W, h:0.3,  fontSize:11.5,
    color: CL.MUTED, fontFace:FONT, isTextBox:true, margin:0 });
  s.addText(SITE + (d.note ? "　／　" + d.note : ""), {
    x:X, y:6.12, w:W, h:0.3, fontSize:10.5, color:"8A9CA2", fontFace:FONT, isTextBox:true, margin:0 });
}

module.exports = { brand, cover, TAGLINE, CATCH, SITE, CL, LOGO_DARK, LOGO_LIGHT, RATIO };
