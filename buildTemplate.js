const { consoleError } = require('./modules/consoleError');

var fs = require('fs');

const args = process.argv.slice(2);

console.log(args);

    //////////////////// BUILDING ////////////////////

if (args[0] == 'build') {
    console.log('building');

    //////////////////// PAGES ////////////////////

    let pageName = args[1];
    const subFolderRegex = /^(\w*)((\-)(\w*))/gm;
    const wordRegex = /^(\w*)$/gm;
    const patternCheck = pageName.match(wordRegex) || pageName.match(subFolderRegex);
    if ((pageName) && (patternCheck)) {

        let buildingPath = __dirname+'/pages';
        console.log('building path = '+ buildingPath);
        if (pageName.match(wordRegex)) {
            buildingPath += '/'+pageName;
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
                buildingPath += '/'+element;
                console.log('buildingPath = ' + buildingPath);
            });
            console.log(mainFolder);
            console.log(pageName);
            console.log('folders =' + folders);
        }
    }
    else {
        consoleError('Only words and dashes allowed');
    }
}
