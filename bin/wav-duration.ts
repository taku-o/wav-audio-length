#!/usr/bin/env node
import * as fs from 'fs';
import duration from '../duration';

// wav-duration sample.wav

// params
const args = process.argv.slice(2);
if (args.length < 1) {
  process.exit(1);
}
const wavFile = args[0];

// parser and print out
fs.readFile(wavFile, 'binary', (err, content) => {
  if (err) {
    console.error(err);
    return;
  }
  let buffer = Buffer.from(content, 'binary');
  console.log(`${duration(buffer)} (sec.)`);
});
