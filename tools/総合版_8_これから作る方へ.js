// ASPATH 総合版 ── 第18部 これから作る方へ（同じように専門をお持ちの方へ）
//   この部だけは、アスパス様の運用のための章ではない。
//   この資料を、同じ分野・近い分野の方にお見せしたときに、
//   「これと同じものを」ではなく「うちなら、こうしたい」が出てくるようにするための章。
//   したがって、答えを並べるのではなく、問いと選択肢と余白を置く。
const { C, F, MONO, LV } = require("./総合版_lib.js");

module.exports = function build(P, B){

/* ══════════════ 第18部 扉 ══════════════ */
{ const s=P.addSlide();
  B.partCover(s,"18","これから作る方へ",[
    "この部の使い方 ─ 読む章ではなく、書き込む章です",
    "「同じものを」が、いちばん惜しい ─ 真似てよい所・変えるべき所",
    "アスパスがこの形になるまでの、10の分かれ道",
    "はじめの10の問い／届ける相手は誰か／サイトの型カタログ",
    "選ばれる理由の棚卸し／手元の素材の棚卸し",
    "別の分野に置き換えてみる ─ 読み替え表と、部品の言い換え",
    "構成メモ1枚（記入例つき）と、ここから先の進め方",
  ],C.PURPLE);
  s.addNotes("プレゼン用の章。アスパス様の運用には直接関係しない旨を最初に明記する。");
}

/* 18-1 この部の使い方 */
{
  const s=P.addSlide();
  B.head(s,"この部の使い方","ここだけは、読む章ではなく、書き込む章です",{lv:"read"});
  B.box(s,0.65,1.5,11.97,0.95,"はじめにお断り",
    "この第18部は、アスパス様の日々の運用には関係しません。この資料を、同じように専門をお持ちの方へお見せするときのための章です。読み飛ばしていただいて差し支えありません。","info");
  const use=[
    ["1","答えを探さないでください","ここには「正解の作り方」は書いてありません。書いてあるのは、アスパスがどこで迷い、何を選び、何を捨てたかです。同じ問いをご自身に当てて、違う答えが出れば、それが正しい姿です。",C.NAVY],
    ["2","1枚だけ、埋めてください","最後にある「構成メモ1枚」が、この部の目的地です。全部埋める必要はありません。埋まらなかった欄が、いま決まっていないことです。それが分かれば十分です。",C.SUND],
    ["3","思いついた順で構いません","上から順に読む必要はありません。気になった見開きだけ開いて、余白に書き込んでください。散らかったままで結構です。整理はあとからできます。",C.GREEN],
  ];
  let y=2.65;
  use.forEach(([n,t,d,col])=>{
    s.addShape(P.ShapeType.roundRect,{x:0.65,y,w:11.97,h:1.42,rectRadius:0.12,fill:{color:"F7FAFA"},line:{color:col,width:1.3}});
    s.addShape(P.ShapeType.ellipse,{x:0.95,y:y+0.2,w:0.5,h:0.5,fill:{color:col}});
    s.addText(n,{x:0.95,y:y+0.2,w:0.5,h:0.5,align:"center",valign:"middle",fontSize:17,bold:true,color:C.WHITE,fontFace:F,isTextBox:true,margin:0});
    s.addText(t,{x:1.65,y:y+0.16,w:10.6,h:0.36,fontSize:15,bold:true,color:C.NAVY,fontFace:F,isTextBox:true,margin:0});
    s.addText(d,{x:1.65,y:y+0.56,w:10.6,h:0.72,fontSize:11.5,color:C.INK,fontFace:F,isTextBox:true,margin:0,lineSpacingMultiple:1.25});
    y+=1.5;
  });
  s.addNotes("この部の性格づけ。答えではなく問いを置く章であることを最初に宣言する。");
}

/* 18-2 同じものを、が惜しい */
{
  const s=P.addSlide();
  B.head(s,"「アスパスと同じものを」が、いちばん惜しい","真似てよいのは作り方であって、中身ではありません",{lv:"read"});
  const yes=["ページの数を、最初は絞る","入口をひとつに決める","料金を隠さずに書く","よくある質問を厚くする","更新は自分でできる形にする","判断の理由を、資料に残す"];
  const no =["パーキンソン病という絞り方","公式LINEという入口","天文館という立地の見せ方","伴走する、という言葉づかい","藍と橙という色","14年という数字の出し方"];
  s.addShape(P.ShapeType.roundRect,{x:0.65,y:1.5,w:5.85,h:3.5,rectRadius:0.12,fill:{color:"EDF3F1"},line:{color:C.GREEN,width:1.4}});
  s.addText("そのまま真似ていただいてよいもの",{x:0.95,y:1.68,w:5.25,h:0.36,fontSize:14.5,bold:true,color:C.GREEN,fontFace:F,isTextBox:true,margin:0});
  s.addText("── 作り方・進め方の話",{x:0.95,y:2.02,w:5.25,h:0.28,fontSize:11,color:C.MUTED,fontFace:F,isTextBox:true,margin:0});
  s.addText(yes.map((v,i)=>({text:v,options:{bullet:true,breakLine:i<yes.length-1}})),
    {x:1.05,y:2.42,w:5.15,h:2.4,fontSize:12.5,color:C.INK,fontFace:F,isTextBox:true,margin:0,paraSpaceAfter:7});
  s.addShape(P.ShapeType.roundRect,{x:6.77,y:1.5,w:5.85,h:3.5,rectRadius:0.12,fill:{color:"FDF0E6"},line:{color:C.SUND,width:1.4}});
  s.addText("真似ると、かえって弱くなるもの",{x:7.07,y:1.68,w:5.25,h:0.36,fontSize:14.5,bold:true,color:C.SUND,fontFace:F,isTextBox:true,margin:0});
  s.addText("── アスパス固有の答えの話",{x:7.07,y:2.02,w:5.25,h:0.28,fontSize:11,color:C.MUTED,fontFace:F,isTextBox:true,margin:0});
  s.addText(no.map((v,i)=>({text:v,options:{bullet:true,breakLine:i<no.length-1}})),
    {x:7.17,y:2.42,w:5.15,h:2.4,fontSize:12.5,color:C.INK,fontFace:F,isTextBox:true,margin:0,paraSpaceAfter:7});
  B.box(s,0.65,5.2,11.97,1.0,"右側は、アスパスが「捨てたもの」の裏返しです",
    "パーキンソン病に絞ったのは、脳卒中もリハビリ全般も扱えたからです。扱えるものを書かないと決めたから、専門に見えるようになりました。何を書かないかは、事業ごとに違います。","ok");
  B.box(s,0.65,6.32,11.97,0.8,"問い ─ ご自身の事業で、「できるけれど、書かない」と決められるものは何でしょうか。","","warn");
  s.addNotes("いちばん伝えたいスライド。専門性は足し算ではなく引き算で出る。");
}

/* 分かれ道の表を描く小道具 */
function forks(s, rows, y0){
  s.addShape(P.ShapeType.roundRect,{x:0.65,y:y0,w:11.97,h:0.4,rectRadius:0.08,fill:{color:C.NAVY}});
  [["分かれ道",0.95,2.5],["アスパスが選んだ方",3.55,3.2],["選ばなかった方",6.85,2.5],["決め手",9.45,3.0]].forEach(([t,x,w])=>{
    s.addText(t,{x,y:y0,w,h:0.4,fontSize:11.5,bold:true,color:C.WHITE,fontFace:F,isTextBox:true,margin:0,valign:"middle"});
  });
  let y=y0+0.46;
  rows.forEach(([a,b,c,d],i)=>{
    s.addShape(P.ShapeType.roundRect,{x:0.65,y,w:11.97,h:0.86,rectRadius:0.08,
      fill:{color:i%2?C.PAPER:"F7FAFA"},line:{color:C.LINE,width:1}});
    s.addText(a,{x:0.95,y:y+0.03,w:2.5,h:0.8,fontSize:12,bold:true,color:C.NAVY,fontFace:F,isTextBox:true,margin:0,valign:"middle",lineSpacingMultiple:1.15});
    s.addText(b,{x:3.55,y:y+0.03,w:3.2,h:0.8,fontSize:10.5,color:C.INK,fontFace:F,isTextBox:true,margin:0,valign:"middle",lineSpacingMultiple:1.15});
    s.addText(c,{x:6.85,y:y+0.03,w:2.5,h:0.8,fontSize:10.5,color:C.MUTED,fontFace:F,isTextBox:true,margin:0,valign:"middle",lineSpacingMultiple:1.15});
    s.addText(d,{x:9.45,y:y+0.03,w:3.0,h:0.8,fontSize:10.5,color:C.INK,fontFace:F,isTextBox:true,margin:0,valign:"middle",lineSpacingMultiple:1.15});
    y+=0.92;
  });
  return y;
}

/* 18-3 分かれ道（前半） */
{
  const s=P.addSlide();
  B.head(s,"この形になるまでの、10の分かれ道（1/2）","結果ではなく、迷った所を並べます。同じ所で、違う答えが出るはずです",{lv:"read"});
  const y=forks(s,[
    ["何の専門と名乗るか","パーキンソン病専門","リハビリ全般・機能訓練","絞るほど、探している人に見つかる"],
    ["最初の連絡先","公式LINE ひとつ","電話・メール・フォーム併記","入口が多いほど、どれも使われない"],
    ["料金の見せ方","金額と回数を全部出す","「お問い合わせください」","高いか安いかより、分からないのが不安"],
    ["予約の受け方","当面はLINEで人が受ける","予約システムで自動化","来訪前に一言交わせる方が続いた"],
    ["トップの主役","人物写真と伴走の言葉","設備・器具の写真","選ぶ理由が、器具ではなく人だった"],
  ],1.5);
  B.box(s,0.65,y+0.06,11.97,0.75,"どれも「正解」ではなく「アスパスにとっての正解」です。5行目まで来ると、ご自身の答えが1つは違っているはずです。","","info");
  s.addNotes("決定の裏側を見せることで、読み手に選択肢の存在を意識させる。");
}

/* 18-4 分かれ道（後半） */
{
  const s=P.addSlide();
  B.head(s,"この形になるまでの、10の分かれ道（2/2）","後半は、公開したあとに効いてくる判断です",{lv:"read"});
  const y=forks(s,[
    ["読み手を誰に置くか","ご本人と、ご家族の両方","ご本人だけ","申し込むのは家族、という場面が多い"],
    ["記事を持つか","コラムを持つ（月1〜2本）","固定ページだけ","病名で検索する人に届く道が要る"],
    ["体験の入口","専用の申込ページを別に持つ","問い合わせフォームに混ぜる","申込だけは、迷わせない形にしたい"],
    ["誰が更新するか","ご本人が直せる形にする","更新のたびに外注する","止まった瞬間に、古い情報が残る"],
    ["作り方","静的HTMLから生成する","WordPressの画面で組む","速度と、あとから直す確実さを取った"],
  ],1.5);
  B.box(s,0.65,y+0.06,11.97,0.75,"最後の1行だけは技術の話です。ここは、事業の内容ではなく「誰が、どれくらいの頻度で直すか」で決まります。","","warn");
  s.addNotes("後半は運用側の判断。更新頻度が設計を決めるという話につなげる。");
}

/* 18-5 はじめの10の問い */
{
  const s=P.addSlide();
  B.head(s,"はじめの10の問い","答えが出た順に、余白へ書き込んでください。空欄のままで構いません",{lv:"read"});
  const qs=[
    ["誰の、どんな困りごとを引き受けていますか","「〜でお困りの方」を、ひと息で言える長さに"],
    ["その方は、何と検索しますか","病名／症状／地名／「近く」──どれで探しますか"],
    ["最後の決め手は何ですか","資格・年数・実績・設備・人柄。ひとつだけ選ぶなら"],
    ["最初の連絡は、どこに来てほしいですか","電話／LINE／フォーム／予約システム。ひとつに絞れますか"],
    ["読むのは、ご本人ですか、ご家族ですか","読み手が違えば、使う言葉も変わります"],
    ["お断りしたい相手はいますか","書かないことも、立派な設計です"],
    ["いま、いちばん多い質問は何ですか","それが、そのままFAQの1行目になります"],
    ["手元にある「証拠」は何ですか","写真・実績・年数・資格・論文・講演・掲載"],
    ["更新は、誰が、どれくらいできますか","正直に見積もってください。月1本でも十分です"],
    ["1年後、何が変わっていてほしいですか","問い合わせの数ですか、質ですか"],
  ];
  qs.forEach(([q,h],i)=>{
    const x=0.65+(i>=5?6.07:0), y=1.55+(i%5)*1.0;
    s.addShape(P.ShapeType.roundRect,{x,y,w:5.9,h:0.92,rectRadius:0.1,fill:{color:(i%5)%2?"F7FAFA":C.PAPER},line:{color:C.LINE,width:1}});
    s.addShape(P.ShapeType.ellipse,{x:x+0.18,y:y+0.13,w:0.32,h:0.32,fill:{color:C.NAVY}});
    s.addText(String(i+1),{x:x+0.18,y:y+0.13,w:0.32,h:0.32,align:"center",valign:"middle",fontSize:11,bold:true,color:C.WHITE,fontFace:F,isTextBox:true,margin:0});
    s.addText(q,{x:x+0.6,y:y+0.09,w:5.15,h:0.34,fontSize:12,bold:true,color:C.NAVY,fontFace:F,isTextBox:true,margin:0,valign:"middle"});
    s.addText(h,{x:x+0.6,y:y+0.42,w:5.15,h:0.26,fontSize:10,color:C.MUTED,fontFace:F,isTextBox:true,margin:0});
    s.addShape(P.ShapeType.line,{x:x+0.6,y:y+0.76,w:5.05,h:0,line:{color:"C6D3D7",width:1,dashType:"dash"}});
  });
  B.box(s,0.65,6.6,11.97,0.55,"1・3・4の3つが埋まれば、サイトの骨格はほぼ決まります。残りは、あとから足せます。","","ok");
  s.addNotes("この10問がこの部の心臓部。1・3・4だけ強調する。");
}

/* 18-6 届ける相手は誰か */
{
  const s=P.addSlide();
  B.head(s,"届ける相手は、たいてい3人います","同じページを、3人がまったく違う目で読んでいます",{lv:"read"});
  const who=[
    ["ご本人",C.NAVY,"自分にもできるのか","・きつくないか\n・続けられるか\n・恥ずかしくないか\n・何をするのか",
     "写真の中の人が\n自分と近い年格好かどうかを、\n真っ先に見ています。"],
    ["ご家族",C.SUND,"任せて大丈夫なのか","・誰が見てくれるのか\n・資格はあるのか\n・いくらかかるのか\n・送り迎えはどうするか",
     "申し込みのボタンを\n実際に押すのは、\nこの人であることが多いです。"],
    ["紹介する人",C.GREEN,"人に勧めて問題ないか","・医療との線引き\n・何ができて何ができないか\n・連絡の取りやすさ\n・実績と経歴",
     "医師・ケアマネジャー・\n同業の方。ここが弱いと、\n紹介の流れが生まれません。"],
  ];
  who.forEach(([t,col,q,items,note],i)=>{
    const x=0.65+i*4.05;
    s.addShape(P.ShapeType.roundRect,{x,y:1.5,w:3.75,h:4.15,rectRadius:0.12,fill:{color:"F7FAFA"},line:{color:col,width:1.4}});
    s.addShape(P.ShapeType.roundRect,{x:x+0.25,y:1.72,w:3.25,h:0.46,rectRadius:0.1,fill:{color:col}});
    s.addText(t,{x:x+0.25,y:1.72,w:3.25,h:0.46,align:"center",valign:"middle",fontSize:14,bold:true,color:C.WHITE,fontFace:F,isTextBox:true,margin:0});
    s.addText("「"+q+"」",{x:x+0.3,y:2.3,w:3.15,h:0.32,align:"center",fontSize:12.5,bold:true,color:col,fontFace:F,isTextBox:true,margin:0});
    s.addText(items,{x:x+0.42,y:2.72,w:3.0,h:1.5,fontSize:11.5,color:C.INK,fontFace:F,isTextBox:true,margin:0,lineSpacingMultiple:1.35});
    s.addText(note,{x:x+0.42,y:4.3,w:3.0,h:1.2,fontSize:10.5,color:C.MUTED,fontFace:F,isTextBox:true,margin:0,lineSpacingMultiple:1.3});
  });
  B.box(s,0.65,5.85,5.85,1.28,"アスパスの場合",
    "モデルケースの3枚は、この「ご家族」に向けて作りました。ご本人の声だけでは、家族の不安に答えきれなかったためです。","ok");
  B.box(s,6.77,5.85,5.85,1.28,"問い",
    "ご自身の事業では、この3人のうち誰がいちばん弱いでしょうか。弱い相手に向けた1ページを足すのが、いちばん効きます。","warn");
  s.addNotes("読み手を3層に割ると、足りないページが自然に見えてくる。");
}

/* 18-7 サイトの型カタログ */
{
  const s=P.addSlide();
  B.head(s,"サイトの型 ─ 4つのうち、どれに近いですか","混ぜると、どれにもなりません。まず1つ選んでください",{lv:"read"});
  const types=[
    ["信 頼 型","会う前に、安心してもらう","経歴・資格・考え方・場所の写真を厚く。ページ数は少なくてよい。",
     "紹介や口コミで名前を聞いた人が、確かめに来るとき","更新が止まっても価値が落ちにくい",C.NAVY],
    ["予 約 型","迷わせずに、申し込みまで運ぶ","入口を1つに固定。料金と初回の流れを明示。ボタンを繰り返し置く。",
     "何をするか既に分かっている人が来るとき","入口を増やした瞬間に効かなくなる",C.SUND],
    ["教 育 型","検索から、知らない人を連れてくる","記事を積む。1本1テーマ。用語のやさしい言い換えが命。",
     "そもそも「そういう選択肢がある」と知られていないとき","書き続けられないと成立しない",C.GREEN],
    ["紹 介 型","同業・医療者に、渡しやすくする","できること／できないことの線引きを明記。連絡手段を目立たせる。",
     "紹介で成り立つ事業のとき","一般客向けの言葉と混ざると読みにくい",C.PURPLE],
  ];
  types.forEach(([t,sub,d,fit,risk,col],i)=>{
    const x=0.65+(i%2)*6.07, y=1.5+Math.floor(i/2)*2.62;
    s.addShape(P.ShapeType.roundRect,{x,y,w:5.9,h:2.45,rectRadius:0.12,fill:{color:"F7FAFA"},line:{color:col,width:1.4}});
    s.addShape(P.ShapeType.roundRect,{x:x+0.22,y:y+0.2,w:1.75,h:0.42,rectRadius:0.1,fill:{color:col}});
    s.addText(t,{x:x+0.22,y:y+0.2,w:1.75,h:0.42,align:"center",valign:"middle",fontSize:12.5,bold:true,color:C.WHITE,fontFace:F,isTextBox:true,margin:0});
    s.addText(sub,{x:x+2.12,y:y+0.2,w:3.6,h:0.42,fontSize:12.5,bold:true,color:col,fontFace:F,isTextBox:true,margin:0,valign:"middle"});
    s.addText(d,{x:x+0.28,y:y+0.72,w:5.35,h:0.62,fontSize:11,color:C.INK,fontFace:F,isTextBox:true,margin:0,lineSpacingMultiple:1.25});
    s.addText([{text:"向くのは ",options:{bold:true,color:col,fontSize:10.5}},{text:fit,options:{color:C.INK,fontSize:10.5}}],
      {x:x+0.28,y:y+1.42,w:5.35,h:0.46,fontFace:F,isTextBox:true,margin:0,lineSpacingMultiple:1.2});
    s.addText([{text:"落とし穴 ",options:{bold:true,color:C.RED,fontSize:10.5}},{text:risk,options:{color:C.MUTED,fontSize:10.5}}],
      {x:x+0.28,y:y+1.92,w:5.35,h:0.46,fontFace:F,isTextBox:true,margin:0,lineSpacingMultiple:1.2});
  });
  B.box(s,0.65,6.62,11.97,0.54,"アスパスは「信頼型」を土台に、「予約型」の入口を1本だけ通した形です。教育型（コラム）は、あとから足しました。","","info");
  s.addNotes("型を1つ選ばせる。アスパスは信頼型＋予約型の入口という説明を必ず添える。");
}

/* 18-8 選ばれる理由の棚卸し */
{
  const s=P.addSlide();
  B.head(s,"「選ばれる理由」の棚卸し ─ 12の切り口","当てはまるものに印を。3つ残れば、それが看板になります",{lv:"read"});
  const cuts=[
    ["専門を絞る","扱う対象を1つに言い切れるか"],
    ["資格と経歴","名乗れる資格・所属・受賞"],
    ["年 数","「◯年」と書ける長さがあるか"],
    ["のべ人数","対応してきた人数・件数"],
    ["設備・機器","そこにしかない道具があるか"],
    ["立地・通いやすさ","駅・駐車場・送迎の有無"],
    ["時間帯","早朝・夜・土日に開けられるか"],
    ["料金の明快さ","1回いくらか、即答できるか"],
    ["入りやすさ","初回だけ試せる形があるか"],
    ["伴走の仕方","終わったあとに何が続くのか"],
    ["家族への支援","本人以外にも渡せるものがあるか"],
    ["他機関との連携","医療・介護・行政とのつながり"],
  ];
  cuts.forEach(([t,d],i)=>{
    const x=0.65+(i%3)*4.05, y=1.55+Math.floor(i/3)*1.16;
    s.addShape(P.ShapeType.roundRect,{x,y,w:3.75,h:1.02,rectRadius:0.1,fill:{color:"F7FAFA"},line:{color:C.LINE,width:1}});
    s.addShape(P.ShapeType.roundRect,{x:x+0.22,y:y+0.26,w:0.3,h:0.3,rectRadius:0.05,fill:{color:C.WHITE},line:{color:C.NAVY,width:1.3}});
    s.addText(t,{x:x+0.66,y:y+0.14,w:2.9,h:0.34,fontSize:13,bold:true,color:C.NAVY,fontFace:F,isTextBox:true,margin:0,valign:"middle"});
    s.addText(d,{x:x+0.66,y:y+0.5,w:2.9,h:0.42,fontSize:10.5,color:C.MUTED,fontFace:F,isTextBox:true,margin:0,lineSpacingMultiple:1.2});
  });
  B.box(s,0.65,6.24,5.85,0.9,"アスパスが残した3つ",
    "専門を絞る／年数／伴走の仕方。この3つだけです。","ok");
  B.box(s,6.77,6.24,5.85,0.9,"12個すべてに印が付いた方へ",
    "まだ絞れていない、ということです。3つに減らすまでが本番です。","warn");
  s.addNotes("チェックリスト形式。3つに減らす作業こそが企画である、と伝える。");
}

/* 18-9 手元の素材の棚卸し */
{
  const s=P.addSlide();
  B.head(s,"手元にある素材で、どこまで作れるか","「揃ってから」と考えると、たいてい始まりません",{lv:"read"});
  const mat=[
    ["顔写真（ご自身）","いちばん強い素材です。1枚あれば信頼型は成立します","スマホで十分。窓際・白い壁・正面から"],
    ["施術／指導中の写真","何をする場所なのかが、文章より早く伝わります","ご本人の許可を書面で。顔を出さない角度でも可"],
    ["お客様の声","2〜3本で足ります。多さより、具体さです","無ければ「モデルケース」で代替できます"],
    ["資格証・経歴","並べるだけで効きます。年号も入れてください","肩書は名乗ってよいものかだけ、事前に確認を"],
    ["料金表","紙のものがあれば、そのまま使えます","1回いくらか、が分かる形に直すだけで十分"],
    ["よくある質問","メモ書きで構いません。10個あれば1ページになります","電話で毎回聞かれることを、そのまま書き出す"],
    ["外観・内観の写真","場所が分かると、来訪のためらいが減ります","入口の写真が特に効きます。迷わせないため"],
    ["ロゴ","無くても始められます。文字だけでも成立します","あとから差し替えられます"],
  ];
  s.addShape(P.ShapeType.roundRect,{x:0.65,y:1.5,w:11.97,h:0.4,rectRadius:0.08,fill:{color:C.NAVY}});
  [["素 材",0.95,2.6],["あると、何ができるか",3.75,4.3],["集めるときのこつ",8.35,4.0]].forEach(([t,x,w])=>{
    s.addText(t,{x,y:1.5,w,h:0.4,fontSize:11.5,bold:true,color:C.WHITE,fontFace:F,isTextBox:true,margin:0,valign:"middle"});
  });
  let y=1.96;
  mat.forEach(([a,b,c],i)=>{
    s.addShape(P.ShapeType.roundRect,{x:0.65,y,w:11.97,h:0.48,rectRadius:0.08,
      fill:{color:i%2?C.PAPER:"F7FAFA"},line:{color:C.LINE,width:1}});
    s.addText(a,{x:0.95,y:y+0.02,w:2.6,h:0.44,fontSize:11.5,bold:true,color:C.NAVY,fontFace:F,isTextBox:true,margin:0,valign:"middle"});
    s.addText(b,{x:3.75,y:y+0.02,w:4.4,h:0.44,fontSize:10.5,color:C.INK,fontFace:F,isTextBox:true,margin:0,valign:"middle"});
    s.addText(c,{x:8.35,y:y+0.02,w:4.05,h:0.44,fontSize:10.5,color:C.MUTED,fontFace:F,isTextBox:true,margin:0,valign:"middle"});
    y+=0.54;
  });
  B.box(s,0.65,y+0.1,11.97,0.9,"上から4つあれば、公開できます",
    "アスパスも、公開の時点で揃っていなかったものがあります。足りないまま出して、あとから足しました。","ok");
  s.addNotes("素材が無いことを理由に止まらせない。上から4つで公開できる、を明言。");
}

/* 18-10 読み替え表 */
{
  const s=P.addSlide();
  B.head(s,"別の分野に置き換えると、どうなるか","アスパスの「絞り方」を、6つの分野に当てはめてみます",{lv:"read"});
  const rows=[
    ["訪問看護ステーション","医療的ケア児／がんの在宅／看取り　など対象で絞る","24時間の体制と、ご家族の一日の流れ"],
    ["整体・鍼灸院","産後／デスクワークの腰／競技者のケア　など状態で絞る","施術前後の変化と、通う回数の目安"],
    ["言語聴覚士の教室","失語症／吃音／小児の発音　など症状で絞る","1回のレッスンの中身を、時間で分解して見せる"],
    ["管理栄養士の相談室","糖尿病／腎臓病／アスリート　など目的で絞る","献立の実物写真。ビフォーアフターより日常"],
    ["ピラティススタジオ","術後の回復／妊娠中／高齢者　など状態で絞る","器具ではなく、指導者の経歴と考え方"],
    ["児童発達支援","対象年齢／特性／送迎範囲　で絞る","保護者向けの説明と、事業所の一日の流れ"],
  ];
  s.addShape(P.ShapeType.roundRect,{x:0.65,y:1.5,w:11.97,h:0.42,rectRadius:0.08,fill:{color:C.NAVY}});
  [["分 野",0.95,2.9],["「専門を絞る」に当たるもの",4.05,4.4],["いちばん効く見せ方",8.75,3.6]].forEach(([t,x,w])=>{
    s.addText(t,{x,y:1.5,w,h:0.42,fontSize:11.5,bold:true,color:C.WHITE,fontFace:F,isTextBox:true,margin:0,valign:"middle"});
  });
  let y=1.98;
  rows.forEach(([a,b,c],i)=>{
    s.addShape(P.ShapeType.roundRect,{x:0.65,y,w:11.97,h:0.6,rectRadius:0.08,
      fill:{color:i%2?C.PAPER:"F7FAFA"},line:{color:C.LINE,width:1}});
    s.addText(a,{x:0.95,y:y+0.02,w:2.9,h:0.56,fontSize:12,bold:true,color:C.NAVY,fontFace:F,isTextBox:true,margin:0,valign:"middle",lineSpacingMultiple:1.15});
    s.addText(b,{x:4.05,y:y+0.02,w:4.5,h:0.56,fontSize:11,color:C.INK,fontFace:F,isTextBox:true,margin:0,valign:"middle",lineSpacingMultiple:1.15});
    s.addText(c,{x:8.75,y:y+0.02,w:3.7,h:0.56,fontSize:11,color:C.MUTED,fontFace:F,isTextBox:true,margin:0,valign:"middle",lineSpacingMultiple:1.15});
    y+=0.66;
  });
  B.box(s,0.65,y+0.14,11.97,1.0,"表に無い分野でも、やることは同じです",
    "「対象・症状・目的・状態・年齢・範囲」のどれかで切る。切ったあとに残るものが、看板になります。切らずに全部書くと、誰の目にも留まりません。","info");
  s.addNotes("自分の分野が表に無くても当てはめられるよう、切り口の語彙を最後に置く。");
}

/* 18-11 部品の言い換え */
{
  const s=P.addSlide();
  B.head(s,"アスパスの部品を、ご自身の言葉に置き換える","右の欄が、そのままご自身のサイトの構成になります",{lv:"read"});
  const parts=[
    ["トップの1行","14年以上、パーキンソン病の方への運動指導歴をもつスタッフが伴走します"],
    ["3つの強み","専門を絞る／年数／伴走の仕方"],
    ["お客様の声","実際の2名。年代とご病歴を添えて"],
    ["モデルケース","「こんな方に来ていただけたら」を3枚"],
    ["料金","初回体験と、月額の2段構え"],
    ["入口","公式LINE、ひとつだけ"],
    ["よくある質問","医療との違い・持ち物・送迎・キャンセル"],
    ["コラム","病名で検索する人に向けた記事"],
  ];
  s.addShape(P.ShapeType.roundRect,{x:0.65,y:1.5,w:11.97,h:0.4,rectRadius:0.08,fill:{color:C.NAVY}});
  [["部 品",0.95,2.4],["アスパスでは",3.45,5.3],["ご自身の場合は",8.95,3.4]].forEach(([t,x,w])=>{
    s.addText(t,{x,y:1.5,w,h:0.4,fontSize:11.5,bold:true,color:C.WHITE,fontFace:F,isTextBox:true,margin:0,valign:"middle"});
  });
  let y=1.96;
  parts.forEach(([a,b],i)=>{
    s.addShape(P.ShapeType.roundRect,{x:0.65,y,w:11.97,h:0.48,rectRadius:0.08,
      fill:{color:i%2?C.PAPER:"F7FAFA"},line:{color:C.LINE,width:1}});
    s.addText(a,{x:0.95,y:y+0.02,w:2.4,h:0.44,fontSize:12,bold:true,color:C.NAVY,fontFace:F,isTextBox:true,margin:0,valign:"middle"});
    s.addText(b,{x:3.45,y:y+0.02,w:5.3,h:0.44,fontSize:10.5,color:C.MUTED,fontFace:F,isTextBox:true,margin:0,valign:"middle",lineSpacingMultiple:1.15});
    s.addShape(P.ShapeType.roundRect,{x:8.95,y:y+0.07,w:3.45,h:0.34,rectRadius:0.06,fill:{color:C.WHITE},line:{color:"C6D3D7",width:1}});
    y+=0.54;
  });
  B.box(s,0.65,y+0.12,11.97,0.9,"埋まらない行があっても、進めて構いません",
    "アスパスも、コラムは公開の2か月後から書き始めました。トップの1行と、入口の2つだけ決まっていれば、形にはなります。","ok");
  s.addNotes("空欄を用意することで、読みながら考える手が動く。");
}

/* 18-12 迷ったときの分かれ道 */
{
  const s=P.addSlide();
  B.head(s,"迷ったときの、はい／いいえ","5つ答えると、作るものの輪郭が出ます",{lv:"read"});
  const q=[
    ["予約の枠を、自分で管理したいですか","予約システムを入れる。ただし運用の手間は増えます","LINEや電話で受ける方が、結局は続きます"],
    ["記事を、月に1本書けそうですか","コラムを持つ。検索からの流入が育ちます","FAQを厚くする方が、同じ手間で効きます"],
    ["写真を撮れる人が、身近にいますか","人物写真を主役に。いちばん強い素材です","図と文字だけでも作れます。実際に作れています"],
    ["お客様は、通える範囲の方ですか","地図・駐車場・地域名を厚く。地図対策が効きます","オンラインの導線を先に整えます"],
    ["決めるのは、ご自身ひとりですか","小さく出して、育てる進め方が取れます","先に構成を1枚にして、合意してから作ります"],
  ];
  let y=1.55;
  q.forEach(([t,yes,no],i)=>{
    s.addShape(P.ShapeType.roundRect,{x:0.65,y,w:11.97,h:0.94,rectRadius:0.1,fill:{color:"F7FAFA"},line:{color:C.LINE,width:1}});
    s.addShape(P.ShapeType.ellipse,{x:0.9,y:y+0.3,w:0.34,h:0.34,fill:{color:C.NAVY}});
    s.addText(String(i+1),{x:0.9,y:y+0.3,w:0.34,h:0.34,align:"center",valign:"middle",fontSize:12,bold:true,color:C.WHITE,fontFace:F,isTextBox:true,margin:0});
    s.addText(t,{x:1.38,y:y+0.05,w:3.6,h:0.84,fontSize:12.5,bold:true,color:C.NAVY,fontFace:F,isTextBox:true,margin:0,valign:"middle",lineSpacingMultiple:1.2});
    s.addShape(P.ShapeType.roundRect,{x:5.1,y:y+0.08,w:3.6,h:0.78,rectRadius:0.08,fill:{color:"EDF3F1"},line:{color:C.GREEN,width:1}});
    s.addText([{text:"はい → ",options:{bold:true,color:C.GREEN,fontSize:10.5}},{text:yes,options:{color:C.INK,fontSize:10.5}}],
      {x:5.28,y:y+0.12,w:3.28,h:0.7,fontFace:F,isTextBox:true,margin:0,valign:"middle",lineSpacingMultiple:1.2});
    s.addShape(P.ShapeType.roundRect,{x:8.85,y:y+0.08,w:3.77,h:0.78,rectRadius:0.08,fill:{color:"FDF0E6"},line:{color:C.SUND,width:1}});
    s.addText([{text:"いいえ → ",options:{bold:true,color:C.SUND,fontSize:10.5}},{text:no,options:{color:C.INK,fontSize:10.5}}],
      {x:9.03,y:y+0.12,w:3.45,h:0.7,fontFace:F,isTextBox:true,margin:0,valign:"middle",lineSpacingMultiple:1.2});
    y+=1.0;
  });
  B.box(s,0.65,y+0.1,11.97,0.6,"「いいえ」が多いほど、作るものは小さく、早くなります。それは後退ではありません。","","ok");
  s.addNotes("いいえが多い＝規模が小さい、を否定的に扱わない。");
}

/* 18-13 やらなくてよいこと */
{
  const s=P.addSlide();
  B.head(s,"やらなくてよいこと","力の入れどころを間違えないための一覧です",{lv:"read"});
  const nots=[
    ["全ページを、一度に完成させる","トップと、申し込みの導線。この2つが動いていれば公開できます。残りは公開後に足す方が、結局は早く仕上がります。"],
    ["スマートフォンのアプリを作る","ほとんどの場合、必要ありません。サイトがスマホで見やすければ、それで足ります。"],
    ["動きの多い演出を入れる","読む方の年齢層によっては、かえって読みにくくなります。アスパスでは、動きは最小限にしています。"],
    ["会員登録やマイページを作る","運用の手間と、個人情報を預かる責任が一気に増えます。必要になってからで間に合います。"],
    ["SNSを全部やる","続けられる数だけで結構です。アスパスも、更新しているのは実質2つです。"],
    ["多言語に対応する","必要になってから足せます。アスパスの英語切替も、あとから付けたものです。"],
    ["最初からロゴを完璧にする","文字だけでも始められます。あとから差し替えられる作りにしておけば十分です。"],
  ];
  const y=B.rows(s,0.65,1.5,11.97,nots,0.66,4.2,12);
  B.box(s,0.65,y+0.12,11.97,0.82,"迷ったら、公開を早める方を選んでください",
    "公開しないと、何が足りないかは分かりません。アスパスも、公開してから直した箇所の方が多いです。","ok");
  s.addNotes("過剰な要件を先回りして潰す。公開を早める方を選ぶ、が結論。");
}

/* 18-14 手間の配分 */
{
  const s=P.addSlide();
  B.head(s,"手間がかかるのは、作ることではありません","アスパスの場合、時間の使われ方はこうでした",{lv:"read"});
  const bar=[
    ["決める・言葉を選ぶ",0.35,C.NAVY,"誰に何を言うか。打合せ4回。いちばん時間を使いました"],
    ["写真と素材を揃える",0.20,C.SUND,"撮影・許可取り・差し替え。あとから何度も戻りました"],
    ["作る（実装）",0.20,C.GREEN,"形にする作業。ここは、決まってさえいれば速く進みます"],
    ["公開後の調整",0.25,C.PURPLE,"検索対策・表示の直し・文言の追加。今も続いています"],
  ];
  let x=0.65;
  bar.forEach(([t,r,col])=>{
    const w=11.97*r;
    s.addShape(P.ShapeType.roundRect,{x,y:1.6,w:w-0.06,h:0.72,rectRadius:0.08,fill:{color:col}});
    s.addText(Math.round(r*100)+"%",{x,y:1.6,w:w-0.06,h:0.72,align:"center",valign:"middle",fontSize:15,bold:true,color:C.WHITE,fontFace:F,isTextBox:true,margin:0});
    x+=w;
  });
  let y=2.55;
  bar.forEach(([t,r,col,d])=>{
    s.addShape(P.ShapeType.roundRect,{x:0.65,y,w:11.97,h:0.68,rectRadius:0.08,fill:{color:"F7FAFA"},line:{color:C.LINE,width:1}});
    s.addShape(P.ShapeType.roundRect,{x:0.92,y:y+0.16,w:0.22,h:0.36,rectRadius:0.05,fill:{color:col}});
    s.addText(t,{x:1.35,y:y+0.02,w:3.5,h:0.64,fontSize:13,bold:true,color:C.NAVY,fontFace:F,isTextBox:true,margin:0,valign:"middle"});
    s.addText(d,{x:5.0,y:y+0.02,w:7.4,h:0.64,fontSize:11,color:C.INK,fontFace:F,isTextBox:true,margin:0,valign:"middle"});
    y+=0.74;
  });
  B.box(s,0.65,y+0.1,5.85,1.55,"つまり、7割は「作る前」と「作ったあと」です",
    "ご依頼をいただく前に、前ページまでの問いに答えを出しておいていただけると、ここが大きく縮みます。逆に、決まらないまま作り始めると、作り直しが増えます。","info");
  B.box(s,6.77,y+0.1,5.85,1.55,"ご相談の段階で、あるとありがたいもの",
    "・誰に届けたいか、ひと言で\n・いま手元にある写真と資料\n・参考にしたいサイトを2〜3件（理由つき）\n・更新にかけられる時間の見込み","ok");
  s.addNotes("見積の前段。決まっていないことがコストになる、という説明に使う。");
}

/* 18-15 構成メモ（用紙） */
{
  const s=P.addSlide();
  B.head(s,"構成メモ 1枚","これが、この部の目的地です。空欄のままお持ちいただいて構いません",{lv:"read"});
  B.code(s,0.65,1.65,11.97,4.85,"そのまま書き写してお使いください",
`【 1 】 誰に　＿＿＿＿＿＿＿＿＿＿＿＿＿ でお困りの、＿＿＿＿＿＿＿＿＿＿＿＿＿ の方へ

【 2 】 何を　＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿ を提供します

【 3 】 決め手（3つまで）　①＿＿＿＿＿＿＿＿　②＿＿＿＿＿＿＿＿　③＿＿＿＿＿＿＿＿

【 4 】 入口（ひとつに）　□電話　□LINE　□フォーム　□予約システム　□その他＿＿＿＿

【 5 】 型（ひとつに）　　□信頼型　　□予約型　　□教育型　　□紹介型

【 6 】 最初に作るページ　□トップ　□料金　□プロフィール　□アクセス　□よくある質問

【 7 】 手元にある素材　　□顔写真　□施術中の写真　□声　□資格　□料金表　□外観

【 8 】 更新　＿＿＿＿＿＿＿ が、＿＿＿＿ に ＿＿ 回、＿＿＿＿＿＿＿＿ を更新する

【 9 】 書かないと決めること　＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿

【10】 1年後　＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿ なっている`,11);
  B.box(s,0.65,6.6,11.97,0.55,"【3】と【4】と【9】。この3つが埋まっていれば、あとは一緒に決められます。","","ok");
  s.addNotes("この用紙を印刷して渡す想定。3・4・9が埋まればヒアリングが半分終わる。");
}

/* 18-16 記入例 */
{
  const s=P.addSlide();
  B.head(s,"構成メモ 記入例","架空の例です。こう埋まれば、翌週には形が見えます",{lv:"read"});
  B.code(s,0.65,1.65,7.75,5.0,"例：言語聴覚士の、ことばの教室（架空）",
`【 1 】 誰に　脳卒中のあとの失語症でお困りの、ご本人とご家族へ

【 2 】 何を　週1回50分の、1対1のことばの練習を提供します

【 3 】 決め手　①病院勤務18年　②失語症だけを扱う　③家族向けの
　　　　　　　　　接し方の指導まで含む

【 4 】 入口　■ LINE　（電話は診療中に出られないため置かない）

【 5 】 型　　■ 信頼型（紹介が8割のため）

【 6 】 最初に作るページ
　　　　■トップ　■プロフィール　■料金　■よくある質問　■アクセス

【 7 】 素材　■顔写真　■練習中の写真　□声　■資格　■料金表　■外観

【 8 】 更新　私が、月に1回、よくある質問を1つ足す

【 9 】 書かない　小児の発音、嚥下の訓練（できるが、看板にはしない）

【10】 1年後　医師から紹介された方が、迷わず申し込めるように`,11);
  B.box(s,8.6,1.65,4.02,1.7,"注目していただきたいのは【9】",
    "「できるが、看板にはしない」。ここを決めた瞬間に、トップに載せる言葉が定まります。","ok");
  B.box(s,8.6,3.5,4.02,1.6,"【4】に理由が書いてある",
    "「診療中に出られないから電話を置かない」。これは事業の事情であって、正解ではありません。理由まで書くと、あとで見直せます。","info");
  B.box(s,8.6,5.25,4.02,1.4,"【8】が現実的",
    "月1回、質問を1つ。この程度でも、1年で12個増えます。続く量にしておくのが要点です。","ok");
  s.addNotes("記入例は、埋め方の見本というより「決め方」の見本として使う。");
}

/* 18-17 ここから先の進め方 */
{
  const s=P.addSlide();
  B.head(s,"ここから先の進め方","アスパスのときと同じ順序です",{lv:"read"});
  B.steps(s,0.65,1.55,7.3,[
    {t:"構成メモを持って、一度お話しする",d:"空欄のままで構いません。空欄がどこかを見るのが目的です"},
    {t:"サイトの地図を1枚にする",d:"ページの数と並び順。ここで合意してから作り始めます"},
    {t:"文章を先に決める",d:"見た目より先。文章が決まると、見た目はほぼ自動的に決まります"},
    {t:"写真を揃える",d:"足りないものは、無くても進みます。あとから差し替えられます"},
    {t:"形にして、実物を見ながら直す",d:"画面で見ると、必ず言いたいことが変わります。それが普通です"},
    {t:"公開して、検索に載せる",d:"公開＝完成ではありません。ここからが本番です"},
    {t:"更新の練習をする",d:"ご自身で1か所直すところまでを、一緒にやります"},
  ],0.72,13);
  B.box(s,8.15,1.55,4.47,2.5,"アスパスの場合",
    "打合せ4回、公開まで約2か月。いちばん時間がかかったのは、③の文章を決めるところでした。\n\n作る作業そのものは、決まってさえいれば長くかかりません。","info");
  B.box(s,8.15,4.25,4.47,2.9,"この資料の残り17部について",
    "第1部から第17部までは、アスパス様のための実務資料です。\n\nただ、「公開したあと、何が起きるのか」「誰が、何を、どれくらいの頻度で触ることになるのか」は、分野が違っても、ほぼ同じです。\n\n作る前に第4部（日々の運用）と第13部（止まったときの初動）を眺めておくと、覚悟が決まります。","ok");
  s.addNotes("締め。第4部と第13部を先に見せると、運用の現実が伝わる。");
}

};
