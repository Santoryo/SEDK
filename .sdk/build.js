const fs = require("fs")
const path = require("path")
const pino = require('pino')
const archiver = require('archiver');
const logger = pino({
  transport: {
      target: 'pino-pretty'
  },
})


try {
  fs.mkdirSync(path.join(__dirname, "..", "output"))
  fs.copyFileSync(path.join(__dirname, "..", "widget", "widget.js"), path.join(__dirname, "..", "output", "js.txt"));
  fs.copyFileSync(path.join(__dirname, "..", "widget", "widget.css"), path.join(__dirname, "..", "output", "css.txt"));
  fs.copyFileSync(path.join(__dirname, "..", "widget", "widget.html"), path.join(__dirname, "..", "output", "html.txt"));

  const output = fs.createWriteStream(path.join(__dirname, "..", "output", "output.zip"));
  logger.info("Files copied successfully")

}
catch
{
  logger.error("Error copying files")
}