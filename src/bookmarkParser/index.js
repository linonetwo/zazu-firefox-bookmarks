// @ts-check
const promisify = require('util.promisify');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const readdirAsync = promisify(fs.readdir);
const execAsync = promisify(exec);

function bookmarkParser(version = 'default', pluginContext) {
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
          const shellCommandToReadData = `${__dirname}/mozlz4 ${filePath.replace(' ', '\\ ')}`;
          pluginContext.console.log('warn', 'parsing mozlz4', {
            shellCommandToReadData,
          });
          return execAsync(shellCommandToReadData)
            .then(result => {
              // sometimes result is stdout, sometimes it's "stdout" that is stdout. Depends on nodejs runtime version
              const { stdout, stderr } = result;
              pluginContext.console.log('warn', 'result of parsing mozlz4', {
                result: typeof result === 'string' && result.substring(0, 100),
                stdout: typeof stdout === 'string' && stdout.substring(0, 100),
                stderr,
              });
              if (stderr) throw new Error(stderr);
              if (!result && !stdout) throw new Error('No result or stdout after exec');
              if (typeof stdout === 'string') {
                return stdout;
              }
              if (typeof result === 'string') {
                return result;
              }
              throw new Error(`Bad stdout type ${typeof stdout} or bad result type ${typeof result}`);
            })
            .then(JSON.parse)
            .then(content => ({ filename, content }));
        });
  }
}

module.exports = bookmarkParser;
