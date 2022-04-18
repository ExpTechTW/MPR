const Info = {
    "version": "1.0.0",
    "name": "TimeNow",
    "author": "whes1015"
}

const Commands = [
    {
        "name": "$time now",
        "note": "查看現在時間"
    }
]

const Event = [
    "messageCreate"
]

const pluginLoader = require('../Core/pluginLoader')

async function messageCreate(client, message) {
    let now = new Date()
    let Now = now.getFullYear() +
        "/" + (now.getMonth() + 1) +
        "/" + now.getDate() +
        " " + now.getHours() +
        ":" + now.getMinutes() +
        ":" + now.getSeconds()
    message.reply(await pluginLoader.embed(Now, null, Info.author, "https://raw.githubusercontent.com/ExpTechTW/API/%E4%B8%BB%E8%A6%81%E7%9A%84-(main)/image/Icon/ExpTech.png"))
}

module.exports = {
    Info,
    Commands,
    Event,
    messageCreate
}