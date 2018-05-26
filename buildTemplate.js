const { consoleError } = require('./modules/consoleError');

var fs = require('fs');

const args = process.argv.slice(2);

console.log(args);

//////////////////// BUILDING ////////////////////

if (args[0] == 'build') {
    console.log('building');

    //////////////////// PAGES ////////////////////

    let pageName = args[1];
    let folderPosition = '';
    const scssJsonFile = fs.readFileSync(__dirname + '/src/templates/scss.json', 'utf-8');
    let scssJson = JSON.parse(scssJsonFile);
    console.log(scssJson);
    const subFolderRegex = /^(\w*)((\-)(\w*))/gm;
    const wordRegex = /^(\w*)$/gm;
    const patternCheck = pageName.match(wordRegex) || pageName.match(subFolderRegex);
    if ((pageName) && (patternCheck)) {

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
            const mainFolder = pageName.split('-')[0];
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
                if ( i == 0 ) folderPosition += '../';
                i++;
                console.log('buildingPath = ' + buildingPath);
            });
            console.log(mainFolder);
            console.log(pageName);
            console.log('folders =' + folders);
        }
        const importMainScssPath = '' + folderPosition + scssJson.links.variables;
        const importMainScss = '@import "' + importMainScssPath + '";';
        console.log(importMainScss);
        console.log(folderPosition);
        console.log(scssJson.links);
        if (!fs.existsSync(buildingPath)){
            fs.mkdirSync(buildingPath);
        }
        buildingPath += '/';
        fs.writeFile(buildingPath + 'main.scss', importMainScss, function (err) {
            if (err) throw err;
            console.log('File is created successfully.');
        });
    }
    else {
        consoleError('Only words and dashes allowed');
    }
}
