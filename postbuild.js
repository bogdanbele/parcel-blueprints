const path    = require("path");
const fs = require('fs');
const glob = require('glob');

let dataPath = __dirname+ `/src/**/_data.pug`;
const dataFiles = glob.sync(dataPath);

dataFiles.forEach(file => {
    console.log(file);
    fs.unlinkSync(file, (err) => {
        if (err) throw err;
    }
    );
});