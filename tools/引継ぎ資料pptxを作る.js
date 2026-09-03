const pptx = require('pptxgenjs');
const P = new pptx();
P.layout = 'LAYOUT_WIDE';           // 13.3 x 7.5
const W = 13.3, H = 7.5;

const NAVY='264653', SUN='DD8236', SUNL='F4A261', CREAM='F7EFE4',
      GREEN='2E7D32', GREY='5E7681', WHITE='FFFFFF', INK='1E2D34',
      SUND='C96A1E',   // 応用編タグ用（2026-09-04 追加）
      RED='B4453C', PURPLE='5B5391';   // 最応用編・AI活用編タグ用
const F='Meiryo';
const IMG='/sessions/compassionate-sweet-heisenberg/mnt/dev-aspath-life-main/_wp移行素材/★引継ぎ資料/画像/';

let n=0;
function head(s, t, sub, dark){
  n++;
  s.background = { color: dark ? NAVY : WHITE };
  s.addText(t, {x:0.6, y:0.35, w:11.4, h:0.75, fontFace:F, bold:true, fontSize:32,
                color: dark?WHITE:NAVY, margin:0});
  if(sub) s.addText(sub, {x:0.62, y:1.12, w:11.4, h:0.4, fontFace:F, fontSize:15,
                color: dark?'C9D6DA':GREY, margin:0});
  s.addText(String(n), {x:12.4, y:6.85, w:0.5, h:0.3, fontFace:F, fontSize:11,
                color: dark?'7E969E':'A8B4B8', align:'right', margin:0});
}
function pic(s,f,x,y,w){ s.addImage({path:IMG+f, x:x, y:y, w:w, h:w*764/1568}); }

/* 1 表紙 */
{ const s=P.addSlide(); s.background={color:NAVY};
  s.addText('ASPATH サイト更新マニュアル', {x:1.0,y:2.3,w:11.3,h:1.0,fontFace:F,bold:true,fontSize:44,color:WHITE,margin:0});
  s.addText('引継ぎ資料　／　2026年8月23日', {x:1.05,y:3.5,w:11,h:0.5,fontFace:F,fontSize:20,color:SUNL,margin:0});
  s.addShape(P.ShapeType.roundRect,{x:1.0,y:4.5,w:6.4,h:1.5,fill:{color:'32596B'},rectRadius:0.12});
  s.addText('この資料は「追記しながら育てる」前提で作っています。\n新しい作業を覚えたら、その日のうちに書き足してください。',
    {x:1.3,y:4.72,w:5.9,h:1.1,fontFace:F,fontSize:14,color:'DCE7EA',margin:0,lineSpacing:22});
  s.addNotes('まず全員が「0. 2つの道」を読む。そこで自分の作業がどちらか判断できる。');
}

/* 2 読み方 */
{ const s=P.addSlide(); head(s,'この資料の読み方','自分に関係する章だけ読めば済むようにしてあります');
  const rows=[['0','2つの道（どちらの作業か見分ける）','全員',NAVY],
              ['1','記事を書く','山口様',GREEN],
              ['2','コメントを承認する・返信する','山口様',GREEN],
              ['3','初回体験の申込を見る','山口様',GREEN],
              ['4','固定ページの文章・写真を変える','開発担当',SUN],
              ['5','テーマ・プラグインの入れ替え','開発担当',SUN],
              ['6','困ったとき','全員',NAVY],
              ['7','用語のかんたん辞書','全員',NAVY]];
  let y=1.85;
  rows.forEach(([num,t,who,col])=>{
    s.addShape(P.ShapeType.roundRect,{x:0.7,y:y,w:11.9,h:0.56,fill:{color:'F6F7F8'},rectRadius:0.08});
    s.addShape(P.ShapeType.ellipse,{x:0.85,y:y+0.09,w:0.38,h:0.38,fill:{color:col}});
    s.addText(num,{x:0.85,y:y+0.12,w:0.38,h:0.32,fontFace:F,bold:true,fontSize:13,color:WHITE,align:'center',margin:0});
    s.addText(t,{x:1.45,y:y+0.13,w:8.2,h:0.32,fontFace:F,fontSize:14,color:INK,margin:0});
    s.addText(who,{x:10.0,y:y+0.13,w:2.4,h:0.32,fontFace:F,bold:true,fontSize:13,color:col,align:'right',margin:0});
    y+=0.62;
  });
}

/* 2b 資料の全体像（2026-09-04 追加）
   資料が5冊に増え、内容が一部重なったため、どれを見ればよいかを最初に示す。 */
{ const s=P.addSlide(); head(s,'資料は8冊あります','困ったときに、どれを開けばよいか');
  const books=[
    ['基本編','ASPATH_サイト運用マニュアル_基本編','日々の更新。画面写真つき。まずこれ',SUN,'★'],
    ['応用編','ASPATH_サイト運用マニュアル_応用編','壊さない触り方と、検索対策',SUND,'★'],
    ['最応用編','ASPATH_サイト運用マニュアル_最応用編','公開後の点検と、直し方',RED,'★'],
    ['AI活用編','ASPATH_サイト運用マニュアル_AI活用編','そのまま使えるプロンプト8種',PURPLE,'★'],
    ['この資料','ASPATH_サイト更新マニュアル','全体像と、PC作業の手順。開発担当も見る',NAVY,''],
    ['やさしい版','山口様向け_ページの直し方','記事の書き方を、やさしく。連絡の文例つき',GREEN,''],
    ['固定ページ','山口様向け_ASPATHについて_文章の直し方','「ASPATHについて」だけの専用手順',GREY,''],
    ['検索対策','山口様向け_検索で見つけてもらう記事の書き方','記事の題名の付け方',GREY,''],
  ];
  let y=1.72;
  books.forEach(([tag,name,desc,col,mark])=>{
    s.addShape(P.ShapeType.roundRect,{x:0.7,y:y,w:12.1,h:0.62,fill:{color:'F6F7F8'},rectRadius:0.09});
    s.addShape(P.ShapeType.roundRect,{x:0.95,y:y+0.09,w:1.6,h:0.44,fill:{color:col},rectRadius:0.22});
    s.addText(tag,{x:0.95,y:y+0.09,w:1.6,h:0.44,fontFace:F,bold:true,fontSize:11.5,
                   color:WHITE,align:'center',valign:'middle',margin:0});
    s.addText(mark+name,{x:2.75,y:y+0.14,w:5.1,h:0.34,fontFace:F,bold:true,fontSize:12.5,color:NAVY,margin:0});
    s.addText(desc,{x:8.0,y:y+0.15,w:4.6,h:0.34,fontFace:F,fontSize:11,color:GREY,margin:0});
    y+=0.68;
  });
  s.addText('★の4冊が本編です。まず「基本編」。困ったときに応用編、月1回の点検に最応用編、記事づくりにAI活用編。',
    {x:0.7,y:7.02,w:12.1,h:0.35,fontFace:F,fontSize:11.5,color:GREY,margin:0});
  s.addNotes('8冊の役割分担。レクチャーでは基本編を使う。他は必要になったときに開く。');
}

/* 3 2つの道 */
{ const s=P.addSlide(); head(s,'更新には「2つの道」があります','どちらの道かを最初に見分けることが、いちばん大事です');
  s.addImage({path:IMG+'00_ふたつの道.png', x:0.85, y:1.75, w:11.6, h:11.6*800/1400});
  s.addNotes('固定ページの文章はテーマの中にある。だからWordPressの編集画面には出てこない。');
}

/* 4 なぜ分かれるのか */
{ const s=P.addSlide(); head(s,'なぜ2つに分かれるのか','固定ページの文章は「テーマ」の中にあります');
  s.addShape(P.ShapeType.roundRect,{x:0.7,y:1.9,w:5.8,h:2.5,fill:{color:'F6F7F8'},rectRadius:0.12});
  s.addText('一般的なWordPressサイト',{x:1.0,y:2.1,w:5.2,h:0.4,fontFace:F,bold:true,fontSize:18,color:GREY,margin:0});
  s.addText([{text:'文章は WordPress の中に保存',options:{bullet:true,breakLine:true}},
             {text:'誰でも管理画面から直せる',options:{bullet:true,breakLine:true}},
             {text:'そのかわりデザインが崩れやすい',options:{bullet:true}}],
            {x:1.0,y:2.65,w:5.2,h:1.5,fontFace:F,fontSize:14,color:INK,paraSpaceAfter:8,margin:0});
  s.addShape(P.ShapeType.roundRect,{x:6.8,y:1.9,w:5.8,h:2.5,fill:{color:'FFF4EA'},rectRadius:0.12});
  s.addText('このサイト',{x:7.1,y:2.1,w:5.2,h:0.4,fontFace:F,bold:true,fontSize:18,color:SUN,margin:0});
  s.addText([{text:'文章は テーマのファイル の中',options:{bullet:true,breakLine:true}},
             {text:'直すにはパソコン作業が必要',options:{bullet:true,breakLine:true}},
             {text:'そのかわりデザインが崩れない',options:{bullet:true}}],
            {x:7.1,y:2.65,w:5.2,h:1.5,fontFace:F,fontSize:14,color:INK,paraSpaceAfter:8,margin:0});
  s.addShape(P.ShapeType.roundRect,{x:0.7,y:4.75,w:11.9,h:1.5,fill:{color:NAVY},rectRadius:0.12});
  s.addText('見分け方',{x:1.05,y:4.95,w:3,h:0.4,fontFace:F,bold:true,fontSize:18,color:SUNL,margin:0});
  s.addText('WordPressの編集画面を開いて、その文章が出てくれば 道A。出てこなければ 道B です。',
            {x:1.05,y:5.42,w:11.2,h:0.6,fontFace:F,fontSize:17,color:WHITE,margin:0});
}

/* 5 記事を書く */
{ const s=P.addSlide(); head(s,'【道A】記事を書く（コラム・お知らせ）','投稿 → 投稿を追加');
  pic(s,'02_投稿を追加.jpg',0.7,1.85,7.4);
  const steps=['タイトルを入れる','本文を書く','カテゴリーを選ぶ（必須）','アイキャッチ画像を設定','右上の【公開】'];
  let y=1.95;
  steps.forEach((t,i)=>{
    s.addShape(P.ShapeType.ellipse,{x:8.5,y:y,w:0.42,h:0.42,fill:{color:GREEN}});
    s.addText(String(i+1),{x:8.5,y:y+0.04,w:0.42,h:0.34,fontFace:F,bold:true,fontSize:14,color:WHITE,align:'center',margin:0});
    s.addText(t,{x:9.1,y:y+0.05,w:3.6,h:0.35,fontFace:F,fontSize:15,color:INK,margin:0});
    y+=0.62;
  });
  s.addShape(P.ShapeType.roundRect,{x:8.45,y:5.2,w:4.2,h:1.55,fill:{color:'FFF4EA'},rectRadius:0.1});
  s.addText('カテゴリーのチェックを忘れると、\n一覧のどこにも出てきません。',
            {x:8.7,y:5.4,w:3.8,h:1.1,fontFace:F,bold:true,fontSize:13,color:'B85042',margin:0,lineSpacing:20});
}

/* 6 記事の注意 */
{ const s=P.addSlide(); head(s,'【道A】記事を書くときの注意','つまずきやすい3点');
  const items=[['カテゴリーは必ず選ぶ','「コラム」＝読みもの／「お知らせ」＝告知。\n未選択だと一覧に出ません。'],
               ['「コードを編集」と出ていたら','右上の「コードエディターを終了」を押してから書く。\nそのまま書くと表示が崩れます。'],
               ['大事なお知らせを一番上に','右側「ステータスと公開状態」→「先頭に固定表示」に\nチェック。TOPと一覧の先頭に出て「重要」が付きます。']];
  let y=1.95;
  items.forEach(([t,d],i)=>{
    s.addShape(P.ShapeType.roundRect,{x:0.7,y:y,w:11.9,h:1.5,fill:{color:'F6F7F8'},rectRadius:0.12});
    s.addShape(P.ShapeType.ellipse,{x:1.0,y:y+0.45,w:0.55,h:0.55,fill:{color:GREEN}});
    s.addText(String(i+1),{x:1.0,y:y+0.53,w:0.55,h:0.4,fontFace:F,bold:true,fontSize:17,color:WHITE,align:'center',margin:0});
    s.addText(t,{x:1.8,y:y+0.2,w:10.4,h:0.4,fontFace:F,bold:true,fontSize:18,color:NAVY,margin:0});
    s.addText(d,{x:1.8,y:y+0.68,w:10.4,h:0.7,fontFace:F,fontSize:14,color:GREY,margin:0,lineSpacing:20});
    y+=1.7;
  });
}

/* 7 コメント */
{ const s=P.addSlide(); head(s,'【道A】コメントを承認する・返信する','コメント');
  pic(s,'03_コメント.jpg',0.7,1.85,7.4);
  s.addText([{text:'「承認待ち」の数字をクリック',options:{bullet:true,breakLine:true}},
             {text:'内容を読む',options:{bullet:true,breakLine:true}},
             {text:'問題なければ【承認】',options:{bullet:true,breakLine:true}},
             {text:'宣伝目的なら【スパム】',options:{bullet:true,breakLine:true}},
             {text:'返信は【返信】から',options:{bullet:true}}],
            {x:8.5,y:1.95,w:4.1,h:2.2,fontFace:F,fontSize:15,color:INK,paraSpaceAfter:10,margin:0});
  s.addShape(P.ShapeType.roundRect,{x:8.45,y:4.3,w:4.2,h:1.35,fill:{color:'EDF6EE'},rectRadius:0.1});
  s.addText('山口様の返信は承認なしで\nすぐ公開されます。',{x:8.7,y:4.5,w:3.8,h:0.95,fontFace:F,bold:true,fontSize:14,color:GREEN,margin:0,lineSpacing:20});
  s.addShape(P.ShapeType.roundRect,{x:8.45,y:5.75,w:4.2,h:1.0,fill:{color:'FFF4EA'},rectRadius:0.1});
  s.addText('いただいた質問は、\n次の記事のネタになります。',{x:8.7,y:5.9,w:3.8,h:0.8,fontFace:F,fontSize:13,color:'B85042',margin:0,lineSpacing:19});
}

/* 8 申込 */
{ const s=P.addSlide(); head(s,'【道A】初回体験の申込を見る','初回体験の申込');
  pic(s,'04_初回体験の申込.jpg',0.7,1.85,7.4);
  s.addText('申込があると同時に2つ起こります',{x:8.5,y:1.9,w:4.2,h:0.4,fontFace:F,bold:true,fontSize:16,color:NAVY,margin:0});
  s.addShape(P.ShapeType.roundRect,{x:8.45,y:2.45,w:4.2,h:0.95,fill:{color:'F6F7F8'},rectRadius:0.1});
  s.addText('① aspathlife@gmail.com に\n　 通知メールが届く',{x:8.7,y:2.6,w:3.9,h:0.75,fontFace:F,fontSize:14,color:INK,margin:0,lineSpacing:20});
  s.addShape(P.ShapeType.roundRect,{x:8.45,y:3.5,w:4.2,h:0.95,fill:{color:'F6F7F8'},rectRadius:0.1});
  s.addText('② この画面に記録が残る',{x:8.7,y:3.8,w:3.9,h:0.4,fontFace:F,fontSize:14,color:INK,margin:0});
  s.addShape(P.ShapeType.roundRect,{x:8.45,y:4.6,w:4.2,h:1.3,fill:{color:'EDF6EE'},rectRadius:0.1});
  s.addText('メールが届かなくても\n記録は残ります。\n見落としても大丈夫です。',{x:8.7,y:4.75,w:3.9,h:1.1,fontFace:F,bold:true,fontSize:14,color:GREEN,margin:0,lineSpacing:20});
  s.addText('返信は通知メールにそのまま返信すれば届きます。',{x:8.5,y:6.05,w:4.2,h:0.6,fontFace:F,fontSize:13,color:GREY,margin:0,lineSpacing:19});
}

/* 9 道B 流れ */
{ const s=P.addSlide(); head(s,'【道B】固定ページを直すときの流れ','「ASPATHについて」を例に');
  s.addImage({path:IMG+'07_固定ページの流れ.png', x:0.85, y:1.8, w:11.6, h:11.6*700/1400});
}

/* 10 対応表 */
{ const s=P.addSlide(); head(s,'【道B】どのファイルを直すか','この表がいちばん大事です');
  const rows=[['TOP','/','index.html'],['ASPATHについて','/about/','about.html'],
              ['プランと料金','/services/','price.html'],['対面トレーニング','/taimentraining/','taimentraining.html'],
              ['オンライン','/onlineaspath/','onlineaspath.html'],['よくある質問','/faq/','faq.html'],
              ['アクセス','/access/','access.html'],['お問い合わせ','/contact/','contact.html'],
              ['プライバシーポリシー','/privacy/','privacy.html'],['特定商取引法','/tokushoho/','tokushoho.html'],
              ['サイトマップ','/sitemap/','sitemap.html'],
              ['初回体験フォーム','/taiken-2026as9y/','trial-entry.html']];
  s.addTable([[{text:'サイトのページ',options:{bold:true}},{text:'URL',options:{bold:true}},{text:'開くファイル',options:{bold:true}}]].concat(
      rows.map(r=>[r[0],{text:r[1],options:{fontFace:'Consolas'}},{text:r[2],options:{bold:r[0]==='ASPATHについて'}}])),
    {x:0.7,y:1.85,w:11.9,colW:[4.3,3.6,4.0],fontFace:F,fontSize:13,color:INK,
     border:{type:'solid',color:'E2E6E8',pt:1},fill:{color:WHITE},
     rowH:0.36, valign:'middle'});
}

/* 11 手順詳細 */
{ const s=P.addSlide(); head(s,'【道B】例：「ASPATHについて」を直す','文章の探し方まで');
  const st=[['①','GitHub Desktop で Pull origin','先に他の人の変更を取り込む。飛ばすと衝突します。'],
            ['②','about.html を開く','メモ帳でも可。VS Code が扱いやすいです。'],
            ['③','Ctrl+F で文章の一部を検索','例：「一番初めに動かしにくさ」（10〜15文字で探す）'],
            ['④','タグの間の文字だけ書き換える','< と > の記号は消さない。心配ならコピーを残す。'],
            ['⑤','保存 →「テーマを作る.ps1」を実行','右クリック →「PowerShell で実行」'],
            ['⑥','WordPressにアップロード → Push origin','次のページへ']];
  let y=1.9;
  st.forEach(([num,t,d])=>{
    s.addText(num,{x:0.75,y:y,w:0.5,h:0.4,fontFace:F,bold:true,fontSize:20,color:SUN,margin:0});
    s.addText(t,{x:1.35,y:y+0.02,w:11.0,h:0.36,fontFace:F,bold:true,fontSize:16,color:NAVY,margin:0});
    s.addText(d,{x:1.35,y:y+0.4,w:11.0,h:0.34,fontFace:F,fontSize:13,color:GREY,margin:0});
    y+=0.82;
  });
  s.addShape(P.ShapeType.roundRect,{x:0.7,y:6.85,w:0,h:0,fill:{color:WHITE}});
}

/* 11b 検索のコツ */
{ const s=P.addSlide(); head(s,'【道B】文章が見つからないとき','丸ごとコピーして検索しても出てこないことがあります');
  s.addShape(P.ShapeType.roundRect,{x:0.7,y:1.9,w:11.9,h:1.9,fill:{color:'F6F7F8'},rectRadius:0.12});
  s.addText('ファイルの中では、こう書かれています',{x:1.0,y:2.1,w:11.3,h:0.35,fontFace:F,bold:true,fontSize:15,color:GREY,margin:0});
  s.addText('<p class="tr-p"><span class="nw">パーキンソン病</span>において、多くの方が一番初めに動かしにくさを感じるのが……</p>',
            {x:1.0,y:2.55,w:11.3,h:1.0,fontFace:'Consolas',fontSize:14,color:INK,margin:0,lineSpacing:22});
  s.addShape(P.ShapeType.roundRect,{x:0.7,y:4.0,w:5.8,h:2.4,fill:{color:'FFF4EA'},rectRadius:0.12});
  s.addText('なぜ見つからないのか',{x:1.0,y:4.2,w:5.2,h:0.35,fontFace:F,bold:true,fontSize:17,color:'B85042',margin:0});
  s.addText('途中に <span class="nw">…</span> が\n挟まっているためです。\n\n「パーキンソン病」のような語が\n変な位置で改行されないための印。\n消してはいけません。',
            {x:1.0,y:4.65,w:5.3,h:1.6,fontFace:F,fontSize:13,color:INK,margin:0,lineSpacing:19});
  s.addShape(P.ShapeType.roundRect,{x:6.8,y:4.0,w:5.8,h:2.4,fill:{color:'EDF6EE'},rectRadius:0.12});
  s.addText('探すコツ',{x:7.1,y:4.2,w:5.2,h:0.35,fontFace:F,bold:true,fontSize:17,color:GREEN,margin:0});
  s.addText('10〜15文字くらいの、\n記号を含まない部分で検索する。\n\n○ 一番初めに動かしにくさ\n× パーキンソン病において、多くの方が',
            {x:7.1,y:4.65,w:5.3,h:1.6,fontFace:F,fontSize:13,color:INK,margin:0,lineSpacing:19});
}

/* 12 テーマ更新 */
{ const s=P.addSlide(); head(s,'【道B】テーマをアップロードする','外観 → テーマ → 新規追加 → テーマのアップロード');
  pic(s,'05_テーマのアップロード.jpg',0.7,1.85,7.4);
  s.addText('aspath-theme.zip を選び\n「既存のものを置き換える」',{x:8.5,y:1.95,w:4.2,h:0.8,fontFace:F,bold:true,fontSize:16,color:NAVY,margin:0,lineSpacing:24});
  s.addShape(P.ShapeType.roundRect,{x:8.45,y:2.95,w:4.2,h:1.3,fill:{color:'FFF4EA'},rectRadius:0.1});
  s.addText('「テーマを有効化」は\n最初の1回だけです。',{x:8.7,y:3.25,w:3.9,h:0.8,fontFace:F,bold:true,fontSize:14,color:'B85042',margin:0,lineSpacing:20});
  s.addShape(P.ShapeType.roundRect,{x:8.45,y:4.4,w:4.2,h:1.6,fill:{color:'FFF4EA'},rectRadius:0.1});
  s.addText('aspath-trial-form.zip を\nここに入れないでください。\n「style.css がありません」\nと出ます。あれはプラグイン。',
            {x:8.7,y:4.6,w:3.9,h:1.3,fontFace:F,fontSize:13,color:'B85042',margin:0,lineSpacing:19});
  s.addText('フォームを直したときは\nプラグインも入れ替えます。',{x:8.5,y:6.15,w:4.2,h:0.6,fontFace:F,fontSize:13,color:GREY,margin:0,lineSpacing:19});
}

/* 13 キャッシュ */
{ const s=P.addSlide(); head(s,'【道B】最後に必ずキャッシュを消す','これを忘れると「直したのに変わらない」になります');
  pic(s,'06_キャッシュ削除.jpg',0.7,1.85,7.4);
  s.addText([{text:'Super Page Cache を開く',options:{bullet:true,breakLine:true}},
             {text:'【Purge Cache】を押す',options:{bullet:true,breakLine:true}},
             {text:'ブラウザで Ctrl + F5',options:{bullet:true}}],
            {x:8.5,y:1.95,w:4.1,h:1.4,fontFace:F,fontSize:16,color:INK,paraSpaceAfter:12,margin:0});
  s.addShape(P.ShapeType.roundRect,{x:8.45,y:3.6,w:4.2,h:2.0,fill:{color:NAVY},rectRadius:0.1});
  s.addText('それでも変わらないとき',{x:8.7,y:3.8,w:3.9,h:0.35,fontFace:F,bold:true,fontSize:15,color:SUNL,margin:0});
  s.addText('URLの末尾に ?v=2 を付けて\n開いてください。\nキャッシュを確実に飛ばせます。',
            {x:8.7,y:4.25,w:3.9,h:1.2,fontFace:F,fontSize:14,color:WHITE,margin:0,lineSpacing:21});
}

/* 14 困ったとき */
{ const s=P.addSlide(); head(s,'困ったとき','症状から原因を引けます');
  const rows=[['直したのに変わらない','キャッシュ','Purge Cache ＋ Ctrl+F5。URLに ?v=2'],
              ['記事が一覧に出ない','カテゴリー未選択','投稿を編集してチェックを入れる'],
              ['サイトが真っ白','テーマとプラグインの不整合','外観 → テーマ → 旧テーマに戻す'],
              ['style.css がありません','プラグインZIPをテーマに入れた','ファイルを確認して入れ直す'],
              ['管理画面が開けない','プラグインの不具合','FTPでプラグインのフォルダ名を変える'],
              ['PowerShellが動かない','実行ポリシー','-ExecutionPolicy Bypass を付ける'],
              ['変更が競合しています','Pull を忘れた','Pull origin してやり直す']];
  s.addTable([[{text:'症状',options:{bold:true}},{text:'原因',options:{bold:true}},{text:'対処',options:{bold:true}}]].concat(rows),
    {x:0.7,y:1.85,w:11.9,colW:[3.5,3.4,5.0],fontFace:F,fontSize:13,color:INK,
     border:{type:'solid',color:'E2E6E8',pt:1},fill:{color:WHITE},rowH:0.45,valign:'middle'});
  s.addShape(P.ShapeType.roundRect,{x:0.7,y:5.55,w:11.9,h:1.1,fill:{color:'EDF6EE'},rectRadius:0.1});
  s.addText('テーマを戻せば見た目は即座に復帰します。大きな変更の前に All-in-One WP Migration でバックアップを。',
            {x:1.0,y:5.85,w:11.3,h:0.5,fontFace:F,bold:true,fontSize:15,color:GREEN,margin:0});
}

/* 15 育て方 */
{ const s=P.addSlide(); head(s,'この資料の育て方','新しい作業を覚えたら、その日のうちに書き足す',true);
  s.addShape(P.ShapeType.roundRect,{x:0.7,y:1.9,w:5.8,h:2.3,fill:{color:'32596B'},rectRadius:0.12});
  s.addText('書くときのコツ',{x:1.0,y:2.1,w:5.2,h:0.4,fontFace:F,bold:true,fontSize:18,color:SUNL,margin:0});
  s.addText([{text:'どの画面かをURLで書く',options:{bullet:true,breakLine:true}},
             {text:'画面写真を1枚入れる',options:{bullet:true,breakLine:true}},
             {text:'つまずいた点を残す ← 最重要',options:{bullet:true}}],
            {x:1.0,y:2.65,w:5.2,h:1.4,fontFace:F,fontSize:15,color:'DCE7EA',paraSpaceAfter:10,margin:0});
  s.addShape(P.ShapeType.roundRect,{x:6.8,y:1.9,w:5.8,h:2.3,fill:{color:'32596B'},rectRadius:0.12});
  s.addText('置き場所',{x:7.1,y:2.1,w:5.2,h:0.4,fontFace:F,bold:true,fontSize:18,color:SUNL,margin:0});
  s.addText('_wp移行素材／★引継ぎ資料／\n　★サイト更新マニュアル.md\n　画像／',
            {x:7.1,y:2.65,w:5.2,h:1.4,fontFace:F,fontSize:14,color:'DCE7EA',margin:0,lineSpacing:24});
  s.addText('まだ書けていないこと（今後の追記予定）',{x:0.75,y:4.5,w:11.8,h:0.4,fontFace:F,bold:true,fontSize:18,color:SUNL,margin:0});
  s.addText([{text:'メニュー項目の増やし方・並べ替え',options:{bullet:true,breakLine:true}},
             {text:'新しい固定ページを1枚まるごと足す手順',options:{bullet:true,breakLine:true}},
             {text:'LINE連携まわりの設定',options:{bullet:true,breakLine:true}},
             {text:'Search Console・Googleビジネスプロフィールの運用',options:{bullet:true,breakLine:true}},
             {text:'年に一度のこと（ドメイン更新・サーバー更新）',options:{bullet:true}}],
            {x:0.75,y:5.0,w:11.8,h:1.8,fontFace:F,fontSize:15,color:WHITE,paraSpaceAfter:6,margin:0});
}

P.writeFile({fileName:'/tmp/deck/ASPATH_サイト更新マニュアル.pptx'}).then(f=>console.log('作成:',f));
