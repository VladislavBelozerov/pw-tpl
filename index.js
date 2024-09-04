#! /usr/bin/env node
import {program} from "commander";
import init from "./commands/init.js";
import {runCommand} from "./utils/runCommand.js";
import addModule from "./commands/addModule.js";

program.command('init')
    .description('Initialize project')
    .action(() => runCommand(init))
program.command('add:module')
    .argument('<name>', 'module name')
    .option('-js', 'includes js file')
    .option('-vue', 'includes vue file')
    .option('-tests', 'includes test file')
    .description('Add a new module')
    .action((name, options) => runCommand(addModule, name, options))

program.parse();