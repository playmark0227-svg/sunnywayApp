# ☀️ Sunnyway

コスメブランドと**インフルエンサー**をつなぐマッチングプラットフォーム。
**「ここに掲載すれば、何人ものインフルエンサーが取り上げる」** を軸に、掲載 → 応募 →
採用 → 投稿 → 運営チェック → 完了・**報酬の振込** までを一気通貫で扱います。

実ログイン・実DBで動く **Next.js 本体**と、デザイン確認用の **静的プレビュー**（`preview/`）で構成。

---

## 構成（2つのアプリ・別URL）

| 役割 | 入口 | 形態 |
|---|---|---|
| **インフルエンサー** | `/` | スマホ向けアプリ（PWA・インストール可） |
| **Sunnyway 運営** | `/login` → `/admin` | 管理 Web（関係者専用・別URL） |
| **コスメブランド** | ― | 運営が代理（管理画面なし） |

- アプリ起動＝**スプラッシュ → チュートリアル → ログイン/新規登録 → 本編（4タブ）**
- 4タブ：**さがす / 案件管理 / メッセージ / マイ**
- 運営：ダッシュボード・掲載・**成果レポート（◯人が取り上げ）**・ブランド・商品・インフルエンサー・**監査ログ**

---

## 主な機能
- **認証/RBAC**：JWT(httpOnly Cookie)＋bcrypt。`/admin`・`/app` をミドルウェア＋各ページ＋サーバーアクションの三重で検証。運営操作は**監査ログ**に記録。
- **掲載 → 応募 → 採用 → 投稿提出（チェック中）→ 運営確認 → 完了**。完了時に**取引（振込）を自動生成**。
- **報酬モデル**：ギフティング／金銭／現物＋報酬／特別報酬。**収益モデル**：月額・掲載料／キャンペーン課金／成果連動／販売手数料（併用可）。
- **案件詳細ページ**、カテゴリ/媒体での絞り込み、**お気に入り**。
- **メッセージ**（運営チャット）、**お知らせ通知**（採用/完了/振込で生成・未読バッジ）。
- **取引履歴 / 振込先 / 住所 / SNS連携 / 通知設定**。
- **商品画像アップロード**（クライアントで自動軽量化 → DB保存。未設定時はコスメのイラスト）。

---

## 技術スタック
- **Next.js 15（App Router・Server Actions）** / React 19 / TypeScript
- **Prisma 6** ＋ **SQLite**（開発）/ **PostgreSQL**（本番想定）
- **Tailwind CSS**、`next/font`（Shippori Mincho × Zen Kaku Gothic New を自前ホスト）
- 認証：`jose`(JWT)＋`bcryptjs`、検証：`zod`

---

## ローカルで動かす
```bash
npm install
cp .env.example .env          # JWT_SECRET を設定
npm run db:push && npm run db:seed
npm run dev                   # http://localhost:3000
```

### ログイン情報（シード）
| 役割 | メール | パスワード | 入口 |
|---|---|---|---|
| インフルエンサー | `aoi@influencer.test` | `password123` | `/` |
| 運営 | `admin@sunnyway.io` | `demo1234` | `/login` |

---

## ディレクトリ
```
prisma/            スキーマ & シード（User/Brand/Product/Campaign/Application/
                   Transaction/Message/Notification/AuditLog）
middleware.ts      /admin・/app の一次認可
src/
  lib/             db / auth(JWT,RBAC) / audit / labels / actions(auth,admin,influencer)
  components/      Icon(アイコン・イラスト) / ui / app/* / admin/* / AdminForms ...
  app/
    page.tsx       アプリ入口（オンボーディング→認証）
    login/         運営ログイン
    app/           インフルアプリ（さがす/案件管理/メッセージ/マイ/案件詳細/お知らせ）
    admin/         運営コンソール
public/            PWA アイコン・Service Worker
preview/           静的デザインプレビュー（GitHub Pages 用・本体とは別）
```

---

## デプロイ
本体はサーバーアプリのため GitHub Pages では動きません。**Vercel** または **Docker**（`Dockerfile`／
`output: "standalone"`）でデプロイします。本番は **PostgreSQL** へ切り替え。手順は **[DEPLOY.md](./DEPLOY.md)**。

CI（型チェック＋ビルド）は `.github/workflows/ci.yml` で実行されます。
