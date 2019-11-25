/**
 * Note: configs in _data/melody.yml will replace configs in hexo.theme.config.
 */

const version = require('../package.json').version

hexo.extend.helper.register('version', function () {
  return version
})