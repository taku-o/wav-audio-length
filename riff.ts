interface Chunk {
  chunkLength: number;
  id: string;
  size: number;
}

/**
 * RIFF
 */
export class Riff implements Chunk {
  chunkLength: number;
  id: string = 'RIFF';
  size: number;
  format: string = 'WAVE';
  subChunks: Chunk[] = [];

  constructor() {}
  static isChunk(buffer: Buffer) {
    if (buffer.length < 4) {
      return false;
    }
    const id = buffer.readUIntBE(0, 4);
    const idName = Buffer.from(id.toString(16), 'hex').toString();
    return idName == 'RIFF';
  }
  static from(buffer: Buffer) {
    const chunk = new Riff();
    // 1-4 Chunk ID "RIFF"
    chunk.id = Buffer.from(buffer.readUIntBE(0, 4).toString(16), 'hex').toString();
    // 5-8 Chunk Size
    chunk.size = buffer.readUIntLE(4, 4);
    chunk.chunkLength = chunk.size + 8;
    // 9-12  Format "WAVE"
    chunk.format = Buffer.from(buffer.readUIntBE(8, 4).toString(16), 'hex').toString();
    // 13-   SubChunks
    let pos = 12;
    while (pos < chunk.chunkLength) {
      if (Fmt.isChunk(buffer.slice(pos))) {
        const sub = Fmt.from(buffer.slice(pos));
        chunk.subChunks.push(sub);
        pos += sub.chunkLength;
        continue;
      } else if (WavData.isChunk(buffer.slice(pos))) {
        const sub = WavData.from(buffer.slice(pos));
        chunk.subChunks.push(sub);
        pos += sub.chunkLength;
        continue;
      } else {
        break;
      }
    }
    // return
    return chunk;
  }
}

/**
 * fmt Chunk
 */
export class Fmt implements Chunk {
  chunkLength: number = 24;
  id: string = 'fmt ';
  size: number = 16;
  audioFormat: number = 1;
  numChannels: number;
  sampleRate: number;
  byteRate: number;
  blockAlign: number;
  bitsPerSample: number;

  constructor() {}
  static isChunk(buffer: Buffer) {
    if (buffer.length < 4) {
      return false;
    }
    const id = buffer.readUIntBE(0, 4);
    const idName = Buffer.from(id.toString(16), 'hex').toString();
    return idName == 'fmt ';
  }
  static from(buffer: Buffer) {
    const chunk = new Fmt();
    // 1-4 Subchunk1 ID "fmt"
    chunk.id = Buffer.from(buffer.readUIntBE(0, 4).toString(16), 'hex').toString();
    // 5-8 Subchunk1 Size "16"
    chunk.size = buffer.readUIntLE(4, 4);
    // 9-10 Audio Format "1"
    chunk.audioFormat = buffer.readUIntLE(8, 2);
    // 11-12 Num Channels
    chunk.numChannels = buffer.readUIntLE(10, 2);
    // 13-16 Sample Rate
    chunk.sampleRate = buffer.readUIntLE(12, 4);
    // 17-20 Byte Rate
    chunk.byteRate = buffer.readUIntLE(16, 4);
    // 21-22 Block Align
    chunk.blockAlign = buffer.readUIntLE(20, 2);
    // 23-24 Bits Per Sample
    chunk.bitsPerSample = buffer.readUIntLE(22, 2);
    // return
    return chunk;
  }
}

/**
 * Wave Data Chunk
 */
export class WavData implements Chunk {
  chunkLength: number;
  id: string = 'data';
  size: number;
  wavBuffer: Buffer;

  constructor() {}
  static isChunk(buffer: Buffer) {
    if (buffer.length < 4) {
      return false;
    }
    const id = buffer.readUIntBE(0, 4);
    const idName = Buffer.from(id.toString(16), 'hex').toString();
    return idName == 'data';
  }
  static from(buffer: Buffer) {
    const chunk = new WavData();
    // 1-4 Subchunk2 ID "data"
    chunk.id = Buffer.from(buffer.readUIntBE(0, 4).toString(16), 'hex').toString();
    // 5-8 Subchunk2 Size
    chunk.size = buffer.readUIntLE(4, 4);
    chunk.chunkLength = chunk.size + 8;
    // 9-  Subchunk2 data
    chunk.wavBuffer = buffer.slice(8, chunk.size + 8);
    // return
    return chunk;
  }
}
