const chalk = require('chalk');

const consoleXs = chalk.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

function consoleError(error){
    console.log();
    console.log(consoleXs);
    console.log();
    console.log(chalk.red(error));
    console.log();
    console.log(consoleXs);
    console.log();
}

module.exports.consoleError = consoleError;