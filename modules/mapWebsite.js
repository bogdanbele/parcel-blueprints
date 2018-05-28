const glob = require('glob');
module.exports.mapWebsite = mapWebsite;


function mapWebsite(directoryName) {
    let sitePath = directoryName + `/src/**/index.pug`;
    let paths = [];
    console.log(sitePath);
    const siteFiles = glob.sync(sitePath);
    siteFiles.forEach(file => {
        const requestPath = file.split('pages/')[1];
        

        if (requestPath == 'index.pug') {
            expressPath = '';
        }

        paths.push(requestPath);
    });

    return paths;
};
