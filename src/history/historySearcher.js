// @ts-check
const { search } = require('fast-fuzzy');

const historyFormatter = require('./historyFormatter');

module.exports = async function historySearcher(query, limit, version = 'default') {
  const [mainKeyword, ...rest] = query.split(' ');
  const historyItems = await historyFormatter(mainKeyword, rest ? 1000 : limit, version);
  const filteredBookmarks = search(rest.join(' '), historyItems, { keySelector: item => item.title + item.uri });
  return filteredBookmarks;
};
