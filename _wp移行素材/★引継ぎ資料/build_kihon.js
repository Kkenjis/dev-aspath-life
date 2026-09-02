// ASPATH サイト運用マニュアル 基本編 — スライド生成
// 実行: node build_kihon.js
const pptx = require("pptxgenjs");
const path = require("path");

const IMG = (n) => path.join(__dirname, "レクチャー素材", n);
const CROP = (n) => path.join(__dirname, "レクチャー素材", "crop", n);

// ── ASPATHブランド ──────────────────────────────
const NAVY = "264653";   // メインの濃紺
const DEEP = "1E3A44";   // さらに濃い紺
const SUN  = "F4A261";   // アクセントのオレンジ
const PAPER= "F4E9D8";   // 生成りの背景
const WHITE= "FFFFFF";
const MUTED= "52707A";
const FONT = "Meiryo";

const p = new pptx();
p.layout = "LAYOUT_WIDE";           // 13.3 x 7.5 inch
p.author = "ASPATH";
p.title  = "ASPATH サイト運用マニュアル 基本編";

const W = 13.3, H = 7.5;

// ── 共通パーツ ──────────────────────────────────
// 見出し（明るい背景のスライド用）
function heading(s, num, text) {
  if (num !== null) {
    s.addShape(p.ShapeType.ellipse, {
      x: 0.6, y: 0.42, w: 0.62, h: 0.62, fill: { color: SUN },
    });
    s.addText(String(num), {
      x: 0.6, y: 0.42, w: 0.62, h: 0.62, align: "center", valign: "middle",
      fontSize: 24, bold: true, color: WHITE, fontFace: FONT, isTextBox: true, margin: 0,
    });
  }
  s.addText(text, {
    x: num !== null ? 1.42 : 0.6, y: 0.38, w: 11.3, h: 0.72,
    fontSize: 30, bold: true, color: NAVY, fontFace: FONT,
    valign: "middle", isTextBox: true, margin: 0,
  });
}

// スクショを置き、その上に番号の丸を重ねる
//   callouts: [{px, py, n}]  px,py は元画像のピクセル座標
function shot(s, file, box, imgW, imgH, callouts, useCrop) {
  s.addImage({ path: (useCrop ? CROP : IMG)(file), x: box.x, y: box.y, w: box.w, h: box.h });
  // 枠線がわりの薄い輪郭
  s.addShape(p.ShapeType.rect, {
    x: box.x, y: box.y, w: box.w, h: box.h,
    fill: { color: WHITE, transparency: 100 },
    line: { color: "C9D5D9", width: 1 },
  });
  (callouts || []).forEach((c) => {
    const cx = box.x + (c.px / imgW) * box.w;
    const cy = box.y + (c.py / imgH) * box.h;
    const d = 0.42;
    s.addShape(p.ShapeType.ellipse, {
      x: cx - d / 2, y: cy - d / 2, w: d, h: d,
      fill: { color: SUN }, line: { color: WHITE, width: 2 },
      shadow: { type: "outer", angle: 90, offset: 1, blur: 3, color: "000000", opacity: 0.35 },
    });
    s.addText(String(c.n), {
      x: cx - d / 2, y: cy - d / 2, w: d, h: d, align: "center", valign: "middle",
      fontSize: 14, bold: true, color: WHITE, fontFace: FONT, isTextBox: true, margin: 0,
    });
  });
}

// 手順の行（番号つき）
function steps(s, x, y, w, items, gap) {
  const g = gap || 0.78;
  items.forEach((it, i) => {
    const yy = y + i * g;
    s.addShape(p.ShapeType.ellipse, {
      x: x, y: yy + 0.02, w: 0.38, h: 0.38, fill: { color: NAVY },
    });
    s.addText(String(i + 1), {
      x: x, y: yy + 0.02, w: 0.38, h: 0.38, align: "center", valign: "middle",
      fontSize: 13, bold: true, color: WHITE, fontFace: FONT, isTextBox: true, margin: 0,
    });
    s.addText(
      [
        { text: it.t, options: { bold: true, color: NAVY, fontSize: 15, breakLine: true } },
        { text: it.d, options: { color: MUTED, fontSize: 13 } },
      ],
      { x: x + 0.55, y: yy - 0.06, w: w - 0.55, h: g, fontFace: FONT, isTextBox: true, margin: 0, valign: "top" }
    );
  });
}

// 注意ボックス
function note(s, x, y, w, h, title, body, tone) {
  const bg = tone === "warn" ? "FDF0E6" : PAPER;
  const bar = tone === "warn" ? SUN : NAVY;
  s.addShape(p.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.12, fill: { color: bg },
    line: { color: bar, width: 1.25 },
  });
  s.addShape(p.ShapeType.ellipse, { x: x + 0.26, y: y + 0.24, w: 0.34, h: 0.34, fill: { color: bar } });
  s.addText(tone === "warn" ? "!" : "i", {
    x: x + 0.26, y: y + 0.24, w: 0.34, h: 0.34, align: "center", valign: "middle",
    fontSize: 15, bold: true, color: WHITE, fontFace: FONT, isTextBox: true, margin: 0,
  });
  s.addText(
    [
      { text: title, options: { bold: true, color: NAVY, fontSize: 15, breakLine: true } },
      { text: body, options: { color: DEEP, fontSize: 13 } },
    ],
    { x: x + 0.75, y: y + 0.18, w: w - 1.0, h: h - 0.32, fontFace: FONT, isTextBox: true, margin: 0, valign: "top" }
  );
}

// ══════════════════════════════════════════════
// 1. 表紙
// ══════════════════════════════════════════════
{
  const s = p.addSlide();
  s.background = { color: NAVY };
  s.addText("ASPATH", {
    x: 0.9, y: 1.5, w: 8, h: 0.6, fontSize: 18, bold: true, color: SUN,
    charSpacing: 6, fontFace: FONT, isTextBox: true, margin: 0,
  });
  s.addText("サイト運用マニュアル", {
    x: 0.9, y: 2.15, w: 11, h: 1.0,
    fontSize: 44, bold: true, color: WHITE, fontFace: FONT, isTextBox: true, margin: 0,
  });
  s.addShape(p.ShapeType.roundRect, {
    x: 0.9, y: 3.35, w: 2.1, h: 0.66, rectRadius: 0.33, fill: { color: SUN },
  });
  s.addText("基 本 編", {
    x: 0.9, y: 3.35, w: 2.1, h: 0.66, align: "center", valign: "middle",
    fontSize: 19, bold: true, color: WHITE, fontFace: FONT, isTextBox: true, margin: 0,
  });
  s.addText("この1冊で、日々の更新はひととおりできるようになります。", {
    x: 0.9, y: 4.35, w: 10, h: 0.5, fontSize: 16, color: "CFE0E4", fontFace: FONT, isTextBox: true, margin: 0,
  });
  s.addText("2026年9月　ASPATH 様　ご納品資料", {
    x: 0.9, y: 6.3, w: 8, h: 0.4, fontSize: 12, color: "9FBAC1", fontFace: FONT, isTextBox: true, margin: 0,
  });
  s.addNotes("レクチャー冒頭。所要60分の想定。コラムの書き方は既に操作いただいているため、本資料では扱いません。");
}

// ══════════════════════════════════════════════
// 2. できるようになること（目次）
// ══════════════════════════════════════════════
{
  const s = p.addSlide();
  s.background = { color: WHITE };
  heading(s, null, "この資料で、4つのことができるようになります");

  const cards = [
    { n: "1", t: "お知らせを出す", d: "休業やキャンペーンを\nお客様に知らせる" },
    { n: "2", t: "申込を確認する", d: "初回体験のお申し込みを\n見落とさない" },
    { n: "3", t: "写真を差し替える", d: "記事の画像を\n新しいものに入れ替える" },
    { n: "4", t: "コメントに対応する", d: "スパムを見分けて\n必要なものだけ承認する" },
  ];
  cards.forEach((c, i) => {
    const x = 0.62 + i * 3.13, y = 1.7;
    s.addShape(p.ShapeType.roundRect, {
      x, y, w: 2.85, h: 3.0, rectRadius: 0.14,
      fill: { color: PAPER }, line: { color: "E2D5BE", width: 1 },
    });
    s.addShape(p.ShapeType.ellipse, { x: x + 1.13, y: y + 0.34, w: 0.6, h: 0.6, fill: { color: SUN } });
    s.addText(c.n, {
      x: x + 1.13, y: y + 0.34, w: 0.6, h: 0.6, align: "center", valign: "middle",
      fontSize: 22, bold: true, color: WHITE, fontFace: FONT, isTextBox: true, margin: 0,
    });
    s.addText(c.t, {
      x: x + 0.18, y: y + 1.15, w: 2.5, h: 0.5, align: "center",
      fontSize: 17, bold: true, color: NAVY, fontFace: FONT, isTextBox: true, margin: 0,
    });
    s.addText(c.d, {
      x: x + 0.18, y: y + 1.7, w: 2.5, h: 1.0, align: "center",
      fontSize: 12.5, color: MUTED, fontFace: FONT, isTextBox: true, margin: 0, lineSpacingMultiple: 1.2,
    });
  });
  note(s, 0.62, 5.05, 12.05, 1.05,
    "コラムの書き方は、この資料には入れていません",
    "既に山口様にご操作いただいているためです。手順を見返したいときは『山口様向け_ページの直し方.pdf』をご覧ください。");
  s.addNotes("4つの単元を最初に示す。所要は各10〜15分。");
}

// ══════════════════════════════════════════════
// 3. まず管理画面へ
// ══════════════════════════════════════════════
{
  const s = p.addSlide();
  s.background = { color: WHITE };
  heading(s, null, "はじめに ─ 管理画面の開き方");

  s.addShape(p.ShapeType.roundRect, {
    x: 0.62, y: 1.55, w: 5.6, h: 1.5, rectRadius: 0.12,
    fill: { color: NAVY },
  });
  s.addText("https://aspath-life.com/wp-admin/", {
    x: 0.85, y: 1.75, w: 5.2, h: 0.5, fontSize: 15, bold: true, color: WHITE, fontFace: FONT, isTextBox: true, margin: 0,
  });
  s.addText("このURLをお気に入りに入れておくと便利です", {
    x: 0.85, y: 2.28, w: 5.2, h: 0.5, fontSize: 12, color: "BBD2D8", fontFace: FONT, isTextBox: true, margin: 0,
  });

  steps(s, 0.62, 3.3, 5.7, [
    { t: "上のURLを開く", d: "ブラウザ（Chrome など）のアドレス欄に入力します" },
    { t: "ユーザー名とパスワードを入れる", d: "ASPATH のアカウントでログインします" },
    { t: "左側のメニューから作業を選ぶ", d: "使うのは「投稿」「初回体験の申込」「コメント」の3つです" },
  ]);

  shot(s, "00_ダッシュボード.jpg", { x: 6.55, y: 1.55, w: 6.15, h: 3.17 }, 1520, 784, []);
  note(s, 6.55, 5.0, 6.15, 1.55,
    "画面の上のほうに出るお知らせは、無視してかまいません",
    "プラグインの宣伝です。×で閉じても、また出ることがあります。作業には影響しません。");
  s.addNotes("ログインは実際にやっていただく。ブックマーク登録までその場で。");
}

// ══════════════════════════════════════════════
// 4-7. お知らせを出す
// ══════════════════════════════════════════════
{
  const s = p.addSlide();
  s.background = { color: PAPER };
  heading(s, 1, "お知らせを出す ─ 全体の流れ");

  const flow = [
    { t: "新規追加", d: "投稿 → 新規追加" },
    { t: "書く", d: "題名と本文" },
    { t: "分類する", d: "カテゴリー「お知らせ」" },
    { t: "必要なら固定", d: "先頭固定表示" },
    { t: "公開", d: "公開ボタン" },
  ];
  flow.forEach((f, i) => {
    const x = 0.62 + i * 2.5;
    s.addShape(p.ShapeType.roundRect, {
      x, y: 1.85, w: 2.15, h: 1.65, rectRadius: 0.12,
      fill: { color: WHITE }, line: { color: "E2D5BE", width: 1 },
    });
    s.addShape(p.ShapeType.ellipse, { x: x + 0.83, y: 2.05, w: 0.5, h: 0.5, fill: { color: NAVY } });
    s.addText(String(i + 1), {
      x: x + 0.83, y: 2.05, w: 0.5, h: 0.5, align: "center", valign: "middle",
      fontSize: 17, bold: true, color: WHITE, fontFace: FONT, isTextBox: true, margin: 0,
    });
    s.addText(f.t, {
      x: x + 0.1, y: 2.65, w: 1.95, h: 0.35, align: "center",
      fontSize: 14, bold: true, color: NAVY, fontFace: FONT, isTextBox: true, margin: 0,
    });
    s.addText(f.d, {
      x: x + 0.1, y: 3.0, w: 1.95, h: 0.42, align: "center",
      fontSize: 11, color: MUTED, fontFace: FONT, isTextBox: true, margin: 0,
    });
    if (i < flow.length - 1) {
      s.addText("›", {
        x: x + 2.15, y: 2.35, w: 0.35, h: 0.5, align: "center", valign: "middle",
        fontSize: 26, bold: true, color: SUN, fontFace: FONT, isTextBox: true, margin: 0,
      });
    }
  });

  note(s, 0.62, 4.0, 12.05, 1.15,
    "「お知らせ」と「コラム」の違い",
    "お知らせ＝休業・キャンペーンなどの連絡事項。コラム＝パーキンソン病に関する読みもの。分ける場所は同じ「カテゴリー」欄です。");
  note(s, 0.62, 5.35, 12.05, 1.15,
    "書いている途中で閉じても大丈夫です",
    "「下書き保存」を押しておけば、あとから続きを書けます。公開ボタンを押すまで、お客様には見えません。", "warn");
  s.addNotes("5ステップを頭に入れてもらってから、実画面へ。");
}

{
  const s = p.addSlide();
  s.background = { color: WHITE };
  heading(s, 1, "お知らせを出す ─ 題名と本文を書く");
  // 3136x570 の帯。画面の上部だけを切り出して拡大している
  shot(s, "11_本文.jpg", { x: 0.62, y: 1.45, w: 12.05, h: 2.19 }, 3136, 570,
    [{ px: 880, py: 300, n: 1 }, { px: 880, py: 462, n: 2 },
     { px: 3014, py: 185, n: 3 }, { px: 2537, py: 185, n: 4 }], true);
  const items = [
    { n: 1, t: "題名を入れる", d: "「年末年始の休業のお知らせ」など" },
    { n: 2, t: "本文を書く", d: "そのまま打ち込めます" },
    { n: 3, t: "公開する", d: "押した瞬間に載ります" },
    { n: 4, t: "下書き保存", d: "まだ載せたくないとき" },
  ];
  items.forEach((it, i) => {
    const x = 0.62 + i * 3.05;
    s.addShape(p.ShapeType.ellipse, { x, y: 3.95, w: 0.4, h: 0.4, fill: { color: SUN } });
    s.addText(String(it.n), {
      x, y: 3.95, w: 0.4, h: 0.4, align: "center", valign: "middle",
      fontSize: 14, bold: true, color: WHITE, fontFace: FONT, isTextBox: true, margin: 0,
    });
    s.addText(
      [
        { text: it.t, options: { bold: true, color: NAVY, fontSize: 14.5, breakLine: true } },
        { text: it.d, options: { color: MUTED, fontSize: 12 } },
      ],
      { x: x + 0.5, y: 3.9, w: 2.4, h: 1.0, fontFace: FONT, isTextBox: true, margin: 0, valign: "top" }
    );
  });
  note(s, 0.62, 5.15, 12.05, 1.0,
    "改行は Enter で問題ありません",
    "Shift＋Enter は使わないでください。行間が崩れることがあります。", "warn");
  s.addNotes("実際に題名だけ入れてもらう。公開はまだ押さない。");
}

{
  const s = p.addSlide();
  s.background = { color: WHITE };
  heading(s, 1, "お知らせを出す ─ 「お知らせ」に分類する");

  s.addText("① 右上の四角いアイコンを押して、設定パネルを開く", {
    x: 0.62, y: 1.42, w: 6.6, h: 0.4, fontSize: 15, bold: true, color: NAVY, fontFace: FONT, isTextBox: true, margin: 0,
  });
  shot(s, "12a_設定アイコン.jpg", { x: 0.62, y: 1.9, w: 5.6, h: 2.6 }, 840, 390,
    [{ px: 330, py: 310, n: 1 }], true);

  s.addText("② カテゴリーの「お知らせ」にチェックを入れる", {
    x: 0.62, y: 4.62, w: 6.6, h: 0.4, fontSize: 15, bold: true, color: NAVY, fontFace: FONT, isTextBox: true, margin: 0,
  });
  shot(s, "12b_カテゴリ欄.jpg", { x: 0.62, y: 5.1, w: 4.6, h: 2.3 }, 920, 460,
    [{ px: 420, py: 196, n: 2 }], true);

  note(s, 6.85, 1.9, 5.82, 1.5,
    "「コラム」のチェックは外してください",
    "両方に入っていると、コラム一覧にも休業のお知らせが並びます。");
  note(s, 6.85, 3.6, 5.82, 1.75,
    "ここを間違えると",
    "読みものを探しに来た方が、休業のお知らせに行き当たって戸惑います。あとから直せますので、慌てなくて大丈夫です。", "warn");
  s.addNotes("カテゴリーの付け替えは後からでもできる、と補足する。");
}

{
  const s = p.addSlide();
  s.background = { color: WHITE };
  heading(s, 1, "お知らせを出す ─ 大事なお知らせを先頭に固定する");

  s.addText("① 右側の「ステータス」の文字を押す", {
    x: 0.62, y: 1.42, w: 6.0, h: 0.4, fontSize: 15, bold: true, color: NAVY, fontFace: FONT, isTextBox: true, margin: 0,
  });
  shot(s, "13a_ステータス.jpg", { x: 0.62, y: 1.9, w: 5.4, h: 0.94 }, 1150, 200,
    [{ px: 990, py: 100, n: 1 }], true);

  s.addText("② 開いた窓で「先頭固定表示」にチェック", {
    x: 0.62, y: 3.05, w: 6.0, h: 0.4, fontSize: 15, bold: true, color: NAVY, fontFace: FONT, isTextBox: true, margin: 0,
  });
  // 番号は画像の外（右側）に置き、項目名が隠れないようにする
  shot(s, "13b_固定ポップ.jpg", { x: 0.62, y: 3.52, w: 2.95, h: 4.04 }, 810, 1110,
    [{ px: 890, py: 978, n: 2 }], true);

  note(s, 6.85, 1.9, 5.82, 1.9,
    "使いどころ",
    "休業のお知らせ、キャンペーンなど「今いちばん見てほしいもの」だけに使ってください。何件も固定すると、どれが大事か分からなくなります。");
  note(s, 6.85, 4.0, 5.82, 1.9,
    "終わったら外してください",
    "期間が過ぎたお知らせが先頭に残っていると、情報が古いサイトに見えてしまいます。同じ手順でチェックを外すだけです。", "warn");
  s.addNotes("固定は終わったら外す運用を勧める。");
}

// ══════════════════════════════════════════════
// 8-9. 初回体験の申込
// ══════════════════════════════════════════════
{
  const s = p.addSlide();
  s.background = { color: WHITE };
  heading(s, 2, "初回体験の申込を見る ─ 一覧を開く");
  // 3136x580 の帯（左メニュー＋一覧の1行目）
  shot(s, "21_一覧.jpg", { x: 0.62, y: 1.45, w: 12.05, h: 2.23 }, 3136, 580,
    [{ px: 120, py: 505, n: 1 }, { px: 580, py: 320, n: 2 }], true);
  const it2 = [
    { n: 1, t: "左メニュー「初回体験の申込」", d: "お申し込みはすべてここに入ります" },
    { n: 2, t: "お名前の部分を押す", d: "申込の中身が開きます" },
  ];
  it2.forEach((it, i) => {
    const x = 0.62 + i * 6.1;
    s.addShape(p.ShapeType.ellipse, { x, y: 3.95, w: 0.4, h: 0.4, fill: { color: SUN } });
    s.addText(String(it.n), {
      x, y: 3.95, w: 0.4, h: 0.4, align: "center", valign: "middle",
      fontSize: 14, bold: true, color: WHITE, fontFace: FONT, isTextBox: true, margin: 0,
    });
    s.addText(
      [
        { text: it.t, options: { bold: true, color: NAVY, fontSize: 15, breakLine: true } },
        { text: it.d, options: { color: MUTED, fontSize: 12.5 } },
      ],
      { x: x + 0.52, y: 3.9, w: 5.2, h: 0.9, fontFace: FONT, isTextBox: true, margin: 0, valign: "top" }
    );
  });
  note(s, 0.62, 5.0, 12.05, 1.35,
    "毎日1回は開いてください",
    "メールが迷惑メールフォルダに入ってしまっても、お申し込みはこの画面に必ず残ります。ここが最後の砦です。", "warn");
  s.addNotes("画面の氏名・連絡先はダミーに差し替えて撮影している旨を伝える。");
}

{
  const s = p.addSlide();
  s.background = { color: WHITE };
  heading(s, 2, "初回体験の申込を見る ─ 中身を確認する");
  // 2400x820（申込内容の本文エリア）
  shot(s, "22_中身.jpg", { x: 0.62, y: 1.42, w: 8.4, h: 2.87 }, 2400, 820, [], true);
  s.addText("1画面で分かること", {
    x: 9.4, y: 1.42, w: 3.4, h: 0.4, fontSize: 15, bold: true, color: NAVY, fontFace: FONT, isTextBox: true, margin: 0,
  });
  s.addText(
    [
      { text: "お名前・フリガナ", options: { bullet: true, breakLine: true } },
      { text: "生年月日", options: { bullet: true, breakLine: true } },
      { text: "メールアドレス", options: { bullet: true, breakLine: true } },
      { text: "お電話番号", options: { bullet: true, breakLine: true } },
      { text: "ご住所", options: { bullet: true, breakLine: true } },
      { text: "どなたのご相談か", options: { bullet: true, breakLine: true } },
      { text: "医師からの診断名", options: { bullet: true, breakLine: true } },
      { text: "困っていること", options: { bullet: true, breakLine: true } },
      { text: "ASPATHを知ったきっかけ", options: { bullet: true } },
    ],
    { x: 9.4, y: 1.9, w: 3.4, h: 3.3, fontSize: 12.5, color: DEEP, fontFace: FONT, isTextBox: true, margin: 0, paraSpaceAfter: 4 }
  );
  note(s, 0.62, 4.55, 8.4, 1.05,
    "この画面は編集しないでください",
    "お客様が送ってくださった内容の控えです。書き換えると、あとで確認できなくなります。", "warn");
  note(s, 0.62, 5.75, 12.05, 1.0,
    "診断名などの大切な情報が入っています",
    "画面を開いたまま席を離れない、印刷物を放置しない。ご本人以外の目に触れないよう、取り扱いにご注意ください。", "warn");
  s.addNotes("診断名が入るため、画面を人に見せない・印刷を放置しないことを強調。この画面の氏名・連絡先は資料用のダミー。");
}

// ══════════════════════════════════════════════
// 10. 写真の差し替え
// ══════════════════════════════════════════════
{
  const s = p.addSlide();
  s.background = { color: WHITE };
  heading(s, 3, "写真を差し替える");
  // 1440x910（写真ブロックと、上に出る道具の帯）
  // ②は「置換」の文字を隠さないよう、ツールバーの上の余白に置く
  shot(s, "31_置換.jpg", { x: 0.62, y: 1.42, w: 8.4, h: 5.62 }, 1440, 964,
    [{ px: 220, py: 660, n: 1 }, { px: 672, py: 42, n: 2 }], true);
  steps(s, 9.4, 1.42, 3.4, [
    { t: "写真を1回押す", d: "青い枠が付いて、上に道具が並びます" },
    { t: "「置換」を押す", d: "新しい写真を選ぶ画面が開きます" },
    { t: "写真を選ぶ", d: "パソコンから選ぶか、すでに入っているものから選びます" },
    { t: "「更新」を押す", d: "右上のボタンです" },
  ], 0.9);
  note(s, 9.4, 5.05, 3.4, 1.68,
    "元の写真は消えません",
    "差し替えても前の写真はメディアに残ります。戻したくなったら同じ手順で選び直せます。");
  s.addNotes("実際に1枚差し替えてもらい、更新まで通す。");
}

// ══════════════════════════════════════════════
// 11-12. コメント
// ══════════════════════════════════════════════
{
  const s = p.addSlide();
  s.background = { color: WHITE };
  heading(s, 4, "コメントに対応する ─ 承認待ちを見る");
  // 3136x690（左メニュー＋承認待ちタブ＋スパム2件）
  // 番号はUIを隠さないよう、余白のある位置に置く
  shot(s, "41_コメント.jpg", { x: 0.62, y: 1.45, w: 12.05, h: 2.65 }, 3136, 690,
    [{ px: 310, py: 452, n: 1 }, { px: 1160, py: 114, n: 2 }, { px: 1560, py: 442, n: 3 }], true);
  const it4 = [
    { n: 1, t: "左メニュー「コメント」", d: "数字は承認待ちの件数" },
    { n: 2, t: "「承認待ち」を押す", d: "対応が必要なものだけ出ます" },
    { n: 3, t: "中身を読む", d: "承認かスパムかを決めます" },
  ];
  it4.forEach((it, i) => {
    const x = 0.62 + i * 4.07;
    s.addShape(p.ShapeType.ellipse, { x, y: 4.35, w: 0.4, h: 0.4, fill: { color: SUN } });
    s.addText(String(it.n), {
      x, y: 4.35, w: 0.4, h: 0.4, align: "center", valign: "middle",
      fontSize: 14, bold: true, color: WHITE, fontFace: FONT, isTextBox: true, margin: 0,
    });
    s.addText(
      [
        { text: it.t, options: { bold: true, color: NAVY, fontSize: 14.5, breakLine: true } },
        { text: it.d, options: { color: MUTED, fontSize: 12 } },
      ],
      { x: x + 0.52, y: 4.3, w: 3.4, h: 0.9, fontFace: FONT, isTextBox: true, margin: 0, valign: "top" }
    );
  });
  note(s, 0.62, 5.4, 12.05, 1.15,
    "承認するまで、お客様には見えません",
    "放置しても表示はされません。慌てなくて大丈夫です。上の2件は、実際に届いたスパムです。");
  s.addNotes("この画面の2件は実際に届いたスパム。次のスライドで詳しく。");
}

{
  const s = p.addSlide();
  s.background = { color: PAPER };
  heading(s, 4, "コメントに対応する ─ スパムの見分け方");

  s.addText("いま届いている2件は、両方ともスパムでした", {
    x: 0.62, y: 1.28, w: 12.05, h: 0.4, fontSize: 16, bold: true, color: NAVY, fontFace: FONT, isTextBox: true, margin: 0,
  });

  const sign = [
    { t: "英語で書かれている", d: "日本語のサイトに英語のコメントは、ほぼ宣伝です" },
    { t: "知らないサイトへのリンク", d: "カジノ・投資などのURLが本文や名前に入っています" },
    { t: "記事と関係がない", d: "体幹の記事に「ルーレット戦略」など、話が噛み合いません" },
    { t: "妙に褒めてくる", d: "中身のない称賛だけで、具体的な感想がありません" },
  ];
  sign.forEach((g, i) => {
    const x = 0.62 + (i % 2) * 6.2, y = 1.85 + Math.floor(i / 2) * 1.5;
    s.addShape(p.ShapeType.roundRect, {
      x, y, w: 5.85, h: 1.28, rectRadius: 0.12, fill: { color: WHITE }, line: { color: "E2D5BE", width: 1 },
    });
    s.addShape(p.ShapeType.ellipse, { x: x + 0.28, y: y + 0.42, w: 0.44, h: 0.44, fill: { color: SUN } });
    s.addText("!", {
      x: x + 0.28, y: y + 0.42, w: 0.44, h: 0.44, align: "center", valign: "middle",
      fontSize: 16, bold: true, color: WHITE, fontFace: FONT, isTextBox: true, margin: 0,
    });
    s.addText(
      [
        { text: g.t, options: { bold: true, color: NAVY, fontSize: 14.5, breakLine: true } },
        { text: g.d, options: { color: MUTED, fontSize: 12 } },
      ],
      { x: x + 0.88, y: y + 0.2, w: 4.8, h: 0.95, fontFace: FONT, isTextBox: true, margin: 0, valign: "top" }
    );
  });

  note(s, 0.62, 5.0, 12.05, 1.6,
    "迷ったら「スパム」を選んでください",
    "承認すると、パーキンソン病専門サイトにカジノへのリンクが載ってしまいます。間違えて本物をスパムにしても、あとから戻せます。承認して載せてしまうより安全です。", "warn");
  s.addNotes("実物2件を一緒に見ながら、その場でスパム処理していただく。");
}

// ══════════════════════════════════════════════
// 13. 困ったとき
// ══════════════════════════════════════════════
{
  const s = p.addSlide();
  s.background = { color: WHITE };
  heading(s, null, "困ったときは");

  const trouble = [
    { q: "直したのに画面が変わらない", a: "左メニュー「Super Page Cache」→ 赤い「Purge Cache」を押してから、画面を再読み込みしてください。" },
    { q: "間違えて公開してしまった", a: "その記事を開き、「ステータス」から「下書き」に戻せば、お客様には見えなくなります。" },
    { q: "消してしまった", a: "「ゴミ箱」に残っています。ゴミ箱を開いて「復元」を押してください。" },
    { q: "パスワードが分からない", a: "ログイン画面の「パスワードをお忘れですか？」から再設定できます。" },
  ];
  trouble.forEach((t, i) => {
    const y = 1.45 + i * 1.28;
    s.addShape(p.ShapeType.roundRect, {
      x: 0.62, y, w: 12.05, h: 1.12, rectRadius: 0.12,
      fill: { color: i % 2 ? PAPER : "F7FAFA" }, line: { color: "DCE6E8", width: 1 },
    });
    s.addText("Q", {
      x: 0.85, y: y + 0.16, w: 0.4, h: 0.4, align: "center", valign: "middle",
      fontSize: 16, bold: true, color: SUN, fontFace: FONT, isTextBox: true, margin: 0,
    });
    s.addText(
      [
        { text: t.q, options: { bold: true, color: NAVY, fontSize: 15, breakLine: true } },
        { text: t.a, options: { color: DEEP, fontSize: 12.5 } },
      ],
      { x: 1.35, y: y + 0.14, w: 11.1, h: 0.85, fontFace: FONT, isTextBox: true, margin: 0, valign: "top" }
    );
  });
  s.addNotes("キャッシュは一番よくある相談。ここだけは覚えていただく。");
}

// ══════════════════════════════════════════════
// 14. まとめ
// ══════════════════════════════════════════════
{
  const s = p.addSlide();
  s.background = { color: NAVY };
  s.addText("覚えていただきたいのは、3つだけです", {
    x: 0.9, y: 0.95, w: 11.5, h: 0.8, fontSize: 32, bold: true, color: WHITE, fontFace: FONT, isTextBox: true, margin: 0,
  });

  const keys = [
    { n: "1", t: "公開を押すまで、\nお客様には見えない", d: "安心して書きかけで保存してください" },
    { n: "2", t: "変わらないときは\nキャッシュを消す", d: "Super Page Cache → Purge Cache" },
    { n: "3", t: "コメントは\n迷ったらスパムへ", d: "承認して載せるより安全です" },
  ];
  keys.forEach((k, i) => {
    const x = 0.9 + i * 4.05;
    s.addShape(p.ShapeType.roundRect, {
      x, y: 2.1, w: 3.7, h: 3.1, rectRadius: 0.14, fill: { color: DEEP },
    });
    s.addShape(p.ShapeType.ellipse, { x: x + 1.5, y: 2.42, w: 0.7, h: 0.7, fill: { color: SUN } });
    s.addText(k.n, {
      x: x + 1.5, y: 2.42, w: 0.7, h: 0.7, align: "center", valign: "middle",
      fontSize: 26, bold: true, color: WHITE, fontFace: FONT, isTextBox: true, margin: 0,
    });
    s.addText(k.t, {
      x: x + 0.22, y: 3.3, w: 3.26, h: 1.0, align: "center",
      fontSize: 16, bold: true, color: WHITE, fontFace: FONT, isTextBox: true, margin: 0, lineSpacingMultiple: 1.15,
    });
    s.addText(k.d, {
      x: x + 0.22, y: 4.35, w: 3.26, h: 0.7, align: "center",
      fontSize: 12, color: "AFC8CE", fontFace: FONT, isTextBox: true, margin: 0,
    });
  });

  s.addText("さらに踏み込んだ作業（テーマの入れ替え・固定ページの修正・検索対策）は、別冊「応用編」にまとめています。", {
    x: 0.9, y: 5.65, w: 11.5, h: 0.5, fontSize: 13.5, color: "CFE0E4", fontFace: FONT, isTextBox: true, margin: 0,
  });
  s.addNotes("最後にこの3つだけ確認して終了。応用編の存在を案内する。");
}

p.writeFile({ fileName: path.join(__dirname, "★ASPATH_サイト運用マニュアル_基本編.pptx") })
 .then((f) => console.log("生成しました:", f));
