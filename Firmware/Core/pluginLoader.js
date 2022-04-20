'use strict'

const Plugin = {
    "name": "pluginLoader",
    "version": "2.0.0",
    "depends": {
        "index": "2.0.X"
    },
    "Commands": [
        {
            "name": "$help [插件]",
            "note": "指令列表",
            "permission": 1
        },
        {
            "name": "$init",
            "note": "初始化 機器人"
        },
        {
            "name": "$plugin install <插件>",
            "note": "安裝 插件",
            "permission": 3
        },
        {
            "name": "$plugin uninstall <插件>",
            "note": "卸載 插件",
            "permission": 3
        },
        {
            "name": "$plugin info [插件]",
            "note": "插件 資訊",
            "permission": 3
        },
        {
            "name": "$permission <用戶> <等級>",
            "note": "設定用戶權限等級",
            "permission": 3
        },
        {
            "name": "$permission <用戶>",
            "note": "查詢用戶權限等級",
            "permission": 1
        }
    ],
    "author": ["whes1015"], // 插件 作者
    "link": "https://github.com/ExpTechTW/MPR-pluginLoader", // 插件 GitHub 鏈接
    "resources": ["AGPL-3.0"], // 插件 開源協議
    "description": "MPR 插件 加載 及 管理 框架" // 插件介紹
}

const reload = require('require-reload')(require)
const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js')
const fs = require('fs')
const path = require("path")
const Path = path.resolve("")

let Version = ""

async function messageCreate(client, message) {
    let User = JSON.parse(fs.readFileSync(Path + "/permission.json").toString())
    let find = -1
    for (let index = 0; index < User.length; index++) {
        if (User[index]["ID"] == message.author.id || User[index]["name"] == message.author.username) {
            find = index
            break
        }
    }
    if (message.guild.ownerId == message.author.id) {
        let Ver = await ver()
        if (Plugin.depends.index.substring(2, 3) == "X") {
            if (Number(Ver.substring(0, 1)) < Number(Plugin.depends.index.substring(0, 1))) {
                message.reply(await embed("請更新 index.js 檔案"))
            }
        } else {
            if (Plugin.depends.index.substring(4, 5) == "X") {
                if (Number(Ver.replaceAll(".", "").substring(0, 2)) < Number(Plugin.depends.index.replaceAll(".", "").replace("X", "").substring(0, 2))) {
                    message.reply(await embed("請更新 index.js 檔案"))
                }
            } else {
                if (Number(Ver.replaceAll(".", "")) < Number(Plugin.depends.index.replaceAll(".", ""))) {
                    message.reply(await embed("請更新 index.js 檔案"))
                }
            }
        }
        const data = {
            "ID": message.author.id,
            "name": message.author.username,
            "permission": 1
        }
        data["permission"] = 4
        if (find == -1) {
            User.push(data)
        } else {
            User[find] = data
        }
    } else {
        if (find != -1 && (User[find]["ID"] != message.author.id || User[find]["name"] != message.author.username)) {
            User[find]["ID"] = message.author.id
            User[find]["name"] = message.author.username
        }
    }

    fs.writeFileSync(Path + "/permission.json", JSON.stringify(User, null, "\t"))

    let plugin = JSON.parse(fs.readFileSync(Path + "/Plugin/plugin.json").toString())
    for (let index = 0; index < plugin.length; index++) {
        try {
            var fun = await reload('../Plugin/' + plugin[index])
            if (message.content.startsWith("$")) {
                for (let Index = 0; Index < fun.Plugin.Commands.length; Index++) {
                    if (message.content.includes(fun.Plugin.Commands[Index]["name"])) {
                        if (fun.Plugin.Commands[Index]["permission"] != undefined && await permission(message.author.id) < Number(fun.Plugin.Commands[Index]["permission"])) {
                            await message.reply(await embed(`權限不足`))
                            return
                        } else {
                            break
                        }
                    }
                }
            }
            if (fun.Plugin.Events.includes("messageCreate")) {
                if (await compatible(fun.Plugin.depends.pluginLoader)) {
                    fun.messageCreate(client, message)
                }
            }
        } catch (error) {
            log(`Error >> ${plugin[index]} 運行出錯 請向 插件 作者聯繫\n錯誤碼:\n${error}`)
        }
    }
}

async function ready(client) {
    let plugin = JSON.parse(fs.readFileSync(Path + "/Plugin/plugin.json").toString())
    for (let index = 0; index < plugin.length; index++) {
        try {
            var fun = reload('../Plugin/' + plugin[index])
            if (fun.Plugin.Events.includes("ready")) {
                if (await compatible(fun.Plugin.depends.pluginLoader)) {
                    fun.ready(client)
                }
            }
        } catch (error) {
            log(`Error >> ${plugin[index]} 運行出錯 請向 插件 作者聯繫\n錯誤碼:\n${error}`)
        }
    }
}

async function messageReactionAdd(reaction, user) {
    let plugin = JSON.parse(fs.readFileSync(Path + "/Plugin/plugin.json").toString())
    for (let index = 0; index < plugin.length; index++) {
        try {
            var fun = reload('../Plugin/' + plugin[index])
            if (fun.Plugin.Events.includes("messageReactionAdd")) {
                if (await compatible(fun.Plugin.depends.pluginLoader)) {
                    fun.messageReactionAdd(reaction, user)
                }
            }
        } catch (error) {
            log(`Error >> ${plugin[index]} 運行出錯 請向 插件 作者聯繫\n錯誤碼:\n${error}`)
        }
    }
}

async function channelCreate(channel) {
    let plugin = JSON.parse(fs.readFileSync(Path + "/Plugin/plugin.json").toString())
    for (let index = 0; index < plugin.length; index++) {
        try {
            var fun = reload('../Plugin/' + plugin[index])
            if (fun.Plugin.Events.includes("channelCreate")) {
                if (await compatible(fun.Plugin.depends.pluginLoader)) {
                    fun.channelCreate(channel)
                }
            }
        } catch (error) {
            log(`Error >> ${plugin[index]} 運行出錯 請向 插件 作者聯繫\n錯誤碼:\n${error}`)
        }
    }
}

async function channelDelete(channel) {
    let plugin = JSON.parse(fs.readFileSync(Path + "/Plugin/plugin.json").toString())
    for (let index = 0; index < plugin.length; index++) {
        try {
            var fun = reload('../Plugin/' + plugin[index])
            if (fun.Plugin.Events.includes("channelDelete")) {
                if (await compatible(fun.Plugin.depends.pluginLoader)) {
                    fun.channelDelete(channel)
                }
            }
        } catch (error) {
            log(`Error >> ${plugin[index]} 運行出錯 請向 插件 作者聯繫\n錯誤碼:\n${error}`)
        }
    }
}

async function messageReactionRemove(reaction, user) {
    let plugin = JSON.parse(fs.readFileSync(Path + "/Plugin/plugin.json").toString())
    for (let index = 0; index < plugin.length; index++) {
        try {
            var fun = reload('../Plugin/' + plugin[index])
            if (fun.Plugin.Events.includes("messageReactionRemove")) {
                if (await compatible(fun.Plugin.depends.pluginLoader)) {
                    fun.messageReactionRemove(reaction, user)
                }
            }
        } catch (error) {
            log(`Error >> ${plugin[index]} 運行出錯 請向 插件 作者聯繫\n錯誤碼:\n${error}`)
        }
    }
}

async function messageDelete(message) {
    let plugin = JSON.parse(fs.readFileSync(Path + "/Plugin/plugin.json").toString())
    for (let index = 0; index < plugin.length; index++) {
        try {
            var fun = reload('../Plugin/' + plugin[index])
            if (fun.Plugin.Events.includes("messageDelete")) {
                if (await compatible(fun.Plugin.depends.pluginLoader)) {
                    fun.messageDelete(message)
                }
            }
        } catch (error) {
            log(`Error >> ${plugin[index]} 運行出錯 請向 插件 作者聯繫\n錯誤碼:\n${error}`)
        }
    }
}

async function messageUpdate(oldmessage, newmessage) {
    let plugin = JSON.parse(fs.readFileSync(Path + "/Plugin/plugin.json").toString())
    for (let index = 0; index < plugin.length; index++) {
        try {
            var fun = reload('../Plugin/' + plugin[index])
            if (fun.Plugin.Events.includes("messageUpdate")) {
                if (await compatible(fun.Plugin.depends.pluginLoader)) {
                    fun.messageUpdate(oldmessage, newmessage)
                }
            }
        } catch (error) {
            log(`Error >> ${plugin[index]} 運行出錯 請向 插件 作者聯繫\n錯誤碼:\n${error}`)
        }
    }
}

async function plugin(client, message) {
    try {
        if (message.content.startsWith("$permission")) {
            let args = message.content.replace("$permission ", "").split(" ")
            if (args.length == 1) {
                await message.reply(await embed(`${args[0]} 權限等級 [查詢]\n${await permission(args[0])}`))
            } else {
                if (await permission(message.author.id) < 3) {
                    await message.reply(await embed(`權限不足`))
                    return
                }
                let User = JSON.parse(fs.readFileSync(Path + "/permission.json").toString())
                let find = -1
                for (let index = 0; index < User.length; index++) {
                    if (User[index]["ID"] == args[0] || User[index]["name"] == args[0]) {
                        find = index
                        break
                    }
                }
                let data = {
                    "ID": null,
                    "name": args[0],
                    "permission": Number(args[1])
                }
                if (find == -1) {
                    User.push(data)
                } else {
                    User[find] = data
                }
                fs.writeFileSync(Path + "/permission.json", JSON.stringify(User, null, "\t"))
                await message.reply(await embed(`${args[0]} 權限等級 [設定]\n${await permission(args[0])}`))
            }
        } else if (message.content.startsWith("$help")) {
            if (message.content == "$help") {
                let msg = "指令列表\n"
                let plugin = JSON.parse(fs.readFileSync(Path + "/Plugin/plugin.json").toString())
                for (let index = 0; index < Plugin.Commands.length; index++) {
                    msg = msg + Plugin.Commands[index]["name"] + " : " + Plugin.Commands[index]["note"] + "\n"
                }
                msg = msg + "\n"
                for (let index = 0; index < plugin.length; index++) {
                    var fun = reload('../Plugin/' + plugin[index])
                    for (let index = 0; index < fun.Plugin.Commands.length; index++) {
                        msg = msg + fun.Plugin.Commands[index]["name"] + " : " + fun.Plugin.Commands[index]["note"] + "\n"
                    }
                    msg = msg + "\n"
                }
                await message.reply(await embed(msg))
            } else {
                let args = message.content.replace("$help ", "").split(" ")
                let msg = `${args} 指令列表\n`
                if (args[0] == "pluginLoader") {
                    for (let index = 0; index < Commands.length; index++) {
                        msg = msg + Commands[index]["name"] + " : " + Commands[index]["note"] + "\n"
                    }
                } else {
                    let plugin = JSON.parse(fs.readFileSync(Path + "/Plugin/plugin.json").toString())
                    for (let index = 0; index < plugin.length; index++) {
                        if (args == plugin[index]) {
                            var fun = reload('../Plugin/' + plugin[index])
                            for (let index = 0; index < fun.Plugin.Commands.length; index++) {
                                msg = msg + fun.Plugin.Commands[index]["name"] + " : " + fun.Plugin.Commands[index]["note"] + "\n"
                            }
                            msg = msg + "\n"
                        }
                    }
                }
                await message.reply(await embed(msg))
            }
        } else if (message.content.startsWith("$plugin info")) {
            if (message.content == "$plugin info") {
                var json = await fetch("https://raw.githubusercontent.com/ExpTechTW/MPR/%E4%B8%BB%E8%A6%81%E7%9A%84-(main)/repositories.json")
                var Json = await json.json()
                let msg = "插件列表\n"
                let plugin = JSON.parse(fs.readFileSync(Path + "/Plugin/plugin.json").toString())
                for (let index = 0; index < Json.length; index++) {
                    if (index == 0 || plugin.includes(Json[index]["name"])) {
                        msg = msg + "名稱: " + Json[index]["name"]
                        if (Json[index]["name"] == "pluginLoader") {
                            var fun = await reload('../Core/' + Json[index]["name"])
                        } else {
                            var fun = await reload('../Plugin/' + Json[index]["name"])
                        }
                        msg = msg + " 版本: " + fun.Plugin.version + " \n作者: " + fun.Plugin.author + " 狀態: "
                        if (Json[index]["reclaimed"] == true) {
                            msg = msg + "🟥 已停止支援\n\n"
                        } else {
                            var json1 = await fetch("https://raw.githubusercontent.com/" + Json[index]["url"] + "version.json")
                            var Json1 = await json1.json()
                            if (Json1[0]["reclaimed"] == true) {
                                msg = msg + "🟥 此 版本 已停止支援\n\n"
                            } else {
                                if (fun.Plugin.version == Json1[0]["name"]) {
                                    msg = msg + "🟩 已是最新版本\n\n"
                                } else {
                                    if (Json1[0]["Pre-Release"] == false) {
                                        msg = msg + "🟨 發現新版本 "
                                        for (let index = 0; index < Json1.length; index++) {
                                            if (Json1[index]["name"] == fun.Plugin.version) {
                                                if (Json1[index]["reclaimed"] == true) {
                                                    msg = msg + "🟥 此 版本 已停止支援"
                                                }
                                                break
                                            }
                                        }
                                        msg = msg + "\n\n"
                                    } else {
                                        for (let index = 0; index < Json1.length; index++) {
                                            if (Json1[index]["Pre-Release"] == false) {
                                                if (Json1[index]["reclaimed"] == true) {
                                                    msg = msg + "🟥 此 版本 已停止支援\n\n"
                                                } else if (fun.Plugin.version == Json1[index]["name"]) {
                                                    msg = msg + "🟩 已是最新版本\n\n"
                                                } else {
                                                    msg = msg + "🟨 發現新版本\n\n"
                                                }
                                                break
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                await message.reply(await embed(msg))
            } else {
                let args = message.content.replace("$plugin info ", "").split(" ")
                let msg = `${args} 插件訊息\n`
                var json = await fetch("https://raw.githubusercontent.com/ExpTechTW/MPR/%E4%B8%BB%E8%A6%81%E7%9A%84-(main)/repositories.json")
                var Json = await json.json()
                for (let index = 0; index < Json.length; index++) {
                    if (Json[index]["name"] == args[0]) {
                        var json1 = await fetch("https://raw.githubusercontent.com/" + Json[index]["url"] + "version.json")
                        var Json1 = await json1.json()
                        if (Json[index]["name"] == "pluginLoader") {
                            var fun = await reload('../Core/' + Json[index]["name"])
                        } else {
                            var fun = await reload('../Plugin/' + Json[index]["name"])
                        }
                        msg = msg + "名稱: " + fun.Plugin.name + " 版本: " + fun.Plugin.version + " 作者: " + fun.Plugin.author + "\n🔌 pluginLoader: " + fun.Plugin.depends.pluginLoader + "\n🟦 最新版本: " + Json1[0]["name"]
                        for (let index = 0; index < Json1.length; index++) {
                            if (Json1[index]["Pre-Release"] == false) {
                                msg = msg + " 🟩 最新穩定版: " + Json1[index]["name"]
                                break
                            }
                        }
                    }
                }
                await message.reply(await embed(msg))
            }
        } else if (await permission(message.author.id) < 3 && message.author.id != client.user.id) {
            await message.reply(await embed(`權限不足`))
            return
        } else if (message.content.startsWith("$plugin uninstall ") || message.content.startsWith("$plugin u ")) {
            let msg = ""
            let Name = message.content.replace("$plugin uninstall ", "").replace("$plugin u ", "")
            msg = msg + "⏳ 正在檢索 插件 資料夾...\n"
            let MSG = await message.reply(await embed(msg))
            let plugin = JSON.parse(fs.readFileSync(Path + "/Plugin/plugin.json").toString())
            if (!plugin.includes(Name) || Name == "pluginLoader") {
                msg = msg + "🟨 未發現此 插件\n"
                edit(client, MSG.channel.id, MSG.id, await embed(msg))
                return
            } else {
                try {
                    msg = msg + "⏳ 撤銷 事件監聽...\n⏳ 撤銷 插件訊息...\n⏳ 撤銷 插件指令...\n"
                    edit(client, MSG.channel.id, MSG.id, await embed(msg))
                    plugin.splice(plugin.indexOf(Name), 1)
                    fs.writeFileSync(Path + "/Plugin/plugin.json", JSON.stringify(plugin, null, "\t"))
                    fs.unlinkSync(Path + "/Plugin/" + Name + ".js")
                    msg = msg + "🟩 插件 卸載 完成"
                    edit(client, MSG.channel.id, MSG.id, await embed(msg))
                } catch (error) {
                    msg = msg + `🟥 插件 卸載 過程出錯了 請向 插件 作者聯繫\n錯誤碼:\n${error}\n`
                    edit(client, MSG.channel.id, MSG.id, await embed(msg))
                }
            }
        } else if (message.content.startsWith("$plugin install ") || message.content.startsWith("$plugin i ")) {
            let msg = ""
            let command = message.content.replace("$plugin install ", "").replace("$plugin i ", "").split(" ")
            let Name = command[0]
            let VER = null
            msg = msg + "⏳ 正在下載 " + Name + ".js 檔案...\n"
            let MSG = await message.reply(await embed(msg))
            if (command.length != 1) {
                VER = command[1]
                if (VER == "dev") {
                    msg = msg + "🟦 版本:  最後一個 版本 (含 DEV)\n"
                } else {
                    msg = msg + "🟦 版本: " + VER + "\n"
                }
            } else {
                msg = msg + "🟦 版本:  最後一個 穩定版本\n"
            }
            edit(client, MSG.channel.id, MSG.id, await embed(msg))
            let down = await downloader(Name, VER)
            if (!down.state) {
                msg = msg + "🟥 下載過程出錯了 請向 插件 作者聯繫\n錯誤碼:\n" + down.res
                edit(client, MSG.channel.id, MSG.id, await embed(msg))
            } else {
                if (down.safe) {
                    msg = msg + "🟦 使用 嚴格模式\n"
                } else {
                    msg = msg + "🟨 未使用 嚴格模式\n"
                }
                edit(client, MSG.channel.id, MSG.id, await embed(msg))
                msg = msg + "🟦 下載完成 版本: " + down.res + "\n"
                edit(client, MSG.channel.id, MSG.id, await embed(msg))
                if (Name == "pluginLoader") {
                    msg = msg + "🟩 pluginLoader 更新 完成"
                    edit(client, MSG.channel.id, MSG.id, await embed(msg))
                    return
                }
                try {
                    msg = msg + "⏳ 正在讀取文件...\n"
                    edit(client, MSG.channel.id, MSG.id, await embed(msg))
                    var fun = await reload('../Plugin/' + Name + "-Cache")
                    msg = msg + "⏳ 校驗文件合法性...\n"
                    edit(client, MSG.channel.id, MSG.id, await embed(msg))
                    if (fun.Plugin == undefined || fun.Plugin.Events == undefined || fun.Plugin.Commands == undefined || fun.Plugin.version == undefined || fun.Plugin.name == undefined || fun.Plugin.author == undefined || fun.Plugin.depends == undefined || fun.Plugin.depends.pluginLoader == undefined) {
                        msg = msg + "🟨 已清除 插件 緩存\n🟥 文件內容不合法 請向 插件 作者聯繫\n"
                        edit(client, MSG.channel.id, MSG.id, await embed(msg))
                        fs.unlinkSync(Path + "/Plugin/" + Name + "-Cache.js")
                    } else {
                        if (fun.Plugin.depends != undefined && fun.Plugin.depends.lenght != 0) {
                            for (let index = 0; index < fun.Plugin.depends.length; index++) {
                                let channels = await client.channels.cache.get(MSG.channel.id)
                                await channels.send(`$plugin i ${fun.Plugin.depends[index]}`)
                                msg = msg + `⏳ 正在安裝 ${fun.Plugin.depends[index]} 依賴插件...\n`
                                edit(client, MSG.channel.id, MSG.id, await embed(msg))
                            }
                        }
                        msg = msg + "⏳ 註冊 事件監聽...\n⏳ 註冊 插件訊息...\n⏳ 註冊 插件指令...\n"
                        edit(client, MSG.channel.id, MSG.id, await embed(msg))
                        let plugin = JSON.parse(fs.readFileSync(Path + "/Plugin/plugin.json").toString())
                        if (!await compatible(fun.Plugin.depends.pluginLoader)) {
                            msg = msg + "🟨 插件 不兼容 當前 pluginLoader\n解決方法:\n1. 更新 pluginLoader\n2. 請 插件 作者適配\n🟨 已清除 插件 緩存\n🟥 插件 安裝 失敗\n"
                            edit(client, MSG.channel.id, MSG.id, await embed(msg))
                            fs.unlinkSync(Path + "/Plugin/" + Name + "-Cache.js")
                            return
                        }
                        fs.renameSync(Path + "/Plugin/" + Name + "-Cache.js", Path + "/Plugin/" + Name + ".js")
                        if (!plugin.includes(Name)) {
                            plugin.push(Name)
                        }
                        fs.writeFileSync(Path + "/Plugin/plugin.json", JSON.stringify(plugin, null, "\t"))
                        msg = msg + "🟩 插件 安裝 完成\n"
                        edit(client, MSG.channel.id, MSG.id, await embed(msg))
                    }
                } catch (error) {
                    msg = msg + `🟨 已清除 插件 緩存\n🟥 插件 安裝 過程出錯了 請向 插件 作者聯繫\n錯誤碼:\n${error}\n`
                    edit(client, MSG.channel.id, MSG.id, await embed(msg))
                    fs.unlinkSync(Path + "/Plugin/" + Name + "-Cache.js")
                }
            }
        }
    } catch (error) {
        log(`Error >> pluginLoader 運行出錯 請向 插件 作者聯繫\n錯誤碼:\n${error}`)
    }
}

async function permission(user) {
    let User = JSON.parse(fs.readFileSync(Path + "/permission.json").toString())
    for (let index = 0; index < User.length; index++) {
        if (User[index]["ID"] == user || User[index]["name"] == user) {
            return Number(User[index]["permission"])
        }
    }
    return 1
}

async function edit(client, channel, msgID, msg) {
    try {
        let channels = await client.channels.cache.get(channel)
        let MSG = await channels.messages.fetch(msgID)
        MSG.edit(msg)
        return true
    } catch (error) {
        return false
    }
}

async function ver() {
    if (Version != "") return Version
    if (fs.existsSync('./Data/config.json')) {
        let configFile = JSON.parse(fs.readFileSync('./Data/config.json').toString())
        Version = configFile["version"]
        return configFile["version"]
    }
}

async function compatible(ver) {
    let Ver = Plugin.version
    if (ver.includes(Plugin.version)) {
        return true
    } else if (ver.includes("All")) {
        return true
    } else if (ver.includes(Ver.substring(0, 1) + ".X.X")) {
        return true
    } else if (ver.includes(Ver.substring(0, 1) + "." + Ver.substring(2, 1) + ".X")) {
        return true
    } else if (Ver.includes("w") && ver.includes(Ver.substring(0, 5))) {
        return true
    }
    return false
}

async function downloader(name, ver) {
    try {
        var json = await fetch("https://raw.githubusercontent.com/ExpTechTW/MPR/%E4%B8%BB%E8%A6%81%E7%9A%84-(main)/repositories.json")
        var Json = await json.json()
        let url = ""
        for (let index = 0; index < Json.length; index++) {
            if (Json[index]["name"] == name) {
                url = Json[index]["url"]
                if (Json[index]["reclaimed"] == true) return { state: false, res: "此插件已停止支援" }
                break
            }
        }
        if (url == "") return { state: false, res: "無法取得下載地址" }
        var json = await fetch("https://raw.githubusercontent.com/" + url + "version.json")
        var Json = await json.json()
        if (ver == (undefined || null)) {
            for (let index = 0; index < Json.length; index++) {
                if (Json[index]["Pre-Release"] == false) {
                    if (Json[index]["reclaimed"] == true) return { state: false, res: "此 插件 版本 已停止支援" }
                    ver = Json[index]["name"]
                    break
                }
            }
        }
        else if (ver == "dev") {
            if (Json[0]["reclaimed"] == true) return { state: false, res: "此 插件 版本 已停止支援" }
            ver = Json[0]["name"]
        } else {
            for (let index = 0; index < Json.length; index++) {
                if (Json[index]["name"] == ver) {
                    if (Json[index]["reclaimed"] == true) return { state: false, res: "此 插件 版本 已停止支援" }
                    break
                }
            }
        }

        let res = await fetch("https://raw.githubusercontent.com/" + url + "version/" + name + "-" + ver + ".js")
        if (res.status != 200) {
            return { state: false, res: "無法取得下載檔案" }
        } else {
            let PATH = ""
            if (name == "pluginLoader") {
                PATH = Path + "/Core/" + name + ".js"
            } else {
                PATH = Path + "/Plugin/" + name + "-Cache.js"
            }
            let text = await res.text()
            fs.writeFileSync(PATH, text, 'utf8')
            return { state: true, res: ver, safe: text.replaceAll('"', "").replaceAll("'", "").replaceAll(" ", "").startsWith('usestrict') }
        }
    } catch (error) {
        return { state: false, res: error }
    }
}

async function embed(msg, color, author, icon) {
    if (color == (undefined || null)) {
        color = '#0099ff'
    }
    if (msg.length > 500) return false
    if (author != (undefined || null) && icon != (undefined || null)) {
        let exampleEmbed = new MessageEmbed()
            .setColor(color)
            .setDescription(msg)
            .setTimestamp()
            .setFooter({ text: author, iconURL: icon })
        return { embeds: [exampleEmbed] }
    } else {
        const exampleEmbed = new MessageEmbed()
            .setColor(color)
            .setDescription(msg)
            .setTimestamp()
        return { embeds: [exampleEmbed] }
    }
}

async function log(msg, client) {
    if (client != undefined && fs.existsSync('./Data/config.json')) {
        let data = JSON.parse(fs.readFileSync(Path + "/Data/config.json").toString())
        try {
            if (msg.startsWith("Info")) {
                msg = "🟩 " + msg
            } else if (msg.startsWith("Warn")) {
                msg = "🟨 " + msg
            } else {
                msg = "🟥 " + msg
            }
            await client.channels.cache.get(data["bot_console"]).send(msg)
        } catch (error) {
            console.log("\x1b[31mDiscord Log Error\x1b[0m")
        }
    }
    if (msg.startsWith("Info")) {
        console.log("\x1b[32m" + msg + "\x1b[0m")
    } else if (msg.startsWith("Warn")) {
        console.log("\x1b[33m" + msg + "\x1b[0m")
    } else {
        console.log("\x1b[31m" + msg + "\x1b[0m")
    }
}

module.exports = {
    messageCreate,
    ready,
    plugin,
    ver,
    Plugin,
    embed,
    edit,
    log,
    permission,
    messageReactionAdd,
    channelCreate,
    channelDelete,
    messageReactionRemove,
    messageDelete,
    messageUpdate,
}