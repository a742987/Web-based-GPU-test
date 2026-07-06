# GPU ストレステスト

English: [README.md](https://github.com/a742987/Web-based-GPU-test/blob/main/README.md) | 简体中文: [README-zh-CN.md](https://github.com/a742987/Web-based-GPU-test/blob/main/README-zh-CN.md)

Three.js のワイヤーフレーム表示と、裏側で動く WebGL 負荷処理を組み合わせた単一ファイルの GPU ストレステストです。

## 機能

- 右側に Three.js のワイヤーフレームシーンを表示
- 裏側で WebGL の負荷を生成
- 英語、日本語、簡体中文に対応
- FPS、フレーム時間、内部解像度、状態を表示

## 使い方

1. `gpu-stress-test.html` を最新のデスクトップブラウザで開きます。
2. `Language` で表示言語を選びます。
3. `Start Test` を押してテストを開始または一時停止します。
4. スライダーとプリセットで負荷を調整します。

## コントロール

- `Language`: UI の表示言語を切り替えます。
- `Preset`: 負荷プリセットを切り替えます。
- `Resolution Scale`: 内部レンダリング解像度を変更します。
- `Shader Complexity`: フラグメント処理量を変更します。
- `Draw Passes`: オフスクリーン描画回数を変更します。
- `Concurrent Engines`: 並列エンジン数を変更します。
- `Speed`: アニメーション速度を変更します。

## プリセット

- `Safe`: 最も軽い設定です。
- `Medium`: バランス型の設定です。
- `Extreme`: 重い設定です。
- `Ultra`: 最も重い内蔵設定です。

## 注意

- GPU に強い負荷をかけるため、温度やファン回転数が上がる場合があります。
- UI は読みやすさを優先したコンパクトな構成です。
- WebGL 対応が必要です。
