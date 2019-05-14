// @ts-check
const _ = require('lodash');

const bookmarkParser = require('../bookmark/bookmarkParser');
const bookmarkSearcher = require('../bookmark/bookmarkSearcher');
const historySearcher = require('../history/historySearcher');
const getProfilePath = require('../utils/getProfilePath');

function firefoxHistoryBookmarkSearch(pluginContext) {
  const zipResults = _.flow([_.zip, _.flatten, _.compact]);

  return (query, env = {}) => {
    if (query.length === 0) return Promise.resolve([]);
    const limit = env.limit || 15;
    pluginContext.console.log('info', 'reading profile', {
      env,
      from: env.profilePath || 'default profile path',
      profileVersion: env.profileVersion || 'default profile version',
    });
    return (env.profilePath ? Promise.resolve(env.profilePath) : getProfilePath(env.profileVersion)).then(
      profileFolderPath =>
        Promise.all([
          historySearcher(query, profileFolderPath, limit, pluginContext),
          bookmarkParser(profileFolderPath, pluginContext).then(bookmarkJSON => bookmarkSearcher(query, bookmarkJSON)),
        ]).then(([historyList, bookmarkList]) => {
          pluginContext.console.log('info', 'get result [0]', {
            limit,
            firstHistory: historyList[0],
            firstBookmark: bookmarkList[0],
          });
          return _.take(zipResults(historyList, bookmarkList), limit);
        }),
    );
  };
}

module.exports = firefoxHistoryBookmarkSearch;
