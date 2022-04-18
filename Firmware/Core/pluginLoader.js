const Info = {
    "version": "1.0.0",
    "name": "pluginLoader",
    "author": "whes1015"
}

const { MessageEmbed } = require('discord.js')
const fs = require('fs')
const path = require("path")
const Path = path.resolve("")

let Ver = ""

async function messageCreate(client, message) {

}

async function ready(client) {

}

async function plugin(client, message) {
    if (message.content == "$plugin pluginLoader update") {
        await downloader("/Core/pluginLoader.js")
    } else if (message.content == "$plugin info") {

    } else if (message.content.startsWith("$plugin install")) {
        await downloader("/Core/" + message.content.replace("$plugin install ") + ".js")
    }
}

function ver(version) {
    if (Ver == "") {
        Ver = version
    } else {
        return Ver
    }
}

async function downloader(path) {
    let url = "https://raw.githubusercontent.com/ExpTechTW/CMIR/%E4%B8%BB%E8%A6%81%E7%9A%84-(main)/Firmware" + path
    if (path.includes('.json')) {
        let res = await fetch(url)
        fs.writeFileSync(Path + path, JSON.stringify(await res.text(), null, "\t"), 'utf8')
    } else if (path.includes('.js')) {
        let res = await fetch(url)
        fs.writeFileSync(Path + path, await res.text(), 'utf8')
    }
    return
}

async function embed(msg, color) {
    if (color == undefined) {
        color = '#0099ff'
    }
    const exampleEmbed = new MessageEmbed()
        .setColor(color)
        .setDescription(msg)
        .setTimestamp()
    return { embeds: [exampleEmbed] }
}

module.exports = {
    messageCreate,
    ready,
    plugin,
    ver,
    downloader,
    Info,
    embed
}