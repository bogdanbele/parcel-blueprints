const Bundler = require('parcel-bundler');
const express = require('express');
var path    = require("path");

let bundler = new Bundler('src/pug/index.pug');
const app = express();
app.set(express.static(__dirname + '/dist'));


app.get('/secondpages',function(req,res){
    res.sendFile(path.join(__dirname+'/dist/secondpage.html'));
    console.log(__dirname);
  });


console.log('test');
app.use(bundler.middleware());


app.listen(5000);