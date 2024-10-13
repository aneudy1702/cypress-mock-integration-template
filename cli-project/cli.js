#!/usr/bin/env node

const { Command } = require('commander');
const initCommand = require('./commands/init');

const program = new Command();

program.version('1.0.0');

// Register commands
program
  .command('init')
  .description('Initialize Cypress mock integration template')
  .action(initCommand);

// Parse the arguments
program.parse(process.argv);
