const config = require('./config')
const info = require('./JavaScript/info')
const init = require('./JavaScript/init')
const functions = require('./JavaScript/functions')
const commands = require('./JavaScript/commands')
const update = require('./update')
const log = require('./JavaScript/functions').log

const fs = require('fs')
const { Client, Intents, MessageEmbed } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

const ver = "22w17-pre1"
info.ver(ver)

let Init = true

client.on('ready', async () => {
  log(client, "Info >> 正在初始化機器人...")
  await update.main()
  await functions.check()
  if (!fs.existsSync('./Data/config.json')) {
    Init = false
    log(client, "Warn >> 尚未配置機器人\n在任意頻道中使用 $init 配置機器人...")
  }
  log(client, `Info >> 目前登入身份 ${client.user.tag}!`)
})

client.on('messageCreate', async message => {
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
        if (!Init && message.content != "$help" && !message.content.startsWith('$bot console')) {
          message.reply(await functions.embed("請使用 $init 配置機器人"))
        } else {
          commands.main(client, message)
        }
      }
    }
  }
})

client.login(config.Token)