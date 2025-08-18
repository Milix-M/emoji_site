# 文字スタンプメーカー (Beta)

SlackやDiscordなどのカスタム絵文字として利用可能な、テキストベースの絵文字を生成するWebアプリケーションです。

## ✨ 概要

ユーザーはWebサイト上で任意のテキスト、フォント、色を選択し、リアルタイムでプレビューを確認しながらオリジナルの絵文字を作成できます。完成した画像はPNG形式でダウンロード可能です。

フロントエンドはAstroで構築され、インタラクティブなUIはReactコンポーネント（Astroアイランド）によって実現されています。

## 🚀 主な使用技術

- **フレームワーク**: [Astro](https://astro.build/)
- **UI**: [React](https://react.dev/) (Astro Islands), [Tailwind CSS](https://tailwindcss.com/)
- **状態管理**: React Hooks (useReducer, useContext)
- **テスト**: [Vitest](https://vitest.dev/), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **リンター/フォーマッター**: [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)

## 📂 プロジェクト構造

主要なディレクトリとファイルは以下の通りです。

```text
/
├── public/              # 静的ファイル
├── src/
│   ├── components/      # Reactコンポーネント
│   ├── contexts/        # React Context
│   ├── hooks/           # カスタムフック
│   ├── lib/             # APIクライアント、共通ロジック
│   ├── pages/           # Astroページ
│   └── styles/          # グローバルCSS
├── astro.config.mjs     # Astro設定ファイル
├── tailwind.config.mjs  # Tailwind CSS設定ファイル
└── package.json         # 依存関係とスクリプト
```

## 🛠️ 環境設定

1. **依存関係のインストール:**

   ```sh
   npm install
   ```

2. **バックエンドサーバー:**
   このプロジェクトは、画像生成を行うバックエンドAPIを別途必要とします。APIサーバーを `http://localhost:8000` で起動してください。

3. **環境変数の設定:**
   プロジェクトのルートに `.env` ファイルを作成し、バックエンドAPIのURLを設定します。

   ```env
   PUBLIC_API_BASE_URL=http://localhost:8000
   ```

## 🧞 コマンド

| コマンド            | 説明                                           |
| :------------------ | :--------------------------------------------- |
| `npm run dev`       | 開発サーバーを起動します (`localhost:4321`)    |
| `npm run build`     | 本番用にプロジェクトをビルドします (`./dist/`) |
| `npm run preview`   | ビルド成果物をローカルでプレビューします       |
| `npm run test`      | Vitestでユニットテストを実行します             |
| `npm run test:ui`   | VitestのUIモードでテストを実行します           |
| `npm run lint`      | ESLintでコードの静的解析を実行します           |
| `npm run format`    | Prettierでコードをフォーマットします           |
| `npm run astro ...` | AstroのCLIコマンドを実行します                 |
