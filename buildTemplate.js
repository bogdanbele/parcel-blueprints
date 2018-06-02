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
    const globalsJsonFile = fs.readFileSync(__dirname + '/src/templates/globals.json', 'utf-8');
    let globalsJson = JSON.parse(globalsJsonFile);

    console.log(scssJson);
    const subFolderRegex = /^(\w*)((\-)(\w*))/gm;
    const wordRegex = /^(\w*)$/gm;
    const patternCheck = pageName.match(wordRegex) || pageName.match(subFolderRegex);

    if ((pageName) && (patternCheck)) {

        const mainFolder = pageName.split('-')[0];

        let buildingPath = __dirname + '/src/pages';

        let expressPath;
        let expressName;

        let includeHead = '../../pug/structure/_head.pug';

        console.log('building path = ' + buildingPath);
        if (pageName.match(wordRegex)) {
            buildingPath += '/' + pageName;
            folderPosition += '../';
            expressPath = '/' + mainFolder;
            expressName = mainFolder;
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
                buildingPath += '/' + element;
                folderPosition += '../';
                console.log('buildingPath = ' + buildingPath);
            });
            expressName = buildingPath.substring(buildingPath.lastIndexOf('/') + 1);
            console.log('express name = ' + expressName);
            expressPath = buildingPath.split('/pages')[1];
            console.log(expressPath);
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
        const lineIncludeHead = 'include ' + folderPosition + pugJson.links.head + newLine;
        const lineIncludeFooter = 'include '+ folderPosition + pugJson.links.footer + newLineBig;
        const lineBodyAndContent = 'block body' + newLineBig;
        const layoutPugLines = lineDataPug + lineIncludeHead + lineBodyAndContent + lineIncludeFooter;;

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

        const slashCount = (expressPath.match(/\//g) || []).length;
        console.log('count = ' + slashCount);

        if (slashCount == 2) {

            for (let i = 0; i < globalsJson.links.length; i++) {
                const lowerCaseName = (globalsJson.links[i].name).toLowerCase();
                if (expressPath.includes(lowerCaseName)) {
                    console.log('it includes at ' + expressPath + ' and ' + lowerCaseName);
                    const newLink = { "name": expressName.charAt(0).toUpperCase() + expressName.slice(1), "link": expressPath };
                    console.log(newLink);
                    globalsJson.links[i].sublinks = [];
                    globalsJson.links[i].sublinks.push(newLink);
                    console.log(globalsJson);

                    fs.writeFile(__dirname + '/src/templates/globals.json', JSON.stringify(globalsJson, null, 4), function (err) {
                        if (err) throw err;
                        console.log('File is created successfully.');
                    });
                }
            }
        }

        else if (slashCount == 1) {

            const newLink = { "name": expressName.charAt(0).toUpperCase() + expressName.slice(1), "link": expressPath };
            globalsJson.links.push(newLink);
            
            fs.writeFile(__dirname + '/src/templates/globals.json', JSON.stringify(globalsJson, null, 4), function (err) {
                if (err) throw err;
                console.log('File is created successfully.');
            });
        }
        else {
            console.log('only folders and subfolders allowed for the moment');
        }

    }
    else {
        consoleError('Only words and dashes allowed');
    }
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + this.slice(1);
}