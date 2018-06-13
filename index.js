const { bundleSettup } = require('./modules/bundleSettup');
const express = require('express');
var bodyParser = require('body-parser');
const Bundler = require('parcel-bundler');
const app = express();


const { exec } = require('child_process');
console.log('here in script');
exec('echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p', (err, stdout, stderr) => {
    if (err) {
    // node couldn't execute the command
    return;
    }

  // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
});

console.log('before bundler');


let bundler = new Bundler('src/pages/index.pug');
bundleSettup(__dirname, 'dev');

console.log('after bundler');

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