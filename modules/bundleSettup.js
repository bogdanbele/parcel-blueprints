module.exports.bundleSettup = bundleSettup;
const fs = require('fs');
const glob = require('glob');
const express = require('express');
const indentString = require('indent-string');
const Bundler = require('parcel-bundler');
const path = require("path");



function bundleSettup(directoryName, env) {

    const app = express();

    let sitePath = directoryName + `/src/**/index.pug`;
    //console.log(sitePath);
    const siteFiles = glob.sync(sitePath);
    //console.log(siteFiles);
    console.log(sitePath);
    siteFiles.forEach(file => {
        console.log('test2');
        const requestPath = file.split('pages/')[1];
        const requestHtmlPath = requestPath.split('.pug')[0]+'.html';
        let expressPath = requestPath.split('/index.pug')[0];
        //console.log(expressPath);

        if (requestPath == 'index.pug') {
            //console.log('root');
            expressPath = '';
        }

        let data = fs.readFileSync(directoryName + '/src/pages/' + expressPath + '/data.json', 'utf8');
        console.log(data);
        let json = JSON.parse(data);
        json.mainStylePath = '../scss/main.scss';
        console.log('request path = ' + requestPath);
        console.log('express path = ' + expressPath);
        console.log('this is json' + json.title);
        if (expressPath !== '') {
            let position;
            position = requestPath.match(/\//ig).length;
            console.log(position);
            for (i = 0; i < position; i++) {
                console.log('LOOP')
                json.mainStylePath = '../' + json.mainStylePath;
            }
        }
        data = JSON.stringify(json);
        console.log(json);

        let dataAsPug = '- data = ' + indentString(data, 1, { indent: '\t' });
        //console.log(dataAsPug);
        console.log(dataAsPug);
        fs.writeFileSync(directoryName + '/src/pages/' + expressPath + '/_data.pug', dataAsPug, 'utf8');
        if (env == 'dev') {
            app.get('/' + expressPath, function (req, res) {
                //console.log(directoryName + '/dist/' + requestPath);
                res.sendFile(path.join(directoryName + '/dist/' + requestHtmlPath));
                //console.log(directoryName);
            });
        }

    });
    if (env == 'dev') {
        let bundler = new Bundler('src/pages/index.pug');

        app.set(express.static(__dirname + '/dist'));
        app.use(bundler.middleware());
        app.listen(5000);
    }
}