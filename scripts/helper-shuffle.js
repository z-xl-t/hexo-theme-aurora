hexo.extend.helper.register('shuffle', function (array) {
  let m = array.length
  let i
  while (m) {
    i = Math.floor(Math.random() * m--)
    ;[array[m], array[i]] = [array[i], array[m]]
  }
  return array
})