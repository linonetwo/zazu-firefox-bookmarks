// @ts-check
const { promisify } = require('util');
const os = require('os');
const fs = require('fs');
const path = require('path');

const readdirAsync = promisify(fs.readdir);

function getProfilePath(version = 'default') {
  switch (os.type()) {
    case 'Windows_NT': {
      const filePath = path.join(os.homedir(), 'AppData', 'Roaming', 'Mozilla', 'Firefox');
      return Promise.resolve(filePath);
    }
    case 'Linux': {
      const filePath = path.join(os.homedir(), '.mozilla', 'firefox');
      return Promise.resolve(filePath);
    }
    case 'Darwin':
    default: {
      const filePath = `${os.homedir()}/Library/Application Support/Firefox/Profiles`;
      return readdirAsync(filePath).then(subDirs => {
        const userProfileDir = subDirs.filter(dirName => dirName.split('.')[1] === version)[0];
        return path.join(filePath, userProfileDir);
      });
    }
  }
}

module.exports = getProfilePath;
