// @ts-check
const initSqlJs = require('sql.js');
const path = require('path');
const promisify = require('util.promisify');
const fs = require('fs');
const _ = require('lodash')

const readFileAsync = promisify(fs.readFile);
const tryDecodeURI = require('../utils/tryDecodeURI');

function historySearcher(query, profileFolderPath, limit, pluginContext) {
  const historyDbPath = path.join(profileFolderPath, 'places.sqlite');
  pluginContext.console.log('info', 'search history db', {
    historyDbPath,
  });
  return initSqlJs().then(SQL =>
    readFileAsync(historyDbPath).then(dbFile => {
      const historyDb = new SQL.Database(dbFile);

      const result = historyDb.exec(
        `
          SELECT title, url, last_visit_date, frecency FROM 'moz_places'
          WHERE url LIKE '%${query}%' OR title LIKE '%${query}%'
          ORDER BY frecency DESC, last_visit_date DESC
          LIMIT ${limit};
        `,
      );
      const resultList = _.get(result, '[0].values', []);
      return resultList.map(([title, url, date, frecency]) => ({
        title,
        subtitle: tryDecodeURI(url),
        value: url,
        icon: 'fa-history',
        id: `${date}-${frecency}`,
      }));
    }),
  );
}

module.exports = historySearcher;
