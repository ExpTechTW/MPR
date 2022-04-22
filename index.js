'use strict'

let ver = "3.0.0"

var config
var Prefix
const reload = require('require-reload')(require)
const fs = require('fs')
const fetch = require('node-fetch')
const { Client, Intents } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS], partials: ['MESSAGE', 'CHANNEL', 'REACTION'], })
const path = require("path")
const Path = path.resolve("")
var pluginLoader = require('./Core/pluginLoader')

const url = "https://raw.githubusercontent.com/ExpTechTW/CMIR/%E4%B8%BB%E8%A6%81%E7%9A%84-(main)/Firmware"
init()

async function init() {
    log("Info >> 正在初始化機器人...")
    if (!fs.existsSync(Path + "/Plugin")) {
        log("Info >> 正在建立 Plugin 資料夾...")
        fs.mkdirSync(Path + "/Plugin")
    }
    if (!fs.existsSync(Path + "/Data")) {
        log("Info >> 正在建立 /Data 資料夾...")
        fs.mkdirSync(Path + "/Data")
    }
    if (!fs.existsSync(Path + "/Core")) {
        log("Info >> 正在建立 /Core 資料夾...")
        fs.mkdirSync(Path + "/Core")
    }
    if (!fs.existsSync(Path + '/Core/pluginLoader.js')) {
        log("Info >> 正在下載 /Core/pluginLoader.js 檔案...")
        let res = await fetch(url + '/Core/pluginLoader.js')
        fs.writeFileSync(Path + '/Core/pluginLoader.js', await res.text(), 'utf8')
    }
    if (!fs.existsSync(Path + '/config.js')) {
        log("Info >> 正在下載 /config.js 檔案...")
        let res = await fetch(url + '/config.js')
        fs.writeFileSync(Path + '/config.js', await res.text(), 'utf8')
    }
    config = reload('./config')
    Prefix = config.Prefix
    if (!fs.existsSync('./permission.json')) {
        fs.writeFileSync('./permission.json', JSON.stringify([], null, "\t"), 'utf8')
    }
    if (!fs.existsSync('./Data/config.json')) {
        log(`Warn >> 尚未配置機器人,在任意頻道中使用 ${Prefix}init 配置機器人`)
    }
    log(`Info >> 正在檢查機器人版本...`)
    const res = await fetch('https://api.github.com/repos/ExpTechTW/MPR/releases')
    const data = await res.json()
    let num = 0
    let last = ""
    for (let index = 0; index < data.length; index++) {
        if (config.PreRelease) {
            if (data[index]["tag_name"] != ver) {
                num++
                if (last == "") {
                    last = data[index]["tag_name"]
                }
            }
        } else {
            if (data[index]["prerelease"] == false && data[index]["tag_name"] != ver) {
                num++
                if (last == "") {
                    last = data[index]["tag_name"]
                }
            }
        }
        if (data[index]["tag_name"] == ver) break
    }
    if (num == 0) {
        log(`Info >> 已是最新版本`)
    } else {
        log(`Warn >> 最新版本: ${last} 當前落後最新版本 ${num} 個版本`)
    }
    if (config.Token == "") {
        log(`Error >> 請在 config.js 中 放入 機器人 Token`)
        process.exit(0)
    } else {
        client.login(config.Token)
    }
}


//


async function log(msg) {
    if (fs.existsSync(Path + '/Core/pluginLoader.js')) {
        pluginLoader.log(msg)
    } else {
        if (msg.startsWith("Info")) {
            console.log("\x1b[32m" + msg + "\x1b[0m")
        } else if (msg.startsWith("Warn")) {
            console.log("\x1b[33m" + msg + "\x1b[0m")
        } else {
            console.log("\x1b[31m" + msg + "\x1b[0m")
        }
    }
}

client.on('ready', async () => {
    pluginLoader.ready(client)
    if (fs.existsSync('./Data/config.json')) {
        let configFile = JSON.parse(fs.readFileSync('./Data/config.json').toString())
        configFile["version"] = ver
        fs.writeFileSync(Path + "/Data/config.json", JSON.stringify(configFile, null, "\t"), 'utf8')
    }
    log(`Info >> 目前登入身份 ${client.user.tag} | 版本: ${ver}`)
})

client.on('messageCreate', async message => {
    if (message.content == `${Prefix}info`) {
        message.reply(await pluginLoader.embed(`**MPR**\nMultifunctional Plugin Robot\n多功能插件機器人\n\n版本: ${ver}\n\nGitHub\nhttps://github.com/ExpTechTW/MPR`))
    } else if (!fs.existsSync('./Data/config.json') && message.content == `${Prefix}init` && message.author.id == message.guild.ownerId) {
        let config = {
            "FirstSeen": new Date().getTime(),
            "bot_console": message.channel.id
        }
        fs.writeFileSync(Path + "/Data/config.json", JSON.stringify(config, null, "\t"), 'utf8')
        message.reply(await pluginLoader.embed(`**MPR**\nMultifunctional Plugin Robot\n多功能插件機器人\n\n版本: ${ver}\n\nGitHub\nhttps://github.com/ExpTechTW/MPR`))
    } else if (!fs.existsSync('./Data/config.json') && message.author.id == message.guild.ownerId) {
        message.reply(await pluginLoader.embed(`尚未配置機器人,在任意頻道中使用 ${Prefix}init 配置機器人`))
    } else if (message.content.startsWith(`${Prefix}plugin`) || message.content.startsWith(`${Prefix}help`) || message.content.startsWith(`${Prefix}permission`)) {
        pluginLoader.plugin(client, message)
    } else if (message.content.startsWith(`${Prefix}reload`)) {
        pluginLoader = reload('./Core/pluginLoader')
        pluginLoader.ready()
        message.reply(await pluginLoader.embed(`⚠️ 已重新加載 pluginLoader 及 所有插件`))
    } else {
        pluginLoader.messageCreate(client, message)
    }
})

client.on('messageReactionAdd', async (reaction, user) => {
    pluginLoader.messageReactionAdd(reaction, user)
})

client.on('messageReactionRemove', async (reaction, user) => {
    pluginLoader.messageReactionRemove(reaction, user)
})

client.on("channelCreate", async channel => {
    pluginLoader.channelCreate(channel)
})

client.on("channelDelete", async channel => {
    pluginLoader.channelDelete(channel)
})

client.on("messageDelete", async (message) => {
    pluginLoader.messageDelete(message)
})

client.on("messageUpdate", async (Old, New) => {
    pluginLoader.messageUpdate(Old, New)
})