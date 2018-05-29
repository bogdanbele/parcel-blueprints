const { consoleError } = require('./modules/consoleError');

var fs = require('fs');

const args = process.argv.slice(2);

const newLine = '\n';
const newLineBig = '\n\n';
const tab = '\t';

console.log(args);

//////////////////// BUILDING ////////////////////

if (args[0] == 'build') {
    console.log('building');

    //////////////////// PAGES ////////////////////

    let pageName = args[1];
    let folderPosition = '';

    const scssJsonFile = fs.readFileSync(__dirname + '/src/templates/scss.json', 'utf-8');
    let scssJson = JSON.parse(scssJsonFile);
    const pugJsonFile = fs.readFileSync(__dirname + '/src/templates/pug.json', 'utf-8');
    let pugJson = JSON.parse(pugJsonFile);
    const dataJsonFile = fs.readFileSync(__dirname + '/src/templates/data.json', 'utf-8');
    let dataJson = JSON.parse(dataJsonFile);
    const linksJsonFile = fs.readFileSync(__dirname + '/src/templates/links.json', 'utf-8');
    let linksJson = JSON.parse(linksJsonFile);

    console.log(scssJson);
    const subFolderRegex = /^(\w*)((\-)(\w*))/gm;
    const wordRegex = /^(\w*)$/gm;
    const patternCheck = pageName.match(wordRegex) || pageName.match(subFolderRegex);

    if ((pageName) && (patternCheck)) {

        const mainFolder = pageName.split('-')[0];

        let buildingPath = __dirname + '/src/pages';
        let includeHead = '../../pug/structure/_head.pug';

        console.log('building path = ' + buildingPath);
        if (pageName.match(wordRegex)) {
            buildingPath += '/' + pageName;
            folderPosition += '../';
        }
        else {

            //////////////////// SUB-PAGES ////////////////////

            let folders = [];

            folders.push(mainFolder);

            while (pageName.match(subFolderRegex)) {
                const parent = pageName.split('-')[0];
                const subfolder = pageName.split('-')[1];
                const replacePattern = parent + '-';
                pageName = pageName.replace(replacePattern, '');
                folders.push(subfolder);
            }
            folders.forEach(element => {
                let i = 0;
                buildingPath += '/' + element;
                if (i == 0) folderPosition += '../';
                i++;
                console.log('buildingPath = ' + buildingPath);
            });
            console.log(mainFolder);
            console.log(pageName);
            console.log('folders =' + folders);
        }

        //////////////////// SCSS ////////////////////

        const importMainScss = '@import "' + folderPosition + scssJson.links.variables + '";';


        //////////////////// PUG ////////////////////

        const lineExtendLayout = 'extends _layout.pug' + newLineBig;
        const lineBlockContent = 'block content' + newLine;
        const indexPugLines = lineExtendLayout + lineBlockContent;

        const lineDataPug = 'include _data.pug' + newLineBig;
        const lineIncludeHead = 'include ' + folderPosition + pugJson.links.head + newLineBig;
        const lineBodyAndContent = 'block body' + newLine;
        const layoutPugLines = lineDataPug + lineIncludeHead + lineBodyAndContent;

        //////////////////// JSON ////////////////////
        // dataJsonFile
        console.log(importMainScss);
        console.log(folderPosition);
        console.log(scssJson.links);
        if (!fs.existsSync(buildingPath)) {
            fs.mkdirSync(buildingPath);
        }
        buildingPath += '/';

        //////////////////// WRITE SCSS ////////////////////

        fs.writeFile(buildingPath + '_main.scss', importMainScss, function (err) {
            if (err) throw err;
            console.log('File is created successfully.');
        });

        //////////////////// WRITE PUG ////////////////////

        fs.writeFile(buildingPath + 'index.pug', indexPugLines, function (err) {
            if (err) throw err;
            console.log('File is created successfully.');
        });

        fs.writeFile(buildingPath + '_layout.pug', layoutPugLines, function (err) {
            if (err) throw err;
            console.log('File is created successfully.');
        });

        //////////////////// WRITE JSON ////////////////////

        fs.writeFile(buildingPath + 'data.json', dataJsonFile, function (err) {
            if (err) throw err;
            console.log('File is created successfully.');
        });

        //////////////////// ADD JSON LINK ////////////////////

        const newLink = { "name": mainFolder, "link": '/' + mainFolder };
        linksJson.push(newLink);

        fs.writeFile(__dirname + '/src/templates/links.json', JSON.stringify(linksJson), function (err) {
            if (err) throw err;
            console.log('File is created successfully.');
        });
    }
    else {
        consoleError('Only words and dashes allowed');
    }
}
