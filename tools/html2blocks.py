# -*- coding: utf-8 -*-
"""dev の固定ページHTMLを、WordPressのブロック（Gutenberg）形式に変換する。

なぜ必要か
----------
このサイトの固定ページは、これまでテーマの中にHTMLとして埋め込まれていた。
そのため山口様がWordPressの編集画面から直せず、引継ぎの妨げになっていた。
文章と写真だけはWordPress側で直せるようにするため、HTMLをブロックに置き換える。

方針（見た目を完全に維持する）
------------------------------
・見出し・段落・囲み枠 … ブロックにする（＝山口様が直せる）
・図・装飾・特殊レイアウト … カスタムHTMLブロックのまま（＝触らない／崩れない）
  そのままのHTMLが出力されるので、見た目は1pxも変わらない。

使い方
------
    python tools/html2blocks.py about.html > 貼り付け用.txt
"""
import re, sys, html

# テーマ内の画像を指す実URL（WordPressの本文にPHPは書けないため絶対URLにする）
IMG_BASE = 'https://aspath-life.com/wp-content/themes/aspath/images/'

# ブロックにしてよい囲み枠（CSSが display:flex / grid ではないもの）
GROUP_OK = {
    'tr-chapter', 'tr-core-card', 'origin-explain', 'tr-closing',
    'page-wrap', 'page-main', 'tr-sec', 'wrap', 'tr-pillars',
}
# 中身をそのまま残す（装飾・図・特殊レイアウト）
KEEP_HTML = {
    'origin-hero', 'svc-list', 'tr-hero', 'tr-pillars', 'tr-cores-fig',
    'tr-closefig', 'img-slot', 'tcf-inner', 'side-toc', 'cta-row', 'cta-band',
}

def cls_of(tag_html):
    m = re.search(r'class="([^"]*)"', tag_html)
    return m.group(1).split() if m else []

def esc_attr(s):
    return s.replace('\\', '\\\\').replace('"', '\\"')


class Node:
    def __init__(self, tag, attrs='', children=None, text=None):
        self.tag, self.attrs = tag, attrs
        self.children = children or []
        self.text = text

VOID = {'img','br','hr','input','meta','link','source','area','col','embed'}

def parse(src):
    """必要十分な範囲のHTMLパーサ。属性値の中の > も正しく扱う。"""
    pos, stack, root = 0, [], Node('#root')
    stack.append(root)
    tag_re = re.compile(r'<(/?)([A-Za-z][\w-]*)((?:"[^"]*"|\'[^\']*\'|[^>])*?)(/?)>')
    for m in tag_re.finditer(src):
        text = src[pos:m.start()]
        if text.strip():
            stack[-1].children.append(Node('#text', text=text))
        pos = m.end()
        close, tag, attrs, selfclose = m.group(1), m.group(2).lower(), m.group(3), m.group(4)
        if close:
            for i in range(len(stack)-1, 0, -1):
                if stack[i].tag == tag:
                    del stack[i:]
                    break
        elif tag in VOID or selfclose:
            stack[-1].children.append(Node(tag, attrs))
        else:
            n = Node(tag, attrs)
            stack[-1].children.append(n)
            stack.append(n)
    tail = src[pos:]
    if tail.strip():
        stack[-1].children.append(Node('#text', text=tail))
    return root

def render(node):
    """ノードを元のHTMLに戻す（カスタムHTMLブロック用）。"""
    if node.tag == '#text':
        return node.text
    if node.tag == '#root':
        return ''.join(render(c) for c in node.children)
    if node.tag in VOID:
        return f'<{node.tag}{node.attrs}>'
    inner = ''.join(render(c) for c in node.children)
    return f'<{node.tag}{node.attrs}>{inner}</{node.tag}>'

def inner_html(node):
    return ''.join(render(c) for c in node.children)


def wrap_lang(node):
    """日英切替用の data-en / data-en-html を、内側の span に移す。

    WordPressのブロックは、段落や見出しのタグに見慣れない属性が付いていると
    「このブロックには問題があります」と警告を出してしまう。
    属性を内側の span に移せば警告は出ず、切替の動きも変わらない
    （切替スクリプトは [data-en] を持つ要素を探して中身を入れ替えるだけのため）。
    """
    inner = inner_html(node).strip()
    keep = []
    for name in ('data-en', 'data-en-html'):
        m = re.search(r'\b%s="((?:[^"\\]|\\.)*)"' % name, node.attrs)
        if m:
            keep.append('%s="%s"' % (name, m.group(1)))
    if not keep:
        return inner
    return '<span %s>%s</span>' % (' '.join(keep), inner)


def to_blocks(node, depth=0):
    out = []
    for c in node.children:
        if c.tag == '#text':
            if c.text.strip():
                out.append('<!-- wp:html -->%s<!-- /wp:html -->' % c.text.strip())
            continue
        classes = cls_of(c.attrs)
        # --- 装飾・図はそのまま ---
        if any(k in KEEP_HTML for k in classes) or c.tag in ('figure','ul','ol','table','svg','picture','iframe'):
            out.append('<!-- wp:html -->\n%s\n<!-- /wp:html -->' % render(c).strip())
            continue
        # --- 見出し ---
        if re.fullmatch(r'h[1-6]', c.tag):
            lv = int(c.tag[1])
            attr = {'level': lv}
            if classes:
                attr['className'] = ' '.join(classes)
            anchor = re.search(r'\bid="([^"]*)"', c.attrs)
            if anchor:
                attr['anchor'] = anchor.group(1)
            cl = ('wp-block-heading ' + ' '.join(classes)).strip()
            open_tag = '<%s class="%s"%s>' % (
                c.tag, cl, (' id="%s"' % anchor.group(1)) if anchor else '')
            out.append('<!-- wp:heading %s -->\n%s%s</%s>\n<!-- /wp:heading -->'
                       % (json_attr(attr), open_tag, wrap_lang(c), c.tag))
            continue
        # --- 段落 ---
        if c.tag == 'p':
            attr = {}
            if classes:
                attr['className'] = ' '.join(classes)
            style = re.search(r'style="([^"]*)"', c.attrs)
            cl = ' '.join(classes)
            open_tag = '<p%s%s>' % ((' class="%s"' % cl) if cl else '',
                                    (' style="%s"' % style.group(1)) if style else '')
            out.append('<!-- wp:paragraph %s -->\n%s%s</p>\n<!-- /wp:paragraph -->'
                       % (json_attr(attr), open_tag, wrap_lang(c)))
            continue
        # --- 囲み枠 ---
        if c.tag in ('div','section') and any(k in GROUP_OK for k in classes):
            attr = {'className': ' '.join(classes)}
            if c.tag != 'div':
                attr['tagName'] = c.tag
            anchor = re.search(r'\bid="([^"]*)"', c.attrs)
            if anchor:
                attr['anchor'] = anchor.group(1)
            body = to_blocks(c, depth+1)
            open_tag = '<%s class="wp-block-group %s"%s>' % (
                c.tag, ' '.join(classes), (' id="%s"' % anchor.group(1)) if anchor else '')
            out.append('<!-- wp:group %s -->\n%s\n%s\n</%s>\n<!-- /wp:group -->'
                       % (json_attr(attr), open_tag, '\n'.join(body), c.tag))
            continue
        # --- それ以外はそのまま ---
        out.append('<!-- wp:html -->\n%s\n<!-- /wp:html -->' % render(c).strip())
    return out

def json_attr(d):
    if not d: return ''
    items = []
    for k, v in d.items():
        items.append('"%s":%s' % (k, v if isinstance(v, int) else '"%s"' % esc_attr(str(v))))
    return '{%s}' % ','.join(items)


def convert(path):
    src = open(path, encoding='utf-8').read()
    m = re.search(r'<main[^>]*>([\s\S]*?)</main>', src)
    if not m:
        sys.exit('<main> が見つかりません: %s' % path)
    body = m.group(1)
    # ページ見出し（パンくず・h1）はテンプレート側が出すので content からは除く
    body = re.sub(r'<div class="page-head"[\s\S]*?</div>\s*(?=<div class="page-wrap")', '', body, count=1)
    # 画像パスをWordPressの実URLに寄せる（テーマのimagesを参照）
    body = body.replace('src="images/', 'src="' + IMG_BASE)
    root = parse(body)
    return '\n\n'.join(to_blocks(root))


if __name__ == '__main__':
    print(convert(sys.argv[1]))
