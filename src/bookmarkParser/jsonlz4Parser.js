const Promise = require('bluebird');
const lz4 = require('lz4');

function parser(inputBuffer) {
  return new Promise((resolve, reject) => {
    if (!Buffer.isBuffer(inputBuffer)) {
      return reject(new Error('Input is not of type Buffer'));
    }

    // Verifiy custom Mozilla LZ4 header / Magic number
    if (inputBuffer.slice(0, 8).toString() !== 'mozLz40\0') {
      return reject(new Error('Input does not seem to be jsonlz4 format'));
    }

    const outputBuffer = Buffer.alloc(inputBuffer.readUInt32LE(8));
    lz4.decodeBlock(inputBuffer, outputBuffer, 12);

    resolve(outputBuffer.toString());
  });
}

module.exports = parser;
