const path = require('path');
const lib = require('./lib');
const { argv } = require('yargs')
    .usage("$0 <path>");

if (module.parent) throw new Error(`Can't be imported`);

process.on('unhandledRejection', error => {
    throw error;
});

const [dir] = argv._;

lib(dir);