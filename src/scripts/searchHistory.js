// @ts-check
const _ = require('lodash');

const historySearcher = require('../history/historySearcher');
const getProfilePath = require('../utils/getProfilePath');

function firefoxHistoryBookmarkSearch(pluginContext) {
  return (query, env = {}) => {
    if (query.length === 0) return Promise.resolve([]);
    const limit = env.limit || 15;
    pluginContext.console.log('warn', 'reading profile', {
      env,
      from: env.profilePath || 'default profile path',
      profileVersion: env.profileVersion || 'default profile version',
    });
    return (env.profilePath ? Promise.resolve(env.profilePath) : getProfilePath(env.profileVersion)).then(
      profileFolderPath =>
        historySearcher(query, profileFolderPath, limit, pluginContext)
          .then(historyList => {
            pluginContext.console.log('warn', 'get result [0]', {
              limit,
              firstHistory: historyList[0],
            });
            return _.take(historyList, limit);
          })
          .catch(error => {
            pluginContext.console.log('error', 'failed historySearcher', {
              error,
              errorString: String(error),
            });
          }),
    );
  };
}

module.exports = firefoxHistoryBookmarkSearch;
