# wav-audio-length

## description
wav audio play duration seconds calculator.

## install

```sh
npm install --save wav-audio-length
```

## usage
### duration
- duration function return wav file audio length (seconds).

```js
const fs = require("fs");
const duration = require("wav-audio-length").default;

const wavFile = '...';

fs.readFile(wavFile, 'binary', (err, content) => {
  if (err) {
    return;
  }
  let buffer = Buffer.from(content, 'binary');
  let sec = duration(buffer);

  console.log(sec);
});
```

