// @ts-check
const _ = require('lodash');

const bookmarkParser = require('../bookmark');
const bookmarkSearcher = require('../bookmark/bookmarkSearcher');
const historySearcher = require('../history/historySearcher');
const getProfilePath = require('../utils/getProfilePath');

function firefoxHistoryBookmarkSearch(pluginContext) {
  const zipResults = _.flow([_.zip, _.flatten, _.compact]);

  return (query, env = {}) => {
    if (query.length === 0) return Promise.resolve([]);
    pluginContext.console.log('warn', 'reading profile', {
      env,
      from: env.profilePath || 'default profile path',
      profileVersion: env.profileVersion || 'default profile version',
    });
    return (env.profilePath ? Promise.resolve(env.profilePath) : getProfilePath(env.profileVersion)).then(
      profileFolderPath =>
        Promise.all([
          historySearcher(query, profileFolderPath, pluginContext),
          bookmarkParser(profileFolderPath, pluginContext).then(bookmarkJSON => bookmarkSearcher(query, bookmarkJSON)),
        ]).then(([historyList, bookmarkList]) => {
          pluginContext.console.log('warn', 'get result [0]', {
            limit: env.limit || 15,
            firstHistory: historyList[0],
            firstBookmark: bookmarkList[0],
          });
          return _.take(zipResults(historyList, bookmarkList), env.limit || 15);
        }),
    );
  };
}

module.exports = firefoxHistoryBookmarkSearch;
