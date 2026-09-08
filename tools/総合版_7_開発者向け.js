// ASPATH 総合版 ── 第17部 開発者への引き継ぎ（技術編）
//   別の開発者・制作会社に依頼するとき、この部だけ渡せば着手できる状態を目指す。
//   「なぜそうなっているか」より「どこを触れば何が変わるか」を優先して書く。
const { C, F, MONO, LV } = require("./総合版_lib.js");

module.exports = function build(P, B){

/* ══════════════ 第17部 扉 ══════════════ */
{ const s=P.addSlide();
  B.partCover(s,"17","開発者への引き継ぎ（技術編）",[
    "5分で把握する ─ このサイトの成り立ち／リポジトリの中身",
    "ビルドの流れと、生成されるファイルの対応表",
    "build_wp_theme.py が自動でやっていること",
    "WordPress 側の状態（DBに置いてあるもの）",
    "作業例 ①文言を変える ②記事を足す ③ページを作る ④画像を差し替える",
    "触ると壊れるところ（技術的な地雷）",
    "ローカルでの確認方法とデプロイ手順",
  ],C.DEEP);
  s.addNotes("外注・引き継ぎ用。この部だけで着手できることを目標にした章。");
}

/* 17-1 5分で把握する */
{
  const s=P.addSlide();
  B.head(s,"5分で把握する ─ このサイトの成り立ち","一般的なWordPress案件とは、1点だけ大きく違います",{lv:"read"});
  B.box(s,0.65,1.5,11.97,1.15,"いちばん大事な前提",
    "固定ページの本文は、WordPressのデータベースではなく「テーマのPHPファイル」の中にあります。静的HTMLとして作ったサイトを、そのままテーマ化しているためです。管理画面から固定ページを編集しても、表示は変わりません。","ng");
  B.rows(s,0.65,2.85,11.97,[
    ["構成","WordPress ＋ 自作テーマ aspath（クラシックテーマ／ブロックテーマではない）"],
    ["ソース","静的HTML（index.html ほか13枚）＋ ビルドスクリプト build_wp_theme.py"],
    ["ビルド","Python 3。外部ライブラリ不要。標準ライブラリのみで動きます"],
    ["成果物","_wp移行素材/aspath-theme.zip　→ 管理画面からテーマとしてアップロード"],
    ["CSS","ページごとに1本（css/index.css など16本）。結合しない設計"],
    ["JS","ページごとに抽出。言語切替・スライダー・ドロワーなど"],
    ["DBに入っているもの","投稿（コラム・お知らせ）、コメント、初回体験の申込、ASPATHについての本文のみ"],
  ],0.6,3.0,12);
  s.addNotes("ここを読み飛ばすと必ず事故る。最初の枠が全て。");
}

/* 17-2 リポジトリの中身 */
{
  const s=P.addSlide();
  B.head(s,"リポジトリの中身","dev-aspath-life-main の直下です",{lv:"read"});
  B.code(s,0.65,1.5,7.5,4.6,"",
`dev-aspath-life-main/
├ index.html            TOP（いちばん大きい。約2,700行）
├ about.html            ASPATHについて
├ price.html            プランと料金（URLは /services/）
├ access.html  contact.html  faq.html
├ privacy.html  tokushoho.html  sitemap.html
├ news.html             コラム一覧の見た目
├ info.html             お知らせ一覧の見た目
├ taimentraining.html   コラム記事の型（single.php の元）
├ column-parkinson.html 別レイアウトのコラム
├ news-campaign.html    お知らせ記事の型
├ trial-entry.html      初回体験フォーム
├ images/               画像 76点（webp中心）
├ build_wp_theme.py     ビルド本体（約1,880行）
├ テーマを作る.bat        ダブルクリック用
├ tools/                この資料を作るスクリプト
└ _wp移行素材/
   ├ aspath-theme/      生成されたテーマ（Git管理下）
   ├ aspath-theme.zip   アップロード用
   └ ★引継ぎ資料/       PDF一式`,10);
  B.rows(s,8.35,1.5,4.27,[
    ["編集するのは","直下の *.html と images/ だけ"],
    ["触らない","_wp移行素材/aspath-theme/（毎回上書き生成）"],
    ["ビルド","python3 build_wp_theme.py"],
    ["所要","2〜3秒"],
  ],0.72,1.9,11);
  B.box(s,8.35,4.6,4.27,1.5,"生成物もGitに入れています",
    "差分で「何が変わったか」を追えるようにするため。手で直すと次のビルドで消えます。","warn");
  s.addNotes("HTMLが正、テーマは生成物。これを外すと二重管理になる。");
}

/* 17-3 ビルドの流れ */
{
  const s=P.addSlide();
  B.head(s,"ビルドの流れ ─ HTML から WordPress テーマへ","build_wp_theme.py の main() が上から順にやっていること",{lv:"read"});
  B.steps(s,0.65,1.5,7.3,[
    {t:"HTMLを読み、<main> だけを抜き出す",d:"extract() ＋ clean()。head/header/footer は共通化"},
    {t:"リンクを実URLに書き換える",d:"rewrite_links()。about.html → /about/ など LINKS 表に従う"},
    {t:"画像URLをテーマの場所に書き換え、更新の印を付ける",d:"rewrite_imgs()。?v= は中身のMD5先頭8桁"},
    {t:"ページごとにCSSを切り出す",d:"page_css()。<style>を抜き、url(images/…) を ../images/ へ"},
    {t:"header.php / footer.php を組み立てる",d:"index.html の共通部分から生成"},
    {t:"各 page-*.php を書き出す",d:"CSS_SOURCES と mapping 表に従う"},
    {t:"functions.php を書き出す",d:"SEO・301転送・フォーム処理・コメント表示など"},
    {t:"画像パスの検算 → ZIP化",d:"_verify_image_urls()。相対パスが残っていたら異常終了"},
  ],0.66,12.5);
  B.box(s,8.15,1.5,4.47,2.6,"ビルドは「失敗したら止まる」設計",
    "画像の相対パスが残っている、CSSにPHPが混ざっている、といった状態を検知すると die() で異常終了します。\n\n黙って壊れたZIPを吐かないようにするためです。","ok");
  B.box(s,8.15,4.3,4.47,1.8,"バージョン",
    "VERSION は実行時刻から自動生成（1.1.YYYYMMDD.HHMM）。style.css のヘッダに入るので、管理画面で今のテーマがいつのものか分かります。","info");
  s.addNotes("main() の処理順。検算で止まる設計は明示しておくと安心して触れる。");
}

/* 17-4 対応表 */
{
  const s=P.addSlide();
  B.head(s,"生成されるファイルの対応表","「このURLを直したい」→「このHTMLを触る」が引ける表です",{lv:"read"});
  const rows=[
    ["/",                 "index.html",            "front-page.php",      "index.css"],
    ["/about/",           "about.html",            "page-about.php",      "about.css"],
    ["/services/",        "price.html",            "page-services.php",   "services.css"],
    ["/access/",          "access.html",           "page-access.php",     "access.css"],
    ["/contact/",         "contact.html",          "page-contact.php",    "contact.css"],
    ["/faq/",             "faq.html",              "page-faq.php",        "faq.css"],
    ["/privacy/ ほか2件",  "privacy.html ほか",      "page-privacy.php ほか","privacy.css ほか"],
    ["/column/（一覧）",   "news.html",             "home.php",            "blog.css"],
    ["コラム記事",         "taimentraining.html",   "single.php",          "column.css"],
    ["お知らせ記事",       "news-campaign.html",    "single.php（分岐）",   "news-single.css"],
  ];
  s.addShape(P.ShapeType.roundRect,{x:0.65,y:1.5,w:11.97,h:0.42,rectRadius:0.08,fill:{color:C.NAVY}});
  [["公開URL",1.0,2.7],["元のHTML",3.9,2.9],["生成されるPHP",7.0,3.0],["CSS",10.2,2.2]].forEach(([t,x,w])=>{
    s.addText(t,{x,y:1.5,w,h:0.42,fontSize:11.5,bold:true,color:C.WHITE,fontFace:F,isTextBox:true,margin:0,valign:"middle"});
  });
  let y=1.98;
  rows.forEach(([a,b,c,d],i)=>{
    s.addShape(P.ShapeType.roundRect,{x:0.65,y,w:11.97,h:0.4,rectRadius:0.06,
      fill:{color:i%2?C.PAPER:"F7FAFA"},line:{color:C.LINE,width:1}});
    [[a,1.0,2.7,F,C.NAVY,true],[b,3.9,2.9,MONO,C.INK,false],[c,7.0,3.0,MONO,C.INK,false],[d,10.2,2.3,MONO,C.MUTED,false]]
      .forEach(([t,x,w,ff,col,bd])=>{
        s.addText(t,{x,y:y+0.01,w,h:0.38,fontSize:10.5,bold:!!bd,color:col,fontFace:ff,isTextBox:true,margin:0,valign:"middle"});
      });
    y+=0.435;
  });
  B.box(s,0.65,y+0.12,11.97,0.82,"例外は price.html だけ",
    "ファイル名は price ですが、公開URLは /services/ です。過去の経緯によるもので、スラッグは検索順位に直結するため変更しません。","warn");
  s.addNotes("この表が引ければ、着手までの時間が一番短くなる。");
}

/* 17-5 自動でやっていること */
{
  const s=P.addSlide();
  B.head(s,"build_wp_theme.py が自動でやっていること","手で書かなくてよいもの。逆に、勝手に書き換わるもの",{lv:"read"});
  B.rows(s,0.65,1.5,11.97,[
    ["画像の更新の印","images/xxx.webp → …/themes/aspath/images/xxx.webp?v=（中身のMD5先頭8桁）"],
    ["内部リンクの変換","href=\"about.html\" → href=\"/about/\"。LINKS 表に無いリンクは変換されません"],
    ["SEOのタイトル・説明文","aspath_seo_descriptions() の表から出力。SureRankの設定が優先されます"],
    ["構造化データ","LocalBusiness／FAQPage を functions.php で出力。FAQは faq.html の実データから生成"],
    ["旧URLの301転送","aspath_legacy_redirect_map()。for-parkinsons-disease → /パーキンソン病とアスパスの歩み方/"],
    ["添付ファイルページの封鎖","aspath_kill_attachment_pages()。画像1枚ごとの空ページを親へ301"],
    ["404のメタ是正","SureRankがcanonicalに管理画面URLを出す不具合の打ち消し"],
    ["初回体験フォーム","trial-entry.html のフォームを、送信できるPHPに変換（aspath_trial_handle）"],
  ],0.6,4.2,11.5);
  B.box(s,0.65,6.35,11.97,0.75,"生成後のPHPを手で直しても、次のビルドで消えます。直すのは必ず build_wp_theme.py 側です。","","ng");
  s.addNotes("自動化の一覧。ここを知らずにPHPを直接触るのが最大の事故パターン。");
}

/* 17-6 WordPress側の状態 */
{
  const s=P.addSlide();
  B.head(s,"WordPress 側の状態","テーマに入っていないもの＝DBにあるもの",{lv:"read"});
  B.rows(s,0.65,1.5,11.97,[
    ["投稿（コラム 7本・お知らせ 3本）","本文はDB。アイキャッチあり。single.php で表示"],
    ["ASPATHについての本文","このページだけDB（page-about.php はDBの本文を出力）。山口様が自分で直せるようにした例外"],
    ["コメント","WordPress標準。表示は functions.php の aspath_comment_item() が担当"],
    ["初回体験の申込","カスタム投稿 aspath_trial。スラッグ taiken-2026as9y のページから送信"],
    ["表示設定","ホームページ＝固定ページ HOME、投稿ページ＝コラム。入れ替えるとTOPが記事一覧になります"],
    ["プラグイン","25個（有効20）。SureRank・SureForms・Super Page Cache・Site Kit・LatePoint は必須"],
  ],0.66,4.6,12);
  B.box(s,0.65,5.6,5.85,1.5,"ステージング環境",
    "WP STAGING が入っています。大きな変更はここで試してから本番へ。ただしURLが変わるため、絶対URLを使っている箇所は表示が崩れます。","info");
  B.box(s,6.72,5.6,5.9,1.5,"バックアップ",
    "All-in-One WP Migration と WP STAGING の2系統。テーマだけならZIPの世代管理で足ります。DBまで戻すときは前者を使います。","info");
  s.addNotes("DBとテーマの境界。about だけ例外なのが分かりにくいので明示。");
}

/* 17-7 作業例① 文言変更 */
{
  const s=P.addSlide();
  B.head(s,"作業例① 固定ページの文言を変える","所要5分。いちばん多い依頼です",{lv:"step"});
  B.code(s,0.65,1.5,6.5,2.55,"",
`# 1. 変更前を確認
grep -n "また、自分の足で" index.html

# 2. 編集（エディタでも sed でも可）

# 3. ビルド
python3 build_wp_theme.py

# 4. 反映されたか確認
grep -c "また、行きたい場所へ" \\
  _wp移行素材/aspath-theme/front-page.php`,10);
  B.box(s,0.65,4.2,6.5,1.75,"見落としやすい点",
    "・同じ文言が data-en=\"…\"（英語版）にもある\n・<span class=\"nw\"> が文中に挟まっていることがある\n・数字（料金・年数）は複数ページに散っている\n  → 第10部「変えたら全ページ直すもの」を参照","warn");
  B.steps(s,7.4,1.5,5.2,[
    {t:"ZIPを管理画面からアップロード",d:"外観 → テーマ → 新規追加"},
    {t:"Super Page Cache を全消し",d:"忘れると変わりません"},
    {t:"未ログインで確認",d:"credentials:'omit' か シークレットウィンドウ"},
    {t:"commit / push",d:"生成物も一緒に入ります"},
  ],0.8,12);
  B.box(s,7.4,4.9,5.2,2.2,"確認に使える1行",
    "ブラウザのConsoleで：\n\nawait (await fetch('/',\n  {cache:'no-store',\n   credentials:'omit'}))\n  .text().then(t=>t.includes('新しい文言'))","info");
  s.addNotes("最頻の作業。grep → build → upload → purge → 未ログイン確認、の型。");
}

/* 17-8 作業例② コラム追加 */
{
  const s=P.addSlide();
  B.head(s,"作業例② 新しいコラム記事を追加する","ビルド不要。管理画面だけで完結します",{lv:"easy"});
  B.steps(s,0.65,1.5,7.2,[
    {t:"投稿 → 新規追加",d:"エディタは Gutenberg"},
    {t:"カテゴリーを「コラム」にする",d:"未選択だと一覧に出ません"},
    {t:"アイキャッチを設定する",d:"記事下の「前の記事／次の記事」カードに使われます"},
    {t:"本文を書く",d:"見出しは H2 から。H1 はタイトルが自動で持ちます"},
    {t:"SureRank でタイトルと説明文を設定",d:"タイトル60字以内／説明文60〜160字"},
    {t:"公開 → Search Console でURL検査 → インデックス登録をリクエスト",d:""},
  ],0.82,12.5);
  B.box(s,8.05,1.5,4.57,2.6,"見た目を変えたいとき",
    "コラム記事のレイアウトは taimentraining.html が元です。ここを直して再ビルドすると、全コラム記事の見た目が変わります。\n\n記事ごとに変えることはできません。","warn");
  B.box(s,8.05,4.3,4.57,2.8,"点検スクリプトの更新も忘れずに",
    "第6部の点検スクリプトと、ASPATHサイト点検スクリプト.js の PAGES 配列に、新しいURLを1行足してください。\n\n足さないと、そのページは点検の対象外のままになります。","ng");
  s.addNotes("記事追加はDB側。テーマは触らない。点検リストの更新だけ忘れられやすい。");
}

/* 17-9 作業例③ 新規ページ */
{
  const s=P.addSlide();
  B.head(s,"作業例③ 新しい固定ページを作る","5か所に手を入れます。1つ抜けると404か白紙になります",{lv:"together"});
  const steps=[
    ["1","元になるHTMLを作る","既存の近いページ（例：access.html）を複製して中身を差し替える"],
    ["2","build_wp_theme.py の PAGES に足す","ファイル名を配列に追加"],
    ["3","LINKS に公開URLを書く","'newpage.html':'/newpage/' の形。これが無いと内部リンクが変換されません"],
    ["4","CSS_SOURCES に追加","\"newpage\": \"newpage.html\" 。CSSが1本切り出されます"],
    ["5","mapping に page-*.php を追加","\"page-newpage.php\": (\"newpage.html\",\"説明\", False, None)"],
  ];
  let y=1.5;
  steps.forEach(([n,t,d])=>{
    s.addShape(P.ShapeType.roundRect,{x:0.65,y,w:11.97,h:0.78,rectRadius:0.1,fill:{color:"F7FAFA"},line:{color:C.LINE,width:1}});
    s.addShape(P.ShapeType.ellipse,{x:0.98,y:y+0.18,w:0.42,h:0.42,fill:{color:C.NAVY}});
    s.addText(n,{x:0.98,y:y+0.18,w:0.42,h:0.42,align:"center",valign:"middle",fontSize:14,bold:true,color:C.WHITE,fontFace:F,isTextBox:true,margin:0});
    s.addText(t,{x:1.62,y:y+0.07,w:4.3,h:0.32,fontSize:13.5,bold:true,color:C.NAVY,fontFace:F,isTextBox:true,margin:0,valign:"middle"});
    s.addText(d,{x:1.62,y:y+0.42,w:10.7,h:0.3,fontSize:11,color:C.MUTED,fontFace:MONO,isTextBox:true,margin:0,valign:"middle"});
    y+=0.86;
  });
  B.box(s,0.65,y+0.1,5.85,1.42,"WordPress側の作業",
    "ビルド後、管理画面で固定ページを新規作成し、スラッグを LINKS に書いたものと一致させ、テンプレートで page-newpage を選びます。","info");
  B.box(s,6.72,y+0.1,5.9,1.42,"最後に",
    "点検スクリプトの PAGES と、サイトマップページ（sitemap.html）にも追加してください。","warn");
  s.addNotes("新規ページは5か所。ここを箇条書きで持っておくと外注が楽になる。");
}

/* 17-10 作業例④ 画像 */
{
  const s=P.addSlide();
  B.head(s,"作業例④ 画像を差し替える","更新の印（?v=）が自動で変わるので、キャッシュは気にしなくて構いません",{lv:"step"});
  B.code(s,0.65,1.5,7.3,2.35,"",
`# 同じファイル名で置き換えるのがいちばん安全
cp 新しい画像.webp images/about-training-02-enrich.webp

python3 build_wp_theme.py

# ?v= が変わったことを確認
grep -o "about-training-02-enrich.webp?v=[a-f0-9]*" \\
  _wp移行素材/aspath-theme/front-page.php`,10);
  B.rows(s,0.65,4.05,7.3,[
    ["形式","WebP。JPG/PNGでも動くが2〜3割重い"],
    ["横幅","大 1600px ／ 記事中 1200px ／ 小 400px"],
    ["容量","1枚200KB以内。500KB超は必ず縮める"],
    ["名前","半角英数とハイフンのみ"],
  ],0.6,2.4,11);
  B.box(s,8.15,1.5,4.47,2.9,"?v= の仕組み",
    "img_ver() がファイルの中身をMD5にかけ、先頭8桁を付けています。\n\n中身が変われば印も変わるため、ブラウザは必ず新しい画像を取りに行きます。\n\nファイル名を変える必要はありません。","ok");
  B.box(s,8.15,4.6,4.47,2.5,"DBの本文にある画像は別扱い",
    "「ASPATHについて」と記事本文の画像は、the_content フィルタ（aspath_content_image_version）が更新日時から印を付けています。\n\nこちらはビルドとは無関係に効きます。","info");
  s.addNotes("画像はファイル名据え置きが基本。?v= の出どころを2系統とも書いておく。");
}

/* 17-11 地雷 */
{
  const s=P.addSlide();
  B.head(s,"触ると壊れるところ（技術的な地雷）","どれも実際に踏んだか、踏みかけたものです",{lv:"together"});
  const mines=[
    ["CSSを1本に結合する","同名セレクタが衝突します。実際に28個ぶつかっていたため、ページごとに分離しました"],
    ["生成後のPHPを直接編集","次のビルドで消えます。直すのは build_wp_theme.py 側"],
    ["公開中ページのスラッグ変更","検索順位がゼロに戻ります。/services/ が price.html なのもこの理由"],
    ["申込フォームのURL（taiken-2026as9y）","公式LINEからの導線が切れ、申し込みが届かなくなります"],
    ["data-en を持つ要素に子タグを足す","言語切替が textContent を総入れ替えするため、子タグが消えます。data-en-html を使ってください"],
    ["本文への Shift+Enter","スマホで不自然に折れます。改行は <br class=\"br-sp\"> のみ"],
    ["All in One SEO の有効化","SureRankと二重にメタタグが出ます。停止のまま or 削除"],
    ["LightStart の有効化","サイト全体が「準備中」になります"],
  ];
  let y=1.5;
  mines.forEach(([t,d],idx)=>{
    s.addShape(P.ShapeType.roundRect,{x:0.65,y,w:11.97,h:0.56,rectRadius:0.08,fill:{color:idx%2?C.PAPER:"F7FAFA"},line:{color:C.LINE,width:1}});
    s.addShape(P.ShapeType.ellipse,{x:0.95,y:y+0.13,w:0.3,h:0.3,fill:{color:C.RED}});
    s.addText("×",{x:0.95,y:y+0.13,w:0.3,h:0.3,align:"center",valign:"middle",fontSize:12,bold:true,color:C.WHITE,fontFace:F,isTextBox:true,margin:0});
    s.addText(t,{x:1.42,y:y+0.02,w:4.5,h:0.5,fontSize:12,bold:true,color:C.NAVY,fontFace:F,isTextBox:true,margin:0,valign:"middle"});
    s.addText(d,{x:6.05,y:y+0.02,w:6.3,h:0.5,fontSize:11,color:C.INK,fontFace:F,isTextBox:true,margin:0,valign:"middle",lineSpacingMultiple:1.1});
    y+=0.61;
  });
  B.box(s,0.65,y+0.1,11.97,0.55,"上4つは、踏むと公開中のサイトに影響が出ます。作業前に必ずZIPを1つ退避してください。","","ng");
  s.addNotes("地雷リスト。外注に渡すとき、この1枚だけでも事故はかなり減る。");
}

/* 17-12 ローカル確認とデプロイ */
{
  const s=P.addSlide();
  B.head(s,"ローカルでの確認方法とデプロイ手順","PHPを動かさなくても、見た目はHTMLのまま確認できます",{lv:"step"});
  B.code(s,0.65,1.5,6.3,2.5,"ローカル確認",
`# 1. HTMLをそのままブラウザで開く（最も手軽）
#    → 見た目とJSの確認はこれで足ります

# 2. PHPまで確認したいとき
#    Local / XAMPP などにWordPressを立て、
#    aspath-theme.zip を入れて動作確認

# 3. 本番相当の確認
#    WP STAGING のステージング環境へ`,10);
  B.code(s,0.65,4.2,6.3,2.5,"デプロイ",
`git pull
# … HTMLを編集 …
python3 build_wp_theme.py

# 管理画面: 外観 → テーマ → 新規追加
#           → テーマのアップロード（置き換え）
# Super Page Cache → Purge whole cache
# 未ログインで表示確認

git add -A && git commit && git push`,10);
  B.rows(s,7.2,1.5,5.42,[
    ["必要なもの","Python 3 のみ"],
    ["OS","Windows / macOS / Linux"],
    ["Node.js","この資料を作り直すときだけ必要"],
    ["FTP","使いません。ZIPアップロードのみ"],
    ["DB操作","通常の変更では不要"],
  ],0.62,2.0,11);
  B.box(s,7.2,4.75,5.42,2.35,"戻し方",
    "テーマは、ひとつ前の aspath-theme.zip をアップロードし直すだけで戻ります。\n\nZIPは日付を付けて世代を残してください。DBを戻す必要がある変更は、通常ありません。","ok");
  s.addNotes("環境構築のハードルが低いことを伝える。FTP不要・DB不要が効く。");
}

};
