const Bundler = require('parcel-bundler');
const express = require('express');
const path    = require("path");
const fs = require('fs');
const glob = require('glob');

let bundler = new Bundler('src/pages/home/index.pug');
const app = express();
app.set(express.static(__dirname + '/dist'));




let sitePath = __dirname+ `/dist/*/index.html`;
console.log(sitePath);
const siteFiles = glob.sync(sitePath);
console.log(siteFiles);

siteFiles.forEach(file => {
  const requestPath = file.split('dist/')[1];
  const expressPath = '/'+requestPath.split('/')[0];
  console.log(expressPath);

  app.get(expressPath,function(req,res){
    res.sendFile(path.join(__dirname+'/dist/'+requestPath));
    console.log(__dirname);
  });

});
app.use(bundler.middleware());


app.listen(5000);