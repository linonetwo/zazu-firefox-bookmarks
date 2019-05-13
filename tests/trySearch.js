const firefoxAllSearch = require('../src/scripts/searchAll');
const firefoxBookmarkSearch = require('../src/scripts/searchBookmark');
const firefoxHistorySearch = require('../src/scripts/searchHistory');

firefoxAllSearch({ console })('bilibili').then(console.log);
firefoxBookmarkSearch({ console })('bilibili').then(console.log);
firefoxHistorySearch({ console })('bilibili').then(console.log);
