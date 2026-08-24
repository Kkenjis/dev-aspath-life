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
import re, os, shutil, zipfile, datetime, unicodedata, json, sys

SRC = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(SRC, "_wp移行素材", "aspath-theme")
ZIP = os.path.join(SRC, "_wp移行素材", "aspath-theme.zip")
# バージョンには時刻まで入れる。日付だけだと同じ日に作り直しても ?ver= が変わらず、
# ブラウザやキャッシュ系プラグインが古いCSS/JSを配り続けてしまう（実際に発生した）。
VERSION = "1.1." + datetime.datetime.now().strftime("%Y%m%d.%H%M")

# ── WordPress側で本文を持つページ（山口様がご自身で直せるページ） ──────────
#   ここに入れたページは、テンプレートが本文を出力せず the_content() を呼ぶ。
#   本文は tools/html2blocks.py で変換し、固定ページの編集画面に貼り付けてある。
#   ★注意★ 追加したら、必ず本番の固定ページに本文を貼ってから公開すること。
#           貼る前にテーマだけ更新すると、そのページが真っ白になる。
EDITABLE_PAGES = {"about.html"}

PAGES = ["index.html","about.html","price.html","access.html","contact.html","faq.html",
         "news.html","news-detail.html","column-parkinson.html","taimentraining.html","onlineaspath.html","info.html","news-campaign.html","privacy.html",
         "tokushoho.html","sitemap.html"]

LINKS = {
 'index.html':'/', 'about.html':'/about/', 'price.html':'/services/',
 'access.html':'/access/', 'contact.html':'/contact/', 'faq.html':'/faq/',
 'news.html':'/column/', 'news-detail.html':'/column/',   # 2026-08-16 山口様判断：表示・URLとも「コラム」に統一（旧 /blog/ は301）
 'privacy.html':'/privacy/', 'tokushoho.html':'/tokushoho/', 'sitemap.html':'/sitemap/',
 'column-parkinson.html':'/パーキンソン病とアスパスの歩み方/',
 'taimentraining.html':'/taimentraining/',
 'onlineaspath.html':'/onlineaspath/',
 'info.html':'/info/', 'news-campaign.html':'/campaign/',
}
TPL = '<?php echo get_template_directory_uri(); ?>'

def die(msg):
    print('[エラー] ' + msg)
    sys.exit(1)

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

# ============================================================================
#  初回体験フォームの送信処理（functions.php の末尾に追記される）
#  ここは f-string ではないので、PHPの波かっこをそのまま書ける。
# ============================================================================
TRIAL_CORE_PHP = r'''
if ( ! defined('ASPATH_TRIAL_TO') )  define('ASPATH_TRIAL_TO',  'aspathlife@gmail.com');
if ( ! defined('ASPATH_TRIAL_TPL') ) define('ASPATH_TRIAL_TPL', 'template-trial-entry.php');

/** 入力項目の定義。array( 表示ラベル, 必須かどうか ) */
function aspath_trial_fields() {
  return array(
    'name'            => array('お名前',                        true),
    'kana'            => array('お名前（フリガナ）',              true),
    'birthday'        => array('生年月日',                       true),
    'email'           => array('メールアドレス',                 true),
    'tel'             => array('お電話番号',                     true),
    'address'         => array('ご住所',                         true),
    'who'             => array('どなたについてのご相談か',        true),
    'diagnosis'       => array('医師からの診断名',               true),
    'diagnosis_other' => array('診断名（その他）',               false),
    'trouble'         => array('気になること・困っていること・改善したいこと', false),
    'source'          => array('ASPATHを知ったきっかけ',          true),
    'studio'          => array('ご希望のスタジオ・方法',          true),
    'lesson'          => array('現在の習いごと',                 false),
    'hobby'           => array('趣味',                           false),
    'mobility'        => array('普段の移動手段',                 true),
    'holiday'         => array('休みの日の過ごし方',             false),
    'message'         => array('メッセージ・ご質問',              false),
  );
}

/** 送信結果を1リクエストの中で持ち回すための入れ物 */
function aspath_trial_state( $set = null ) {
  static $state = array( 'status' => '', 'errors' => array(), 'old' => array() );
  if ( is_array($set) ) $state = $set;
  return $state;
}

/** 入力し直しのときに値を復元する（長い入力を失わせないため） */
function aspath_trial_old( $key ) {
  $s = aspath_trial_state();
  return isset($s['old'][$key]) ? $s['old'][$key] : '';
}

/** 送信が完了したか（完了後はフォームを隠す） */
function aspath_trial_done() {
  $s = aspath_trial_state();
  return ( $s['status'] === 'done' );
}

/** フォームの上に出す結果メッセージ */
function aspath_trial_notice() {
  $s = aspath_trial_state();

  if ( $s['status'] === 'done' ) {
    return '<div class="trial-result trial-result--ok">'
      . '<p class="trial-result-head">お申し込みを受け付けました。</p>'
      . '<p>ご入力いただいたメールアドレスへ、内容の控えをお送りしました。'
      . '担当より<strong>48時間以内</strong>にご連絡いたします。</p>'
      . '<p class="trial-result-sub">※控えのメールが見つからない場合は、迷惑メールフォルダをご確認ください。'
      . 'お急ぎの場合は公式LINEからもご連絡いただけます。</p>'
      . '</div>';
  }

  if ( $s['status'] === 'error' ) {
    $out = '<div class="trial-result trial-result--ng">'
      . '<p class="trial-result-head">送信できませんでした。</p><ul>';
    foreach ( (array) $s['errors'] as $e ) { $out .= '<li>' . esc_html($e) . '</li>'; }
    $out .= '</ul><p class="trial-result-sub">ご入力いただいた内容はそのまま残しています。'
      . '上の項目をご確認のうえ、もう一度送信してください。</p></div>';
    return $out;
  }

  return '';
}

/**
 * 申込の保存先。
 * 公開されない投稿タイプなので、URLを推測されても中身は見られない。
 * 管理画面の「初回体験の申込」から閲覧できる（新規作成はできない）。
 */
function aspath_trial_register_cpt() {
  register_post_type('aspath_trial', array(
    'labels' => array(
      'name'          => '初回体験の申込',
      'singular_name' => '初回体験の申込',
      'menu_name'     => '初回体験の申込',
      'all_items'     => '申込一覧',
    ),
    'public'          => false,
    'show_ui'         => true,
    'show_in_menu'    => true,
    'menu_position'   => 26,
    'menu_icon'       => 'dashicons-clipboard',
    'supports'        => array('title','editor'),
    'capability_type' => 'post',
    'map_meta_cap'    => true,
    'capabilities'    => array( 'create_posts' => 'do_not_allow' ),
  ));
}
add_action('init','aspath_trial_register_cpt');

/**
 * 送信処理の本体。
 * ページの判定は呼び出し側で行う（テーマはテンプレート判定、プラグインはURL判定）。
 * どちらから呼ばれても同じ動きになるよう、ここには画面の条件を書かない。
 */
function aspath_trial_process() {
  if ( empty($_POST['aspath_trial_nonce']) ) return;

  if ( ! wp_verify_nonce( sanitize_text_field( wp_unslash($_POST['aspath_trial_nonce']) ), 'aspath_trial' ) ) {
    aspath_trial_state(array(
      'status' => 'error',
      'errors' => array('ページを開いたまま時間が経ちすぎたため、送信が無効になりました。お手数ですが、ページを再読み込みしてからもう一度お試しください。'),
      'old'    => array(),
    ));
    return;
  }

  // ハニーポット。人には見えない欄が埋まっていたら自動投稿なので、黙って受け流す
  if ( ! empty($_POST['bot-field']) ) {
    aspath_trial_state(array('status'=>'done','errors'=>array(),'old'=>array()));
    return;
  }

  $fields = aspath_trial_fields();
  $data   = array();
  $errors = array();

  foreach ( $fields as $key => $f ) {
    /* 入力欄の name には接頭辞が付いている（WordPressの予約語 name との衝突回避）。
       内部のキーは接頭辞なしのままなので、読み取るときだけ付け直す。 */
    $field = 'at_' . $key;
    $raw = isset($_POST[$field]) ? wp_unslash($_POST[$field]) : '';
    if ( is_array($raw) ) $raw = implode(' / ', $raw);
    $val = ( $key === 'email' ) ? sanitize_email($raw) : sanitize_textarea_field($raw);
    $val = trim($val);
    if ( $f[1] && $val === '' ) $errors[] = $f[0] . 'をご入力ください。';
    $data[$key] = $val;
  }
  if ( $data['email'] !== '' && ! is_email($data['email']) ) {
    $errors[] = 'メールアドレスの形式をご確認ください。';
  }

  if ( ! empty($errors) ) {
    aspath_trial_state(array('status'=>'error','errors'=>$errors,'old'=>$data));
    return;
  }

  /* ⚠ ここから先は「保存」と「メール送信」を行う。
     この2つは save_post / wp_mail のフックを通じて他プラグインの処理を呼び出す。
     そのとき別のクエリが実行されると、WordPressが今表示しているページの情報
     （グローバルの $wp_query）が上書きされ、「ページが見つかりません(404)」に
     化けてしまう。実際にこの症状が出たため、前後で退避・復元する。 */
  global $wp_query, $wp_the_query, $post;
  $aspath_saved_query     = $wp_query;
  $aspath_saved_the_query = $wp_the_query;
  $aspath_saved_post      = $post;

  // ---- 本文を組み立てる ----
  $lines = array();
  foreach ( $fields as $key => $f ) {
    $v = ( $data[$key] === '' ) ? '（未記入）' : $data[$key];
    $lines[] = $f[0] . '：' . $v;
  }
  $body = implode("\n", $lines);
  $when = function_exists('wp_date') ? wp_date('Y年n月j日 H:i') : date_i18n('Y年n月j日 H:i');
  $bar  = "----------------------------------------";

  // ---- 1. 先に保存する（メールが不達でも申込を失わない） ----
  $post_id = wp_insert_post(array(
    'post_type'    => 'aspath_trial',
    'post_status'  => 'private',
    'post_title'   => $data['name'] . ' 様（' . $when . '）',
    'post_content' => $body,
  ));
  if ( $post_id && ! is_wp_error($post_id) ) {
    foreach ( $data as $k => $v ) { update_post_meta($post_id, '_aspath_' . $k, $v); }
  }

  // ---- 2. 山口様への通知メール ----
  wp_mail(
    ASPATH_TRIAL_TO,
    '【初回体験】ASPATH お申し込み／' . $data['name'] . '様',
      "初回体験のお申し込みがありました。\n"
    . "受付日時：" . $when . "\n\n"
    . $bar . "\n" . $body . "\n" . $bar . "\n\n"
    . "このメールにそのまま返信すると、申込者へ直接返信できます。\n"
    . "管理画面の「初回体験の申込」からも同じ内容を確認できます。\n",
    array(
      'Content-Type: text/plain; charset=UTF-8',
      'Reply-To: ' . $data['email'],
    )
  );

  // ---- 3. 申込者への控えメール ----
  wp_mail(
    $data['email'],
    '【ASPATH】初回体験のお申し込みを受け付けました',
      $data['name'] . " 様\n\n"
    . "このたびはASPATH（アスパス）の初回体験にお申し込みいただき、ありがとうございます。\n"
    . "下記の内容で承りました。\n\n"
    . $bar . "\n" . $body . "\n" . $bar . "\n\n"
    . "担当より48時間以内にご連絡いたします。\n"
    . "内容に誤りがある場合や、お急ぎの場合は、このメールにご返信ください。\n\n"
    . "-------------------------------------------------\n"
    . "ASPATH（アスパス）\n"
    . "パーキンソン病専門トレーニングスタジオ\n"
    . home_url('/') . "\n"
    . "-------------------------------------------------\n",
    array(
      'Content-Type: text/plain; charset=UTF-8',
      'Reply-To: ' . ASPATH_TRIAL_TO,
    )
  );

  /* 保存・メール送信で壊された可能性があるページ情報を元に戻す。
     これをしないと、送信に成功したときだけ404画面になる。 */
  $wp_query     = $aspath_saved_query;
  $wp_the_query = $aspath_saved_the_query;
  $post         = $aspath_saved_post;
  if ( isset($wp_query) ) {
    $wp_query->is_404 = false;
  }
  wp_reset_postdata();
  status_header(200);

  aspath_trial_state(array('status'=>'done','errors'=>array(),'old'=>array()));
}

/** 申込一覧に「メール」「電話」列を出して、開かずに見分けられるようにする */
function aspath_trial_columns( $cols ) {
  return array(
    'cb'            => isset($cols['cb']) ? $cols['cb'] : '',
    'title'         => 'お申し込み',
    'aspath_email'  => 'メールアドレス',
    'aspath_tel'    => 'お電話番号',
    'aspath_who'    => 'ご相談の対象',
    'date'          => '受付日',
  );
}
add_filter('manage_aspath_trial_posts_columns','aspath_trial_columns');

function aspath_trial_column_value( $col, $post_id ) {
  $map = array('aspath_email'=>'_aspath_email','aspath_tel'=>'_aspath_tel','aspath_who'=>'_aspath_who');
  if ( isset($map[$col]) ) {
    $v = get_post_meta($post_id, $map[$col], true);
    echo $v !== '' ? esc_html($v) : '—';
  }
}
add_action('manage_aspath_trial_posts_custom_column','aspath_trial_column_value',10,2);
'''

# ---------------------------------------------------------------------------
#  テーマ専用の部分（プラグイン側では使わない）
#  固定ページ＋テンプレート指定で動かすための判定まわり。
# ---------------------------------------------------------------------------
TRIAL_THEME_PHP = r'''

/** このリクエストが「初回体験フォーム」の固定ページかどうか */
function aspath_trial_is_page() {
  return ( is_page() && is_page_template(ASPATH_TRIAL_TPL) );
}

/**
 * 限定公開ページはキャッシュさせない。
 * キャッシュされると、古いnonceが配られ続けて「送信が無効」になる。
 */
function aspath_trial_nocache() {
  if ( aspath_trial_is_page() ) {
    if ( ! defined('DONOTCACHEPAGE') ) define('DONOTCACHEPAGE', true);
    nocache_headers();
  }
}
add_action('template_redirect','aspath_trial_nocache',5);

/** 固定ページ版の入口。判定だけ行い、処理は共通の aspath_trial_process() に渡す */
function aspath_trial_handle() {
  if ( is_admin() ) return;
  if ( ! aspath_trial_is_page() ) return;
  aspath_trial_process();
}
add_action('template_redirect','aspath_trial_handle');

/** 限定公開ページを検索エンジンに拾わせない（プラグイン設定に依存しない保険） */
function aspath_trial_noindex() {
  if ( aspath_trial_is_page() ) {
    echo '<meta name="robots" content="noindex,nofollow,noarchive" />' . "\n";
  }
}
add_action('wp_head','aspath_trial_noindex',1);

/** WordPress標準のサイトマップから限定公開ページを外す */
function aspath_trial_hide_from_sitemap( $args, $post_type ) {
  if ( $post_type !== 'page' ) return $args;
  $ids = get_posts(array(
    'post_type'   => 'page',
    'post_status' => 'any',
    'fields'      => 'ids',
    'numberposts' => -1,
    'meta_key'    => '_wp_page_template',
    'meta_value'  => ASPATH_TRIAL_TPL,
  ));
  if ( ! empty($ids) ) {
    $ex = isset($args['post__not_in']) ? (array) $args['post__not_in'] : array();
    $args['post__not_in'] = array_merge($ex, $ids);
  }
  return $args;
}
add_filter('wp_sitemaps_posts_query_args','aspath_trial_hide_from_sitemap',10,2);
'''


def guard_trial_core(core_php, owner):
    """共通処理を二重定義ガードで包む。

    先行設置プラグインとテーマの両方が有効になっても、PHPの
    「関数を二重に定義できない」エラー（画面が真っ白になる）を防ぐ。
    プラグインはテーマより先に読み込まれるため、プラグインが有効なら
    プラグイン側の定義が使われ、テーマ側のブロックは丸ごと飛ばされる。
    """
    return (
        "\n/* ===== ASPATH_TRIAL_CORE ここから =====\n"
        "   共通処理。%s 側で読み込む。先に読み込まれた方が使われる。\n"
        "   この目印は build_trial_plugin.py が切り出しに使うので消さないこと。 */\n"
        "if ( ! defined('ASPATH_TRIAL_CORE') ) {\n"
        "  define('ASPATH_TRIAL_CORE', '%s');\n"
        % (owner, owner)
        + core_php.rstrip()
        + "\n} /* ===== ASPATH_TRIAL_CORE ここまで ===== */\n"
    )


# 入力欄につける接頭辞。
#   WordPress は POST された `name` を「投稿スラッグの指定」として解釈するため、
#   name="name" のまま送ると該当する投稿を探しに行き、見つからず404になる。
#   （実際にこれで送信が全て404になった）
#   他にも s / p / page / author / order / year などが予約語なので、
#   衝突を根本から避けるため全項目に接頭辞を付ける。
TRIAL_PREFIX = 'at_'
TRIAL_FIELD_KEYS = ('name','kana','birthday','email','tel','address',
                    'who','diagnosis','diagnosis_other','trouble','source',
                    'studio','lesson','hobby','mobility','holiday','message')


def wp_trial_form(main_html):
    """dev の trial-entry.html のフォームを、WordPress で送信できる形に書き換える。

    devのフォームは Netlify 用（data-netlify / action="trial-entry.html"）なので、
    そのままWordPressに置くと「見た目は動くのに送信されない」状態になる。
    見た目・項目・文言は一切変えず、次の3つだけを足す。
      1. 自分自身へPOST＋nonce（改ざん・自動投稿対策）
      2. 入力値の復元（エラーで戻ったときに入力を失わない。高齢の方の長文入力を守る）
      3. 送信結果の表示と、完了後はフォームを隠す
    受け取り側の処理は functions.php の aspath_trial_handle()。
    """
    # 0) 入力欄の name に接頭辞を付ける（WordPressの予約語との衝突を避ける）
    for key in TRIAL_FIELD_KEYS:
        main_html = re.sub(r'(<(?:input|textarea)\b[^>]*\bname=")%s(")' % re.escape(key),
                           lambda mo: mo.group(1) + TRIAL_PREFIX + key + mo.group(2),
                           main_html)

    # 1) form タグ：Netlify 属性を外し、自分自身へPOST。nonce を直後に置く
    main_html = re.sub(
        r'<form\b[^>]*class="cform"[^>]*>',
        '<form class="cform" name="trial" method="post" '
        'action="<?php echo esc_url( get_permalink() ); ?>#aspath-form">\n'
        "        <?php wp_nonce_field( 'aspath_trial', 'aspath_trial_nonce' ); ?>",
        main_html, count=1)
    main_html = main_html.replace(
        '<input type="hidden" name="form-name" value="trial">', '')

    # 2) 入力値の復元
    def _input(m):
        tag = m.group(0)
        nm = re.search(r'name="([A-Za-z_\-]+)"', tag)
        ty = re.search(r'type="([a-z]+)"', tag)
        if not nm:
            return tag
        name = nm.group(1)
        typ  = ty.group(1) if ty else 'text'
        if name == 'bot-field' or typ == 'hidden':
            return tag          # ハニーポットと隠しフィールドは触らない
        # 復元に使うキーは接頭辞を外した元の名前
        key = name[len(TRIAL_PREFIX):] if name.startswith(TRIAL_PREFIX) else name
        if typ == 'radio':
            val = re.search(r'value="([^"]*)"', tag)
            if not val:
                return tag
            add = " <?php checked( aspath_trial_old('%s'), '%s' ); ?>" % (key, val.group(1))
        else:
            add = ' value="<?php echo esc_attr( aspath_trial_old(\'%s\') ); ?>"' % key
        return tag[:-1].rstrip() + add + '>'
    main_html = re.sub(r'<input\b[^>]*>', _input, main_html)

    def _textarea(m):
        name = m.group(1)
        key  = name[len(TRIAL_PREFIX):] if name.startswith(TRIAL_PREFIX) else name
        return ('<textarea name="%s"><?php echo esc_textarea( aspath_trial_old(\'%s\') ); ?>'
                '</textarea>' % (name, key))
    main_html = re.sub(r'<textarea\s+name="([A-Za-z_]+)"\s*>\s*</textarea>',
                       _textarea, main_html)

    # 3) 送信結果の表示 ＋ 完了後はフォームを隠す
    main_html = main_html.replace(
        '<form class="cform"',
        '<div id="aspath-form"><?php echo aspath_trial_notice(); ?></div>\n'
        '    <?php if ( ! aspath_trial_done() ) : ?>\n'
        '      <form class="cform"', 1)
    main_html = main_html.replace('</form>', '</form>\n    <?php endif; ?>', 1)
    return main_html

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

# 記事にコメント欄を出すページ（この3つだけにコメント用CSSを足す）
CSS_WITH_COMMENTS = ("column", "column-parkinson", "news-single")

# コメント欄のCSS。devのHTMLには無い要素なので、ここで持つ。
# 4ファイルに同じものを書くと必ずズレるため、生成時に必要なCSSだけ足す方式にした。
COMMENTS_CSS = r'''

/* ==========================================================
   コメント欄（WordPress標準のコメント機能をサイトの意匠に合わせる）
   ・シニアの方が読み書きしやすいよう、文字は16px以上・入力欄は大きめ
   ・投稿ボタンは記事内CTAと同じオレンジ系で迷わないように
========================================================== */
.aspath-comments{
  max-width:820px;
  /* 下の余白を必ず取る。0だとフッターに貼り付いて窮屈に見える */
  margin:56px auto 90px; padding:0 20px;
}
.aspath-comments h2{
  font-family:var(--font-head); font-size:clamp(21px,2.8vw,26px);
  color:var(--brown); text-align:center; margin-bottom:8px;
}
.aspath-comments .ac-lead{
  text-align:center; font-size:15.5px; color:#52707A; margin-bottom:30px;
}
.ac-list{ list-style:none; margin:0 0 40px; padding:0; }
.ac-list ol.children{ list-style:none; margin:16px 0 0 clamp(16px,4vw,44px); padding:0; }
.ac-list li.comment{ margin-bottom:18px; }
.ac-list article.comment-body{
  background:#fff; border:1.5px solid var(--gold-soft); border-radius:16px;
  box-shadow:0 6px 18px rgba(38,70,83,.07); padding:22px 26px;
}
.ac-head{ display:flex; align-items:center; gap:12px; margin-bottom:10px; flex-wrap:wrap; }
.ac-head img.avatar{ width:44px; height:44px; border-radius:50%; flex:none; }
.ac-name{ font-family:var(--font-head); font-size:17px; color:var(--brown); }
.ac-date{ font-size:14px; color:#5E7681; }
.ac-badge{
  background:var(--gold); color:#fff; font-size:12.5px; font-weight:700;
  border-radius:999px; padding:2px 10px;
}
.ac-text{ font-size:16.5px; line-height:1.95; }
.ac-text p{ margin:0 0 10px; }
.ac-text p:last-child{ margin-bottom:0; }
.ac-actions{ margin-top:12px; font-size:15px; }
.ac-actions a{ color:var(--gold-deep); text-decoration:none; font-weight:700; }
.ac-actions a:hover{ color:var(--sun); }
.ac-pending{ color:#B4442B; font-size:14.5px; margin-top:8px; }

/* 投稿フォーム */
.aspath-comments #respond{
  background:#FFFCF7; border:1.5px solid var(--gold-soft); border-radius:18px;
  box-shadow:0 8px 22px rgba(38,70,83,.07); padding:30px clamp(20px,4vw,34px);
}
.aspath-comments .comment-reply-title{
  font-family:var(--font-head); font-size:clamp(19px,2.4vw,23px);
  color:var(--brown); margin:0 0 6px;
}
.aspath-comments .comment-reply-title small{ display:block; font-size:15px; margin-top:6px; }
.aspath-comments .comment-reply-title small a{ color:var(--sun); }
.aspath-comments .comment-notes,
.aspath-comments .logged-in-as{ font-size:15px; color:#52707A; margin:0 0 20px; }
.aspath-comments .comment-form-comment,
.aspath-comments .comment-form-author,
.aspath-comments .comment-form-email,
.aspath-comments .comment-form-url{ margin-bottom:18px; }
.aspath-comments label{
  display:block; font-family:var(--font-head); font-size:15.5px;
  color:var(--brown); margin-bottom:6px;
}
.aspath-comments .required{ color:var(--sun); font-weight:700; }
.aspath-comments input[type=text],
.aspath-comments input[type=email],
.aspath-comments input[type=url],
.aspath-comments textarea{
  width:100%; font-family:var(--font-body); font-size:16px; color:var(--ink);
  background:#fff; border:1.5px solid var(--gold-soft); border-radius:12px;
  padding:13px 15px;
}
.aspath-comments textarea{ min-height:150px; resize:vertical; }
.aspath-comments input:focus, .aspath-comments textarea:focus{
  outline:none; border-color:var(--sun); box-shadow:0 0 0 3px rgba(244,162,97,.15);
}
.aspath-comments .comment-form-cookies-consent{
  display:flex; align-items:flex-start; gap:10px; font-size:15px; margin-bottom:20px;
}
.aspath-comments .comment-form-cookies-consent input{ width:20px; height:20px; accent-color:var(--sun); flex:none; margin-top:3px; }
.aspath-comments .comment-form-cookies-consent label{ margin:0; font-family:var(--font-body); font-size:15px; }
.aspath-comments .form-submit{ margin:0; text-align:center; }
.aspath-comments .submit{
  font-family:var(--font-head); font-weight:700; font-size:17px; color:#fff;
  background:linear-gradient(135deg,var(--sun),#DD8236);
  border:2.5px solid #264653; border-radius:999px;
  padding:16px 44px; cursor:pointer;
  box-shadow:0 10px 22px rgba(244,162,97,.35);
  transition:transform .25s, box-shadow .25s;
}
.aspath-comments .submit:hover{ transform:translateY(-3px); }
.ac-closed{
  text-align:center; font-size:15.5px; color:#5E7681;
  background:#FAF3E7; border-radius:14px; padding:18px 22px;
}

@media (max-width:600px){
  .aspath-comments{ margin:44px auto 64px; padding:0 16px; }
  .ac-list article.comment-body{ padding:18px 16px; }
  .ac-list ol.children{ margin-left:14px; }
  .aspath-comments #respond{ padding:24px 18px; }
  .aspath-comments .submit{ width:100%; }
}
'''


def build_css_files():
    written = {}
    css_dir = os.path.join(OUT, "css")
    os.makedirs(css_dir, exist_ok=True)
    for key, src in CSS_SOURCES.items():
        body = f"/* {key}.css — {src} の<style>をそのまま抽出（ページ単位で分離） */\n" + page_css(src)
        if key in CSS_WITH_COMMENTS:
            body += COMMENTS_CSS
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

    # ── 構造化データ ────────────────────────────────────────────────
    #   dev の index.html <head> に置いてある JSON-LD をそのまま引き継ぐ。
    #   移行時、<main> だけをテンプレート化していたため丸ごと失われていた。
    #   ここで拾い直し、functions.php から出力する。
    STRUCTURED_HEALTHCLUB, STRUCTURED_FAQ = "", ""
    _idx = read("index.html")
    for _m in re.finditer(r'<script[^>]*application/ld\+json[^>]*>([\s\S]*?)</script>', _idx):
        try:
            _j = json.loads(_m.group(1))
        except Exception:
            die("index.html の構造化データ（JSON-LD）が壊れています。")
        _one = json.dumps(_j, ensure_ascii=False, separators=(',', ':'))
        if _j.get('@type') == 'HealthClub':
            STRUCTURED_HEALTHCLUB = _one
        elif _j.get('@type') == 'FAQPage':
            STRUCTURED_FAQ = _one
    if not STRUCTURED_HEALTHCLUB or not STRUCTURED_FAQ:
        die("index.html から構造化データ（HealthClub / FAQPage）を取り出せませんでした。\n"
            "  検索での見つかりやすさに関わるため、見つからない場合はビルドを止めています。")

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
  if      ( is_404() )                        {{ $css = 'generic'; }}
  elseif  ( is_front_page() )                 {{ $css = 'index'; }}
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
 * コラム一覧(/column/)から「お知らせ」カテゴリーを除外する。
 * devの news.html はコラムのみを並べているため、それに合わせる。
 * お知らせは /category/info/ で一覧表示される。
 *
 * ⚠ ignore_sticky_posts を必ず true にすること。
 *   WordPress は「先頭に固定表示」の投稿を、category__not_in を無視して
 *   ブログ先頭に差し込む仕様のため、これが無いと重要なお知らせが
 *   コラム一覧に混ざってしまう（実際に発生した）。
 */
function aspath_exclude_info_from_blog($q) {{
  if ( is_admin() || ! $q->is_main_query() ) return;
  if ( $q->is_home() ) {{
    $t = get_term_by('slug','info','category');
    if ( $t && ! is_wp_error($t) ) $q->set('category__not_in', array($t->term_id));
    $q->set('ignore_sticky_posts', true);
  }}
}}
add_action('pre_get_posts','aspath_exclude_info_from_blog');

/**
 * お知らせ一覧(/category/info/)では「重要（先頭に固定表示）」を先頭に並べ替える。
 * カテゴリーアーカイブには WordPress の固定表示が効かないため、表示直前に入れ替える。
 */
function aspath_sticky_first($posts, $q) {{
  if ( is_admin() || ! $q->is_main_query() ) return $posts;
  if ( ! $q->is_category('info') ) return $posts;
  $st = get_option('sticky_posts');
  if ( empty($st) || ! is_array($st) ) return $posts;
  $top = array(); $rest = array();
  foreach ( $posts as $p ) {{ if ( in_array($p->ID, $st) ) {{ $top[] = $p; }} else {{ $rest[] = $p; }} }}
  return array_merge($top, $rest);
}}
add_filter('the_posts','aspath_sticky_first',10,2);

function aspath_excerpt_length($l){{ return 60; }}
add_filter('excerpt_length','aspath_excerpt_length');

/**
 * サイト側（訪問者が見る画面）では、WordPressの編集バーを出さない。
 *
 * ログインしたまま見ると画面上部に黒い帯が出て、実際の見え方と変わってしまう。
 * 確認のたびにシークレットウィンドウを開いてもらうのは負担が大きいので、
 * サイト側では最初から出さないようにする。
 * 編集は管理画面（/wp-admin/）から行うので、これで困ることはない。
 *
 * ⚠ 元に戻したい場合は、この add_filter の行を消してテーマを作り直す。
 */
add_filter('show_admin_bar','__return_false');

/**
 * 記事見出しの「｜」の後ろで改行する。
 *
 * 「営業開始キャンペーン｜初回体験（40分）が…」のような見出しは、
 * 「｜」が意味の区切りなので、そこで折り返した方が読みやすい。
 * 使うのは記事ページの大見出しだけ。一覧やブラウザのタブ名は
 * 改行が入ると困るので、元のまま変えない。
 */
function aspath_title_break( $title ) {{
  $safe = esc_html( $title );
  return str_replace( '｜', '｜<br class="title-br">', $safe );
}}

/* ==================================================================
   検索対策（SEO）
   ------------------------------------------------------------------
   移行のときに、dev の <head> にあった構造化データが失われていた。
   また、テンプレートで作っている固定ページは本文が空のため、
   SEOプラグイン（SureRank）が説明文を作れず、検索結果に出る紹介文が
   空欄になっていた。この2つをテーマ側で埋める。

   ★ 二重出力を避けるしくみ
     SEOプラグインが説明文やOGP画像を出している場合は、こちらは何もしない。
     <head> の中身を一度ためて、無いものだけを足す方式にしている。
   ================================================================== */

/** ページごとの説明文（検索結果でタイトルの下に出る紹介文・80〜120字が目安） */
function aspath_seo_descriptions() {{
  return array(
    'column'    => 'パーキンソン病・脳卒中の症状や運動について、鹿児島のトレーニングスタジオASPATH（アスパス）が専門家の視点でお伝えするコラムです。ご自宅でできる運動もご紹介しています。',
    'info'      => 'ASPATH（アスパス）からのお知らせ一覧です。キャンペーン、講演・イベント、営業に関するご案内を掲載しています。',
    'access'    => 'ASPATH（アスパス）鹿児島スタジオへの行き方をご案内します。天文館・鹿児島中央町・城西の3カ所で実施しており、駐車場や最寄り駅からの経路を掲載しています。',
    'faq'       => '初回体験・料金・トレーニング内容について、よくいただくご質問にお答えします。パーキンソン病や脳卒中のご不安にも、専門スタッフがお応えします。',
    'privacy'   => 'ASPATH（アスパス）の個人情報の取り扱いについてご説明します。お預かりした情報は、ご相談とトレーニング運営以外の目的には使用いたしません。',
    'tokushoho' => 'ASPATH（アスパス）の特定商取引法に基づく表記です。販売事業者、料金、お支払い方法、キャンセルについて記載しています。',
    'sitemap'   => 'ASPATH（アスパス）のサイトマップです。サイト内の各ページへのリンクをまとめています。',
  );
}}

/** いま表示しているページの説明文を返す（無ければ空） */
function aspath_seo_current_description() {{
  $d = aspath_seo_descriptions();
  if ( is_home() || is_post_type_archive('post') )        return isset($d['column']) ? $d['column'] : '';
  if ( is_category() ) {{
    $slug = get_queried_object() ? get_queried_object()->slug : '';
    if ( isset($d[$slug]) ) return $d[$slug];
  }}
  if ( is_page() ) {{
    $slug = get_post_field('post_name', get_queried_object_id());
    if ( isset($d[$slug]) ) return $d[$slug];
  }}
  return '';
}}

/** SNSで共有したときのサムネイル（テーマに同梱しているので必ず存在する） */
function aspath_seo_share_image() {{
  return get_template_directory_uri() . '/images/ogp-share.jpg';
}}

/**
 * <head> を一度ためて、足りないものだけを補う。
 *
 * ・説明文が無ければ足す
 * ・SNS用の画像が無い、または他所のサイトを指している場合は自社の画像に差し替える
 *   （移行直後、LINEのボタン画像が共有サムネイルになっていた）
 */
function aspath_seo_start_buffer() {{ ob_start(); }}
add_action('wp_head', 'aspath_seo_start_buffer', 0);

function aspath_seo_flush_buffer() {{
  $head = ob_get_clean();

  // 1) 説明文
  if ( strpos($head, 'name="description"') === false ) {{
    $desc = aspath_seo_current_description();
    if ( $desc !== '' ) {{
      $head .= '<meta name="description" content="' . esc_attr($desc) . '">' . "\\n";
    }}
  }}

  // 2) SNS共有画像
  $home = wp_parse_url( home_url(), PHP_URL_HOST );
  $need = true;
  if ( preg_match('/property=["\\']og:image["\\'][^>]*content=["\\']([^"\\']+)/i', $head, $m) ) {{
    $host = wp_parse_url( $m[1], PHP_URL_HOST );
    if ( $host === $home ) {{
      $need = false;                       // 自サイトの画像なら触らない
    }} else {{
      // 他所のサイトを指している → 自社の画像に置き換える
      $head = str_replace( $m[1], aspath_seo_share_image(), $head );
      $need = false;
    }}
  }}
  if ( $need ) {{
    $head .= '<meta property="og:image" content="' . esc_url( aspath_seo_share_image() ) . '">' . "\\n"
           . '<meta property="og:image:width" content="1200">' . "\\n"
           . '<meta property="og:image:height" content="630">' . "\\n";
  }}

  echo $head;
}}
add_action('wp_head', 'aspath_seo_flush_buffer', 999);

/**
 * 構造化データ。
 * 検索エンジンに「何のお店か」を機械が読める形で伝える。
 * 地域＋症状での検索に効くため、移行前から用意してあったものを復活させる。
 */
function aspath_seo_structured_data() {{
  if ( is_front_page() ) {{
    echo '<script type="application/ld+json">' . "\\n"
       . '{STRUCTURED_HEALTHCLUB}' . "\\n"
       . '</script>' . "\\n";
  }}
  if ( is_page('faq') ) {{
    echo '<script type="application/ld+json">' . "\\n"
       . '{STRUCTURED_FAQ}' . "\\n"
       . '</script>' . "\\n";
  }}
}}
add_action('wp_head', 'aspath_seo_structured_data', 5);

/**
 * コメント1件の表示。
 * WordPress既定のマークアップは意匠に合わないため、自前で組み立てる。
 * comments.php の wp_list_comments() から呼ばれる。
 */
function aspath_comment_item($comment, $args, $depth) {{
  $tag = ( 'div' === $args['style'] ) ? 'div' : 'li';
  ?>
  <<?php echo $tag; ?> id="comment-<?php comment_ID(); ?>" <?php comment_class('comment'); ?>>
    <article class="comment-body" id="div-comment-<?php comment_ID(); ?>">
      <div class="ac-head">
        <?php if ( 0 != $args['avatar_size'] ) echo get_avatar( $comment, $args['avatar_size'] ); ?>
        <span class="ac-name"><?php echo get_comment_author_link( $comment ); ?></span>
        <?php if ( user_can( $comment->user_id, 'edit_posts' ) ) : ?>
          <span class="ac-badge">スタッフ</span>
        <?php endif; ?>
        <span class="ac-date"><?php echo get_comment_date( 'Y年n月j日', $comment ); ?></span>
      </div>

      <?php if ( '0' == $comment->comment_approved ) : ?>
        <p class="ac-pending">このコメントは承認待ちです。公開までしばらくお待ちください。</p>
      <?php endif; ?>

      <div class="ac-text"><?php comment_text(); ?></div>

      <div class="ac-actions">
        <?php
          comment_reply_link( array_merge( $args, array(
            'add_below' => 'div-comment',
            'depth'     => $depth,
            'max_depth' => $args['max_depth'],
            'reply_text'=> '返信する',
          ) ), $comment );
          edit_comment_link( '編集', ' <span class="ac-edit">', '</span>' );
        ?>
      </div>
    </article>
  <?php
  // 閉じタグは wp_list_comments が出力する
}}

/**
 * コメントの返信（スレッド）を動かすスクリプトを読み込む。
 * これが無いと「返信する」を押しても何も起きない。
 */
function aspath_comment_reply_script() {{
  if ( is_singular('post') && comments_open() && get_option('thread_comments') ) {{
    wp_enqueue_script('comment-reply');
  }}
}}
add_action('wp_enqueue_scripts','aspath_comment_reply_script');

/**
 * お知らせ一覧のURL。
 * 「お知らせ」はカテゴリー(slug: info)のアーカイブなので、実URLは環境により
 * /category/info/ だったり /info/ だったりする。WordPressに解決させて404を防ぐ。
 * カテゴリー未作成のときだけ /info/ にフォールバックする。
 */
if ( ! function_exists('aspath_info_url') ) {{
  function aspath_info_url() {{
    $t = get_term_by('slug','info','category');
    if ( $t && ! is_wp_error($t) ) {{
      $u = get_category_link($t);
      if ( $u ) return $u;
    }}
    return home_url('/info/');
  }}
}}
"""
    trial_block = ("""
/* ==================================================================
   初回体験 お申し込みフォーム

   テンプレート「初回体験フォーム（限定公開）」を適用した固定ページで動く。
   送信されると、次の順番で3つのことを行う。

     1. WordPress内に申込を保存  ← 最初にやる。メールが不達でも失わないため
     2. 山口様へ通知メール（全項目・申込者へ直接返信できる）
     3. 申込者へ控えメール（48時間以内にご連絡する旨を記載）

   ⚠ 通知先を変えるときは ASPATH_TRIAL_TO を書き換えてテーマを作り直します。

   ⚠ 本番先行設置プラグイン「ASPATH 初回体験フォーム」が有効な場合は、
      共通処理はプラグイン側が担当し、下のブロックは飛ばされます。
   ================================================================== */
"""
        + guard_trial_core(TRIAL_CORE_PHP, 'テーマ')
        + TRIAL_THEME_PHP)
    open(os.path.join(OUT,"functions.php"),"w",encoding="utf-8").write(functions_php + trial_block)

    # 固定ページ/TOPテンプレート
    def page_tpl(src, comment, kj=False, template_name=None):
        head = "<?php\n/** "+comment+" */\n"
        if template_name:
            head = "<?php\n/*\nTemplate Name: "+template_name+"\n*/\n/** "+comment+" */\n"

        if src in EDITABLE_PAGES:
            # 本文はWordPress側（固定ページの編集画面）で持つ。
            # 山口様がご自身で文章と写真を直せるようにするための切り替え。
            # ここに本文を書き戻すと、編集内容が毎回テーマで上書きされてしまうので
            # 絶対に戻さないこと。dev の %s は「元の姿の記録」として残してある。
            main_html = extract(read(src), r'<main[ >]', '</main>')
            head_block = re.search(r'<div class="page-head"[\s\S]*?</div>\s*(?=<div|<section)', main_html)
            page_head = clean(head_block.group(0), keep_jsonld=kj) if head_block else ''
            return (head
                + "/*  ⚠ 本文はWordPressの固定ページ編集画面が持っています。\n"
                  "    このファイルに本文を書き戻すと、山口様の編集が消えます。\n"
                  "    元の姿は dev の " + src + " に残してあります。 */\n"
                + "get_header(); ?>\n<main>\n" + page_head + "\n"
                + "  <?php while ( have_posts() ) : the_post(); the_content(); endwhile; ?>\n"
                + "</main>\n<?php get_footer(); ?>\n")

        main = clean(extract(read(src), r'<main[ >]', '</main>'), keep_jsonld=kj)
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
    te_main = wp_trial_form(te_main)
    open(os.path.join(OUT,"template-trial-entry.php"),"w",encoding="utf-8").write(
"""<?php
/*
Template Name: 初回体験フォーム（限定公開）
*/
/** 限定公開の初回体験申込フォーム。スラッグは自由（推測されにくい文字列を推奨）。
    dev の trial-entry.html のフォームを、WordPress上で実際に送信できる形に
    書き換えたもの。送信処理は functions.php の aspath_trial_handle()。
    noindex とサイトマップ除外も functions.php 側で自動的に行う。 */
get_header(); ?>
""" + te_main + "\n<?php get_footer(); ?>\n")

    # comments.php — 記事のコメント欄（WordPress標準機能をサイトの意匠で表示）
    comments_php = r'''<?php
/** comments.php — 記事のコメント欄（自動生成）
 *
 *  現行サイトのブログでコメントに反響があったため、新サイトのコラムでも
 *  同じようにコメントを受け付ける。WordPress標準のコメント機能を使い、
 *  見た目だけをサイトの意匠に合わせている。
 *
 *  ・入力項目は現行サイトと同じ（お名前・メール【公開されません】・本文）
 *  ・返信（スレッド）も現行サイトと同じように使える
 *  ・迷惑コメント対策は Akismet が担当
 *  ・「承認待ち」の状態も本人には見えるようにしている
 */
if ( post_password_required() ) return;
?>
<section class="aspath-comments" id="comments">

<?php if ( have_comments() ) : ?>
  <h2><?php
    $n = get_comments_number();
    echo ( $n == 1 ) ? 'コメント' : 'コメント（' . number_format_i18n($n) . '件）';
  ?></h2>
  <p class="ac-lead">記事へのご感想をいただきました。ありがとうございます。</p>

  <ol class="ac-list">
    <?php
      wp_list_comments(array(
        'style'       => 'ol',
        'short_ping'  => true,
        'avatar_size' => 44,
        'callback'    => 'aspath_comment_item',
      ));
    ?>
  </ol>

  <?php
    // ページ送り（コメントが多くなったとき）
    the_comments_pagination(array(
      'prev_text' => '← 前のコメント',
      'next_text' => '次のコメント →',
    ));
  ?>
<?php endif; ?>

<?php
  if ( ! comments_open() && get_comments_number() ) :
?>
  <p class="ac-closed">この記事へのコメントの受付は終了しました。</p>
<?php endif; ?>

<?php
  comment_form(array(
    'title_reply'          => have_comments() ? 'コメントを書く' : 'この記事にコメントする',
    'title_reply_to'       => '%s さんへ返信する',
    'cancel_reply_link'    => '返信をやめる',
    'label_submit'         => 'コメントを送信する',
    'class_submit'         => 'submit',
    'comment_notes_before' => '<p class="comment-notes">お気軽にご感想をお寄せください。'
        . 'メールアドレスが公開されることはありません。'
        . '<span class="required">*</span> の項目は入力が必要です。</p>',
    'comment_field'        => '<p class="comment-form-comment">'
        . '<label for="comment">コメント <span class="required">*</span></label>'
        . '<textarea id="comment" name="comment" rows="7" required></textarea></p>',
  ));
?>
</section>
'''
    open(os.path.join(OUT,"comments.php"),"w",encoding="utf-8").write(comments_php)

    # 動的テンプレート（コラム・一覧）
    single = """<?php
/** single.php — コラム/投稿記事（自動生成） */
get_header(); ?>
<main id="top" class="spine-page">
<?php while ( have_posts() ) : the_post(); ?>
  <section class="column-hero">
    <div class="wrap">
      <p class="column-crumb"><a href="<?php echo esc_url( home_url('/') ); ?>">TOP</a> ／ <a href="<?php echo esc_url( home_url('/column/') ); ?>">コラム</a> ／ <?php the_title(); ?></p>
      <h1><?php echo aspath_title_break( get_the_title() ); ?></h1>
      <?php if ( is_sticky( get_the_ID() ) ) : ?><p class="column-byline"><span class="imp-label">重要</span></p><?php endif; ?>
      <p class="column-byline">By ASPATH ／ <?php echo get_the_date(); ?></p>
    </div>
  </section>
  <article class="column-body">
    <div class="wrap">
      <?php if ( has_post_thumbnail() ) : ?><div class="column-eyecatch img-slot" style="--ratio:16/9;"><?php the_post_thumbnail('large'); ?></div><?php endif; ?>
      <?php the_content(); ?>
      <?php
        /* 記事末尾の共通CTA。
           dev の各コラムに入っていたものをテーマ側にまとめた。
           本文に書くと記事ごとに文言や見た目がずれるため、ここで1か所にする。 */
      ?>
      <div class="column-cta">
        <h3>まずは一度、お話を聞かせてください</h3>
        <p><span class="nw">初回体験</span>は期間限定 半額<span class="nw">4,400円</span>。<span class="nw">パーキンソン病</span>専門の<span class="nw">理学療法士</span>が、<br class="br-pc">あなたの状態と目標を丁寧に伺います。</p>
        <?php
          /* お問い合わせページはフォームを置かず公式LINE案内のみの設計なので、
             「フォームで問い合わせる」を挟むと遠回りになる。LINEボタン1本に統一。 */
        ?>
        <div class="cta-row cta-row--single">
          <a class="btn btn-line btn-line--wide" href="https://lin.ee/5kiH4i3" target="_blank" rel="noopener"><svg class="line-ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 5.79 2 10.46c0 4.19 3.57 7.7 8.4 8.36.33.07.77.22.88.5.1.26.07.66.03.92l-.14.86c-.04.26-.2 1.02.89.56 1.09-.47 5.87-3.46 8.01-5.92C21.6 14.06 22 12.33 22 10.46 22 5.79 17.52 2 12 2z"></path></svg><span class="nw">公式LINE</span>に登録する</a>
        </div>
        <p class="cta-note">ご登録後、トークにメッセージをお送りください。<br class="br-sp">スタンプ一つでも構いません。</p>
      </div>

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
  <?php
    // コメント欄。開いているか、既に投稿がある場合だけ出す
    if ( comments_open() || get_comments_number() ) comments_template();
  ?>
<?php endwhile; ?>
</main>
<?php get_footer(); ?>
"""
    home = """<?php
/** home.php — 投稿一覧（/column/＝コラム、/category/info/＝お知らせ・自動生成） */
get_header(); ?>
<?php
/* 見出しは文脈で切り替える。
   /column/        → コラム（お知らせカテゴリーは functions.php で除外）
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

    # 404.php — これが無いと WordPress は index.php を使い、
    # 「固定ページを作り忘れただけ」なのにコラム一覧が表示されて原因が分からなくなる
    notfound = """<?php
/** 404.php — ページが見つからないとき（自動生成） */
get_header(); ?>
<main>
  <div class="page-head"><div class="wrap">
    <p class="crumb"><a href="<?php echo esc_url( home_url('/') ); ?>">TOP</a> ／ ページが見つかりません</p>
    <h1 class="page-title">ページが見つかりません</h1>
  </div></div>
  <div class="wrap page-generic" style="padding:48px 0 72px; text-align:center;">
    <p style="font-size:17px; line-height:2; margin-bottom:28px;">
      お探しのページは移動または削除された可能性があります。<br class="br-pc">
      お手数ですが、下記からお進みください。
    </p>
    <p style="display:flex; gap:14px; justify-content:center; flex-wrap:wrap;">
      <a class="btn btn-ghost mid" href="<?php echo esc_url( home_url('/') ); ?>">TOPへ戻る<span class="arw">\u2192</span></a>
      <a class="btn btn-ghost mid" href="<?php echo esc_url( home_url('/column/') ); ?>">コラム一覧<span class="arw">\u2192</span></a>
      <a class="btn btn-ghost mid" href="<?php echo esc_url( home_url('/contact/') ); ?>">お問い合わせ<span class="arw">\u2192</span></a>
    </p>
  </div>
</main>
<?php get_footer(); ?>
"""
    open(os.path.join(OUT,"404.php"),"w",encoding="utf-8").write(notfound)


    # TOPのお知らせ枠を動的化：「先頭に固定表示（＝重要）」の投稿を優先して1件表示
    NOTICE_LOOP = """<?php
  /* TOPのお知らせ枠：最新2件。「先頭に固定表示（＝重要）」の投稿を優先して先に出す */
  $aspath_n   = 2;
  $aspath_ids = array();
  $aspath_st  = get_option('sticky_posts');
  if ( ! empty($aspath_st) ) {
    $aspath_s = get_posts(array('post__in'=>$aspath_st,'category_name'=>'info',
      'numberposts'=>$aspath_n,'ignore_sticky_posts'=>true,'post_status'=>'publish'));
    foreach ( $aspath_s as $aspath_p ) { $aspath_ids[] = $aspath_p->ID; }
  }
  if ( count($aspath_ids) < $aspath_n ) {
    $aspath_r = get_posts(array('category_name'=>'info','numberposts'=>$aspath_n - count($aspath_ids),
      'post__not_in'=>$aspath_ids,'ignore_sticky_posts'=>true,'post_status'=>'publish'));
    foreach ( $aspath_r as $aspath_p ) { $aspath_ids[] = $aspath_p->ID; }
  }
  $aspath_q = $aspath_ids
    ? new WP_Query(array('post__in'=>$aspath_ids,'orderby'=>'post__in',
        'posts_per_page'=>$aspath_n,'ignore_sticky_posts'=>true))
    : new WP_Query(array('post__in'=>array(0)));
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

    # TOPのコラム欄も動的化：最新のコラム2件（お知らせカテゴリーは除外）
    COLUMN_LOOP = """<?php
  $aspath_ci = get_term_by('slug','info','category');
  $aspath_ca = array('posts_per_page'=>2,'ignore_sticky_posts'=>true);
  if ( $aspath_ci && ! is_wp_error($aspath_ci) ) $aspath_ca['category__not_in'] = array($aspath_ci->term_id);
  $aspath_cq = new WP_Query($aspath_ca);
  if ( $aspath_cq->have_posts() ) : while ( $aspath_cq->have_posts() ) : $aspath_cq->the_post(); ?>
          <a class="col-card" href="<?php the_permalink(); ?>">
            <div class="img-slot col-thumb" role="img" aria-label="<?php the_title_attribute(); ?>">
              <?php if ( has_post_thumbnail() ) the_post_thumbnail('medium', array('style'=>'--fit:cover; --pos:50% 50%;')); ?>
            </div>
            <div class="col-body">
              <div class="col-meta"><time datetime="<?php echo get_the_date('Y-m-d'); ?>"><?php echo get_the_date('Y.m.d'); ?></time><span class="tag-col">コラム</span></div>
              <b><?php the_title(); ?></b>
              <p class="col-excerpt"><?php echo esc_html( get_the_excerpt() ); ?></p>
            </div>
          </a>
  <?php endwhile; wp_reset_postdata(); endif; ?>
"""
    _s = open(fp,encoding="utf-8").read()
    _m2 = re.search(r'(<div class="column-list" id="columnList"[^>]*>)([\s\S]*?)(</div>\s*<div class="more-wrap">)', _s)
    if _m2:
        _s = _s[:_m2.start(2)] + "\n" + COLUMN_LOOP + "        " + _s[_m2.end(2):]
        open(fp,"w",encoding="utf-8").write(_s)
        print("  ↳ front-page.php: TOPのコラム欄を動的化（最新1件・お知らせは除外）")
    else:
        print("  ! front-page.php: コラム欄の差し替え位置が見つからず（要確認）")

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
