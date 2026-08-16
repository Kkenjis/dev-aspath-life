# -*- coding: utf-8 -*-
"""dev のコラムHTML → WordPress（Gutenberg）ブロック形式へ変換"""
import re, os, html

BASE = "https://aspath-life.com/development/wp-content/uploads/2026/08/"

def strip_inline(t):
    """本文中の装飾spanなどを外し、strong/em/aだけ残す"""
    t = re.sub(r'<span class="nw">([\s\S]*?)</span>', r'\1', t)
    t = re.sub(r'<span class="h3-num">([\s\S]*?)</span>\s*', r'\1 ', t)
    t = re.sub(r'<span class="h3-step">([\s\S]*?)</span>\s*', r'\1 ', t)
    t = re.sub(r'<span class="arw">[\s\S]*?</span>', '', t)
    t = re.sub(r'<svg[\s\S]*?</svg>', '', t)
    t = re.sub(r'<br class="br-pc">', ' ', t)   # PC専用改行は詰める
    t = re.sub(r'<br\s*/?>', '<br>', t)
    t = re.sub(r'<span[^>]*>', '', t); t = t.replace('</span>','')
    t = re.sub(r'\s+', ' ', t)
    return t.strip()

def blocks_from(path):
    src = open(path, encoding='utf-8').read()
    m = re.search(r'<article class="column-body"[\s\S]*?</article>', src)
    body = m.group(0)
    # CTA と 記事ナビはテーマ側が出すので本文からは外す
    body = re.sub(r'<div class="column-cta"[\s\S]*?</div>\s*</div>', '', body)
    body = re.sub(r'<div class="column-cta"[\s\S]*?</div>', '', body)
    body = re.sub(r'<nav class="column-nav"[\s\S]*?</nav>', '', body)

    out, imgs = [], []
    pat = re.compile(
        r'<h2[^>]*>([\s\S]*?)</h2>'
        r'|<h3[^>]*>([\s\S]*?)</h3>'
        r'|<div class="column-callout"[^>]*>([\s\S]*?)</div>'
        r'|<figure class="column-figure"[^>]*>([\s\S]*?)</figure>'
        r'|<ul[^>]*>([\s\S]*?)</ul>'
        r'|<p(?![^>]*class="column-crumb")[^>]*>([\s\S]*?)</p>')
    for mm in pat.finditer(body):
        h2, h3, call, fig, ul, p = mm.groups()
        if h2 is not None:
            out.append('<!-- wp:heading -->\n<h2 class="wp-block-heading">%s</h2>\n<!-- /wp:heading -->' % strip_inline(h2))
        elif h3 is not None:
            out.append('<!-- wp:heading {"level":3} -->\n<h3 class="wp-block-heading">%s</h3>\n<!-- /wp:heading -->' % strip_inline(h3))
        elif call is not None:
            inner = strip_inline(call)
            paras = [x.strip() for x in inner.split('<br><br>') if x.strip()]
            inner_blocks = '\n\n'.join(
                '<!-- wp:paragraph -->\n<p>%s</p>\n<!-- /wp:paragraph -->' % x for x in paras)
            out.append('<!-- wp:quote -->\n<blockquote class="wp-block-quote">%s</blockquote>\n<!-- /wp:quote -->' % inner_blocks)
        elif fig is not None:
            im = re.search(r'src="images/([^"]+)"', fig)
            alt = re.search(r'alt="([^"]*)"', fig)
            cap = re.search(r'<figcaption[^>]*>([\s\S]*?)</figcaption>', fig)
            if not im: continue
            f = im.group(1); imgs.append(f)
            a = html.escape(alt.group(1)) if alt else ''
            capb = '<figcaption class="wp-element-caption">%s</figcaption>' % strip_inline(cap.group(1)) if cap else ''
            out.append('<!-- wp:image {"sizeSlug":"large"} -->\n'
                       '<figure class="wp-block-image size-large">'
                       '<img src="%s%s" alt="%s"/>%s</figure>\n<!-- /wp:image -->' % (BASE, f, a, capb))
        elif ul is not None:
            lis = re.findall(r'<li[^>]*>([\s\S]*?)</li>', ul)
            items = '\n\n'.join('<!-- wp:list-item -->\n<li>%s</li>\n<!-- /wp:list-item -->' % strip_inline(x) for x in lis)
            out.append('<!-- wp:list -->\n<ul class="wp-block-list">%s</ul>\n<!-- /wp:list -->' % items)
        elif p is not None:
            t = strip_inline(p)
            if not t or t.startswith('By ASPATH'): continue
            out.append('<!-- wp:paragraph -->\n<p>%s</p>\n<!-- /wp:paragraph -->' % t)
    return '\n\n'.join(out), imgs

TARGETS = {
    'taimentraining.html':  ('アスパススタジオでの対面トレーニング', 'taimentraining'),
    'onlineaspath.html':    ('アスパスのオンライントレーニングがおすすめ！', 'onlineaspath'),
    'column-parkinson.html':('パーキンソン病とアスパスの歩み方', 'column-parkinson'),
}
os.makedirs('_wp移行素材/★コラム本文_貼り付け用', exist_ok=True)
for f,(title,key) in TARGETS.items():
    body, imgs = blocks_from(f)
    dst = '_wp移行素材/★コラム本文_貼り付け用/%s.html' % key
    open(dst,'w',encoding='utf-8').write(body)
    n_h2 = body.count('wp:heading -->'); n_h3 = body.count('"level":3'); 
    print(f'{key:18} 見出し2={body.count("<h2")} 見出し3={body.count("<h3")} 段落={body.count("wp:paragraph")//2} リスト={body.count("wp:list -->")} 引用={body.count("wp:quote")//2} 画像={len(imgs)}  → {dst}')
