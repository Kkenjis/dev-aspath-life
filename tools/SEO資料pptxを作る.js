const pptx=require('pptxgenjs'); const P=new pptx(); P.layout='LAYOUT_WIDE';
const NAVY='264653',SUN='DD8236',SUNL='F4A261',GREEN='2E7D32',GREY='5E7681',
      WHITE='FFFFFF',INK='1E2D34',RED='B85042';
const F='Meiryo';
const IMG='/sessions/compassionate-sweet-heisenberg/mnt/dev-aspath-life-main/_wp移行素材/★引継ぎ資料/画像/';
let n=0;
function head(s,t,sub,dark){
  n++; s.background={color:dark?NAVY:WHITE};
  s.addText(t,{x:.6,y:.3,w:12.1,h:.8,fontFace:F,bold:true,fontSize:33,color:dark?WHITE:NAVY,margin:0});
  if(sub)s.addText(sub,{x:.62,y:1.12,w:12.1,h:.4,fontFace:F,fontSize:16,color:dark?'C9D6DA':GREY,margin:0});
  s.addText(String(n),{x:12.4,y:6.9,w:.5,h:.3,fontFace:F,fontSize:11,color:dark?'7E969E':'A8B4B8',align:'right',margin:0});
}
function note(s,x,y,w,h,t,bg,fg,sz){
  s.addShape(P.ShapeType.roundRect,{x,y,w,h,fill:{color:bg},rectRadius:.1});
  s.addText(t,{x:x+.25,y:y+.18,w:w-.5,h:h-.36,fontFace:F,bold:true,fontSize:sz||15,color:fg,margin:0,lineSpacing:22});
}
function steps(s,arr,x,y,w,col,sz){
  let yy=y;
  arr.forEach((t,i)=>{
    s.addShape(P.ShapeType.ellipse,{x,y:yy,w:.5,h:.5,fill:{color:col||GREEN}});
    s.addText(String(i+1),{x,y:yy+.06,w:.5,h:.38,fontFace:F,bold:true,fontSize:16,color:WHITE,align:'center',margin:0});
    s.addText(t,{x:x+.72,y:yy+.05,w,h:.42,fontFace:F,fontSize:sz||17,color:INK,margin:0});
    yy+=.8;
  });
}

/* 1 表紙 */
{const s=P.addSlide(); s.background={color:NAVY};
 s.addText('検索で見つけてもらう\n記事の書き方',{x:1.0,y:2.0,w:11.3,h:1.6,fontFace:F,bold:true,fontSize:42,color:WHITE,margin:0,lineSpacing:58});
 s.addText('山口様へ　／　2026年8月',{x:1.05,y:3.85,w:11,h:.5,fontFace:F,fontSize:20,color:SUNL,margin:0});
 s.addShape(P.ShapeType.roundRect,{x:1.0,y:4.65,w:8.2,h:1.6,fill:{color:'32596B'},rectRadius:.12});
 s.addText('サイトの土台づくりは済んでいます。\nここから先は「どんな記事を書くか」で決まります。',
  {x:1.3,y:5.0,w:7.7,h:1.0,fontFace:F,fontSize:17,color:'DCE7EA',margin:0,lineSpacing:28});}

/* 2 前提 */
{const s=P.addSlide(); head(s,'はじめに ── 順位は買えません','「これをやれば1位」という設定はありません');
 s.addShape(P.ShapeType.roundRect,{x:.7,y:1.9,w:5.9,h:2.5,fill:{color:'F2F5F6'},rectRadius:.14});
 s.addText('こちらで済ませたこと',{x:1.0,y:2.1,w:5.3,h:.4,fontFace:F,bold:true,fontSize:20,color:NAVY,margin:0});
 s.addText([{text:'検索エンジンへの伝え方の整備',options:{bullet:true,breakLine:true}},
            {text:'お店の情報を機械が読める形に',options:{bullet:true,breakLine:true}},
            {text:'各ページの紹介文の自動生成',options:{bullet:true}}],
  {x:1.0,y:2.65,w:5.3,h:1.5,fontFace:F,fontSize:15,color:INK,paraSpaceAfter:9,margin:0});
 s.addShape(P.ShapeType.roundRect,{x:6.9,y:1.9,w:5.9,h:2.5,fill:{color:'EDF6EE'},rectRadius:.14});
 s.addText('山口様にお願いすること',{x:7.2,y:2.1,w:5.3,h:.4,fontFace:F,bold:true,fontSize:20,color:GREEN,margin:0});
 s.addText([{text:'お客様が困っていることを書く',options:{bullet:true,breakLine:true}},
            {text:'検索される言葉を題名に入れる',options:{bullet:true,breakLine:true}},
            {text:'月2本を続ける',options:{bullet:true}}],
  {x:7.2,y:2.65,w:5.3,h:1.5,fontFace:F,fontSize:15,color:INK,paraSpaceAfter:9,margin:0});
 note(s,.7,4.75,12.1,1.9,'検索順位はGoogleが決めるもので、こちらから指定はできません。\nできるのは「読み取りやすくすること」と「選ばれる理由をつくること」の2つだけです。\nそして後者は、山口様にしか書けません。','32596B',WHITE,17);}

/* 3 いちばん効く1つ */
{const s=P.addSlide(); head(s,'いちばん効くのは「題名」です','検索窓に打たれる言葉を、そのまま入れる');
 s.addShape(P.ShapeType.roundRect,{x:.7,y:1.95,w:12.1,h:1.5,fill:{color:'FFF4EA'},rectRadius:.12});
 s.addText('× 効きにくい題名',{x:1.05,y:2.15,w:11.4,h:.35,fontFace:F,bold:true,fontSize:17,color:RED,margin:0});
 s.addText('「体幹について」「今月のトレーニング」「ごあいさつ」',{x:1.05,y:2.6,w:11.4,h:.5,fontFace:F,fontSize:19,color:INK,margin:0});
 s.addShape(P.ShapeType.roundRect,{x:.7,y:3.65,w:12.1,h:1.9,fill:{color:'EDF6EE'},rectRadius:.12});
 s.addText('○ 効く題名',{x:1.05,y:3.85,w:11.4,h:.35,fontFace:F,bold:true,fontSize:17,color:GREEN,margin:0});
 s.addText('「パーキンソン病で立ち上がりがつらい方へ｜自宅でできる体幹の運動3つ」\n「すくみ足はなぜ起きる？きっかけと今日から試せる対策」',
  {x:1.05,y:4.3,w:11.4,h:1.0,fontFace:F,fontSize:19,color:INK,margin:0,lineSpacing:30});
 note(s,.7,5.8,12.1,.9,'ご自身が悩んでいたら、何と入力して調べるか。その言葉が答えです。','F2F5F6',NAVY,17);}

/* 4 題名の作り方 */
{const s=P.addSlide(); head(s,'題名の作り方','この3つを入れるだけです');
 // 2026-09-04 「脳卒中」を削除（パーキンソン病専門への表記統一に伴う）
 const rows=[['①','症状や悩みの言葉','パーキンソン病／すくみ足／立ち上がり／震え／姿勢の傾き'],
   ['②','だれ向けか','〜の方へ／〜でお困りの方／ご家族の方へ'],
   ['③','読むと何が分かるか','対策3つ／原因と対処／自宅でできる運動']];
 let y=2.0;
 rows.forEach(([num,t,d])=>{
   s.addShape(P.ShapeType.roundRect,{x:.7,y,w:12.1,h:1.25,fill:{color:'F6F7F8'},rectRadius:.12});
   s.addShape(P.ShapeType.ellipse,{x:1.0,y:y+.35,w:.55,h:.55,fill:{color:GREEN}});
   s.addText(num,{x:1.0,y:y+.42,w:.55,h:.4,fontFace:F,bold:true,fontSize:16,color:WHITE,align:'center',margin:0});
   s.addText(t,{x:1.85,y:y+.2,w:3.6,h:.4,fontFace:F,bold:true,fontSize:19,color:NAVY,margin:0});
   s.addText(d,{x:5.6,y:y+.25,w:6.9,h:.6,fontFace:F,fontSize:15,color:GREY,margin:0});
   y+=1.4;});
 note(s,.7,6.2,12.1,.85,'題名は「30字前後」が目安。長すぎると検索結果で途中から切れて表示されます。','FFF4EA',RED,16);}

/* 5 本文の書き方 */
{const s=P.addSlide(); head(s,'本文の書き方','むずかしいことはありません');
 steps(s,['最初の2〜3行で「この記事で分かること」を書く',
          '見出しを質問の形にする（なぜ起きるの？／どうすればいい？）',
          '1つの見出しに3〜5行。長い段落は分ける',
          '最後に「初回体験のご案内」を1行そえる'],.75,2.0,10.5,GREEN,18);
 note(s,.7,5.4,12.1,1.3,'2,000字くらいが目安ですが、字数より「知りたいことに答えているか」が大事です。\n短くても、悩みにまっすぐ答えている記事はよく読まれます。','EDF6EE',GREEN,16);}

/* 6 やってはいけない */
{const s=P.addSlide(); head(s,'やってはいけないこと','逆効果になります');
 const items=[['同じ言葉を不自然に繰り返す','「パーキンソン病 パーキンソン病 鹿児島 パーキンソン病」のような書き方は評価が下がります'],
   ['他のサイトの文章をコピーする','順位が下がるだけでなく、著作権の問題にもなります'],
   ['AIに書かせただけの記事を量産する','中身が薄いと逆効果です。山口様の現場の経験にしか価値はありません'],
   ['「1位保証」をうたう業者に頼む','保証は原理的に不可能です']];
 let y=1.95;
 items.forEach(([t,d])=>{
   s.addShape(P.ShapeType.roundRect,{x:.7,y,w:12.1,h:1.15,fill:{color:'FFF4EA'},rectRadius:.1});
   s.addShape(P.ShapeType.ellipse,{x:1.0,y:y+.3,w:.5,h:.5,fill:{color:RED}});
   s.addText('×',{x:1.0,y:y+.34,w:.5,h:.4,fontFace:F,bold:true,fontSize:19,color:WHITE,align:'center',margin:0});
   s.addText(t,{x:1.8,y:y+.15,w:10.6,h:.38,fontFace:F,bold:true,fontSize:18,color:NAVY,margin:0});
   s.addText(d,{x:1.8,y:y+.58,w:10.6,h:.45,fontFace:F,fontSize:14,color:GREY,margin:0});
   y+=1.28;});}

/* 7 記事を書いたら */
{const s=P.addSlide(); head(s,'記事を書いたら','公開時にこの3つだけ');
 steps(s,['カテゴリーを選ぶ（コラム／お知らせ）',
          'アイキャッチ画像を設定する',
          '公開してから、検索結果に出るか数日後に確認'],.75,2.0,10.5,GREEN,18);
 s.addShape(P.ShapeType.roundRect,{x:.7,y:4.6,w:12.1,h:1.9,fill:{color:'F2F5F6'},rectRadius:.12});
 s.addText('検索での見え方を確かめる',{x:1.05,y:4.8,w:11.4,h:.4,fontFace:F,bold:true,fontSize:19,color:NAVY,margin:0});
 s.addText('Googleで   site:aspath-life.com すくみ足   のように入力すると、\n自分のサイトの中だけを検索できます。出てこなければ、まだ登録されていません。',
  {x:1.05,y:5.3,w:11.4,h:1.0,fontFace:F,fontSize:16,color:INK,margin:0,lineSpacing:24});}

/* 8 効果の出方 */
{const s=P.addSlide(); head(s,'効果が出るまで','すぐには出ません。それが普通です');
 const rows=[['1〜2週間','Googleが記事を見つける。まだ順位は付きません'],
   ['1か月','検索結果に出はじめます'],
   ['3か月〜','記事が増えるほど、まとめて効いてきます']];
 let y=2.1;
 rows.forEach(([t,d])=>{
   s.addShape(P.ShapeType.roundRect,{x:.7,y,w:12.1,h:1.2,fill:{color:'F6F7F8'},rectRadius:.12});
   s.addText(t,{x:1.05,y:y+.35,w:2.8,h:.5,fontFace:F,bold:true,fontSize:22,color:SUN,margin:0});
   s.addText(d,{x:4.1,y:y+.4,w:8.4,h:.45,fontFace:F,fontSize:17,color:INK,margin:0});
   y+=1.35;});
 note(s,.7,6.1,12.1,1.0,'1本だけでは変わりません。月2本を半年続けると、はっきり違いが出ます。','EDF6EE',GREEN,17);}

/* 9 いちばん強いのは */
{const s=P.addSlide(); head(s,'いちばん強い記事は','コメントでいただいた質問です',true);
 s.addShape(P.ShapeType.roundRect,{x:.7,y:1.95,w:12.1,h:2.0,fill:{color:'32596B'},rectRadius:.14});
 s.addText('お客様が実際に困って書いてくださった質問は、\n同じことで困っている方が必ず他にもいます。',
  {x:1.1,y:2.35,w:11.3,h:1.2,fontFace:F,bold:true,fontSize:22,color:WHITE,margin:0,lineSpacing:34});
 s.addText('そのまま記事にできます',{x:.75,y:4.25,w:12,h:.4,fontFace:F,bold:true,fontSize:20,color:SUNL,margin:0});
 s.addText([{text:'コメント欄の質問 → そのまま題名にする',options:{bullet:true,breakLine:true}},
            {text:'初回体験でよく聞かれること → 記事にする',options:{bullet:true,breakLine:true}},
            {text:'LINEでいただいたご相談 → 記事にする（個人が分からない形で）',options:{bullet:true}}],
  {x:.75,y:4.8,w:12,h:1.5,fontFace:F,fontSize:17,color:WHITE,paraSpaceAfter:8,margin:0});}

/* 10 まとめ */
{const s=P.addSlide(); head(s,'まとめ','この3つだけ覚えてください');
 const rows=[['1','題名に、検索される言葉を入れる','「パーキンソン病 すくみ足 対策」のように、打ち込む言葉をそのまま'],
   ['2','お客様の悩みに、まっすぐ答える','字数より中身。現場で見ていることを書く'],
   ['3','月2本を続ける','まとめて10本より、続けるほうが効きます']];
 let y=2.0;
 rows.forEach(([num,t,d])=>{
   s.addShape(P.ShapeType.roundRect,{x:.7,y,w:12.1,h:1.4,fill:{color:'EDF6EE'},rectRadius:.12});
   s.addShape(P.ShapeType.ellipse,{x:1.05,y:y+.4,w:.6,h:.6,fill:{color:GREEN}});
   s.addText(num,{x:1.05,y:y+.46,w:.6,h:.45,fontFace:F,bold:true,fontSize:20,color:WHITE,align:'center',margin:0});
   s.addText(t,{x:1.95,y:y+.22,w:10.3,h:.45,fontFace:F,bold:true,fontSize:21,color:NAVY,margin:0});
   s.addText(d,{x:1.95,y:y+.75,w:10.3,h:.45,fontFace:F,fontSize:15,color:GREY,margin:0});
   y+=1.55;});
 note(s,.7,6.7,12.1,.6,'迷ったら「お客様は何と入力して調べるか」に立ち返ってください。','F2F5F6',NAVY,16);}

P.writeFile({fileName:'/tmp/deck4/検索で見つけてもらう記事の書き方.pptx'}).then(f=>console.log('作成:',f));
