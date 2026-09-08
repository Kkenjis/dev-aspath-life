// ASPATH ウェブサイト 総合ドキュメント ── 企画から運用保守まで、1冊に統合
// 実行: NODE_PATH=<node_modules> node 総合版pptxを作る.js
const { C, F, MONO, makeDeck, Builder } = require("./総合版_lib.js");
const { LOGO_LIGHT, RATIO } = require("./ブランドヘッダー.js");

// 各部のファイル。順番がそのまま資料の並びになる。
const PARTS = [
  "./総合版_1_企画から公開.js",        // 第0部〜第3部（企画・設計・制作・公開）
  "./総合版_2_運用から保守.js",        // 第4部〜第7部（運用・壊さない触り方・点検・AI活用）
  "./総合版_3_自分でやる_集客.js",      // 第8部〜第9部（開発者の作業を自分で・集客）
  "./総合版_4_事業と守り.js",          // 第10部〜第14部（事業・法令・作法・リスク・差分）
  "./総合版_6_自分で直す.js",          // 第15部（TOPと固定ページを自分で直す）
  "./総合版_5_この先に備える.js",       // 第16部（資料の保守・将来のリスク・体制）
  "./総合版_7_開発者向け.js",          // 第17部（開発者への引き継ぎ・技術編）
  "./総合版_8_これから作る方へ.js",     // 第18部（同じように専門をお持ちの方へ）
  "./総合版_9_AIと作る.js",           // 第19部（バイブコーディングと実例プロンプト）
  "./総合版_10_パソコンの準備.js",      // 第20部（OS別の準備）
];

// ── 1回目：各部の扉に書いた「この部で扱うこと」を集めるためだけに、いったん組み立てる。
//    巻頭のもくじを、扉の箇条書きから自動で作るため。二重管理を避ける目的。
//    このデッキは書き出さずに捨てる。
const scanB = new Builder(makeDeck("scan"));
{
  const scanP = scanB.P;
  PARTS.forEach(f => require(f)(scanP, scanB));
}
const TOPICS = scanB.partTopics;

// ── 2回目：本番
const P = makeDeck("ASPATH ウェブサイト 総合ドキュメント");
const B = new Builder(P);
B.detailToc = TOPICS;      // 巻頭のもくじが、これを読んで各部の内容を並べる

require(PARTS[0])(P, B);
PARTS.slice(1).forEach(f => require(f)(P, B));

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
    ["プラグイン", "WordPressに機能を足す部品。現在25個（うち有効20個）。増減は第14部を参照"],
    ["キャッシュ", "表示を速くするための一時保存。直したのに変わらない原因の大半がこれです"],
    ["スラッグ", "URLの末尾の文字。/about/ の about の部分。変えると検索順位が失われます"],
    ["canonical", "「このページの正式なURLはこれです」という指定。重複を防ぎます"],
    ["noindex", "「このページは検索結果に載せないでください」という指定"],
    ["301転送", "「引っ越しました」と伝える仕組み。旧URLの評価を引き継げます"],
    ["構造化データ", "業種や住所を、機械が読める形でGoogleに伝えるデータ"],
    ["OGP", "LINEやSNSに貼ったときに出るサムネイルと説明文"],
    ["サイトマップ", "サイト内のページ一覧。Googleに「見に来てください」と伝えるためのもの"],
    ["バイブコーディング", "作り方ではなく「作りたいもの」を日本語で伝えて、AIに書かせる進め方（第19部）"],
    ["ビルド", "HTMLからテーマZIPを作ること。「テーマを作る」を実行するだけです（第20部）"],
    ["PATH（パス）", "「このプログラムはここにあります」という道案内。Windowsで最も多いつまずき"],
  ];
  B.rows(s, 0.65, 1.5, 11.97, words, 0.43, 2.6, 11);
  s.addNotes("用語で詰まったらここに戻る。");
}

/* 資料の一覧 */
{
  const s = P.addSlide();
  B.head(s, "資料の一覧", "内容はこの総合版に集約しました。冊子は保管用として残しています", { lv: "read" });
  const docs = [
    ["★ASPATH_サイト運用マニュアル 基本／応用／最応用／AI活用編", "統合済み（第4〜7部）。実画面の写真が要るときだけ開いてください"],
    ["★山口様向け_ページの直し方／ASPATHについて_文章の直し方", "統合済み（第15部）。写真つきの手順が要るとき用"],
    ["★アクセス解析_権限付与の手順／検索で見つけてもらう記事の書き方", "統合済み（第9部）"],
    ["★イラスト生成プロンプト集", "統合済み（第19部 実例②）。色指定の一覧が要るとき用"],
    ["ASPATHサイト点検スクリプト.js", "現役。Chromeに貼るだけで18項目を点検します（第6部）"],
    ["★SEO対策の実施記録.md", "現役。全ページのタイトル・説明文と、変更のたびの追記"],
    ["★プラグイン棚卸し／Search Console 手順／キャッシュが消えないとき", "現役。単票としてそのままお渡しできる形です"],
    ["build_wp_theme.py", "現役。テーマを生成する本体。技術的な説明は第17部"],
    ["テーマを作る.bat ／ .command ／ .sh", "現役。Windows／Mac／Linux 用。中身は同じ（第20部）"],
  ];
  B.rows(s, 0.65, 1.5, 11.97, docs, 0.5, 5.6, 11);
  B.box(s, 0.65, 6.15, 5.85, 0.98, "「統合済み」の冊子について",
    "捨てないでください。実際の画面写真は冊子のほうが豊富です。読む順としては、まず総合版です。", "info");
  B.box(s, 6.77, 6.15, 5.85, 0.98, "置き場所",
    "すべて _wp移行素材 と、その中の ★引継ぎ資料 フォルダに入っています。", "ok");
  s.addNotes("冊子は統合済みだが保管。捨てさせない。");
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
    ["月1回", "サイト点検（5分）＋申込のテスト送信1件", "第6部・第13部", C.RED],
    ["月1〜2回", "コラムを1本書く", "第7部のプロンプトで下書きを作れます", C.GREEN],
    ["随時", "お知らせを出す", "休業・キャンペーンなど", C.NAVY],
    ["半年に1回", "料金や情報の見直し", "古い金額が残っていないか（第10部）", C.MUTED],
    ["毎年12月", "キャンペーン期限の見直し", "延長するか、記載を消すか。放置は法令違反", C.RED],
    ["更新月の1か月前", "ドメイン・サーバーの更新確認", "失効するとサイトもメールも止まります", C.PURPLE],
  ];
  let y = 1.5;
  cal.forEach(([w, t, d, col]) => {
    s.addShape(P.ShapeType.roundRect, { x: 0.65, y, w: 11.97, h: 0.62, rectRadius: 0.1, fill: { color: "F7FAFA" }, line: { color: C.LINE, width: 1 } });
    s.addShape(P.ShapeType.roundRect, { x: 0.95, y: y + 0.09, w: 1.9, h: 0.44, rectRadius: 0.1, fill: { color: col } });
    s.addText(w, { x: 0.95, y: y + 0.09, w: 1.9, h: 0.44, align: "center", valign: "middle", fontSize: 11.5, bold: true, color: C.WHITE, fontFace: F, isTextBox: true, margin: 0 });
    s.addText(t, { x: 3.1, y: y + 0.11, w: 4.6, h: 0.4, fontSize: 14, bold: true, color: C.NAVY, fontFace: F, isTextBox: true, margin: 0, valign: "middle" });
    s.addText(d, { x: 7.9, y: y + 0.11, w: 4.5, h: 0.4, fontSize: 12, color: C.MUTED, fontFace: F, isTextBox: true, margin: 0, valign: "middle" });
    y += 0.7;
  });
  B.box(s, 0.65, y + 0.1, 11.97, 0.75, "毎週の申込確認と、月1回の点検。この2つだけは続けてください。",
    "あとは、余裕があるときで構いません。", "ok");
  s.addNotes("運用の型。これだけ守れば回る。");
}

/* 最終ページ */
{
  const s = P.addSlide();
  s.background = { color: C.NAVY };
  s.addImage({ path: LOGO_LIGHT, x: 11.05, y: 1.25, h: 1.9, w: 1.9*RATIO });
  B.page++;
  B.toc.push({ level: 1, title: "最後に", page: B.page });   // しおり用
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
  s.addText(String(B.page), { x: 12.45, y: 7.20, w: 0.45, h: 0.24, align: "right", fontSize: 10.5, color: "7E969E", fontFace: F, isTextBox: true, margin: 0 });
  s.addNotes("締め。困ったら聞いてよい、を最後に置く。");
}

/* しおり用の情報を書き出す。
   PPTX→PDF変換ではしおりが作られないため、変換後に しおりを付ける.py で流し込む。 */
{
  const fs = require("fs");
  const tocPage = (B.links[0] && B.links[0].page) || 2;   // 目次スライドのページ番号
  fs.writeFileSync("/tmp/deck9/総合版_toc.json", JSON.stringify({
    total: B.page, tocPage, toc: B.toc, links: B.links, homeLinks: B.homeLinks
  }, null, 1), "utf-8");
  console.log("しおり情報:", B.toc.length, "件 ／ 目次リンク", B.links.length,
              "件 ／ もくじへ戻る", B.homeLinks.length, "件 ／ 目次はP" + tocPage);
}

P.writeFile({ fileName: "/tmp/deck9/ASPATH_ウェブサイト総合ドキュメント.pptx" })
 .then(f => console.log("作成:", f, "／ 全", B.page, "ページ"));
