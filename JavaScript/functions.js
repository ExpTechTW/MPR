const info = require('./info')
const fetch = require('node-fetch')

const fs = require('fs')
const path = require("path")
const Path = path.resolve("")
const { MessageEmbed } = require('discord.js')

let PATH = Path + "/Data/config.json"

async function embed(msg, color) {
    let ver = await info.ver()
    if (color == undefined) {
        color = '#0099ff'
    }
    const exampleEmbed = new MessageEmbed()
        .setColor(color)
        .setDescription(msg)
        .setTimestamp()
        .setFooter({ text: ver, iconURL: info.image })
    return { embeds: [exampleEmbed] }
}

async function check() {
    log(client, `Info >> 正在檢查機器人版本...`)
    const res = await fetch('https://api.github.com/repos/ExpTechTW/CMIR/releases')
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
        log(client, `Info >> 已是最新版本`)
    } else {
        log(client, `Warn >> 最新版本: ${last} 當前落後最新版本 ${num} 個版本`)
    }
    return
}

async function push(client, channel, message) {
    try {
        let channels = await client.channels.cache.get(channel)
        await channels.send(message)
    } catch (error) {
        log(client, `Error >> function.js push 錯誤 內容: ${message} 錯誤: ${error}`)
    }
}

function log(client, message) {
    if (fs.existsSync(PATH)) {
        let config = JSON.parse(fs.readFileSync(PATH).toString())
        push(client, message, config["bot_console"])
    }
    if (message.startsWith("Info")) {
        console.log("\x1b[32m" + message + "\x1b[0m")
    } else if (message.startsWith("Warn")) {
        console.log("\x1b[33m" + message + "\x1b[0m")
    } else {
        console.log("\x1b[31m" + message + "\x1b[0m")
    }
}

module.exports = {
    embed,
    check,
    push,
    log
}