// ASPATH 総合版 ── 共通の部品（レイアウト・色・難易度表示）
// 各部のファイルから require して使う
const pptx = require("pptxgenjs");
const { brand } = require("./ブランドヘッダー.js");

const C = {
  NAVY:"264653", DEEP:"1E3A44", SUN:"F4A261", SUND:"DD8236",
  PAPER:"F4E9D8", WHITE:"FFFFFF", MUTED:"52707A", INK:"1E2D34",
  RED:"B4453C", GREEN:"2E7D32", PURPLE:"5B5391", CODEBG:"F2F5F6",
  LINE:"DCE6E8", PAPERLINE:"E2D5BE",
};
const F = "Meiryo", MONO = "Consolas";

// 難易度（山口様が「自分がやる話か」を一目で判断できるようにする）
const LV = {
  easy:   { label:"やさしい",     color:"2E7D32", bg:"EDF6EE" },
  step:   { label:"慣れたら",     color:"DD8236", bg:"FDF0E6" },
  together:{ label:"一緒にやる",  color:"B4453C", bg:"FBEDEC" },
  read:   { label:"読むだけ",     color:"5B5391", bg:"EFEEF6" },
};

function makeDeck(title){
  const P = new pptx();
  P.layout = "LAYOUT_WIDE";
  P.author = "ASPATH";
  P.title  = title;
  return P;
}

// 状態を持つビルダー（通し番号・部番号）
function Builder(P){
  this.P = P;
  this.page = 0;
  this.part = "";
  // PDFのしおり（目次）を後から付けるための記録。
  //   toc  : {level, title, page} の並び。level1＝部、level2＝各ページ
  //   links: 目次スライドに貼るクリック領域（inch単位。PDF化後にptへ換算する）
  this.toc = [];
  this.links = [];
}

Builder.prototype.head = function(s, t, sub, opt){
  const o = opt || {};
  this.page++;
  this.toc.push({ level: this.part ? 2 : 1, title: t, page: this.page });
  const P = this.P;
  s.background = { color: o.dark ? C.NAVY : C.WHITE };
  brand(s, !!o.dark);   // 右上のロゴと肩書き

  // 難易度バッジ（ブランド帯の下に置く）
  if (o.lv) {
    const v = LV[o.lv];
    s.addShape(P.ShapeType.roundRect,{x:10.45,y:0.58,w:2.17,h:0.42,rectRadius:0.21,
      fill:{color:v.bg},line:{color:v.color,width:1.2}});
    s.addText(v.label,{x:10.45,y:0.58,w:2.17,h:0.42,align:"center",valign:"middle",
      fontSize:11.5,bold:true,color:v.color,fontFace:F,isTextBox:true,margin:0});
  }
  s.addText(t,{x:0.6,y:0.3,w:o.lv?9.6:12.1,h:0.62,fontSize:o.small?24:27,bold:true,
    color:o.dark?C.WHITE:C.NAVY,fontFace:F,valign:"middle",isTextBox:true,margin:0});
  if (sub) s.addText(sub,{x:0.62,y:0.96,w:12.1,h:0.36,fontSize:13.5,
    color:o.dark?"C9D6DA":C.MUTED,fontFace:F,isTextBox:true,margin:0});
  // フッター：部名 と 通し番号
  if(this.part) s.addText(this.part,{x:0.6,y:7.20,w:6,h:0.24,fontSize:10,
    color:o.dark?"7E969E":"A8B4B8",fontFace:F,isTextBox:true,margin:0});
  s.addText(String(this.page),{x:12.45,y:7.20,w:0.45,h:0.24,align:"right",
    fontSize:10.5,color:o.dark?"7E969E":"A8B4B8",fontFace:F,isTextBox:true,margin:0});
};

// スライド下端の安全線。ここから下はフッター（部名・ページ番号）の場所。
const SAFE_BOTTOM = 7.16;

Builder.prototype.box = function(s,x,y,w,h,title,body,tone){
  const P=this.P;
  // フッターに重ならないよう、下端で止める。
  //   余裕があれば縮め、縮めると文字が入らない小さな枠は上へ逃がす。
  //   （各スライドで個別に高さを調整していたが、47枚で重なっていたため一括で担保する）
  const MIN_H = body ? 0.72 : 0.46;   // 本文がある枠は、2行入る高さを確保する
  if (y + h > SAFE_BOTTOM) {
    if (SAFE_BOTTOM - y >= MIN_H) h = SAFE_BOTTOM - y;
    else y = SAFE_BOTTOM - h;
  }
  const m={warn:{bg:"FDF0E6",bar:C.SUND,mk:"!"},ng:{bg:"FBEDEC",bar:C.RED,mk:"×"},
           ok:{bg:"EDF6EE",bar:C.GREEN,mk:"✓"},info:{bg:C.PAPER,bar:C.NAVY,mk:"i"}};
  const c=m[tone||"info"];
  s.addShape(P.ShapeType.roundRect,{x,y,w,h,rectRadius:0.12,fill:{color:c.bg},line:{color:c.bar,width:1.2}});
  // 枠が薄いときは、丸印が枠からはみ出さないよう上に寄せる
  const iy = y + Math.min(0.22, Math.max(0.06, (h - 0.34) / 2));
  s.addShape(P.ShapeType.ellipse,{x:x+0.24,y:iy,w:0.34,h:0.34,fill:{color:c.bar}});
  s.addText(c.mk,{x:x+0.24,y:iy,w:0.34,h:0.34,align:"center",valign:"middle",
    fontSize:14,bold:true,color:C.WHITE,fontFace:F,isTextBox:true,margin:0});
  s.addText([{text:title,options:{bold:true,color:C.NAVY,fontSize:13.5,breakLine:!!body}},
             {text:body||"",options:{color:C.INK,fontSize:11.5}}],
    {x:x+0.72,y:y+0.16,w:w-0.96,h:h-0.3,fontFace:F,isTextBox:true,margin:0,valign:"top",lineSpacingMultiple:1.15});
};

// コピペ用の枠
Builder.prototype.code = function(s,x,y,w,h,label,text,fs){
  const P=this.P;
  s.addShape(P.ShapeType.roundRect,{x,y,w,h,rectRadius:0.1,fill:{color:C.CODEBG},line:{color:"C9D5D9",width:1}});
  if(label){
    s.addShape(P.ShapeType.roundRect,{x:x+0.18,y:y-0.14,w:3.1,h:0.32,rectRadius:0.16,fill:{color:C.NAVY}});
    s.addText(label,{x:x+0.18,y:y-0.14,w:3.1,h:0.32,align:"center",valign:"middle",
      fontSize:10.5,bold:true,color:C.WHITE,fontFace:F,isTextBox:true,margin:0});
  }
  s.addText(text,{x:x+0.24,y:y+(label?0.26:0.16),w:w-0.48,h:h-(label?0.44:0.32),
    fontSize:fs||10.5,color:C.INK,fontFace:MONO,isTextBox:true,margin:0,valign:"top",lineSpacingMultiple:1.22});
};

// 番号つきの手順
Builder.prototype.steps = function(s,x,y,w,items,gap,fs){
  const P=this.P, g=gap||0.68, size=fs||13;
  items.forEach((it,i)=>{
    const yy=y+i*g;
    s.addShape(P.ShapeType.ellipse,{x,y:yy+0.02,w:0.34,h:0.34,fill:{color:C.NAVY}});
    s.addText(String(i+1),{x,y:yy+0.02,w:0.34,h:0.34,align:"center",valign:"middle",
      fontSize:12,bold:true,color:C.WHITE,fontFace:F,isTextBox:true,margin:0});
    s.addText([{text:it.t,options:{bold:true,color:C.NAVY,fontSize:size,breakLine:!!it.d}},
               {text:it.d||"",options:{color:C.MUTED,fontSize:size-2}}],
      {x:x+0.48,y:yy-0.05,w:w-0.48,h:g+0.1,fontFace:F,isTextBox:true,margin:0,valign:"top"});
  });
};

// 表形式の行（左：見出し／右：説明）
Builder.prototype.rows = function(s,x,y,w,items,rowH,leftW,fs){
  const P=this.P, h=rowH||0.6, lw=leftW||4.0, size=fs||12.5;
  let yy=y;
  items.forEach(([l,r],i)=>{
    s.addShape(P.ShapeType.roundRect,{x,y:yy,w,h:h-0.04,rectRadius:0.08,
      fill:{color:i%2?C.PAPER:"F7FAFA"},line:{color:C.LINE,width:1}});
    s.addText(l,{x:x+0.28,y:yy+0.04,w:lw,h:h-0.12,fontSize:size,bold:true,color:C.NAVY,
      fontFace:F,isTextBox:true,margin:0,valign:"middle"});
    s.addText(r,{x:x+lw+0.42,y:yy+0.04,w:w-lw-0.7,h:h-0.12,fontSize:size-1,color:C.INK,
      fontFace:F,isTextBox:true,margin:0,valign:"middle",lineSpacingMultiple:1.15});
    yy+=h;
  });
  return yy;
};

// 部の扉
Builder.prototype.partCover = function(s, num, title, lines, tone){
  const P=this.P;
  // 巻末は num が "巻" のように数字ではない。その場合「第◯部」とは書かない。
  const isNum = /^\d+$/.test(String(num));
  const label = isNum ? ("第" + num + "部") : title;
  this.page++;
  this.part = isNum ? (label + "　" + title) : title;
  this.toc.push({ level: 1, title: this.part, page: this.page, part: String(num) });
  s.background={color:C.NAVY};
  brand(s, true);
  s.addShape(P.ShapeType.roundRect,{x:1.0,y:2.0,w:1.15,h:1.15,rectRadius:0.575,fill:{color:tone||C.SUN}});
  s.addText(num,{x:1.0,y:2.0,w:1.15,h:1.15,align:"center",valign:"middle",
    fontSize:isNum?40:30,bold:true,color:C.WHITE,fontFace:F,isTextBox:true,margin:0});
  s.addText(label,{x:2.5,y:1.95,w:9.8,h:0.4,fontSize:15,bold:true,color:C.SUN,
    charSpacing:3,fontFace:F,isTextBox:true,margin:0});
  s.addText(title,{x:2.5,y:2.35,w:9.8,h:0.85,fontSize:33,bold:true,color:C.WHITE,
    fontFace:F,valign:"middle",isTextBox:true,margin:0});
  s.addText(lines.map((l,i)=>({text:l,options:{bullet:true,breakLine:i<lines.length-1}})),
    {x:2.55,y:3.5,w:9.6,h:2.4,fontSize:14,color:"CFE0E4",fontFace:F,isTextBox:true,margin:0,paraSpaceAfter:7});
  s.addText(String(this.page),{x:12.45,y:7.20,w:0.45,h:0.24,align:"right",
    fontSize:10.5,color:"7E969E",fontFace:F,isTextBox:true,margin:0});
};

module.exports = { pptx, C, F, MONO, LV, makeDeck, Builder };
