// @ts-check
const _ = require('lodash');

const bookmarkSearcher = require('../bookmark/bookmarkSearcher');
const historyFormatter = require('../history/historyFormatter');

module.exports = function firefoxHistoryBookmarkSearch(pluginContext) {
  const zipResults = _.flow([_.zip, _.flatten, _.compact]);

  return async (query, env = {}) => {
    if (query.length === 0) return [];
    const limit = env.limit || 15;

    const [historyList, bookmarkList] = await Promise.all([
      historyFormatter(query, limit, pluginContext, env.profileVersion),
      bookmarkSearcher(query, env.profileVersion),
    ]);
    pluginContext.console.log('info', 'get result [0]', {
      limit,
      firstHistory: historyList[0],
      firstBookmark: bookmarkList[0],
    });
    return _.take(zipResults(historyList, bookmarkList), limit);
  };
};
