/**************************
 *     一些函数方法        *
 **************************/
let Aurora ={}
Aurora.utils = {
  /**
   * rem 用于自适应屏幕
   */
  setRem: function() {
    var html = document.documentElement
    var hWidth = html.getBoundingClientRect().width
    var fz = hWidth / 7.5
    html.style.fontSize = fz <= 50 ? '50px' : (fz <= 100 ? fz + 'px' : '100px')
  },
  /** 
   * 节流函数 
   */
  throttle: function(fn, wait, time) {
    let previous = null //记录上一次运行的时间
    let timer = null // 定时器
    return () => {
      var now = +new Date()
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
          timer = setTimeout(fn(),wait)
      }
    }
  },
  /**
   *  页面垂直平滑滚动到指定滚动高度
   */
  scrollSmoothTo: function(position, scrollSelecter,  cb) {
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function(callback, element) {
        return setTimeout(callback, 17);
      };
    }
    // 当前滚动高度
    var scrollNode = document.querySelector(scrollSelecter) || window;
    var scrollTop =  document.querySelector(scrollSelecter).scrollTop || document.documentElement.scrollTop || document.body.scrollTop;
    // 滚动step方法
    var step = function () {
      // 距离目标滚动距离
      var distance = position - scrollTop;
      // 目标滚动位置
      scrollTop = scrollTop + distance / 5;
      if (Math.abs(distance) < 1) {
        scrollNode.scrollTo(0, position);
        cb()
      } else {
        scrollNode.scrollTo(0, scrollTop);
        requestAnimationFrame(step);
      }
    }
    step();
  }
};

/**
 * 对于 markdown（也就是文章或者关于友链的）部分的方法
 */
Aurora.markdown = {
  /**  二次处理文章
  *  文章是由hexo的marked渲染
  *  解决 p > img 的图片显示问题
  *  使用一个img-box包装图片
  *  增加fancybox 和 fancybox.image 用以大图
  */
  handleMarkdownImg: function() {
    var imgs = document.querySelectorAll('.markdown img')
    for (var i=0; i<imgs.length; ++i) {
      var text = imgs[i].alt ? imgs[i].alt : ''
      // <span class="img-box"><img src="" alt="">text</span>
      // 只有a节点才行 这样才能形成fancybox 图片组
      var spanNode = document.createElement('span') 
      var spanChNode = document.createElement('span')
      spanChNode.text = text
      spanNode.setAttribute('class', 'img-box')
      spanNode.appendChild(imgs[i].cloneNode(true))
      if (text) {
        spanNode.appendChild(spanChNode)
      }
      imgs[i].parentNode.replaceChild(spanNode, imgs[i])
    }
  },
  /** 二次处理文章
   *  为h2 - h6 标签添加对应的icon
   */
  handleMarkdownIcon: function() {
    var icon = ['icon-fire','icon-gift', 'icon-pagelines', 'icon-pilcrow']
    var h1Node = document.querySelectorAll('.markdown h1')
    var h2Node = document.querySelectorAll('.markdown h2')
    var h3Node = document.querySelectorAll('.markdown h3')
    var h4Node = document.querySelectorAll('.markdown h4')
    var h5Node = document.querySelectorAll('.markdown h5')
    var h6Node = document.querySelectorAll('.markdown h6')
    for (var i=0; i < h1Node.length; ++i) {
      addIcon(h1Node[i], icon[0])
    }
    for (var i=0; i < h2Node.length; ++i) {
      addIcon(h2Node[i], icon[1])
    }
    for (var i=0; i < h3Node.length; ++i) {
      addIcon(h3Node[i], icon[2])
    }
    for (var i=0; i < h4Node.length; ++i) {
      addIcon(h4Node[i], icon[3])
    }
    for (var i=0; i < h5Node.length; ++i) {
      addIcon(h5Node[i], icon[3])
    }
    for (var i=0; i < h6Node.length; ++i) {
      addIcon(h6Node[i], icon[3])
    }
    function addIcon(node, icon) {
      var spanNode = document.createElement('span')
      spanNode.setAttribute(
        'class',
        'icon' + ' ' + icon
      )
      node.insertBefore(spanNode, node.firstChild)
    }
  },
  /**
   *  图片缩放初始化
   */
  zoomLoad: function() {
    if (typeof mediumZoom === 'undefined') return
    mediumZoom(document.querySelectorAll('.img-box img'), {
      background: '#212530',
    })
  },
  /**
   * 代码高亮初始化
   */
  hljsLoad: function(){
    if (typeof hljs === 'undefined') return 
    hljs.initHighlighting()
  },
  /**
   *  代码块高亮，初始化只需要一次就可以了，其他时候用 highlightBlock 渲染
   */
  hljsLoadCode: function(selector){
    if (typeof hljs === 'undefined') return 
     // 重新渲染代码块 
     document.querySelectorAll(selector).forEach((block) => {
      hljs.highlightBlock(block);
    });
  }
}
/**
 *  文章热度 和 访问者来源功能
 */
Aurora.leanCloud = {
  startHot: function() {
    if (typeof AV === 'undefined') return
    if ($('.leancloud-hot').length) {
      var Counter = AV.Object.extend("Counter");
      if ($('.post').length == 1 && $('.post-meta .meta-hot').length == 1) {
        this.addHot(Counter);
      } else if ($('.post-meta .meta-hot').length > 0) {
        this.showHot(Counter);
      }
    }
  },
  showHot: function(Counter) {
    var query = new AV.Query(Counter);
    var entries = [];
    var $visitors = $(".leancloud_visitors");
  
    $visitors.each(function () {
      entries.push($(this).attr("id").trim());
    });
  
    query.containedIn('url', entries);
    query.find()
      .done(function (results) {
        var COUNT_CONTAINER_REF = '.leancloud-visitors-count';
  
        if (results.length === 0) {
          $visitors.find(COUNT_CONTAINER_REF).text(0);
          return;
        }
        for (var i = 0; i < results.length; i++) {
          var item = results[i];
          var url = item.get('url');
          var time = item.get('time');
          var element = document.getElementById(url);
          $(element).find(COUNT_CONTAINER_REF).text(time);
        }
        for (var i = 0; i < entries.length; i++) {
          var url = entries[i];
          var element = document.getElementById(url);
          var countSpan = $(element).find(COUNT_CONTAINER_REF);
          if (countSpan.text() == '') {
            countSpan.text(0);
          }
        }
      })
      .fail(function (object, error) {
        console.log("Error: " + error.code + " " + error.message);
      });
  },
  addHot: function(Counter) {
    var $visitors = $(".leancloud_visitors");
    var url = $visitors.attr('id').trim();
    var title = $visitors.attr('data-flag-title').trim();
    var query = new AV.Query(Counter);
    query.equalTo("url", url);
    query.find({
      success: function (results) {
        if (results.length > 0) {
          var counter = results[0];
          counter.fetchWhenSave(true);
          counter.increment("time");
          counter.save(null, {
            success: function (counter) {
              var $element = $(document.getElementById(url));
              $element.find('.leancloud-visitors-count').text(counter.get('time'));
            },
            error: function (counter, error) {
              console.log('Failed to save Visitor num, with error message: ' + error.message);
            }
          });
        } else {
          var newcounter = new Counter();
          /* Set ACL */
          var acl = new AV.ACL();
          acl.setPublicReadAccess(true);
          acl.setPublicWriteAccess(true);
          newcounter.setACL(acl);
          /* End Set ACL */
          newcounter.set("title", title);
          newcounter.set("url", url);
          newcounter.set("time", 1);
          newcounter.save(null, {
            success: function (newcounter) {
              var $element = $(document.getElementById(url));
              $element.find('.leancloud-visitors-count').text(newcounter.get('time'));
            },
            error: function (newcounter, error) {
              console.log('Failed to create');
            }
          });
        }
      },
      error: function (error) {
        console.log('Error:' + error.code + " " + error.message);
      }
    });
  },
  startVisitor: function() {
    if ($('.leancloud-visitor').length) {
      var Visitor = AV.Object.extend("Visitor");
      this.addVistor(Visitor);
    }
  },
  addVistor: function(Visitor) {
    if (typeof AV === 'undefined') return
    var referrer = getLocation(document.referrer);
    var hostname = referrer.hostname;
    var query = new AV.Query(Visitor);
    query.equalTo('referrer', hostname);
    query.find({
      success: function(results) {
        if (results.length > 0) {
          // 存在则增加访问次数
          var visitors = results[0];
          visitors.fetchWhenSave(true);
          visitors.increment("time");
          visitors.save(null,{
            success: function(){},
            error: function(visitors, error) {
              console.log('Failed to save Visitor num, with error message: ' + error.message);
            }
          });
        } else {
           // 不存在则新增来访者
          var newVisitor = new Visitor()
          /* Set ACL */
          var acl = new AV.ACL();
          acl.setPublicReadAccess(true);
          acl.setPublicWriteAccess(true);
          newVisitor.setACL(acl);
          newVisitor.set('referrer', hostname);
          newVisitor.set('time', 1);
          newVisitor.save(null, {
            success: function(newVisitor) {
              console.log('success')
            },
            error: function(newVisitor, error) {
              console.log('Failed to create');
            }
          })
        }
      },
      error: function (error) {
        console.log('Error:' + error.code + " " + error.message);
      }
    })
    // 转换访问来源地址
    function getLocation(href) {
      var a = document.createElement('a');
      a.href = href;
      return a
    }
  }
}

/**
 *  pjax 功能
 */

Aurora.pjax = {
  pjaxBind: function(selector, containerSelector, options, start, end, cb) {
    $(document).pjax(selector, containerSelector, options)
    this[containerSelector] = {}
    this[containerSelector].start = start || function() {}
    this[containerSelector].end = end || function() {}
    this[containerSelector].cb = cb || function() {}
    var _this = this
    $(containerSelector).on('pjax:start', function(e) {
      _this[containerSelector].start()
      e.stopPropagation()
    })
    $(containerSelector).on('pjax:end', function(e) {
      _this[containerSelector].end()
      _this[containerSelector].cb()
      e.stopPropagation()
    })
  }
}

/**************************
 *     初始化功能        *
 **************************/

 /**
  * rem 布局
  */
window.addEventListener('resize', Aurora.utils.throttle(Aurora.utils.setRem, 500, 1000))

/**
 *  pjax 功能
 */
if ($.support.pjax) {

  function mainPjax(cb) {
    var start = function () {
      var pjaxContainer = $('.pjax-main-page');
      var pjaxLoading = $('.main-loading');
      var pjaxBackToTop = $('.back-to-top');
      pjaxContainer.css('display', 'none');
      pjaxLoading.fadeIn();
      pjaxBackToTop.css({
        'display':'none',
        'top': '-1200px'
      });
    }
    var end = function () {
      var pjaxContainer = $('.pjax-main-page');
      var pjaxLoading = $('.main-loading');
      var pjaxBackToTop = $('.back-to-top');
      pjaxBackToTop.css('display', 'block');
      setTimeout(function(){
        pjaxLoading.fadeOut();
      }, 400)
      setTimeout(function(){
        pjaxContainer.css('display', 'block');
      }, 600)
      Aurora.leanCloud.startHot()
      Aurora.markdown.handleMarkdownImg()
      Aurora.markdown.handleMarkdownIcon()
      Aurora.markdown.zoomLoad()
      Aurora.markdown.hljsLoadCode('pre code')
    }
    Aurora.pjax.pjaxBind('.pjax-a-page', '.pjax-main-page', {container: '.pjax-main-page',fragment: '.pjax-main-page', timeout: 8000}, start, end, cb);
  }
  function contentPjax() {
    var start = function () {
      var pjaxContainer = $('.pjax-content-page');
      var pjaxLoading = $('.content-loading');
      var pjaxBackToTop = $('.back-to-top');
      pjaxContainer.css('display', 'none');
      pjaxLoading.fadeIn();
      pjaxBackToTop.css({
        'display':'none',
        'top': '-1200px'
      });
    }
    var end = function () {
      var pjaxContainer = $('.pjax-content-page');
      var pjaxLoading = $('.content-loading');
      var pjaxBackToTop = $('.back-to-top');
      pjaxBackToTop.css('display', 'block');
      setTimeout(function(){
        pjaxLoading.fadeOut();
      }, 400)
      setTimeout(function(){
        pjaxContainer.css('display', 'block');
      }, 600)
      Aurora.leanCloud.startHot()
      Aurora.markdown.handleMarkdownImg()
      Aurora.markdown.handleMarkdownIcon()
      Aurora.markdown.zoomLoad()
      Aurora.markdown.hljsLoadCode('pre code')
    }
    Aurora.pjax.pjaxBind('.pjax-a-content', '.pjax-content-page',  {container: '.pjax-content-page' ,fragment: '.pjax-content-page', timeout: 8000}, start, end);
  }
  /* 因为 DOM 的结构 是 .pjax-main-page > ... > .pjax-content-page
   * 所以每当是 .pjax-main-page 更换 就需要检查是否存在 .pjax-content-page
   * 当刷新页面时，因为 DOM 会发生变化，因此祖级元素一个需要回调，重新监听子孙级元素事件。
   * 其实最方便的还是 全局只需要 .pjax-main-page 这一个需替换节点，但不好看了。
   */

  // 这是为了第一次访问时，存在 .pjax-main-page 的页面
  mainPjax(contentPjax)
  // 这是为了第一次访问时，存在 .pjax-content-page 的页面
  contentPjax()
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
var blogNode = $('#blog')
var backToTopNode = $('.back-to-top')
if (backToTopNode.length) {
  var data = {
  showBackTop: false,
  topDistance: -950,
  clientHeight: 0,
  lastScroll: new Date(),
  scrollTimer: ''
  }
  // 用于事件的移除和添加
  var listener = function(){ handleScroll(false, backToTopNode) }
  blogNode.on('scroll',listener)
  backToTopNode.on('click', function(){
    if (data.showBackTop) {
      data.showBackTop = false
      // 移除scroll事件
      blogNode.unbind('scroll', listener)
      // 滚回顶部,添加一个回调函数
      Aurora.utils.scrollSmoothTo(0, '#blog', hiddenBcakToTop);
    }
  })
 /**
   * 隐藏挂件，同时添加windows的scroll事件
   */
  function hiddenBcakToTop() {
    var backToTopNode = $('.back-to-top')
    backToTopNode.css('top', '-1200px');
    // 添加滚动事件
    $('#blog').on('scroll', listener)
  }
}

  /** 
   * 处理windows的滚动事件
  */
  function handleScroll(forced, backToTopNode) {
    var now = new Date()
    if (now - data.lastScroll <= 100 && !forced ) return
    if (!forced) {
      // 尾更新 task
      clearTimeout(data.scrollTimer)
      data.scrollTimer = setTimeout(() => {
        handleScroll(true, backToTopNode)
      }, 1000)
    }
    data.lastScroll = now
    var clientHeight = document.documentElement.clientHeight
    var pageYOffset = document.documentElement.scrollTop || document.body.scrollTop || document.getElementById('blog').scrollTop
    // 判断位置，控制滚动到顶部
    var showBackTop = pageYOffset >= 200
    if (showBackTop !== data.showBackTop || data.clientHeight !== clientHeight) {
      data.showBackTop = showBackTop
      data.topDistance = -950 + (showBackTop ? clientHeight : 0)
      data.clientHeight = clientHeight
      // 为true 是 可见 为flase时 收起
      if (data.showBackTop) {
        backToTopNode.css('top', '-40px');
      } else {
        backToTopNode.css('top', '-1200px');
      }
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

/**
 * 存在 markdown 节点才需要进行操作
 */
var markdown = document.getElementsByClassName('markdown');
if (markdown.length) {
  Aurora.markdown.handleMarkdownImg()
  Aurora.markdown.handleMarkdownIcon()
  Aurora.markdown.hljsLoad()
  Aurora.markdown.zoomLoad()
}

/**
 *  热度（浏览次数)，访客来源
 */

Aurora.leanCloud.startHot()
Aurora.leanCloud.startVisitor()

