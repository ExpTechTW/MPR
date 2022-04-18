const image = "https://raw.githubusercontent.com/ExpTechTW/API/%E4%B8%BB%E8%A6%81%E7%9A%84-(main)/image/Icon/ExpTech.png"

let Ver = ""

async function ver(version) {
    if (Ver == "") {
        Ver = version
    } else {
        return Ver
    }
}

module.exports = {
    image,
    ver
}