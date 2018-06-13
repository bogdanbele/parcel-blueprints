const { bundleSettup } = require('./modules/bundleSettup');
const express = require('express');
const Bundler = require('parcel-bundler');
const app = express();
const path = require('path');
const exec = require('child_process').exec;


console.log('here in script');

console.log('before bundler');



bundleSettup(__dirname, 'dev');

console.log('after bundler');

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

console.log('after paths');



let bundler = new Bundler(path.resolve(__dirname, 'src/pages/index.pug'));
app.use(bundler.middleware());
console.log('after middleware');
app.listen(5000);