# -*- coding: utf-8 -*-
"""
ASPATH WordPressテーマ ビルドスクリプト
=====================================
dev（このフォルダのHTML）から WordPress オリジナルテーマ「aspath」を自動生成します。
devを修正したら、このスクリプトを再実行するだけで最新テーマを上書き生成できます。

使い方:
    python3 build_wp_theme.py
出力:
    _wp移行素材/aspath-theme/   … テーマ一式（展開状態）
    _wp移行素材/aspath-theme.zip … WordPressにアップロードするzip

WordPress側の更新手順（上書き）:
    外観 → テーマ → 新規追加 → テーマのアップロード → aspath-theme.zip
    → 「アップロードしたもので現在のテーマを置き換える」を選択
"""
import re, os, shutil, zipfile, datetime, unicodedata

SRC = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(SRC, "_wp移行素材", "aspath-theme")
ZIP = os.path.join(SRC, "_wp移行素材", "aspath-theme.zip")
VERSION = "1.1." + datetime.date.today().strftime("%Y%m%d")

PAGES = ["index.html","about.html","price.html","access.html","contact.html","faq.html",
         "news.html","news-detail.html","column-parkinson.html","taimentraining.html","onlineaspath.html","info.html","news-campaign.html","privacy.html",
         "tokushoho.html","sitemap.html"]

LINKS = {
 'index.html':'/', 'about.html':'/about/', 'price.html':'/services/',
 'access.html':'/access/', 'contact.html':'/contact/', 'faq.html':'/faq/',
 'news.html':'/blog/', 'news-detail.html':'/blog/',
 'privacy.html':'/privacy/', 'tokushoho.html':'/tokushoho/', 'sitemap.html':'/sitemap/',
 'column-parkinson.html':'/パーキンソン病とアスパスの歩み方/',
 'taimentraining.html':'/taimentraining/',
 'onlineaspath.html':'/onlineaspath/',
 'info.html':'/info/', 'news-campaign.html':'/campaign/',
}
TPL = '<?php echo get_template_directory_uri(); ?>'

def read(p): return open(os.path.join(SRC,p),encoding="utf-8").read()

def php_url(path):
    # サブディレクトリ(ステージング)でも本番でも正しく解決するよう home_url() で生成
    # お知らせ一覧だけは固定ページではなくカテゴリーアーカイブなので、
    # 実際のURL（/category/info/ など）をWordPressに解決させる。ハードコードすると404になる。
    if path == '/info/':
        return "<?php echo esc_url( aspath_info_url() ); ?>"
    return "<?php echo esc_url( home_url('" + path + "') ); ?>"

def rewrite_links(s):
    def repl(m):
        base = LINKS.get(m.group(1))
        if base is None: return m.group(0)
        anchor = m.group(2)
        return 'href="' + php_url(base) + anchor + '"'
    s = re.sub(r'href="([a-z0-9\-]+\.html)([^"]*)"', repl, s)
    # 自サイト(aspath-life.com)への絶対URLは home_url() に（ステージングでも本番でも正しく解決）
    s = re.sub(r'href="https://aspath-life\.com(/[^"]*)"',
               lambda m: 'href="' + php_url(m.group(1)) + '"', s)
    # data-en-html 内のエスケープ済みリンクも home_url() に（PHPは属性値内でも実行される）
    for fname,base in LINKS.items():
        s = s.replace('&quot;'+fname+'&quot;', '&quot;'+php_url(base)+'&quot;')
    return s

def rewrite_imgs(s):
    s = re.sub(r'(src|href)="images/([^"]+)"', r'\1="'+TPL+r'/images/\2"', s)
    s = re.sub(r'url\(images/([^)]+)\)', r'url('+TPL+r'/images/\1)', s)
    return s

def strip_noise(s, keep_jsonld=False):
    s = re.sub(r'<style[\s\S]*?</style>','',s)
    s = re.sub(r'<!--[\s\S]*?-->','',s)
    if keep_jsonld:
        s = re.sub(r'<script[\s\S]*?</script>', lambda m:(m.group(0) if 'application/ld+json' in m.group(0) else ''), s)
    else:
        s = re.sub(r'<script[\s\S]*?</script>','',s)
    return s

def clean(s, keep_jsonld=False):
    return rewrite_imgs(rewrite_links(strip_noise(s,keep_jsonld))).strip()

def extract(t, open_re, close):
    a = re.search(open_re, t)
    if not a: return None
    b = t.find(close, a.start())
    return t[a.start():b+len(close)]

# ---------- CSS: 全ページの<style>からルールを重複排除で集約 ----------
def split_rules(css):
    rules, depth, buf = [], 0, []
    for ch in css:
        buf.append(ch)
        if ch == '{': depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                rules.append(''.join(buf).strip()); buf = []
    return [r for r in rules if r]

def page_css(p):
    t = read(p)
    return '\n'.join(re.findall(r'<style[^>]*>([\s\S]*?)</style>', t))

# ページごとに1本のCSSを出力する（結合は絶対にしない）。
#   結合すると、同じセレクタを別内容で持つページ同士が上書きし合い、
#   dev では正しいのに WordPress だけレイアウトが崩れる。実際に28セレクタが衝突していた。
#   1リクエストで読むのは1本だけなので、合計サイズが増えても表示速度には影響しない。
CSS_SOURCES = {
    "index":          "index.html",
    "about":          "about.html",
    "services":       "price.html",
    "access":         "access.html",
    "contact":        "contact.html",
    "faq":            "faq.html",
    "privacy":        "privacy.html",
    "tokushoho":      "tokushoho.html",
    "sitemap":        "sitemap.html",
    "blog":           "news.html",
    "info":           "info.html",
    "column":         "taimentraining.html",      # コラム記事の既定（新規投稿もこれ）
    "column-parkinson":"column-parkinson.html",
    "news-single":    "news-campaign.html",       # お知らせ記事
    "trial-entry":    "trial-entry.html",
    "generic":        "privacy.html",             # 汎用ページ（page.php）の土台
}

def build_css_files():
    written = {}
    css_dir = os.path.join(OUT, "css")
    os.makedirs(css_dir, exist_ok=True)
    for key, src in CSS_SOURCES.items():
        body = f"/* {key}.css — {src} の<style>をそのまま抽出（ページ単位で分離） */\n" + page_css(src)
        open(os.path.join(css_dir, f"{key}.css"), "w", encoding="utf-8").write(body)
        written[key] = len(body)
    return written

def theme_header_css():
    return f"""/*
Theme Name: ASPATH
Theme URI: https://aspath-life.com/
Description: ASPATH（アスパス）パーキンソン病専門トレーニングスタジオ 公式テーマ。devサイトから build_wp_theme.py で自動生成。
Author: ASPATH
Version: {VERSION}
Requires at least: 6.0
Requires PHP: 7.4
Text Domain: aspath
*/
/* 実スタイルは css/<ページ名>.css を1本だけ条件読込（結合による上書き事故を防止） */
"""

# ---------- JS: index/サブ代表ページのインラインscriptを抽出 ----------
def build_js(page, prefix):
    t = read(page)
    body = t[t.find('<body'):]
    out = []
    i = 0
    for m in re.finditer(r'<script\b(?![^>]*application/ld\+json)[^>]*>([\s\S]*?)</script>', body):
        code = m.group(1).strip()
        if not code: continue
        i += 1
        out.append((f"{prefix}-{i:02d}.js", code))
    return out

def main():
    if os.path.isdir(OUT): shutil.rmtree(OUT)
    os.makedirs(os.path.join(OUT,"js")); os.makedirs(os.path.join(OUT,"images"))

    # images
    imgdir = os.path.join(SRC,"images")
    for f in os.listdir(imgdir):
        shutil.copy(os.path.join(imgdir,f), os.path.join(OUT,"images",f))

    # style.css（テーマ情報のみ）＋ css/<ページ名>.css をページ単位で出力
    open(os.path.join(OUT,"style.css"),"w",encoding="utf-8").write(theme_header_css())
    css_written = build_css_files()

    # js
    front_js   = build_js("index.html","front")
    sub_js     = build_js("about.html","sub")
    # ページ固有JS：aboutに無いものだけを拾う（重複読込を避ける）
    sub_codes  = set(re.sub(r'\s+','',c) for _,c in sub_js)
    contact_js = [(n.replace("contact-","contact-"),c) for n,c in build_js("contact.html","contact")
                  if re.sub(r'\s+','',c) not in sub_codes]
    column_js  = [(n,c) for n,c in build_js("column-parkinson.html","column")
                  if re.sub(r'\s+','',c) not in sub_codes]
    news_js    = [(n,c) for n,c in build_js("news.html","news")
                  if re.sub(r'\s+','',c) not in sub_codes]
    for name,code in front_js + sub_js + contact_js + column_js + news_js:
        open(os.path.join(OUT,"js",name),"w",encoding="utf-8").write(code)

    idx = read("index.html")

    # Google Fonts（indexから動的取得）
    m = re.search(r'href="(https://fonts\.googleapis\.com/css2\?[^"]+)"', idx)
    fonts_url = m.group(1).replace('&','&amp;') if m else ''
    fonts_url_php = m.group(1) if m else ''

    # header.php（body開始〜<main直前：ローダー/ヘッダー/ドロワー/追従LINE含む）
    bo = re.search(r'<body[^>]*>', idx).end()
    ms = re.search(r'<main[ >]', idx).start()
    head_region = clean(idx[bo:ms])
    # ローディング画面はTOP専用（サブページでは出さない）
    if 'aspath-loader' in head_region and '<header' in head_region:
        loader_part, rest = head_region.split('<header', 1)
        head_region = ("<?php if ( is_front_page() ) : ?>\n" + loader_part.strip() +
                       "\n<?php endif; ?>\n<header" + rest)
    # 右下の追従LINEボタン（line-float）もTOP専用
    head_region = re.sub(
        r'(<a class="line-float"[\s\S]*?</a>)',
        lambda m: "<?php if ( is_front_page() ) : ?>\n" + m.group(1) + "\n<?php endif; ?>",
        head_region, count=1)
    open(os.path.join(OUT,"header.php"),"w",encoding="utf-8").write(
"""<?php /** header.php — 共通ヘッダー（build_wp_theme.py 自動生成） */ ?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo('charset'); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
""" + head_region + "\n")

    # footer.php
    footer = clean(extract(idx, r'<footer[ >]', '</footer>'))
    open(os.path.join(OUT,"footer.php"),"w",encoding="utf-8").write(
"<?php /** footer.php — 共通フッター（自動生成） */ ?>\n" + footer +
"\n<?php wp_footer(); ?>\n</body>\n</html>\n")

    # functions.php
    front_names   = [n for n,_ in front_js]
    sub_names     = [n for n,_ in sub_js]
    contact_names = [n for n,_ in contact_js]
    column_names  = [n for n,_ in column_js]
    news_names    = [n for n,_ in news_js]
    def enq(names, indent="  "):
        return "\n".join(f"{indent}wp_enqueue_script('aspath-{n[:-3]}', $uri.'/js/{n}', array(), $ver, true);" for n in names)
    functions_php = f"""<?php
/** functions.php — ASPATH theme（build_wp_theme.py 自動生成） */
function aspath_setup() {{
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails');
  add_theme_support('html5', array('search-form','gallery','caption','style','script'));
  register_nav_menus(array('global'=>'グローバルメニュー','footer'=>'フッターメニュー'));
}}
add_action('after_setup_theme','aspath_setup');

function aspath_assets() {{
  $ver = wp_get_theme()->get('Version');
  $uri = get_template_directory_uri();
  wp_enqueue_style('aspath-gfonts','{fonts_url_php}',array(),null);

  // ページごとに専用CSSを1本だけ読み込む（結合するとページ間で上書き事故が起きるため）
  $css = 'generic';
  if      ( is_front_page() )                 {{ $css = 'index'; }}
  elseif  ( is_page_template('template-trial-entry.php') ) {{ $css = 'trial-entry'; }}
  elseif  ( is_page('about') )                {{ $css = 'about'; }}
  elseif  ( is_page('services') )             {{ $css = 'services'; }}
  elseif  ( is_page('access') )               {{ $css = 'access'; }}
  elseif  ( is_page('contact') )              {{ $css = 'contact'; }}
  elseif  ( is_page('faq') )                  {{ $css = 'faq'; }}
  elseif  ( is_page('privacy') )              {{ $css = 'privacy'; }}
  elseif  ( is_page('tokushoho') )            {{ $css = 'tokushoho'; }}
  elseif  ( is_page('sitemap') )              {{ $css = 'sitemap'; }}
  elseif  ( is_category('info') )             {{ $css = 'info'; }}
  elseif  ( is_home() || is_archive() )       {{ $css = 'blog'; }}
  elseif  ( is_singular('post') ) {{
    if ( in_category('info') )                        {{ $css = 'news-single'; }}
    elseif ( get_post_field('post_name') === 'パーキンソン病とアスパスの歩み方' ) {{ $css = 'column-parkinson'; }}
    else                                              {{ $css = 'column'; }}
  }}
  wp_enqueue_style('aspath-page', $uri.'/css/'.$css.'.css', array('aspath-gfonts'), $ver);
  if ( is_front_page() ) {{
{enq(front_names,'    ')}
  }} else {{
{enq(sub_names,'    ')}
  }}
  // ページ固有JS
  if ( is_page('contact') ) {{
{enq(contact_names,'    ')}
  }}
  if ( is_singular('post') ) {{
{enq(column_names,'    ')}
  }}
  if ( is_home() || is_archive() ) {{
{enq(news_names,'    ')}
  }}
}}
add_action('wp_enqueue_scripts','aspath_assets');

/**
 * コラム一覧(/blog/)から「お知らせ」カテゴリーを除外する。
 * devの news.html はコラムのみを並べているため、それに合わせる。
 * お知らせは /category/info/ で一覧表示される。
 */
function aspath_exclude_info_from_blog($q) {{
  if ( is_admin() || ! $q->is_main_query() ) return;
  if ( $q->is_home() ) {{
    $t = get_term_by('slug','info','category');
    if ( $t && ! is_wp_error($t) ) $q->set('category__not_in', array($t->term_id));
  }}
}}
add_action('pre_get_posts','aspath_exclude_info_from_blog');

function aspath_excerpt_length($l){{ return 60; }}
add_filter('excerpt_length','aspath_excerpt_length');

/**
 * お知らせ一覧のURL。
 * 「お知らせ」はカテゴリー(slug: info)のアーカイブなので、実URLは環境により
 * /category/info/ だったり /info/ だったりする。WordPressに解決させて404を防ぐ。
 * カテゴリー未作成のときだけ /info/ にフォールバックする。
 */
function aspath_info_url() {{
  $t = get_term_by('slug','info','category');
  if ( $t && ! is_wp_error($t) ) {{
    $u = get_category_link($t);
    if ( $u ) return $u;
  }}
  return home_url('/info/');
}}
"""
    open(os.path.join(OUT,"functions.php"),"w",encoding="utf-8").write(functions_php)

    # 固定ページ/TOPテンプレート
    def page_tpl(src, comment, kj=False, template_name=None):
        main = clean(extract(read(src), r'<main[ >]', '</main>'), keep_jsonld=kj)
        head = "<?php\n/** "+comment+" */\n"
        if template_name:
            head = "<?php\n/*\nTemplate Name: "+template_name+"\n*/\n/** "+comment+" */\n"
        return head+"get_header(); ?>\n"+main+"\n<?php get_footer(); ?>\n"

    mapping = {
      "front-page.php":     ("index.html","TOP", True, None),
      "page-about.php":     ("about.html","ASPATHについて (slug: about)", False, None),
      "page-services.php":  ("price.html","サービス・料金 (slug: services)", False, None),
      "page-access.php":    ("access.html","交通アクセス (slug: access)", False, None),
      "page-contact.php":   ("contact.html","お問い合わせ (slug: contact) ※フォームはSureFormsショートコードに差替", False, None),
      "page-faq.php":       ("faq.html","よくあるご質問 (slug: faq)", False, None),
      "page-privacy.php":   ("privacy.html","プライバシーポリシー (slug: privacy)", False, None),
      "page-tokushoho.php": ("tokushoho.html","特定商取引法 (slug: tokushoho)", False, None),
      "page-sitemap.php":   ("sitemap.html","サイトマップ (slug: sitemap)", False, None),
    }
    for dst,(s,c,k,tn) in mapping.items():
        open(os.path.join(OUT,dst),"w",encoding="utf-8").write(page_tpl(s,c,k,tn))

    # 初回体験フォーム（限定公開用テンプレート：任意のページで選択可能）
    te = read("trial-entry.html")
    te_main = clean(extract(te, r'<main[ >]', '</main>'))
    open(os.path.join(OUT,"template-trial-entry.php"),"w",encoding="utf-8").write(
"""<?php
/*
Template Name: 初回体験フォーム（限定公開）
*/
/** 限定公開の初回体験申込フォーム。スラッグは自由（推測されにくい文字列を推奨）。
    フォーム本体は SureForms のショートコードに差し替えて使用。noindexはSureRank側で設定。 */
get_header(); ?>
""" + te_main + "\n<?php get_footer(); ?>\n")

    # 動的テンプレート（コラム・一覧）
    single = """<?php
/** single.php — コラム/投稿記事（自動生成） */
get_header(); ?>
<main id="top" class="spine-page">
<?php while ( have_posts() ) : the_post(); ?>
  <section class="column-hero">
    <div class="wrap">
      <p class="column-crumb"><a href="<?php echo esc_url( home_url('/') ); ?>">TOP</a> ／ <a href="<?php echo esc_url( home_url('/blog/') ); ?>">コラム</a> ／ <?php the_title(); ?></p>
      <h1><?php the_title(); ?></h1>
      <?php if ( is_sticky( get_the_ID() ) ) : ?><p class="column-byline"><span class="imp-label">重要</span></p><?php endif; ?>
      <p class="column-byline">By ASPATH ／ <?php echo get_the_date(); ?></p>
    </div>
  </section>
  <article class="column-body">
    <div class="wrap">
      <?php if ( has_post_thumbnail() ) : ?><div class="column-eyecatch img-slot" style="--ratio:16/9;"><?php the_post_thumbnail('large'); ?></div><?php endif; ?>
      <?php the_content(); ?>
      <nav class="column-nav" aria-label="記事の移動">
      <?php
        $aspath_prev = get_previous_post();   // 1つ古い記事
        $aspath_next = get_next_post();       // 1つ新しい記事
        if ( $aspath_prev ) : ?>
        <a class="cn-prev" href="<?php echo esc_url( get_permalink($aspath_prev) ); ?>">
          <span class="label">← 前の記事</span>
          <span class="title"><?php echo esc_html( get_the_title($aspath_prev) ); ?></span>
        </a>
      <?php endif;
        if ( $aspath_next ) : ?>
        <a class="cn-next" href="<?php echo esc_url( get_permalink($aspath_next) ); ?>">
          <span class="label">次の記事 →</span>
          <span class="title"><?php echo esc_html( get_the_title($aspath_next) ); ?></span>
        </a>
      <?php endif; ?>
      </nav>
    </div>
  </article>
<?php endwhile; ?>
</main>
<?php get_footer(); ?>
"""
    home = """<?php
/** home.php — 投稿一覧（/blog/＝コラム、/category/info/＝お知らせ・自動生成） */
get_header(); ?>
<?php
/* 見出しは文脈で切り替える。
   /blog/        → コラム（お知らせカテゴリーは functions.php で除外）
   /category/info/ → お知らせ（devのinfo.htmlと同じ「枠なし」デザイン）
   その他のアーカイブ → そのアーカイブ名 */
$aspath_is_info = is_category('info');
if     ( $aspath_is_info ) { $aspath_ttl = 'お知らせ'; }
elseif ( is_category() )   { $aspath_ttl = single_cat_title('', false); }
elseif ( is_archive() )    { $aspath_ttl = wp_strip_all_tags( get_the_archive_title() ); }
else                       { $aspath_ttl = 'コラム'; }
?>
<main>
  <div class="page-head"><div class="wrap">
    <p class="crumb"><a href="<?php echo esc_url( home_url('/') ); ?>">TOP</a> ／ <?php echo esc_html($aspath_ttl); ?></p>
    <h1 class="page-title"><?php echo esc_html($aspath_ttl); ?></h1>
  </div></div>
  <div class="page-wrap wrap"><div class="page-main">
    <div class="news-list<?php echo $aspath_is_info ? ' news-list--plain' : ''; ?>" id="newsList">
      <?php if ( have_posts() ) : while ( have_posts() ) : the_post();
        $cats = get_the_category(); $catname = $cats ? $cats[0]->name : ''; ?>
        <?php $imp = is_sticky( get_the_ID() ); ?>
        <a class="news-list-item<?php echo $imp ? ' is-important' : ''; ?>" data-cat="<?php echo esc_attr($catname); ?>" href="<?php the_permalink(); ?>">
          <?php if ( ! $aspath_is_info ) : ?>
          <div class="nli-thumb img-slot" role="img" aria-label="<?php the_title_attribute(); ?>">
            <?php if ( has_post_thumbnail() ) the_post_thumbnail('medium', array('style'=>'--fit:contain; --pos:50% 50%;')); ?>
          </div>
          <?php endif; ?>
          <div class="nli-body<?php echo $aspath_is_info ? ' nli-body--full' : ''; ?>">
            <div class="nli-meta">
              <time datetime="<?php echo get_the_date('Y-m-d'); ?>"><?php echo get_the_date('Y.m.d'); ?></time>
              <?php if ( $imp ) : ?><span class="nli-tag tag-important">重要</span>
              <?php elseif ( $catname ) : ?><span class="nli-tag" style="background:var(--gold);"><?php echo esc_html($catname); ?></span><?php endif; ?>
            </div>
            <h3 class="nli-title"><?php the_title(); ?></h3>
            <p class="nli-excerpt"><?php echo esc_html( get_the_excerpt() ); ?></p>
          </div>
        </a>
      <?php endwhile; else : ?><p>投稿がまだありません。</p><?php endif; ?>
    </div>
    <?php the_posts_pagination(array('mid_size'=>1)); ?>
  </div></div>
</main>
<?php get_footer(); ?>
"""
    page_generic = """<?php
/** page.php — 汎用固定ページ（自動生成） */
get_header(); ?>
<main>
  <div class="page-head"><div class="wrap"><h1 class="page-title"><?php the_title(); ?></h1></div></div>
  <div class="wrap page-generic"><?php while ( have_posts() ) : the_post(); the_content(); endwhile; ?></div>
</main>
<?php get_footer(); ?>
"""
    open(os.path.join(OUT,"single.php"),"w",encoding="utf-8").write(single)
    open(os.path.join(OUT,"home.php"),"w",encoding="utf-8").write(home)
    open(os.path.join(OUT,"archive.php"),"w",encoding="utf-8").write(home)
    open(os.path.join(OUT,"index.php"),"w",encoding="utf-8").write(home)
    open(os.path.join(OUT,"page.php"),"w",encoding="utf-8").write(page_generic)


    # TOPのお知らせ枠を動的化：「先頭に固定表示（＝重要）」の投稿を優先して1件表示
    NOTICE_LOOP = """<?php
  $aspath_sticky = get_option('sticky_posts');
  $aspath_args   = array('posts_per_page'=>1,'ignore_sticky_posts'=>true,'category_name'=>'info');
  if ( ! empty($aspath_sticky) ) { $aspath_args['post__in'] = $aspath_sticky; }
  $aspath_q = new WP_Query($aspath_args);
  if ( ! $aspath_q->have_posts() ) {
    $aspath_q = new WP_Query(array('posts_per_page'=>1,'ignore_sticky_posts'=>true,'category_name'=>'info'));
  }
  if ( $aspath_q->have_posts() ) : while ( $aspath_q->have_posts() ) : $aspath_q->the_post();
    $imp = is_sticky( get_the_ID() ); ?>
          <li class="notice-row<?php echo $imp ? ' is-important' : ''; ?>">
            <time datetime="<?php echo get_the_date('Y-m-d'); ?>"><?php echo get_the_date('Y.m.d'); ?></time>
            <span class="tag<?php echo $imp ? ' tag-important' : ''; ?>"><?php echo $imp ? '重要' : 'お知らせ'; ?></span>
            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
          </li>
  <?php endwhile; wp_reset_postdata(); else : ?>
          <li class="notice-row"><span class="tag">お知らせ</span><a href="<?php echo esc_url( aspath_info_url() ); ?>">お知らせはまだありません</a></li>
  <?php endif; ?>
"""
    fp = os.path.join(OUT,"front-page.php")
    _s = open(fp,encoding="utf-8").read()
    _m = re.search(r'(<ul class="notice-list[^"]*" id="noticeList"[^>]*>)([\s\S]*?)(</ul>)', _s)
    if _m:
        _s = _s[:_m.start(2)] + "\n" + NOTICE_LOOP + "        " + _s[_m.end(2):]
        open(fp,"w",encoding="utf-8").write(_s)
        print("  ↳ front-page.php: TOPのお知らせ枠を動的化（重要=先頭固定を優先）")

    # screenshot（前回生成の物があれば流用）
    old_ss = os.path.join(SRC,"_wp移行素材","theme-aspath","screenshot.png")
    for cand in [old_ss]:
        if os.path.isfile(cand):
            shutil.copy(cand, os.path.join(OUT,"screenshot.png")); break

    # zip
    if os.path.exists(ZIP): os.remove(ZIP)
    with zipfile.ZipFile(ZIP,"w",zipfile.ZIP_DEFLATED) as z:
        for root,_,files in os.walk(OUT):
            for f in files:
                fp = os.path.join(root,f)
                z.write(fp, os.path.join("aspath", os.path.relpath(fp,OUT)))

    # report
    php = [f for f in os.listdir(OUT) if f.endswith(".php")]
    js  = os.listdir(os.path.join(OUT,"js"))
    img = os.listdir(os.path.join(OUT,"images"))
    css_kb = os.path.getsize(os.path.join(OUT,"style.css"))//1024
    zip_kb = os.path.getsize(ZIP)//1024
    print(f"✓ テーマ生成完了 v{VERSION}")
    print(f"  PHP:{len(php)} / JS:{len(js)} / 画像:{len(img)} / style.css:{css_kb}KB / zip:{zip_kb}KB")
    print(f"  → {ZIP}")

if __name__ == "__main__":
    main()
