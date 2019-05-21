"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const riff_1 = require("./riff");
function duration(wavBuffer) {
    let riff = riff_1.Riff.from(wavBuffer);
    let fmt = null;
    let wavData = null;
    for (let chunk of riff.subChunks) {
        if (chunk instanceof riff_1.Fmt) {
            fmt = chunk;
        }
        if (chunk instanceof riff_1.WavData) {
            wavData = chunk;
        }
    }
    if (fmt && wavData) {
    }
    else {
        throw new Error('invalid wav format.');
    }
    const numChannels = fmt.numChannels;
    const byteRate = fmt.byteRate;
    const byteLength = wavData.size;
    return byteLength / numChannels / byteRate;
}
exports.default = duration;
