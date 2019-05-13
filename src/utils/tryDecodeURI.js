// @ts-check

module.exports = function tryDecodeURI(uri) {
  try {
    return decodeURI(uri);
  } catch (error) {
    return uri;
  }
};
