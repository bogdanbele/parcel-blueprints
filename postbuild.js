const path = require("path");
const fs = require('fs');
const glob = require('glob');
const express = require('express');
const app = express();

let dataPath = __dirname + `/src/**/_data.pug`;
const dataFiles = glob.sync(dataPath);

dataFiles.forEach(file => {
    console.log(file);
    fs.unlinkSync(file, (err) => {
        if (err) throw err;
    }
    );
});

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