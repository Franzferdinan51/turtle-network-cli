#!/usr/bin/env node

const program = require('commander');
const { prompt } = require('inquirer');
var colors = require('colors');

const {
    market,
    supply,
    network,
    price,
    ascii
} = require('./index');

program
    .version('1.0.0')
    .description('TRTL CLI')

program.on('command:*', function() {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
    process.exit(1);
});

function make_red(txt) {
    return colors.red(txt); //display the help text in red on the console
}

if (!process.argv.slice(2).length) {
    program.outputHelp(make_red);
    return;
}

program
    .command('market')
    .alias('m')
    .description('List market data')
    .action(() => market());

program
    .command('supply')
    .alias('s')
    .description('List circulating supply')
    .action(() => supply());

program
    .command('network')
    .alias('n')
    .description('Shows network data')
    .action(() => network());

<<<<<<< HEAD
  program
    .command('ascii [pic]')
=======
var qty;
program
    .command('price [qty]')
    .alias('p')
    .description('Update a customer')
    .action((qty) => price(qty));

program
    .command('ascii <cmd>')
>>>>>>> 0144919dc3daeb4848458e3a79791ccc93badb32
    .alias('a')
    .description('Displays ASCII art')
    .action((pic) => ascii(pic));



program.parse(process.argv);