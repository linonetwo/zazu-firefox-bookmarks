// @ts-check
const Promise = require('bluebird');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const readdirAsync = Promise.promisify(fs.readdir);
const execAsync = Promise.promisify(exec);

function bookmarkParser(version = 'default') {
  let filePath;
  switch (os.type()) {
    case 'Windows_NT':
      filePath = path.join(os.homedir(), 'AppData', 'Roaming', 'Mozilla', 'Firefox');
      // TODO
      return Promise.resolve({ filename: 'not inplemented for windows', content: {} });
    case 'Linux':
      filePath = path.join(os.homedir(), '.mozilla', 'firefox');
      // TODO
      return Promise.resolve({ filename: 'not inplemented for linux', content: {} });
    case 'Darwin':
    default:
      filePath = `${os.homedir()}/Library/Application Support/Firefox/Profiles`;
      return readdirAsync(filePath)
        .then(dirs => {
          const userProfileDir = dirs.filter(each => each.split('.')[1] === version)[0];
          filePath = path.join(filePath, userProfileDir, 'bookmarkbackups');
          return readdirAsync(filePath);
        })
        .then(files => files.sort().reverse()[0])
        .then(filename => {
          filePath = path.join(filePath, filename);
          return execAsync(`${__dirname}/mozlz4 ${filePath.replace(' ', '\\ ')}`)
            .then(JSON.parse)
            .then(content => ({ filename, content }));
        });
  }
}

module.exports = bookmarkParser;
