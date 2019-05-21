import {Riff, Fmt, WavData} from './riff';

function duration(wavBuffer: Buffer): number {
  let riff = Riff.from(wavBuffer);

  let fmt = null;
  let wavData = null;
  for (let chunk of riff.subChunks) {
    if (chunk instanceof Fmt) {
      fmt = chunk;
    }
    if (chunk instanceof WavData) {
      wavData = chunk;
    }
  }
  if (fmt && wavData) {
    // do nohing;
  } else {
    throw new Error('invalid wav format.');
  }

  const numChannels = fmt.numChannels;
  const byteRate = fmt.byteRate;
  const byteLength = wavData.size;
  return byteLength / numChannels / byteRate;
}

export default duration;
