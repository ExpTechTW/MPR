# MPR
<img alt="Discord" src="https://img.shields.io/discord/926545182407688273">

------

- Multifunctional Plugin Robot ( 多功能插件機器人 )

## 索引
- [概要](#概要)
- [特色](#特色)
- [為什麼](#為什麼)
- [原理](#原理)
- [注意](#注意)
- [依賴](#依賴)
- [文檔](#文檔)
- [貢獻者](#貢獻者)
- [贊助商](#贊助商)
- [發佈規則](#發佈規則)
- [合作](#合作)

## 概要
- 這是一個以 JavaScript 開發的 Discord 機器人
- 運行這個機器人需要在自己的設備上或是託管
- 第一次運行時 執行 index.js 程式會自動初始化
- 更多功能可以透過安裝插件的方式添加到機器人上

## 特色
- 每個人都可以輕鬆製作屬於自己的機器人插件，讓機器人的開發變得簡單
- 用多少安裝多少，不會有一堆不必要的功能
- 而且運行在自己的託管，沒有安全上的問題
- 更新包代碼都是從開源庫上抓取更新，公開透明
- 放到託管上之後就不用在理，Discord 上可以操作一切

## 為什麼
- 為什麼要開發這個機器人？
- 因為開發了很多個機器人後，每個機器人最後的結局都是代碼太多且過於冗長，不利維護及開發，導致廢棄
- 使用插件的方式，可以讓每個開發人員專心負責一個插件，而開發人員也可以調用其他插件的暴露接口，來享受其他插件帶來的便利

## 原理
- 透過 [`插件加載器 (pluginLoader)`](https://github.com/ExpTechTW/MPR-pluginLoader/tree/%E4%B8%BB%E8%A6%81%E7%9A%84-(main)/version) 加載 Plugin 資料夾底下的所有 JavaScript 檔案
- 當 事件觸發 時讀取 插件 `const Plugin` 變數內的參數

## 注意
#### 插件安裝 ( 2種方法 )
1. 通過 pluginLoader 安裝插件
2. 將 插件 檔案放到 Plugin 資料夾底下 使用 `$reload`

## 依賴
- 將 package.json 和 index.js 一同放到設備上
- 或利用下方指令手動安裝
```console
npm i discord.js node-fetch@^2.6.6 require-reload axios ws
```

## 文檔
- [使用者文檔](https://github.com/ExpTechTW/MPR/blob/%E4%B8%BB%E8%A6%81%E7%9A%84-(main)/USER.md)
- [開發者文檔](https://github.com/ExpTechTW/MPR/blob/%E4%B8%BB%E8%A6%81%E7%9A%84-(main)/DEVELOPER.md)
- [插件列表](https://github.com/ExpTechTW/MPR/blob/%E4%B8%BB%E8%A6%81%E7%9A%84-(main)/PLUGIN.md)

## 貢獻者
- whes1015 `程式開發` `插件` `文檔`
- lidiali941219 `插件`

## 贊助商
- pisces_#0001 `主機提供`

------

## 發佈規則
- 如果新版本中有錯誤，且尚未列出，請將錯誤資訊提交到 ```issue```
- 如果您使用任何形式的辱罵性或貶義性語言給其他用戶，您將永遠被封禁！
- 不要發送重複無意義內容至 ```issue```，否則您將永遠被封禁！
- 若有任何問題或建議，歡迎提出

## 合作
- 若有任何可以改進的地方，歡迎使用 ```Pull requests``` 來提交
