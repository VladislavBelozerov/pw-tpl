#! /usr/bin/env node

const { program } = require('commander');
const init = require('commands/init');

program.command('init').description('Initialize project').action(init)

program.parse();