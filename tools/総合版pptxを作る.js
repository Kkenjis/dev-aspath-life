// ASPATH ウェブサイト 総合ドキュメント ── 企画から運用保守まで、1冊に統合
// 実行: NODE_PATH=<node_modules> node 総合版pptxを作る.js
const { C, F, MONO, makeDeck, Builder } = require("./総合版_lib.js");

const P = makeDeck("ASPATH ウェブサイト 総合ドキュメント");
const B = new Builder(P);

// 第0部〜第3部（企画・設計・制作・公開）
require("./総合版_1_企画から公開.js")(P, B);
// 第4部〜第7部（運用・壊さない触り方・点検と保守・AI活用）
require("./総合版_2_運用から保守.js")(P, B);

/* ══════════════ 巻末 ══════════════ */
{
  const s = P.addSlide();
  B.partCover(s, "巻", "巻末資料", [
    "用語集 ─ この資料に出てくる言葉",
    "資料の一覧 ─ どこに何があるか",
    "アカウントと連絡先",
    "年間の運用カレンダー",
  ], C.MUTED);
}

/* 用語集 */
{
  const s = P.addSlide();
  B.head(s, "用語集", "この資料に出てくる言葉を、やさしく言い換えます", { lv: "read" });
  const words = [
    ["テーマ", "サイトの見た目を決めるファイル一式。このサイトでは固定ページの文章も入っています"],
    ["プラグイン", "WordPressに機能を足す部品。フォームや検索対策など、16個入っています"],
    ["キャッシュ", "表示を速くするための一時保存。直したのに変わらない原因の大半がこれです"],
    ["スラッグ", "URLの末尾の文字。/about/ の about の部分。変えると検索順位が失われます"],
    ["canonical", "「このページの正式なURLはこれです」という指定。重複を防ぎます"],
    ["noindex", "「このページは検索結果に載せないでください」という指定"],
    ["301転送", "「引っ越しました」と伝える仕組み。旧URLの評価を引き継げます"],
    ["構造化データ", "業種や住所を、機械が読める形でGoogleに伝えるデータ"],
    ["OGP", "LINEやSNSに貼ったときに出るサムネイルと説明文"],
    ["サイトマップ", "サイト内のページ一覧。Googleに「見に来てください」と伝えるためのもの"],
  ];
  B.rows(s, 0.65, 1.5, 11.97, words, 0.52, 2.6, 11.5);
  s.addNotes("用語で詰まったらここに戻る。");
}

/* 資料の一覧 */
{
  const s = P.addSlide();
  B.head(s, "資料の一覧", "この総合版のほかに、目的別の冊子と手順書があります", { lv: "read" });
  const docs = [
    ["★ASPATH_サイト運用マニュアル_基本編", "日々の更新。実画面の写真つき。レクチャーで使います"],
    ["★ASPATH_サイト運用マニュアル_応用編", "壊さない触り方と、検索対策"],
    ["★ASPATH_サイト運用マニュアル_最応用編", "公開後の点検と、直し方"],
    ["★ASPATH_サイト運用マニュアル_AI活用編", "そのまま使えるプロンプト8種"],
    ["ASPATHサイト点検スクリプト.js", "Chromeに貼るだけで18項目を点検します"],
    ["★SEO対策の実施記録.md", "全13ページのタイトル・説明文の設定内容"],
    ["★Search Console_インデックス登録の再リクエスト手順.md", "Googleへの反映を早める操作"],
    ["★キャッシュが消えないとき.md", "更新が画面に出ないときの対処"],
    ["★納品物チェックリスト_見積項目との対応.md", "見積5項目に対する完了状況"],
  ];
  B.rows(s, 0.65, 1.5, 11.97, docs, 0.56, 5.6, 11.5);
  B.box(s, 0.65, 6.4, 11.97, 0.8, "置き場所",
    "すべて _wp移行素材／★引継ぎ資料 フォルダに入っています。", "info");
  s.addNotes("どこに何があるかの索引。");
}

/* アカウントと連絡先 */
{
  const s = P.addSlide();
  B.head(s, "アカウントと連絡先", "引継ぎで、いちばん大事なページです", { lv: "read" });
  const acc = [
    ["WordPress 管理画面", "https://aspath-life.com/wp-admin/"],
    ["サーバー", "エックスサーバー（契約は ASPATH 様名義）"],
    ["共有Googleアカウント", "aspathlife@gmail.com（アナリティクス・Search Console の管理元）"],
    ["Google アナリティクス", "測定ID G-17MTFN7SQ4　※絶対に変更しないでください"],
    ["Search Console", "https://search.google.com/search-console"],
    ["ソース管理", "GitHub（GitHub Desktop で Pull / Push）"],
    ["公式LINE", "https://lin.ee/5kiH4i3"],
  ];
  B.rows(s, 0.65, 1.5, 11.97, acc, 0.62, 4.0, 11.5);
  B.box(s, 0.65, 6.0, 11.97, 1.2, "クローズ前に、必ず確認してください",
    "aspathlife@gmail.com のパスワードを山口様が把握していること。テーマZIPの最新版が山口様の手元にもあること。この2つが無いと、開発担当が離れたあとに誰も設定を変更できなくなります。", "ng");
  s.addNotes("引継ぎで最重要。パスワードとZIPの所在。");
}

/* 年間カレンダー */
{
  const s = P.addSlide();
  B.head(s, "年間の運用カレンダー", "これだけ回していれば、サイトは健全に保てます", { lv: "easy" });
  const cal = [
    ["毎週", "お申し込みの確認", "見落としが商売に直結します", C.SUN],
    ["月1回", "サイト点検（5分）", "第6部のスクリプトを貼るだけ", C.RED],
    ["月1〜2回", "コラムを1本書く", "第7部のプロンプトで下書きを作れます", C.GREEN],
    ["随時", "お知らせを出す", "休業・キャンペーンなど", C.NAVY],
    ["半年に1回", "料金や情報の見直し", "古い金額が残っていないか", C.MUTED],
    ["年1回", "バックアップの保存", "手元にファイルを1つ残す", C.PURPLE],
  ];
  let y = 1.5;
  cal.forEach(([w, t, d, col]) => {
    s.addShape(P.ShapeType.roundRect, { x: 0.65, y, w: 11.97, h: 0.72, rectRadius: 0.1, fill: { color: "F7FAFA" }, line: { color: C.LINE, width: 1 } });
    s.addShape(P.ShapeType.roundRect, { x: 0.95, y: y + 0.13, w: 1.7, h: 0.46, rectRadius: 0.1, fill: { color: col } });
    s.addText(w, { x: 0.95, y: y + 0.13, w: 1.7, h: 0.46, align: "center", valign: "middle", fontSize: 11.5, bold: true, color: C.WHITE, fontFace: F, isTextBox: true, margin: 0 });
    s.addText(t, { x: 2.9, y: y + 0.16, w: 4.0, h: 0.4, fontSize: 14, bold: true, color: C.NAVY, fontFace: F, isTextBox: true, margin: 0, valign: "middle" });
    s.addText(d, { x: 7.1, y: y + 0.16, w: 5.3, h: 0.4, fontSize: 12, color: C.MUTED, fontFace: F, isTextBox: true, margin: 0, valign: "middle" });
    y += 0.8;
  });
  B.box(s, 0.65, y + 0.12, 11.97, 0.85, "毎週の申込確認と、月1回の点検。この2つだけは続けてください。",
    "あとは、余裕があるときで構いません。", "ok");
  s.addNotes("運用の型。これだけ守れば回る。");
}

/* 最終ページ */
{
  const s = P.addSlide();
  s.background = { color: C.NAVY };
  B.page++;
  s.addText("最後に", { x: 0.9, y: 1.3, w: 11.5, h: 0.7, fontSize: 30, bold: true, color: C.WHITE, fontFace: F, isTextBox: true, margin: 0 });
  s.addText("このサイトは、山口様が「必要とする方に、効果的な運動を届ける」ために作りました。",
    { x: 0.9, y: 2.2, w: 11.5, h: 0.5, fontSize: 16, color: "CFE0E4", fontFace: F, isTextBox: true, margin: 0 });
  s.addText("サイトは、作った日がいちばん新しいのではありません。\n書き足し、直し続けたぶんだけ、価値が積み上がっていきます。",
    { x: 0.9, y: 2.95, w: 11.5, h: 1.0, fontSize: 15, color: "AFC8CE", fontFace: F, isTextBox: true, margin: 0, lineSpacingMultiple: 1.4 });
  s.addShape(P.ShapeType.roundRect, { x: 0.9, y: 4.3, w: 11.5, h: 1.6, rectRadius: 0.14, fill: { color: C.DEEP } });
  s.addText("分からなくなったら、そのままご連絡ください。\n元に戻せないことは、ほとんどありません。無理に触らず、聞いていただくのがいちばん早いです。",
    { x: 1.25, y: 4.55, w: 10.8, h: 1.1, fontSize: 14, color: "DCE7EA", fontFace: F, isTextBox: true, margin: 0, lineSpacingMultiple: 1.35 });
  s.addText("2026年9月　ASPATH ウェブサイト 総合ドキュメント",
    { x: 0.9, y: 6.3, w: 11.5, h: 0.4, fontSize: 12, color: "9FBAC1", fontFace: F, isTextBox: true, margin: 0 });
  s.addText(String(B.page), { x: 12.45, y: 6.95, w: 0.45, h: 0.28, align: "right", fontSize: 10.5, color: "7E969E", fontFace: F, isTextBox: true, margin: 0 });
  s.addNotes("締め。困ったら聞いてよい、を最後に置く。");
}

P.writeFile({ fileName: "/tmp/deck9/ASPATH_ウェブサイト総合ドキュメント.pptx" })
 .then(f => console.log("作成:", f, "／ 全", B.page, "ページ"));
