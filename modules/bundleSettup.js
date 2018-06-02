module.exports.bundleSettup = bundleSettup;
const { mapWebsite } = require('../modules/mapWebsite');
const fs = require('fs');
const glob = require('glob');
const express = require('express');
const indentString = require('indent-string');
const Bundler = require('parcel-bundler');
const path = require("path");
const md2pug = require('jstransformer')(require('jstransformer-markdown-it'));
const html2pug = require('html2pug')



function bundleSettup(directoryName, env) {

    const app = express();

    let sitePath = directoryName + `/src/**/index.pug`;
    const siteFiles = glob.sync(sitePath);
    
    let mdPath = directoryName + `/src/**/content.md`;
    const mdFiles = glob.sync(mdPath);
    let expressPath = '';
    mdFiles.forEach(file => {
        const requestPath = file.split('pages/')[1];
        console.log('request path = ' + requestPath)
        if(requestPath=='content.md'){
            let expressPath = '';
        }
        else{
            let expressPath = requestPath.split('/content.md')[0]+'/';
        }
        let data = fs.readFileSync(directoryName + '/src/pages/' + requestPath, 'utf8');
        const html = md2pug.render(data).body;
        const pug = html2pug(html, { tabs: true })
        fs.writeFileSync(directoryName + '/src/pages/' + expressPath + 'content.pug', pug, 'utf8');
    });

    let globals = fs.readFileSync(directoryName + '/src/templates/globals.json', 'utf8');
    let globalsJson = JSON.parse(globals)
    globals = JSON.stringify(globalsJson);
    console.log(globals);
    const globalsAsPug ='- globals = ' + globals;
    console.log(globalsAsPug);
    fs.writeFileSync(directoryName + '/src/templates/globals.pug', globalsAsPug, 'utf8');
    console.log(sitePath);
    let requestPathsArray = {};
    let links = [];

    //////////////////// MAP WEBSITE ////////////////////

    siteFiles.forEach(file => {

        const requestPath = file.split('pages/')[1];
        const requestHtmlPath = requestPath.split('.pug')[0]+'.html';
        let expressPath = requestPath.split('/index.pug')[0];
        links.push(requestPath);
        console.log(requestPath);
        //////////////////// ROOT ////////////////////

        if (requestPath == 'index.pug') {
            expressPath = '';
        }

        //////////////////// READ DATA.JSON ////////////////////

        let data = fs.readFileSync(directoryName + '/src/pages/' + expressPath + '/data.json', 'utf8');
        let json = JSON.parse(data);

        json.styles = [];
        json.paths = '';
        json.jsLinks = [];
        let folderPath = '';
        let mainStylePath = '../scss/main.scss';
        let mainJsPath = '../js/main.js'

        if (expressPath !== '') {
            let position;
            position = requestPath.match(/\//ig).length;
            for (i = 0; i < position; i++) {
                mainStylePath = '../' + mainStylePath;
                mainJsPath = '../' + mainJsPath;
                folderPath += '../';
            }
        }
        const localScss = '_main.scss';
        json.jsLinks.push(mainJsPath);
        json.styles.push(mainStylePath);
        json.styles.push(localScss);
        json.paths= folderPath;
        data = JSON.stringify(json);
        console.log(json.styles);

        //////////////////// MODIFY DATA ////////////////////

        const dataAsPug = '- data = ' + indentString(data, 1, { indent: '\t' }) + '\n'
        +'include '+folderPath+'../templates/globals.pug';
        ;
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

    requestPathsArray.links = links;

    console.log(requestPathsArray);
    const linksAsPug ='- map =' + indentString(JSON.stringify(requestPathsArray), 1, { indent: '\t' });
    fs.writeFileSync(directoryName + '/src/pages/_links.pug', linksAsPug, 'utf8');
    if (env == 'dev') {

        //////////////////// START SERVER ////////////////////

        let bundler = new Bundler('src/pages/index.pug');

        app.set(express.static(__dirname + '/dist'));
        app.use(bundler.middleware());
        app.listen(5000);
    }
}