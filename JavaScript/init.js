const functions = require('./functions')

const fs = require('fs')
const path = require("path")
const Path = path.resolve("")

let config = {}
let PATH = Path + "/Data/config.json"

async function main(client, message) {
    if (fs.existsSync(PATH)) {
        config = JSON.parse(fs.readFileSync(PATH).toString())
    } else {
        config = {
            "FirstSeen": new Date().getTime(),
            "bot_console": message.channel.id
        }
    }

    message.reply(await functions.embed("歡迎使用\n**CMIR**\nComposite Multifunctional Information Robot\n複合式多功能資訊機器人\n\nGitHub\nhttps://github.com/ExpTechTW/CMIR"))
    message.reply(await functions.embed("使用 $bot console <頻道 ID> 來設定機器人控制台頻道"))
    fs.writeFileSync(PATH, JSON.stringify(config, null, "\t"), 'utf8')
}

module.exports = {
    main
}