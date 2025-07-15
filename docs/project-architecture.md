# Meeting Time Cost Manager - プロジェクト構造設計

## 🏗️ アーキテクチャ概要

### システム構成
```
Frontend (React PWA)
    ↓ HTTPS/WebSocket
Backend API (Node.js/Express)
    ↓ 
Database (PostgreSQL)
    ↓
Analytics Engine (Python/AI)
```

### 技術スタック選定理由

#### フロントエンド：React + TypeScript + PWA
- **React 18**：最新の並行機能とサーバーサイドレンダリング
- **TypeScript**：型安全性による開発効率とバグ削減
- **PWA**：オフライン対応とネイティブアプリ体験
- **Material-UI v5**：エンタープライズグレードのUI/UX

#### バックエンド：Node.js + Express + TypeScript
- **Node.js 18**：JavaScript統一による開発効率
- **Express.js**：軽量で拡張性の高いWebフレームワーク
- **TypeScript**：フロントエンドとの一貫性
- **Prisma ORM**：型安全なデータベースアクセス

#### データベース：PostgreSQL + Redis
- **PostgreSQL 15**：エンタープライズ対応の信頼性
- **Redis**：セッション管理とリアルタイム通信
- **TimescaleDB**：時系列データの効率的な処理

#### インフラ：Vercel + Supabase
- **Vercel**：フロントエンドの高速デプロイ
- **Supabase**：PostgreSQL + リアルタイム機能
- **Cloudflare**：CDNとセキュリティ

## 📁 詳細ディレクトリ構造

```
meeting-time-cost-manager/
├── README.md
├── package.json
├── docker-compose.yml
├── .env.example
├── .gitignore
│
├── docs/                           # ドキュメント
│   ├── requirements.md
│   ├── social-problem-analysis.md
│   ├── executive-meeting-crisis.md
│   ├── project-architecture.md
│   ├── database-design.md
│   ├── api-specification.md
│   └── deployment-guide.md
│
├── frontend/                       # React PWA
│   ├── public/
│   │   ├── manifest.json
│   │   ├── sw.js
│   │   └── icons/
│   ├── src/
│   │   ├── components/            # 再利用可能コンポーネント
│   │   │   ├── common/           # 共通コンポーネント
│   │   │   │   ├── Button/
│   │   │   │   ├── Modal/
│   │   │   │   ├── Loading/
│   │   │   │   └── Layout/
│   │   │   ├── forms/            # フォームコンポーネント
│   │   │   │   ├── MeetingForm/
│   │   │   │   ├── ParticipantForm/
│   │   │   │   └── SettingsForm/
│   │   │   └── charts/           # グラフコンポーネント
│   │   │       ├── CostChart/
│   │   │       ├── TrendChart/
│   │   │       └── ROIChart/
│   │   ├── pages/                # ページコンポーネント
│   │   │   ├── Dashboard/
│   │   │   ├── MeetingStart/
│   │   │   ├── MeetingHistory/
│   │   │   ├── Analytics/
│   │   │   ├── Settings/
│   │   │   └── Profile/
│   │   ├── hooks/                # カスタムフック
│   │   │   ├── useMeeting.ts
│   │   │   ├── useAuth.ts
│   │   │   ├── useWebSocket.ts
│   │   │   └── useAnalytics.ts
│   │   ├── store/                # 状態管理
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.ts
│   │   │   │   ├── meetingSlice.ts
│   │   │   │   └── settingsSlice.ts
│   │   │   └── index.ts
│   │   ├── services/             # API通信
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   ├── meetings.ts
│   │   │   └── analytics.ts
│   │   ├── utils/                # ユーティリティ
│   │   │   ├── constants.ts
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   └── helpers.ts
│   │   ├── types/                # 型定義
│   │   │   ├── meeting.ts
│   │   │   ├── user.ts
│   │   │   └── analytics.ts
│   │   ├── styles/               # スタイル
│   │   │   ├── globals.css
│   │   │   ├── variables.css
│   │   │   └── components.css
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .env.local
│
├── backend/                        # Node.js API
│   ├── src/
│   │   ├── controllers/           # コントローラー
│   │   │   ├── auth.controller.ts
│   │   │   ├── meeting.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   └── analytics.controller.ts
│   │   ├── middleware/            # ミドルウェア
│   │   │   ├── auth.middleware.ts
│   │   │   ├── validation.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── rate-limit.middleware.ts
│   │   ├── models/               # データモデル
│   │   │   ├── User.ts
│   │   │   ├── Meeting.ts
│   │   │   ├── Participant.ts
│   │   │   └── Organization.ts
│   │   ├── routes/               # ルート定義
│   │   │   ├── auth.routes.ts
│   │   │   ├── meeting.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   └── analytics.routes.ts
│   │   ├── services/             # ビジネスロジック
│   │   │   ├── auth.service.ts
│   │   │   ├── meeting.service.ts
│   │   │   ├── cost.service.ts
│   │   │   ├── analytics.service.ts
│   │   │   └── notification.service.ts
│   │   ├── utils/                # ユーティリティ
│   │   │   ├── database.ts
│   │   │   ├── logger.ts
│   │   │   ├── encryption.ts
│   │   │   └── validators.ts
│   │   ├── types/                # 型定義
│   │   │   ├── express.d.ts
│   │   │   ├── meeting.types.ts
│   │   │   └── analytics.types.ts
│   │   ├── config/               # 設定
│   │   │   ├── database.config.ts
│   │   │   ├── auth.config.ts
│   │   │   └── app.config.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── prisma/                   # データベーススキーマ
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── tests/                    # テスト
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.js
│   └── .env
│
├── analytics/                      # AI分析エンジン
│   ├── src/
│   │   ├── models/               # MLモデル
│   │   │   ├── cost_prediction.py
│   │   │   ├── efficiency_analysis.py
│   │   │   └── recommendation.py
│   │   ├── services/             # 分析サービス
│   │   │   ├── data_processor.py
│   │   │   ├── trend_analyzer.py
│   │   │   └── report_generator.py
│   │   ├── api/                  # API エンドポイント
│   │   │   ├── analytics_api.py
│   │   │   └── prediction_api.py
│   │   └── utils/
│   │       ├── data_utils.py
│   │       └── model_utils.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env
│
├── shared/                         # 共有ライブラリ
│   ├── types/                    # 共通型定義
│   │   ├── meeting.types.ts
│   │   ├── user.types.ts
│   │   └── analytics.types.ts
│   ├── constants/                # 定数
│   │   ├── roles.ts
│   │   ├── permissions.ts
│   │   └── config.ts
│   └── utils/                    # 共通ユーティリティ
│       ├── formatters.ts
│       ├── validators.ts
│       └── calculations.ts
│
├── infrastructure/                 # インフラ設定
│   ├── docker/
│   │   ├── Dockerfile.frontend
│   │   ├── Dockerfile.backend
│   │   └── Dockerfile.analytics
│   ├── kubernetes/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── ingress.yaml
│   ├── terraform/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── scripts/
│       ├── deploy.sh
│       ├── backup.sh
│       └── migrate.sh
│
└── tools/                          # 開発ツール
    ├── scripts/
    │   ├── setup.sh
    │   ├── test.sh
    │   └── build.sh
    ├── generators/
    │   ├── component.js
    │   └── api.js
    └── configs/
        ├── eslint.config.js
        ├── prettier.config.js
        └── husky.config.js
```

## 🔧 開発環境セットアップ

### 必要なツール
- **Node.js 18+**
- **Docker & Docker Compose**
- **Git**
- **VSCode** (推奨)

### パッケージ管理
- **npm workspaces** または **yarn workspaces**
- **lerna** (monorepo管理)

### コード品質
- **ESLint + Prettier**
- **Husky** (Git hooks)
- **lint-staged**
- **commitizen** (コミットメッセージ統一)

## 📦 主要ライブラリ選定

### フロントエンド
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@reduxjs/toolkit": "^1.9.0",
    "react-redux": "^8.0.0",
    "@mui/material": "^5.10.0",
    "@mui/x-charts": "^6.0.0",
    "react-router-dom": "^6.4.0",
    "socket.io-client": "^4.7.0",
    "date-fns": "^2.29.0",
    "react-hook-form": "^7.38.0",
    "zod": "^3.19.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@vitejs/plugin-react": "^2.2.0",
    "vite": "^3.2.0",
    "vite-plugin-pwa": "^0.13.0"
  }
}
```

### バックエンド
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "prisma": "^4.6.0",
    "@prisma/client": "^4.6.0",
    "jsonwebtoken": "^8.5.0",
    "bcryptjs": "^2.4.0",
    "socket.io": "^4.7.0",
    "joi": "^17.7.0",
    "winston": "^3.8.0",
    "helmet": "^6.0.0",
    "cors": "^2.8.0",
    "express-rate-limit": "^6.6.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "@types/node": "^18.11.0",
    "nodemon": "^2.0.0",
    "ts-node": "^10.9.0",
    "jest": "^29.2.0",
    "supertest": "^6.3.0"
  }
}
```

## 🚀 開発ワークフロー

### Git戦略
- **main**: 本番環境
- **develop**: 開発環境
- **feature/**: 機能開発
- **hotfix/**: 緊急修正

### CI/CD パイプライン
1. **コード品質チェック** (ESLint, Prettier, TypeScript)
2. **テスト実行** (Unit, Integration, E2E)
3. **ビルド** (Frontend, Backend)
4. **セキュリティスキャン**
5. **デプロイ** (Staging → Production)

### テスト戦略
- **Unit Tests**: 70%カバレッジ目標
- **Integration Tests**: API統合テスト
- **E2E Tests**: クリティカルパス
- **Performance Tests**: 負荷テスト

## 📊 監視・運用

### ログ・監視
- **Winston** (構造化ログ)
- **Sentry** (エラー監視)
- **New Relic** (APM)
- **Grafana** (メトリクス可視化)

### セキュリティ
- **HTTPS強制**
- **JWT認証**
- **Rate Limiting**
- **SQL Injection対策**
- **XSS対策**
- **CSRF対策**

この構造により、**スケーラブルで保守性の高いエンタープライズアプリケーション**を構築できます。