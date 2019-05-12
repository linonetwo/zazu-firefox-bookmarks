const Promise = require('bluebird');
const os = require('os');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const stringify = require('json-stringify-safe');

const JSONLZ4Parser = require('./jsonlz4Parser');

function readFromJSONLZ4File(filePath) {
  return fs.readFileAsync(filePath).then(JSONLZ4Parser);
}

function readBookmarkBackup(version = 'default') {
  let filePath;
  switch (os.type()) {
    case 'Darwin':
      filePath = `${os.homedir()}/Library/Application Support/Firefox/Profiles`;
      return fs
        .readdirAsync(filePath)
        .then(dirs => dirs.filter(each => each.split('.')[1] === version))
        .then(dir => (filePath = path.join(filePath, dir[0], 'bookmarkbackups')))
        .then(dir => fs.readdirAsync(dir))
        .then(files => files.sort().reverse()[0])
        .then(filename => {
          return fs
            .readFileAsync(path.join(filePath, filename))
            .then(JSONLZ4Parser)
            .then(JSON.parse)
            .then(content => ({ filename, content }));
        });
      break;
    case 'Windows_NT':
      filePath = path.join(os.homedir(), 'AppData', 'Roaming', 'Mozilla', 'Firefox');
      // TODO
      return Promise.resolve({});
      break;
    case 'Linux':
      filePath = path.join(os.homedir(), '.mozilla', 'firefox');
      // TODO
      return Promise.resolve({});
      break;
  }
}

module.exports = {
  readBookmarkBackup,
  readFromJSONLZ4File,
};
