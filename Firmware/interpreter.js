const init=require('./JavaScript/init')
const fs = require('fs')

const ver="1"

async function main(client, message) {
    if (message.content.startsWith('$')) {
        if (message.content == "$") {
            message.reply(await functions.embed("請使用 $help 查看說明"))
        } else {
            if (message.content == "$init") {
                if (message.guild.ownerId == message.author.id) {
                    init.main(client, message)
                } else {
                    message.reply()
                }
            } else {
                if (!fs.existsSync('./Data/config.json') && message.content != "$help" && !message.content.startsWith('$bot console')) {
                    message.reply(await functions.embed("請使用 $init 配置機器人"))
                } else {
                    commands.main(client, message)
                }
            }
        }
    }
}

module.exports = {
    main
}