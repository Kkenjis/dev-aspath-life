// ASPATH サイト運用マニュアル 応用編 — スライド生成
//   A. 触ると壊れる領域と、その安全な触り方
//   B. やっておいて損はないこと
//   C. AIの使い方は別冊「AI活用編」へ（2026-09-04 分離）
// 実行: NODE_PATH=<node_modules> node 応用編pptxを作る.js
const pptx = require("pptxgenjs");

const P = new pptx();
P.layout = "LAYOUT_WIDE"; // 13.3 x 7.5
P.author = "ASPATH";
P.title  = "ASPATH サイト運用マニュアル 応用編";

// ── ASPATHブランド ──
const NAVY = "264653", DEEP = "1E3A44", SUN = "F4A261", SUND = "DD8236",
      PAPER = "F4E9D8", WHITE = "FFFFFF", MUTED = "52707A", INK = "1E2D34",
      RED = "B4453C", GREEN = "2E7D32", CODEBG = "F2F5F6";
const F = "Meiryo", MONO = "Consolas";
const IMG = "/sessions/compassionate-sweet-heisenberg/mnt/dev-aspath-life-main/_wp移行素材/★引継ぎ資料/画像/";

let pageNo = 0;
function head(s, t, sub, opts) {
  const o = opts || {};
  pageNo++;
  s.background = { color: o.dark ? NAVY : WHITE };
  if (o.chapter) {
    s.addShape(P.ShapeType.roundRect, { x: 0.6, y: 0.36, w: 0.52, h: 0.52, rectRadius: 0.26, fill: { color: SUN } });
    s.addText(o.chapter, {
      x: 0.6, y: 0.36, w: 0.52, h: 0.52, align: "center", valign: "middle",
      fontSize: 20, bold: true, color: WHITE, fontFace: F, isTextBox: true, margin: 0,
    });
  }
  s.addText(t, {
    x: o.chapter ? 1.32 : 0.6, y: 0.32, w: 11.3, h: 0.66,
    fontSize: 28, bold: true, color: o.dark ? WHITE : NAVY, fontFace: F,
    valign: "middle", isTextBox: true, margin: 0,
  });
  if (sub) s.addText(sub, {
    x: o.chapter ? 1.34 : 0.62, y: 1.0, w: 11.3, h: 0.36,
    fontSize: 14, color: o.dark ? "C9D6DA" : MUTED, fontFace: F, isTextBox: true, margin: 0,
  });
  s.addText(String(pageNo), {
    x: 12.45, y: 6.95, w: 0.45, h: 0.28, align: "right",
    fontSize: 10.5, color: o.dark ? "7E969E" : "A8B4B8", fontFace: F, isTextBox: true, margin: 0,
  });
}

// 注意・補足ボックス
function box(s, x, y, w, h, title, body, tone) {
  const map = {
    warn: { bg: "FDF0E6", bar: SUND, mark: "!" },
    ng:   { bg: "FBEDEC", bar: RED,  mark: "×" },
    ok:   { bg: "EDF6EE", bar: GREEN, mark: "✓" },
    info: { bg: PAPER,    bar: NAVY, mark: "i" },
  };
  const c = map[tone || "info"];
  s.addShape(P.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.12, fill: { color: c.bg }, line: { color: c.bar, width: 1.2 } });
  s.addShape(P.ShapeType.ellipse, { x: x + 0.24, y: y + 0.22, w: 0.34, h: 0.34, fill: { color: c.bar } });
  s.addText(c.mark, {
    x: x + 0.24, y: y + 0.22, w: 0.34, h: 0.34, align: "center", valign: "middle",
    fontSize: 14, bold: true, color: WHITE, fontFace: F, isTextBox: true, margin: 0,
  });
  s.addText(
    [{ text: title, options: { bold: true, color: NAVY, fontSize: 14, breakLine: true } },
     { text: body, options: { color: INK, fontSize: 12 } }],
    { x: x + 0.72, y: y + 0.16, w: w - 0.96, h: h - 0.3, fontFace: F, isTextBox: true, margin: 0, valign: "top", lineSpacingMultiple: 1.15 }
  );
}

// そのまま貼って使えるプロンプト枠
function prompt(s, x, y, w, h, label, text) {
  s.addShape(P.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.1, fill: { color: CODEBG }, line: { color: "C9D5D9", width: 1 } });
  s.addShape(P.ShapeType.roundRect, { x: x + 0.18, y: y - 0.14, w: 2.5, h: 0.32, rectRadius: 0.16, fill: { color: NAVY } });
  s.addText(label, {
    x: x + 0.18, y: y - 0.14, w: 2.5, h: 0.32, align: "center", valign: "middle",
    fontSize: 10.5, bold: true, color: WHITE, fontFace: F, isTextBox: true, margin: 0,
  });
  s.addText(text, {
    x: x + 0.24, y: y + 0.26, w: w - 0.48, h: h - 0.44,
    fontSize: 10.5, color: INK, fontFace: MONO, isTextBox: true, margin: 0, valign: "top", lineSpacingMultiple: 1.22,
  });
}

// 手順の行
function steps(s, x, y, w, items, gap, size) {
  const g = gap || 0.66, fs = size || 13.5;
  items.forEach((it, i) => {
    const yy = y + i * g;
    s.addShape(P.ShapeType.ellipse, { x, y: yy + 0.02, w: 0.36, h: 0.36, fill: { color: NAVY } });
    s.addText(String(i + 1), {
      x, y: yy + 0.02, w: 0.36, h: 0.36, align: "center", valign: "middle",
      fontSize: 12.5, bold: true, color: WHITE, fontFace: F, isTextBox: true, margin: 0,
    });
    s.addText(
      [{ text: it.t, options: { bold: true, color: NAVY, fontSize: fs, breakLine: true } },
       { text: it.d, options: { color: MUTED, fontSize: fs - 2 } }],
      { x: x + 0.5, y: yy - 0.05, w: w - 0.5, h: g + 0.1, fontFace: F, isTextBox: true, margin: 0, valign: "top" }
    );
  });
}

function pic(s, f, x, y, w, ratio) {
  s.addImage({ path: IMG + f, x, y, w, h: w * (ratio || 764 / 1568) });
  s.addShape(P.ShapeType.rect, {
    x, y, w, h: w * (ratio || 764 / 1568),
    fill: { color: WHITE, transparency: 100 }, line: { color: "C9D5D9", width: 1 },
  });
}

// 章の扉
function chapterCover(s, num, title, lines) {
  s.background = { color: NAVY };
  s.addShape(P.ShapeType.roundRect, { x: 1.0, y: 2.05, w: 1.0, h: 1.0, rectRadius: 0.5, fill: { color: SUN } });
  s.addText(num, {
    x: 1.0, y: 2.05, w: 1.0, h: 1.0, align: "center", valign: "middle",
    fontSize: 38, bold: true, color: WHITE, fontFace: F, isTextBox: true, margin: 0,
  });
  s.addText(title, {
    x: 2.35, y: 2.1, w: 10.2, h: 0.9,
    fontSize: 34, bold: true, color: WHITE, fontFace: F, valign: "middle", isTextBox: true, margin: 0,
  });
  s.addText(lines.map((l, i) => ({ text: l, options: { bullet: true, breakLine: i < lines.length - 1 } })), {
    x: 2.4, y: 3.35, w: 9.8, h: 2.0, fontSize: 15, color: "CFE0E4", fontFace: F,
    isTextBox: true, margin: 0, paraSpaceAfter: 8,
  });
}

/* ══════════ 1 表紙 ══════════ */
{
  const s = P.addSlide();
  s.background = { color: NAVY };
  s.addText("ASPATH", { x: 0.9, y: 1.45, w: 8, h: 0.5, fontSize: 17, bold: true, color: SUN, charSpacing: 6, fontFace: F, isTextBox: true, margin: 0 });
  s.addText("サイト運用マニュアル", { x: 0.9, y: 2.05, w: 11, h: 0.95, fontSize: 42, bold: true, color: WHITE, fontFace: F, isTextBox: true, margin: 0 });
  s.addShape(P.ShapeType.roundRect, { x: 0.9, y: 3.2, w: 2.1, h: 0.64, rectRadius: 0.32, fill: { color: SUN } });
  s.addText("応 用 編", { x: 0.9, y: 3.2, w: 2.1, h: 0.64, align: "center", valign: "middle", fontSize: 18, bold: true, color: WHITE, fontFace: F, isTextBox: true, margin: 0 });
  s.addText("壊さない触り方と、やっておいて損はないこと", { x: 0.9, y: 4.15, w: 11, h: 0.45, fontSize: 16, color: "CFE0E4", fontFace: F, isTextBox: true, margin: 0 });
  s.addText("2026年9月　ASPATH 様　ご納品資料", { x: 0.9, y: 6.3, w: 8, h: 0.4, fontSize: 12, color: "9FBAC1", fontFace: F, isTextBox: true, margin: 0 });
  s.addNotes("基本編を終えた方向け。1回で全部やらず、必要になった章だけ開く使い方でよい。");
}

/* ══════════ 2 この資料の使い方 ══════════ */
{
  const s = P.addSlide();
  head(s, "この資料の使い方", "上から順に読む必要はありません。必要になった章だけ開いてください");
  const ch = [
    { n: "A", t: "触ると壊れる領域", d: "テーマの入れ替え、固定ページの修正、\nバックアップ。事故を防ぐための章", c: RED },
    { n: "B", t: "やっておいて損はないこと", d: "検索対策、数字の見方、スパム対策。\nじわじわ効く章", c: GREEN },
    { n: "C", t: "AIを使いこなす", d: "別冊「AI活用編」に\nまとめています", c: SUND },
  ];
  ch.forEach((c, i) => {
    const x = 0.65 + i * 4.05;
    s.addShape(P.ShapeType.roundRect, { x, y: 1.7, w: 3.75, h: 3.5, rectRadius: 0.14, fill: { color: PAPER }, line: { color: "E2D5BE", width: 1 } });
    s.addShape(P.ShapeType.roundRect, { x: x + 1.5, y: 2.05, w: 0.75, h: 0.75, rectRadius: 0.38, fill: { color: c.c } });
    s.addText(c.n, { x: x + 1.5, y: 2.05, w: 0.75, h: 0.75, align: "center", valign: "middle", fontSize: 28, bold: true, color: WHITE, fontFace: F, isTextBox: true, margin: 0 });
    s.addText(c.t, { x: x + 0.2, y: 3.05, w: 3.35, h: 0.5, align: "center", fontSize: 16.5, bold: true, color: NAVY, fontFace: F, isTextBox: true, margin: 0 });
    s.addText(c.d, { x: x + 0.2, y: 3.62, w: 3.35, h: 1.3, align: "center", fontSize: 12.5, color: MUTED, fontFace: F, isTextBox: true, margin: 0, lineSpacingMultiple: 1.25 });
  });
  box(s, 0.65, 5.45, 11.95, 1.15, "困ったら、まず基本編を見てください",
    "日々の更新（お知らせ・申込確認・写真差し替え・コメント）は、すべて基本編に入っています。この資料はその先の話です。", "info");
  s.addNotes("応用編は通読しなくてよい、という前提を最初に伝える。");
}

/* ══════════ 3 A章 扉 ══════════ */
{
  const s = P.addSlide();
  chapterCover(s, "A", "触ると壊れる領域と、その安全な触り方", [
    "絶対に変えてはいけないもの（これだけは覚えてください）",
    "作業前のバックアップ",
    "テーマの入れ替え",
    "固定ページの文章を直す",
    "変更が画面に出ないとき（キャッシュ）",
  ]);
  pageNo++;
  s.addNotes("ここは「やらないこと」を先に伝える章。");
}

/* ══════════ 4 変えてはいけないもの ══════════ */
{
  const s = P.addSlide();
  head(s, "絶対に変えてはいけないもの", "この4つだけは、触らないでください", { chapter: "A" });
  const items = [
    ["初回体験フォームのURL", "aspath-life.com/taiken-2026as9y/", "変えるとお申し込みが届かなくなります。過去にご案内したURLも切れます。"],
    ["アナリティクスの測定ID", "G-17MTFN7SQ4", "変えると、これまで貯めた訪問者データと繋がらなくなります。"],
    ["表示設定の割り当て", "ホームページ＝HOME ／ 投稿ページ＝コラム", "入れ替えると、トップページが記事一覧になってしまいます。"],
    ["公開中ページのスラッグ（URLの文字）", "/about/ ／ /services/ など", "変えると、その日から検索順位がゼロに戻ります。"],
  ];
  let y = 1.6;
  items.forEach(([t, code, d]) => {
    s.addShape(P.ShapeType.roundRect, { x: 0.65, y, w: 11.95, h: 1.1, rectRadius: 0.1, fill: { color: "FBEDEC" }, line: { color: RED, width: 1 } });
    s.addText("×", { x: 0.88, y: y + 0.32, w: 0.4, h: 0.4, align: "center", valign: "middle", fontSize: 20, bold: true, color: RED, fontFace: F, isTextBox: true, margin: 0 });
    s.addText(t, { x: 1.42, y: y + 0.12, w: 4.6, h: 0.35, fontSize: 14, bold: true, color: NAVY, fontFace: F, isTextBox: true, margin: 0 });
    s.addText(code, { x: 1.42, y: y + 0.5, w: 4.6, h: 0.38, fontSize: 11, color: RED, fontFace: MONO, isTextBox: true, margin: 0 });
    s.addText(d, { x: 6.3, y: y + 0.16, w: 6.1, h: 0.78, fontSize: 12, color: INK, fontFace: F, isTextBox: true, margin: 0, lineSpacingMultiple: 1.2 });
    y += 1.22;
  });
  box(s, 0.65, 6.52, 11.95, 0.82, "迷ったら、変えないでください",
    "元に戻せないものが、この4つです。ほかのことは、ほぼ元に戻せます。", "ng");
  s.addNotes("この4つは暗記でなく、資料の場所を覚えてもらえばよい。");
}

/* ══════════ 5 バックアップ ══════════ */
{
  const s = P.addSlide();
  head(s, "作業前にバックアップを取る", "5分で終わります。これをやれば、失敗しても戻せます", { chapter: "A" });
  steps(s, 0.65, 1.7, 6.2, [
    { t: "左メニュー「All-in-One WP Migration」→ エクスポート", d: "" },
    { t: "「エクスポート先」→「ファイル」を選ぶ", d: "しばらく待つと、ダウンロードのボタンが出ます" },
    { t: "ボタンを押して、パソコンに保存する", d: "ファイル名に日付が入ります。そのままで結構です" },
    { t: "保存できたら、作業を始める", d: "" },
  ], 0.82, 14);
  box(s, 0.65, 5.2, 6.2, 1.5, "どんなときに取るか",
    "テーマの入れ替え前／プラグインを更新する前／固定ページを直す前。記事を書くだけなら不要です。", "info");
  box(s, 7.2, 1.7, 5.4, 2.3, "戻し方（万一のとき）",
    "同じ画面の「インポート」から、保存したファイルを選ぶだけです。ただし戻すとその後の変更も消えるため、実行前にご連絡ください。", "warn");
  box(s, 7.2, 4.2, 5.4, 2.5, "月1回でも取っておくと安心です",
    "サーバー側の自動バックアップもありますが、期間に限りがあります。手元にファイルが1つあると、いざというとき確実です。保存先はパソコンでもクラウドでも構いません。", "ok");
  s.addNotes("バックアップは「保険」。取り方だけ一度やってもらう。");
}

/* ══════════ 6 テーマの入れ替え ══════════ */
{
  const s = P.addSlide();
  head(s, "テーマを入れ替える", "サイトの見た目や固定ページを直したときの反映作業", { chapter: "A" });
  pic(s, "05_テーマのアップロード.jpg", 0.65, 1.6, 7.3);
  steps(s, 8.2, 1.65, 4.5, [
    { t: "外観 → テーマ → 新規追加", d: "" },
    { t: "「テーマのアップロード」", d: "aspath-theme.zip を選びます" },
    { t: "「既存のものを置き換える」", d: "上書きの確認が出ます" },
    { t: "「テーマを有効化」は押さない", d: "すでに有効なので不要です" },
    { t: "キャッシュを消す", d: "次のページで説明します" },
  ], 0.72, 13);
  box(s, 0.65, 5.6, 12.0, 1.1, "ZIPファイルは、幸喜がお渡ししたものだけを使ってください",
    "「テーマを作る.ps1」で生成された aspath-theme.zip です。古いZIPを上げると、直したはずの内容が巻き戻ります。", "warn");
  s.addNotes("有効化を押しても壊れないが、押す必要がないことを伝える。");
}

/* ══════════ 7 固定ページを直す ══════════ */
{
  const s = P.addSlide();
  head(s, "固定ページの文章を直す", "管理画面からは直せません。パソコンでの作業になります", { chapter: "A" });
  const flow = [
    ["①", "Pull origin", "GitHub Desktop"],
    ["②", "HTMLを直す", "about.html など"],
    ["③", "テーマを作る", ".ps1 を実行"],
    ["④", "ZIPを上げる", "外観 → テーマ"],
    ["⑤", "キャッシュ消す", "Purge Cache"],
    ["⑥", "Push origin", "GitHub Desktop"],
  ];
  flow.forEach(([n, t, d], i) => {
    const x = 0.65 + i * 2.06;
    s.addShape(P.ShapeType.roundRect, { x, y: 1.7, w: 1.78, h: 1.5, rectRadius: 0.1, fill: { color: PAPER }, line: { color: "E2D5BE", width: 1 } });
    s.addText(n, { x: x + 0.1, y: 1.85, w: 1.58, h: 0.4, align: "center", fontSize: 19, bold: true, color: SUND, fontFace: F, isTextBox: true, margin: 0 });
    s.addText(t, { x: x + 0.08, y: 2.3, w: 1.62, h: 0.35, align: "center", fontSize: 12.5, bold: true, color: NAVY, fontFace: F, isTextBox: true, margin: 0 });
    s.addText(d, { x: x + 0.08, y: 2.68, w: 1.62, h: 0.4, align: "center", fontSize: 10.5, color: MUTED, fontFace: F, isTextBox: true, margin: 0 });
  });
  box(s, 0.65, 3.5, 5.9, 1.6, "①のPullを忘れると、あとで衝突します",
    "他の人が先に直していると、同じ場所を書き換えてしまいます。作業前に必ずPullしてください。", "warn");
  box(s, 6.72, 3.5, 5.9, 1.6, "文章が検索で見つからないとき",
    "HTMLの中では途中にタグが挟まっています。文章全部ではなく、10〜15文字だけで検索してください。", "info");
  box(s, 0.65, 5.35, 11.95, 1.35, "「ASPATHについて」だけは、管理画面から直せます",
    "このページだけ本文をWordPress側に移してあります。手順は別冊『★山口様向け_ASPATHについて_文章の直し方』をご覧ください。", "ok");
  s.addNotes("道Bの全体像。詳細はサイト更新マニュアル側にある。");
}

/* ══════════ 8 キャッシュ ══════════ */
{
  const s = P.addSlide();
  head(s, "直したのに変わらないとき", "原因はほぼキャッシュです。3か所を順に消してください", { chapter: "A" });
  const layers = [
    ["1", "サイトのキャッシュ", "Super Page Cache →\n【Purge Cache】", "いちばん多い原因"],
    ["2", "ブラウザのキャッシュ", "Ctrl を押しながら F5", "自分だけ古い場合"],
    ["3", "画像のキャッシュ", "1年間キャッシュされます。\n差し替えは幸喜が対応", "画像だけ古い場合"],
  ];
  layers.forEach(([n, t, how, when], i) => {
    const x = 0.65 + i * 4.05;
    s.addShape(P.ShapeType.roundRect, { x, y: 1.7, w: 3.75, h: 2.9, rectRadius: 0.12, fill: { color: WHITE }, line: { color: "DCE6E8", width: 1.2 } });
    s.addShape(P.ShapeType.ellipse, { x: x + 1.55, y: 1.95, w: 0.65, h: 0.65, fill: { color: NAVY } });
    s.addText(n, { x: x + 1.55, y: 1.95, w: 0.65, h: 0.65, align: "center", valign: "middle", fontSize: 22, bold: true, color: WHITE, fontFace: F, isTextBox: true, margin: 0 });
    s.addText(t, { x: x + 0.15, y: 2.75, w: 3.45, h: 0.4, align: "center", fontSize: 15, bold: true, color: NAVY, fontFace: F, isTextBox: true, margin: 0 });
    s.addText(how, { x: x + 0.15, y: 3.2, w: 3.45, h: 0.85, align: "center", fontSize: 12, color: INK, fontFace: F, isTextBox: true, margin: 0, lineSpacingMultiple: 1.2 });
    s.addText(when, { x: x + 0.15, y: 4.12, w: 3.45, h: 0.35, align: "center", fontSize: 11, color: MUTED, fontFace: F, isTextBox: true, margin: 0 });
  });
  // 画像は 1568x764（比率2.05）。幅5.0inなら高さ2.44in で 4.75+2.44=7.19in に収まる
  pic(s, "06_キャッシュ削除.jpg", 0.65, 4.75, 5.0);
  box(s, 5.95, 4.75, 6.67, 1.15, "5分待ってから、もう一度",
    "消した直後は、まだ古い画面が出ることがあります。5分ほど置いて開き直してください。", "info");
  box(s, 5.95, 6.04, 6.67, 1.15, "それでも変わらなければ、ご連絡ください",
    "キャッシュ以外の原因のことがあります。無理に触らず、そのままお伝えください。", "warn");
  s.addNotes("キャッシュはいちばん多い相談。3層あることを図で理解してもらう。");
}

/* ══════════ 9 B章 扉 ══════════ */
{
  const s = P.addSlide();
  chapterCover(s, "B", "やっておいて損はないこと", [
    "検索結果に出る説明文を、自分で直す",
    "Search Console で「見に来たか」を確かめる",
    "アナリティクスで見る数字は3つだけ",
    "コメントスパムへの備え",
    "今回の案件で実際に起きた不具合と、その予防",
  ]);
  pageNo++;
  s.addNotes("すぐ効くものではないが、続けると差が出る章。");
}

/* ══════════ 10 説明文を直す ══════════ */
{
  const s = P.addSlide();
  head(s, "検索結果に出る説明文を、自分で直す", "SureRank というプラグインで、ページごとに設定できます", { chapter: "B" });
  steps(s, 0.65, 1.7, 6.0, [
    { t: "直したいページの編集画面を開く", d: "" },
    { t: "上のツールバーの「SureRank」を押す", d: "右側にパネルが開きます" },
    { t: "Search Engine Description を書き換える", d: "文字数が右上に出ます" },
    { t: "パネル下の「Save」", d: "「Data updated」と出れば成功" },
    { t: "キャッシュを消す", d: "Purge Cache" },
  ], 0.74, 13.5);
  box(s, 6.85, 1.7, 5.77, 2.35, "書くときのコツ",
    "全角60〜160字。頭の30字で内容が分かるように。「鹿児島」「パーキンソン病」を入れる。記号の多用は避ける。", "ok");
  box(s, 6.85, 4.25, 5.77, 2.45, "短すぎると、勝手に決められます",
    "説明文が空だと、Googleが本文の冒頭を拾って表示します。かつて『「遠くて通えない…」』の10文字だけが出ていたページがありました。自分で書けば、そうなりません。", "warn");
  box(s, 0.65, 5.6, 6.0, 1.1, "AIに書かせるのがいちばん早いです",
    "C章に、そのまま貼って使えるプロンプトを載せています。", "info");
  s.addNotes("実際に1ページ書き換えてもらう。C章のプロンプトと繋げる。");
}

/* ══════════ 11 Search Console ══════════ */
{
  const s = P.addSlide();
  head(s, "Search Console で「見に来たか」を確かめる", "反映されないとき、原因がこちら側かGoogle側かを切り分けられます", { chapter: "B" });
  steps(s, 0.65, 1.7, 6.0, [
    { t: "search.google.com/search-console を開く", d: "" },
    { t: "上の窓にURLを入れてEnter", d: "「URL検査」になります" },
    { t: "「前回のクロール」の日時を見る", d: "ここが最重要です" },
    { t: "「公開URLをテスト」を押す", d: "今のページをその場で読ませます" },
  ], 0.74, 13.5);
  s.addShape(P.ShapeType.roundRect, { x: 6.85, y: 1.7, w: 5.77, h: 2.1, rectRadius: 0.12, fill: { color: PAPER }, line: { color: "E2D5BE", width: 1 } });
  s.addText("「前回のクロール」の読み方", { x: 7.1, y: 1.88, w: 5.3, h: 0.35, fontSize: 14, bold: true, color: NAVY, fontFace: F, isTextBox: true, margin: 0 });
  s.addText([
    { text: "直した日より前 → Googleがまだ来ていないだけ。設定は無関係", options: { bullet: true, breakLine: true } },
    { text: "直した日より後なのに古い → 調査が必要。ご連絡ください", options: { bullet: true } },
  ], { x: 7.1, y: 2.3, w: 5.3, h: 1.3, fontSize: 12, color: INK, fontFace: F, isTextBox: true, margin: 0, paraSpaceAfter: 6 });
  box(s, 6.85, 4.0, 5.77, 1.5, "反映を早めたいとき",
    "「インデックス登録をリクエスト」を押します。1日の上限があるので、大事なページから。", "ok");
  box(s, 0.65, 5.6, 11.97, 1.1, "検索窓だけで進捗を見る方法もあります",
    "Googleで  site:aspath-life.com  と検索すると、登録されているページの一覧が出ます。古い表記が減っていれば順調です。", "info");
  s.addNotes("反映の遅さは必ず相談になる。切り分け方を渡しておく。");
}

/* ══════════ 12 アナリティクス ══════════ */
{
  const s = P.addSlide();
  head(s, "見る数字は、3つだけで足ります", "全部見ようとすると続きません", { chapter: "B" });
  const kpi = [
    ["ユーザー数", "何人が来たか", "集客 →\nユーザー獲得", "先月と比べて増えているか"],
    ["表示回数", "どのページが読まれたか", "エンゲージメント →\nページとスクリーン", "プランと料金が多い＝検討中の方が多い"],
    ["クリック数", "どんな言葉で検索して来たか", "Search Console →\n検索結果のパフォーマンス", "次に書く記事のヒントになります"],
  ];
  kpi.forEach(([t, what, where, why], i) => {
    const x = 0.65 + i * 4.05;
    s.addShape(P.ShapeType.roundRect, { x, y: 1.7, w: 3.75, h: 3.75, rectRadius: 0.12, fill: { color: WHITE }, line: { color: "DCE6E8", width: 1.2 } });
    s.addText(t, { x: x + 0.2, y: 1.95, w: 3.35, h: 0.5, align: "center", fontSize: 19, bold: true, color: SUND, fontFace: F, isTextBox: true, margin: 0 });
    s.addText(what, { x: x + 0.2, y: 2.5, w: 3.35, h: 0.4, align: "center", fontSize: 13, bold: true, color: NAVY, fontFace: F, isTextBox: true, margin: 0 });
    s.addShape(P.ShapeType.roundRect, { x: x + 0.35, y: 3.0, w: 3.05, h: 0.9, rectRadius: 0.08, fill: { color: CODEBG } });
    s.addText(where, { x: x + 0.4, y: 3.08, w: 2.95, h: 0.75, align: "center", fontSize: 10.5, color: MUTED, fontFace: F, isTextBox: true, margin: 0, lineSpacingMultiple: 1.2 });
    s.addText(why, { x: x + 0.2, y: 4.05, w: 3.35, h: 1.2, align: "center", fontSize: 11.5, color: INK, fontFace: F, isTextBox: true, margin: 0, lineSpacingMultiple: 1.25 });
  });
  box(s, 0.65, 5.7, 11.95, 1.0, "スマホアプリが便利です",
    "「Google アナリティクス」アプリを入れておくと、移動中でも訪問者数を確認できます。", "ok");
  s.addNotes("3指標だけ。権限付与が済んでいない場合は先にそれ。");
}

/* ══════════ 13 スパム対策 ══════════ */
{
  const s = P.addSlide();
  head(s, "コメントスパムへの備え", "放置しても表示されませんが、溜まると見落としの原因になります", { chapter: "B" });
  pic(s, "03_コメント.jpg", 0.65, 1.6, 6.9);
  s.addText("見分け方（基本編のおさらい）", { x: 7.75, y: 1.65, w: 4.9, h: 0.35, fontSize: 14, bold: true, color: NAVY, fontFace: F, isTextBox: true, margin: 0 });
  s.addText([
    { text: "英語で書かれている", options: { bullet: true, breakLine: true } },
    { text: "知らないサイトへのリンクがある", options: { bullet: true, breakLine: true } },
    { text: "記事の内容と噛み合っていない", options: { bullet: true, breakLine: true } },
    { text: "中身のない称賛だけ", options: { bullet: true } },
  ], { x: 7.75, y: 2.05, w: 4.9, h: 1.5, fontSize: 12.5, color: INK, fontFace: F, isTextBox: true, margin: 0, paraSpaceAfter: 5 });
  box(s, 7.75, 3.7, 4.9, 1.75, "減らす設定もあります",
    "設定 → ディスカッション で「〇日より古い記事のコメントを閉じる」を有効にすると、古い記事が狙われにくくなります。", "ok");
  box(s, 0.65, 5.65, 11.97, 1.05, "サンプル記事は削除をおすすめします",
    "WordPress初期の練習用記事（英語の題名のもの）が下書きで残っています。スパムの標的になりやすいため、削除のご判断をお願いします。", "warn");
  s.addNotes("実際に届いた2件はカジノ系スパム。標的はサンプル記事だった。");
}

/* ══════════ 14 起きた不具合と予防 ══════════ */
{
  const s = P.addSlide();
  head(s, "実際に起きた不具合と、その予防", "同じことが起きたとき、思い出せるように残します", { chapter: "B" });
  const cases = [
    ["画像1枚ごとに、中身の無いページが作られていた", "最大156ページ。Googleのサイトリンクに「ASPATHロゴ」として拾われていた", "テーマ側で自動転送するようにしました。対応済み"],
    ["存在しないページの設定が、管理画面を指していた", "404ページのcanonicalがwp-adminのURLになっていた", "テーマ側で打ち消しました。対応済み"],
    ["表示していない質問が、Googleへの申告に入っていた", "FAQの構造化データ6問中5問が、ページ上に存在しなかった", "実データから自動生成に変更。ズレなくなりました"],
    ["同じ内容のページが2つあった", "見出し4つが一致。導線のない方が検索に出ていた", "301転送で1本に統合しました"],
  ];
  let y = 1.58;
  cases.forEach(([t, d, fix], i) => {
    s.addShape(P.ShapeType.roundRect, { x: 0.65, y, w: 11.97, h: 1.12, rectRadius: 0.1, fill: { color: i % 2 ? PAPER : "F7FAFA" }, line: { color: "DCE6E8", width: 1 } });
    s.addText(t, { x: 0.9, y: y + 0.11, w: 6.6, h: 0.34, fontSize: 13, bold: true, color: NAVY, fontFace: F, isTextBox: true, margin: 0 });
    s.addText(d, { x: 0.9, y: y + 0.47, w: 6.6, h: 0.56, fontSize: 11, color: MUTED, fontFace: F, isTextBox: true, margin: 0, lineSpacingMultiple: 1.15 });
    s.addShape(P.ShapeType.roundRect, { x: 7.75, y: y + 0.2, w: 4.6, h: 0.72, rectRadius: 0.08, fill: { color: "EDF6EE" } });
    s.addText(fix, { x: 7.9, y: y + 0.25, w: 4.3, h: 0.62, fontSize: 11, color: GREEN, fontFace: F, isTextBox: true, margin: 0, lineSpacingMultiple: 1.15 });
    y += 1.24;
  });
  box(s, 0.65, 6.52, 11.97, 0.8, "いずれも対応済みです",
    "同じ症状が出たら、この資料の場所をお伝えください。原因の切り分けから始められます。", "info");
  s.addNotes("再発時に原因を思い出せるように。全て対応済みである点を強調。");
}

/* ══════════ 15 AI活用は別冊へ（2026-09-04 分離） ══════════ */
{
  const s = P.addSlide();
  head(s, null, "AIの使い方は、別冊にまとめました", "分量が増えたため、独立した1冊にしています");
  s.addShape(P.ShapeType.roundRect, { x: 1.6, y: 1.9, w: 10.1, h: 2.5, rectRadius: 0.16,
    fill: { color: PAPER }, line: { color: SUND, width: 1.5 } });
  s.addShape(P.ShapeType.roundRect, { x: 2.0, y: 2.25, w: 2.4, h: 0.6, rectRadius: 0.3, fill: { color: SUND } });
  s.addText("AI活用編", { x: 2.0, y: 2.25, w: 2.4, h: 0.6, align: "center", valign: "middle",
    fontSize: 15, bold: true, color: WHITE, fontFace: F, isTextBox: true, margin: 0 });
  s.addText("★ASPATH_サイト運用マニュアル_AI活用編", { x: 2.0, y: 3.0, w: 9.3, h: 0.45,
    fontSize: 18, bold: true, color: NAVY, fontFace: F, isTextBox: true, margin: 0 });
  s.addText("そのまま貼って使えるプロンプトを8種類。記事のネタ出し・構成案・下書き・検索用の説明文・題名の短縮・お客様への返信文・点検結果の読み取り・イラスト生成。",
    { x: 2.0, y: 3.5, w: 9.3, h: 0.75, fontSize: 12.5, color: INK, fontFace: F, isTextBox: true, margin: 0, lineSpacingMultiple: 1.25 });

  box(s, 1.6, 4.7, 4.95, 1.9, "どのAIでも使えます",
    "ChatGPT・Claude・Gemini、どれをお使いでも同じ書き方で動きます。幸喜はClaudeを使っています。", "info");
  box(s, 6.75, 4.7, 4.95, 1.9, "3つの約束だけ、先に覚えてください",
    "個人情報を貼らない／医学的な内容は必ず確認する／そのまま公開しない。詳しくは別冊に書いています。", "warn");
  s.addNotes("応用編からAI章を分離した。別冊を渡していることを必ず伝える。");
}

/* ══════════ 25 まとめ ══════════ */
{
  const s = P.addSlide();
  s.background = { color: NAVY };
  s.addText("応用編のまとめ", { x: 0.9, y: 0.85, w: 11.5, h: 0.75, fontSize: 32, bold: true, color: WHITE, fontFace: F, isTextBox: true, margin: 0 });
  const sum = [
    ["A", "壊さないために", "変えてはいけない4つ\n作業前のバックアップ\n困ったらキャッシュ"],
    ["B", "続けると効くこと", "説明文は自分で書く\n数字は3つだけ見る\n進捗は site: 検索で"],
    ["C", "AIの使い方", "別冊「AI活用編」に\nプロンプト8種を\nまとめています"],
  ];
  sum.forEach(([n, t, d], i) => {
    const x = 0.9 + i * 4.05;
    s.addShape(P.ShapeType.roundRect, { x, y: 1.85, w: 3.7, h: 3.5, rectRadius: 0.14, fill: { color: DEEP } });
    s.addShape(P.ShapeType.roundRect, { x: x + 1.48, y: 2.15, w: 0.75, h: 0.75, rectRadius: 0.38, fill: { color: SUN } });
    s.addText(n, { x: x + 1.48, y: 2.15, w: 0.75, h: 0.75, align: "center", valign: "middle", fontSize: 28, bold: true, color: WHITE, fontFace: F, isTextBox: true, margin: 0 });
    s.addText(t, { x: x + 0.2, y: 3.05, w: 3.3, h: 0.45, align: "center", fontSize: 16, bold: true, color: WHITE, fontFace: F, isTextBox: true, margin: 0 });
    s.addText(d, { x: x + 0.2, y: 3.6, w: 3.3, h: 1.6, align: "center", fontSize: 12.5, color: "AFC8CE", fontFace: F, isTextBox: true, margin: 0, lineSpacingMultiple: 1.35 });
  });
  s.addText("分からなくなったら、そのままご連絡ください。元に戻せないことは、ほとんどありません。", {
    x: 0.9, y: 5.75, w: 11.5, h: 0.5, fontSize: 14, color: "CFE0E4", fontFace: F, isTextBox: true, margin: 0,
  });
  s.addText("基本編（日々の更新）／サイト更新マニュアル（全体像）／ページの直し方（やさしい版）もあわせてご覧ください。", {
    x: 0.9, y: 6.35, w: 11.5, h: 0.45, fontSize: 12.5, color: "9FBAC1", fontFace: F, isTextBox: true, margin: 0,
  });
  s.addNotes("最後に、いつでも聞いてよいことを伝えて終了。");
}

P.writeFile({ fileName: "/tmp/deck5/ASPATH_サイト運用マニュアル_応用編.pptx" })
 .then((f) => console.log("作成:", f));
