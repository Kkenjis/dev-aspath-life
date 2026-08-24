const pptx=require('pptxgenjs'); const P=new pptx(); P.layout='LAYOUT_WIDE';
const NAVY='264653',SUN='DD8236',SUNL='F4A261',GREEN='2E7D32',GREY='5E7681',
      WHITE='FFFFFF',INK='1E2D34',RED='B85042';
const F='Meiryo';
const IMG='/sessions/compassionate-sweet-heisenberg/mnt/dev-aspath-life-main/_wp移行素材/★引継ぎ資料/画像/';
let n=0;
function head(s,t,sub,dark){
  n++; s.background={color:dark?NAVY:WHITE};
  s.addText(t,{x:0.6,y:0.3,w:12.1,h:0.8,fontFace:F,bold:true,fontSize:34,color:dark?WHITE:NAVY,margin:0});
  if(sub)s.addText(sub,{x:0.62,y:1.12,w:12.1,h:0.4,fontFace:F,fontSize:16,color:dark?'C9D6DA':GREY,margin:0});
  s.addText(String(n),{x:12.4,y:6.9,w:.5,h:.3,fontFace:F,fontSize:11,color:dark?'7E969E':'A8B4B8',align:'right',margin:0});
}
const pic=(s,f,x,y,w,r)=>s.addImage({path:IMG+f,x,y,w,h:w*(r||784/1519)});
function note(s,x,y,w,h,t,bg,fg,sz){
  s.addShape(P.ShapeType.roundRect,{x,y,w,h,fill:{color:bg},rectRadius:.1});
  s.addText(t,{x:x+.25,y:y+.18,w:w-.5,h:h-.36,fontFace:F,bold:true,fontSize:sz||14,color:fg,margin:0,lineSpacing:21});
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

/* 1 */
{const s=P.addSlide(); s.background={color:NAVY};
 s.addText('「ASPATHについて」ページの\n文章の直し方',{x:1.0,y:2.0,w:11.3,h:1.6,fontFace:F,bold:true,fontSize:40,color:WHITE,margin:0,lineSpacing:56});
 s.addText('山口様へ　／　2026年8月',{x:1.05,y:3.8,w:11,h:.5,fontFace:F,fontSize:20,color:SUNL,margin:0});
 s.addShape(P.ShapeType.roundRect,{x:1.0,y:4.6,w:7.6,h:1.6,fill:{color:'32596B'},rectRadius:.12});
 s.addText('このページの文章と写真は、\n山口様ご自身で直せるようになりました。',
  {x:1.3,y:4.95,w:7.1,h:1.0,fontFace:F,fontSize:17,color:'DCE7EA',margin:0,lineSpacing:28});}

/* 2 できること */
{const s=P.addSlide(); head(s,'できること・できないこと','まずここだけ押さえてください');
 s.addShape(P.ShapeType.roundRect,{x:.7,y:1.9,w:5.9,h:2.9,fill:{color:'EDF6EE'},rectRadius:.14});
 s.addShape(P.ShapeType.roundRect,{x:.7,y:1.9,w:5.9,h:.8,fill:{color:GREEN},rectRadius:.14});
 s.addShape(P.ShapeType.rect,{x:.7,y:2.4,w:5.9,h:.3,fill:{color:GREEN}});
 s.addText('ご自身で直せる',{x:1.0,y:2.05,w:5.3,h:.5,fontFace:F,bold:true,fontSize:24,color:WHITE,margin:0});
 s.addText([{text:'文章　46か所',options:{bullet:true,breakLine:true}},
            {text:'見出し　6か所',options:{bullet:true,breakLine:true}},
            {text:'写真の差し替え',options:{bullet:true}}],
  {x:1.05,y:2.95,w:5.2,h:1.6,fontFace:F,fontSize:18,color:INK,paraSpaceAfter:10,margin:0});
 s.addShape(P.ShapeType.roundRect,{x:6.9,y:1.9,w:5.9,h:2.9,fill:{color:'FFF4EA'},rectRadius:.14});
 s.addShape(P.ShapeType.roundRect,{x:6.9,y:1.9,w:5.9,h:.8,fill:{color:SUN},rectRadius:.14});
 s.addShape(P.ShapeType.rect,{x:6.9,y:2.4,w:5.9,h:.3,fill:{color:SUN}});
 s.addText('ご連絡ください',{x:7.2,y:2.05,w:5.3,h:.5,fontFace:F,bold:true,fontSize:24,color:WHITE,margin:0});
 s.addText([{text:'A S P A T H の一覧',options:{bullet:true,breakLine:true}},
            {text:'特徴3つのカード',options:{bullet:true,breakLine:true}},
            {text:'図・大きな写真の帯',options:{bullet:true}}],
  {x:7.25,y:2.95,w:5.2,h:1.6,fontFace:F,fontSize:18,color:INK,paraSpaceAfter:10,margin:0});
 note(s,.7,5.1,12.1,1.5,'見た目は今までと1つも変わっていません。中の仕組みだけを入れ替えました。\n触ってしまっても、【更新】を押さなければ何も起きません。','F2F5F6',NAVY,17);}

/* 3 開く */
{const s=P.addSlide(); head(s,'① 編集画面を開く','固定ページ →「ASPATHについて」');
 s.addShape(P.ShapeType.roundRect,{x:.7,y:1.95,w:12.1,h:1.0,fill:{color:'F2F5F6'},rectRadius:.1});
 s.addText('https://aspath-life.com/wp-admin/',{x:1.05,y:2.2,w:11.5,h:.5,fontFace:'Consolas',fontSize:20,color:NAVY,margin:0});
 steps(s,['左メニューの「固定ページ」をクリック','一覧から「ASPATHについて」をクリック','編集画面が開きます'],.75,3.25,10.5,GREEN,18);
 note(s,.7,5.9,12.1,.9,'この画面をブックマークしておくと、次から一発で開けます。','EDF6EE',GREEN,16);}

/* 4 画面ぜんたい */
{const s=P.addSlide(); head(s,'② 画面の見かた','文章のかたまりが上から順に並んでいます');
 pic(s,'A1_編集画面ぜんたい.jpg',.7,1.85,8.6);
 s.addText('「ブロック」という\nかたまりの集まりです',{x:9.6,y:1.95,w:3.2,h:.9,fontFace:F,bold:true,fontSize:17,color:NAVY,margin:0,lineSpacing:26});
 s.addText([{text:'文字の上をクリックすると',options:{bullet:true,breakLine:true}},
            {text:'そのかたまりが選ばれて',options:{bullet:true,breakLine:true}},
            {text:'枠が付きます',options:{bullet:true}}],
  {x:9.6,y:3.0,w:3.2,h:1.4,fontFace:F,fontSize:15,color:INK,paraSpaceAfter:6,margin:0});
 note(s,9.55,4.7,3.3,1.9,'あとはWordや\nメールと同じように\n書き換えるだけです。','EDF6EE',GREEN,15);}

/* 5 文章を直す */
{const s=P.addSlide(); head(s,'③ 文章を直す','クリックして書き換えるだけです');
 pic(s,'A2_文章をえらぶ.jpg',.7,1.85,8.6);
 steps(s,['直したい文章をクリック','いつもどおり書き換える','右上の【保存】'],9.5,2.0,3.2,GREEN,16);
 note(s,9.45,4.7,3.35,1.9,'保存は自動ではありません。\n\n必ず【保存】を\n押してください。','FFF4EA',RED,15);}

/* 6 ツールバー */
{const s=P.addSlide(); head(s,'文字を太くする・改行する','文章を選ぶと上に出てくるボタン');
 pic(s,'A5_文字をかえるボタン.jpg',1.55,2.05,10.2,180/1340);
 s.addShape(P.ShapeType.roundRect,{x:.7,y:3.5,w:5.9,h:1.5,fill:{color:'F2F5F6'},rectRadius:.12});
 s.addText('太字にする',{x:1.0,y:3.7,w:5.3,h:.4,fontFace:F,bold:true,fontSize:19,color:NAVY,margin:0});
 s.addText('太くしたい文字をマウスでなぞって選び、\n上のメニューの  B  をクリック',{x:1.0,y:4.15,w:5.3,h:.8,fontFace:F,fontSize:15,color:INK,margin:0,lineSpacing:22});
 s.addShape(P.ShapeType.roundRect,{x:6.9,y:3.5,w:5.9,h:1.5,fill:{color:'F2F5F6'},rectRadius:.12});
 s.addText('改行する',{x:7.2,y:3.7,w:5.3,h:.4,fontFace:F,bold:true,fontSize:19,color:NAVY,margin:0});
 s.addText('段落を分ける（間があく）… Enter\n同じ段落の中で改行 … Shift ＋ Enter',{x:7.2,y:4.15,w:5.3,h:.8,fontFace:F,fontSize:15,color:INK,margin:0,lineSpacing:22});
 note(s,.7,5.3,12.1,1.3,'Wordから文章をコピーするときは Ctrl + Shift + V（書式なし貼り付け）。\nそのまま貼ると、余計な書式が入って表示が崩れることがあります。','FFF4EA',RED,16);}

/* 7 さわらない箱 */
{const s=P.addSlide(); head(s,'④ 触らない部分の見分けかた','クリックしても文字が編集できない箱があります');
 pic(s,'A3_さわらない箱.jpg',.7,1.85,8.6);
 s.addText('右上に',{x:9.5,y:1.95,w:3.3,h:.35,fontFace:F,fontSize:16,color:INK,margin:0});
 s.addShape(P.ShapeType.roundRect,{x:9.45,y:2.35,w:3.35,h:.7,fill:{color:'E7E9EC'},rectRadius:.08});
 s.addText('カスタム HTML',{x:9.45,y:2.5,w:3.35,h:.4,fontFace:F,bold:true,fontSize:17,color:NAVY,align:'center',margin:0});
 s.addText('と出たら、それは飾りの部分です。',{x:9.5,y:3.2,w:3.3,h:.7,fontFace:F,fontSize:15,color:INK,margin:0,lineSpacing:22});
 note(s,9.45,4.1,3.35,2.5,'デザインが崩れないよう\n固めてあります。\n\nここを直したいときは\nご連絡ください。','FFF4EA',RED,15);}

/* --- ページ全体の地図 --- */
{const s=P.addSlide(); head(s,'ページ全体の地図','緑＝ご自身で直せる　オレンジ＝ご連絡ください');
 const rows=[['ASPATHの由来','見出し1・文章3','A S P A T H の一覧'],
   ['ASPATHの特徴','見出し1・文章1','特徴3カード／帯／4つの理念'],
   ['01　3つの芯','見出し1・文章17','3つの芯の図'],
   ['02　人生を豊かに','見出し1・文章5','大きな写真'],
   ['03　第3の居場所','見出し1・文章6','大きな写真'],
   ['04　エビデンスと共同研究','見出し1・文章10','大きな写真2点'],
   ['締めくくり','文章4','—']];
 s.addTable([[{text:'場所',options:{bold:true}},{text:'直せるもの',options:{bold:true,color:GREEN}},{text:'触らないもの',options:{bold:true,color:SUN}}]].concat(rows),
  {x:.7,y:1.95,w:12.1,colW:[3.6,3.9,4.6],fontFace:F,fontSize:15,color:INK,
   border:{type:'solid',color:'E2E6E8',pt:1},fill:{color:WHITE},rowH:.6,valign:'middle'});
 note(s,.7,6.0,12.1,.85,'全部で 文章52か所が直せます。触らないのは飾りの9か所だけです。','EDF6EE',GREEN,17);}

/* --- 色分けマップ 1 --- */
{const s=P.addSlide(); head(s,'どこが直せるか（前半）','ASPATHの由来 ／ ASPATHの特徴');
 pic(s,'M1_由来と特徴.jpg',.9,1.8,3.1,784/480);
 pic(s,'M2_01_3つの芯.jpg',4.3,1.8,3.1,784/480);
 s.addText('ASPATHの由来・特徴',{x:.9,y:6.85,w:3.1,h:.3,fontFace:F,fontSize:13,color:GREY,align:'center',margin:0});
 s.addText('01　3つの芯',{x:4.3,y:6.85,w:3.1,h:.3,fontFace:F,fontSize:13,color:GREY,align:'center',margin:0});
 s.addShape(P.ShapeType.roundRect,{x:7.9,y:1.85,w:4.9,h:1.5,fill:{color:'EDF6EE'},rectRadius:.12});
 s.addText('緑のところ',{x:8.2,y:2.05,w:4.3,h:.35,fontFace:F,bold:true,fontSize:19,color:GREEN,margin:0});
 s.addText('見出しと文章。クリックして\nそのまま書き換えられます。',{x:8.2,y:2.5,w:4.3,h:.7,fontFace:F,fontSize:15,color:INK,margin:0,lineSpacing:22});
 s.addShape(P.ShapeType.roundRect,{x:7.9,y:3.5,w:4.9,h:1.5,fill:{color:'FFF4EA'},rectRadius:.12});
 s.addText('オレンジのところ',{x:8.2,y:3.7,w:4.3,h:.35,fontFace:F,bold:true,fontSize:19,color:SUN,margin:0});
 s.addText('図やカード。クリックすると\n「カスタム HTML」と出ます。',{x:8.2,y:4.15,w:4.3,h:.7,fontFace:F,fontSize:15,color:INK,margin:0,lineSpacing:22});
 note(s,7.9,5.2,4.9,1.5,'01「3つの芯」がいちばん\n文章が多い場所です。\n17か所を直せます。','F2F5F6',NAVY,15);}

/* --- 色分けマップ 2 --- */
{const s=P.addSlide(); head(s,'どこが直せるか（後半）','02〜04 ／ 締めくくり');
 pic(s,'M3_02と03.jpg',.9,1.8,3.1,784/480);
 pic(s,'M4_04と締めくくり.jpg',4.3,1.8,3.1,784/480);
 s.addText('02 人生を豊かに ／ 03 第3の居場所',{x:.9,y:6.85,w:3.1,h:.3,fontFace:F,fontSize:12,color:GREY,align:'center',margin:0});
 s.addText('04 エビデンス ／ 締めくくり',{x:4.3,y:6.85,w:3.1,h:.3,fontFace:F,fontSize:12,color:GREY,align:'center',margin:0});
 s.addShape(P.ShapeType.roundRect,{x:7.9,y:1.85,w:4.9,h:2.3,fill:{color:'F2F5F6'},rectRadius:.12});
 s.addText('02・03・04 は同じ形',{x:8.2,y:2.05,w:4.3,h:.35,fontFace:F,bold:true,fontSize:19,color:NAVY,margin:0});
 s.addText('番号（02）\n→ 見出し\n→ 大きな写真（触らない）\n→ 文章がいくつか',
  {x:8.2,y:2.5,w:4.3,h:1.5,fontFace:F,fontSize:15,color:INK,margin:0,lineSpacing:24});
 note(s,7.9,4.35,4.9,1.3,'1か所の直し方が分かれば\n残りも同じ手順です。','EDF6EE',GREEN,15);
 note(s,7.9,5.85,4.9,.85,'締めくくりの4行も直せます。','F2F5F6',NAVY,15);}

/* --- 直せるが変えないほうがよいもの --- */
{const s=P.addSlide(); head(s,'直せますが、変えないほうがよいもの','クリックできてしまうので、ご注意ください');
 const items=[['「01」「02」などの番号','章の順番を表しています。文章を足しても番号は自動で増えません'],
   ['「① 身体の芯（体幹）を…」のラベル','①②③ の並びが崩れると読みにくくなります'],
   ['見出しの文字（青い大きな字）','変えるとページ内リンクがずれることがあります。変えたいときはご連絡ください']];
 let y=2.0;
 items.forEach(([t,d])=>{
   s.addShape(P.ShapeType.roundRect,{x:.7,y,w:12.1,h:1.4,fill:{color:'F2F5F6'},rectRadius:.12});
   s.addShape(P.ShapeType.ellipse,{x:1.0,y:y+.42,w:.56,h:.56,fill:{color:SUN}});
   s.addText('!',{x:1.0,y:y+.46,w:.56,h:.45,fontFace:F,bold:true,fontSize:20,color:WHITE,align:'center',margin:0});
   s.addText(t,{x:1.85,y:y+.2,w:10.5,h:.4,fontFace:F,bold:true,fontSize:19,color:NAVY,margin:0});
   s.addText(d,{x:1.85,y:y+.68,w:10.5,h:.5,fontFace:F,fontSize:15,color:GREY,margin:0});
   y+=1.55;});
 note(s,.7,6.15,12.1,.8,'本文（普通の大きさの文章）は、どこでも自由に直していただいて大丈夫です。','EDF6EE',GREEN,16);}

/* 8 写真 */
{const s=P.addSlide(); head(s,'⑤ 写真を差し替える','');
 steps(s,['写真をクリック','出てきたメニューの【置換】','「アップロード」で新しい写真を選ぶ','右上の【保存】'],.75,2.0,10.5,GREEN,19);
 note(s,.7,5.4,12.1,1.2,'写真は横1200ピクセルくらいがおすすめです。\nスマホで撮ったままでも表示はされますが、ページが重くなります。','F2F5F6',NAVY,16);}

/* 9 確認 */
{const s=P.addSlide(); head(s,'⑥ 保存する前に確認する','お客様に見える形で見られます');
 s.addShape(P.ShapeType.roundRect,{x:.7,y:1.95,w:12.1,h:1.3,fill:{color:'F2F5F6'},rectRadius:.12});
 s.addText('右上の【プレビュー】 →「新しいタブでプレビュー」',{x:1.05,y:2.35,w:11.5,h:.5,fontFace:F,bold:true,fontSize:22,color:NAVY,margin:0});
 s.addText('反映されないと感じたときは',{x:.75,y:3.5,w:12,h:.4,fontFace:F,bold:true,fontSize:20,color:NAVY,margin:0});
 steps(s,['5分ほど待って、もう一度ひらく','Ctrl を押しながら F5','URLの最後に ?v=2 を付けてひらく'],.75,4.0,10.5,SUN,17);
 note(s,.7,6.15,12.1,.75,'②③で新しくなっていれば、更新は成功しています。','EDF6EE',GREEN,16);}

/* 10 元に戻す */
{const s=P.addSlide(); head(s,'⑦ 間違えたときは','元に戻せなくなることはありません');
 const rows=[['書き換える前に戻したい（保存前）','左上の ↩ を何回か押す'],
   ['保存してしまった','右がわの「リビジョン」から前の状態に戻す'],
   ['表示が崩れた','何も操作せずご連絡ください'],
   ['画面が真っ白になった','同上。データは消えていません']];
 s.addTable([[{text:'こんなとき',options:{bold:true}},{text:'どうする',options:{bold:true}}]].concat(rows),
  {x:.7,y:1.95,w:8.4,colW:[4.0,4.4],fontFace:F,fontSize:15,color:INK,
   border:{type:'solid',color:'E2E6E8',pt:1},fill:{color:WHITE},rowH:.6,valign:'middle'});
 pic(s,'A4_右がわのパネル.jpg',9.5,1.95,1.6,960/444);
 note(s,.7,5.35,8.4,1.3,'過去の状態は「リビジョン」に全部残っています。\n何度でも戻せますので、安心して触ってください。','EDF6EE',GREEN,16);}

/* 11 やらないこと */
{const s=P.addSlide(); head(s,'やらないほうがよいこと','この3つだけ気をつけてください');
 const items=[['ブロックごと消す','飾りの箱を消すとデザインが崩れます。文字だけ書き換えてください'],
   ['Wordからそのまま貼り付ける','Ctrl + Shift + V（書式なし貼り付け）を使ってください'],
   ['見出しの大きさを変える','「見出し2」「見出し3」の設定は変えないでください']];
 let y=2.0;
 items.forEach(([t,d],i)=>{
   s.addShape(P.ShapeType.roundRect,{x:.7,y,w:12.1,h:1.4,fill:{color:'FFF4EA'},rectRadius:.12});
   s.addShape(P.ShapeType.ellipse,{x:1.0,y:y+.42,w:.56,h:.56,fill:{color:RED}});
   s.addText('×',{x:1.0,y:y+.46,w:.56,h:.45,fontFace:F,bold:true,fontSize:20,color:WHITE,align:'center',margin:0});
   s.addText(t,{x:1.85,y:y+.2,w:10.5,h:.4,fontFace:F,bold:true,fontSize:19,color:NAVY,margin:0});
   s.addText(d,{x:1.85,y:y+.68,w:10.5,h:.5,fontFace:F,fontSize:15,color:GREY,margin:0});
   y+=1.55;});}

/* 12 まとめ */
{const s=P.addSlide(); head(s,'まとめ','この3つだけ覚えてください',true);
 const rows=[['1','クリックして書き換える','文字の上をクリックすれば、そのまま直せます'],
   ['2','必ず【保存】を押す','押さなければ、何も変わりません'],
   ['3','困ったら写真を撮って送る','どこで止まっているか分かれば、ご案内できます']];
 let y=2.0;
 rows.forEach(([num,t,d])=>{
   s.addShape(P.ShapeType.roundRect,{x:.7,y,w:12.1,h:1.35,fill:{color:'32596B'},rectRadius:.12});
   s.addShape(P.ShapeType.ellipse,{x:1.05,y:y+.38,w:.6,h:.6,fill:{color:SUNL}});
   s.addText(num,{x:1.05,y:y+.44,w:.6,h:.45,fontFace:F,bold:true,fontSize:20,color:NAVY,align:'center',margin:0});
   s.addText(t,{x:1.95,y:y+.2,w:10.3,h:.45,fontFace:F,bold:true,fontSize:22,color:WHITE,margin:0});
   s.addText(d,{x:1.95,y:y+.72,w:10.3,h:.4,fontFace:F,fontSize:15,color:'C9D6DA',margin:0});
   y+=1.5;});
 s.addText('編集画面　https://aspath-life.com/wp-admin/post.php?post=298&action=edit',
  {x:.75,y:6.5,w:12,h:.4,fontFace:'Consolas',fontSize:14,color:'9FB4BA',margin:0});}

P.writeFile({fileName:'/tmp/deck3/ASPATHについて_文章の直し方.pptx'}).then(f=>console.log('作成:',f));
