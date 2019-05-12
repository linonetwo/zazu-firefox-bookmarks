// @ts-check
const { search } = require('fast-fuzzy');
const traverse = require('traverse');
const bookmarkParser = require('./bookmarkParser');

function firefoxBookmarkSearch(pluginContext) {
  return (query, env = {}) => {
    if (query.length === 0) return Promise.resolve([]);
    pluginContext.console.log('warn', 'reading profile', {
      env,
      from: env.profilePath || 'default profile path',
    });
    return bookmarkParser(env.profilePath, pluginContext).then(({ filename, content }) => {
      pluginContext.console.log('warn', 'profile loaded', {
        filename,
      });
      const bookmarks = traverse(content).reduce((accumulate, item) => {
        if (item && typeof item === 'object' && typeof item.uri === 'string') accumulate.push(item);
        return accumulate;
      }, []);

      const filteredBookmarks = search(query, bookmarks, { keySelector: item => item.title + item.uri });
      const resultItems = filteredBookmarks.map(({ title, uri, lastModified, iconuri, index }) => ({
        title,
        subtitle: uri,
        value: uri,
        icon: iconuri || 'fa-bookmark',
        id: `${lastModified}-${index}`,
      }));
      pluginContext.console.log('warn', 'get result [0]', {
        limit: env.limit || 15,
        firstItem: resultItems[0],
      });
      return resultItems.slice(0, env.limit || 15);
    });
  };
}

module.exports = firefoxBookmarkSearch;
