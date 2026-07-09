# ASPATH（アスパス）Web サイト

鹿児島のパーキンソン病・脳卒中専門トレーニングスタジオ ASPATH の公式サイト（静的HTML・全16ページ構成）。

## 構成
- 単一HTMLファイル方式（CSS/JS/画像base64を各ファイルに内包）
- トップ: `index.html`
- 問い合わせ: `contact.html`（Netlify Forms 対応 / `data-netlify="true"`）

## デプロイ（Netlify 推奨）
1. このリポジトリ（Private可）を GitHub に push。
2. Netlify → Add new site → Import from GitHub → 本リポジトリを選択。
3. Build command: なし ／ Publish directory: `.`（ルート）。
4. 発行される `〇〇.netlify.app` が確認用URL。必要なら Site settings → Password protection で限定公開に。
5. フォームは `data-netlify="true"` により自動検出。送信後 Netlify → Forms で確認。

## 未収録・要同梱
- `column-parkinson.html` / `column-stroke.html`（前セッション作成済みのコラム2ページ）をリポジトリに追加してください。フッター等から参照しています。

## 公開前の残タスク
- YouTube / Facebook の公式URL確定後、各ページの該当リンク（現在 `#`）を差し替え。
- アクセスページの実写真（天文館・鹿児島中央駅）差し込み。
- 代表写真（staff.html）のスマホ表示確認。
