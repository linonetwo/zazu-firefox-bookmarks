// @ts-check
const path = require('path');
const promisify = require('util.promisify');
const { exec } = require('child_process');
const fs = require('fs');

const readdirAsync = promisify(fs.readdir);
const execAsync = promisify(exec);

function bookmarkParser(profileFolderPath, pluginContext) {
  const bookmarkDirPath = path.join(profileFolderPath, 'bookmarkbackups');
  return readdirAsync(bookmarkDirPath).then(files => {
    const latestFileName = files.sort().reverse()[0];
    const fileFullPath = path.join(bookmarkDirPath, latestFileName);
    const shellFriendlyPath = fileFullPath.replace(' ', '\\ ');
    const shellCommandToReadData = `${__dirname}/mozlz4 ${shellFriendlyPath}`;
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
      .then(JSON.parse);
  });
}

module.exports = bookmarkParser;
