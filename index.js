#! /usr/bin/env node
import {program} from "commander";
import init from "./commands/init.js";
import {runCommand} from "./runCommand.js";

program.command('init').description('Initialize project').action(() => runCommand(init))

program.parse();