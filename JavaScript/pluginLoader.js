const fs = require('fs')
const path = require("path")
const Path = path.resolve("")

let config = {}
let PATH = Path + "/Plugin/config.json"

async function main() {
    if (fs.existsSync(PATH)) {
        config = JSON.parse(fs.readFileSync(PATH).toString())
    } else {
        fs.mkdirSync(Path + "/Plugin")
        config = {
            "plugins": [

            ],
            "command": [

            ]
        }
    }
    console.log("123")
    fs.writeFileSync(PATH, JSON.stringify(config, null, "\t"), 'utf8')
}

module.exports = {
    main
}