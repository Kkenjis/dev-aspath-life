# ASPATH（アスパス）公式サイト — 単一HTMLファイル版

各ページが CSS・JavaScript・画像（base64）をすべて内包した「単一HTMLファイル」構成です。
外部フォルダに依存しないため、アップロードや移動でレイアウトが崩れません。

## 公開方法（GitHub Pages）
1. すべての `.html` をリポジトリ直下にそのまま置く（assets等のフォルダは不要）。
2. Settings → Pages → Branch: `main` / `/(root)`。
3. `https://<ユーザー>.github.io/<リポジトリ>/` で公開。index.html がトップ。

## ページ一覧（全16）
index / about / staff / news / news-detail / price / access / faq / contact /
english / privacy / tokushoho / sitemap / 404 / column-parkinson / column-stroke

## メモ
- コラム2ページ（パーキンソン病とは／脳卒中とは）を単一HTMLで追加済み。
- お問い合わせフォームの「送信」は GitHub Pages では動作しません（Netlify か PHP/WP が必要）。
  ※ Netlify で公開すれば contact.html はそのまま送信可能（Netlify Forms対応）。
- YouTube / Facebook / ブログのリンクは未設定（押しても遷移しないよう無効化）。
- 存在しないURLは 404.html に着地。
- ローディング画面はトップの初回訪問のみ表示（再確認は末尾に `?intro`）。

## 公開後の残タスク
- YouTube / Facebook / ブログの公式URL確定後にリンク差し替え。
- 本番公開時は各HTMLの `<meta robots>` noindex を外し、canonical を実URLに。
- アクセスページの実写真、代表写真のスマホ表示確認。
