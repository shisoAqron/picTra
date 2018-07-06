# picTra(ピクトラ🐯)

画像を一覧表示して，転送がちゃちゃっとできるやつ

## target user

- PC操作に慣れていないけど，iPhoneとかから画像をPCへ保存したい人
  - エクスプローラの操作が厳しい
  - ShiftとかCtrlの複数選択がうまく使えない
  - フォルダのリネームが大変
    - ぶっちゃけウチの母親のためのツール

なので高級な機能はとことん省く  
選ぶ->フォルダの名前つける->転送 これだけ  
見た目もシンプルに

## 実装した

- ディレクトリを選んで一覧表示
- 作成日時でソート
- 作成日時でフィルタリング
- electronで動かす
- 日付の区切り
- 画像の選択
- ツーカラム表示にする
- bootstrapの導入

## この後の実装

- 転送フォルダ名の入力
- 画像の転送
  - パスは取得した