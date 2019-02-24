
;(function() {
  function throttle(fn,wait,time) {
    let previous = null //记录上一次运行的时间
    let timer = null // 定时器
    return () => {
        const now = +new Date()
        if(!previous) { 
          previous = now 
        }
        //当上一次执行的时间与当前的时间差大于设置的执行间隔时长的话，就主动执行一次
        if(now - previous > time){
            clearTimeout(timer)
            fn()
            previous = now
        } else {
            clearTimeout(timer)
            timer = setTimeout(() => fn(),wait)
        }
    }
  }
    /**
   * rem 用于自适应屏幕
   */
  function SetRem() {
    const html = document.documentElement
    const hWidth = html.getBoundingClientRect().width
    const fz = hWidth / 7.5
    html.style.fontSize = fz <= 50 ? '50px' : (fz <= 100 ? fz + 'px' : '100px')
  }
  SetRem()
  window.addEventListener('resize', throttle(SetRem, 500, 1000))
  // 字体加载
  if (typeof FontFaceObserver !== 'undefined') {
    var font = new FontFaceObserver('Noto Serif SC', { weight: '400' })
      font.load().then(() => {
        var body = document.querySelector('body')
        body.setAttribute(
          'class',
          'fonts-loaded'
        )
      }).catch((e) => {
        console.error('尝试在线加载 Noto Serif SC 字体失败 ，使用其他字体')
      })
  }
  // 移动端点击延迟问题
  if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
      if (FastClick) {
        FastClick.attach(document.body);
      }
    }, false);
  }
  // 顶端进度条
  if(typeof ProgressIndicator !== 'undefined') {
    new ProgressIndicator({color: "#986db2"});
  }
  // 图片懒加载
  if (typeof LazyLoad !== 'undefined') {
    new LazyLoad({elements_selector: ".lazy"});
  }
  // 代码高亮
  if (typeof hljs !== 'undefined') {
    hljs.initHighlightingOnLoad();
  }
  // 回到顶端
  var backToTopNode = document.getElementsByClassName('back-to-top')
  if (backToTopNode.length) {
    var data = {
    showBackTop: false,
    topDistance: -950,
    clientHeight: 0,
    lastScroll: new Date(),
    scrollTimer: ''
    }
    var backToTop = document.querySelector('.back-to-top')
    window.addEventListener('scroll',function() {
      handleScroll()
    })
    function handleScroll(forced) {
      var now = new Date()
      if (now - data.lastScroll <= 100 && !forced ) return
      if (!forced) {
        // 尾更新 task
        clearTimeout(data.scrollTimer)
        data.scrollTimer = setTimeout(() => {
          handleScroll(true)
        }, 1000)
      }
      data.lastScroll = now
      var clientHeight = document.documentElement.clientHeight
      var pageYOffset = window.pageYOffset
      // 判断位置，控制滚动到顶部
      var showBackTop = pageYOffset >= 200
      if (showBackTop !== data.showBackTop || data.clientHeight !== clientHeight) {
        data.showBackTop = showBackTop
        data.topDistance = -950 + (showBackTop ? clientHeight : 0)
        data.clientHeight = clientHeight
        // 为true 是 可见 为flase时 收起
        if (showBackTop) {
          backToTop.classList.toggle('visible')
          backToTop.style.top = '-12px'
        } else {
          backToTop.classList.toggle('visible')
          backToTop.style.top = '-1200px' 
        }
      }
    }
  }

})()



