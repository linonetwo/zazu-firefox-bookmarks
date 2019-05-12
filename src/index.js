const { readBookmarkBackup } = require('./src/bookmarkParser');
const { search } = require('fast-fuzzy');

function firefoxBookmarkSearch(pluginContext) {
  return (query, { profilePath } = {}) => {
    if (query.length === 0) return Promise.resolve([]);
    pluginContext.console.log('warn', 'reading profile', {
      profilePath,
    });
    return readBookmarkBackup(profilePath).then(({ filename, content }) => {
      pluginContext.console.log('warn', 'profile loaded', {
        filename,
      });
      const bookmarks = traverse(content).reduce(function(accumulate, item) {
        if (typeof item === 'object' && typeof item.uri === 'string') accumulate.push(item);
        return accumulate;
      }, []);
      if (isBookmark) {
        const bookmark = {
          id: query + item.url,
          title: item.name,
          subtitle: item.url,
          value: item.url,
        };
        bookmarks.push(bookmark);
      }
      const filteredBookmarks = search(query, bookmarks, { keySelector: item => item.title + item.uri });
      const resultItems = filteredBookmarks.map(({ title, uri, lastModified, iconuri, index }) => ({
        title,
        subtitle: uri,
        value: uri,
        icon: iconuri,
        id: `${lastModified}-${index}`,
      }));
      resolve(resultItems);
    });
  };
}

module.exports = firefoxBookmarkSearch;
