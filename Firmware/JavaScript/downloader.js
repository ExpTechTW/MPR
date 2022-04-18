const fetch = require('node-fetch')
const fs = require('fs')

let ver="1.0.0"

async function main(path, url) {
    if(url=="") return
    if (path.includes('.json')) {
        let res = await fetch(url)
        fs.writeFileSync(path, JSON.stringify(await res.text(), null, "\t"), 'utf8')
    } else if (path.includes('.js')) {
        let res = await fetch(url)
        fs.writeFileSync(path, await res.text(), 'utf8')
    }
    return
}

module.exports = {
    main,
    ver
}