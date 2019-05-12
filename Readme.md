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

By default we look for your default profile located at:

```js
`${os.homedir()}/Library/Application Support/Firefox/Profiles/abcdefg.default`
```

To overwrite it, set the `profilePath` variable:

```javascript
{
  "name": "linonetwo/zazu-firefox-bookmarks",
  "variables": {
    "profilePath": "/Users/xxx/Library/Application Support/Firefox/Profiles/gfedcba.123"
  }
}
```

## Disclaimer

Boilerplate is from [tinytacoteam/zazu-chrome-bookmarks](https://github.com/tinytacoteam/zazu-chrome-bookmarks).

I've use the source code from [CCharlieLi/bookmark-parser](https://github.com/CCharlieLi/bookmark-parser) which is not actively maintained.
