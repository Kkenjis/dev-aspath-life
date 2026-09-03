// ASPATH 総合版 ── 第4部〜第7部（運用／壊さない触り方／点検と保守／AI活用）
// 既存4冊の本体を、共通の骨組みに合わせて取り込んだもの。
// 単体では出力しない。総合版pptxを作る.js から読み込まれる。
const path = require("path");
const { C, F, MONO, LV } = require("./総合版_lib.js");

const HANDOFF = "/sessions/compassionate-sweet-heisenberg/mnt/dev-aspath-life-main/_wp移行素材/★引継ぎ資料/";
const IMG  = (n) => path.join(HANDOFF, "レクチャー素材", n);
const CROP = (n) => path.join(HANDOFF, "レクチャー素材", "crop", n);
const IMG2 = HANDOFF + "画像/";

module.exports = function build(P, B){

// ── 旧コードとの互換シム ──────────────────────────
const NAVY=C.NAVY, DEEP=C.DEEP, SUN=C.SUN, SUND=C.SUND, PAPER=C.PAPER,
      WHITE=C.WHITE, MUTED=C.MUTED, INK=C.INK, RED=C.RED, GREEN=C.GREEN,
      PURPLE=C.PURPLE, CODEBG=C.CODEBG;

const p = P;            // 基本編は小文字 p
const FONT = F, MONOF = MONO;   // 基本編は FONT という名前を使っている
const LINE = C.LINE, PAPERLINE = C.PAPERLINE;   // 基本編は小文字 p で pptx インスタンスを参照している
function head(s, t, sub, opt){ B.head(s, t, sub, opt||{}); }
function heading(s, num, text){
  // 基本編の heading(s, num, text) → 見出しに番号丸を付ける
  if(num!==null && num!==undefined){
    s.addShape(P.ShapeType.ellipse,{x:0.6,y:0.36,w:0.52,h:0.52,fill:{color:SUN}});
    s.addText(String(num),{x:0.6,y:0.36,w:0.52,h:0.52,align:"center",valign:"middle",
      fontSize:19,bold:true,color:WHITE,fontFace:F,isTextBox:true,margin:0});
  }
  B.page++;
  s.addText(text,{x:num!==null?1.32:0.6,y:0.3,w:9.0,h:0.62,fontSize:26,bold:true,
    color:NAVY,fontFace:F,valign:"middle",isTextBox:true,margin:0});
  const v=LV.easy;
  s.addShape(P.ShapeType.roundRect,{x:10.45,y:0.36,w:2.17,h:0.42,rectRadius:0.21,
    fill:{color:v.bg},line:{color:v.color,width:1.2}});
  s.addText(v.label,{x:10.45,y:0.36,w:2.17,h:0.42,align:"center",valign:"middle",
    fontSize:11.5,bold:true,color:v.color,fontFace:F,isTextBox:true,margin:0});
  if(B.part) s.addText(B.part,{x:0.6,y:6.95,w:6,h:0.28,fontSize:10,color:"A8B4B8",fontFace:F,isTextBox:true,margin:0});
  s.addText(String(B.page),{x:12.45,y:6.95,w:0.45,h:0.28,align:"right",fontSize:10.5,color:"A8B4B8",fontFace:F,isTextBox:true,margin:0});
}
function box(s,x,y,w,h,t,b,tone){ B.box(s,x,y,w,h,t,b,tone); }
function note(s,x,y,w,h,t,b,tone){ B.box(s,x,y,w,h,t,b,tone); }
function steps(s,x,y,w,items,gap,size){ B.steps(s,x,y,w,items,gap,size); }
function prompt(s,x,y,w,h,label,text,fs){ B.code(s,x,y,w,h,label,text,fs); }
function code(s,x,y,w,h,label,text,fs){ B.code(s,x,y,w,h,label,text,fs); }
function pic(s,f,x,y,w,ratio){
  s.addImage({path:IMG2+f,x,y,w,h:w*(ratio||764/1568)});
  s.addShape(P.ShapeType.rect,{x,y,w,h:w*(ratio||764/1568),
    fill:{color:WHITE,transparency:100},line:{color:"C9D5D9",width:1}});
}
function shot(s,file,bx,imgW,imgH,callouts,useCrop){
  s.addImage({path:(useCrop?CROP:IMG)(file),x:bx.x,y:bx.y,w:bx.w,h:bx.h});
  s.addShape(P.ShapeType.rect,{x:bx.x,y:bx.y,w:bx.w,h:bx.h,
    fill:{color:WHITE,transparency:100},line:{color:"C9D5D9",width:1}});
  (callouts||[]).forEach(c=>{
    const cx=bx.x+(c.px/imgW)*bx.w, cy=bx.y+(c.py/imgH)*bx.h, d=0.42;
    s.addShape(P.ShapeType.ellipse,{x:cx-d/2,y:cy-d/2,w:d,h:d,fill:{color:SUN},line:{color:WHITE,width:2},
      shadow:{type:"outer",angle:90,offset:1,blur:3,color:"000000",opacity:0.35}});
    s.addText(String(c.n),{x:cx-d/2,y:cy-d/2,w:d,h:d,align:"center",valign:"middle",
      fontSize:14,bold:true,color:WHITE,fontFace:F,isTextBox:true,margin:0});
  });
}

/* ══════════════ 第4部 ══════════════ */
{ const s=P.addSlide();
  B.partCover(s,"4","日々の運用",[
    "お知らせを出す（カテゴリと先頭固定）",
    "初回体験の申込を見る",
    "写真を差し替える",
    "コメントに対応する（スパムの見分け方）",
    "困ったときの対処"
  ],C.SUN);
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
  note(s, 0.62, 5.7, 12.05, 0.95,
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
/* ══════════════ 第5部 ══════════════ */
{ const s=P.addSlide();
  B.partCover(s,"5","壊さない触り方",[
    "絶対に変えてはいけない4つ",
    "作業前のバックアップ",
    "テーマの入れ替え",
    "固定ページの文章を直す",
    "検索対策と、数字の見方"
  ],C.SUND);
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
/* ══════════════ 第6部 ══════════════ */
{ const s=P.addSlide();
  B.partCover(s,"6","点検と保守",[
    "点検は5分で終わります",
    "スクリプトの貼り方",
    "点検18項目",
    "結果の読み方",
    "自分で直せるもの／連絡するもの",
    "いつ点検するか"
  ],C.RED);
}
/* ══════ 3 点検の全体像 ══════ */
{
  const s=P.addSlide();
  head(s,"点検は、5分で終わります","1つずつ手で見る必要はありません。まとめて調べる道具があります");
  steps(s,0.65,1.7,6.0,[
    {t:"Chromeでサイトを開く",d:"https://aspath-life.com/"},
    {t:"F12 キーを押す",d:"開発者ツールが開きます"},
    {t:"「Console」タブを選ぶ",d:"上のほうに並んでいます"},
    {t:"点検スクリプトを貼って Enter",d:"ファイルの中身を全部コピーします"},
    {t:"1〜2分待つ",d:"結果が表になって出ます"},
  ],0.8,14);
  box(s,6.85,1.7,5.77,2.0,"使うファイル",
    "ASPATHサイト点検スクリプト.js\n引継ぎ資料フォルダに入っています。メモ帳で開いて、全部コピーしてください。","info");
  box(s,6.85,3.9,5.77,1.5,"サイトには何も書き込みません",
    "読み取るだけの道具です。押し間違えてサイトが壊れることはありません。","ok");
  box(s,6.85,5.6,5.77,1.1,"ログインしたままで大丈夫です",
    "お客様と同じ条件で読み込むよう作ってあります。","ok");
  s.addNotes("F12→Console→貼る。これだけ。実際に一度やってもらう。");
}

/* ══════ 4 スクリプトの貼り方（画面イメージ） ══════ */
{
  const s=P.addSlide();
  head(s,"貼る場所を間違えないでください","「Console」タブです。ほかのタブでは動きません");
  // 開発者ツールの模式図
  s.addShape(P.ShapeType.roundRect,{x:0.65,y:1.6,w:7.4,h:4.4,rectRadius:0.1,fill:{color:"1E1E1E"}});
  const tabs=["Elements","Console","Sources","Network","Performance"];
  tabs.forEach((t,i)=>{
    const x=0.9+i*1.42, on=(t==="Console");
    s.addShape(P.ShapeType.roundRect,{x,y:1.8,w:1.32,h:0.36,rectRadius:0.06,
      fill:{color:on?"264653":"2D2D2D"},line:on?{color:SUN,width:1.5}:{color:"3A3A3A",width:1}});
    s.addText(t,{x,y:1.8,w:1.32,h:0.36,align:"center",valign:"middle",
      fontSize:9.5,bold:on,color:on?SUN:"9A9A9A",fontFace:F,isTextBox:true,margin:0});
  });
  // プロンプト記号は全角の「＞」にする（半角>はLibreOfficeで消える）
  s.addText("＞",{x:1.35,y:2.45,w:0.36,h:0.3,fontSize:12,bold:true,color:SUN,fontFace:MONO,isTextBox:true,margin:0});
  s.addText("ここにスクリプトを貼り付けて、Enter",{x:1.75,y:2.45,w:6.0,h:0.3,fontSize:11.5,color:"C8C8C8",fontFace:MONO,isTextBox:true,margin:0});
  s.addText("（1〜2分後、結果がここに出ます）",{x:1.35,y:3.0,w:6.4,h:0.3,fontSize:10.5,color:"6E6E6E",fontFace:MONO,isTextBox:true,margin:0});
  s.addText("○ robots.txt  wp-adminのみ禁止\n○ サイトマップ  23件\n○ 404ページ  404かつnoindex\n× /taikannunndou/ … 題名69字",
    {x:1.35,y:3.5,w:6.4,h:1.5,fontSize:10.5,color:"A8D8AC",fontFace:MONO,isTextBox:true,margin:0,lineSpacingMultiple:1.3});
  // ①はConsoleタブの真下、②は入力行の左に置き、文字を隠さない
  s.addShape(P.ShapeType.ellipse,{x:3.5,y:1.79,w:0.38,h:0.38,fill:{color:SUN},line:{color:WHITE,width:2}});
  s.addText("1",{x:3.5,y:1.79,w:0.38,h:0.38,align:"center",valign:"middle",fontSize:12.5,bold:true,color:WHITE,fontFace:F,isTextBox:true,margin:0});
  s.addShape(P.ShapeType.ellipse,{x:0.85,y:2.4,w:0.4,h:0.4,fill:{color:SUN},line:{color:WHITE,width:2}});
  s.addText("2",{x:0.85,y:2.4,w:0.4,h:0.4,align:"center",valign:"middle",fontSize:13,bold:true,color:WHITE,fontFace:F,isTextBox:true,margin:0});

  box(s,8.35,1.6,4.27,1.6,"① Console タブ",
    "ここを選んでいないと、貼っても何も起きません。","info");
  box(s,8.35,3.35,4.27,1.6,"② 入力欄に貼る",
    "「＞」の右側です。1行目から最後まで、全部貼ってください。途中で切れると動きません。","warn");
  box(s,8.35,5.1,4.27,1.7,"貼れないと言われたら",
    "「許可する」と出たら、案内どおり allow pasting と打ってからもう一度貼ってください。","warn");
  s.addNotes("初回だけ Chrome が貼り付けをブロックする。allow pasting の入力が必要。");
}

/* ══════ 5-9 点検18項目 ══════ */
const groups = [
  { t:"【1】ページごとに調べること", sub:"18ページを1つずつ、9項目で調べます",
    items:[
      ["ページが開けるか","状態が200であること。404や500なら公開事故です"],
      ["題名の長さ","60字以内。超えるとGoogleで「…」と切られます"],
      ["説明文の長さ","60〜160字。短いとGoogleが本文から勝手に拾います"],
      ["検索に載せる設定","noindexが意図せず付いていないか。逆に、外したくないページで外れていないか"],
      ["canonical","正式なURLの指定。無いと同じ内容が複数URLで評価されます"],
      ["大見出し（H1）の数","ちょうど1つ。0個や2個は減点対象です"],
      ["OGP画像","LINEやSNSに貼ったときのサムネイル"],
      ["X-Robots-Tag","HTMLに出ない検索除外の指定。付いていたら異常です"],
      ["古い言葉の残存","「脳卒中専門」「ASPATH・アスパス：」が残っていないか"],
    ], note:"9項目。1つでも×があれば、そのページ名と理由が出力されます。" },
  { t:"【2】サイト全体の設定","sub":"サイト全体で1回だけ調べます",
    items:[
      ["robots.txt","検索エンジンへの案内文。wp-adminだけ禁止が正しい状態です"],
      ["サイトマップの宣言","robots.txt にサイトマップの場所が書かれているか"],
      ["サイトマップの件数","現在23件。急に増減したら何かが起きています"],
      ["載ってはいけないURL","下書きにしたページ、noindexにしたページ、タグ一覧が混ざっていないか"],
    ], note:"サイトマップに載ってはいけないURLが入ると、Search Consoleに警告が出る。" },
  { t:"【3】転送と404","sub":"消したページ・移したページが、正しく処理されているか",
    items:[
      ["旧URLの転送","/for-parkinsons-disease/ が転送されるか。旧URLの評価を引き継ぐ仕組みです"],
      ["添付ファイルページ","画像1枚ごとのページが転送されるか。156ページが量産されていた箇所です"],
      ["下書きページ","/for-stroke/ が404になっているか。公開に戻っていたら事故です"],
      ["404ページの設定","404を返し、かつnoindexであること"],
      ["404のcanonical","出ていないこと。かつて管理画面のURLを指していました"],
    ], note:"301転送は評価を引き継ぐ。削除だと捨てることになる。" },
  { t:"【4】構造化データ","sub":"Googleへの申告内容が、実際の画面と合っているか",
    items:[
      ["HealthClub","業種・住所・料金の申告。トップページに出ています"],
      ["FAQPage","よくある質問の申告。トップページに6問"],
      ["画面との一致","申告した質問が、実際にページ上に表示されているか"],
      ["申告内の画像","指定した画像が実在するか。404を指していたことがあります"],
    ], note:"画面に無い内容の申告は規約違反。ここは特に重要。" },
  { t:"【5】画像とキャッシュ","sub":"見た目に直結する部分です",
    items:[
      ["画像の404","トップページの画像が全部表示できるか"],
      ["キャッシュの状態","HIT＝効いている／BYPASS＝効いていない。管理者ログイン中は常にBYPASSです"],
    ], note:"画像404は見ればわかるが、下の方は見落としやすい。" },
];

groups.forEach(g=>{
  const s=P.addSlide();
  head(s,g.t,g.sub);
  const n=g.items.length;
  const h = n>6 ? 0.52 : (n>4 ? 0.78 : 1.0);
  let y=1.6;
  g.items.forEach(([t,d],i)=>{
    s.addShape(P.ShapeType.roundRect,{x:0.65,y,w:11.97,h:h-0.06,rectRadius:0.08,
      fill:{color:i%2?PAPER:"F7FAFA"},line:{color:"DCE6E8",width:1}});
    s.addShape(P.ShapeType.ellipse,{x:0.88,y:y+(h-0.06)/2-0.15,w:0.3,h:0.3,fill:{color:GREEN}});
    s.addText("✓",{x:0.88,y:y+(h-0.06)/2-0.15,w:0.3,h:0.3,align:"center",valign:"middle",
      fontSize:11,bold:true,color:WHITE,fontFace:F,isTextBox:true,margin:0});
    s.addText(t,{x:1.35,y:y+(h-0.06)/2-0.18,w:3.5,h:0.36,fontSize:n>6?12.5:13.5,bold:true,
      color:NAVY,fontFace:F,isTextBox:true,margin:0,valign:"middle"});
    s.addText(d,{x:5.0,y:y+0.06,w:7.4,h:h-0.18,fontSize:n>6?11:12,color:INK,
      fontFace:F,isTextBox:true,margin:0,valign:"middle",lineSpacingMultiple:1.15});
    y+=h;
  });
  box(s,0.65,y+0.15,11.97,6.95-y-0.15>0.7?6.95-y-0.15:0.7,"補足",g.note,"info");
  s.addNotes(g.note);
});

/* ══════ 10 結果の読み方 ══════ */
{
  const s=P.addSlide();
  head(s,"結果の読み方","○ と × を見るだけです");
  code(s,0.65,1.7,7.4,2.3,"問題がないとき",
`○ robots.txt  wp-adminのみ禁止
○ サイトマップ  23件
○ 除外すべきURLは含まれていない
○ 404ページ  404かつnoindex
○ FAQは画面の質問と全問一致

 問題は見つかりませんでした `);
  code(s,0.65,4.25,7.4,2.4,"問題があったとき",
`× /taikannunndou/ … 題名69字（60字以内に）
× /shinsenaspath/ … 説明34字（60〜160字に）

 3件の問題が見つかりました
  1. /taikannunndou/ … 題名69字
  2. /shinsenaspath/ … 説明34字

この一覧をコピーして、そのままご連絡ください。`);
  box(s,8.35,1.7,4.27,2.3,"○だけなら、何もしなくてよいです",
    "月に1回、これを確認するだけで十分です。","ok");
  box(s,8.35,4.25,4.27,2.4,"×が出たら",
    "最後に出る一覧をコピーして、そのままご連絡ください。原因の切り分けから対応します。ご自身で直せるものは、次のページにまとめています。","warn");
  s.addNotes("×が出ても慌てなくてよい。コピーして送れば済む。");
}

/* ══════ 11 自分で直せるもの ══════ */
{
  const s=P.addSlide();
  head(s,"×が出たとき、自分で直せるもの","この3つは管理画面から直せます");
  const fix=[
    ["題名が60字を超えている","SureRank →\nSearch Engine Title","ページを開き、上のSureRankアイコン →「Search Engine Title」に短い題名を入れて Save"],
    ["説明文が60字未満／160字超","SureRank →\nSearch Engine Description","同じパネルの説明文欄を書き換えて Save。文字数は右上に出ます"],
    ["noindexが意図せず付いている","SureRank →\nAdvanced","同じパネルの Advanced を開き、「No index」のチェックを外して Save"],
  ];
  let y=1.65;
  fix.forEach(([t,where,how])=>{
    s.addShape(P.ShapeType.roundRect,{x:0.65,y,w:11.97,h:1.5,rectRadius:0.1,fill:{color:"EDF6EE"},line:{color:GREEN,width:1}});
    s.addText(t,{x:0.95,y:y+0.18,w:4.3,h:0.6,fontSize:14,bold:true,color:NAVY,fontFace:F,isTextBox:true,margin:0,lineSpacingMultiple:1.2});
    s.addShape(P.ShapeType.roundRect,{x:5.4,y:y+0.28,w:2.5,h:0.9,rectRadius:0.08,fill:{color:WHITE}});
    s.addText(where,{x:5.5,y:y+0.34,w:2.3,h:0.78,align:"center",fontSize:11,color:GREEN,fontFace:MONO,isTextBox:true,margin:0,lineSpacingMultiple:1.2});
    s.addText(how,{x:8.1,y:y+0.24,w:4.3,h:1.0,fontSize:11.5,color:INK,fontFace:F,isTextBox:true,margin:0,lineSpacingMultiple:1.2});
    y+=1.62;
  });
  box(s,0.65,6.55,11.97,0.78,"直したら、キャッシュを消してから再点検してください",
    "Super Page Cache →【Purge Cache】→ 5分ほど待って、もう一度スクリプトを実行します。","warn");
  s.addNotes("この3つ以外は開発側に連絡でよい。");
}

/* ══════ 12 連絡が必要なもの ══════ */
{
  const s=P.addSlide();
  head(s,"×が出たとき、ご連絡いただきたいもの","無理に触らないでください");
  const call=[
    ["ページが開けない（状態404・500）","公開事故の可能性。すぐご連絡ください"],
    ["canonicalが無い／404に出ている","テーマ側の修正が外れた可能性があります"],
    ["H1が0個または2個以上","テーマまたは記事本文の構造の問題です"],
    ["サイトマップに載ってはいけないURLが混在","プラグイン設定が戻った可能性があります"],
    ["転送が効いていない","テーマZIPが古いものに戻った可能性があります"],
    ["FAQが画面の質問と一致しない","Googleの規約違反にあたります。至急ご連絡ください"],
    ["画像が404","テーマZIPのアップロード漏れ、または画像の削除です"],
  ];
  let y=1.58;
  call.forEach(([t,d],i)=>{
    s.addShape(P.ShapeType.roundRect,{x:0.65,y,w:11.97,h:0.6,rectRadius:0.08,
      fill:{color:i%2?"FBEDEC":"FDF5F4"},line:{color:"E8CDCA",width:1}});
    s.addText("×",{x:0.88,y:y+0.13,w:0.3,h:0.34,align:"center",valign:"middle",
      fontSize:14,bold:true,color:RED,fontFace:F,isTextBox:true,margin:0});
    s.addText(t,{x:1.3,y:y+0.12,w:5.2,h:0.36,fontSize:12,bold:true,color:NAVY,fontFace:F,isTextBox:true,margin:0,valign:"middle"});
    s.addText(d,{x:6.7,y:y+0.12,w:5.7,h:0.36,fontSize:11,color:INK,fontFace:F,isTextBox:true,margin:0,valign:"middle"});
    y+=0.68;
  });
  box(s,0.65,y+0.1,11.97,0.85,"連絡は、結果をコピーして貼るだけで十分です",
    "「点検で×が出ました」と書いて、出力された一覧をそのまま貼ってください。それだけで原因の見当がつきます。","info");
  s.addNotes("判断を求めない。コピーして送れば済む形にしておく。");
}

/* ══════ 13 いつ点検するか ══════ */
{
  const s=P.addSlide();
  head(s,"いつ点検するか","毎日やる必要はありません");
  const when=[
    ["月に1回","定期点検","何もしていなくても、プラグインの更新などで変わることがあります",GREEN],
    ["テーマZIPを\n上げたあと","反映の確認","入れ替えで前の修正が巻き戻ることがあります。いちばん重要なタイミングです",SUND],
    ["プラグインを\n更新したあと","影響の確認","SureRankやキャッシュのプラグインは、設定が初期化されることがあります",SUND],
    ["検索結果が\nおかしいとき","原因の切り分け","サイト側の問題か、Google側の問題かが分かります",NAVY],
  ];
  when.forEach(([w,t,d,c],i)=>{
    const x=0.65+i*3.04;
    s.addShape(P.ShapeType.roundRect,{x,y:1.7,w:2.8,h:3.9,rectRadius:0.12,fill:{color:PAPER},line:{color:"E2D5BE",width:1}});
    s.addShape(P.ShapeType.roundRect,{x:x+0.25,y:1.95,w:2.3,h:0.82,rectRadius:0.1,fill:{color:c}});
    s.addText(w,{x:x+0.3,y:1.98,w:2.2,h:0.76,align:"center",valign:"middle",fontSize:13,bold:true,
      color:WHITE,fontFace:F,isTextBox:true,margin:0,lineSpacingMultiple:1.15});
    s.addText(t,{x:x+0.15,y:2.95,w:2.5,h:0.4,align:"center",fontSize:14,bold:true,color:NAVY,fontFace:F,isTextBox:true,margin:0});
    s.addText(d,{x:x+0.15,y:3.45,w:2.5,h:2.0,align:"center",fontSize:11.5,color:MUTED,fontFace:F,isTextBox:true,margin:0,lineSpacingMultiple:1.3});
  });
  box(s,0.65,5.8,11.97,0.9,"カレンダーに「毎月1日：サイト点検」と入れておくのがおすすめです",
    "5分で終わります。続けることが、いちばんの予防になります。","ok");
  s.addNotes("月1回＋テーマ更新後。カレンダー登録まで一緒にやるとよい。");
}

/* ══════ 14 点検範囲を増やす ══════ */
{
  const s=P.addSlide();
  head(s,"記事が増えたら、点検範囲を広げてください","スクリプトの先頭に1行足すだけです");
  code(s,0.65,1.75,7.4,3.3,"ASPATHサイト点検スクリプト.js の先頭",
`/* ── 点検するページ ──
   ページを増やしたら、ここに1行足してください */
const PAGES = [
  '/', '/about/', '/services/', '/access/',
  '/contact/', '/faq/', '/column/',
  '/tokushoho/', '/privacy/', '/sitemap/',
  '/campaign/', '/taimentraining/',
  '/onlineaspath/', '/sukumiashitaisaku/',
  '/taikannunndou/', '/shinsenaspath/',
  '/undouwooboeruparkinson/', '/aspathkouen/',
  '/新しい記事のURL/',      ← ここに足す
];`, 10);
  steps(s,8.35,1.8,4.27,[
    {t:"記事のURLを確認する",d:"aspath-life.com/○○/ の ○○ の部分"},
    {t:"メモ帳でスクリプトを開く",d:""},
    {t:"PAGES の最後に1行足す",d:"前後の書き方をまねしてください"},
    {t:"上書き保存する",d:""},
  ],0.82,13);
  box(s,8.35,5.3,4.27,1.4,"書き方の注意",
    "前後を ' で囲み、行末に , を付けます。/ で始めて / で終わります。","warn");
  box(s,0.65,5.3,7.4,1.4,"分からなければ、そのままで結構です",
    "新しい記事を点検範囲に入れなくても、既存18ページの点検は問題なく動きます。ご連絡いただければ、こちらで足します。","info");
  s.addNotes("編集を強制しない。できなくても点検は回る。");
}
/* ══════════════ 第7部 ══════════════ */
{ const s=P.addSlide();
  B.partCover(s,"7","AIの活用",[
    "任せてよいこと・人が判断すること",
    "プロンプトの基本形",
    "そのまま使えるプロンプト8種",
    "AIを使うときの3つの約束"
  ],C.PURPLE);
}
/* ══════ 3 任せてよいこと・人が判断すること ══════ */
{
  const s=P.addSlide();
  head(s,"任せてよいこと・人が判断すること","線引きを先に決めておくと、安心して使えます");
  const ok=["記事のネタ出し（10個出させて選ぶ）","記事の構成案づくり","本文の下書き（そのまま出さない）",
            "検索用の説明文づくり","お客様への返信文のたたき台","長い文章を短くまとめる",
            "イラスト生成の指示文づくり","点検結果の用語を調べる"];
  const ng=["医学的な正しさの最終判断","「治る」「改善する」などの効果の断定",
            "お客様の個人情報を入れた相談","料金・営業時間などの事実確認",
            "そのまま公開する（必ず読み直す）","サイトの設定を直接変えること"];
  s.addShape(P.ShapeType.roundRect,{x:0.65,y:1.68,w:5.95,h:4.3,rectRadius:0.12,fill:{color:"EDF6EE"},line:{color:GREEN,width:1.2}});
  s.addText("任せてよいこと",{x:0.95,y:1.88,w:5.4,h:0.4,fontSize:16,bold:true,color:GREEN,fontFace:F,isTextBox:true,margin:0});
  s.addText(ok.map((t,i)=>({text:t,options:{bullet:true,breakLine:i<ok.length-1}})),
    {x:0.95,y:2.35,w:5.4,h:3.45,fontSize:12,color:INK,fontFace:F,isTextBox:true,margin:0,paraSpaceAfter:6});
  s.addShape(P.ShapeType.roundRect,{x:6.7,y:1.68,w:5.92,h:4.3,rectRadius:0.12,fill:{color:"FBEDEC"},line:{color:RED,width:1.2}});
  s.addText("人が判断すること",{x:7.0,y:1.88,w:5.4,h:0.4,fontSize:16,bold:true,color:RED,fontFace:F,isTextBox:true,margin:0});
  s.addText(ng.map((t,i)=>({text:t,options:{bullet:true,breakLine:i<ng.length-1}})),
    {x:7.0,y:2.35,w:5.4,h:3.45,fontSize:12,color:INK,fontFace:F,isTextBox:true,margin:0,paraSpaceAfter:6});
  box(s,0.65,6.2,11.97,1.0,"AIは、もっともらしく間違えます",
    "とくに医学的な数字や研究の引用は、実在しないものを自信たっぷりに書くことがあります。山口様の目で必ず確認してください。","warn");
  s.addNotes("医療系サイトなので、ここは飛ばさず読み上げる。");
}

/* ══════ 4 プロンプトの基本形 ══════ */
{
  const s=P.addSlide();
  head(s,"プロンプト（指示文）の基本形","この5つを順に書くだけで、精度が大きく変わります");
  const parts=[
    ["①","誰として答えるか","あなたは鹿児島のパーキンソン病専門トレーニングスタジオの運営者です"],
    ["②","前提","理学療法士が保険外でマンツーマン指導。初回体験はLINE登録で半額4,400円"],
    ["③","してほしいこと","コラムの構成案を作ってください"],
    ["④","条件・制約","1500〜2500字／見出しは質問の形／効果の断定はしない"],
    ["⑤","出力の形","表形式で／箇条書きで／3案出して"],
  ];
  let y=1.65;
  parts.forEach(([n,t,ex])=>{
    s.addShape(P.ShapeType.roundRect,{x:0.65,y,w:11.97,h:0.9,rectRadius:0.1,fill:{color:"F7FAFA"},line:{color:"DCE6E8",width:1}});
    s.addText(n,{x:0.85,y:y+0.25,w:0.42,h:0.4,align:"center",fontSize:17,bold:true,color:SUND,fontFace:F,isTextBox:true,margin:0});
    s.addText(t,{x:1.4,y:y+0.27,w:2.9,h:0.36,fontSize:14,bold:true,color:NAVY,fontFace:F,isTextBox:true,margin:0});
    s.addText(ex,{x:4.45,y:y+0.18,w:7.95,h:0.6,fontSize:11.5,color:MUTED,fontFace:MONO,isTextBox:true,margin:0,lineSpacingMultiple:1.15});
    y+=1.0;
  });
  box(s,0.65,6.35,11.97,0.9,"うまくいかないときは、条件（④）を足してください",
    "「もっと短く」「専門用語を減らして」「当事者が使う言葉で」など、後から追加で指示できます。会話は続けられます。","ok");
  s.addNotes("この型を覚えれば、どのAIでも使える。");
}

/* ══════ 5-11 プロンプト実例7種 ══════ */
const prompts = [
  { t:"① 記事のネタを出させる", sub:"何を書くか決まらないときに使います",
    label:"そのまま貼って使えます",
    body:
`あなたは鹿児島のパーキンソン病専門トレーニングスタジオ
「ASPATH（アスパス）」の運営者です。
理学療法士が、保険外のマンツーマン運動指導を行っています。

パーキンソン病のご本人とご家族が検索しそうな悩みを、10個挙げてください。

条件
・実際に検索窓に打ち込まれそうな言葉で
・すでに書いた記事とは重複しないこと
　（すくみ足の対策／体幹の運動／振るえ／運動習慣のつけ方）
・専門用語ではなく、当事者が使う言葉で

出力は表形式で、「検索されそうな言葉」「記事の題名案」の2列でお願いします。`,
    tip:["10個出させて、良いものだけ選ぶ","「もっと家族向けで」など追加指示もできる"],
    note:"10個出させて、山口様が3つ選ぶ使い方。全部使わなくてよい。" },

  { t:"② 記事の構成案を作らせる", sub:"書く順番が決まると、本文はぐっと楽になります",
    label:"①の続きに貼ります",
    body:
`「〇〇」というテーマでコラムを書きます。見出しの構成案を作ってください。

条件
・全体で1500〜2500字を想定
・見出しは質問の形にする（なぜ起きるの？／どうすればいい？）
・最初に「この記事で分かること」を3行
・最後は「アスパスでできること」に自然につなげる
・断定的な効果の約束はしない（「必ず改善」などは使わない）

出力は、見出しと、その中に書く内容のメモを添えてください。`,
    tip:["〇〇にテーマを入れるだけ","気に入らなければ「別の切り口で」"],
    note:"テーマ名だけ差し替えて繰り返し使える。" },

  { t:"③ 本文の下書きを作らせる", sub:"たたき台をもらって、山口様が直すのがいちばん速い進め方です",
    label:"②の続きに貼ります",
    body:
`上の構成案のうち、「△△」の部分の本文だけを書いてください。

条件
・ですます調。1文は40字以内
・専門用語を使うときは、直後にやさしい言い換えを入れる
・「治る」「改善します」などの断定は避け、
　「〜と報告されています」「〜の方が多いです」に置き換える
・箇条書きは3〜5項目まで
・読み手に呼びかける文を、最後に1文だけ入れる`,
    tip:["見出し1つずつ書かせる","出てきた文章は必ず読み直す"],
    note:"見出し1つずつ書かせると品質が上がる。全部まとめて書かせない。" },

  { t:"④ 検索用の説明文を作らせる", sub:"SureRank に貼る文章です。最応用編の点検項目にも直結します",
    label:"記事の本文を貼ってから使います",
    body:
`次のコラム記事について、検索結果に表示される説明文を作ってください。

条件
・全角で60〜160字におさめる
・冒頭30字で内容が分かるように書く
・「鹿児島」「パーキンソン病」を必ず入れる
・記号（！や★）は使わない
・3案出してください

【記事の内容】
（ここに記事の本文を貼り付ける）`,
    tip:["3案出させて選ぶ","文字数はSureRankの画面で数え直す"],
    note:"AIは文字数を数え間違える。必ずSureRankの表示で確認する。" },

  { t:"⑤ 記事の題名を短くさせる", sub:"点検で「題名60字超え」と出たときに使います",
    label:"題名を貼ってから使います",
    body:
`次の記事の題名が長すぎるため、検索結果で切れてしまいます。
短い題名を3案作ってください。

条件
・全角30字以内（サイト名は別に付くので含めない）
・検索されそうな言葉を必ず前半に入れる
・「｜」で区切る形にする（例：すくみ足の対策4選｜原因と今日から試せる方法）
・記事の中身とずれないようにする

【いまの題名】
（ここに貼る）

【記事の内容】
（ここに本文の冒頭を貼る）`,
    tip:["30字以内。サイト名は含めない","｜で区切る形にそろえる"],
    note:"2026年9月にコラム3本がこれで直った。実用性が高い。" },

  { t:"⑥ お客様への返信文を作らせる", sub:"個人情報は伏せてから貼ってください",
    label:"お問い合わせ内容を貼ってから使います",
    body:
`あなたは鹿児島のパーキンソン病専門トレーニングスタジオ
「ASPATH」の運営者です。次のお問い合わせに、返信の下書きを作ってください。

条件
・ていねいだが、かたすぎない言葉で
・不安に寄り添う一文を、いちばん最初に置く
・診断や治療の断定はしない
　（「一度お身体を見せていただいてから」に寄せる）
・初回体験は公式LINEのご登録で半額4,400円である旨を、
　押しつけずに最後に添える
・200〜300字

【いただいた内容】
（お名前・連絡先は消して、ご相談の内容だけ貼る）`,
    tip:["お名前・連絡先は必ず消す","そのまま送らず、一度読み直す"],
    note:"個人情報を貼らないことを強調。名前は「A様」等に置き換える。" },

  { t:"⑦ 点検結果の意味を聞く", sub:"最応用編の点検で×が出たとき、用語が分からないときに",
    label:"点検結果を貼ってから使います",
    body:
`WordPressで作った医療系サイトの点検結果です。
それぞれの項目が何を意味するのか、専門用語を使わずに説明してください。
また、放置するとどうなるかも教えてください。

条件
・専門用語には、必ずやさしい言い換えを付ける
・「自分で直せるか」「専門家に頼むべきか」を分けて書く
・大げさに不安をあおらないでください

【点検結果】
（ここに点検スクリプトの出力を貼り付ける）`,
    tip:["用語の意味を知るために使う","直す作業自体は開発側へ"],
    note:"AIに直させない。意味を理解するための用途に限定する。" },
];

prompts.forEach(ps=>{
  const s=P.addSlide();
  head(s,ps.t,ps.sub);
  prompt(s,0.65,1.85,8.15,4.6,ps.label,ps.body);
  s.addText("使い方のコツ",{x:9.05,y:1.85,w:3.57,h:0.35,fontSize:13.5,bold:true,color:NAVY,fontFace:F,isTextBox:true,margin:0});
  ps.tip.forEach((t,i)=>{
    const y=2.3+i*1.05;
    s.addShape(P.ShapeType.roundRect,{x:9.05,y,w:3.57,h:0.9,rectRadius:0.1,fill:{color:PAPER},line:{color:"E2D5BE",width:1}});
    s.addText(t,{x:9.25,y:y+0.1,w:3.2,h:0.7,fontSize:11.5,color:INK,fontFace:F,isTextBox:true,margin:0,valign:"middle",lineSpacingMultiple:1.2});
  });
  box(s,9.05,4.55,3.57,1.9,"どのAIでも使えます",
    "ChatGPT・Claude・Gemini、どれでもこの書き方で動きます。幸喜はClaudeを使っています。","info");
  box(s,0.65,6.6,8.15,0.68,"出てきた文章は、必ず山口様の言葉に直してください","","warn");
  s.addNotes(ps.note);
});

/* ══════ 12 画像生成 ══════ */
{
  const s=P.addSlide();
  head(s,"⑧ イラストを作らせる","ブランドの色を守るため、必ず色を指定してください");
  prompt(s,0.65,1.85,8.15,4.0,"画像生成AIに貼ります",
`ASPATH（鹿児島のパーキンソン病専門トレーニングスタジオ）の
ウェブサイト用のイラストを作ってください。

【描いてほしい場面】
（例：椅子に座って足を上げる運動を、笑顔で行う高齢の女性）

【色の指定】※必ず守ってください
・服やアクセントは オレンジ（#F4A261）
・線や濃い部分は 紺色（#264653）
・背景は生成りの白（#F4E9D8）

【絵の雰囲気】
・やわらかい手描き風。線は細め
・写実的すぎず、親しみのある表情
・医療器具や病院らしさは出さない
・文字は入れない`);
  s.addText("色の見本",{x:9.05,y:1.85,w:3.57,h:0.35,fontSize:13.5,bold:true,color:NAVY,fontFace:F,isTextBox:true,margin:0});
  [["F4A261","オレンジ","#F4A261"],["264653","紺色","#264653"],["F4E9D8","生成り","#F4E9D8"]].forEach(([c,n,code],i)=>{
    const y=2.3+i*0.75;
    s.addShape(P.ShapeType.roundRect,{x:9.05,y,w:0.62,h:0.62,rectRadius:0.08,fill:{color:c},line:{color:"C9D5D9",width:1}});
    s.addText(n,{x:9.82,y:y+0.04,w:2.8,h:0.3,fontSize:12.5,bold:true,color:NAVY,fontFace:F,isTextBox:true,margin:0});
    s.addText(code,{x:9.82,y:y+0.32,w:2.8,h:0.28,fontSize:11,color:MUTED,fontFace:MONO,isTextBox:true,margin:0});
  });
  box(s,9.05,4.65,3.57,1.2,"何度も作り直せます",
    "1回で決まりません。「もっと明るく」など足していきます。","ok");
  box(s,0.65,6.0,11.97,1.15,"できた画像は、横1200ピクセルくらいに縮めてから入れてください",
    "大きすぎるとページが重くなります。詳しいプロンプトは別冊『★イラスト生成プロンプト集』にもまとめています。","info");
  s.addNotes("ブランド色の指定が要。既存のプロンプト集も案内する。");
}

/* ══════ 13 3つの約束 ══════ */
{
  const s=P.addSlide();
  head(s,"AIを使うときの、3つの約束","この3つを守れば、安心して使えます");
  const rules=[
    ["1","個人情報を貼らない","お名前・ご連絡先・ご住所・診断名は、AIに貼らないでください。返信文を作るときは「A様」などに置き換え、ご相談の内容だけを貼ります。"],
    ["2","医学的な内容は必ず確認する","AIは、実在しない研究や数字を、自信たっぷりに書くことがあります。数字や引用が出てきたら、そのまま使わないでください。"],
    ["3","そのまま公開しない","AIの文章は、どこか他人の言葉です。山口様の言葉に直してから公開してください。読み直すだけで、ぐっと良くなります。"],
  ];
  let y=1.7;
  rules.forEach(([n,t,d])=>{
    s.addShape(P.ShapeType.roundRect,{x:0.65,y,w:11.97,h:1.55,rectRadius:0.12,fill:{color:PAPER},line:{color:"E2D5BE",width:1}});
    s.addShape(P.ShapeType.ellipse,{x:1.0,y:y+0.45,w:0.65,h:0.65,fill:{color:SUND}});
    s.addText(n,{x:1.0,y:y+0.45,w:0.65,h:0.65,align:"center",valign:"middle",fontSize:24,bold:true,color:WHITE,fontFace:F,isTextBox:true,margin:0});
    s.addText(t,{x:1.95,y:y+0.2,w:10.3,h:0.4,fontSize:17,bold:true,color:NAVY,fontFace:F,isTextBox:true,margin:0});
    s.addText(d,{x:1.95,y:y+0.68,w:10.3,h:0.75,fontSize:12.5,color:INK,fontFace:F,isTextBox:true,margin:0,lineSpacingMultiple:1.2});
    y+=1.68;
  });
  box(s,0.65,6.78,11.97,0.52,"薬機法・景品表示法の観点でも、効果の断定は避けてください。","","ng");
  s.addNotes("医療系サイトなので、ここは飛ばさず読み上げる。");
}
};
