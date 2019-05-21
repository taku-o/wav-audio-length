"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Riff {
    constructor() {
        this.id = 'RIFF';
        this.format = 'WAVE';
        this.subChunks = [];
    }
    static isChunk(buffer) {
        if (buffer.length < 4) {
            return false;
        }
        const id = buffer.readUIntBE(0, 4);
        const idName = Buffer.from(id.toString(16), 'hex').toString();
        return idName == 'RIFF';
    }
    static from(buffer) {
        const chunk = new Riff();
        chunk.id = Buffer.from(buffer.readUIntBE(0, 4).toString(16), 'hex').toString();
        chunk.size = buffer.readUIntLE(4, 4);
        chunk.chunkLength = chunk.size + 8;
        chunk.format = Buffer.from(buffer.readUIntBE(8, 4).toString(16), 'hex').toString();
        let pos = 12;
        while (pos < chunk.chunkLength) {
            if (Fmt.isChunk(buffer.slice(pos))) {
                const sub = Fmt.from(buffer.slice(pos));
                chunk.subChunks.push(sub);
                pos += sub.chunkLength;
                continue;
            }
            else if (WavData.isChunk(buffer.slice(pos))) {
                const sub = WavData.from(buffer.slice(pos));
                chunk.subChunks.push(sub);
                pos += sub.chunkLength;
                continue;
            }
            else {
                break;
            }
        }
        return chunk;
    }
}
exports.Riff = Riff;
class Fmt {
    constructor() {
        this.chunkLength = 24;
        this.id = 'fmt ';
        this.size = 16;
        this.audioFormat = 1;
    }
    static isChunk(buffer) {
        if (buffer.length < 4) {
            return false;
        }
        const id = buffer.readUIntBE(0, 4);
        const idName = Buffer.from(id.toString(16), 'hex').toString();
        return idName == 'fmt ';
    }
    static from(buffer) {
        const chunk = new Fmt();
        chunk.id = Buffer.from(buffer.readUIntBE(0, 4).toString(16), 'hex').toString();
        chunk.size = buffer.readUIntLE(4, 4);
        chunk.audioFormat = buffer.readUIntLE(8, 2);
        chunk.numChannels = buffer.readUIntLE(10, 2);
        chunk.sampleRate = buffer.readUIntLE(12, 4);
        chunk.byteRate = buffer.readUIntLE(16, 4);
        chunk.blockAlign = buffer.readUIntLE(20, 2);
        chunk.bitsPerSample = buffer.readUIntLE(22, 2);
        return chunk;
    }
}
exports.Fmt = Fmt;
class WavData {
    constructor() {
        this.id = 'data';
    }
    static isChunk(buffer) {
        if (buffer.length < 4) {
            return false;
        }
        const id = buffer.readUIntBE(0, 4);
        const idName = Buffer.from(id.toString(16), 'hex').toString();
        return idName == 'data';
    }
    static from(buffer) {
        const chunk = new WavData();
        chunk.id = Buffer.from(buffer.readUIntBE(0, 4).toString(16), 'hex').toString();
        chunk.size = buffer.readUIntLE(4, 4);
        chunk.chunkLength = chunk.size + 8;
        chunk.wavBuffer = buffer.slice(8, chunk.size + 8);
        return chunk;
    }
}
exports.WavData = WavData;
