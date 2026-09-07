// ASPATH 総合版 ── 第8部（開発者の作業を、自分でやる）／第9部（集客の仕組み）
// 単体では出力しない。総合版pptxを作る.js から読み込まれる。
const { C, F, MONO, LV } = require("./総合版_lib.js");

module.exports = function build(P, B){

/* ══════════════ 第8部 扉 ══════════════ */
{ const s=P.addSlide();
  B.partCover(s,"8","開発者の作業を、自分でやる",[
    "考え方 ─ 「調べる」と「直す」は別のこと",
    "調べる道具箱 ─ 貼るだけで分かる6つ",
    "AIに、開発者と同じ仕事をさせる",
    "作業の型 ─ 調べる → 相談する → 直す → 確かめる",
    "ここまでは自分で、ここからは相談",
  ],C.GREEN);
  s.addNotes("この部が「幸喜と同じことをやる」ための章。調査を自動化し、判断をAIに委ねる。");
}

/* 考え方 */
{
  const s=P.addSlide();
  B.head(s,"考え方 ─「調べる」と「直す」は別のこと","分けて考えると、できることが一気に増えます",{lv:"read"});
  s.addShape(P.ShapeType.roundRect,{x:0.65,y:1.5,w:5.9,h:2.5,rectRadius:0.12,fill:{color:"EDF6EE"},line:{color:C.GREEN,width:1.4}});
  s.addText("調べる",{x:0.95,y:1.7,w:5.3,h:0.45,fontSize:19,bold:true,color:C.GREEN,fontFace:F,isTextBox:true,margin:0});
  s.addText("サイトを読み取るだけ。何も書き換えません。\n\n失敗しても壊れないので、いくらでも試せます。\nここは、山口様がご自身でどんどんやって大丈夫です。",
    {x:0.95,y:2.25,w:5.3,h:1.6,fontSize:12.5,color:C.INK,fontFace:F,isTextBox:true,margin:0,lineSpacingMultiple:1.3});
  s.addShape(P.ShapeType.roundRect,{x:6.72,y:1.5,w:5.9,h:2.5,rectRadius:0.12,fill:{color:"FDF0E6"},line:{color:C.SUND,width:1.4}});
  s.addText("直す",{x:7.02,y:1.7,w:5.3,h:0.45,fontSize:19,bold:true,color:C.SUND,fontFace:F,isTextBox:true,margin:0});
  s.addText("サイトを書き換えます。\n\n影響が出るので、慎重に。\nただし、直す場所さえ分かっていれば、\n作業自体は数クリックで終わることがほとんどです。",
    {x:7.02,y:2.25,w:5.3,h:1.6,fontSize:12.5,color:C.INK,fontFace:F,isTextBox:true,margin:0,lineSpacingMultiple:1.3});

  B.rows(s,0.65,4.25,11.97,[
    ["開発者がやっていたこと","実は8割が「調べる」でした。どこが悪いかを突き止めるのに時間がかかり、直すのは一瞬です。"],
    ["だから、こうします","調べる部分を、貼るだけの道具にしました。これで、原因の特定までは山口様ができます。"],
    ["残るのは判断だけ","「これは自分で直せるか、相談すべきか」。その判断の目安も、この部に書いてあります。"],
  ],0.85,3.4,12.5);
  B.box(s,0.65,6.95,11.97,0.45,"","","info");
  s.addNotes("調査と修正の分離。調査は安全なので恐れず試してよい。");
}

/* 道具箱1：一覧を書き出す */
{
  const s=P.addSlide();
  B.head(s,"道具① サイトの状態を一覧で書き出す","いま何ページあって、どんな状態かが表で出ます",{lv:"step"});
  B.code(s,0.65,1.8,8.15,3.5,"Chromeのコンソールに貼ります",
`const P=['/','/about/','/services/','/access/','/contact/',
 '/faq/','/column/','/campaign/','/sukumiashitaisaku/'];
const r=[];
for(const u of P){
  const t=await (await fetch(u+'?x='+Date.now(),
    {cache:'no-store',credentials:'omit'})).text();
  const d=new DOMParser().parseFromString(t,'text/html');
  const md=d.querySelector('meta[name="description"]');
  r.push({URL:u,
    題名:(d.querySelector('title')||{}).textContent.length,
    説明文:md?md.content.length:0,
    H1:d.querySelectorAll('h1').length});
}
console.table(r);`,10);
  B.steps(s,9.05,1.85,3.57,[
    {t:"F12 → Console",d:""},
    {t:"左の枠を全部コピーして貼る",d:""},
    {t:"Enter",d:"表が出ます"},
  ],0.75,12.5);
  B.box(s,9.05,4.2,3.57,2.1,"何が分かるか",
    "題名が60字を超えていないか、説明文が60〜160字に収まっているか、H1が1つかを、一覧で確認できます。","ok");
  B.box(s,0.65,5.55,8.15,1.15,"ページを増やしたいときは、1行目のリストに足すだけです",
    "'/新しいURL/', のように、前後を ' で囲んで , を付けます。","info");
  s.addNotes("最小構成の調査。点検スクリプトの簡易版として、まずこれに慣れてもらう。");
}

/* 道具箱2：言葉を探す */
{
  const s=P.addSlide();
  B.head(s,"道具② サイト内から特定の言葉を探す","「あの文言、どこに残ってる？」を一発で",{lv:"step"});
  B.code(s,0.65,1.8,8.15,3.1,"探したい言葉を1行目に書きます",
`const KEY = '脳卒中';        // ← ここを変える

const P=['/','/about/','/services/','/access/','/contact/',
 '/faq/','/column/','/campaign/'];
for(const u of P){
  const t=await (await fetch(u+'?x='+Date.now(),
    {cache:'no-store',credentials:'omit'})).text();
  const d=new DOMParser().parseFromString(t,'text/html');
  const body=(d.querySelector('main')||d.body).innerText;
  if(body.includes(KEY)) console.log('見つかった →', u);
}
console.log('おわり');`,10);
  B.box(s,9.05,1.85,3.57,2.0,"こんなときに使います",
    "料金を変えたのに古い金額が残っていないか。使わなくなった言葉が消えているか。","ok");
  B.box(s,9.05,4.0,3.57,2.3,"実際に使った例",
    "「脳卒中」を外すと決めたとき、これで全ページを調べました。18ページ中4ページに残っていることが、すぐ分かりました。","info");
  B.box(s,0.65,5.15,8.15,1.15,"料金改定のときに、いちばん役に立ちます",
    "「8,800円」で検索すれば、古い金額が残っているページが一覧で出ます。","warn");
  s.addNotes("実務でいちばん使う道具。料金改定時の取りこぼし防止。");
}

/* 道具箱3-6：まとめて紹介 */
{
  const s=P.addSlide();
  B.head(s,"道具③〜⑥ そのほかの調べもの","目的から選んでください",{lv:"step"});
  const tools=[
    ["③ リンク切れを探す","メニューや本文のリンクが、全部生きているかを確認します","ページを消したあと"],
    ["④ 画像の重さを調べる","大きすぎる画像を見つけます。ページが重い原因になります","表示が遅いと感じたとき"],
    ["⑤ 記事のURL一覧を出す","公開中の記事を、URLつきで一覧にします","点検リストを更新するとき"],
    ["⑥ 全項目を点検する","第6部の点検スクリプト。18項目をまとめて調べます","月に1回"],
  ];
  let y=B.rows(s,0.65,1.5,11.97,tools.map(([a,b,c])=>[a, b+"　【"+c+"】"]),0.85,3.4,12.5);
  B.box(s,0.65,y+0.15,5.85,1.5,"③〜⑤は、この資料の別紙にあります",
    "ASPATHサイト点検スクリプト.js と同じフォルダに、調査用スクリプト集として置いてあります。","info");
  B.box(s,6.77,y+0.15,5.85,1.5,"どれも読み取るだけです",
    "サイトを書き換えることはありません。何度実行しても、影響はありません。","ok");
  s.addNotes("道具箱の全体像。別紙のスクリプト集に誘導。");
}

/* AIに開発者の仕事をさせる */
{
  const s=P.addSlide();
  B.head(s,"AIに、開発者と同じ仕事をさせる","これが、いちばん大きな武器になります",{lv:"step"});
  B.rows(s,0.65,1.5,11.97,[
    ["開発者が実際にやっていること","「症状を聞く」→「原因を推測する」→「調べて確かめる」→「直す」。この繰り返しです。"],
    ["AIができること","前半の「推測する」と「調べ方を教える」は、AIがかなり正確にやってくれます。"],
    ["山口様がやること","症状を正確に伝えること。そして、AIが出した手順を実行すること。"],
    ["できないこと","AIはサイトを直接さわれません。実行するのは、必ず人です。"],
  ],0.8,3.6,12.5);
  B.code(s,0.65,4.95,11.97,1.6,"困ったときに、そのまま貼れる型",
`WordPressで作った医療系サイトを運営しています。次の症状が出ています。
原因として考えられることを、可能性の高い順に挙げてください。
そのうえで、原因を切り分けるために私が実行できる確認方法を、
専門用語を使わずに、手順の形で教えてください。

【症状】ここに、起きていることを具体的に書く
【いつから】いつ気づいたか、直前に何をしたか`,11);
  B.box(s,0.65,6.65,11.97,0.6,"「直前に何をしたか」を必ず書いてください。原因の8割はここにあります。","","warn");
  s.addNotes("トラブル対応の型。直前の操作が最大の手がかり。");
}

/* 作業の型 */
{
  const s=P.addSlide();
  B.head(s,"作業の型 ─ この順番を守れば、事故は起きません","開発者も、同じ順番で作業しています",{lv:"read"});
  const flow=[
    ["1","調べる","道具箱のスクリプトで、いまの状態を記録する",C.GREEN],
    ["2","相談する","AIか開発者に、症状と調べた結果を伝える",C.NAVY],
    ["3","控えを取る","作業前にバックアップ（第5部）",C.SUND],
    ["4","直す","1か所ずつ。まとめて直さない",C.SUND],
    ["5","確かめる","もう一度①を実行し、直る前と比べる",C.GREEN],
  ];
  flow.forEach(([n,t,d,col],i)=>{
    const x=0.65+i*2.43;
    s.addShape(P.ShapeType.roundRect,{x,y:1.55,w:2.22,h:2.1,rectRadius:0.1,fill:{color:"F7FAFA"},line:{color:C.LINE,width:1.2}});
    s.addShape(P.ShapeType.ellipse,{x:x+0.86,y:1.78,w:0.5,h:0.5,fill:{color:col}});
    s.addText(n,{x:x+0.86,y:1.78,w:0.5,h:0.5,align:"center",valign:"middle",fontSize:17,bold:true,color:C.WHITE,fontFace:F,isTextBox:true,margin:0});
    s.addText(t,{x:x+0.08,y:2.42,w:2.06,h:0.36,align:"center",fontSize:13.5,bold:true,color:C.NAVY,fontFace:F,isTextBox:true,margin:0});
    s.addText(d,{x:x+0.08,y:2.82,w:2.06,h:0.75,align:"center",fontSize:10.5,color:C.MUTED,fontFace:F,isTextBox:true,margin:0,lineSpacingMultiple:1.25});
    if(i<4) s.addText("›",{x:x+2.22,y:2.3,w:0.21,h:0.5,align:"center",valign:"middle",fontSize:22,bold:true,color:C.SUN,fontFace:F,isTextBox:true,margin:0});
  });
  B.rows(s,0.65,3.9,11.97,[
    ["①をとばさない","「たぶんこれだろう」で直すと、直っていないのに直った気になります。数字で記録してください。"],
    ["④は1か所ずつ","2か所同時に直すと、どちらが効いたのか分からなくなります。"],
    ["⑤で必ず比べる","直す前の記録があるから、直ったと言えます。これが開発者のやり方です。"],
  ],0.82,3.0,12.5);
  B.box(s,0.65,6.5,11.97,0.72,"この5段階は、第6部の点検と同じ流れです。慣れれば自然にできるようになります。","","ok");
  s.addNotes("開発者の作法。記録して比べる、が核心。");
}

/* 線引き */
{
  const s=P.addSlide();
  B.head(s,"ここまでは自分で、ここからは相談","迷ったときの目安です",{lv:"read"});
  const own=["調べる（道具箱のスクリプト全部）","題名・説明文を書き換える","記事の公開・下書き戻し",
    "写真の差し替え","コメントの承認・スパム処理","カテゴリ・タグの追加","キャッシュを消す","バックアップを取る"];
  const ask=["ファイルを直接さわる作業","テーマZIPの作り直し","プラグインの追加・削除",
    "サーバーの設定","データベースの操作","スラッグ（URL）の変更","原因が分からないとき"];
  s.addShape(P.ShapeType.roundRect,{x:0.65,y:1.5,w:5.95,h:4.35,rectRadius:0.12,fill:{color:"EDF6EE"},line:{color:C.GREEN,width:1.2}});
  s.addText("ご自身でどうぞ",{x:0.95,y:1.7,w:5.4,h:0.42,fontSize:16,bold:true,color:C.GREEN,fontFace:F,isTextBox:true,margin:0});
  s.addText(own.map((t,i)=>({text:t,options:{bullet:true,breakLine:i<own.length-1}})),
    {x:0.95,y:2.2,w:5.4,h:3.5,fontSize:12,color:C.INK,fontFace:F,isTextBox:true,margin:0,paraSpaceAfter:6});
  s.addShape(P.ShapeType.roundRect,{x:6.72,y:1.5,w:5.9,h:4.35,rectRadius:0.12,fill:{color:"FDF0E6"},line:{color:C.SUND,width:1.2}});
  s.addText("ひと声かけてください",{x:7.02,y:1.7,w:5.4,h:0.42,fontSize:16,bold:true,color:C.SUND,fontFace:F,isTextBox:true,margin:0});
  s.addText(ask.map((t,i)=>({text:t,options:{bullet:true,breakLine:i<ask.length-1}})),
    {x:7.02,y:2.2,w:5.4,h:3.5,fontSize:12,color:C.INK,fontFace:F,isTextBox:true,margin:0,paraSpaceAfter:6});
  B.box(s,0.65,6.05,11.97,1.15,"右の欄も、いずれ左に移していきましょう",
    "この線引きは固定ではありません。1つずつ一緒にやって慣れたら、左に移していけます。急ぐ必要はありません。","ok");
  s.addNotes("線引きは動く。ステップアップの余地を示す。");
}

/* ══════════════ 第9部 扉 ══════════════ */
{ const s=P.addSlide();
  B.partCover(s,"9","集客の仕組み",[
    "サイトは、作った後のほうが長い",
    "集客の全体像 ─ 3つの入口",
    "いちばん効くのは Googleビジネスプロフィール",
    "記事を書く型 ─ 企画から公開まで",
    "測る型 ─ 次に何を書くかを、数字から決める",
    "1年の回し方",
  ],C.SUN);
  s.addNotes("第9部。カスタマイズ性が上がるほど、方向を決める仕組みが要る。");
}

/* 集客の全体像 */
{
  const s=P.addSlide();
  B.head(s,"集客の全体像 ─ 3つの入口","お客様がASPATHを見つける道は、大きく3つです",{lv:"read"});
  const ways=[
    ["地図から","Googleマップ・地図の枠","「鹿児島 パーキンソン病」で\n検索したとき、いちばん上に\n出るのは地図です",C.RED,"最優先"],
    ["検索から","Google検索の結果","コラムが読まれ、そこから\nサイトに来ていただく道。\n時間はかかるが、積み上がる",C.NAVY,"継続"],
    ["紹介から","LINE・SNS・口コミ","既にご縁のある方から\n広がる道。いちばん\n成約に近い",C.GREEN,"大切に"],
  ];
  ways.forEach(([t,sub,d,col,tag],i)=>{
    const x=0.65+i*4.05;
    s.addShape(P.ShapeType.roundRect,{x,y:1.5,w:3.75,h:4.2,rectRadius:0.12,fill:{color:"F7FAFA"},line:{color:C.LINE,width:1.2}});
    s.addShape(P.ShapeType.roundRect,{x:x+1.2,y:1.72,w:1.35,h:0.42,rectRadius:0.21,fill:{color:col}});
    s.addText(tag,{x:x+1.2,y:1.72,w:1.35,h:0.42,align:"center",valign:"middle",fontSize:11,bold:true,color:C.WHITE,fontFace:F,isTextBox:true,margin:0});
    s.addText(t,{x:x+0.2,y:2.3,w:3.35,h:0.45,align:"center",fontSize:19,bold:true,color:C.NAVY,fontFace:F,isTextBox:true,margin:0});
    s.addText(sub,{x:x+0.2,y:2.8,w:3.35,h:0.35,align:"center",fontSize:12,bold:true,color:col,fontFace:F,isTextBox:true,margin:0});
    s.addText(d,{x:x+0.2,y:3.3,w:3.35,h:2.2,align:"center",fontSize:11.5,color:C.MUTED,fontFace:F,isTextBox:true,margin:0,lineSpacingMultiple:1.3});
  });
  B.box(s,0.65,5.9,11.97,1.3,"サイトを直すより先に、地図の整備です",
    "「鹿児島 パーキンソン病 トレーニング」で検索すると、Webサイトより先に地図の枠が出ます。ここが空欄だと、どれだけサイトを良くしても届きません。次のページで詳しく説明します。","warn");
  s.addNotes("優先順位。サイト改善より地図が先、という現実。");
}

/* GBP */
{
  const s=P.addSlide();
  B.head(s,"いちばん効くのは Googleビジネスプロフィール","無料です。ここが最も費用対効果が高いです",{lv:"step"});
  B.rows(s,0.65,1.5,11.97,[
    ["これは何か","Googleマップに出るお店の情報です。名前・写真・営業時間・口コミが載ります。無料で登録できます。"],
    ["なぜ効くか","地域名を含む検索では、Webサイトより先に地図が表示されます。ここに出ないと、存在していないのと同じです。"],
    ["やること","登録 → 写真を10枚以上 → 営業時間 → サービス内容 → 定期的な投稿 → 口コミへの返信"],
    ["いちばん効くもの","口コミです。体験された方に、一言お願いしてみてください。返信も必ずしてください。"],
  ],0.85,3.4,12.5);
  B.code(s,0.65,5.05,7.6,1.55,"AIに、投稿文を作らせるとき",
`Googleビジネスプロフィールに載せる投稿文を作ってください。
鹿児島のパーキンソン病専門トレーニングスタジオです。
条件：150字以内／専門用語を使わない／効果の断定はしない
【今回の話題】ここに書く（例：年末年始の休業、新しい記事の紹介）`,10.5);
  B.box(s,8.5,5.05,4.12,1.55,"月に1〜2回の投稿を",
    "更新されているお店ほど、地図で上に出やすくなります。","ok");
  B.box(s,0.65,6.8,11.97,0.42,"","","info");
  s.addNotes("GBPは無料で最も効く。ここを何度も推す。");
}

/* 記事を書く型 */
{
  const s=P.addSlide();
  B.head(s,"記事を書く型 ─ 企画から公開まで","1本あたり、慣れれば1〜2時間で書けます",{lv:"easy"});
  const steps=[
    ["1","ネタを決める","第7部のプロンプト①で10個出させ、3つ選ぶ",C.PURPLE],
    ["2","構成を作る","プロンプト②。見出しを質問の形にする",C.PURPLE],
    ["3","下書きを書かせる","プロンプト③。見出し1つずつ",C.PURPLE],
    ["4","自分の言葉に直す","ここがいちばん大事。実際の経験を足す",C.SUN],
    ["5","題名を決める","プロンプト⑤。30字以内、検索される言葉を前に",C.PURPLE],
    ["6","説明文を書く","プロンプト④。60〜160字",C.PURPLE],
    ["7","公開して確かめる","カテゴリ・タグ・アイキャッチを設定してから",C.GREEN],
  ];
  let y=1.5;
  steps.forEach(([n,t,d,col])=>{
    s.addShape(P.ShapeType.roundRect,{x:0.65,y,w:11.97,h:0.56,rectRadius:0.08,fill:{color:"F7FAFA"},line:{color:C.LINE,width:1}});
    s.addShape(P.ShapeType.ellipse,{x:0.92,y:y+0.1,w:0.36,h:0.36,fill:{color:col}});
    s.addText(n,{x:0.92,y:y+0.1,w:0.36,h:0.36,align:"center",valign:"middle",fontSize:12,bold:true,color:C.WHITE,fontFace:F,isTextBox:true,margin:0});
    s.addText(t,{x:1.48,y:y+0.1,w:3.6,h:0.36,fontSize:13,bold:true,color:C.NAVY,fontFace:F,isTextBox:true,margin:0,valign:"middle"});
    s.addText(d,{x:5.3,y:y+0.1,w:7.1,h:0.36,fontSize:11.5,color:C.MUTED,fontFace:F,isTextBox:true,margin:0,valign:"middle"});
    y+=0.62;
  });
  B.box(s,0.65,y+0.12,11.97,0.9,"④だけは、AIに任せないでください",
    "実際に見てきた症例、お客様の言葉、鹿児島という土地のこと。ここが入るかどうかで、記事の価値が決まります。AIには書けません。","warn");
  s.addNotes("④が差別化。ここだけは人が書く。");
}

/* 測る型 */
{
  const s=P.addSlide();
  B.head(s,"測る型 ─ 次に何を書くかを、数字から決める","勘ではなく、お客様が探している言葉から決めます",{lv:"step"});
  B.steps(s,0.65,1.6,6.0,[
    {t:"Search Console を開く",d:"検索結果のパフォーマンス"},
    {t:"「クエリ」の一覧を見る",d:"実際に検索された言葉が出ます"},
    {t:"表示回数が多いのに、順位が低い言葉を探す",d:"ここが伸びしろです"},
    {t:"その言葉で記事を1本書く",d:"上の「記事を書く型」で"},
    {t:"1か月後、順位が上がったか見る",d:"上がっていれば正解"},
  ],0.82,13);
  B.box(s,6.85,1.6,5.77,2.2,"なぜこの順番か",
    "「表示はされているのに、クリックされていない」言葉は、お客様が探しているのに、まだ十分に答えられていない証拠です。","ok");
  B.box(s,6.85,3.95,5.77,2.4,"コメントも、宝の山です",
    "お客様が実際に書いてくださった質問は、同じことで困っている方が必ず他にもいます。そのまま記事のネタになります。数字より確実な材料です。","info");
  B.box(s,0.65,5.6,6.0,1.6,"最初の3か月は、数字が動きません",
    "焦らないでください。記事が5本、10本と溜まってから効いてきます。","warn");
  s.addNotes("測定→次の記事のループ。GSCのクエリが一番の材料。");
}

/* 1年の回し方 */
{
  const s=P.addSlide();
  B.head(s,"1年の回し方","この型で回せば、集客は積み上がります",{lv:"easy"});
  const plan=[
    ["いま","地図の整備","Googleビジネスプロフィールの登録・写真・営業時間",C.RED],
    ["1〜3か月","記事を増やす","月1〜2本。検索される言葉から選ぶ",C.SUN],
    ["3か月","はじめての振り返り","Search Consoleで、どの言葉で来ているか確認",C.NAVY],
    ["6か月","当たりを見つける","読まれている記事の傾向をつかみ、その方向を厚くする",C.NAVY],
    ["随時","口コミを集める","体験された方に、一言お願いする",C.GREEN],
    ["1年","全体の見直し","料金・写真・プランの表記が古くなっていないか",C.PURPLE],
  ];
  let y=1.5;
  plan.forEach(([w,t,d,col])=>{
    s.addShape(P.ShapeType.roundRect,{x:0.65,y,w:11.97,h:0.62,rectRadius:0.09,fill:{color:"F7FAFA"},line:{color:C.LINE,width:1}});
    s.addShape(P.ShapeType.roundRect,{x:0.95,y:y+0.1,w:1.75,h:0.42,rectRadius:0.1,fill:{color:col}});
    s.addText(w,{x:0.95,y:y+0.1,w:1.75,h:0.42,align:"center",valign:"middle",fontSize:11.5,bold:true,color:C.WHITE,fontFace:F,isTextBox:true,margin:0});
    s.addText(t,{x:2.95,y:y+0.11,w:3.6,h:0.4,fontSize:13,bold:true,color:C.NAVY,fontFace:F,isTextBox:true,margin:0,valign:"middle"});
    s.addText(d,{x:6.75,y:y+0.11,w:5.65,h:0.4,fontSize:11.5,color:C.MUTED,fontFace:F,isTextBox:true,margin:0,valign:"middle"});
    y+=0.68;
  });
  B.box(s,0.65,y+0.1,11.97,1.15,"サイトの手直しより、この6つのほうが効きます",
    "デザインを変えたくなることがあると思いますが、いまのサイトは十分に整っています。それより、地図を整え、記事を増やし、口コミを集めるほうが、お客様は増えます。","ok");
  s.addNotes("優先順位の再確認。サイト改修より運用。");
}

};
