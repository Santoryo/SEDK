const fs = require("fs")
const path = require("path")
const pino = require("pino")
const archiver = require("archiver")
const zip = require("zip-a-folder")
const logger = pino({
    transport: {
        target: "pino-pretty",
    },
})

async function main()
{

try {
    if(!fs.existsSync(path.join(__dirname, "..", ".sdk", "output"))) fs.mkdirSync(path.join(__dirname, "..", ".sdk", "output"))

    fs.copyFileSync(
        path.join(__dirname, "..", "widget", "widget.js"),
        path.join(__dirname, "..", ".sdk", "output", "js.txt")
    )
    fs.copyFileSync(
        path.join(__dirname, "..", "widget", "widget.css"),
        path.join(__dirname, "..", ".sdk", "output", "css.txt")
    )
    fs.copyFileSync(
        path.join(__dirname, "..", "widget", "widget.html"),
        path.join(__dirname, "..", ".sdk", "output", "html.txt")
    )

    fs.copyFileSync(
        path.join(__dirname, "..", "widget", "data.json"),
        path.join(__dirname, "..", ".sdk", "output", "data.txt")
    )

    fs.copyFileSync(
        path.join(__dirname, "..", "widget", "fields.json"),
        path.join(__dirname, "..", ".sdk", "output", "fields.txt")
    )

    fs.copyFileSync(
        path.join(__dirname, "..", ".sdk", "widget.ini"),
        path.join(__dirname, "..", ".sdk", "output", "widget.ini")
    )

    await zip.zip(path.join(__dirname, "..", ".sdk", "output"), path.join(__dirname, "..", "output.zip"))


    logger.info("Files copied successfully")
} catch (e) {
    logger.error("Error copying files")
    logger.error(e)
}

}

main()
