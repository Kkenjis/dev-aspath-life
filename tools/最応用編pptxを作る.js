// ASPATH サイト運用マニュアル 最応用編 ── 点検と修正
// 実行: NODE_PATH=<node_modules> node 最応用編pptxを作る.js
const pptx = require("pptxgenjs");

const P = new pptx();
P.layout = "LAYOUT_WIDE";
P.author = "ASPATH";
P.title  = "ASPATH サイト運用マニュアル 最応用編";

const NAVY="264653", DEEP="1E3A44", SUN="F4A261", SUND="DD8236",
      PAPER="F4E9D8", WHITE="FFFFFF", MUTED="52707A", INK="1E2D34",
      RED="B4453C", GREEN="2E7D32", CODEBG="F2F5F6";
const F="Meiryo", MONO="Consolas";

let no = 0;
function head(s, t, sub, dark) {
  no++;
  s.background = { color: dark ? NAVY : WHITE };
  s.addText(t, { x:0.6, y:0.32, w:12.1, h:0.66, fontSize:28, bold:true,
    color: dark?WHITE:NAVY, fontFace:F, valign:"middle", isTextBox:true, margin:0 });
  if (sub) s.addText(sub, { x:0.62, y:1.0, w:12.1, h:0.36, fontSize:14,
    color: dark?"C9D6DA":MUTED, fontFace:F, isTextBox:true, margin:0 });
  s.addText(String(no), { x:12.45, y:6.95, w:0.45, h:0.28, align:"right",
    fontSize:10.5, color: dark?"7E969E":"A8B4B8", fontFace:F, isTextBox:true, margin:0 });
}

function box(s,x,y,w,h,title,body,tone){
  const m={warn:{bg:"FDF0E6",bar:SUND,mk:"!"},ng:{bg:"FBEDEC",bar:RED,mk:"×"},
           ok:{bg:"EDF6EE",bar:GREEN,mk:"✓"},info:{bg:PAPER,bar:NAVY,mk:"i"}};
  const c=m[tone||"info"];
  s.addShape(P.ShapeType.roundRect,{x,y,w,h,rectRadius:0.12,fill:{color:c.bg},line:{color:c.bar,width:1.2}});
  s.addShape(P.ShapeType.ellipse,{x:x+0.24,y:y+0.22,w:0.34,h:0.34,fill:{color:c.bar}});
  s.addText(c.mk,{x:x+0.24,y:y+0.22,w:0.34,h:0.34,align:"center",valign:"middle",
    fontSize:14,bold:true,color:WHITE,fontFace:F,isTextBox:true,margin:0});
  s.addText([{text:title,options:{bold:true,color:NAVY,fontSize:14,breakLine:!!body}},
             {text:body||"",options:{color:INK,fontSize:12}}],
    {x:x+0.72,y:y+0.16,w:w-0.96,h:h-0.3,fontFace:F,isTextBox:true,margin:0,valign:"top",lineSpacingMultiple:1.15});
}

function code(s,x,y,w,h,label,text,fs){
  s.addShape(P.ShapeType.roundRect,{x,y,w,h,rectRadius:0.1,fill:{color:CODEBG},line:{color:"C9D5D9",width:1}});
  if(label){
    s.addShape(P.ShapeType.roundRect,{x:x+0.18,y:y-0.14,w:2.9,h:0.32,rectRadius:0.16,fill:{color:NAVY}});
    s.addText(label,{x:x+0.18,y:y-0.14,w:2.9,h:0.32,align:"center",valign:"middle",
      fontSize:10.5,bold:true,color:WHITE,fontFace:F,isTextBox:true,margin:0});
  }
  s.addText(text,{x:x+0.24,y:y+(label?0.26:0.16),w:w-0.48,h:h-(label?0.44:0.32),
    fontSize:fs||10.5,color:INK,fontFace:MONO,isTextBox:true,margin:0,valign:"top",lineSpacingMultiple:1.22});
}

function steps(s,x,y,w,items,gap,fs){
  const g=gap||0.7, size=fs||13.5;
  items.forEach((it,i)=>{
    const yy=y+i*g;
    s.addShape(P.ShapeType.ellipse,{x,y:yy+0.02,w:0.36,h:0.36,fill:{color:NAVY}});
    s.addText(String(i+1),{x,y:yy+0.02,w:0.36,h:0.36,align:"center",valign:"middle",
      fontSize:12.5,bold:true,color:WHITE,fontFace:F,isTextBox:true,margin:0});
    s.addText([{text:it.t,options:{bold:true,color:NAVY,fontSize:size,breakLine:true}},
               {text:it.d,options:{color:MUTED,fontSize:size-2}}],
      {x:x+0.5,y:yy-0.05,w:w-0.5,h:g+0.1,fontFace:F,isTextBox:true,margin:0,valign:"top"});
  });
}

/* ══════ 1 表紙 ══════ */
{
  const s=P.addSlide(); s.background={color:NAVY};
  s.addText("ASPATH",{x:0.9,y:1.45,w:8,h:0.5,fontSize:17,bold:true,color:SUN,charSpacing:6,fontFace:F,isTextBox:true,margin:0});
  s.addText("サイト運用マニュアル",{x:0.9,y:2.05,w:11,h:0.95,fontSize:42,bold:true,color:WHITE,fontFace:F,isTextBox:true,margin:0});
  s.addShape(P.ShapeType.roundRect,{x:0.9,y:3.2,w:2.5,h:0.64,rectRadius:0.32,fill:{color:SUN}});
  s.addText("最 応 用 編",{x:0.9,y:3.2,w:2.5,h:0.64,align:"center",valign:"middle",fontSize:18,bold:true,color:WHITE,fontFace:F,isTextBox:true,margin:0});
  s.addText("公開したあとの点検と、直し方",{x:0.9,y:4.15,w:11,h:0.45,fontSize:16,color:"CFE0E4",fontFace:F,isTextBox:true,margin:0});
  s.addText("サイトは作って終わりではありません。壊れていないかを定期的に確かめる、その方法をまとめました。",
    {x:0.9,y:4.75,w:11,h:0.45,fontSize:13,color:"9FBAC1",fontFace:F,isTextBox:true,margin:0});
  s.addText("2026年9月　ASPATH 様　ご納品資料",{x:0.9,y:6.3,w:8,h:0.4,fontSize:12,color:"9FBAC1",fontFace:F,isTextBox:true,margin:0});
  s.addNotes("この冊子は、点検を「毎月やる作業」として定着させることが目的。");
}

/* ══════ 2 なぜ点検が必要か ══════ */
{
  const s=P.addSlide();
  head(s,"なぜ点検が必要なのか","公開したあとにも、壊れることがあります");
  const facts=[
    ["156","画像1枚ごとに\n中身の無いページが\n作られていた","Googleのサイトリンクに\n「ASPATHロゴ」として\n拾われていました"],
    ["5","FAQの構造化データ\n6問のうち5問が\nページ上に無かった","Googleの規約違反です。\n無視されるか、\n対策の対象になります"],
    ["3","コラム3本の題名が\n60字を超えていた","2026年9月4日、\nこの点検スクリプトが\n見つけました"],
  ];
  facts.forEach(([n,t,d],i)=>{
    const x=0.65+i*4.05;
    s.addShape(P.ShapeType.roundRect,{x,y:1.6,w:3.75,h:3.9,rectRadius:0.12,fill:{color:"FBEDEC"},line:{color:RED,width:1.2}});
    s.addText(n,{x:x+0.2,y:1.8,w:3.35,h:0.85,align:"center",fontSize:44,bold:true,color:RED,fontFace:F,isTextBox:true,margin:0});
    s.addText(t,{x:x+0.2,y:2.7,w:3.35,h:1.1,align:"center",fontSize:13.5,bold:true,color:NAVY,fontFace:F,isTextBox:true,margin:0,lineSpacingMultiple:1.25});
    s.addText(d,{x:x+0.2,y:3.9,w:3.35,h:1.3,align:"center",fontSize:11.5,color:MUTED,fontFace:F,isTextBox:true,margin:0,lineSpacingMultiple:1.25});
  });
  box(s,0.65,5.7,11.97,1.0,"いずれも、見た目では気づけませんでした",
    "サイトは普通に表示されていました。中身を機械的に調べて、はじめて分かったことです。だから点検が必要です。","warn");
  s.addNotes("実例3つ。すべてこの案件で実際に起きた。見た目では分からないことを強調。");
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

/* ══════ 15 まとめ ══════ */
{
  const s=P.addSlide();
  s.background={color:NAVY};
  s.addText("最応用編のまとめ",{x:0.9,y:0.85,w:11.5,h:0.75,fontSize:32,bold:true,color:WHITE,fontFace:F,isTextBox:true,margin:0});
  const sum=[
    ["1","月に1回、5分","F12 → Console →\nスクリプトを貼る"],
    ["2","○だけなら何もしない","×が出たら、一覧を\nコピーして送るだけ"],
    ["3","テーマZIPの後は必ず","入れ替えで前の修正が\n巻き戻ることがあります"],
  ];
  sum.forEach(([n,t,d],i)=>{
    const x=0.9+i*4.05;
    s.addShape(P.ShapeType.roundRect,{x,y:1.95,w:3.7,h:3.3,rectRadius:0.14,fill:{color:DEEP}});
    s.addShape(P.ShapeType.roundRect,{x:x+1.48,y:2.25,w:0.75,h:0.75,rectRadius:0.38,fill:{color:SUN}});
    s.addText(n,{x:x+1.48,y:2.25,w:0.75,h:0.75,align:"center",valign:"middle",fontSize:28,bold:true,color:WHITE,fontFace:F,isTextBox:true,margin:0});
    s.addText(t,{x:x+0.2,y:3.15,w:3.3,h:0.5,align:"center",fontSize:16,bold:true,color:WHITE,fontFace:F,isTextBox:true,margin:0});
    s.addText(d,{x:x+0.2,y:3.75,w:3.3,h:1.2,align:"center",fontSize:12.5,color:"AFC8CE",fontFace:F,isTextBox:true,margin:0,lineSpacingMultiple:1.35});
  });
  s.addText("この点検は、実際に156ページの無駄なページと、規約違反の申告と、題名超過3件を見つけました。",
    {x:0.9,y:5.65,w:11.5,h:0.45,fontSize:14,color:"CFE0E4",fontFace:F,isTextBox:true,margin:0});
  s.addText("基本編（日々の更新）／応用編（壊さない触り方）／AI活用編（プロンプト集）もあわせてご覧ください。",
    {x:0.9,y:6.25,w:11.5,h:0.45,fontSize:12.5,color:"9FBAC1",fontFace:F,isTextBox:true,margin:0});
  s.addNotes("点検の実績を示して、やる価値があることを伝えて終了。");
}

P.writeFile({fileName:"/tmp/deck6/ASPATH_サイト運用マニュアル_最応用編.pptx"})
 .then(f=>console.log("作成:",f));
