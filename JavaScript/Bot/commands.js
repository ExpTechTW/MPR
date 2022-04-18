const functions = require('../functions')
const consoles=require('./console')

const Commands = [
    {
        "name": "console",
        "note": "設定機器人控制台"
    }
]

async function main(client, message) {
    if (message.content == "$bot") {
        let msg = ""
        for (let index = 0; index < Commands.length; index++) {
            msg = msg + "**$bot " + Commands[index]["name"] + "** " + Commands[index]["note"] + "\n"
        }
        message.reply(await functions.embed(msg))
    } else {
        if (command()) {
            if(message.content.startsWith('$bot console')){
                consoles.main(client,message)
            }
        } else {
            message.reply(await functions.embed("未知的指令"))
        }
        function command() {
            for (let index = 0; index < Commands.length; index++) {
                if (message.content.startsWith("$bot " + Commands[index]["name"])) {
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