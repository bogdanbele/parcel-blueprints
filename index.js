const { bundleSettup } = require('./modules/bundleSettup');
const express = require('express');
var bodyParser = require('body-parser');
const Bundler = require('parcel-bundler');
const app = express();

bundleSettup(__dirname, 'dev');

let bundler = new Bundler('src/pages/index.pug');

app.get('/', function (req, res) {
    //console.log(directoryName + '/dist/' + requestPath);
    res.sendFile(__dirname + '/dist/index.html');
    //console.log(directoryName);
});

app.get('/matches',function (req, res) {
    //console.log(directoryName + '/dist/' + requestPath);
    res.sendFile(__dirname + '/dist/matches/index.html');
    //console.log(directoryName);
});

app.get('/stadiums',function (req, res) {
    //console.log(directoryName + '/dist/' + requestPath);
    res.sendFile(__dirname + '/dist/stadiums/index.html');
    //console.log(directoryName);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set(express.static(__dirname + '/dist'));
app.use(bundler.middleware());
app.listen(5000);