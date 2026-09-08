// ASPATH 総合版 ── 第20部 パソコンの準備（Windows / Mac / その他）
//   引き継ぐ相手のOSが分からない前提で書く。
//   「どのOSでも、やることは同じ3つ」→「OSごとの入れ方」→「つまずきどころ」の順。
const { C, F, MONO, LV } = require("./総合版_lib.js");

module.exports = function build(P, B){

/* OS別の手順表を描く小道具 */
function osTable(s, y0, rows, headColor){
  s.addShape(P.ShapeType.roundRect,{x:0.65,y:y0,w:11.97,h:0.4,rectRadius:0.08,fill:{color:headColor||C.NAVY}});
  [["やること",0.95,2.4],["操作",3.45,4.6],["確かめ方（この通りに出れば成功）",8.25,4.2]].forEach(([t,x,w])=>{
    s.addText(t,{x,y:y0,w,h:0.4,fontSize:11.5,bold:true,color:C.WHITE,fontFace:F,isTextBox:true,margin:0,valign:"middle"});
  });
  let y=y0+0.46;
  rows.forEach(([a,b,c],i)=>{
    s.addShape(P.ShapeType.roundRect,{x:0.65,y,w:11.97,h:0.72,rectRadius:0.08,
      fill:{color:i%2?C.PAPER:"F7FAFA"},line:{color:C.LINE,width:1}});
    s.addText(a,{x:0.95,y:y+0.02,w:2.4,h:0.68,fontSize:11.5,bold:true,color:C.NAVY,fontFace:F,isTextBox:true,margin:0,valign:"middle",lineSpacingMultiple:1.15});
    s.addText(b,{x:3.45,y:y+0.02,w:4.6,h:0.68,fontSize:10.5,color:C.INK,fontFace:F,isTextBox:true,margin:0,valign:"middle",lineSpacingMultiple:1.2});
    s.addText(c,{x:8.25,y:y+0.02,w:4.15,h:0.68,fontSize:10,color:C.MUTED,fontFace:MONO,isTextBox:true,margin:0,valign:"middle",lineSpacingMultiple:1.2});
    y+=0.78;
  });
  return y;
}

/* ══════════════ 第20部 扉 ══════════════ */
{ const s=P.addSlide();
  B.partCover(s,"20","パソコンの準備",[
    "どのOSでも、必要なものは3つだけ",
    "Windows での入れ方（画面の言葉そのままで）",
    "Mac での入れ方",
    "Linux・その他／iPad・Chromebook しか無いとき",
    "同梱した3つの実行ファイルの使い分け",
    "OSが違うと、ここでつまずく（改行・文字・権限・フォント）",
    "端末で動くAIの入れ方と、ブラウザのAIとの使い分け",
  ],C.GREEN);
  s.addNotes("引き継ぐ相手のOSが不明な前提。OS差の実害だけを具体的に。");
}

/* 20-1 必要なものは3つ */
{
  const s=P.addSlide();
  B.head(s,"どのOSでも、必要なものは3つだけ","OSが違っても、やることは変わりません",{lv:"read"});
  const three=[
    ["1","Git（ギット）",C.NAVY,"ファイルを受け取る／返す道具。\nGitHub Desktop を入れると、\nボタン2つで使えます。",
     "Windows・Mac は公式アプリ。\nLinux はコマンド版（git）を使います。"],
    ["2","文字を書く道具",C.SUND,"メモ帳でも直せますが、\nVSCode を入れると\n検索と色分けで格段に楽です。",
     "Windows・Mac・Linux すべてに\n同じものがあります。設定も共通です。"],
    ["3","Python 3",C.GREEN,"テーマZIPを作るのに使います。\n外部の部品は一切不要。\n標準のものだけで動きます。",
     "Mac・Linux は最初から入っていることが\n多いです。Windows は入れます。"],
  ];
  three.forEach(([n,t,col,d,os],i)=>{
    const x=0.65+i*4.05;
    s.addShape(P.ShapeType.roundRect,{x,y:1.5,w:3.75,h:3.55,rectRadius:0.12,fill:{color:"F7FAFA"},line:{color:col,width:1.4}});
    s.addShape(P.ShapeType.ellipse,{x:x+1.575,y:1.72,w:0.6,h:0.6,fill:{color:col}});
    s.addText(n,{x:x+1.575,y:1.72,w:0.6,h:0.6,align:"center",valign:"middle",fontSize:20,bold:true,color:C.WHITE,fontFace:F,isTextBox:true,margin:0});
    s.addText(t,{x:x+0.25,y:2.45,w:3.25,h:0.36,align:"center",fontSize:14.5,bold:true,color:C.NAVY,fontFace:F,isTextBox:true,margin:0});
    s.addText(d,{x:x+0.3,y:2.88,w:3.15,h:1.1,align:"center",fontSize:11,color:C.INK,fontFace:F,isTextBox:true,margin:0,lineSpacingMultiple:1.3});
    s.addText(os,{x:x+0.3,y:4.05,w:3.15,h:0.85,align:"center",fontSize:10,color:C.MUTED,fontFace:F,isTextBox:true,margin:0,lineSpacingMultiple:1.3});
  });
  B.box(s,0.65,5.2,5.85,0.95,"入れなくてよいもの",
    "サーバーソフト・データベース・Docker・Node.js。このサイトの更新には、どれも要りません。","ok");
  B.box(s,6.77,5.2,5.85,0.95,"どれか入らなくても、詰みません",
    "Pythonが入らない端末でも、他の機で作ったZIPをコピーして持ち込めば、更新はできます。","info");
  B.box(s,0.65,6.3,11.97,0.84,"自分のOSが分からないとき",
    "Windows：左下のスタートボタンを右クリック →「システム」／Mac：画面左上のリンゴマーク →「このMacについて」。ここに書いてある名前がOSです。","warn");
  s.addNotes("必要なのは3つだけ、入れなくてよいものを先に言うと安心する。");
}

/* 20-2 Windows */
{
  const s=P.addSlide();
  B.head(s,"Windows での入れ方","画面に出てくる言葉を、そのまま書いています",{lv:"step"});
  const y=osTable(s,1.5,[
    ["Python を入れる","python.org →「Downloads」→ Windows 版\n※ 最初の画面の「Add python.exe to PATH」に必ずチェック","py --version\n→ Python 3.x.x"],
    ["GitHub Desktop","desktop.github.com からダウンロード\n→ サインイン → リポジトリを Clone","画面にファイル名が並べば成功"],
    ["VSCode（任意）","code.visualstudio.com からダウンロード\n日本語化の案内が出たら「はい」","フォルダを開いて Ctrl+Shift+F で検索"],
    ["ビルドしてみる","フォルダの「テーマを作る.bat」をダブルクリック","「成功しました」と出る"],
  ]);
  B.box(s,0.65,y+0.1,5.85,1.5,"「Add python.exe to PATH」を忘れたとき",
    "batを動かすと「Python が見つかりません」と出ます。入れ直しになりますが、消してから入れ直せば直ります。いちばん多いつまずきです。","ng");
  B.box(s,6.77,y+0.1,5.85,1.5,"文字化けするとき",
    "batの1行目に chcp 65001 を入れてあります。それでも化けるときは、PowerShell ではなくコマンドプロンプトで実行してください。","warn");
  s.addNotes("PATHのチェック忘れが最頻出。ここだけ強調する。");
}

/* 20-3 Mac */
{
  const s=P.addSlide();
  B.head(s,"Mac での入れ方","Python は最初から入っていることが多いです",{lv:"step"});
  const y=osTable(s,1.5,[
    ["Python を確かめる","「ターミナル」を開いて、下のコマンドを打つ\n無ければ xcode-select --install で入ります","python3 --version\n→ Python 3.x.x"],
    ["GitHub Desktop","desktop.github.com → Mac 版\n※ Apple シリコンか Intel かを選ぶ画面が出ます","画面にファイル名が並べば成功"],
    ["VSCode（任意）","code.visualstudio.com → Mac 版\nアプリケーションフォルダへドラッグ","フォルダを開いて ⌘+Shift+F で検索"],
    ["ビルドしてみる","「テーマを作る.command」をダブルクリック\n初回は右クリック →「開く」→ もう一度「開く」","「成功しました」と出る"],
  ], C.DEEP);
  B.box(s,0.65,y+0.1,5.85,1.5,"「開発元が未確認のため開けません」",
    "Mac が初めてのファイルを警告しているだけです。右クリック →「開く」を2回で通ります。設定 → プライバシーとセキュリティ →「このまま開く」でも構いません。","warn");
  B.box(s,6.77,y+0.1,5.85,1.5,"「Permission denied」と出たら",
    "実行の許可が外れています。ターミナルで chmod +x と打ち、そのあとにファイルをドラッグして Enter。1回で直ります。","info");
  s.addNotes("Macの2大つまずき：Gatekeeper と 実行権限。");
}

/* 20-4 Linux・その他 */
{
  const s=P.addSlide();
  B.head(s,"Linux・その他の環境","端末しか無い場合や、パソコンを持っていない場合",{lv:"read"});
  B.rows(s,0.65,1.5,11.97,[
    ["Linux（Ubuntu など）","sudo apt install git python3　→ ターミナルで bash テーマを作る.sh"],
    ["Windows の WSL","Ubuntu と同じ手順です。ただしファイルは /mnt/c/… ではなく WSL 側に置くほうが速く動きます"],
    ["Chromebook","Linux 環境（Crostini）を有効にすれば、上の Linux と同じ手順で動きます"],
    ["iPad・スマホのみ","ビルドはできません。ただし、記事の追加・お知らせ・コメント返信・申込確認は、管理画面から全部できます"],
    ["パソコンが無いとき","他の機で作った aspath-theme.zip を受け取り、管理画面からアップロードするだけで更新できます"],
    ["サーバー上で直接","おすすめしません。元に戻せなくなります。必ず手元で作って、ZIPを上げる形にしてください"],
  ],0.7,3.4,11.5);
  B.box(s,0.65,5.85,5.85,1.28,"共通していること",
    "このサイトの更新に、特別な環境は要りません。Python 3 が動けば、どのOSでも同じZIPができます。","ok");
  B.box(s,6.77,5.85,5.85,1.28,"OSが変わっても、生成物は同じ",
    "同じHTMLからは、同じテーマができます。WindowsとMacで作り分ける必要はありません。","info");
  s.addNotes("iPadしか無くても運用は回る、と伝えるのが親切。");
}

/* 20-5 3つの実行ファイル */
{
  const s=P.addSlide();
  B.head(s,"同梱した3つの実行ファイル","中身は同じです。OSに合わせて選んでください",{lv:"easy"});
  const files=[
    ["テーマを作る.bat","Windows",C.NAVY,"ダブルクリック",
     "Python を py → python の順で探し、\n見つからなければ入れ方を画面に出します。\n成功するとエクスプローラーが開きます。"],
    ["テーマを作る.command","Mac",C.SUND,"ダブルクリック",
     "初回だけ、右クリック →「開く」が必要です。\n成功すると Finder が開きます。\n（今回、新しく用意しました）"],
    ["テーマを作る.sh","Linux・WSL",C.GREEN,"bash テーマを作る.sh",
     "ターミナルから実行します。\nパッケージの入れ方も画面に出ます。\n（今回、新しく用意しました）"],
  ];
  files.forEach(([f,os,col,how,d],i)=>{
    const x=0.65+i*4.05;
    s.addShape(P.ShapeType.roundRect,{x,y:1.5,w:3.75,h:3.5,rectRadius:0.12,fill:{color:"F7FAFA"},line:{color:col,width:1.4}});
    s.addShape(P.ShapeType.roundRect,{x:x+0.25,y:1.72,w:3.25,h:0.44,rectRadius:0.1,fill:{color:col}});
    s.addText(os,{x:x+0.25,y:1.72,w:3.25,h:0.44,align:"center",valign:"middle",fontSize:13,bold:true,color:C.WHITE,fontFace:F,isTextBox:true,margin:0});
    s.addText(f,{x:x+0.2,y:2.3,w:3.35,h:0.34,align:"center",fontSize:12.5,bold:true,color:C.NAVY,fontFace:MONO,isTextBox:true,margin:0});
    s.addText(how,{x:x+0.2,y:2.7,w:3.35,h:0.3,align:"center",fontSize:11,color:col,fontFace:MONO,isTextBox:true,margin:0});
    s.addText(d,{x:x+0.3,y:3.15,w:3.15,h:1.6,fontSize:10.5,color:C.INK,fontFace:F,isTextBox:true,margin:0,lineSpacingMultiple:1.3});
  });
  B.box(s,0.65,5.15,11.97,0.95,"どれも、やっていることは python3 build_wp_theme.py の1行だけです",
    "画面に日本語の案内を出し、失敗したときに何をすればよいかを表示しているのが、残りの中身です。中を読めば、何が起きているか分かります。","info");
  B.box(s,0.65,6.25,11.97,0.9,"コマンドが平気な方へ",
    "3つとも使わず、フォルダで python3 build_wp_theme.py と打つだけでも同じです。2〜3秒で _wp移行素材/aspath-theme.zip ができます。","ok");
  s.addNotes("3つとも中身は同じ。コマンドが平気なら不要、も明記。");
}

/* 20-6 OS差のつまずき */
{
  const s=P.addSlide();
  B.head(s,"OSが違うと、ここでつまずきます","知らないと原因不明になる6つです",{lv:"read"});
  const rows=[
    ["改行の記号が違う","Windows は CRLF、Mac・Linux は LF。混ざると、変更していない行まで「変わった」と表示されます",
     "GitHub Desktop の設定は既定のままで構いません。差分が全行赤くなったら、これを疑ってください"],
    ["日本語のファイル名","このリポジトリは日本語名のファイルを使っています。Mac は濁点の扱いが違い、別名として見えることがあります",
     "見えなくても消さないでください。GitHub 上で見れば、正しい名前が確認できます"],
    ["フォルダの区切り","Windows は ¥（\\）、Mac・Linux は /。AIに場所を伝えるときは、どちらでも通じます",
     "build_wp_theme.py は両方に対応済みです。書き換え不要です"],
    ["実行の許可","Mac・Linux は、ファイルに「実行してよい」印が要ります。Windows にはこの考え方がありません",
     "Permission denied と出たら chmod +x を1回。それだけです"],
    ["日本語フォント","資料を作り直すとき、フォントが無いと中国語の字形になります（実際に起きました）",
     "tools/assets/fonts.conf を入れてから作り直してください。手順は 総合版を作り直す.sh の中にあります"],
    ["見えない文字","コピーの途中で、目に見えない空白が混ざることがあります。OSをまたぐと特に起きます",
     "貼り付けたのに動かないときは、その行だけ手で打ち直すのが早いです"],
  ];
  let y=1.5;
  rows.forEach(([t,d,how],i)=>{
    s.addShape(P.ShapeType.roundRect,{x:0.65,y,w:11.97,h:0.9,rectRadius:0.08,
      fill:{color:i%2?C.PAPER:"F7FAFA"},line:{color:C.LINE,width:1}});
    s.addText(t,{x:0.95,y:y+0.04,w:2.3,h:0.82,fontSize:11.5,bold:true,color:C.NAVY,fontFace:F,isTextBox:true,margin:0,valign:"middle",lineSpacingMultiple:1.15});
    s.addText(d,{x:3.35,y:y+0.04,w:5.0,h:0.82,fontSize:10,color:C.INK,fontFace:F,isTextBox:true,margin:0,valign:"middle",lineSpacingMultiple:1.2});
    s.addText(how,{x:8.5,y:y+0.04,w:3.9,h:0.82,fontSize:10,color:C.MUTED,fontFace:F,isTextBox:true,margin:0,valign:"middle",lineSpacingMultiple:1.2});
    y+=0.96;
  });
  s.addNotes("6つとも実際に踏んだもの。フォントの件は実話。");
}

/* 20-7 端末で動くAI（導入） */
{
  const s=P.addSlide();
  B.head(s,"端末で動くAIを入れる","ファイルを直接読み書きできるAIです。OSごとに入れ方が違います",{lv:"together"});
  const y=osTable(s,1.5,[
    ["前準備（共通）","Node.js を入れる（nodejs.org の LTS 版）\n※ 端末で動くAIの多くが、これを使います","node --version\n→ v20 以上"],
    ["Windows","PowerShell を開いて、公式の案内どおりに導入\nWSL を入れている場合は、WSL 側に入れるほうが安定します","claude --version など\nバージョンが出れば成功"],
    ["Mac","ターミナルから導入。Homebrew を使う場合は brew を先に\n（brew.sh の1行をターミナルに貼る）","同上"],
    ["Linux・WSL","ターミナルから導入。sudo が必要な場合があります","同上"],
  ], C.DEEP);
  B.box(s,0.65,y+0.1,5.85,1.5,"最初にすること",
    "作業フォルダ（dev-aspath-life-main）の中で起動してください。別の場所で起動すると、このサイトのファイルが見えません。","warn");
  B.box(s,6.77,y+0.1,5.85,1.5,"料金が発生します",
    "多くは有料の契約が要ります。月あたりの費用と、誰の名義で契約するかを、先に決めておいてください。","ng");
  s.addNotes("具体的なコマンドは提供元で変わるため、確かめ方だけ固定で書く。");
}

/* 20-8 使い分け */
{
  const s=P.addSlide();
  B.head(s,"ブラウザのAIと、端末で動くAIの使い分け","どちらか一方ではなく、場面で選びます",{lv:"read"});
  const two=[
    ["ブラウザのAI",C.SUND,"FDF0E6",
     ["画面のスクリーンショットを貼って相談できる","入れるものが無い。今日から使える","返ってきたコードは、自分で貼る","相手はファイルを見ていない。毎回説明が要る","記事の下書き・文言・調べもの向き"]],
    ["端末で動くAI",C.NAVY,"F7FAFA",
     ["フォルダの中身を、そのまま読める","「index.htmlの、この文言」で通じる","直して、ビルドまで一気にやれる","導入と、月々の費用が要る","機能の追加・一括修正・調査向き"]],
  ];
  two.forEach(([t,col,bg,items],i)=>{
    const x=0.65+i*6.07;
    s.addShape(P.ShapeType.roundRect,{x,y:1.5,w:5.9,h:3.3,rectRadius:0.12,fill:{color:bg},line:{color:col,width:1.4}});
    s.addText(t,{x:x+0.3,y:1.7,w:5.3,h:0.4,fontSize:15,bold:true,color:col,fontFace:F,isTextBox:true,margin:0});
    s.addText(items.map((v,j)=>({text:v,options:{bullet:true,breakLine:j<items.length-1}})),
      {x:x+0.4,y:2.2,w:5.15,h:2.45,fontSize:11.5,color:C.INK,fontFace:F,isTextBox:true,margin:0,paraSpaceAfter:7});
  });
  B.rows(s,0.65,5.0,11.97,[
    ["山口様は、まずブラウザ版で十分です","文言の下書き、記事の案、分からない言葉の意味。ここから始めてください"],
    ["開発者に頼むときは、端末で動くAIを前提に","作業の速さが変わります。この案件も、そちらで進めました"],
  ],0.66,4.6,12);
  B.box(s,0.65,6.42,11.97,0.72,"どちらを使っても、本番へ反映する最後の一手は人が押す。ここだけは変わりません。","","ng");
  s.addNotes("山口様＝ブラウザ版、開発者＝端末版、という住み分けを明示。");
}

/* 20-9 動作確認 */
{
  const s=P.addSlide();
  B.head(s,"引き継いだら、最初にこれを試してください","7つ通れば、環境の準備は完了です",{lv:"step"});
  const chk=[
    ["Git が動く","GitHub Desktop で Pull origin が押せる","画面にファイル名が並ぶ"],
    ["Python が動く","python3 --version（Windows は py --version）","Python 3.x.x と出る"],
    ["ビルドが通る","OSに合った「テーマを作る」を実行","「成功しました」と出る"],
    ["ZIPができている","_wp移行素材/aspath-theme.zip の日付を見る","今日の日付になっている"],
    ["テーマが上がる","管理画面 → 外観 → テーマ → 新規追加","「テーマを置き換える」が選べる"],
    ["表示が変わる","Super Page Cache を全消し → 未ログインで見る","直した箇所が変わっている"],
    ["返せる","GitHub Desktop で Commit → Push origin","GitHub 側に反映される"],
  ];
  let y=1.5;
  chk.forEach(([t,how,ok],i)=>{
    s.addShape(P.ShapeType.roundRect,{x:0.65,y,w:11.97,h:0.72,rectRadius:0.08,fill:{color:"F7FAFA"},line:{color:C.LINE,width:1}});
    s.addShape(P.ShapeType.roundRect,{x:0.95,y:y+0.19,w:0.34,h:0.34,rectRadius:0.06,fill:{color:C.WHITE},line:{color:C.NAVY,width:1.3}});
    s.addText(t,{x:1.45,y:y+0.02,w:2.6,h:0.68,fontSize:12,bold:true,color:C.NAVY,fontFace:F,isTextBox:true,margin:0,valign:"middle"});
    s.addText(how,{x:4.2,y:y+0.02,w:4.6,h:0.68,fontSize:10.5,color:C.INK,fontFace:F,isTextBox:true,margin:0,valign:"middle"});
    s.addShape(P.ShapeType.roundRect,{x:8.95,y:y+0.13,w:3.45,h:0.46,rectRadius:0.06,fill:{color:"EDF3F1"}});
    s.addText(ok,{x:9.1,y:y+0.13,w:3.15,h:0.46,fontSize:10,color:C.GREEN,fontFace:F,isTextBox:true,margin:0,valign:"middle"});
    y+=0.78;
  });
  B.box(s,0.65,y+0.06,11.97,0.6,"⑥だけは、必ず未ログインのスマートフォンで確認してください。ログイン中は、自分にだけ新しく見えます。","","warn");
  s.addNotes("この7つが通れば環境構築は終わり。⑥のログイン状態が最頻出の勘違い。");
}

/* 20-10 切り分け */
{
  const s=P.addSlide();
  B.head(s,"うまくいかないときの切り分け","上から順に見れば、たいてい原因にたどり着きます",{lv:"together"});
  B.steps(s,0.65,1.55,7.2,[
    {t:"エラーの文字を、そのまま読む",d:"英語でも構いません。コピーしてAIに貼れば意味を教えてくれます"},
    {t:"どこまで進んだかを確かめる",d:"ZIPができているか。できていれば、原因はビルドより後です"},
    {t:"別のOS・別の機で試す",d:"片方で動くなら、原因は環境。両方で駄目なら、原因はファイル"},
    {t:"Pull からやり直す",d:"手元のファイルが古い、というのはよくあります"},
    {t:"それでも駄目なら、そこで止める",d:"エラーの画面を撮って、ご連絡ください。無理に進めないこと"},
  ],0.82,13);
  B.box(s,8.15,1.55,4.47,2.6,"よくある3つ",
    "・Python が見つからない\n　→ PATH のチェック忘れ（Windows）\n\n・Permission denied\n　→ chmod +x（Mac・Linux）\n\n・直したのに変わらない\n　→ キャッシュ。第6部を参照","warn");
  B.box(s,8.15,4.35,4.47,2.8,"ここまで来れば、壊れません",
    "手元でどれだけ失敗しても、本番のサイトには影響しません。\n\n本番が変わるのは、テーマZIPをアップロードした瞬間だけです。\n\nそれまでは、何度でもやり直して構いません。","ok");
  s.addNotes("手元の失敗は本番に影響しない、で締める。心理的ハードルを下げる。");
}

};
