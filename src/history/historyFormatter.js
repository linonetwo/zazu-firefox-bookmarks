// @ts-check
const historyParser = require('./historyParser');
const tryDecodeURI = require('../utils/tryDecodeURI');

async function historyFormatter(query, profileFolderPath, limit, pluginContext) {
  const result = await historyParser(profileFolderPath, query, limit, pluginContext);
  const resultList = result
    .split('\n')
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
