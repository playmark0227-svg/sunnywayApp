# デプロイ手順

本体は **Next.js（App Router・Server Actions・Prisma）** のサーバーアプリです。GitHub Pages
（静的）では動かせないため、サーバーホストへデプロイします。`preview/` の静的デモとは別物です。

## 本番DBについて（重要）
ローカル/デモは **SQLite**（`prisma/dev.db`）です。本番（Vercel 等のサーバーレス）はファイル
書き込みが永続化されないため、**PostgreSQL 等に切り替え**てください。

1. `prisma/schema.prisma` の datasource を変更：
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. `DATABASE_URL` に本番DBの接続文字列を設定。
3. 初期化：`npx prisma db push && npm run db:seed`

## 必要な環境変数
| 変数 | 用途 |
|---|---|
| `DATABASE_URL` | DB 接続先 |
| `JWT_SECRET` | セッション署名キー（`openssl rand -base64 48`） |
| `SESSION_TTL_HOURS` | 任意。セッション有効時間（既定12） |

---

## A. Vercel（最短）
1. このリポジトリを Vercel にインポート（Framework は Next.js 自動検出）。
2. 環境変数 `DATABASE_URL`（PostgreSQL）・`JWT_SECRET` を設定。
3. Build Command はそのままでOK（`package.json` の `build` が `prisma generate && next build`）。
4. デプロイ後、一度 `npx prisma db push && npm run db:seed`（ローカルから本番DBに対して）で初期化。

> CI からの自動デプロイを使う場合は、リポジトリ Secrets に `VERCEL_TOKEN` 等を追加し、
> `vercel deploy --prod` を実行するワークフローを足してください。

## B. Docker（自己ホスト／Render・Fly・Railway 等）
```bash
docker build -t sunnyway .
docker run -p 3000:3000 \
  -e JWT_SECRET="$(openssl rand -base64 48)" \
  -e DATABASE_URL="postgresql://…" \
  sunnyway
```
`next.config.mjs` で `output: "standalone"` を有効化済みのため、最小ランタイムで起動します。

## 動作確認用アカウント（シード）
- アプリ（インフルエンサー）: `aoi@influencer.test` / `password123` → `/`
- 運営: `admin@sunnyway.io` / `demo1234` → `/login`
