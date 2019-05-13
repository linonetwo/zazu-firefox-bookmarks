// @ts-check
const { search } = require('fast-fuzzy');
const traverse = require('traverse');

const tryDecodeURI = require('../utils/tryDecodeURI');

module.exports = function bookmarkSearcher(query, bookmarkJSON) {
  const bookmarks = traverse(bookmarkJSON).reduce((accumulate, item) => {
    if (item && typeof item === 'object' && typeof item.uri === 'string') accumulate.push(item);
    return accumulate;
  }, []);

  const filteredBookmarks = search(query, bookmarks, { keySelector: item => item.title + item.uri });
  const resultItems = filteredBookmarks.map(({ title, uri, lastModified, iconuri, index }) => ({
    title,
    subtitle: tryDecodeURI(uri),
    value: uri,
    icon: iconuri || 'fa-bookmark',
    id: `${lastModified}-${index}`,
  }));
  return resultItems;
};
