const Bundler = require('parcel-bundler');
const express = require('express');
const path    = require("path");
const fs = require('fs');
const glob = require('glob');

const app = express();

let sitePath = __dirname+ `/dist/*/index.html`;
console.log(sitePath);
const siteFiles = glob.sync(sitePath);
console.log(siteFiles);





siteFiles.forEach(file => {
  const requestPath = file.split('dist/')[1];
  const expressPath = '/'+requestPath.split('/')[0];
  console.log(expressPath);



  const data = fs.readFileSync(__dirname+'/src/pages'+expressPath+'/data.json', 'utf8');
  console.log(data);



  app.get(expressPath,function(req,res){
    res.sendFile(path.join(__dirname+'/dist/'+requestPath));
    console.log(__dirname);
  });

});


let bundler = new Bundler('src/pages/home/index.pug');

app.set(express.static(__dirname + '/dist'));








app.use(bundler.middleware());


app.listen(5000);