

/**************************
 *     初始化功能        *
 **************************/

 /**
  * rem 布局
  */
window.addEventListener('resize', throttle(SetRem, 500, 1000))

/**
 *  pjax 功能
 */
if ($.support.pjax) {
  $(document).pjax('.pjax-a-page', '.pjax-main-page', {fragment: '.container', timeout: 8000});
  var pjaxContainer = $('.pjax-main-page');
  var pjaxLoading = $('.loading');
  var pjaxBackToTop = $('.back-to-top');

  $(document).on({
    /*点击链接后触发的事件*/
    'pjax:click': function () {
      pjaxContainer.css('display', 'none');
      pjaxLoading.fadeIn();
      pjaxBackToTop.css({
        'display':'none',
        'top': '-1200px'
      });
    },

    /*pjax开始请求页面时触发的事件*/
    'pjax:start': function () {
    },

    /*pjax请求回来页面后触发的事件*/
    'pjax:end': function () {
      pjaxBackToTop.css('display', 'block');
      setTimeout(function(){
        pjaxLoading.fadeOut();
      }, 500)
      setTimeout(function(){
        pjaxContainer.css('display', 'block');
      }, 700)
      
    }
});
}

/**
 * 加载在线字体
 */
var font = new FontFaceObserver('Noto Serif SC', { weight: '400' })
font.load().then(() => {
  var body = document.querySelector('body')
  body.setAttribute(
    'class',
    'fonts-loaded'
  )
}).catch((e) => {
  console.error('尝试在线加载字体失败 ，使用其他字体')
})

/**
 * 回到顶端
 */
var backToTopNode = document.getElementsByClassName('back-to-top')
if (backToTopNode.length) {
  var data = {
  showBackTop: false,
  topDistance: -950,
  clientHeight: 0,
  lastScroll: new Date(),
  scrollTimer: ''
  }
  // 用于事件的移除和添加
  var listener = function(){handleScroll()}
  window.addEventListener('scroll',listener)
  var backToTop = backToTopNode[0]
  backToTop.addEventListener('click', function(){
    if (data.showBackTop) {
      data.showBackTop = false
      // 移除scroll事件
      window.removeEventListener('scroll', listener)
      // 滚回顶部,添加一个回调函数
      scrollSmoothTo(0, hiddenBcakToTop);
    }
  })
  /** 
   * 处理windows的滚动事件
  */
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
      if (data.showBackTop) {
        backToTop.style.top = '-40px'
      } else {
        backToTop.style.top = '-1200px' 
      }
    }
  }
  /**
   * 隐藏挂件，同时添加windows的scroll事件
   */
  function hiddenBcakToTop() {
    var backToTop = document.getElementsByClassName('back-to-top')[0]
    backToTop.style.top = '-1200px'
    // 添加滚动事件
    window.addEventListener('scroll', listener)
  }
}

/** 
 * 顶端进度条
*/
if(typeof ProgressIndicator !== 'undefined') {
  new ProgressIndicator({color: "#986db2"});
}
/**
 * 移动端点击延迟问题
 */
if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function() {
    if (FastClick) {
      FastClick.attach(document.body);
    }
  }, false);
}

/**************************
 *     一些函数方法        *
 **************************/

/**
 * rem 用于自适应屏幕
 */
function SetRem() {
  const html = document.documentElement
  const hWidth = html.getBoundingClientRect().width
  const fz = hWidth / 7.5
  html.style.fontSize = fz <= 50 ? '50px' : (fz <= 100 ? fz + 'px' : '100px')
}

/** 节流函数 */
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
*  页面垂直平滑滚动到指定滚动高度
*/
 function scrollSmoothTo (position, cb) {
  if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function(callback, element) {
          return setTimeout(callback, 17);
      };
  }
  // 当前滚动高度
  var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  // 滚动step方法
  var step = function () {
      // 距离目标滚动距离
      var distance = position - scrollTop;
      // 目标滚动位置
      scrollTop = scrollTop + distance / 5;
      if (Math.abs(distance) < 1) {
          window.scrollTo(0, position);
          cb()
      } else {
          window.scrollTo(0, scrollTop);
          requestAnimationFrame(step);
      }
  };
  step();
};