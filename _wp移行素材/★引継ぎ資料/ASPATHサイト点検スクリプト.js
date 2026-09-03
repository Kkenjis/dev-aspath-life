/* ============================================================
   ASPATH サイト点検スクリプト
   ------------------------------------------------------------
   使い方
     1. Chrome で https://aspath-life.com/ を開く
     2. F12 を押して「Console」タブを選ぶ
     3. このファイルの中身を全部コピーして貼り、Enter
     4. 1〜2分で結果が表になって出ます

   ※ WordPressにログインしたままでも動きます
      （未ログインのお客様と同じ条件で取得しています）
   ※ サイトには何も書き込みません。読み取るだけです

   作成：2026年9月4日
   ============================================================ */

(async () => {

/* ── 点検するページ ─────────────────────────────
   ページを増やしたら、ここに1行足してください */
const PAGES = [
  '/', '/about/', '/services/', '/access/', '/contact/', '/faq/',
  '/column/', '/tokushoho/', '/privacy/', '/sitemap/',
  '/campaign/', '/taimentraining/', '/onlineaspath/',
  '/sukumiashitaisaku/', '/taikannunndou/', '/shinsenaspath/',
  '/undouwooboeruparkinson/', '/aspathkouen/',
];

/* 意図的に検索対象から外しているページ（noindexが正しい） */
const NOINDEX_OK = ['/faq/'];

/* 下書きに戻したページ（404が正しい） */
const SHOULD_BE_404 = ['/for-stroke/'];

/* 旧URL → 転送先（転送されるのが正しい） */
const SHOULD_REDIRECT = ['/for-parkinsons-disease/', '/aspath　ロゴ完成/'];

/* サイトマップに載ってはいけないURLの目印 */
const NG_IN_SITEMAP = /for-stroke|for-parkinsons-disease|\/faq\/|\/tag\/|パーキンソン病の方へ/;

/* 使わなくなった言葉（本文に残っていないか確認） */
const OLD_WORDS = [/脳卒中専門/, /ASPATH・アスパス：/];

// ────────────────────────────────────────────
const NOW = () => '?nc=' + Date.now();
const GET = (u, opt) => fetch(encodeURI(u) + NOW(),
  Object.assign({ cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer' }, opt || {}));
const parse = (html) => new DOMParser().parseFromString(html, 'text/html');

const problems = [];
const say = { ok: (t, d) => console.log('%c○ ' + t, 'color:#2E7D32', d || ''),
              ng: (t, d) => { console.log('%c× ' + t, 'color:#B4453C;font-weight:bold', d || ''); problems.push(t + (d ? ' … ' + d : '')); },
              info: (t, d) => console.log('%c・ ' + t, 'color:#52707A', d || '') };

console.log('%c ASPATH サイト点検を開始します ', 'background:#264653;color:#fff;font-size:15px;padding:5px 10px');

/* ══════ 1. ページごとの点検 ══════ */
console.log('%c\n【1】ページごとの点検', 'font-weight:bold;font-size:13px');
const rows = [];
for (const u of PAGES) {
  let r, html;
  try { r = await GET(u); html = await r.text(); }
  catch (e) { rows.push({ URL: u, 判定: '× 取得できない' }); continue; }
  const d   = parse(html);
  const ttl = (d.querySelector('title') || {}).textContent || '';
  const mdE = d.querySelector('meta[name="description"]');
  const dsc = mdE ? mdE.content : '';
  const rob = (d.querySelector('meta[name="robots"]') || {}).content || '';
  const h1  = d.querySelectorAll('h1').length;
  const bad = [];

  if (r.status !== 200)                               bad.push('状態' + r.status);
  if (!ttl.length)                                    bad.push('題名なし');
  else if (ttl.length > 60)                           bad.push('題名' + ttl.length + '字（60字以内に）');
  if (dsc.length === 0)                               bad.push('説明文なし');
  else if (dsc.length < 60 || dsc.length > 160)       bad.push('説明' + dsc.length + '字（60〜160字に）');
  if (/noindex/.test(rob) && !NOINDEX_OK.includes(u)) bad.push('noindexになっている');
  if (!/noindex/.test(rob) && NOINDEX_OK.includes(u)) bad.push('noindexが外れている');
  if (!d.querySelector('link[rel=canonical]'))        bad.push('canonicalなし');
  if (h1 !== 1)                                       bad.push('H1が' + h1 + '個（1個に）');
  if (!d.querySelector('meta[property="og:image"]'))  bad.push('OGP画像なし');
  if (r.headers.get('x-robots-tag'))                  bad.push('X-Robots-Tagが付いている');
  OLD_WORDS.forEach(w => { if (w.test(ttl + dsc)) bad.push('古い言葉：' + String(w).replace(/\//g, '')); });

  rows.push({ URL: u, 題名: ttl.length, 説明文: dsc.length, H1: h1,
              判定: bad.length ? '× ' + bad.join(' / ') : '○' });
  if (bad.length) problems.push(u + ' … ' + bad.join(' / '));
}
console.table(rows);
console.log('  合格 ' + rows.filter(r => r.判定 === '○').length + ' / ' + rows.length + ' ページ');

/* ══════ 2. サイト全体の設定 ══════ */
console.log('%c\n【2】サイト全体の設定', 'font-weight:bold;font-size:13px');

const rt = await (await GET('/robots.txt')).text();
(/Disallow: \/wp-admin\//.test(rt) && !/^Disallow: \/$/m.test(rt))
  ? say.ok('robots.txt', 'wp-adminのみ禁止') : say.ng('robots.txt が想定と違う', rt.slice(0, 70));
/Sitemap:/i.test(rt) ? say.ok('サイトマップの場所を宣言している') : say.ng('robots.txt にサイトマップの記載がない');

const idx  = await (await GET('/sitemap_index.xml')).text();
const subs = [...idx.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
let urls = [];
for (const s of subs) {
  const x = await (await GET(s.replace('https://aspath-life.com', ''))).text();
  urls = urls.concat([...x.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map(m => decodeURIComponent(m[1].replace('https://aspath-life.com', ''))));
}
say.ok('サイトマップ', urls.length + '件');
const ngUrl = urls.filter(u => NG_IN_SITEMAP.test(u));
ngUrl.length ? say.ng('サイトマップに載ってはいけないURL', ngUrl.join(' , '))
             : say.ok('除外すべきURLは含まれていない');

/* ══════ 3. 転送と404 ══════ */
console.log('%c\n【3】転送と404', 'font-weight:bold;font-size:13px');
for (const u of SHOULD_REDIRECT) {
  const r = await GET(u, { redirect: 'manual' });
  r.type === 'opaqueredirect' ? say.ok('転送されている', u)
                              : say.ng('転送されていない', u + '（状態' + r.status + '）');
}
for (const u of SHOULD_BE_404) {
  const r = await GET(u);
  r.status === 404 ? say.ok('404になっている', u)
                   : say.ng('公開されてしまっている', u + '（状態' + r.status + '）');
}
const nf = await GET('/zzz-点検用の存在しないURL/');
const nd = parse(await nf.text());
const nrob = (nd.querySelector('meta[name="robots"]') || {}).content || '';
(nf.status === 404 && /noindex/.test(nrob))
  ? say.ok('404ページ', '404かつnoindex') : say.ng('404ページの設定', '状態' + nf.status + ' robots=' + nrob);
nd.querySelector('link[rel=canonical]')
  ? say.ng('404ページにcanonicalが出ている', 'テーマの修正が外れた可能性') : say.ok('404ページにcanonicalなし');

/* ══════ 4. 構造化データ ══════ */
console.log('%c\n【4】構造化データ（Googleへの申告）', 'font-weight:bold;font-size:13px');
const th = await (await GET('/')).text();
const dh = parse(th);
const types = [], faqQ = [];
[...dh.querySelectorAll('script[type="application/ld+json"]')].forEach(s => {
  try {
    const j = JSON.parse(s.textContent);
    (Array.isArray(j['@graph']) ? j['@graph'] : [j]).forEach(x => types.push(x['@type']));
    if (j['@type'] === 'FAQPage') (j.mainEntity || []).forEach(q => faqQ.push(q.name));
  } catch (e) { say.ng('構造化データが壊れている'); }
});
types.includes('HealthClub') ? say.ok('HealthClub（業種・住所・料金）') : say.ng('HealthClubがない');
faqQ.length ? say.ok('FAQPage', faqQ.length + '問') : say.ng('FAQPageがない');
const visQ = [...dh.querySelectorAll('summary')].map(s => s.textContent.trim().replace(/\s/g, ''));
const miss = faqQ.filter(q => !visQ.includes(q.replace(/\s/g, '')));
miss.length ? say.ng('画面に無い質問が申告されている', miss.length + '問（規約違反です）')
            : say.ok('FAQは画面の質問と全問一致');
const im = th.match(/"image":"?\s*"?(https:\/\/[^"]+?\.(?:jpg|jpeg|png|webp))/);
if (im) {
  const r = await fetch(im[1], { cache: 'no-store', credentials: 'omit' });
  r.ok ? say.ok('構造化データの画像', '配信OK') : say.ng('構造化データの画像が404', im[1].split('/').pop());
}

/* ══════ 5. 画像とキャッシュ ══════ */
console.log('%c\n【5】画像とキャッシュ', 'font-weight:bold;font-size:13px');
const srcs = [...dh.querySelectorAll('img')].map(i => i.getAttribute('src')).filter(Boolean).slice(0, 30);
let bad404 = [];
for (const s of srcs) {
  const r = await fetch(s, { cache: 'no-store', credentials: 'omit' });
  if (!r.ok) bad404.push(s.split('/').pop());
}
bad404.length ? say.ng('画像が表示できない', bad404.join(' , '))
              : say.ok('TOPの画像', srcs.length + '件すべて配信OK');
await GET('/about/');
const c2 = await fetch('/about/', { cache: 'no-store', credentials: 'omit' });
say.info('キャッシュ状態', (c2.headers.get('x-wp-spc-disk-cache') || 'ヘッダーなし') +
  '（HIT＝効いている／BYPASS＝効いていない。管理者ログイン中は常にBYPASS）');

/* ══════ 結果 ══════ */
console.log('%c\n──────── 点検結果 ────────', 'font-weight:bold;font-size:14px');
if (!problems.length) {
  console.log('%c 問題は見つかりませんでした ', 'background:#2E7D32;color:#fff;font-size:15px;padding:5px 10px');
} else {
  console.log('%c ' + problems.length + '件の問題が見つかりました ', 'background:#B4453C;color:#fff;font-size:15px;padding:5px 10px');
  problems.forEach((p, i) => console.log('  ' + (i + 1) + '. ' + p));
  console.log('\nこの一覧をコピーして、そのままご連絡ください。');
}
return { 問題件数: problems.length, 問題: problems };

})();
