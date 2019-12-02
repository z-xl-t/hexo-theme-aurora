hexo.extend.helper.register('categoriesFilter', function (categories, orderby, order) {
  // 总分类数 如何排序 深度如何
  var categories = categories || this.site.categories
  var orderby = orderby || 'name'
  var order = order || 1
  return prepareQuery(categories)

  function prepareQuery(categories, parent) {
    var query = {};
    if (parent) {
      query.parent = parent
    } else {
      query.parent = {$exists: false};
    }
    return categories.find(query).sort(orderby, order).filter(cat => cat.length);
  }
})