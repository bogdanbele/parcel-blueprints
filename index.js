const Bundler = require('parcel-bundler');
const express = require('express');
const path    = require("path");
const fs = require('fs');
const glob = require('glob');

let bundler = new Bundler('src/pages/home/index.pug');
const app = express();
app.set(express.static(__dirname + '/dist'));


app.get('/secondpage',function(req,res){
    res.sendFile(path.join(__dirname+'/dist/secondpage/secondpage.html'));
    console.log(__dirname);
  });


console.log('test');
app.use(bundler.middleware());


app.listen(5000);