## TechBlog

技術ブログとしての最低限の機能を詰め込んだ。

**モバイル版**
![https://storage.googleapis.com/zenn-user-upload/0wwzsv9bsoyo8wicyl5j6fwe98yo](https://storage.googleapis.com/zenn-user-upload/0wwzsv9bsoyo8wicyl5j6fwe98yo)

**デスクトップ版**
![https://storage.googleapis.com/zenn-user-upload/j55aisuqu75pesx7rx66j6bhfnww](https://storage.googleapis.com/zenn-user-upload/j55aisuqu75pesx7rx66j6bhfnww)

[techBlog：大学生だった](https://techblog-pink.vercel.app)

GitHubのリポジトリで記事を管理して投稿するブログを作成しました。
そのリポジトリがZennの記事を管理する[リポジトリ](https://github.com/wimpykid719/zenn-content)なのでZennに投稿した記事を使ってブログを作成した。
新たにリポジトリを作って、ブログのみに投稿する事も可能です。
自分の記事が色々な所に分散するのが嫌なのでこのような作りにしました。

## 機能
- GitHubのリポジトリからマークダウンで書かれた記事ファイルを取得する。
- コードのsyntax highlighting, Katex（数式表示）, tableに対応
- 各種ソーシャルボタン

## Requirement
- remark
- remark-html
- remark-prism
- remark-math
- remark-html-katex
- remark-gfm
- gray-matter
- date-fns
- react-icons
- tailwindcss

## Installation
```bash
git clone https://github.com/wimpykid719/blog.git
```
あとは `.env` の環境変数と `lib/posts.tsx` にあるリポジトリに投げるURLを変更すればオリジナルのブログが作成出来ると思います。

## Usage

First, run the development server:

```bash
npm run dev
# or
yarn dev
```
[http://localhost:3000](http://localhost:3000) で起動します。

## ToDo
🔨　ダークモード対応

🔨　ページネーション

🔨　記事ページでのレコメンド（タグ名から）

🔨　RSS対応

🔨　zenn-contentリポジトリが更新されたらVercelで再ビルドが走るようにしたい。

## 最後に
より具体的な機能の解説はブログで書いています。
[【無料運用】Zennの投稿記事を使ったブログをNext.js, Tailwindcss, TypeScript, Vercelで構築した。](https://techblog-pink.vercel.app/posts/nextjs-build-techblog)