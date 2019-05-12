const { search } = require('fast-fuzzy');
const traverse = require('traverse');
const bookmarkParser = require('./bookmarkParser');

function firefoxBookmarkSearch(pluginContext) {
  return (query, { profilePath } = {}) => {
    if (query.length === 0) return Promise.resolve([]);
    pluginContext.console.log('warn', 'reading profile', {
      from: profilePath || 'default profile path',
    });
    return bookmarkParser(profilePath).then(({ filename, content }) => {
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
      return resultItems;
    });
  };
}

module.exports = firefoxBookmarkSearch;
