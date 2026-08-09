# サブ機セットアップ手順（Git／2台運用）

作成日：2026年8月9日

メイン機と同じように、サブ機からも `dev-aspath-life` にコミット・プッシュできるようにする手順です。

| 項目 | 内容 |
|---|---|
| リポジトリ | `https://github.com/Kkenjis/dev-aspath-life` |
| ブランチ | `main` |
| 現在の最新 | `98db082`（**メイン機・GitHub 双方とも同期済み**） |

---

## 1. GitHub Desktop を入れる（推奨）

コマンドを覚えなくて済むので、こちらが確実です。

1. サブ機で [desktop.github.com](https://desktop.github.com/) を開き、GitHub Desktop をダウンロード・インストール
2. 起動 → **Sign in to GitHub.com** → ブラウザが開くので `Kkenjis` のアカウントでログイン
   - ※メイン機と同じアカウントを使ってください。別アカウントの場合は、リポジトリの Settings → Collaborators から招待が必要です
3. ログイン後、**File → Clone repository** → 一覧から `Kkenjis/dev-aspath-life` を選択
4. **Local path** に保存先を指定して **Clone**
   - 例：`C:\Users\<ユーザー名>\Documents\dev-aspath-life`
   - **フォルダ名やパスはメイン機と違っていても問題ありません**

これで完了です。パスワードやトークンの設定は不要です。

---

## 2. Cowork にフォルダを認識させる

クローンしたフォルダを、Cowork の**フォルダ選択**で指定してください。
以降はメイン機と同じように、こちらでコミットまで行えます。

---

## 3. 毎回の作業の流れ（2台運用のルール）

**これだけは守ってください。**

```
① 作業を始める前に  →  Fetch origin →  Pull origin
② 作業する（Cowork で編集・コミット）
③ 作業を終えたら    →  Push origin
```

GitHub Desktop では、左上のボタンが状況に応じて
`Fetch origin` / `Pull origin` / `Push origin` と切り替わります。表示どおりに押せばOKです。

### なぜ必要か

同じファイルを2台で同時に編集すると、**コンフリクト（衝突）**が起きて解消作業が必要になります。
「始める前に Pull、終わったら Push」を徹底すれば、まず起きません。

### もし「Push できません」と出たら

サブ機で作業中に、メイン機から先に Push されている状態です。

1. **Pull origin** を押す
2. 自動でマージされたら、そのまま **Push origin**
3. コンフリクトと表示されたら、その旨をお知らせください。こちらで解消します

---

## 4. クローンしても入ってこないもの（重要）

`.gitignore` で除外しているため、以下は**サブ機には来ません**。

| 除外しているもの | 対応 |
|---|---|
| `_wp移行素材/`（テーマzip・移行アセット） | **`python build_wp_theme.py` を実行すれば再生成されます**。手作業でのコピーは不要 |
| 写真素材の元フォルダ（`施術写真/` `コラム/` など） | サイトに使う画像は `images/` に最適化済みで入っています。**原本が必要なときだけ** USB や クラウド経由でコピー |
| `ASPATH_修正対応状況_*.md`（山口様共有用） | 必要なときに再作成できます |
| `*.mp4` `*.pptx` `*.wpress` `*.zip` | 容量が大きいため除外。必要なときだけ手動コピー |

**サイト本体（HTML 18ページ ＋ `images/` 50点 ＋ ビルドスクリプト）はすべて入ります**ので、
クローン直後からそのまま編集・確認ができます。

---

## 5. Python が必要な場合

テーマzipを再生成する `build_wp_theme.py` を動かすには Python が必要です。
Cowork 側で実行する場合は不要ですが、サブ機で直接動かしたいときは以下を入れてください。

- [python.org](https://www.python.org/downloads/) から Python 3 をインストール
  （インストール時に **Add Python to PATH** にチェック）
- 画像処理用ライブラリ：`pip install pillow`

---

## 6. うまくいかないときの確認

| 症状 | 確認すること |
|---|---|
| リポジトリが一覧に出ない | ログインしているアカウントが `Kkenjis` か確認。別アカウントなら Collaborator 招待が必要 |
| Clone が途中で止まる | 通信環境を確認。リポジトリは約18MBなので通常は数十秒で終わります |
| Cowork がフォルダを読めない | クローン先が OneDrive 同期フォルダ配下だと不安定な場合があります。`Documents` 直下など、同期対象外の場所を推奨 |
| 「Push origin」が見当たらない | 未コミットの変更があると Commit ボタンが優先表示されます。先に Commit を |

---

## 7. コマンドで操作したい場合（任意）

GitHub Desktop を使わず PowerShell で行う場合の手順です。

```powershell
# 初回のみ：クローン
git clone https://github.com/Kkenjis/dev-aspath-life.git
cd dev-aspath-life

# 初回のみ：名前とメールを設定
git config user.name  "Kkenjis"
git config user.email "kenji.k0101.roy@gmail.com"

# 毎回：作業前
git pull origin main

# 毎回：作業後
git add -A
git commit -m "変更内容の説明"
git push origin main
```

初回の Push でログインを求められたら、ブラウザ認証（Sign in with your browser）を選ぶのが最も簡単です。
