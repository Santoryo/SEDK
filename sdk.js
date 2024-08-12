// THIS FILE IS LOGIC FOR SDK. DO NOT MODIFY. IT INCLUDES:
// 1. DEVELOPMENT SERVER
// 2. SVG TO CSS CONVERTER
// 3. BUNDLE GENERATOR
// 4. LIVE COMPONENTS TRANSFORMATION

const express = require("express")
const path = require("path")
const app = express()
const fs = require("fs")
const cheerio = require("cheerio")
const chokidar = require("chokidar")
const cssbeautify = require("cssbeautify")
const { parse } = require("node-html-parser")
const babelParser = require('@babel/parser')
const babelGenerator = require('@babel/generator').default

const pino = require("pino")
const logger = pino({
    transport: {
        target: "pino-pretty",
    },
})

var watcher = chokidar.watch(path.join(__dirname, "widget"), {
    ignored: /^\./,
    persistent: true,
})
var svgWatcher = chokidar.watch(path.join(__dirname, "svg"), {
    ignored: /^\./,
    persistent: true,
})
var componentsWatcher = chokidar.watch(path.join(__dirname, "components"), {
    ignored: /^\./,
    persistent: true,
})
app.use(express.static(path.join(__dirname, "widget")))
app.use(express.static(path.join(__dirname, "components")))

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/.sdk/index.html"))
})

watcher
    .on("add", function (path) {
        logger.info(`[+] ${path}`)
        if (path.includes("widget.html")) {
            widgetToIndex()
        }
    })
    .on("change", function (path) {
        logger.info(`[~] ${path}`)
        if (path.includes("widget.html")) {
            widgetToIndex()
        }
    })
    .on("unlink", function (path) {
        logger.info(`[-] ${path}`)
    })
    .on("error", function (error) {
        logger.error(`Error happened ${error}`)
    })

svgWatcher
    .on("add", function (path) {
        logger.info(`[+] ${path}`)
        processSVGs()
    })
    .on("change", function (path) {
        logger.info(`[~] ${path}`)
        processSVGs()
    })
    .on("unlink", function (path) {
        logger.info(`[-] ${path}`)
    })
    .on("error", function (error) {
        logger.error(`Error happened ${error}`)
    })

componentsWatcher
    .on("add", function (path) {
        logger.info(`[+] ${path}`)
        parseComponents()
    })
    .on("change", function (path) {
        logger.info(`[~] ${path}`)
        parseComponents()
    })
    .on("unlink", function (path) {
        logger.info(`[-] ${path}`)
    })
    .on("error", function (error) {
        logger.error(`Error happened ${error}`)
    })

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`)
})

function widgetToIndex() {
    const sourceFilePath = "./widget/widget.html"
    const targetFilePath = "./.sdk/index.html"

    const getHeadElements = (html) => {
        const $ = cheerio.load(html)
        return $("head").html()
    }

    const elementExists = (targetHtml, element) => {
        const $ = cheerio.load(targetHtml)
        return $("head").html().includes(element)
    }

    const appendHeadElements = (sourceHtml, targetHtml) => {
        const sourceHead = getHeadElements(sourceHtml)
        const targetHead = getHeadElements(targetHtml)

        let newHeadContent = ""
        const $source = cheerio.load(sourceHtml)
        const sourceHeadChildren = $source("head").children()

        sourceHeadChildren.each((i, el) => {
            const elementHtml = $source(el).toString()
            if (!elementExists(targetHtml, elementHtml)) {
                newHeadContent += elementHtml + "\n"
            }
        })

        if (newHeadContent) {
            const $target = cheerio.load(targetHtml)
            $target("head").append(newHeadContent + "\n")
            fs.writeFileSync(targetFilePath, $target.html())
        }
    }

    fs.readFile(sourceFilePath, "utf8", (err, sourceHtml) => {
        if (err) throw err

        fs.readFile(targetFilePath, "utf8", (err, targetHtml) => {
            if (err) throw err

            appendHeadElements(sourceHtml, targetHtml)
        })
    })
}

const extractDimensions = (svgContent) => {
    const root = parse(svgContent)
    const svgElement = root.querySelector("svg")
    if (svgElement) {
        const width = svgElement.getAttribute("width") + "px" || "100px"
        const height = svgElement.getAttribute("height") + "px" || "100px"
        return { width, height }
    }
    return { width: "100px", height: "100px" }
}

const encodeSVG = (svgContent) => {
    const encoded = encodeURIComponent(svgContent)
        .replace(/'/g, "%27")
        .replace(/"/g, "%22")
    return `data:image/svg+xml;charset=utf-8,${encoded}`
}

const generateCSSClass = (filename, svgContent) => {
    const { width, height } = extractDimensions(svgContent)
    const className = filename.replace(".svg", "-svg")
    const encodedSVG = encodeSVG(svgContent)
    return `.${className} {
    width: ${width};
    height: ${height};
    background-image: url("${encodedSVG}");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }\n\n`
}

function processSVGs() {
    const svgFolder = path.join(__dirname, "svg")
    const cssFile = path.join(__dirname, "widget", "widget.css")

    fs.readdir(svgFolder, (err, files) => {
        if (err) throw err

        let cssContent = ""

        files.forEach((file) => {
            if (path.extname(file).toLowerCase() === ".svg") {
                const filePath = path.join(svgFolder, file)
                const svgContent = fs.readFileSync(filePath, "utf8")
                cssContent += generateCSSClass(file, svgContent) + "\n\n"
            }
        })

        fs.readFile(cssFile, "utf8", (err, existingCSS) => {
            let updatedCSS = ""

            if (!err) {
                const classMap = {}
                existingCSS.split("\n\n").forEach((rule) => {
                    const match = rule.match(/^\.([^ \{]+)\s*\{/)
                    if (match) {
                        classMap[match[1]] = rule
                    }
                })

                cssContent.split("\n\n").forEach((rule) => {
                    const match = rule.match(/^\.([^ \{]+)\s*\{/)
                    if (match) {
                        classMap[match[1]] = rule
                    }
                })
                updatedCSS = Object.values(classMap).join("\n\n")
            } else {
                updatedCSS = cssContent
            }

            updatedCSS = cssbeautify(updatedCSS, { indent: "  " })

            fs.writeFile(cssFile, updatedCSS, (err) => {
                if (err) throw err
            })
        })
    })
}


function parseComponents() {
    const componentsPath = path.join(__dirname, "components")
    const widgetJs = path.join(__dirname, "widget", "widget.js")

    let jsContent = fs.readFileSync(widgetJs, "utf8");

    let astTree = babelParser.parse(jsContent, {
        sourceType: "module",
        plugins: ["jsx", "typescript"],
        attachComment: true
    });

    fs.readdir(componentsPath, (err, files) => {
        if (err) throw err

        files.forEach((file) => {
            if (path.extname(file).toLowerCase() === ".html") {
                const html = fs.readFileSync(
                    path.join(componentsPath, file),
                    "utf8"
                )
                const $ = cheerio.load(html)

                let match
                let replaced = false
                const variables = []
                const beforeScripts = []
                const afterScrips = []

                $("script").each((index, element) => {
                    if ($(element).attr("cat") === "before") {
                        beforeScripts.push($(element).text())
                    } else if ($(element).attr("cat") === "after") {
                        afterScrips.push($(element).text())
                    } else {
                        const scriptContent = $(element).text()
                        const regex =
                            /(?:let|var|const)\s+([a-zA-Z_$][a-zA-Z_$0-9]*)(?:\s*=\s*[^;]*)?(?:\s*;)?/g

                        while ((match = regex.exec(scriptContent)) !== null) {
                            variables.push(match[1])
                        }
                    }
                })

                $("script").remove()

                function isCommentNode(node) {
                    return node.type === "comment"
                }

                $.root()
                    .contents()
                    .filter((index, node) => isCommentNode(node))
                    .remove()

                const functionName = file.replace(".html", "")
                const formattedFunctionName = `add${functionName.charAt(0).toUpperCase() + functionName.slice(1)}`
                const functionBody = `function ${formattedFunctionName}(${variables.join(", ")}) {
                    ${beforeScripts.join("\n")}
                    const elem = document.createElement('div');
                    elem.innerHTML = \`${$("body").html()}\`;
                    document.getElementById('main-container').appendChild(elem);
                    ${afterScrips.join("\n")}
                    }`

                const functionNode = babelParser.parse(functionBody, {
                    sourceType: "module",
                    plugins: ["jsx", "typescript"],
                    attachComment: true
                }).program.body[0];

                for (const node of astTree.program.body) {
                    if (node.type === "FunctionDeclaration" && node.id.name === formattedFunctionName) {
                        const index = astTree.program.body.indexOf(node);
                        astTree.program.body.splice(index, 1);
                        astTree.program.body.splice(index, 0, functionNode);
                        replaced = true;
                        break;
                    }
                }

                if (!replaced) {
                    astTree.program.body.push(functionNode)
                }
            }
        })

        const { code } = babelGenerator(astTree, { comments: true });

        fs.writeFile(widgetJs, code, (err) => {
            if (err) throw err
        })
    })
}
