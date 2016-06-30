/**
 * 参考https://github.com/webpack/react-starter/blob/master/config/loadersByExtension.js
 */

function extsToRegExp(exts) {
  return new RegExp('\\.(' + exts.map(function(ext) {
    return ext.replace(/\./g, '\\.');
  }).join('|') + ')(\\?.*)?$');
}


/**
 * loadersByExtension - description
 *
 * @param  {Object} obj object of key-value pair. key: file extension, value: loader string
 * @return {type}     loader array could be used by webpack
 */
module.exports = function loadersByExtension(obj) {
  var loaders = [];
  Object.keys(obj).forEach(function(key) {
    var exts = key.split('|');
    var value = obj[key];
    var entry = {
      extensions: exts,
      test: extsToRegExp(exts)
    };
    if (Array.isArray(value)) {
      entry.loaders = value;
    } else if (typeof value === 'string') {
      entry.loader = value;
    } else {
      Object.keys(value).forEach(function(valueKey) {
        entry[valueKey] = value[valueKey];
      });
    }
    loaders.push(entry);
  });
  return loaders;
};
