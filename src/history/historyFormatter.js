// @ts-check
const { getHistory } = require('firefox-profile-reader');
const tryDecodeURI = require('../utils/tryDecodeURI');

async function historyFormatter(query, limit, version = 'default') {
  const result = await getHistory(query, limit, version);
  const resultList = result
    .split('\n')
    .filter(line => line)
    .map(line => line.split('|'))
    .map(([url, date, frecency, ...titleParts]) => ({
      url,
      date,
      frecency,
      title: titleParts.join('|'),
    }));
  return resultList.map(({ url, date, frecency, title }) => ({
    title,
    subtitle: tryDecodeURI(url),
    value: url,
    icon: 'fa-history',
    id: `${date}-${frecency}`,
  }));
}

module.exports = historyFormatter;
