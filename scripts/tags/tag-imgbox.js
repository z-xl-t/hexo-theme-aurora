hexo.extend.tag.register('imgBox', args => {
  const url = args[0]
  const title = args[1] ? `<span>◭ ${args[1]}</span>` : '';
  return `
    <div class="img-box">
      <img class="img-zoomable" src=${url}>
      ${title}
    </div>
  `
})
