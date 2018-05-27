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
    const siteFiles = glob.sync(sitePath);
    console.log(sitePath);

    //////////////////// MAP WEBSITE ////////////////////

    siteFiles.forEach(file => {

        const requestPath = file.split('pages/')[1];
        const requestHtmlPath = requestPath.split('.pug')[0]+'.html';
        let expressPath = requestPath.split('/index.pug')[0];

        //////////////////// ROOT ////////////////////

        if (requestPath == 'index.pug') {
            expressPath = '';
        }

        //////////////////// READ DATA.JSON ////////////////////

        let data = fs.readFileSync(directoryName + '/src/pages/' + expressPath + '/data.json', 'utf8');
        let json = JSON.parse(data);
        json.styles = [];

        let mainStylePath = '../scss/main.scss';

        if (expressPath !== '') {
            let position;
            position = requestPath.match(/\//ig).length;
            for (i = 0; i < position; i++) {
                mainStylePath = '../' + mainStylePath;
            }
        }
        const localScss = '_main.scss';
        json.styles.push(mainStylePath);
        json.styles.push(localScss);
        data = JSON.stringify(json);
        console.log(json.styles);

        //////////////////// MODIFY DATA ////////////////////

        let dataAsPug = '- data = ' + indentString(data, 1, { indent: '\t' });
        console.log('data as pug = ' + JSON.stringify(json));

        //////////////////// CREATE DATA.PUG ////////////////////

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

        //////////////////// START SERVER ////////////////////

        let bundler = new Bundler('src/pages/index.pug');

        app.set(express.static(__dirname + '/dist'));
        app.use(bundler.middleware());
        app.listen(5000);
    }
}