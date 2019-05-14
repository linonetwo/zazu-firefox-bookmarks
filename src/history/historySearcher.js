// @ts-check
const sqlite3 = require('sqlite3');
const path = require('path');
const promisify = require('util.promisify');
const fs = require('fs');
const _ = require('lodash');

const copyFileAsync = promisify(fs.copyFile);
const tryDecodeURI = require('../utils/tryDecodeURI');

async function historySearcher(query, profileFolderPath, limit, pluginContext) {
  const historyDbPath = path.join(profileFolderPath, 'places.sqlite');
  pluginContext.console.log('info', 'search history db', {
    historyDbPath,
  });
  const tmpHistoryDbPath = `${historyDbPath}.tmp`;
  try {
    await copyFileAsync(historyDbPath, tmpHistoryDbPath);
    const historyDb = new sqlite3.Database(tmpHistoryDbPath, sqlite3.OPEN_READONLY);
    const all = sql =>
      new Promise((resolve, reject) =>
        historyDb.all(sql, (error, result) => (error ? reject(error) : resolve(result))),
      );
    const resultList = await all(`
    SELECT title, url, last_visit_date, frecency FROM 'moz_places'
    WHERE url LIKE '%${query}%' OR title LIKE '%${query}%'
    ORDER BY frecency DESC, last_visit_date DESC
    LIMIT ${limit};
    `);
    return resultList.map(({ title, url, last_visit_date: date, frecency }) => ({
      title,
      subtitle: tryDecodeURI(url),
      value: url,
      icon: 'fa-history',
      id: `${date}-${frecency}`,
    }));
  } catch (error) {
    pluginContext.console.error('search history db failed', {
      error,
      errorString: String(error),
    });
    return [];
  }
}

module.exports = historySearcher;
