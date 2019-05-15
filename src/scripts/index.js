const firefoxHistoryBookmarkSearch = require('./searchAll');

function search(pluginContext) {
  const searcher = firefoxHistoryBookmarkSearch(pluginContext)
  return {
    respondsTo(query, env = {}) {
      return env.prefix === false && query.length > 1;
    },
    search(query, env) {
      return searcher(query, env);
    },
  };
}

module.exports = search;
