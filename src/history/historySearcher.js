// @ts-check
const Trilogy = require('trilogy');
const path = require('path');

const tryDecodeURI = require('../utils/tryDecodeURI');

function historySearcher(query, profileFolderPath, pluginContext) {
  const historyDbPath = path.join(profileFolderPath, 'places.sqlite');
  pluginContext.console.log('warn', 'search history db', {
    historyDbPath,
  });
  // console.log(Trilogy);

  const db = new Trilogy(historyDbPath, {
    client: 'sql.js',
  });
  return db
    .raw(
      db.knex.raw(`
        SELECT last_visit_date, frecency, url, title FROM 'moz_places'
        WHERE url LIKE '%${query}%' OR title LIKE '%${query}%'
        ORDER BY frecency DESC, last_visit_date DESC;
      `),
      true,
    )
    .then(resultList =>
      db.close().then(() =>
        resultList.map(({ title, url, last_visit_date: date, frecency }) => ({
          title,
          subtitle: tryDecodeURI(url),
          value: url,
          icon: 'fa-history',
          id: `${date}-${frecency}`,
        })),
      ),
    );
}

module.exports = historySearcher;
