const version = require('../package.json').version

hexo.extend.helper.register('version', function () {
  return version
})