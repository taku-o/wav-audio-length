#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const duration_1 = require("../duration");
const args = process.argv.slice(2);
if (args.length < 1) {
    process.exit(1);
}
const wavFile = args[0];
fs.readFile(wavFile, 'binary', (err, content) => {
    if (err) {
        console.error(err);
        return;
    }
    let buffer = Buffer.from(content, 'binary');
    console.log(`${duration_1.default(buffer)} (sec.)`);
});
