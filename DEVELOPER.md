# 插件開發指南

## 索引
- [建立](#建立)
- [事件](#事件)
- [指令](#指令)
- [權限](#權限)
- [方法調用](#方法調用)
- [最後](#最後)
- [常見錯誤](#常見錯誤)
- [範例](#範例)
- [進階](#進階)
- [發布](#發布)

## 建立
- 首先建立一個 `JavaScript` 檔案
- 範例: `TimeNow.js` ( 不要有空格或特殊字元 )
- 在檔案中放入 `插件資訊`
#### 完整 Plugin 訊息
```JavaScript
const Plugin={
    "name": "TimeNow", // 插件 名稱
    "version": "3.1.0", // 插件 版本
    "depends":{ // 依賴
        "pluginLoader":">=3.5.0", // pluginLoader 版本
    },
    "Events":["messageCreate"], // 事件註冊
    "Commands":[ // 指令註冊
    {
        "name": "time now", // 指令 名稱
        "note": "查看現在時間" // 指令 介紹
    }
    ],
    "author": ["whes1015"], // 插件 作者
    "link":"https://github.com/ExpTechTW/MPR-TimeNow", // 插件 GitHub 鏈接
    "resources":["AGPL-3.0"], // 插件 開源協議
    "description":"顯示現在時間" // 插件介紹
}
```
#### 簡化 Plugin 訊息 ( 不建議 )
```JavaScript
const Plugin={
    "name": "TimeNow", // 插件 名稱
    "version": "3.1.0", // 插件 版本
    "depends":{ // 依賴
        "pluginLoader":">=3.5.0", // pluginLoader 版本
    },
    "Events":["messageCreate"], // 事件註冊
    "Commands":[ // 指令註冊
    {
        "name": "time now", // 指令 名稱
        "note": "查看現在時間" // 指令 介紹
    }
    ],
    "author": ["whes1015"], // 插件 作者
}
```

## 事件
- 在檔案中放入 `事件註冊` 讓 pluginLoader 知道 插件 需要那些事件 以便在事件發生時通知 插件
- 撰寫 function 功能
```JavaScript
async function messageCreate(client, message) {
    if (message.content == "$time now") {
        let now = new Date()
        let Now = now.getFullYear() +
            "/" + (now.getMonth() + 1) +
            "/" + now.getDate() +
            " " + now.getHours() +
            ":" + now.getMinutes() +
            ":" + now.getSeconds()
        message.reply(await pluginLoader.embed(Now, null, Plugin.author, "https://raw.githubusercontent.com/ExpTechTW/API/%E4%B8%BB%E8%A6%81%E7%9A%84-(main)/image/Icon/ExpTech.png"))
    }
}
```
#### 事件列表
- `messageCreate` message 生成事件 | `client` `message`

## 指令
- 在 Plugin 中放入 `指令註冊` 以便在用戶輸入 $help 時顯示

## 權限
- pluginLoader 有自己的一套 權限系統 分為 0 ~ 4 個等級
```
0 >> 禁止使用指令
1 >> 成員
2 >> 幫手
3 >> 管理員
4 >> 群組擁有者
```

## 方法調用
#### pluginLoader 內提供了許多實用的方法 可以讓 插件 更加精簡
- 導入 pluginLoader `const pluginLoader = require('../Core/pluginLoader')`
#### 方法列表
- `pluginLoader.Plugin` | 提供 pluginLoader 相關訊息
- `pluginLoader.embed()` | 封裝 embed 訊息 `msg` `[color]` `[author]` `[icon]`
- `pluginLoader.edit()` | 編輯訊息 `client` `channel` `msgID` `msg`
- `pluginLoader.log()` | 日誌記錄 `msg` `client`
- `pluginLoader.permission()` | 權限查詢 `user`

## 最後
- 別忘了把 插件 的方法導出 否則 pluginLoader 會讀取不到
```JavaScript
module.exports = {
    Plugin,
    messageCreate
}
```

## 常見錯誤
#### 插件 不兼容 當前 pluginLoader 版本
- 通常是因為用戶更新 pluginLoader，導致插件不兼容，或是 插件 作者忘記修改 `"pluginLoader":""`
- `"pluginLoader":"*"` 表示 兼容 所有 pluginLoader 版本
- `"pluginLoader":">=3.0.0"` 表示 兼容 3.0.0 以上 pluginLoader 版本
- 查看最新 `pluginLoader` 版本 [這裡](https://github.com/ExpTechTW/MPR-pluginLoader/tree/%E4%B8%BB%E8%A6%81%E7%9A%84-(main)/version)

## 範例
- 一切完成之後 你的檔案看起來會像這樣
```JavaScript
'use strict'

const Plugin = {
    "name": "TimeNow",
    "version": "3.1.0",
    "depends": {
        "pluginLoader": ">=3.5.0"
    },
    "Events": ["messageCreate"],
    "Commands": [
        {
            "name": "time now",
            "note": "查看現在時間"
        }
    ],
    "author": ["whes1015"],
    "link": "https://github.com/ExpTechTW/MPR-TimeNow",
    "resources": ["AGPL-3.0"],
    "description": "顯示現在時間"
}


const pluginLoader = require('../Core/pluginLoader')

async function messageCreate(client, message) {
    if (message.content == "time now") {
        let utc = new Date()
        let now = new Date(utc.getTime() + utc.getTimezoneOffset() * 60 * 1000 + 60 * 60 * 8 * 1000)
        let Now = now.getFullYear() +
            "/" + (now.getMonth() + 1) +
            "/" + now.getDate() +
            " " + now.getHours() +
            ":" + now.getMinutes() +
            ":" + now.getSeconds()
        message.reply(await pluginLoader.embed(Now, null, Plugin.author.toString().replaceAll(",", " "), "https://raw.githubusercontent.com/ExpTechTW/API/%E4%B8%BB%E8%A6%81%E7%9A%84-(main)/image/Icon/ExpTech.png"))
    }
}

module.exports = {
    Plugin,
    messageCreate
}
```

## 進階
#### DHL ( Dynamic Hot Loading )
- 動態熱加載
- 默認為 true
- 在 Plugin 插件訊息中 可以設定 `"DHL":false` 手動關閉
- 默認 true 的情況下，每次調用 插件 都會觸發 熱加載，這會導致 資料 stream 或是 WebSocket 連接的中斷，如有用到上述類型的功能，可視需求關閉 DHL
- 此功能為 `pluginLoader>=4.0.0` 才有的功能，務必設定 pluginLoader 依賴 >=4.0.0

## 發布
- 標準 儲存庫 格式
- [`/version.json`](https://github.com/ExpTechTW/MPR-UUID/blob/%E4%B8%BB%E8%A6%81%E7%9A%84-(main)/version.json) MPR 機器人 用來抓取 插件 版本資訊的文件
- [`/version/Example-1.0.0.js`](https://github.com/ExpTechTW/MPR-UUID/blob/%E4%B8%BB%E8%A6%81%E7%9A%84-(main)/version/UUID-1.0.0.js) 插件 更新檔案
- 必須依照下方路徑放置檔案
- 文件樹
```
filetree 
├── /version/
│  ├── Example-1.0.0.js
│  └── Example-2.0.0.js
└── /version.json

```
![image](https://user-images.githubusercontent.com/44525760/164910676-36b1fea8-e1d0-49a0-ba93-7dcfa930f34d.png)
- 最後將 `whes1015/MPR-Example/main/` 路徑 添加至 [`repositories.json`](https://github.com/ExpTechTW/MPR/blob/%E4%B8%BB%E8%A6%81%E7%9A%84-(main)/repositories.json)
