const pptx = require('pptxgenjs');
const P = new pptx();
P.layout = 'LAYOUT_WIDE';
const NAVY='264653', SUN='DD8236', SUNL='F4A261', GREEN='2E7D32', GREY='5E7681',
      WHITE='FFFFFF', INK='1E2D34', RED='B85042';
const F='Meiryo';
const IMG='/sessions/compassionate-sweet-heisenberg/mnt/dev-aspath-life-main/_wp移行素材/★引継ぎ資料/画像/';
let n=0;
function head(s,t,sub,dark){
  n++; s.background={color:dark?NAVY:WHITE};
  s.addText(t,{x:0.6,y:0.32,w:12.1,h:0.8,fontFace:F,bold:true,fontSize:34,color:dark?WHITE:NAVY,margin:0});
  if(sub) s.addText(sub,{x:0.62,y:1.14,w:12.1,h:0.4,fontFace:F,fontSize:16,color:dark?'C9D6DA':GREY,margin:0});
  s.addText(String(n),{x:12.4,y:6.9,w:0.5,h:0.3,fontFace:F,fontSize:11,color:dark?'7E969E':'A8B4B8',align:'right',margin:0});
}
const pic=(s,f,x,y,w,r)=>s.addImage({path:IMG+f,x,y,w,h:w*(r||764/1568)});
function steps(s,arr,x,y,w,col){
  let yy=y;
  arr.forEach((t,i)=>{
    s.addShape(P.ShapeType.ellipse,{x:x,y:yy,w:0.46,h:0.46,fill:{color:col||GREEN}});
    s.addText(String(i+1),{x:x,y:yy+0.05,w:0.46,h:0.36,fontFace:F,bold:true,fontSize:15,color:WHITE,align:'center',margin:0});
    s.addText(t,{x:x+0.66,y:yy+0.04,w:w,h:0.4,fontFace:F,fontSize:16,color:INK,margin:0});
    yy+=0.72;
  });
}
function note(s,x,y,w,h,t,bg,fg){
  s.addShape(P.ShapeType.roundRect,{x,y,w,h,fill:{color:bg},rectRadius:0.1});
  s.addText(t,{x:x+0.25,y:y+0.2,w:w-0.5,h:h-0.4,fontFace:F,bold:true,fontSize:14,color:fg,margin:0,lineSpacing:21});
}

/* 1 表紙 */
{const s=P.addSlide(); s.background={color:NAVY};
 s.addText('ホームページの直し方',{x:1.0,y:2.2,w:11.3,h:1.0,fontFace:F,bold:true,fontSize:46,color:WHITE,margin:0});
 s.addText('山口様へ　／　2026年8月23日',{x:1.05,y:3.4,w:11,h:0.5,fontFace:F,fontSize:20,color:SUNL,margin:0});
 s.addShape(P.ShapeType.roundRect,{x:1.0,y:4.3,w:7.4,h:1.7,fill:{color:'32596B'},rectRadius:0.12});
 s.addText('操作を間違えても、元に戻せないことはほとんどありません。\n迷ったら、そのままご連絡ください。',
   {x:1.3,y:4.7,w:6.9,h:1.0,fontFace:F,fontSize:16,color:'DCE7EA',margin:0,lineSpacing:26});}

/* 2 2種類 */
{const s=P.addSlide(); head(s,'ページには2種類あります','はじめに、これだけ知っておいてください');
 s.addShape(P.ShapeType.roundRect,{x:0.7,y:1.9,w:5.9,h:3.5,fill:{color:'EDF6EE'},rectRadius:0.14});
 s.addShape(P.ShapeType.roundRect,{x:0.7,y:1.9,w:5.9,h:0.75,fill:{color:GREEN},rectRadius:0.14});
 s.addShape(P.ShapeType.rect,{x:0.7,y:2.4,w:5.9,h:0.25,fill:{color:GREEN}});
 s.addText('記事',{x:1.0,y:2.05,w:5.3,h:0.45,fontFace:F,bold:true,fontSize:24,color:WHITE,margin:0});
 s.addText('コラム・お知らせ',{x:1.0,y:2.85,w:5.3,h:0.4,fontFace:F,fontSize:17,color:GREY,margin:0});
 s.addText('山口様ご自身で\n直せます',{x:1.0,y:3.4,w:5.3,h:1.0,fontFace:F,bold:true,fontSize:26,color:GREEN,margin:0,lineSpacing:36});
 s.addText('この資料の 1〜4章',{x:1.0,y:4.7,w:5.3,h:0.4,fontFace:F,fontSize:15,color:GREY,margin:0});

 s.addShape(P.ShapeType.roundRect,{x:6.9,y:1.9,w:5.9,h:3.5,fill:{color:'FFF4EA'},rectRadius:0.14});
 s.addShape(P.ShapeType.roundRect,{x:6.9,y:1.9,w:5.9,h:0.75,fill:{color:SUN},rectRadius:0.14});
 s.addShape(P.ShapeType.rect,{x:6.9,y:2.4,w:5.9,h:0.25,fill:{color:SUN}});
 s.addText('固定ページ',{x:7.2,y:2.05,w:5.3,h:0.45,fontFace:F,bold:true,fontSize:24,color:WHITE,margin:0});
 s.addText('ASPATHについて／プランと料金／アクセス',{x:7.2,y:2.85,w:5.4,h:0.4,fontFace:F,fontSize:15,color:GREY,margin:0});
 s.addText('ご連絡ください\nこちらで直します',{x:7.2,y:3.4,w:5.3,h:1.0,fontFace:F,bold:true,fontSize:26,color:SUN,margin:0,lineSpacing:36});
 s.addText('この資料の 5章',{x:7.2,y:4.7,w:5.3,h:0.4,fontFace:F,fontSize:15,color:GREY,margin:0});
 note(s,0.7,5.7,12.1,1.0,'「ASPATHについて」は右側です。どこをどう直したいかをお知らせいただければ、10分ほどで反映できます。','F2F5F6',NAVY);}

/* 3 記事を書く */
{const s=P.addSlide(); head(s,'記事を新しく書く','投稿 → 投稿を追加');
 pic(s,'Y02_投稿を追加.jpg',0.7,1.85,7.5);
 steps(s,['タイトルを入れる','本文を書く','カテゴリーを選ぶ','アイキャッチ画像を選ぶ','右上の【公開】'],8.5,1.95,3.9);
 note(s,8.45,5.7,4.3,1.1,'カテゴリーを選び忘れると\n一覧に出てきません。','FFF4EA',RED);}

/* 4 カテゴリー */
{const s=P.addSlide(); head(s,'カテゴリーは必ず選んでください','ここだけ、いちばん間違えやすいところです');
 s.addShape(P.ShapeType.roundRect,{x:0.7,y:1.95,w:5.9,h:2.0,fill:{color:'EDF6EE'},rectRadius:0.14});
 s.addText('コラム',{x:1.05,y:2.2,w:5.2,h:0.5,fontFace:F,bold:true,fontSize:26,color:GREEN,margin:0});
 s.addText('読みもの\n（症状の話・自宅でできる運動 など）',{x:1.05,y:2.9,w:5.2,h:0.9,fontFace:F,fontSize:16,color:INK,margin:0,lineSpacing:24});
 s.addShape(P.ShapeType.roundRect,{x:6.9,y:1.95,w:5.9,h:2.0,fill:{color:'EDF6EE'},rectRadius:0.14});
 s.addText('お知らせ',{x:7.25,y:2.2,w:5.2,h:0.5,fontFace:F,bold:true,fontSize:26,color:GREEN,margin:0});
 s.addText('告知\n（キャンペーン・講演 など）',{x:7.25,y:2.9,w:5.2,h:0.9,fontFace:F,fontSize:16,color:INK,margin:0,lineSpacing:24});
 note(s,0.7,4.25,12.1,1.15,'どちらにもチェックが入っていないと、書けているのに一覧のどこにも出てきません。公開する前にもう一度ご確認ください。','FFF4EA',RED);
 s.addShape(P.ShapeType.roundRect,{x:0.7,y:5.6,w:12.1,h:1.1,fill:{color:NAVY},rectRadius:0.1});
 s.addText('大事なお知らせを一番上に　→　右側の「先頭に固定表示」にチェック（「重要」の印が付きます）',
   {x:1.0,y:5.9,w:11.5,h:0.5,fontFace:F,bold:true,fontSize:16,color:WHITE,margin:0});}

/* 5 記事を直す */
{const s=P.addSlide(); head(s,'書いた記事を後から直す','公開した記事も、何度でも直せます');
 pic(s,'Y01_投稿一覧.jpg',0.7,1.85,7.5);
 steps(s,['直したい記事の題名をクリック','文章を直す','右上の【更新】'],8.5,1.95,3.9);
 s.addText('題名の下にマウスを乗せると',{x:8.5,y:4.3,w:4.2,h:0.35,fontFace:F,bold:true,fontSize:15,color:NAVY,margin:0});
 s.addText([{text:'編集 … しっかり直す',options:{bullet:true,breakLine:true}},
            {text:'クイック編集 … 題名だけ',options:{bullet:true,breakLine:true}},
            {text:'表示 … 実際のページを見る',options:{bullet:true}}],
   {x:8.5,y:4.75,w:4.2,h:1.3,fontFace:F,fontSize:14,color:INK,paraSpaceAfter:8,margin:0});}

/* 6 正しい画面 */
{const s=P.addSlide(); head(s,'編集画面はこう見えていれば正常です','文章がそのまま読める状態が正しい画面です');
 pic(s,'Y03_記事を編集.jpg',1.6,1.9,10.1);
 note(s,1.6,6.0,10.1,0.75,'この形なら、そのまま書き換えて【更新】を押すだけです。','EDF6EE',GREEN);}

/* 7 コードエディター */
{const s=P.addSlide(); head(s,'記号だらけの画面になったら','押すだけで直ります。ご安心ください');
 pic(s,'Y04_コードエディターの注意.jpg',0.7,1.9,7.5);
 s.addText('右上の',{x:8.5,y:2.0,w:4.2,h:0.35,fontFace:F,fontSize:16,color:INK,margin:0});
 s.addShape(P.ShapeType.roundRect,{x:8.45,y:2.45,w:4.3,h:0.8,fill:{color:'2271B1'},rectRadius:0.1});
 s.addText('コードエディターを終了',{x:8.45,y:2.65,w:4.3,h:0.4,fontFace:F,bold:true,fontSize:17,color:WHITE,align:'center',margin:0});
 s.addText('を押してください。',{x:8.5,y:3.4,w:4.2,h:0.35,fontFace:F,fontSize:16,color:INK,margin:0});
 note(s,8.45,4.0,4.3,2.2,'このまま書くと\n表示が崩れます。\n\n押すだけで\n元に戻りますので、\nご安心ください。','FFF4EA',RED);}

/* 8 コメント */
{const s=P.addSlide(); head(s,'コメントに返信する','コメント');
 pic(s,'Y05_コメント.jpg',0.7,1.85,7.5);
 steps(s,['「承認待ち」をクリック','内容を読む','【承認】または【スパム】','【返信】でお返事'],8.5,1.95,3.9);
 note(s,8.45,4.95,4.3,1.0,'山口様の返信は\nすぐ公開されます。','EDF6EE',GREEN);
 note(s,8.45,6.05,4.3,0.75,'いま2件が承認待ちです。','FFF4EA',RED);}

/* 9 申込 */
{const s=P.addSlide(); head(s,'初回体験の申込を見る','初回体験の申込');
 pic(s,'Y06_申込.jpg',0.7,1.85,7.5);
 s.addText('申込が入ると同時に2つ起こります',{x:8.5,y:1.95,w:4.3,h:0.35,fontFace:F,bold:true,fontSize:16,color:NAVY,margin:0});
 note(s,8.45,2.45,4.3,1.0,'① aspathlife@gmail.com に\n　 通知メールが届く','F2F5F6',INK);
 note(s,8.45,3.55,4.3,0.8,'② この画面に記録が残る','F2F5F6',INK);
 note(s,8.45,4.5,4.3,1.35,'メールを見落としても\n記録は必ず残ります。','EDF6EE',GREEN);
 s.addText('お返事は、届いた通知メールに\nそのまま返信すれば届きます。',{x:8.5,y:6.0,w:4.3,h:0.7,fontFace:F,fontSize:14,color:GREY,margin:0,lineSpacing:20});}

/* 10 固定ページ なぜ */
{const s=P.addSlide(); head(s,'「ASPATHについて」を直したいとき','ご自身の画面からは直せない作りになっています');
 s.addShape(P.ShapeType.roundRect,{x:0.7,y:1.9,w:12.1,h:1.8,fill:{color:'F2F5F6'},rectRadius:0.14});
 s.addText('なぜか',{x:1.05,y:2.1,w:11.4,h:0.4,fontFace:F,bold:true,fontSize:19,color:NAVY,margin:0});
 s.addText('デザインが崩れないことを最優先に、文章の位置や大きさが決まった「型」として作られています。\nそのぶん編集画面には文章が出てきません。',
   {x:1.05,y:2.6,w:11.4,h:0.9,fontFace:F,fontSize:16,color:INK,margin:0,lineSpacing:26});
 s.addShape(P.ShapeType.roundRect,{x:0.7,y:3.95,w:12.1,h:1.5,fill:{color:'EDF6EE'},rectRadius:0.14});
 s.addText('直せないわけではありません',{x:1.05,y:4.15,w:11.4,h:0.4,fontFace:F,bold:true,fontSize:19,color:GREEN,margin:0});
 s.addText('ご連絡いただければ、こちらで直します。サイトは止まりませんし、10分ほどで反映されます。',
   {x:1.05,y:4.65,w:11.4,h:0.5,fontFace:F,fontSize:17,color:INK,margin:0});
 note(s,0.7,5.7,12.1,1.0,'次のページで「伝え方」をご説明します。この資料の番号でお知らせいただくだけで確実に伝わります。','FFF4EA',SUN);}

/* 11 番号 */
{const s=P.addSlide(); head(s,'番号でお知らせください','この資料の中で、見出しに番号を付けています');
 pic(s,'Y07_ページの番号.jpg',1.6,1.8,5.4,780/840);
 s.addShape(P.ShapeType.roundRect,{x:1.6,y:6.15,w:5.4,h:0.62,fill:{color:'FFF4EA'},rectRadius:0.08});
 s.addText('※ 番号はこの資料での呼び名です。実際のページには出ません',{x:1.75,y:6.3,w:5.1,h:0.35,fontFace:F,bold:true,fontSize:12,color:SUN,align:'center',margin:0});
 const rows=[['1','ASPATHの由来'],['2','ASPATHの特徴'],['2-1','症状に特化したトレーニング'],
   ['2-2','あなた専用の運動プランを提案'],['2-3','オンラインも対応！自宅からも'],
   ['2-4','根本から生まれ変わる「3つの芯」'],['2-5','人生をさらに豊かに彩るために'],
   ['2-6','医療・地域と連携／第3の居場所'],['2-7','エビデンスの活用と共同研究']];
 let y=1.95;
 rows.forEach(([a,b])=>{
   s.addShape(P.ShapeType.roundRect,{x:8.35,y:y,w:0.72,h:0.36,fill:{color:SUN},rectRadius:0.06});
   s.addText(a,{x:8.35,y:y+0.03,w:0.72,h:0.3,fontFace:F,bold:true,fontSize:12,color:WHITE,align:'center',margin:0});
   s.addText(b,{x:9.2,y:y+0.03,w:3.6,h:0.32,fontFace:F,fontSize:13,color:INK,margin:0});
   y+=0.5;});}

/* 12 文例 */
{const s=P.addSlide(); head(s,'そのまま使える連絡の文例','LINEやメールに、この形でお送りください');
 s.addShape(P.ShapeType.roundRect,{x:0.7,y:1.9,w:5.9,h:2.3,fill:{color:'F2F5F6'},rectRadius:0.12});
 s.addText('文章を直したいとき',{x:1.0,y:2.1,w:5.3,h:0.35,fontFace:F,bold:true,fontSize:17,color:NAVY,margin:0});
 s.addText('ASPATHについて のページ\n【場所】2-3 オンラインも対応！\n【いまの文章】家が遠くても、\n【こう変えたい】遠方の方も、',
   {x:1.0,y:2.6,w:5.3,h:1.5,fontFace:'Consolas',fontSize:13,color:INK,margin:0,lineSpacing:23});
 s.addShape(P.ShapeType.roundRect,{x:6.9,y:1.9,w:5.9,h:2.3,fill:{color:'F2F5F6'},rectRadius:0.12});
 s.addText('写真を差し替えたいとき',{x:7.2,y:2.1,w:5.3,h:0.35,fontFace:F,bold:true,fontSize:17,color:NAVY,margin:0});
 s.addText('ASPATHについて のページ\n【場所】2-1 症状に特化した\n　　　　トレーニング の写真\n【新しい写真】LINEに添付',
   {x:7.2,y:2.6,w:5.3,h:1.5,fontFace:'Consolas',fontSize:13,color:INK,margin:0,lineSpacing:23});
 s.addText('うまく伝えるコツ',{x:0.75,y:4.45,w:12,h:0.4,fontFace:F,bold:true,fontSize:19,color:NAVY,margin:0});
 s.addText([{text:'番号を書く … 「2-3の」だけで確実に伝わります',options:{bullet:true,breakLine:true}},
            {text:'いまの文章を10文字ほど写す … 番号がなくても場所が分かります',options:{bullet:true,breakLine:true}},
            {text:'画面写真を撮って送る … いちばん確実です。丸を付けていただければ完璧です',options:{bullet:true,breakLine:true}},
            {text:'完璧な文章でなくて構いません …「もう少し優しい言い方に」だけでも大丈夫です',options:{bullet:true}}],
   {x:0.75,y:4.95,w:12,h:1.7,fontFace:F,fontSize:15,color:INK,paraSpaceAfter:7,margin:0});}

/* 13 困ったとき */
{const s=P.addSlide(); head(s,'困ったとき','ほとんどのことは元に戻せます');
 const rows=[['直したのにサイトが変わらない','Ctrl を押しながら F5。それでも変わらなければご連絡ください'],
   ['記事が一覧に出てこない','カテゴリーのチェックが抜けています'],
   ['記号だらけの画面になった','右上の「コードエディターを終了」'],
   ['間違えて消してしまった','ゴミ箱に残っています。「投稿一覧」→「ゴミ箱」から戻せます'],
   ['画面が真っ白になった','何も操作せず、そのままご連絡ください']];
 s.addTable([[{text:'こんなとき',options:{bold:true}},{text:'どうする',options:{bold:true}}]].concat(rows),
  {x:0.7,y:1.9,w:12.1,colW:[4.6,7.5],fontFace:F,fontSize:15,color:INK,
   border:{type:'solid',color:'E2E6E8',pt:1},fill:{color:WHITE},rowH:0.62,valign:'middle'});
 note(s,0.7,5.5,12.1,1.15,'操作を間違えても、元に戻せないことはほとんどありません。迷ったら、そのままご連絡ください。','EDF6EE',GREEN);}

/* 14 ブックマーク */
{const s=P.addSlide(); head(s,'よく使う3つ','ブックマークをおすすめします',true);
 const rows=[['記事を書く','aspath-life.com/wp-admin/post-new.php'],
   ['コメントを見る','aspath-life.com/wp-admin/edit-comments.php'],
   ['初回体験の申込を見る','aspath-life.com/wp-admin/edit.php?post_type=aspath_trial']];
 let y=2.1;
 rows.forEach(([t,u])=>{
   s.addShape(P.ShapeType.roundRect,{x:0.7,y:y,w:12.1,h:1.25,fill:{color:'32596B'},rectRadius:0.12});
   s.addText(t,{x:1.05,y:y+0.15,w:11.4,h:0.4,fontFace:F,bold:true,fontSize:20,color:SUNL,margin:0});
   s.addText(u,{x:1.05,y:y+0.62,w:11.4,h:0.4,fontFace:'Consolas',fontSize:16,color:WHITE,margin:0});
   y+=1.45;});
 s.addText('ご不明な点は、いつでもお気軽にお知らせください。',{x:0.75,y:6.5,w:12,h:0.4,fontFace:F,fontSize:16,color:'C9D6DA',margin:0});}

P.writeFile({fileName:'/tmp/deck2/山口様向け_ページの直し方.pptx'}).then(f=>console.log('作成:',f));
