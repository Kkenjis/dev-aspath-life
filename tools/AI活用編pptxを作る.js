// ASPATH サイト運用マニュアル AI活用編 ── そのまま使えるプロンプト集
// 実行: NODE_PATH=<node_modules> node AI活用編pptxを作る.js
const pptx = require("pptxgenjs");

const P = new pptx();
P.layout = "LAYOUT_WIDE";
P.author = "ASPATH";
P.title  = "ASPATH サイト運用マニュアル AI活用編";

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

function prompt(s,x,y,w,h,label,text,fs){
  s.addShape(P.ShapeType.roundRect,{x,y,w,h,rectRadius:0.1,fill:{color:CODEBG},line:{color:"C9D5D9",width:1}});
  s.addShape(P.ShapeType.roundRect,{x:x+0.18,y:y-0.14,w:3.0,h:0.32,rectRadius:0.16,fill:{color:NAVY}});
  s.addText(label,{x:x+0.18,y:y-0.14,w:3.0,h:0.32,align:"center",valign:"middle",
    fontSize:10.5,bold:true,color:WHITE,fontFace:F,isTextBox:true,margin:0});
  s.addText(text,{x:x+0.24,y:y+0.26,w:w-0.48,h:h-0.44,
    fontSize:fs||10.5,color:INK,fontFace:MONO,isTextBox:true,margin:0,valign:"top",lineSpacingMultiple:1.22});
}

/* ══════ 1 表紙 ══════ */
{
  const s=P.addSlide(); s.background={color:NAVY};
  s.addText("ASPATH",{x:0.9,y:1.45,w:8,h:0.5,fontSize:17,bold:true,color:SUN,charSpacing:6,fontFace:F,isTextBox:true,margin:0});
  s.addText("サイト運用マニュアル",{x:0.9,y:2.05,w:11,h:0.95,fontSize:42,bold:true,color:WHITE,fontFace:F,isTextBox:true,margin:0});
  s.addShape(P.ShapeType.roundRect,{x:0.9,y:3.2,w:2.9,h:0.64,rectRadius:0.32,fill:{color:SUN}});
  s.addText("A I 活 用 編",{x:0.9,y:3.2,w:2.9,h:0.64,align:"center",valign:"middle",fontSize:18,bold:true,color:WHITE,fontFace:F,isTextBox:true,margin:0});
  s.addText("そのまま貼って使えるプロンプト集",{x:0.9,y:4.15,w:11,h:0.45,fontSize:16,color:"CFE0E4",fontFace:F,isTextBox:true,margin:0});
  s.addText("ChatGPT・Claude・Gemini、どれでも同じように使えます。",{x:0.9,y:4.75,w:11,h:0.45,fontSize:13,color:"9FBAC1",fontFace:F,isTextBox:true,margin:0});
  s.addText("2026年9月　ASPATH 様　ご納品資料",{x:0.9,y:6.3,w:8,h:0.4,fontSize:12,color:"9FBAC1",fontFace:F,isTextBox:true,margin:0});
  s.addNotes("幸喜はClaudeを使用中。どのAIでも動く書き方にしてある。");
}

/* ══════ 2 何に使えるか ══════ */
{
  const s=P.addSlide();
  head(s,"この冊子でできること","記事づくりから、点検結果の読み取りまで");
  const uses=[
    ["1","記事のネタを出す","何を書くか決まらないとき"],
    ["2","構成案を作る","書く順番を決める"],
    ["3","下書きを書かせる","たたき台をもらう"],
    ["4","説明文を作る","検索結果に出る文章"],
    ["5","返信文を作る","お問い合わせへのお返事"],
    ["6","イラストを作る","ブランドの色を保って"],
    ["7","点検結果を読む","×が出たときの意味を聞く"],
  ];
  let y=1.6;
  uses.forEach(([n,t,d],i)=>{
    s.addShape(P.ShapeType.roundRect,{x:0.65,y,w:11.97,h:0.58,rectRadius:0.08,
      fill:{color:i%2?PAPER:"F7FAFA"},line:{color:"DCE6E8",width:1}});
    s.addShape(P.ShapeType.ellipse,{x:0.88,y:y+0.12,w:0.34,h:0.34,fill:{color:SUN}});
    s.addText(n,{x:0.88,y:y+0.12,w:0.34,h:0.34,align:"center",valign:"middle",
      fontSize:12,bold:true,color:WHITE,fontFace:F,isTextBox:true,margin:0});
    s.addText(t,{x:1.4,y:y+0.11,w:4.0,h:0.36,fontSize:13.5,bold:true,color:NAVY,fontFace:F,isTextBox:true,margin:0,valign:"middle"});
    s.addText(d,{x:5.6,y:y+0.11,w:6.8,h:0.36,fontSize:11.5,color:MUTED,fontFace:F,isTextBox:true,margin:0,valign:"middle"});
    y+=0.66;
  });
  box(s,0.65,y+0.12,11.97,0.9,"どのAIでも、同じ書き方で動きます",
    "ChatGPT・Claude・Gemini、どれをお使いでも構いません。幸喜はClaudeを使っています。","info");
  s.addNotes("7用途。必要なページだけ開いて使う。");
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

/* ══════ 14 まとめ ══════ */
{
  const s=P.addSlide();
  s.background={color:NAVY};
  s.addText("AI活用編のまとめ",{x:0.9,y:0.85,w:11.5,h:0.75,fontSize:32,bold:true,color:WHITE,fontFace:F,isTextBox:true,margin:0});
  const sum=[
    ["1","たたき台をもらう","完成品を求めない。\n直す前提でもらうと速い"],
    ["2","個人情報は貼らない","お名前・連絡先・診断名は\n必ず伏せる"],
    ["3","医学的内容は必ず確認","実在しない研究を\n書くことがあります"],
  ];
  sum.forEach(([n,t,d],i)=>{
    const x=0.9+i*4.05;
    s.addShape(P.ShapeType.roundRect,{x,y:1.95,w:3.7,h:3.3,rectRadius:0.14,fill:{color:DEEP}});
    s.addShape(P.ShapeType.roundRect,{x:x+1.48,y:2.25,w:0.75,h:0.75,rectRadius:0.38,fill:{color:SUN}});
    s.addText(n,{x:x+1.48,y:2.25,w:0.75,h:0.75,align:"center",valign:"middle",fontSize:28,bold:true,color:WHITE,fontFace:F,isTextBox:true,margin:0});
    s.addText(t,{x:x+0.2,y:3.15,w:3.3,h:0.5,align:"center",fontSize:15.5,bold:true,color:WHITE,fontFace:F,isTextBox:true,margin:0});
    s.addText(d,{x:x+0.2,y:3.72,w:3.3,h:1.2,align:"center",fontSize:12.5,color:"AFC8CE",fontFace:F,isTextBox:true,margin:0,lineSpacingMultiple:1.35});
  });
  s.addText("この冊子のプロンプトは、コピーしてそのまま使えます。慣れたら、ご自身の言葉で書き換えてください。",
    {x:0.9,y:5.65,w:11.5,h:0.45,fontSize:14,color:"CFE0E4",fontFace:F,isTextBox:true,margin:0});
  s.addText("基本編（日々の更新）／応用編（壊さない触り方）／最応用編（点検と修正）もあわせてご覧ください。",
    {x:0.9,y:6.25,w:11.5,h:0.45,fontSize:12.5,color:"9FBAC1",fontFace:F,isTextBox:true,margin:0});
  s.addNotes("最後に、コピーして使ってよいことを伝えて終了。");
}

P.writeFile({fileName:"/tmp/deck7/ASPATH_サイト運用マニュアル_AI活用編.pptx"})
 .then(f=>console.log("作成:",f));
