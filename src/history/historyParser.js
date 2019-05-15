// @ts-check
const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');
const fs = require('fs');

const copyFileAsync = promisify(fs.copyFile);
const execAsync = promisify(exec);

async function historyParser(profileFolderPath, query, limit, pluginContext) {
  const historyDbPath = path.join(profileFolderPath, 'places.sqlite');
  const tmpHistoryDbPath = `${historyDbPath}.tmp`;
  const shellFriendlyTmpDBPath = tmpHistoryDbPath.replace(' ', '\\ ');
  const sql = `SELECT url, last_visit_date, frecency, title FROM 'moz_places' WHERE url LIKE '%${query}%' OR title LIKE '%${query}%' ORDER BY frecency DESC, last_visit_date DESC LIMIT ${limit};`;
  try {
    await copyFileAsync(historyDbPath, tmpHistoryDbPath);
    // binary from https://www.sqlite.org/download.html
    const shellCommandToReadData = `${__dirname}/sqlite3 ${shellFriendlyTmpDBPath} "${sql}"`;
    pluginContext.console.log('info', 'parsing sqlite3', {
      shellCommandToReadData,
    });
    const result = await execAsync(shellCommandToReadData);
    // sometimes result is stdout, sometimes it's "stdout" that is stdout. Depends on nodejs runtime version
    const { stdout, stderr } = result;
    pluginContext.console.log('info', 'result of parsing sqlite3', {
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
  } catch (error) {
    console.error(error);
  }
}

module.exports = historyParser;
