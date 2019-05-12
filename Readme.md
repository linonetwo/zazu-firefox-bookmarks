# Zazu Firefox Bookmarks

Firefox bookmark searcher for Zazu.

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
    "profilePath": "/Users/xxx/Library/Application Support/Firefox/Profiles/gfedcba.123",
    "limit": 5
  }
}
```

### `limit`

Maximum number of returned items, by default is 15.

### `profilePath`

By default we look for your default profile located at:

```js
`${os.homedir()}/Library/Application Support/Firefox/Profiles/abcdefg.default`
```

To overwrite it, set the `profilePath` variable. You will probably never use it.

## Disclaimer

Boilerplate is from [tinytacoteam/zazu-chrome-bookmarks](https://github.com/tinytacoteam/zazu-chrome-bookmarks).

I've use the source code from [CCharlieLi/bookmark-parser](https://github.com/CCharlieLi/bookmark-parser) which is not actively maintained, but instead use unstable C++ code (node-gyp sometimes failed), I use [jusw85/mozlz4 writen in rust](https://github.com/jusw85/mozlz4) binary to handle the dirty job.
