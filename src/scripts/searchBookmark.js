// @ts-check
const _ = require('lodash');

const bookmarkParser = require('../bookmark');
const bookmarkSearcher = require('../bookmark/bookmarkSearcher');
const getProfilePath = require('../utils/getProfilePath');

function firefoxHistoryBookmarkSearch(pluginContext) {
  return (query, env = {}) => {
    if (query.length === 0) return Promise.resolve([]);
    pluginContext.console.log('warn', 'reading profile', {
      env,
      from: env.profilePath || 'default profile path',
      profileVersion: env.profileVersion || 'default profile version',
    });
    return (env.profilePath ? Promise.resolve(env.profilePath) : getProfilePath(env.profileVersion)).then(
      profileFolderPath =>
        bookmarkParser(profileFolderPath, pluginContext)
          .then(bookmarkJSON => bookmarkSearcher(query, bookmarkJSON))
          .then(bookmarkList => {
            pluginContext.console.log('warn', 'get result [0]', {
              limit: env.limit || 15,
              firstBookmark: bookmarkList[0],
            });
            return _.take(bookmarkList, env.limit || 15);
          }),
    );
  };
}

module.exports = firefoxHistoryBookmarkSearch;
