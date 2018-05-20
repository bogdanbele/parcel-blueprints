const Bundler = require('parcel-bundler');
const express = require('express');

let bundler = new Bundler('src/pug/index.pug');
const app = express();
app.set(express.static(__dirname + '/dist'));

app.use(bundler.middleware());
app.listen(5000);