'use strict'

const Info = {
    "version": "1.4.0",
    "pluginLoader": ["All"],
    "name": "pluginLoader",
    "author": "whes1015"
}

const Commands = [
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
]

const reload = require('require-reload')(require)
const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js')
const fs = require('fs')
const path = require("path")
const Path = path.resolve("")

let Ver = ""

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
        var fun = await reload('../Plugin/' + plugin[index])
        if (message.content.startsWith("$")) {
            for (let Index = 0; Index < fun.Commands.length; Index++) {
                if (message.content.includes(fun.Commands[Index]["name"])) {
                    if (fun.Commands[Index]["permission"] != undefined && await permission(message.author.id) < Number(fun.Commands[Index]["permission"])) {
                        await message.reply(await embed(`權限不足`))
                        return
                    } else {
                        break
                    }
                }
            }
        }
        if (fun.Event.includes("messageCreate")) {
            if (await compatible(fun.Info.pluginLoader)) {
                try {
                    fun.messageCreate(client, message)
                } catch (error) {
                    log(`Error >> ${plugin[index]} 運行出錯 請向 插件 作者聯繫\n錯誤碼:\n${error}`)
                }
            }
        }
    }
}

async function ready(client) {
    let plugin = JSON.parse(fs.readFileSync(Path + "/Plugin/plugin.json").toString())
    for (let index = 0; index < plugin.length; index++) {
        var fun = reload('../Plugin/' + plugin[index])
        if (fun.Event.includes("ready")) {
            if (await compatible(fun.Info.pluginLoader)) {
                try {
                    fun.ready(client)
                } catch (error) {
                    log(`Error >> ${plugin[index]} 運行出錯 請向 插件 作者聯繫\n錯誤碼:\n${error}`)
                }
            }
        }
    }
}

async function messageReactionAdd(reaction, user) {
    let plugin = JSON.parse(fs.readFileSync(Path + "/Plugin/plugin.json").toString())
    for (let index = 0; index < plugin.length; index++) {
        var fun = reload('../Plugin/' + plugin[index])
        if (fun.Event.includes("messageReactionAdd")) {
            if (await compatible(fun.Info.pluginLoader)) {
                try {
                    fun.messageReactionAdd(reaction, user)
                } catch (error) {
                    log(`Error >> ${plugin[index]} 運行出錯 請向 插件 作者聯繫\n錯誤碼:\n${error}`)
                }
            }
        }
    }
}

async function channelCreate(channel) {
    let plugin = JSON.parse(fs.readFileSync(Path + "/Plugin/plugin.json").toString())
    for (let index = 0; index < plugin.length; index++) {
        var fun = reload('../Plugin/' + plugin[index])
        if (fun.Event.includes("channelCreate")) {
            if (await compatible(fun.Info.pluginLoader)) {
                try {
                    fun.channelCreate(channel)
                } catch (error) {
                    log(`Error >> ${plugin[index]} 運行出錯 請向 插件 作者聯繫\n錯誤碼:\n${error}`)
                }
            }
        }
    }
}

async function channelDelete(channel) {
    let plugin = JSON.parse(fs.readFileSync(Path + "/Plugin/plugin.json").toString())
    for (let index = 0; index < plugin.length; index++) {
        var fun = reload('../Plugin/' + plugin[index])
        if (fun.Event.includes("channelDelete")) {
            if (await compatible(fun.Info.pluginLoader)) {
                try {
                    fun.channelDelete(channel)
                } catch (error) {
                    log(`Error >> ${plugin[index]} 運行出錯 請向 插件 作者聯繫\n錯誤碼:\n${error}`)
                }
            }
        }
    }
}

async function messageReactionRemove(reaction, user) {
    let plugin = JSON.parse(fs.readFileSync(Path + "/Plugin/plugin.json").toString())
    for (let index = 0; index < plugin.length; index++) {
        var fun = reload('../Plugin/' + plugin[index])
        if (fun.Event.includes("messageReactionRemove")) {
            if (await compatible(fun.Info.pluginLoader)) {
                try {
                    fun.messageReactionRemove(reaction, user)
                } catch (error) {
                    log(`Error >> ${plugin[index]} 運行出錯 請向 插件 作者聯繫\n錯誤碼:\n${error}`)
                }
            }
        }
    }
}

async function messageDelete(message) {
    let plugin = JSON.parse(fs.readFileSync(Path + "/Plugin/plugin.json").toString())
    for (let index = 0; index < plugin.length; index++) {
        var fun = reload('../Plugin/' + plugin[index])
        if (fun.Event.includes("messageDelete")) {
            if (await compatible(fun.Info.pluginLoader)) {
                try {
                    fun.messageDelete(message)
                } catch (error) {
                    log(`Error >> ${plugin[index]} 運行出錯 請向 插件 作者聯繫\n錯誤碼:\n${error}`)
                }
            }
        }
    }
}

async function messageUpdate(oldmessage, newmessage) {
    let plugin = JSON.parse(fs.readFileSync(Path + "/Plugin/plugin.json").toString())
    for (let index = 0; index < plugin.length; index++) {
        var fun = reload('../Plugin/' + plugin[index])
        if (fun.Event.includes("messageUpdate")) {
            if (await compatible(fun.Info.pluginLoader)) {
                try {
                    fun.messageUpdate(oldmessage, newmessage)
                } catch (error) {
                    log(`Error >> ${plugin[index]} 運行出錯 請向 插件 作者聯繫\n錯誤碼:\n${error}`)
                }
            }
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
                if (permission(message.author.id) < 3) {
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
                for (let index = 0; index < Commands.length; index++) {
                    msg = msg + Commands[index]["name"] + " : " + Commands[index]["note"] + "\n"
                }
                msg = msg + "\n"
                for (let index = 0; index < plugin.length; index++) {
                    var fun = reload('../Plugin/' + plugin[index])
                    for (let index = 0; index < fun.Commands.length; index++) {
                        msg = msg + fun.Commands[index]["name"] + " : " + fun.Commands[index]["note"] + "\n"
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
                            for (let index = 0; index < fun.Commands.length; index++) {
                                msg = msg + fun.Commands[index]["name"] + " : " + fun.Commands[index]["note"] + "\n"
                            }
                            msg = msg + "\n"
                        }
                    }
                }
                await message.reply(await embed(msg))
            }
        } else if (permission(message.author.id) < 3) {
            await message.reply(await embed(`權限不足`))
            return
        } else if (message.content == "$plugin check") {
            var json = await fetch("https://raw.githubusercontent.com/ExpTechTW/MPR/%E4%B8%BB%E8%A6%81%E7%9A%84-(main)/repositories.json")
            var Json = await json.json()
            let msg = "插件狀態\n"
            let plugin = JSON.parse(fs.readFileSync(Path + "/Plugin/plugin.json").toString())
            for (let index = 0; index < Json.length; index++) {
                if (index == 0 || plugin.includes(Json[index]["name"])) {
                    msg = msg + "名稱: " + Json[index]["name"] + " 狀態: "
                    if (Json[index]["name"] == "pluginLoader") {
                        var fun = await reload('../Core/' + Json[index]["name"])
                    } else {
                        var fun = await reload('../Plugin/' + Json[index]["name"])
                    }
                    if (Json[index]["reclaimed"] == true) {
                        msg = msg + "🟥 已停止支援\n"
                    } else {
                        var json1 = await fetch("https://raw.githubusercontent.com/" + Json[index]["url"] + "version.json")
                        var Json1 = await json1.json()
                        if (Json1[0]["reclaimed"] == true) {
                            msg = msg + "🟥 此 版本 已停止支援\n"
                        } else {
                            if (fun.Info.version == Json1[0]["name"]) {
                                msg = msg + "🟩 已是最新版本\n"
                            } else {
                                if (Json1[0]["Pre-Release"] == false) {
                                    msg = msg + "🟨 發現新版本 "
                                    for (let index = 0; index < Json1.length; index++) {
                                        if (Json1[index]["name"] == fun.Info.version) {
                                            if (Json1[index]["reclaimed"] == true) {
                                                msg = msg + "🟥 此 版本 已停止支援"
                                            }
                                            break
                                        }
                                    }
                                    msg = msg + "\n"
                                } else {
                                    for (let index = 0; index < Json1.length; index++) {
                                        if (Json1[index]["Pre-Release"] == false) {
                                            if (Json1[index]["reclaimed"] == true) {
                                                msg = msg + "🟥 此 版本 已停止支援\n"
                                            } else if (fun.Info.version == Json1[index]["name"]) {
                                                msg = msg + "🟩 已是最新版本\n"
                                            } else {
                                                msg = msg + "🟨 發現新版本\n"
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
        } else if (message.content.startsWith("$plugin info")) {
            if (message.content == "$plugin info") {
                let msg = "插件列表\n名稱: " + Info.name + " 版本: " + Info.version + " 作者: " + Info.author + "\n"
                let plugin = JSON.parse(fs.readFileSync(Path + "/Plugin/plugin.json").toString())
                for (let index = 0; index < plugin.length; index++) {
                    var fun = reload('../Plugin/' + plugin[index])
                    msg = msg + "名稱: " + fun.Info.name + " 版本: " + fun.Info.version + " 作者: " + fun.Info.author + "\n"
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
                        msg = msg + "名稱: " + fun.Info.name + " 版本: " + fun.Info.version + " 作者: " + fun.Info.author + "\npluginLoader: " + fun.Info.pluginLoader + "\n最新版本: " + Json1[0]["name"]
                        for (let index = 0; index < Json1.length; index++) {
                            if (Json1[index]["Pre-Release"] == false) {
                                msg = msg + " 最新穩定版: " + Json1[index]["name"]
                                break
                            }
                        }
                    }
                }
                await message.reply(await embed(msg))
            }
        } else if (message.content.startsWith("$plugin uninstall ") || message.content.startsWith("$plugin u ")) {
            let msg = ""
            let Name = message.content.replace("$plugin uninstall ", "").replace("$plugin u ", "")
            msg = msg + "🟦 正在檢索 插件 資料夾...\n"
            let MSG = await message.reply(await embed(msg))
            let plugin = JSON.parse(fs.readFileSync(Path + "/Plugin/plugin.json").toString())
            if (!plugin.includes(Name) || Name == "pluginLoader") {
                msg = msg + "🟨 未發現此 插件\n"
                edit(client, MSG.channel.id, MSG.id, await embed(msg))
                return
            } else {
                try {
                    msg = msg + "🟦 撤銷 事件監聽...\n🟦 撤銷 插件訊息...\n🟦 撤銷 插件指令...\n"
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
            msg = msg + "🟦 正在下載 " + Name + ".js 檔案...\n"
            let MSG = await message.reply(await embed(msg))
            if (command.length != 1) {
                VER = command[1]
                if (VER == "dev") {
                    msg = msg + "🟦 版本:  最後一個版本 (含 DEV)\n"
                } else {
                    msg = msg + "🟦 版本: " + VER + "\n"
                }
            } else {
                msg = msg + "🟦 版本:  最後一個版本\n"
            }
            edit(client, MSG.channel.id, MSG.id, await embed(msg))
            let down = await downloader(Name, VER)
            if (!down.state) {
                msg = msg + "🟥 下載過程出錯了 請向 插件 作者聯繫\n錯誤碼:\n" + down.res
                edit(client, MSG.channel.id, MSG.id, await embed(msg))
            } else {
                msg = msg + "🟦 下載完成 版本: " + down.res + "\n"
                edit(client, MSG.channel.id, MSG.id, await embed(msg))
                if (Name == "pluginLoader") {
                    msg = msg + "🟩 pluginLoader 更新 完成"
                    edit(client, MSG.channel.id, MSG.id, await embed(msg))
                    return
                }
                try {
                    msg = msg + "🟦 正在讀取文件...\n"
                    edit(client, MSG.channel.id, MSG.id, await embed(msg))
                    var fun = await reload('../Plugin/' + Name)
                    msg = msg + "🟦 校驗文件合法性...\n"
                    edit(client, MSG.channel.id, MSG.id, await embed(msg))
                    if (fun.Info == undefined || fun.Event == undefined || fun.Commands == undefined) {
                        msg = msg + "🟥 文件內容不合法 請向 插件 作者聯繫\n"
                        edit(client, MSG.channel.id, MSG.id, await embed(msg))
                    } else {
                        msg = msg + "🟦 註冊 事件監聽...\n🟦 註冊 插件訊息...\n🟦 註冊 插件指令...\n"
                        edit(client, MSG.channel.id, MSG.id, await embed(msg))
                        let plugin = JSON.parse(fs.readFileSync(Path + "/Plugin/plugin.json").toString())
                        if (!plugin.includes(Name)) {
                            plugin.push(Name)
                        }
                        fs.writeFileSync(Path + "/Plugin/plugin.json", JSON.stringify(plugin, null, "\t"))
                        if (!await compatible(fun.Info.pluginLoader)) {
                            msg = msg + "🟨 插件 不兼容 當前 pluginLoader\n雖然不會導致錯誤，但是插件並不會被執行\n解決方法:\n1. 更新 pluginLoader\n2. 請插件作者適配\n"
                            edit(client, MSG.channel.id, MSG.id, await embed(msg))
                        }
                        msg = msg + "🟩 插件 安裝 完成"
                        edit(client, MSG.channel.id, MSG.id, await embed(msg))
                    }
                } catch (error) {
                    msg = msg + `🟥 插件 安裝 過程出錯了 請向 插件 作者聯繫\n錯誤碼:\n${error}\n`
                    edit(client, MSG.channel.id, MSG.id, await embed(msg))
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

function ver(ver) {
    if (Ver == "") {
        Ver = ver
    } else {
        return Ver
    }
}

async function compatible(ver) {
    let Ver = Info.version
    if (ver.includes(Info.version)) {
        return true
    } else if (ver.includes("All")) {
        return true
    } else if (ver.includes(Ver.substring(0, 1) + ".X.X")) {
        return true
    } else if (ver.includes(Ver.substring(0, 1) + "." + Ver.substring(2, 1) + ".X")) {
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
                PATH = Path + "/Plugin/" + name + ".js"
            }
            fs.writeFileSync(PATH, await res.text(), 'utf8')
            return { state: true, res: ver }
        }
    } catch (error) {
        return { state: false, res: error }
    }
}

async function embed(msg, color, author, icon) {
    if (color == (undefined || null)) {
        color = '#0099ff'
    }
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
    downloader,
    Info,
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