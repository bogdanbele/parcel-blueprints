const Bundler = require('parcel-bundler');
const express = require('express');
const path = require("path");
const fs = require('fs');
const glob = require('glob');
const indentString = require('indent-string');

const app = express();

let sitePath = __dirname + `/dist/**/index.html`;
//console.log(sitePath);
const siteFiles = glob.sync(sitePath);
//console.log(siteFiles);

siteFiles.forEach(file => {
	const requestPath = file.split('dist/')[1];
	let expressPath = requestPath.split('/index.html')[0];
	//console.log(expressPath);

	if (requestPath == 'index.html') {
		//console.log('root');
		expressPath = '';
	}

	let data = fs.readFileSync(__dirname + '/src/pages/' + expressPath + '/data.json', 'utf8');
	console.log(data);
	let json = JSON.parse(data);
	json.stylePath = '../scss/main.scss';
	console.log('request path = '+ requestPath);
	console.log('express path = ' + expressPath);
	console.log('this is json' + json.title);
	if(expressPath!==''){
		let position;
		position = requestPath.match(/\//ig).length;
		console.log(position);
		for(i=0; i<position; i++){
			console.log('LOOP')
			json.stylePath = '../' + json.stylePath;
		}
	}
	else{
		
	}
	data = JSON.stringify(json);
	console.log(json);

	let dataAsPug = '-\n' + indentString(data, 1, { indent: '\t' });
	//console.log(dataAsPug);

	fs.writeFileSync(__dirname + '/src/pages/' + expressPath + '/_data.pug', dataAsPug, 'utf8');

	app.get(expressPath, function (req, res) {
		//console.log(__dirname + '/dist/' + requestPath);
		res.sendFile(path.join(__dirname + '/dist/' + requestPath));
		//console.log(__dirname);
	});

});

let bundler = new Bundler('src/pages/index.pug');


app.set(express.static(__dirname + '/dist'));
app.use(bundler.middleware());
app.listen(5000);