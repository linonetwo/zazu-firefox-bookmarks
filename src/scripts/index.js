const firefoxHistoryBookmarkSearch = require('./searchAll');

function search() {
  return {
    respondsTo(query, env = {}) {
      return env.prefix === false && query.length > 1;
    },
    search(query, env) {
      return firefoxHistoryBookmarkSearch(query, env);
    },
  };
}

module.exports = search;
