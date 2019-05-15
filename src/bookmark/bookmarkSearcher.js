// @ts-check
const { search } = require('fast-fuzzy');
const traverse = require('traverse');
const { getBookmark } = require('firefox-profile-reader')

const tryDecodeURI = require('../utils/tryDecodeURI');

module.exports = async function bookmarkSearcher(query, version = 'default') {
  const bookmarkJSON = await getBookmark(version)
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
