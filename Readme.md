# Zazu Firefox Bookmarks

Firefox bookmark and history searcher for [Zazu](https://github.com/tinytacoteam/zazu).

## Usage

## Installing

Add the package to your plugins array in `./zazurc.js`.

```javascript
{
  "plugins": [
    "linonetwo/zazu-firefox-bookmarks"
  ]
}
```

## Variables

```javascript
{
  "name": "linonetwo/zazu-firefox-bookmarks",
  "variables": {
    "profileVersion": "123",
    "limit": 5
  }
}
```

### `limit`

Maximum number of returned items, by default is 15.

### `profileVersion`

Fill in `profileVersion` if your profile version is not `default`.

## Disclaimer

Boilerplate is from [tinytacoteam/zazu-chrome-bookmarks](https://github.com/tinytacoteam/zazu-chrome-bookmarks).

I've use the source code from [CCharlieLi/bookmark-parser](https://github.com/CCharlieLi/bookmark-parser) which is not actively maintained, but instead use unstable C++ code (node-gyp sometimes failed), I use [jusw85/mozlz4 writen in rust](https://github.com/jusw85/mozlz4) binary to handle the dirty job.
