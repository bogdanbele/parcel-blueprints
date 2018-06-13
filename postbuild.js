const path = require("path");
const fs = require('fs');
const glob = require('glob');
const Bundler = require('parcel-bundler');
const express = require('express');
const app = express();

app.get('/', function (req, res) {
    //console.log(directoryName + '/dist/' + requestPath);
    res.sendFile(__dirname + '/dist/index.html');
    //console.log(directoryName);
});


app.get('/stadiums', function (req, res) {
    //console.log(directoryName + '/dist/' + requestPath);
    res.sendFile(__dirname + '/dist/stadiums/index.html');
    //console.log(directoryName);
});

let bundler = new Bundler('src/pages/index.pug');
app.use(bundler.middleware());
console.log('after middleware');
app.listen(5000);