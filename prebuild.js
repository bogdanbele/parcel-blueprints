const Bundler = require('parcel-bundler');
const path = require("path");
const fs = require('fs');
const glob = require('glob');
const indentString = require('indent-string');

let sitePath = __dirname + `/dist/**/index.html`;
console.log(sitePath);
const siteFiles = glob.sync(sitePath);
console.log(siteFiles);

console.log('inside prebuild');

siteFiles.forEach(file => {
	const requestPath = file.split('dist/')[1];
	let expressPath = requestPath.split('/')[0];
	console.log(expressPath);

	if (requestPath == 'index.html') {
		console.log('root');
		expressPath = '';
	}

	const data = fs.readFileSync(__dirname + '/src/pages/' + expressPath + '/data.json', 'utf8');
	console.log(data);
	let dataAsPug = '-\n' + indentString(data, 1, { indent: '\t' });
	console.log(dataAsPug);
	fs.writeFileSync(__dirname + '/src/pages/' + expressPath + '/_data.pug', dataAsPug, 'utf8');



});