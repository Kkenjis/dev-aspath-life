# -*- coding: utf-8 -*-
"""本番先行設置用プラグイン「ASPATH 初回体験フォーム」を生成する。

なぜ必要か
    公式LINEに載せるURLは、最初から本番のURLであるべきです。
    しかしサイト全体の切り替え（フェーズ9）は9月なので、それまで本番の
    見た目は旧テーマのままにしておきたい。
    そこで「フォームのページだけ」を本番に先行設置します。

このプラグインの特徴
    ・旧テーマのままで動く（テーマに一切依存しない自己完結ページを出力）
    ・固定ページを作らない。URLを直接受け取るので、管理画面の一覧にも出ない
    ・9月にテーマを切り替えても、このプラグインが有効なら挙動は変わらない
      （＝LINEのURLを二度と触らなくてよい）
    ・停止すればURLは404に戻るだけ。本番に痕跡が残らない

前提
    build_wp_theme.py を先に実行しておくこと。
    （生成済みの template-trial-entry.php と trial-entry.css を材料にするため、
      フォームの中身がテーマ版と食い違うことがありません）

使い方
    python build_trial_plugin.py
        → _wp移行素材/aspath-trial-form.zip
"""
import os, re, io, sys, zipfile, datetime, shutil

HERE     = os.path.dirname(os.path.abspath(__file__))
THEMEZIP = os.path.join(HERE, '_wp移行素材', 'aspath-theme.zip')
OUTZIP   = os.path.join(HERE, '_wp移行素材', 'aspath-trial-form.zip')
BUILD    = os.path.join(HERE, '_wp移行素材', '_plugin_build')

SLUG    = 'taiken-2026as9y'          # 本番でのURL：https://aspath-life.com/<SLUG>/
VERSION = '1.0.' + datetime.datetime.now().strftime('%Y%m%d.%H%M')
FONTS   = ("https://fonts.googleapis.com/css2?family=Kiwi+Maru:wght@400;500"
           "&family=Zen+Maru+Gothic:wght@500;700"
           "&family=Zen+Kaku+Gothic+New:wght@500;700;900"
           "&family=Shippori+Mincho+B1:wght@600;700;800"
           "&family=Noto+Sans+JP:wght@400;500;700&display=swap")


def die(msg):
    print('\n[エラー] ' + msg)
    print('先に「テーマを作る.ps1」または python build_wp_theme.py を実行してください。')
    sys.exit(1)


# ---------------------------------------------------------------- 材料の取り出し
if not os.path.exists(THEMEZIP):
    die('aspath-theme.zip が見つかりません。')

z = zipfile.ZipFile(THEMEZIP)
try:
    tpl = z.read('aspath/template-trial-entry.php').decode('utf-8')
    css = z.read('aspath/css/trial-entry.css').decode('utf-8')
    logo = z.read('aspath/images/logo-aspath.webp')
    fnc = z.read('aspath/functions.php').decode('utf-8')
except KeyError as e:
    die('テーマzipの中に %s がありません。' % e)

# 共通処理（ガードで包まれたブロック）をテーマのfunctions.phpから丸ごと取り出す。
# これでプラグインとテーマのロジックが絶対にずれません。
m = re.search(r"/\* ===== ASPATH_TRIAL_CORE ここから =====[\s\S]*?"
              r"ASPATH_TRIAL_CORE ここまで ===== \*/\n", fnc)
if not m:
    die('functions.php から共通処理ブロックを取り出せませんでした。')
core = m.group(0).replace("define('ASPATH_TRIAL_CORE', 'テーマ');",
                          "define('ASPATH_TRIAL_CORE', 'プラグイン');")
core = core.replace('共通処理。テーマ 側で読み込む。', '共通処理。プラグイン 側で読み込む。')

# 取り出せた中身が本物か確かめる（切り出しミスで空同然になる事故を防ぐ）
for must in ('function aspath_trial_process', 'register_post_type',
             'function aspath_trial_fields', 'function aspath_trial_notice'):
    if must not in core:
        die('共通処理の切り出しが不完全です（%s が含まれていません）。' % must)
if core.count('wp_mail(') != 2:
    die('共通処理の中の wp_mail が2回ではありません（%d回）。' % core.count('wp_mail('))
print('  共通処理を切り出しました : %d行 / wp_mail 2回 / 関数 %d個'
      % (core.count('\n'), core.count('\nfunction ')))

# 定数もテーマ版と同じものを使う
m2 = re.search(r"if \( ! defined\('ASPATH_TRIAL_TO'\)[^\n]*\n", fnc)
if not m2:
    die('ASPATH_TRIAL_TO の定義が見つかりませんでした。')

# ---------------------------------------------------------------- フォーム本体
# テンプレートから <main>〜</main> だけを取り出す（get_header/get_footer は使わない）
mm = re.search(r'<main[\s\S]*</main>', tpl)
if not mm:
    die('template-trial-entry.php からフォーム部分を取り出せませんでした。')
form = mm.group(0)

# ロゴはプラグイン内のファイルを指す
form = form.replace(
    "<?php echo get_template_directory_uri(); ?>/images/logo-aspath.webp",
    "<?php echo esc_url( plugins_url('assets/logo-aspath.webp', __FILE__) ); ?>")

# 送信先は「このURL自身」。get_permalink() は固定ページ用なので置き換える
form = form.replace(
    "<?php echo esc_url( get_permalink() ); ?>#aspath-form",
    "<?php echo esc_url( aspath_trial_plugin_url() ); ?>#aspath-form")

# プライバシーポリシーは、本番に公開ページがある場合だけリンクにする
form = form.replace(
    '<a href="<?php echo esc_url( home_url(\'/privacy/\') ); ?>" data-en="Privacy Policy">プライバシーポリシー</a>',
    '<?php echo aspath_trial_privacy_link(); ?>')

for bad in ('get_template_directory_uri', 'get_permalink', 'get_header', 'get_footer'):
    if bad in form:
        die('フォーム内にテーマ依存の記述（%s）が残っています。'
            'build_wp_theme.py 側の変更を確認してください。' % bad)

# ---------------------------------------------------------------- プラグイン本体
plugin = '''<?php
/**
 * Plugin Name: ASPATH 初回体験フォーム
 * Description: 初回体験お申し込みフォームを %(slug)s のURLで公開します。テーマに依存せず、旧デザインのままでも動きます。停止するとURLは404に戻ります。
 * Version:     %(ver)s
 * Author:      ASPATH
 */

/* ==================================================================
   ASPATH 初回体験フォーム（本番先行設置用）

   公開URL : https://<サイト>/%(slug)s/
   固定ページは作りません。上のURLを直接受け取って、テーマを介さずに
   フォームのページを出力します。だから旧テーマのままでも見た目が崩れません。

   送信されると次の順番で3つのことを行います。
     1. WordPress内に申込を保存  ← 最初にやる。メールが不達でも失わないため
     2. 山口様へ通知メール（全項目・申込者へ直接返信できる）
     3. 申込者へ控えメール（48時間以内にご連絡する旨を記載）

   申込は 管理画面 → 「初回体験の申込」 で確認できます。

   ⚠ 通知先を変えるときは、下の ASPATH_TRIAL_TO を書き換えてください。
   ⚠ URLを変えるときは ASPATH_TRIAL_SLUG を書き換え、
      「設定 → パーマリンク」を一度開いて保存してください（URLの再登録）。
   ================================================================== */

if ( ! defined('ABSPATH') ) exit;

%(to)sif ( ! defined('ASPATH_TRIAL_SLUG') ) define('ASPATH_TRIAL_SLUG', '%(slug)s');

%(core)s

/* ---------- URLの登録 ------------------------------------------------ */

/** このフォームのURL */
function aspath_trial_plugin_url() {
  return home_url( '/' . ASPATH_TRIAL_SLUG . '/' );
}

/** %(slug)s というURLを受け取れるようにする */
function aspath_trial_plugin_rewrite() {
  add_rewrite_rule( '^' . ASPATH_TRIAL_SLUG . '/?$', 'index.php?aspath_trial_form=1', 'top' );
}
add_action('init','aspath_trial_plugin_rewrite');

function aspath_trial_plugin_qv( $vars ) {
  $vars[] = 'aspath_trial_form';
  return $vars;
}
add_filter('query_vars','aspath_trial_plugin_qv');

/** 有効化・停止のときにURLの登録を作り直す */
function aspath_trial_plugin_activate() {
  aspath_trial_plugin_rewrite();
  flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'aspath_trial_plugin_activate');
register_deactivation_hook(__FILE__, 'flush_rewrite_rules');

/* ---------- プライバシーポリシーのリンク ------------------------------ */

/**
 * 本番に公開済みのプライバシーポリシーがあればリンクにする。
 * まだ無い（下書きのまま）ときはリンクにせず、文字だけ出す。
 * リンク切れをお客様に見せないための処理。
 */
function aspath_trial_privacy_link() {
  $page = get_page_by_path('privacy');
  if ( $page && $page->post_status === 'publish' ) {
    return '<a href="' . esc_url( get_permalink($page) ) . '">プライバシーポリシー</a>';
  }
  $pid = (int) get_option('wp_page_for_privacy_policy');
  if ( $pid && get_post_status($pid) === 'publish' ) {
    return '<a href="' . esc_url( get_permalink($pid) ) . '">プライバシーポリシー</a>';
  }
  return 'プライバシーポリシー';
}

/* ---------- ページの出力 --------------------------------------------- */

function aspath_trial_plugin_render() {
  if ( ! get_query_var('aspath_trial_form') ) return;

  /* このURLに対応する投稿は存在しないので、WordPressは先に「404」と判断して
     いる。そのままだとステータス404が返り、検索エンジンやキャッシュ、
     他プラグインが「無いページ」として扱ってしまう。ここで打ち消す。 */
  global $wp_query;
  if ( isset($wp_query) ) {
    $wp_query->is_404  = false;
    $wp_query->is_home = false;
  }

  // キャッシュ禁止。古いnonceが配られると「送信が無効」になるため
  if ( ! defined('DONOTCACHEPAGE') ) define('DONOTCACHEPAGE', true);
  nocache_headers();
  header('X-Robots-Tag: noindex, nofollow, noarchive', true);

  // 送信処理（判定はここ、処理は共通関数）
  if ( ! empty($_POST) ) aspath_trial_process();

  status_header(200);
  $css = plugins_url('assets/trial.css', __FILE__);
?><!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="<?php bloginfo('charset'); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex,nofollow,noarchive">
<title>初回体験 お申し込みフォーム｜ASPATH（アスパス）</title>
<link rel="preconnect" href="https://fonts.googleapis.com/">
<link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin>
<link href="%(fonts)s" rel="stylesheet">
<link href="<?php echo esc_url($css); ?>" rel="stylesheet">
</head>
<body class="aspath-trial-standalone">
%(form)s
</body>
</html>
<?php
  exit;
}
add_action('template_redirect','aspath_trial_plugin_render', 1);
''' % {
    'slug':  SLUG,
    'ver':   VERSION,
    'to':    m2.group(0),
    'core':  core,
    'form':  form,
    'fonts': FONTS,
}

# ---------------------------------------------------------------- 書き出し
if os.path.exists(BUILD):
    shutil.rmtree(BUILD)
root = os.path.join(BUILD, 'aspath-trial-form')
os.makedirs(os.path.join(root, 'assets'))

open(os.path.join(root, 'aspath-trial-form.php'), 'w', encoding='utf-8').write(plugin)
open(os.path.join(root, 'assets', 'trial.css'), 'w', encoding='utf-8').write(css)
open(os.path.join(root, 'assets', 'logo-aspath.webp'), 'wb').write(logo)

with zipfile.ZipFile(OUTZIP, 'w', zipfile.ZIP_DEFLATED) as out:
    for base, _dirs, files in os.walk(BUILD):
        for fn in files:
            full = os.path.join(base, fn)
            out.write(full, os.path.relpath(full, BUILD))

kb = os.path.getsize(OUTZIP) // 1024
print('✓ プラグイン生成完了  v' + VERSION)
print('  公開URL : https://aspath-life.com/%s/' % SLUG)
print('  ファイル: PHP 1 / CSS 1 / 画像 1   zip:%dKB' % kb)
print('  → ' + OUTZIP)
