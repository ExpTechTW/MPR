const functions = require('./functions')
const bot = require('./Bot/commands')

const Commands = [
    {
        "name": "bot",
        "note": "機器人相關設定"
    }
]

async function main(client, message) {
    if (message.content == "$help") {
        let msg = ""
        for (let index = 0; index < Commands.length; index++) {
            msg = msg + "**$" + Commands[index]["name"] + "** " + Commands[index]["note"] + "\n"
        }
        message.reply(await functions.embed(msg))
    } else {
        if (command()) {
            if (message.content.startsWith('$bot')) {
                bot.main(client, message)
            }
        } else {
            message.reply(await functions.embed("未知的指令"))
        }
        function command() {
            for (let index = 0; index < Commands.length; index++) {
                if (message.content.startsWith("$" + Commands[index]["name"])) {
                    return true
                }
            }
            return false
        }
    }
}

module.exports = {
    main
}