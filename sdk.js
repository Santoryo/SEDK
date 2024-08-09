// THIS FILE IS LOGIC FOR SDK. DO NOT MODIFY. IT INCLUDES:
// 1. DEVELOPMENT SERVER
// 2. SVG TO CSS CONVERTER
// 3. BUNDLE GENERATOR

const express = require('express')
const path = require('path')
const app = express()
const fs = require('fs')
const cheerio = require('cheerio')

var chokidar = require('chokidar');

console.log(__dirname);
var watcher = chokidar.watch(path.join(__dirname, 'widget'), {ignored: /^\./, persistent: true});
app.use(express.static(path.join(__dirname, 'widget')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/.sdk/index.html'));
})

watcher
  .on('add', function(path) {console.log('File', path, 'has been added'); if(path.includes('widget.html')){widgetToIndex();} })
  .on('change', function(path) {console.log('File', path, 'has been changed'); if(path.includes('widget.html')){widgetToIndex();} })
  .on('unlink', function(path) {console.log('File', path, 'has been removed');})
  .on('error', function(error) {console.error('Error happened', error);})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


function widgetToIndex()
{
    const sourceFilePath = './widget/widget.html'
    const targetFilePath = './.sdk/index.html'

    const getHeadElements = (html) => {
        const $ = cheerio.load(html);
        return $('head').html();
      };
      
      // Function to check if an element already exists in the target HTML
      const elementExists = (targetHtml, element) => {
        const $ = cheerio.load(targetHtml);
        return $('head').html().includes(element);
      };
      
      // Function to append head elements to the target HTML
      const appendHeadElements = (sourceHtml, targetHtml) => {
        const sourceHead = getHeadElements(sourceHtml);
        const targetHead = getHeadElements(targetHtml);
      
        let newHeadContent = '';
        const $source = cheerio.load(sourceHtml);
        const sourceHeadChildren = $source('head').children();
      
        sourceHeadChildren.each((i, el) => {
          const elementHtml = $source(el).toString();
          if (!elementExists(targetHtml, elementHtml)) {
            newHeadContent += elementHtml + "\n";
          }
        });
      
        if (newHeadContent) {
          const $target = cheerio.load(targetHtml);
          $target('head').append(newHeadContent + "\n");
          fs.writeFileSync(targetFilePath, $target.html());
          console.log('Head elements appended successfully.');
        } else {
          console.log('No new head elements to append.');
        }
      };


      fs.readFile(sourceFilePath, 'utf8', (err, sourceHtml) => {
        if (err) throw err;
      
        fs.readFile(targetFilePath, 'utf8', (err, targetHtml) => {
          if (err) throw err;
          
          appendHeadElements(sourceHtml, targetHtml);
        });
      });

}