// ASPATH 総合版 ── 第15部 TOPと固定ページを、自分で直す
//   第5部では流れだけを示しているが、実際に手を動かすための細部がなかった。
//   ここでは「どのファイルの、どこを、どう直して、どう反映するか」を最後まで書く。
//   AIの使い方は最後に置く。基本の操作が分かってからでないと、
//   AIが何を書き換えたのか判断できないため。
const { C, F, MONO, LV } = require("./総合版_lib.js");

module.exports = function build(P, B){

/* ══════════════ 第15部 扉 ══════════════ */
{ const s=P.addSlide();
  B.partCover(s,"15","TOPと固定ページを、自分で直す",[
    "直せる場所の地図 ─ どこがどのファイルか",
    "用意するもの ─ 道具は3つだけ",
    "手順（前半）Pull → 文章を探す",
    "手順（後半）テーマを作る → 上げる → 確かめる",
    "HTMLの読み方 ─ 触ってよい所・いけない所",
    "よく直す場所と、その探し方",
    "失敗したときの戻し方",
    "そのうえで、AIに手伝わせる",
    "レクチャーの進め方（60分）",
  ],C.SUND);
  s.addNotes("第5部の流れ図を、実作業レベルまで落とした章。レクチャーの主教材になる。");
}

/* 15-1 地図 */
{
  const s=P.addSlide();
  B.head(s,"直せる場所の地図","「このページはどこにあるか」が分かれば、半分終わりです",{lv:"read"});
  B.rows(s,0.65,1.5,11.97,[
    ["トップページ","index.html　← 直す機会がいちばん多いファイル"],
    ["プランと料金","price.html　※URLは /services/ です。ファイル名と違うので注意"],
    ["アクセス","access.html"],
    ["よくあるご質問","faq.html"],
    ["初回体験・お問い合わせ","contact.html"],
    ["プライバシーポリシー／特商法／サイトマップ","privacy.html ／ tokushoho.html ／ sitemap.html"],
    ["コラム一覧・お知らせ一覧","news.html ／ info.html（一覧の見た目。記事そのものは管理画面）"],
    ["ASPATHについて","管理画面から直せます（このページだけ本文をWordPressに置いています）"],
    ["コラム記事・お知らせ記事","管理画面から直せます"],
  ],0.55,4.6,11.5);
  B.box(s,0.65,6.45,11.97,0.62,"下の2つは管理画面。それ以外はパソコンでファイルを直します。","","info");
  s.addNotes("ファイル名とURLが一致しないのは price.html だけ。ここは毎回説明する。");
}

/* 15-2 道具 */
{
  const s=P.addSlide();
  B.head(s,"用意するもの ─ 道具は3つだけ","どれも一度入れれば、あとは使うだけです",{lv:"read"});
  const tools=[
    ["1","GitHub Desktop","ファイルを受け取る／返す道具。\n「Pull origin」で最新を取り、\n「Push origin」で返します。",C.NAVY],
    ["2","文字を書く道具","Windowsのメモ帳でも直せます。\nVSCode を入れておくと、\n検索と色分けで格段に楽になります。",C.SUN],
    ["3","テーマを作る.bat","フォルダの中にある\nダブルクリックするだけのファイル。\nZIPを作ってくれます。",C.GREEN],
  ];
  let x=0.65;
  tools.forEach(([n,t,d,col])=>{
    s.addShape(P.ShapeType.roundRect,{x,y:1.5,w:3.83,h:2.9,rectRadius:0.14,fill:{color:"F7FAFA"},line:{color:col,width:1.5}});
    s.addShape(P.ShapeType.ellipse,{x:x+1.62,y:1.75,w:0.6,h:0.6,fill:{color:col}});
    s.addText(n,{x:x+1.62,y:1.75,w:0.6,h:0.6,align:"center",valign:"middle",fontSize:20,bold:true,color:C.WHITE,fontFace:F,isTextBox:true,margin:0});
    s.addText(t,{x:x+0.25,y:2.5,w:3.33,h:0.4,align:"center",fontSize:15,bold:true,color:C.NAVY,fontFace:F,isTextBox:true,margin:0});
    s.addText(d,{x:x+0.25,y:2.98,w:3.33,h:1.3,align:"center",fontSize:11.5,color:C.MUTED,fontFace:F,isTextBox:true,margin:0,lineSpacingMultiple:1.3});
    x+=4.07;
  });
  B.box(s,0.65,4.6,5.85,2.3,"作業するフォルダ",
    "dev-aspath-life-main\n\nこの中に index.html などのファイルと、\n「テーマを作る.bat」が入っています。\n\nGitHub Desktop がこのフォルダを\n見ているので、場所は動かさないでください。","info");
  B.box(s,6.72,4.6,5.9,2.3,"Pythonが入っていないと動きません",
    "「テーマを作る.bat」を押したときに\n「Python が見つかりません」と出たら、\n画面に出る手順どおりに入れてください。\n\nインストール画面の\n「Add python.exe to PATH」に\n必ずチェックを入れます。","warn");
  s.addNotes("道具は3つ。VSCodeは必須ではないが、あると検索が楽。");
}

/* 15-3 手順（前半） */
{
  const s=P.addSlide();
  B.head(s,"手順（前半）Pull → 文章を探す","ここまでは、何を壊す心配もありません",{lv:"step"});
  B.steps(s,0.65,1.55,7.2,[
    {t:"GitHub Desktop を開いて「Pull origin」",d:"最初に必ず。忘れると、あとで直しが衝突します"},
    {t:"直したいページのファイルを開く",d:"TOPなら index.html。前ページの地図で確認"},
    {t:"Ctrl + F で、直したい文章を探す",d:"文章まるごとではなく、10〜15文字だけで探す"},
    {t:"見つけた文字だけを書き換える",d:"前後の < > は、1文字も触らない"},
    {t:"上書き保存（Ctrl + S）",d:""},
  ],0.9,13);
  B.box(s,8.1,1.55,4.52,2.5,"なぜ10〜15文字なのか",
    "HTMLの中では、文章の途中に見えない印が挟まっていることがあります。\n\n例：「鹿児島初｜パーキンソン病専門」\n→ 実際は「鹿児島初｜<span…>パーキンソン病専門</span>」\n\n短く区切って探すと、確実に見つかります。","info");
  B.box(s,8.1,4.25,4.52,2.65,"Pullを忘れると何が起きるか",
    "他の人が先に直していた場合、その変更を知らないまま上書きしてしまいます。\n\nGitHub Desktop が「Conflict（衝突）」と言い出したら、そこで手を止めてご連絡ください。\n\n無理に進めると、どちらの変更も壊れます。","warn");
  s.addNotes("前半は読み取りと編集だけ。ここでは事故は起きない。");
}

/* 15-4 手順（後半） */
{
  const s=P.addSlide();
  B.head(s,"手順（後半）テーマを作る → 上げる → 確かめる","ここからがサイトに反映される作業です",{lv:"step"});
  B.steps(s,0.65,1.55,7.2,[
    {t:"「テーマを作る.bat」をダブルクリック",d:"黒い画面が出て、最後に「成功しました」と出れば完了"},
    {t:"_wp移行素材 の中の aspath-theme.zip を確認",d:"日付が今日になっていればOK"},
    {t:"外観 → テーマ → 新規追加 → テーマのアップロード",d:"「テーマを置き換える」を選ぶ"},
    {t:"Super Page Cache → Purge whole cache",d:"これを忘れると、直したのに変わりません"},
    {t:"未ログインのスマホで、直した箇所を見る",d:"パソコンで見ると自分だけ新しく見えることがあります"},
    {t:"GitHub Desktop で Commit → Push origin",d:"何を直したか1行書いて残します"},
  ],0.86,13);
  B.box(s,8.1,1.55,4.52,2.9,"黒い画面が出ても大丈夫です",
    "「テーマを作る.bat」は、中でPythonというプログラムを動かしているだけです。\n\n途中で赤い文字が出て止まったら、その画面をそのまま撮影して送ってください。\n\n何が起きたか、文字を見れば分かります。","info");
  B.box(s,8.1,4.65,4.52,2.25,"⑥のPushを忘れると",
    "サイトは直っているのに、ファイルの記録が残りません。\n\n次に誰かがPullしたとき、直す前のファイルを取ってしまい、元に戻ってしまいます。\n\n必ずPushまでが1セットです。","ng");
  s.addNotes("④のキャッシュ削除と⑥のPushが、いちばん忘れられやすい。");
}

/* 15-5 HTMLの読み方 */
{
  const s=P.addSlide();
  B.head(s,"HTMLの読み方 ─ 触ってよい所・いけない所","覚えるのは1つだけ。「< > の中は触らない」",{lv:"read"});
  B.code(s,0.65,1.85,7.6,1.5,"index.html の例",
`<h3 class="wf-lead" data-en="Going out again">
  また、自分の足で出かけられる
</h3>`,12);
  s.addShape(P.ShapeType.roundRect,{x:0.65,y:3.6,w:3.68,h:1.35,rectRadius:0.1,fill:{color:"EDF6EE"},line:{color:C.GREEN,width:1.4}});
  s.addText("○ 直してよい",{x:0.9,y:3.75,w:3.2,h:0.34,fontSize:14,bold:true,color:C.GREEN,fontFace:F,isTextBox:true,margin:0});
  s.addText("また、自分の足で出かけられる\n＝ < > で挟まれていない文字",
    {x:0.9,y:4.14,w:3.2,h:0.7,fontSize:11.5,color:C.INK,fontFace:F,isTextBox:true,margin:0,lineSpacingMultiple:1.3});
  s.addShape(P.ShapeType.roundRect,{x:4.57,y:3.6,w:3.68,h:1.35,rectRadius:0.1,fill:{color:"FBEDEC"},line:{color:C.RED,width:1.4}});
  s.addText("× 触らない",{x:4.82,y:3.75,w:3.2,h:0.34,fontSize:14,bold:true,color:C.RED,fontFace:F,isTextBox:true,margin:0});
  s.addText("<h3 …> や class=\"wf-lead\"\n＝ 見た目と仕組みの指定",
    {x:4.82,y:4.14,w:3.2,h:0.7,fontSize:11.5,color:C.INK,fontFace:F,isTextBox:true,margin:0,lineSpacingMultiple:1.3});

  B.box(s,8.45,1.85,4.17,3.1,"data-en は英語版の文章です",
    "日本語を直したら、その行の data-en=\"…\" の中も直してください。\n\n英語が分からなければ、日本語だけ直してご連絡ください。英語はこちらで合わせます。\n\n放っておくと、英語表示にしたとき古い文章が出ます。","warn");
  B.rows(s,0.65,5.15,11.97,[
    ["本文の中で改行したいとき","Shift＋Enter は使わないでください。パソコンで整っても、スマホで不自然に折れます"],
    ["どうしても改行したいとき","そこだけご連絡ください。スマホでだけ折り返す専用の指定を入れます"],
  ],0.68,4.4,12);
  s.addNotes("「< > は触らない」の一点だけ覚えてもらう。data-en と手動改行は事故が多い。");
}

/* 15-6 よく直す場所 */
{
  const s=P.addSlide();
  B.head(s,"よく直す場所と、その探し方","Ctrl + F に、右の文字をそのまま入れてください",{lv:"step"});
  const rows=[
    ["TOPのキャッチコピー","index.html","14年以上、"],
    ["TOPの見出し（大きな文字）","index.html","アスパスのトレーニング"],
    ["ボタンの文字","index.html","に登録する"],
    ["料金（金額）","price.html","4,400"],
    ["キャンペーンの期限","price.html","2026年12月31日"],
    ["よくあるご質問の答え","faq.html","質問文の最初の10文字"],
    ["スタジオの説明","access.html","天文館"],
    ["お客様の声・モデルケース","index.html","もう一度、"],
  ];
  let y=1.5;
  rows.forEach(([t,f,k])=>{
    s.addShape(P.ShapeType.roundRect,{x:0.65,y,w:11.97,h:0.6,rectRadius:0.08,fill:{color:"F7FAFA"},line:{color:C.LINE,width:1}});
    s.addText(t,{x:0.95,y:y+0.04,w:4.3,h:0.52,fontSize:13,bold:true,color:C.NAVY,fontFace:F,isTextBox:true,margin:0,valign:"middle"});
    s.addText(f,{x:5.35,y:y+0.04,w:2.5,h:0.52,fontSize:12,color:C.MUTED,fontFace:MONO,isTextBox:true,margin:0,valign:"middle"});
    s.addShape(P.ShapeType.roundRect,{x:7.95,y:y+0.11,w:4.4,h:0.38,rectRadius:0.08,fill:{color:C.CODEBG}});
    s.addText(k,{x:8.1,y:y+0.11,w:4.1,h:0.38,fontSize:12,color:C.INK,fontFace:MONO,isTextBox:true,margin:0,valign:"middle"});
    y+=0.66;
  });
  B.box(s,0.65,y+0.06,11.97,0.6,"金額や年数を直すときは、第10部「変えたら、全ページ直すもの」も必ず見てください。","","warn");
  s.addNotes("実際に手を動かす場所の索引。レクチャーではTOPのキャッチコピーを題材にする。");
}

/* 15-7 戻し方 */
{
  const s=P.addSlide();
  B.head(s,"失敗したときの戻し方","3段階あります。上から順に試してください",{lv:"together"});
  const back=[
    ["1","保存する前に気づいた","Ctrl + Z を押すだけ。何回でも戻せます",C.GREEN],
    ["2","保存したが、まだZIPを作っていない","GitHub Desktop の「Changes」で、そのファイルを右クリック →「Discard changes」。直す前の状態に戻ります",C.SUN],
    ["3","サイトに上げたあとで気づいた","外観 → テーマ → 一つ前のZIPをアップロードし直す。手元にZIPが無ければご連絡ください",C.RED],
  ];
  let y=1.55;
  back.forEach(([n,t,d,col])=>{
    s.addShape(P.ShapeType.roundRect,{x:0.65,y,w:11.97,h:1.32,rectRadius:0.12,fill:{color:"F7FAFA"},line:{color:col,width:1.4}});
    s.addShape(P.ShapeType.ellipse,{x:1.0,y:y+0.42,w:0.48,h:0.48,fill:{color:col}});
    s.addText(n,{x:1.0,y:y+0.42,w:0.48,h:0.48,align:"center",valign:"middle",fontSize:16,bold:true,color:C.WHITE,fontFace:F,isTextBox:true,margin:0});
    s.addText(t,{x:1.72,y:y+0.18,w:10.6,h:0.38,fontSize:14.5,bold:true,color:C.NAVY,fontFace:F,isTextBox:true,margin:0});
    s.addText(d,{x:1.72,y:y+0.62,w:10.6,h:0.56,fontSize:12,color:C.INK,fontFace:F,isTextBox:true,margin:0,lineSpacingMultiple:1.25});
    y+=1.44;
  });
  B.box(s,0.65,y+0.06,11.97,1.05,"ZIPは、上書きせずに日付を付けて残してください",
    "aspath-theme_20260907.zip のように名前を変えて、別のフォルダに1つずつ貯めておくと、いつでも前の状態に戻せます。これが、いちばん安い保険です。","ok");
  s.addNotes("戻せることを先に伝えると、触る勇気が出る。ZIPの世代管理を習慣にしてもらう。");
}

/* 15-8 AIに手伝わせる */
{
  const s=P.addSlide();
  B.head(s,"そのうえで、AIに手伝わせる","基本の操作が分かってからにしてください。理由があります",{lv:"step"});
  B.box(s,0.65,1.5,11.97,0.95,"なぜ「基本を分かってから」なのか",
    "AIは、頼んでいない場所まで一緒に書き換えることがあります。どこが変わったか自分で見分けられないと、気づかないまま公開してしまいます。手順を一度でも自分でやっていれば、それが分かります。","warn");
  B.code(s,0.65,2.85,7.6,2.9,"AIにそのまま貼る",
`これは私のサイトのHTMLの一部です。

＜ここにコピーした部分を貼る＞

「また、自分の足で出かけられる」という文章を
「また、行きたい場所へ出かけられる」に変えてください。

条件：
・タグ（< > の部分）の構造は変えないでください
・data-en の英語も、意味を合わせて直してください
・変更した行だけを見せてください。全文はいりません`,10.5);
  B.rows(s,8.45,2.85,4.17,[
    ["渡すのは一部","前後10行ほどだけ"],
    ["1回に1か所","まとめて頼まない"],
    ["必ず見比べる","頼んだ場所だけか"],
    ["迷ったら貼らない","そのままご連絡を"],
  ],0.72,1.6,11);
  B.box(s,0.65,5.95,11.97,0.95,"第7部のプロンプト集と、第8部の調べる道具箱を組み合わせると、原因の特定まで自力でできます",
    "そこまで分かっていれば、こちらへの依頼も具体的になり、やり取りの回数が減ります。","ok");
  s.addNotes("AIは道具。判断は人が持つ。頼み方の型をそのまま渡す。");
}

/* 15-9 レクチャーの進め方 */
{
  const s=P.addSlide();
  B.head(s,"レクチャーの進め方（60分）","この順番で、実際に手を動かしていただきます",{lv:"read"});
  const plan=[
    ["0-10分","全体像をつかむ","第0部。3つの独立と、管理画面で直せる／パソコンで直す の2つの道",C.PURPLE],
    ["10-25分","記事を1本書いて公開する","基本編。すでにご経験があるので、復習と、つまずいた点の確認",C.GREEN],
    ["25-45分","TOPの1行を直して反映する","この第15部。Pull → 直す → ZIP → 上げる → 確認 → Push を通しで1周",C.SUND],
    ["45-55分","点検を1回やってみる","第6部のスクリプトを貼る。結果の読み方まで",C.RED],
    ["55-60分","困ったときの動き方","第13部。どこで手を止めるか、誰に連絡するか",C.NAVY],
  ];
  let y=1.55;
  plan.forEach(([w,t,d,col])=>{
    s.addShape(P.ShapeType.roundRect,{x:0.65,y,w:11.97,h:0.80,rectRadius:0.1,fill:{color:"F7FAFA"},line:{color:C.LINE,width:1}});
    s.addShape(P.ShapeType.roundRect,{x:0.95,y:y+0.17,w:1.5,h:0.46,rectRadius:0.1,fill:{color:col}});
    s.addText(w,{x:0.95,y:y+0.17,w:1.5,h:0.46,align:"center",valign:"middle",fontSize:11.5,bold:true,color:C.WHITE,fontFace:F,isTextBox:true,margin:0});
    s.addText(t,{x:2.7,y:y+0.08,w:4.0,h:0.34,fontSize:14,bold:true,color:C.NAVY,fontFace:F,isTextBox:true,margin:0,valign:"middle"});
    s.addText(d,{x:2.7,y:y+0.42,w:9.6,h:0.32,fontSize:11.5,color:C.MUTED,fontFace:F,isTextBox:true,margin:0,valign:"middle"});
    y+=0.86;
  });
  B.box(s,0.65,y+0.08,5.85,1.22,"当日までにご用意いただきたいもの",
    "GitHub Desktop に入れる／「テーマを作る.bat」が動く（Python）／WordPress にログインできる。動かないものは当日その場で一緒に入れます。","info");
  B.box(s,6.72,y+0.08,5.9,1.22,"AIの話は、この日には入れません",
    "60分は基本を通すことを優先します。AIの使い方は、一度ご自身で1周してから2回目に扱うのが、いちばん身につきます。","ok");
  s.addNotes("レクチャーの台本。AIは2回目に回す方針を明記しておく。");
}

};
