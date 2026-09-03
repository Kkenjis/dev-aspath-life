// ASPATH 総合版 ── 第0部〜第3部（はじめに／企画と設計／制作と仕組み／公開と移行）
// 単体では出力しない。総合版pptxを作る.js から読み込まれる。
const { C, F, MONO, LV } = require("./総合版_lib.js");

module.exports = function build(P, B){

/* ══════════════ 第0部 はじめに ══════════════ */

/* 表紙 */
{
  const s=P.addSlide(); s.background={color:C.NAVY};
  s.addText("ASPATH",{x:0.9,y:1.25,w:8,h:0.5,fontSize:17,bold:true,color:C.SUN,charSpacing:6,fontFace:F,isTextBox:true,margin:0});
  s.addText("ウェブサイト 総合ドキュメント",{x:0.9,y:1.85,w:11.5,h:1.0,fontSize:40,bold:true,color:C.WHITE,fontFace:F,isTextBox:true,margin:0});
  s.addText("企画から、制作・公開・運用・保守まで",{x:0.9,y:3.0,w:11,h:0.5,fontSize:18,color:"CFE0E4",fontFace:F,isTextBox:true,margin:0});
  s.addShape(P.ShapeType.roundRect,{x:0.9,y:3.85,w:11.5,h:1.5,rectRadius:0.14,fill:{color:C.DEEP}});
  s.addText("このサイトが「なぜ、こうなっているのか」を残すための資料です。\n手順だけでなく、そう決めた理由まで書いてあります。",
    {x:1.2,y:4.05,w:10.9,h:1.1,fontSize:14,color:"DCE7EA",fontFace:F,isTextBox:true,margin:0,lineSpacingMultiple:1.35});
  s.addText("https://aspath-life.com/　／　2026年9月　ASPATH 様　ご納品資料",
    {x:0.9,y:6.25,w:11,h:0.4,fontSize:12,color:"9FBAC1",fontFace:F,isTextBox:true,margin:0});
  B.page++;
  s.addNotes("全網羅版。通読は想定せず、必要な部を開く使い方。");
}

/* この資料の使い方 */
{
  const s=P.addSlide();
  B.head(s,"この資料の使い方","全部を読む必要はありません。必要な部だけ開いてください");
  const parts=[
    ["1","企画と設計","なぜこのサイトを作ったか。何を決めたか",C.PURPLE],
    ["2","制作と仕組み","どういう作りになっているか",C.NAVY],
    ["3","公開と移行","どうやって公開したか。何が起きたか",C.NAVY],
    ["4","日々の運用","記事・申込・写真・コメント",C.SUN],
    ["5","壊さない触り方","テーマ入替・固定ページ・検索対策",C.SUND],
    ["6","点検と保守","公開後の点検。月に1回5分",C.RED],
    ["7","AIの活用","そのまま使えるプロンプト集",C.PURPLE],
  ];
  let y=1.55;
  parts.forEach(([n,t,d,col])=>{
    s.addShape(P.ShapeType.roundRect,{x:0.65,y,w:11.97,h:0.62,rectRadius:0.08,fill:{color:"F7FAFA"},line:{color:C.LINE,width:1}});
    s.addShape(P.ShapeType.roundRect,{x:0.9,y:y+0.11,w:0.85,h:0.4,rectRadius:0.08,fill:{color:col}});
    s.addText("第"+n+"部",{x:0.9,y:y+0.11,w:0.85,h:0.4,align:"center",valign:"middle",
      fontSize:10.5,bold:true,color:C.WHITE,fontFace:F,isTextBox:true,margin:0});
    s.addText(t,{x:1.95,y:y+0.13,w:3.4,h:0.36,fontSize:13.5,bold:true,color:C.NAVY,fontFace:F,isTextBox:true,margin:0,valign:"middle"});
    s.addText(d,{x:5.5,y:y+0.13,w:6.9,h:0.36,fontSize:12,color:C.MUTED,fontFace:F,isTextBox:true,margin:0,valign:"middle"});
    y+=0.66;
  });
  B.box(s,0.65,y+0.12,11.97,0.9,"よく使うのは第4部です",
    "日々の更新は第4部だけで足ります。第1〜3部は「なぜこうなっているか」を知りたくなったときに開いてください。","ok");
  s.addNotes("7部構成。通読不要であることを最初に伝える。");
}

/* 難易度の見方 */
{
  const s=P.addSlide();
  B.head(s,"ページの右上にある印について","「これは自分がやる話か」が一目で分かるようにしました");
  const lv=[
    ["easy","山口様がご自身でできます","管理画面から数クリックで終わる作業です。迷ったら、まずここから。"],
    ["step","少し慣れたら挑戦できます","手順どおりに進めれば大丈夫です。うまくいかなければ、そこで止めてご連絡ください。"],
    ["together","開発担当と一緒にやります","ファイルを直接さわる作業です。無理に進めず、声をかけてください。"],
    ["read","読むだけで結構です","仕組みの説明です。作業はありません。知っておくと、あとで役に立ちます。"],
  ];
  let y=1.6;
  lv.forEach(([k,t,d])=>{
    const v=LV[k];
    s.addShape(P.ShapeType.roundRect,{x:0.65,y,w:11.97,h:1.15,rectRadius:0.1,fill:{color:v.bg},line:{color:v.color,width:1.2}});
    s.addShape(P.ShapeType.roundRect,{x:0.95,y:y+0.35,w:2.17,h:0.45,rectRadius:0.22,fill:{color:C.WHITE},line:{color:v.color,width:1.2}});
    s.addText(v.label,{x:0.95,y:y+0.35,w:2.17,h:0.45,align:"center",valign:"middle",
      fontSize:12,bold:true,color:v.color,fontFace:F,isTextBox:true,margin:0});
    s.addText(t,{x:3.4,y:y+0.18,w:9.0,h:0.38,fontSize:14.5,bold:true,color:C.NAVY,fontFace:F,isTextBox:true,margin:0});
    s.addText(d,{x:3.4,y:y+0.6,w:9.0,h:0.42,fontSize:12,color:C.INK,fontFace:F,isTextBox:true,margin:0});
    y+=1.18;
  });
  B.box(s,0.65,y+0.08,11.97,0.8,"「一緒にやる」でも、コピペで済むように作ってあります",
    "難しい作業ほど、貼り付けるだけの形にしています。中身を理解していなくても動きます。","info");
  s.addNotes("難易度の凡例。心理的なハードルを下げるのが目的。");
}

/* サイトの全体像 */
{
  const s=P.addSlide();
  B.head(s,"サイトの全体像","1枚で把握できるようにまとめました",{lv:"read"});
  const cols=[
    ["お客様が見る場所", C.SUN, ["トップページ","ASPATHについて","プランと料金","アクセス","よくある質問","コラム（7記事）","お知らせ（3件）","初回体験フォーム"]],
    ["動かしている仕組み", C.NAVY, ["WordPress","専用テーマ aspath","プラグイン16個","SureForms（問合せ）","SureRank（検索対策）","Super Page Cache","LatePoint（予約）","Site Kit（解析）"]],
    ["外とつながる先", C.PURPLE, ["公式LINE","Google アナリティクス","Google Search Console","Instagram","YouTube","Gmail（通知の受け取り）","エックスサーバー","GitHub（ソース管理）"]],
  ];
  cols.forEach(([t,col,items],i)=>{
    const x=0.65+i*4.05;
    s.addShape(P.ShapeType.roundRect,{x,y:1.55,w:3.75,h:4.6,rectRadius:0.12,fill:{color:"F7FAFA"},line:{color:C.LINE,width:1.2}});
    s.addShape(P.ShapeType.roundRect,{x:x+0.25,y:1.78,w:3.25,h:0.5,rectRadius:0.1,fill:{color:col}});
    s.addText(t,{x:x+0.25,y:1.78,w:3.25,h:0.5,align:"center",valign:"middle",
      fontSize:13,bold:true,color:C.WHITE,fontFace:F,isTextBox:true,margin:0});
    s.addText(items.map((v,j)=>({text:v,options:{bullet:true,breakLine:j<items.length-1}})),
      {x:x+0.35,y:2.45,w:3.05,h:3.5,fontSize:11.5,color:C.INK,fontFace:F,isTextBox:true,margin:0,paraSpaceAfter:6});
  });
  B.box(s,0.65,6.35,11.97,0.85,"この3つが、それぞれ独立しています",
    "見た目を直してもデータは消えません。プラグインを止めても記事は残ります。壊れる範囲は、思っているより狭いです。","ok");
  s.addNotes("全体像。壊れる範囲が限定的であることを最初に安心材料として伝える。");
}

/* ══════════════ 第1部 企画と設計 ══════════════ */
{ const s=P.addSlide();
  B.partCover(s,"1","企画と設計",[
    "なぜ、このサイトを作ったのか",
    "打合せで決めたこと（全4回）",
    "ブランド方針の転換 ─ パーキンソン病専門へ",
    "ブランドの決めごと（色・書体・言葉づかい）",
    "サイトの構成と、ページの一覧",
    "お客様の動線 ─ なぜ公式LINEに一本化したか",
  ],C.PURPLE);
  s.addNotes("第1部は「なぜ」の記録。読むだけの章。");
}

/* なぜ作ったか */
{
  const s=P.addSlide();
  B.head(s,"なぜ、このサイトを作ったのか","出発点を残しておきます",{lv:"read"});
  B.rows(s,0.65,1.55,11.97,[
    ["前のサイトの課題","山口様がご自身で作られていました。情報は揃っていましたが、初めての方に「専門性」と「信頼感」が伝わりにくい状態でした。"],
    ["いちばんの目的","パーキンソン病でお困りの方とご家族に、「ここなら任せられる」と感じていただくこと。"],
    ["ゴールの形","サイトを見た方が、迷わず公式LINEに登録し、初回体験のお申し込みまで進めること。"],
    ["対象の地域","鹿児島市内（天文館・鹿児島中央・城西）。オンラインとご自宅訪問で、遠方の方にも対応。"],
    ["運営の前提","開発担当が離れたあとも、山口様おひとりで更新を続けられること。"],
  ],0.92,3.0,12.5);
  B.box(s,0.65,6.35,11.97,0.85,"最後の1行が、この資料が存在する理由です",
    "「作って終わり」にしないために、判断の理由まで含めて残しています。","info");
  s.addNotes("最後の行が全体の設計思想。");
}

/* 打合せの経緯 */
{
  const s=P.addSlide();
  B.head(s,"打合せで決めたこと","全4回。大きな方針はここで固まりました",{lv:"read"});
  const mtg=[
    ["第1回","要件の確認","ターゲット、載せたい内容、参考にしたいサイトの共有"],
    ["第2回","構成の合意","8つのセクション構成を決定。ページの並び順を確定"],
    ["第3回","デザインの確認","配色・写真・イラストの方向性。ロゴの扱い"],
    ["第4回","方針の転換と細部","2026年7月24日。パーキンソン病専門への特化、公式LINEへの一本化を決定"],
  ];
  let y=1.55;
  mtg.forEach(([n,t,d],i)=>{
    const last=i===mtg.length-1;
    s.addShape(P.ShapeType.roundRect,{x:0.65,y,w:11.97,h:1.05,rectRadius:0.1,
      fill:{color:last?"FDF0E6":"F7FAFA"},line:{color:last?C.SUND:C.LINE,width:last?1.4:1}});
    s.addShape(P.ShapeType.roundRect,{x:0.95,y:y+0.28,w:1.25,h:0.5,rectRadius:0.1,fill:{color:last?C.SUND:C.NAVY}});
    s.addText(n,{x:0.95,y:y+0.28,w:1.25,h:0.5,align:"center",valign:"middle",
      fontSize:12.5,bold:true,color:C.WHITE,fontFace:F,isTextBox:true,margin:0});
    s.addText(t,{x:2.45,y:y+0.15,w:3.2,h:0.36,fontSize:14.5,bold:true,color:C.NAVY,fontFace:F,isTextBox:true,margin:0});
    s.addText(d,{x:2.45,y:y+0.55,w:9.9,h:0.4,fontSize:12,color:C.INK,fontFace:F,isTextBox:true,margin:0});
    y+=1.17;
  });
  B.box(s,0.65,y+0.15,11.97,1.05,"第4回が転換点でした",
    "ここで「脳卒中を外し、パーキンソン病専門として打ち出す」と決まりました。サイトの文言・構成・コラムまで影響した、いちばん大きな決定です。","warn");
  s.addNotes("議事録は 第4回_ASPATH_打合せ議事録.md に全文あり。");
}

/* ブランド方針の転換 */
{
  const s=P.addSlide();
  B.head(s,"ブランド方針の転換","「脳卒中も診る」から「パーキンソン病専門」へ",{lv:"read"});
  s.addShape(P.ShapeType.roundRect,{x:0.65,y:1.5,w:5.8,h:2.3,rectRadius:0.12,fill:{color:"F7FAFA"},line:{color:C.LINE,width:1.2}});
  s.addText("変更前",{x:0.95,y:1.7,w:5.2,h:0.35,fontSize:13,bold:true,color:C.MUTED,fontFace:F,isTextBox:true,margin:0});
  s.addText("ASPATH・アスパス：\n鹿児島のパーキンソン病と脳卒中専門の\nトレーニングスタジオ",
    {x:0.95,y:2.15,w:5.2,h:1.3,fontSize:13.5,color:C.INK,fontFace:F,isTextBox:true,margin:0,lineSpacingMultiple:1.3});
  s.addShape(P.ShapeType.roundRect,{x:6.82,y:1.5,w:5.8,h:2.3,rectRadius:0.12,fill:{color:"EDF6EE"},line:{color:C.GREEN,width:1.4}});
  s.addText("変更後",{x:7.12,y:1.7,w:5.2,h:0.35,fontSize:13,bold:true,color:C.GREEN,fontFace:F,isTextBox:true,margin:0});
  s.addText("ASPATH｜\n鹿児島のパーキンソン病専門\nトレーニングスタジオ",
    {x:7.12,y:2.15,w:5.2,h:1.3,fontSize:13.5,bold:true,color:C.NAVY,fontFace:F,isTextBox:true,margin:0,lineSpacingMultiple:1.3});
  s.addText("→",{x:6.35,y:2.4,w:0.5,h:0.5,align:"center",fontSize:26,bold:true,color:C.SUN,fontFace:F,isTextBox:true,margin:0});

  B.rows(s,0.65,4.0,11.97,[
    ["事業としては","脳卒中の方も、これまでどおり対象です。診ないという意味ではありません。"],
    ["サイト上では","「専門」と言い切ることで、パーキンソン病でお困りの方に届きやすくします。"],
    ["残したもの","山口様のご資格「脳卒中療養指導士」、ご経歴、受賞論文。これらは信頼の裏付けです。"],
  ],0.78,2.6,12.5);
  B.box(s,0.65,6.5,11.97,0.72,"2026年9月、この方針にあわせてサイト全体の表記を統一しました。","","ok");
  s.addNotes("「診ない」ではなく「打ち出さない」。ここを誤解しないよう明記。");
}

/* ブランドの決めごと */
{
  const s=P.addSlide();
  B.head(s,"ブランドの決めごと","色・書体・言葉づかい。ここを守ると、統一感が保てます",{lv:"read"});
  s.addText("色",{x:0.65,y:1.5,w:2,h:0.35,fontSize:14,bold:true,color:C.NAVY,fontFace:F,isTextBox:true,margin:0});
  const colors=[["264653","紺色","#264653","見出し・本文・背景の濃い部分"],
                ["F4A261","オレンジ","#F4A261","強調・ボタン・アクセント"],
                ["F4E9D8","生成り","#F4E9D8","やわらかい背景"],
                ["1E3A44","濃紺","#1E3A44","さらに濃い背景"]];
  colors.forEach(([hex,n,code,use],i)=>{
    const x=0.65+i*3.04;
    s.addShape(P.ShapeType.roundRect,{x,y:1.9,w:2.8,h:1.5,rectRadius:0.1,fill:{color:hex},line:{color:"C9D5D9",width:1}});
    s.addText(n,{x,y:3.45,w:2.8,h:0.3,align:"center",fontSize:12.5,bold:true,color:C.NAVY,fontFace:F,isTextBox:true,margin:0});
    s.addText(code,{x,y:3.73,w:2.8,h:0.28,align:"center",fontSize:11,color:C.MUTED,fontFace:MONO,isTextBox:true,margin:0});
    s.addText(use,{x,y:4.02,w:2.8,h:0.5,align:"center",fontSize:10.5,color:C.MUTED,fontFace:F,isTextBox:true,margin:0,lineSpacingMultiple:1.2});
  });
  B.rows(s,0.65,4.7,11.97,[
    ["書体","見出しは明朝体（Zen Old Mincho）、本文はゴシック体（Zen Kaku Gothic New）。落ち着きと読みやすさの両立。"],
    ["言葉づかい","「ですます調」。専門用語には必ず言い換えを添える。効果の断定はしない。"],
  ],0.78,2.0,12.5);
  B.box(s,0.65,6.35,11.97,0.85,"色のコードは、AIに画像を作らせるときにも使います",
    "第7部のプロンプトに、この3色を指定する形で書いてあります。","info");
  s.addNotes("色コードは AI活用編のプロンプトと連動している。");
}

/* サイト構成 */
{
  const s=P.addSlide();
  B.head(s,"サイトの構成とページ一覧","公開しているのは13ページです",{lv:"read"});
  const pages=[
    ["トップページ","/","サイトの顔。悩み→変化→料金→導線の順"],
    ["ASPATHについて","/about/","理念・代表紹介・トレーニングの考え方"],
    ["プランと料金","/services/","初回体験と継続プラン。体チェックの紹介"],
    ["アクセス","/access/","天文館・鹿児島中央・城西の3スタジオ"],
    ["初回体験・お問い合わせ","/contact/","公式LINE優先。フォームも併設"],
    ["よくある質問","/faq/","6問。検索対象からは外しています"],
    ["コラム","/column/","読みもの7記事"],
    ["お知らせ","/category/info/","告知3件"],
    ["初回体験フォーム","/taiken-2026as9y/","公式LINE登録者向けの限定URL"],
  ];
  let y=B.rows(s,0.65,1.5,11.97,pages.map(([n,u,d])=>[n+"　"+u, d]),0.54,4.4,11.5);
  B.box(s,0.65,y+0.12,11.97,0.85,"このほかに、サイトマップ・プライバシーポリシー・特定商取引法の3ページがあります",
    "法令や信頼性のために必要なページです。内容が変わることはほとんどありません。","info");
  s.addNotes("URL一覧は ★URL一覧.md に全件。");
}

/* 導線設計 */
{
  const s=P.addSlide();
  B.head(s,"お客様の動線","なぜ、公式LINEに一本化したのか",{lv:"read"});
  const flow=[["1","サイトを見る","悩みに共感してもらう"],
              ["2","公式LINEに登録","ここが唯一の入口"],
              ["3","限定URLを受け取る","LINEでフォームのURLをお渡し"],
              ["4","初回体験を申し込む","半額4,400円が適用"]];
  flow.forEach(([n,t,d],i)=>{
    const x=0.65+i*3.04;
    s.addShape(P.ShapeType.roundRect,{x,y:1.5,w:2.8,h:1.75,rectRadius:0.12,fill:{color:C.PAPER},line:{color:C.PAPERLINE,width:1}});
    s.addShape(P.ShapeType.ellipse,{x:x+1.15,y:1.72,w:0.5,h:0.5,fill:{color:C.SUN}});
    s.addText(n,{x:x+1.15,y:1.72,w:0.5,h:0.5,align:"center",valign:"middle",fontSize:17,bold:true,color:C.WHITE,fontFace:F,isTextBox:true,margin:0});
    s.addText(t,{x:x+0.1,y:2.35,w:2.6,h:0.36,align:"center",fontSize:13,bold:true,color:C.NAVY,fontFace:F,isTextBox:true,margin:0});
    s.addText(d,{x:x+0.1,y:2.72,w:2.6,h:0.42,align:"center",fontSize:11,color:C.MUTED,fontFace:F,isTextBox:true,margin:0,lineSpacingMultiple:1.2});
    if(i<3) s.addText("›",{x:x+2.8,y:2.15,w:0.24,h:0.5,align:"center",valign:"middle",fontSize:24,bold:true,color:C.SUN,fontFace:F,isTextBox:true,margin:0});
  });
  B.rows(s,0.65,3.5,11.97,[
    ["なぜ一本化したか","入口が2つあると、お客様が迷います。第4回打合せで「公式LINEに絞る」と決めました。"],
    ["LINEの利点","登録後もこちらから連絡でき、関係が続きます。電話やメールより気軽に相談していただけます。"],
    ["ただし例外あり","地域柄、LINEを使われない方もいらっしゃいます。そのため、お問い合わせページにはフォームも残しています。"],
    ["半額の条件","公式LINEにご登録いただいた方が対象です。フォームからのお申し込みは通常8,800円になります。"],
  ],0.72,3.0,12);
  B.box(s,0.65,6.5,11.97,0.72,"「LINE優先／フォームも用意」が、いまの形です。","","ok");
  s.addNotes("LINE一本化は第4回の決定。ただし後日、フォーム併設に修正した経緯も含む。");
}

/* ══════════════ 第2部 制作と仕組み ══════════════ */
{ const s=P.addSlide();
  B.partCover(s,"2","制作と仕組み",[
    "どういう作りになっているか",
    "なぜ、HTMLからテーマを作っているのか",
    "ファイルとページの対応表",
    "プラグイン16個の役割",
    "フォーム・言語切替・スマホ対応の仕組み",
    "構造化データ ─ Googleへの申告",
  ],C.NAVY);
  s.addNotes("第2部は仕組みの説明。読むだけ＋一部コピペ。");
}

/* 技術構成 */
{
  const s=P.addSlide();
  B.head(s,"どういう作りになっているか","3つの層に分かれています",{lv:"read"});
  const layers=[
    ["サーバー","エックスサーバー","サイトの置き場所。契約はASPATH様名義",C.MUTED],
    ["WordPress","記事・画像・設定の入れもの","記事や写真は、ここに保存されています",C.NAVY],
    ["テーマ aspath","見た目と固定ページの中身","当サイト専用に作ったもの。ZIPで入れ替えます",C.SUN],
  ];
  let y=1.5;
  layers.forEach(([n,t,d,col])=>{
    s.addShape(P.ShapeType.roundRect,{x:0.65,y,w:11.97,h:1.2,rectRadius:0.1,fill:{color:"F7FAFA"},line:{color:C.LINE,width:1.2}});
    s.addShape(P.ShapeType.roundRect,{x:0.95,y:y+0.3,w:2.4,h:0.6,rectRadius:0.1,fill:{color:col}});
    s.addText(n,{x:0.95,y:y+0.3,w:2.4,h:0.6,align:"center",valign:"middle",fontSize:12.5,bold:true,color:C.WHITE,fontFace:F,isTextBox:true,margin:0});
    s.addText(t,{x:3.6,y:y+0.22,w:8.8,h:0.36,fontSize:14,bold:true,color:C.NAVY,fontFace:F,isTextBox:true,margin:0});
    s.addText(d,{x:3.6,y:y+0.63,w:8.8,h:0.4,fontSize:12,color:C.INK,fontFace:F,isTextBox:true,margin:0});
    y+=1.32;
  });
  B.box(s,0.65,y+0.15,5.85,1.5,"記事はWordPressの中",
    "コラム・お知らせ・コメント・お申し込みは、テーマを入れ替えても消えません。","ok");
  B.box(s,6.77,y+0.15,5.85,1.5,"固定ページはテーマの中",
    "トップやプランと料金の文章は、テーマの中にあります。だから管理画面から直せません。","warn");
  s.addNotes("この2つの違いが、道A／道Bの分岐の理由。");
}

/* なぜHTMLからテーマを作るのか */
{
  const s=P.addSlide();
  B.head(s,"なぜ、HTMLからテーマを作っているのか","デザインを崩さないための選択です",{lv:"read"});
  B.rows(s,0.65,1.5,11.97,[
    ["ふつうのWordPress","管理画面で誰でも文章を直せます。反面、レイアウトが崩れやすく、意図しない見た目になりがちです。"],
    ["このサイト","デザインを固めたHTMLを、そのままテーマに変換しています。崩れませんが、固定ページの文章は管理画面から直せません。"],
    ["決め手","「初めての方に信頼感を持ってもらう」が最優先でした。そのため、崩れないことを取りました。"],
    ["ただし例外","「ASPATHについて」だけは、文章をWordPress側に移してあります。ここは管理画面から直せます。"],
  ],0.95,3.2,12.5);
  s.addText("HTMLファイル　→　テーマを作る.ps1　→　aspath-theme.zip　→　WordPressにアップロード",
    {x:0.65,y:5.6,w:11.97,h:0.4,align:"center",fontSize:13,bold:true,color:C.NAVY,fontFace:MONO,isTextBox:true,margin:0});
  B.box(s,0.65,6.15,11.97,1.05,"この流れが、第5部で出てくる「道B」です",
    "固定ページを直すときは、この4段階を通ります。手順は第5部にまとめています。","info");
  s.addNotes("設計判断の理由。トレードオフを正直に書く。");
}

/* ファイル対応表 */
{
  const s=P.addSlide();
  B.head(s,"ファイルとページの対応表","固定ページを直すときは、この表を見てください",{lv:"together"});
  const rows=[["トップページ","/","index.html"],["ASPATHについて","/about/","about.html ※管理画面でも可"],
    ["プランと料金","/services/","price.html"],["アクセス","/access/","access.html"],
    ["初回体験・お問い合わせ","/contact/","contact.html"],["よくある質問","/faq/","faq.html"],
    ["サイトマップ","/sitemap/","sitemap.html"],["プライバシーポリシー","/privacy/","privacy.html"],
    ["特定商取引法","/tokushoho/","tokushoho.html"],["初回体験フォーム","/taiken-2026as9y/","trial-entry.html"],
    ["対面トレーニング","/taimentraining/","記事なので管理画面から"],["オンライン","/onlineaspath/","記事なので管理画面から"]];
  s.addTable([[{text:"ページ",options:{bold:true}},{text:"URL",options:{bold:true}},{text:"開くファイル",options:{bold:true}}]]
    .concat(rows.map(r=>[r[0],{text:r[1],options:{fontFace:MONO}},{text:r[2],options:{bold:/html/.test(r[2])}}])),
    {x:0.65,y:1.5,w:11.97,colW:[4.2,3.6,4.17],fontFace:F,fontSize:11.5,color:C.INK,
     border:{type:"solid",color:C.LINE,pt:1},fill:{color:C.WHITE},rowH:0.33,valign:"middle"});
  B.box(s,0.65,6.05,11.97,1.15,"下2つは「記事」なので、管理画面から直せます",
    "対面トレーニングとオンラインは、見た目はページですが中身は投稿です。第4部の手順で編集できます。","ok");
  s.addNotes("この表は サイト更新マニュアルにもある。総合版にも載せて自己完結させる。");
}

/* プラグイン */
{
  const s=P.addSlide();
  B.head(s,"プラグイン16個の役割","止めてよいもの・止めてはいけないもの",{lv:"read"});
  const must=[["SureForms","お問い合わせフォーム"],["SureRank SEO","検索対策（題名・説明文）"],
    ["Super Page Cache","表示を速くする"],["ASPATH 初回体験フォーム","申込フォーム（自作）"],
    ["Site Kit by Google","アナリティクス・Search Console"],["LatePoint","予約機能"]];
  const other=[["Optimole","画像の最適化"],["Spectra Legacy / Otter","記事の装飾ブロック"],
    ["LIQUID SPEECH BALLOON","吹き出し表示"],["All-in-One WP Migration","バックアップ"],
    ["WP STAGING","検証用の複製"],["CloudSecure WP Security","不正ログイン対策"],
    ["Duplicate Page","ページの複製"],["LightStart","メンテナンス表示"],["Starter Templates","雛形（未使用）"]];
  s.addShape(P.ShapeType.roundRect,{x:0.65,y:1.5,w:5.9,h:4.5,rectRadius:0.12,fill:{color:"FBEDEC"},line:{color:C.RED,width:1.2}});
  s.addText("止めてはいけない（6個）",{x:0.95,y:1.7,w:5.3,h:0.4,fontSize:15,bold:true,color:C.RED,fontFace:F,isTextBox:true,margin:0});
  let yy=2.2;
  must.forEach(([n,d])=>{
    s.addText(n,{x:0.95,y:yy,w:5.3,h:0.28,fontSize:12,bold:true,color:C.NAVY,fontFace:F,isTextBox:true,margin:0});
    s.addText(d,{x:0.95,y:yy+0.27,w:5.3,h:0.28,fontSize:10.5,color:C.MUTED,fontFace:F,isTextBox:true,margin:0});
    yy+=0.62;
  });
  s.addShape(P.ShapeType.roundRect,{x:6.72,y:1.5,w:5.9,h:4.5,rectRadius:0.12,fill:{color:"F7FAFA"},line:{color:C.LINE,width:1.2}});
  s.addText("補助的なもの（10個）",{x:7.02,y:1.7,w:5.3,h:0.4,fontSize:15,bold:true,color:C.MUTED,fontFace:F,isTextBox:true,margin:0});
  s.addText(other.map((o,i)=>({text:o[0]+"　"+o[1],options:{bullet:true,breakLine:i<other.length-1}})),
    {x:7.02,y:2.2,w:5.3,h:3.6,fontSize:11,color:C.INK,fontFace:F,isTextBox:true,margin:0,paraSpaceAfter:5});
  B.box(s,0.65,6.2,11.97,1.0,"プラグインの更新は、バックアップを取ってから",
    "左の6個は、止めるとサイトの機能が失われます。更新自体は必要ですが、必ず作業前にバックアップを取ってください（第5部）。","warn");
  s.addNotes("16個の棚卸し。止めてよい／いけないの線引きが実務で効く。");
}

/* 仕組みいろいろ */
{
  const s=P.addSlide();
  B.head(s,"知っておくと役に立つ仕組み","トラブルのときに、原因の見当がつきます",{lv:"read"});
  B.rows(s,0.65,1.5,11.97,[
    ["フォームの二重構成","お問い合わせはSureForms、初回体験は自作プラグイン。分けた理由は、申込内容を管理画面に残すためです。"],
    ["言語の切り替え","英語表示は、文字を丸ごと差し替える仕組みです。そのため、切り替え対象の中に画像を入れると消えます。"],
    ["スマホ対応","画面幅760pxを境に、レイアウトを切り替えています。ヒーロー写真だけは、スマホ用の縦長画像を別に用意しています。"],
    ["画像のキャッシュ","画像は1年間ブラウザに保存されます。差し替えても変わらないのはこのためで、ファイル名に印を付けて解決しています。"],
    ["ページ別のCSS","ページごとに見た目のファイルを分けています。1ページ直しても、他のページに影響しません。"],
  ],0.92,3.4,12),
  B.box(s,0.65,6.35,11.97,0.85,"どれも、実際にトラブルが起きて対処した結果です",
    "画像が変わらない・スマホで写真が出ない・英語にすると画像が消える。すべて経験済みです。","info");
  s.addNotes("実際に踏んだ問題から生まれた仕組み。");
}

/* 構造化データ */
{
  const s=P.addSlide();
  B.head(s,"構造化データ ─ Googleへの申告","人には見えませんが、検索結果に効きます",{lv:"read"});
  B.rows(s,0.65,1.5,11.97,[
    ["これは何か","「ここは治療院です」「住所はここです」「料金はこうです」と、機械が読める形でGoogleに伝えるデータです。"],
    ["HealthClub","業種・住所・営業エリア・代表者・料金プランを申告しています。トップページに出力。"],
    ["FAQPage","よくある質問6問を申告。トップページに出力しています。"],
    ["BreadcrumbList","「ホーム › プランと料金」のような階層。検索結果のURL部分に出ます。"],
    ["いちばん大事な決まり","申告した内容は、必ず画面にも表示されていること。これはGoogleの必須要件です。"],
  ],0.9,3.4,12.5);
  B.box(s,0.65,6.2,11.97,1.0,"2026年9月、この決まりに違反していた箇所を修正しました",
    "FAQの申告6問のうち5問が、実際のページに存在していませんでした。現在は実データから自動生成する方式に変えています。","warn");
  s.addNotes("規約違反だった実例。第6部の点検項目にもつながる。");
}

/* ══════════════ 第3部 公開と移行 ══════════════ */
{ const s=P.addSlide();
  B.partCover(s,"3","公開と移行",[
    "公開までの流れ",
    "なぜ「方式B」を選んだのか",
    "公開前におこなった最終点検",
    "旧URLの引き継ぎ（301転送）",
    "公開後に見つかった不具合と、その対処",
  ],C.NAVY);
  s.addNotes("第3部は公開の記録。同じ作業を繰り返すときの参照用。");
}

/* 公開までの流れ */
{
  const s=P.addSlide();
  B.head(s,"公開までの流れ","段階を踏んで、少しずつ確かめながら進めました",{lv:"read"});
  const ph=[["1","制作","HTMLでデザインを作り、山口様に確認いただく"],
    ["2","テーマ化","HTMLをWordPressテーマに変換"],
    ["3","仮公開","限定URLで山口様に確認いただく"],
    ["4","本番切替","方式Bで本番サイトを入れ替え"],
    ["5","公開後点検","実際のサイトで動作を確認"]];
  ph.forEach(([n,t,d],i)=>{
    const x=0.65+i*2.43;
    s.addShape(P.ShapeType.roundRect,{x,y:1.5,w:2.22,h:1.9,rectRadius:0.1,fill:{color:C.PAPER},line:{color:C.PAPERLINE,width:1}});
    s.addShape(P.ShapeType.ellipse,{x:x+0.86,y:1.72,w:0.5,h:0.5,fill:{color:C.NAVY}});
    s.addText(n,{x:x+0.86,y:1.72,w:0.5,h:0.5,align:"center",valign:"middle",fontSize:17,bold:true,color:C.WHITE,fontFace:F,isTextBox:true,margin:0});
    s.addText(t,{x:x+0.08,y:2.35,w:2.06,h:0.34,align:"center",fontSize:13,bold:true,color:C.NAVY,fontFace:F,isTextBox:true,margin:0});
    s.addText(d,{x:x+0.08,y:2.7,w:2.06,h:0.62,align:"center",fontSize:10.5,color:C.MUTED,fontFace:F,isTextBox:true,margin:0,lineSpacingMultiple:1.2});
  });
  B.rows(s,0.65,3.65,11.97,[
    ["いちばん時間をかけたところ","仮公開での確認です。実際の画面を見ていただき、細かい修正を重ねました。"],
    ["切替の所要時間","約3時間。うちサイトが止まったのは約40分でした。"],
    ["公開日","2026年9月　https://aspath-life.com/"],
  ],0.8,3.6,12.5);
  B.box(s,0.65,6.2,11.97,1.0,"詳しい手順は、別途の手順書に残しています",
    "★フェーズ9_本番切替_方式B_実行手順.md　に、コマンドまで含めて記録してあります。","info");
  s.addNotes("時間の実績値を残しておくと、次回の見積もりに使える。");
}

/* 方式B */
{
  const s=P.addSlide();
  B.head(s,"なぜ「方式B」を選んだのか","失敗したときの被害を、小さくするためです",{lv:"read"});
  s.addTable([
    [{text:"",options:{bold:true}},{text:"方式A（データを丸ごと移す）",options:{bold:true}},{text:"方式B（採用）",options:{bold:true,color:C.GREEN}}],
    ["URLの置換","52か所を一括置換。漏れると画像が全部消える","そもそも発生しない"],
    ["本番の既存データ","全部上書きされる","残る（触った部分だけ変わる）"],
    ["失敗したとき","バックアップから全体を戻す","その項目だけ直せばよい"],
    ["移行プラグイン","必要（有料版が要る）","不要"],
  ],{x:0.65,y:1.5,w:11.97,colW:[2.8,4.6,4.57],fontFace:F,fontSize:11.5,color:C.INK,
     border:{type:"solid",color:C.LINE,pt:1},fill:{color:C.WHITE},rowH:0.5,valign:"middle"});
  B.rows(s,0.65,4.3,11.97,[
    ["方式Bが選べた理由","このテーマは固定ページの中身をテーマ自身が持っています。本番にテーマを入れてURLを合わせるだけで、9ページ分の見た目が再現できました。"],
    ["実際に移したもの","記事3本の本文、画像18点、キャンペーン投稿、フォームのページ。これだけです。"],
  ],1.0,3.4,12.5);
  B.box(s,0.65,6.45,11.97,0.78,"「壊れる範囲を狭くする」という考え方は、運用でも同じです。","","ok");
  s.addNotes("設計判断。リスクを最小化する思想の実例。");
}

/* 公開前点検 */
{
  const s=P.addSlide();
  B.head(s,"公開前におこなった最終点検","2026年8月22日実施",{lv:"read"});
  const chk=[["表示の確認","全13ページを、PC・タブレット・スマホの3つの幅で確認"],
    ["リンクの確認","メニュー・フッター・本文中のリンクがすべて生きているか"],
    ["フォームの送信テスト","実際に申し込み、通知メールが届くことを確認"],
    ["メールの到達確認","迷惑メールに入らないか、Gmail側の設定も含めて確認"],
    ["画像の抜け確認","18点すべてが表示されるか。alt（代替文）も設定"],
    ["検索対策の初期設定","メタタグ・OGP・サイトマップ・Search Console登録"]];
  let y=B.rows(s,0.65,1.5,11.97,chk,0.72,4.4,12.5);
  B.box(s,0.65,y+0.15,11.97,1.0,"それでも、公開後に4件の不具合が見つかりました",
    "見た目では気づけないものでした。次のページで、その内容と対処を残します。","warn");
  s.addNotes("公開前点検は万全でも漏れる。だから公開後の点検が要る、という流れ。");
}

/* 公開後の不具合 */
{
  const s=P.addSlide();
  B.head(s,"公開後に見つかった不具合","すべて対処済みです。同じことが起きたときの参考に",{lv:"read"});
  const cases=[
    ["画像1枚ごとに、中身の無いページが作られていた","最大156ページ。Googleのサイトリンクに「ASPATHロゴ」として拾われていた","テーマ側で自動転送。解消"],
    ["404ページの正式URL指定が、管理画面を指していた","存在しないURLすべてで発生。未ログインでも再現","テーマ側で打ち消し。解消"],
    ["FAQの申告6問中5問が、ページ上に無かった","Googleの規約違反にあたる状態","実データから自動生成に変更"],
    ["同じ内容のページが2つあった","見出し4つが一致。導線のない方が検索に出ていた","301転送で1本に統合"],
    ["コラム3本の題名が60字を超えていた","検索結果で「…」と切れる状態","点検スクリプトが検出。短縮済み"]];
  let y=1.5;
  cases.forEach(([t,d,fix],i)=>{
    s.addShape(P.ShapeType.roundRect,{x:0.65,y,w:11.97,h:0.9,rectRadius:0.1,fill:{color:i%2?C.PAPER:"F7FAFA"},line:{color:C.LINE,width:1}});
    s.addText(t,{x:0.9,y:y+0.08,w:6.5,h:0.32,fontSize:12,bold:true,color:C.NAVY,fontFace:F,isTextBox:true,margin:0});
    s.addText(d,{x:0.9,y:y+0.4,w:6.5,h:0.44,fontSize:10,color:C.MUTED,fontFace:F,isTextBox:true,margin:0,lineSpacingMultiple:1.12});
    s.addShape(P.ShapeType.roundRect,{x:7.65,y:y+0.15,w:4.7,h:0.58,rectRadius:0.08,fill:{color:"EDF6EE"}});
    s.addText(fix,{x:7.8,y:y+0.2,w:4.4,h:0.48,fontSize:10.5,color:C.GREEN,fontFace:F,isTextBox:true,margin:0,valign:"middle"});
    y+=0.98;
  });
  B.box(s,0.65,y+0.08,11.97,0.72,"この5件が、第6部の点検項目のもとになっています。","","info");
  s.addNotes("公開後に見つかった実例。第6部への橋渡し。");
}

/* 301転送 */
{
  const s=P.addSlide();
  B.head(s,"旧URLの引き継ぎ（301転送）","前のサイトのURLを、無駄にしないための仕組み",{lv:"together"});
  B.rows(s,0.65,1.5,11.97,[
    ["301転送とは","「このページは、こちらに引っ越しました」とブラウザとGoogleに伝える仕組みです。"],
    ["なぜ必要か","旧URLにはGoogleの評価が溜まっています。ただ削除すると、その評価は捨てることになります。"],
    ["どこで設定するか","転送専用のプラグインは入れていません。テーマの中に転送表を持たせています。"],
  ],0.85,3.2,12.5);
  B.code(s,0.65,4.4,11.97,1.85,"テーマの functions.php にある転送表",
`function aspath_legacy_redirect_map() {
  return array(
    'for-parkinsons-disease' => '/パーキンソン病とアスパスの歩み方/',
    // 「旧スラッグ => 転送先のパス」を、ここに足していきます
  );
}`,11);
  B.box(s,0.65,6.4,11.97,0.8,"増やすときは1行足すだけです。書き方が分からなければ、ご連絡ください。","","ok");
  s.addNotes("プラグインを増やさない方針。1行追加で拡張できる形。");
}

};
