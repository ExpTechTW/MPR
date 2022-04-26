'use strict'

const Plugin = {
    "name": "pluginLoader",
    "version": "4.6.0",
    "depends": {
        "index": ">=3.1.0"
    },
    "Commands": [
        {
            "name": "mpr",
            "note": "關於 MPR 機器人",
            "permission": 1
        },
        {
            "name": "help [插件]",
            "note": "指令列表",
            "permission": 1
        },
        {
            "name": "init",
            "note": "初始化 機器人"
        },
        {
            "name": "reload",
            "note": "重新加載 pluginLoader",
            "permission": 3
        },
        {
            "name": "plugin reload [插件]",
            "note": "重新加載 插件",
            "permission": 3
        },
        {
            "name": "plugin list",
            "note": "可安裝 插件 列表",
            "permission": 3
        },
        {
            "name": "plugin update",
            "note": "將全部 插件 更新至最新 [穩定版]",
            "permission": 3
        },
        {
            "name": "plugin install <插件>",
            "note": "安裝 插件",
            "permission": 3
        },
        {
            "name": "plugin uninstall <插件>",
            "note": "卸載 插件",
            "permission": 3
        },
        {
            "name": "plugin info [插件]",
            "note": "插件 資訊",
            "permission": 3
        },
        {
            "name": "permission <用戶ID> <等級>",
            "note": "設定用戶權限等級",
            "permission": 3
        },
        {
            "name": "permission <用戶ID>",
            "note": "查詢用戶權限等級",
            "permission": 1
        }
    ],
    "author": ["whes1015"], // 插件 作者
    "link": "https://github.com/ExpTechTW/MPR-pluginLoader", // 插件 GitHub 鏈接
    "resources": ["AGPL-3.0"], // 插件 開源協議
    "description": "MPR 插件 加載 及 管理 框架", // 插件介紹
    "DHL": false
}

const reload = require('require-reload')(require)
const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js')
const fs = require('fs')
const path = require("path")
const Path = path.resolve("")
const Prefix = require('../config').Prefix

let Reload = {}
let Version = ""

async function messageCreate(client, message) {
    if (message.content == Prefix + "mpr") {
        message.reply(await embed(`**MPR**\nMultifunctional Plugin Robot\n多功能插件機器人\n\n版本: ${await ver()}\n\nGitHub\nhttps://github.com/ExpTechTW/MPR`))
        return
    }
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
        if (Number(Ver.replaceAll(".", "")) < Number(Plugin.depends.index.replaceAll(".", "").replace(">=", ""))) {
            message.reply(await embed("請更新 index.js 檔案"))
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
    let plugin = fs.readdirSync(Path + "/Plugin/")
    for (let index = 0; index < plugin.length; index++) {
        try {
            if (!plugin[index].includes("-Cache.js") && Reload[plugin[index]].Plugin.DHL != undefined && Reload[plugin[index]].Plugin.DHL == false) {
                var fun = Reload[plugin[index]]
            } else {
                var fun = await reload('../Plugin/' + plugin[index])
            }
            if (message.content.startsWith(Prefix)) {
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
                message.content = message.content.replace(Prefix, "")
                fun.messageCreate(client, message)
            }
        } catch (error) {
            log(`Error >> ${plugin[index]} 運行出錯 請向 插件 作者聯繫\n錯誤碼:\n${error}`)
        }
    }
}

async function ready(client) {
    let plugin = fs.readdirSync(Path + "/Plugin/")
    for (let index = 0; index < plugin.length; index++) {
        try {
            if (plugin[index].includes("-Cache")) fs.unlinkSync(Path + "/Plugin/" + plugin[index])
            Reload[plugin[index]] = reload('../Plugin/' + plugin[index])
            if (Reload[plugin[index]].Plugin.Events.includes("ready")) {
                Reload[plugin[index]].ready(client)
            }
        } catch (error) {
            log(`Error >> ${plugin[index]} 運行出錯 請向 插件 作者聯繫\n錯誤碼:\n${error}`)
        }
    }
}

async function messageReactionAdd(reaction, user) {
    let plugin = fs.readdirSync(Path + "/Plugin/")
    for (let index = 0; index < plugin.length; index++) {
        try {
            if (!plugin[index].includes("-Cache.js") && Reload[plugin[index]].Plugin.DHL != undefined && Reload[plugin[index]].Plugin.DHL == false) {
                var fun = Reload[plugin[index]]
            } else {
                var fun = await reload('../Plugin/' + plugin[index])
            }
            if (fun.Plugin.Events.includes("messageReactionAdd")) {
                fun.messageReactionAdd(reaction, user)
            }
        } catch (error) {
            log(`Error >> ${plugin[index]} 運行出錯 請向 插件 作者聯繫\n錯誤碼:\n${error}`)
        }
    }
}

async function channelCreate(channel) {
    let plugin = fs.readdirSync(Path + "/Plugin/")
    for (let index = 0; index < plugin.length; index++) {
        try {
            if (!plugin[index].includes("-Cache.js") && Reload[plugin[index]].Plugin.DHL != undefined && Reload[plugin[index]].Plugin.DHL == false) {
                var fun = Reload[plugin[index]]
            } else {
                var fun = await reload('../Plugin/' + plugin[index])
            }
            if (fun.Plugin.Events.includes("channelCreate")) {
                fun.channelCreate(channel)
            }
        } catch (error) {
            log(`Error >> ${plugin[index]} 運行出錯 請向 插件 作者聯繫\n錯誤碼:\n${error}`)
        }
    }
}

async function channelDelete(channel) {
    let plugin = fs.readdirSync(Path + "/Plugin/")
    for (let index = 0; index < plugin.length; index++) {
        try {
            if (!plugin[index].includes("-Cache.js") && Reload[plugin[index]].Plugin.DHL != undefined && Reload[plugin[index]].Plugin.DHL == false) {
                var fun = Reload[plugin[index]]
            } else {
                var fun = await reload('../Plugin/' + plugin[index])
            }
            if (fun.Plugin.Events.includes("channelDelete")) {
                fun.channelDelete(channel)
            }
        } catch (error) {
            log(`Error >> ${plugin[index]} 運行出錯 請向 插件 作者聯繫\n錯誤碼:\n${error}`)
        }
    }
}

async function messageReactionRemove(reaction, user) {
    let plugin = fs.readdirSync(Path + "/Plugin/")
    for (let index = 0; index < plugin.length; index++) {
        try {
            if (!plugin[index].includes("-Cache.js") && Reload[plugin[index]].Plugin.DHL != undefined && Reload[plugin[index]].Plugin.DHL == false) {
                var fun = Reload[plugin[index]]
            } else {
                var fun = await reload('../Plugin/' + plugin[index])
            }
            if (fun.Plugin.Events.includes("messageReactionRemove")) {
                fun.messageReactionRemove(reaction, user)
            }
        } catch (error) {
            log(`Error >> ${plugin[index]} 運行出錯 請向 插件 作者聯繫\n錯誤碼:\n${error}`)
        }
    }
}

async function messageDelete(message) {
    let plugin = fs.readdirSync(Path + "/Plugin/")
    for (let index = 0; index < plugin.length; index++) {
        try {
            if (!plugin[index].includes("-Cache.js") && Reload[plugin[index]].Plugin.DHL != undefined && Reload[plugin[index]].Plugin.DHL == false) {
                var fun = Reload[plugin[index]]
            } else {
                var fun = await reload('../Plugin/' + plugin[index])
            }
            if (fun.Plugin.Events.includes("messageDelete")) {
                fun.messageDelete(message)
            }
        } catch (error) {
            log(`Error >> ${plugin[index]} 運行出錯 請向 插件 作者聯繫\n錯誤碼:\n${error}`)
        }
    }
}

async function messageUpdate(oldmessage, newmessage) {
    let plugin = fs.readdirSync(Path + "/Plugin/")
    for (let index = 0; index < plugin.length; index++) {
        try {
            if (!plugin[index].includes("-Cache.js") && !plugin[index].includes("-Cache.js") && Reload[plugin[index]].Plugin.DHL != undefined && Reload[plugin[index]].Plugin.DHL == false) {
                var fun = Reload[plugin[index]]
            } else {
                var fun = await reload('../Plugin/' + plugin[index])
            }
            if (fun.Plugin.Events.includes("messageUpdate")) {
                fun.messageUpdate(oldmessage, newmessage)
            }
        } catch (error) {
            log(`Error >> ${plugin[index]} 運行出錯 請向 插件 作者聯繫\n錯誤碼:\n${error}`)
        }
    }
}

async function plugin(client, message) {
    try {
        if (message.content.startsWith(Prefix + "permission")) {
            let args = message.content.replace(Prefix + "permission ", "").split(" ")
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
                    "name": null,
                    "permission": Number(args[1])
                }
                if (isNaN(args[0])) {
                    data.name = args[0]
                } else {
                    data.ID = args[0]
                }
                if (find == -1) {
                    User.push(data)
                } else {
                    User[find] = data
                }
                fs.writeFileSync(Path + "/permission.json", JSON.stringify(User, null, "\t"))
                await message.reply(await embed(`${args[0]} 權限等級 [設定]\n${await permission(args[0])}`))
            }
        } else if (message.content.startsWith(Prefix + "help")) {
            if (message.content == Prefix + "help") {
                let msg = "**pluginLoader**\n"
                let plugin = fs.readdirSync(Path + "/Plugin/")
                for (let index = 0; index < Plugin.Commands.length; index++) {
                    msg = msg + Prefix + Plugin.Commands[index]["name"] + " : " + Plugin.Commands[index]["note"] + "\n"
                }
                msg = msg + "\n"
                for (let index = 0; index < plugin.length; index++) {
                    if (!plugin[index].includes("-Cache.js") && Reload[plugin[index]].Plugin.DHL != undefined && Reload[plugin[index]].Plugin.DHL == false) {
                        var fun = Reload[plugin[index]]
                    } else {
                        var fun = await reload('../Plugin/' + plugin[index])
                    }
                    if (fun.Plugin.Commands.length != 0) {
                        await message.reply(await embed(msg))
                        msg = ""
                        msg = msg + `**${fun.Plugin.name}**\n`
                    }
                    for (let index = 0; index < fun.Plugin.Commands.length; index++) {
                        msg = msg + Prefix + fun.Plugin.Commands[index]["name"] + " : " + fun.Plugin.Commands[index]["note"] + "\n"
                    }
                    msg = msg + "\n"
                }
                await message.reply(await embed(msg))
            } else {
                let args = message.content.replace(Prefix + "help ", "").split(" ")
                let msg = `**${args}**\n`
                if (args[0] == "pluginLoader") {
                    for (let index = 0; index < Plugin.Commands.length; index++) {
                        msg = msg + Plugin.Commands[index]["name"] + " : " + Plugin.Commands[index]["note"] + "\n"
                    }
                } else {
                    let plugin = fs.readdirSync(Path + "/Plugin/")
                    for (let index = 0; index < plugin.length; index++) {
                        if (args + ".js" == plugin[index]) {
                            if (!plugin[index].includes("-Cache.js") && Reload[plugin[index]].Plugin.DHL != undefined && Reload[plugin[index]].Plugin.DHL == false) {
                                var fun = Reload[plugin[index]]
                            } else {
                                var fun = await reload('../Plugin/' + plugin[index])
                            }
                            for (let index = 0; index < fun.Plugin.Commands.length; index++) {
                                msg = msg + Prefix + fun.Plugin.Commands[index]["name"] + " : " + fun.Plugin.Commands[index]["note"] + "\n"
                            }
                            msg = msg + "\n"
                        }
                    }
                }
                await message.reply(await embed(msg))
            }
        } else if (message.content.startsWith(Prefix + "plugin reload")) {
            if (message.content == Prefix + "plugin reload") {
                let plugin = fs.readdirSync(Path + "/Plugin/")
                for (let index = 0; index < plugin.length; index++) {
                    try {
                        Reload[plugin[index]] = reload('../Plugin/' + plugin[index])
                    } catch (error) {
                        log(`Error >> ${plugin[index]} 運行出錯 請向 插件 作者聯繫\n錯誤碼:\n${error}`)
                    }
                }
                await message.reply(await embed(`⚠️ 已重新加載 所有插件 僅對關閉 DHL 的插件有效`))
            } else {
                let args = message.content.replace(Prefix + "plugin reload ", "").split(" ")
                if (fs.readdirSync(Path + "/Plugin/").includes(args[0] + ".js")) {
                    var fun = reload('../Plugin/' + args[0] + ".js")
                    if (fun.Plugin.DHL != undefined && fun.Plugin.DHL == false) {
                        try {
                            Reload[args[0] + ".js"] = fun
                            await message.reply(await embed(`⚠️ 已重新加載 ${args[0]}`))
                        } catch (error) {
                            log(`Error >> ${plugin[index]} 運行出錯 請向 插件 作者聯繫\n錯誤碼:\n${error}`)
                        }
                    } else {
                        await message.reply(await embed(`⚠️ 此 插件 已啟用 DHL`))
                    }
                } else {
                    await message.reply(await embed(`🟥 未發現此 插件`))
                }
            }
        } else if (message.content.startsWith(Prefix + "plugin list")) {
            message.reply(await embed(`**MPR**\nMultifunctional Plugin Robot\n多功能插件機器人\n\n插件列表: https://github.com/ExpTechTW/MPR/blob/%E4%B8%BB%E8%A6%81%E7%9A%84-(main)/PLUGIN.md\n\nGitHub\nhttps://github.com/ExpTechTW/MPR`))
        } else if (message.content.startsWith(Prefix + "plugin update")) {
            let plugin = fs.readdirSync(Path + "/Plugin/")
            client.channels.cache.get(message.channel.id).send(Prefix + "plugin i pluginLoader")
            for (let index = 0; index < plugin.length; index++) {
                client.channels.cache.get(message.channel.id).send(Prefix + "plugin i " + plugin[index].replace(".js", ""))
            }
        } else if (message.content.startsWith(Prefix + "plugin info")) {
            if (message.content == Prefix + "plugin info") {
                var json = await fetch("https://raw.githubusercontent.com/ExpTechTW/MPR/%E4%B8%BB%E8%A6%81%E7%9A%84-(main)/repositories.json")
                var Json = await json.json()
                let msg = "插件列表\n"
                let plugin = fs.readdirSync(Path + "/Plugin/")
                for (let index = 0; index < Json.length; index++) {
                    if (index == 0 || plugin.includes(Json[index]["name"] + ".js")) {
                        msg = msg + "名稱: " + Json[index]["name"]
                        if (Json[index]["name"] == "pluginLoader") {
                            var fun = await reload('../Core/' + Json[index]["name"])
                        } else {
                            var fun = await reload('../Plugin/' + Json[index]["name"])
                        }
                        msg = msg + " 版本: " + fun.Plugin.version + " \n作者: " + fun.Plugin.author + "\n狀態: "
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
                let args = message.content.replace(Prefix + "plugin info ", "").split(" ")
                let msg = `${args} 插件訊息\n`
                var json = await fetch("https://raw.githubusercontent.com/ExpTechTW/MPR/%E4%B8%BB%E8%A6%81%E7%9A%84-(main)/repositories.json")
                var Json = await json.json()
                for (let index = 0; index < Json.length; index++) {
                    if (Json[index]["name"] == args[0]) {
                        var json1 = await fetch("https://raw.githubusercontent.com/" + Json[index]["url"] + "version.json")
                        var Json1 = await json1.json()
                        if (Json[index]["name"] == "pluginLoader") {
                            var fun = { Plugin: Plugin }
                        } else {
                            var fun = await reload('../Plugin/' + Json[index]["name"])
                        }
                        let depends = ""
                        for (let index = 0; index < Object.keys(fun.Plugin.depends).length; index++) {
                            depends = depends + `名稱: ${Object.keys(fun.Plugin.depends)[index]} 版本: ${fun.Plugin.depends[Object.keys(fun.Plugin.depends)[index]]}`
                        }
                        msg = msg + "名稱: " + fun.Plugin.name + " 版本: " + fun.Plugin.version + "\n作者: " + fun.Plugin.author + "\n\n🔌 DHL ( Dynamic Hot Loading ):\n" + ((fun.Plugin.DHL) ?? "true") + "\n\n🔌 依賴:\n" + depends + "\n\n🟦 最新版本: " + Json1[0]["name"]
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
        } else if (message.content.startsWith(Prefix + "plugin uninstall ") || message.content.startsWith(Prefix + "plugin u ")) {
            let msg = ""
            let Name = message.content.replace(Prefix + "plugin uninstall ", "").replace(Prefix + "plugin u ", "")
            msg = msg + "⏳ 正在檢索 插件 資料夾...\n"
            let MSG = await message.reply(await embed(msg))
            let plugin = fs.readdirSync(Path + "/Plugin/")
            if (!plugin.includes(Name + ".js") || Name == "pluginLoader") {
                msg = msg + "🟨 未發現此 插件\n"
                edit(client, MSG.channel.id, MSG.id, await embed(msg))
                return
            } else {
                try {
                    msg = msg + "⏳ 撤銷 事件監聽...\n⏳ 撤銷 插件訊息...\n⏳ 撤銷 插件指令...\n"
                    edit(client, MSG.channel.id, MSG.id, await embed(msg))
                    plugin.splice(plugin.indexOf(Name), 1)
                    fs.unlinkSync(Path + "/Plugin/" + Name + ".js")
                    msg = msg + "🟩 插件 卸載 完成"
                    edit(client, MSG.channel.id, MSG.id, await embed(msg))
                } catch (error) {
                    msg = msg + `🟥 插件 卸載 過程出錯了 請向 插件 作者聯繫\n錯誤碼:\n${error}\n`
                    edit(client, MSG.channel.id, MSG.id, await embed(msg))
                }
            }
        } else if (message.content.startsWith(Prefix + "plugin install ") || message.content.startsWith(Prefix + "plugin i ")) {
            let msg = ""
            let command = message.content.replace(Prefix + "plugin install ", "").replace(Prefix + "plugin i ", "").split(" ")
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
                    let body = fs.readFileSync(Path + '/Plugin/' + Name + "-Cache.js").toString().replaceAll("\r", "").split("\n")
                    let find = 0
                    let Body = "{"
                    let BODY = {}
                    for (let index = 0; index < body.length; index++) {
                        if (body[index].includes("Plugin")) {
                            find = 1
                        } else if (find == 1) {
                            Body = Body + body[index]
                            try {
                                BODY = JSON.parse(Body)
                            } catch (err) {
                                continue
                            }
                        }
                    }
                    msg = msg + "⏳ 校驗文件合法性...\n"
                    edit(client, MSG.channel.id, MSG.id, await embed(msg))
                    if (BODY == {} || BODY.Events == undefined || BODY.Commands == undefined || BODY.version == undefined || BODY.name == undefined || BODY.author == undefined || BODY.depends == undefined || BODY.depends.pluginLoader == undefined) {
                        msg = msg + "🟨 已清除 插件 緩存\n🟥 文件內容不合法 請向 插件 作者聯繫\n"
                        edit(client, MSG.channel.id, MSG.id, await embed(msg))
                        fs.unlinkSync(Path + "/Plugin/" + Name + "-Cache.js")
                    } else {
                        if (BODY.DHL == undefined || BODY.DHL == true) {
                            msg = msg + "🟦 啟用 DHL 模式\n"
                        } else {
                            msg = msg + "🟨 未啟用 DHL 模式\n"
                        }
                        edit(client, MSG.channel.id, MSG.id, await embed(msg))
                        msg = msg + "⏳ 註冊 事件監聽...\n⏳ 註冊 插件訊息...\n⏳ 註冊 插件指令...\n"
                        edit(client, MSG.channel.id, MSG.id, await embed(msg))
                        let fail = 0
                        for (let index = 0; index < Object.keys(BODY.depends).length; index++) {
                            if (Object.keys(BODY.depends)[index] != "pluginLoader") {
                                if (!fs.readdirSync(Path + "/Plugin/").includes(Object.keys(BODY.depends)[index] + ".js")) {
                                    msg = msg + "🟨 未檢測到 " + Object.keys(BODY.depends)[index] + " 依賴\n"
                                    edit(client, MSG.channel.id, MSG.id, await embed(msg))
                                    fail = 1
                                    continue
                                }
                                var cache = await reload('../Plugin/' + Object.keys(BODY.depends)[index])
                            } else {
                                var cache = { Plugin: Plugin }
                            }
                            if (!await compatible("pluginLoader", BODY.depends[Object.keys(BODY.depends)[index]], cache.Plugin.version)) {
                                msg = msg + `🟨 插件 不兼容 當前 ${Object.keys(BODY.depends)[index]}\n⬆️ 最低: ${BODY.depends[Object.keys(BODY.depends)[index]]} ⏺️ 當前: ${cache.Plugin.version}\n`
                                edit(client, MSG.channel.id, MSG.id, await embed(msg))
                                fail = 1
                            }
                        }
                        if (fail != 0) {
                            msg = msg + "🟨 已清除 插件 緩存\n🟥 插件 安裝 失敗\n"
                            edit(client, MSG.channel.id, MSG.id, await embed(msg))
                            fs.unlinkSync(Path + "/Plugin/" + Name + "-Cache.js")
                            return
                        }
                        fs.renameSync(Path + "/Plugin/" + Name + "-Cache.js", Path + "/Plugin/" + Name + ".js")
                        msg = msg + "🟩 插件 安裝 完成\n"
                        edit(client, MSG.channel.id, MSG.id, await embed(msg))
                        ready()
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

async function compatible(name, depend, ver) {
    if (fs.readdirSync(Path + "/Plugin/").includes(name) && depend == "*") return true
    var json = await fetch("https://raw.githubusercontent.com/ExpTechTW/MPR/%E4%B8%BB%E8%A6%81%E7%9A%84-(main)/repositories.json")
    var Json = await json.json()
    let url = ""
    for (let index = 0; index < Json.length; index++) {
        if (Json[index]["name"] == name) {
            url = Json[index]["url"]
            break
        }
    }
    if (url == "") return false
    var json = await fetch("https://raw.githubusercontent.com/" + url + "version.json")
    var Json = await json.json()
    let Depend = 0
    let Ver = 0
    for (let index = 0; index < Json.length; index++) {
        if (Json[index]["name"] == depend.replace(">=", "")) {
            Depend = index
        }
        if (Json[index]["name"] == ver) {
            Ver = index
        }
    }
    if (Depend < Ver) {
        return false
    } else {
        return true
    }
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
