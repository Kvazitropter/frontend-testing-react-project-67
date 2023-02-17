#!/usr/bin/env node
import { Command } from 'commander';
import pageLoader from '../src/pageLoader.js';

const program = new Command();

program
  .version('0.0.1', '-V, --version', 'output the version number')
  .description('Loads the web page from a source to a local directory')
  .helpOption('-h, --help', 'display help for command')
  .option('-o, --output <path>', `output directory (default: ${process.cwd()})`, process.cwd())
  .argument('<url>', 'path to load page')
  .action(async (url) => {
    const outputPath = program.opts().output;
    const { filepath } = await pageLoader(url, outputPath);
    const message = `Page was successufully downloaded into ${filepath}`;
    console.log(message);
  });

program.parse();
