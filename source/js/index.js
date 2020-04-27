// 已经提前引入的库
// jquery.js
// timeage.js
// leancloud.js
// backstretch.js
// pjax.js
// zooming.js
// highlight.js 这个不是原生的，而是 在原生上面做了一定的修改（显示代码的行数），从新打包生成的，
// isMobile.js

const ifExistNode = (selector) => $(selector).length !== 0

const ifIsMobile = isMobile && isMobile.phone || false

// 返回顶部功能
const backToTop = {
  init() {
    if (ifExistNode('.back-to-top') && !ifIsMobile) {
      this.$window = $(window)
      this.$backToTop = $('.back-to-top')
      this.data = {
        showBackTop: false,
        topDistance: -950,
        clientHeight: 0,
        lastScroll: new Date(),
        scrollTimer: ''
      }
      this.listener = () => this.handleScroll(false)
      this.$window.scroll(this.listener)
      this.$backToTop.on('click', () => {
        if (this.data.showBackTop) {
          this.data.showBackTop = false
          this.$window.unbind('scroll', this.listener)
          this.scrollSmoothTo(0, this.hiddenBcakToTop.bind(this))
        }
      })
    }
  },

  handleScroll(forced) {
    const now = new Date()
    if (now - this.data.lastScroll <= 100 && !forced) return
    if (!forced) {
      // 尾更新 task
      clearTimeout(this.data.scrollTimer)
      this.data.scrollTimer = setTimeout(() => {
        this.handleScroll(true, this.$backToTop)
      }, 1000)
    }
    this.data.lastScroll = now
    const clientHeight = document.documentElement.clientHeight
    const pageYOffset = document.documentElement.scrollTop || document.body.scrollTop || document.getElementsByClassName('.layout').scrollTop
    // 判断位置，控制滚动到顶部
    const showBackTop = pageYOffset >= 50
    if (showBackTop !== this.data.showBackTop || this.data.clientHeight !== clientHeight) {
      this.data.showBackTop = showBackTop
      this.data.topDistance = -950 + (showBackTop ? clientHeight : 0)
      this.data.clientHeight = clientHeight
      // 为true 是 可见 为flase时 收起
      if (this.data.showBackTop) {
        this.$backToTop.css('top', '-40px');
      } else {
        this.$backToTop.css('top', '-1200px');
      }
    }
  },
  hiddenBcakToTop() {
    this.$backToTop.css('top', '-1200px')
    this.$window.scroll(this.listener)
  },
  scrollSmoothTo(position, cb, scrollSelecter = "body") {
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function (callback, element) {
        return setTimeout(callback, 17);
      };
    }
    // 当前滚动高度
    const scrollNode = window || document.querySelector(scrollSelecter);
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop || document.querySelector(scrollSelecter).scrollTop;
    // 滚动step方法
    const step = () => {
      // 距离目标滚动距离
      const distance = position - scrollTop;
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
}
// 格式化时间功能
const formatTime = {
  render() {
    if (window.timeago && ifExistNode('.timeago')) {
      timeago.render(document.querySelectorAll('.timeago'), 'zh_CN')
      let timeNodes = document.querySelectorAll('.timeago')
      timeNodes.forEach(item => {
        item.textContent = item.textContent.replace(/\s/, '')
      })
    }
  }
}

// 热度和访问者次数功能
const leancloud = {
  init() {
    if (window.AV && ifExistNode('.leancloud')) {
      const appId = $('.leancloud-app-id').attr('leancloud-app-id')
      const appKey = $('.leancloud-app-key').attr('leancloud-app-key')
      AV.init(appId, appKey)
      this.startHot()
      this.startVisitor()
    }
  },
  startHot() {
    if (typeof AV === 'undefined') return
    if (ifExistNode('.leancloud-app-hot')) {
      const Counter = AV.Object.extend("Counter");
      if ($('.post').length == 1 && $('.post-meta .post-hot').length == 1) {
        this.addHot(Counter);
      } else if ($('.post-meta .post-hot').length > 0) {
        this.showHot(Counter);
      }
    }
  },
  addHot(Counter) {
    const $visitors = $(".leancloud_visitors");
    const url = $visitors.attr('id').trim();
    const title = $visitors.attr('data-flag-title').trim();
    const query = new AV.Query(Counter);
    query.equalTo("url", url);
    query.find().then(results => {
      if (results.length > 0) {
        const counter = results[0];
        counter.fetchWhenSave(true);
        counter.increment("time");
        counter.save().then((results) => {
          const $element = $(document.getElementById(url));
          $element.find('.leancloud-visitors-count').text(results.get('time'));
        })
      } else {
        const newcounter = new Counter();
        /* Set ACL */
        const acl = new AV.ACL();
        acl.setPublicReadAccess(true);
        acl.setPublicWriteAccess(true);
        newcounter.setACL(acl);
        /* End Set ACL */
        newcounter.set("title", title);
        newcounter.set("url", url);
        newcounter.set("time", 1);
        newcounter.save().then(() => {
          const $element = $(document.getElementById(url));
          $element.find('.leancloud-visitors-count').text(newcounter.get('time'));
        })
      }
    })
  },
  showHot(Counter) {
    const query = new AV.Query(Counter);
    const entries = [];
    const $visitors = $(".leancloud_visitors");
    $visitors.each(function () {
      entries.push($(this).attr("id").trim());
    });
    query.containedIn('url', entries);
    query.find().then(results => {
      const COUNT_CONTAINER_REF = '.leancloud-visitors-count';
      if (results.length === 0) {
        $visitors.find(COUNT_CONTAINER_REF).text(0);
        return;
      }
      for(let i=0; i < results.length; ++i) {
        const item = results[i];
        const url = item.get('url');
        const time = item.get('time');
        const element = document.getElementById(url);
        $(element).find(COUNT_CONTAINER_REF).text(time);
        for (let i = 0; i < entries.length; i++) {
          const url = entries[i];
          const element = document.getElementById(url);
          const countSpan = $(element).find(COUNT_CONTAINER_REF);
          if (countSpan.text() == '') {
            countSpan.text(0);
          }
        }
      }
    })
  },
  startVisitor() {
    if (typeof AV === 'undefined') return
    if (ifExistNode('.leancloud-app-visitor')) {
      const Visitor = AV.Object.extend("Visitor")
      this.addVistor(Visitor)
      this.showVistor(Visitor)
    }

  },
  addVistor(Visitor) {
    const referrer = this.getLocation(document.referrer);
    const hostname = referrer.hostname;
    const query = new AV.Query(Visitor);
    query.equalTo('referrer', hostname);
    query.find().then(results => {
      if (results.length > 0) {
        // 存在则增加访问次数
        const visitors = results[0];
        console.log(results)
        visitors.fetchWhenSave(true);
        visitors.increment("time");
        visitors.save()
      } else {
        // 不存在则新增来访者
        const newVisitor = new Visitor()
        /* Set ACL */
        const acl = new AV.ACL();
        acl.setPublicReadAccess(true);
        acl.setPublicWriteAccess(true);
        newVisitor.setACL(acl);
        newVisitor.set('referrer', hostname);
        newVisitor.set('time', 1);
        newVisitor.save().then(results => {
        })
      }
      query.equalTo('referrer', 'AllCount')
      query.find().then(results => {
        if (results.length === 1) {
          // 存在则增加访问次数
          const visitors = results[0];
          visitors.fetchWhenSave(true);
          visitors.increment("time");
          visitors.save()
  
        } else {
          // 不存在则新增来访者
          const newVisitor = new Visitor()
          const acl = new AV.ACL();
          acl.setPublicReadAccess(true);
          acl.setPublicWriteAccess(true);
          newVisitor.setACL(acl);
          newVisitor.set('referrer', 'AllCount');
          newVisitor.set('time', 1);
          newVisitor.save()
        }
      })
    })


  },
  showVistor(Visitor) {
    const query = new AV.Query(Visitor);
    query.equalTo('referrer', 'AllCount')
    query.find().then(results => {
      if (results.length === 1) {
        const time = results.get('time');
        $('.visitor').text(time)
      } else {
        $('.visitor').text(1)
      }
    })
  },
  getLocation(href) {
    // 转换访问来源地址
    const a = document.createElement('a');
    a.href = href;
    return a
  }
}

// 动态主题
const dynamicBackground = {
  init() {
    if (ifExistNode('.pc-dynamic-bg') && !ifIsMobile) {
      const images = Array.from($('.pc-dynamic-bg .image')).map(item => {
        return $(item).attr('data-image')
      })
      $('.pc-dynamic-bg').backstretch(images, {
        duration: 10000,
        alignY: 0,
        transition: 'fade',
        transitionDuration: 1000
      })
    }
  }
}

// 文章页面的处理

// 文章图片 image zooming
const imageZooming = {
  init() {
    this.listen()
  },
  listen() {
    if (Zooming && ifExistNode('.markdown .img-box')) {
      const zooming = new Zooming({
        bgOpacity: 0.6,
        zIndex: 100
      })
      if (ifExistNode('.markdown .img-box')) {
        zooming.listen('.img-zoomable')
      }
    }

  }
}

const codeHighlight = {
  init() {
    if (window.hljs && ifExistNode('.markdown')) {
      this.renderCode()
    }

  },
  renderCode() {
    if (ifExistNode('.markdown')) {
      hljs.initLineNumbersOnLoad({ target: '.markdown' })
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block)
      })
    }
  }
}

const headerIcon = {
  init() {
    this.icon = ['icon-fire', 'icon-gift', 'icon-pagelines', 'icon-pilcrow', 'icon-pilcrow', 'icon-pilcrow']
    this.render()
  },
  render() {
    if (ifExistNode('.markdown')) {
      for (let i = 0; i < 6; ++i) {
        $(`.markdown h${i + 1}`).each((idx, ele) => {
          $(ele).prepend($(`<i class=${this.icon[i]}></i>`))
        })
      }

    }
  },
}

// 运行
$(function () {
  backToTop.init()
  formatTime.render()
  leancloud.init()
  dynamicBackground.init()
  pjax.init()
  imageZooming.init()
  codeHighlight.init()
  headerIcon.init()
})

// pjax 功能
const pjax = {
  init() {
    if ($.support.pjax) {
      this.pjaxMain()
      this.pjaxSubsidiary()
    }
  },
  pjaxMain() {
    // 主页面的切换，如首页切换到归档页，首页到文章详情页
    this.$pjaxMainPage = $('.pjax-main-page')
    this.$pjaxMainLoading = $('.pjax-main-loading')
    this.$pjaxMainLink = $('.pjax-main-link')
    if (ifExistNode('.pjax-main-link') && ifExistNode('.pjax-main-page')) {
      $(document).pjax('.pjax-main-link', '.pjax-main-page', {
        container: '.pjax-main-page',
        fragment: '.pjax-main-page',
        timeout: 8000
      })
      this.$pjaxMainPage.on('pjax:send', (e) => {
        e.stopPropagation()
        this.$pjaxMainPage.hide()
        this.$pjaxMainLoading.fadeIn()
      })
      this.$pjaxMainPage.on('pjax:complete', (e) => {
        e.stopPropagation()

        // 获取到的 pjax 的内容可能需要重新操作
        formatTime.render()
        leancloud.startHot()
        imageZooming.listen()
        codeHighlight.renderCode()
        headerIcon.render()

        setTimeout(() => {
          this.$pjaxMainPage.fadeIn()
          this.$pjaxMainLoading.hide()
        }, 500);

        // 额外重新绑定 pjaxSubsidiary
        this.pjaxSubsidiary()
      })
    }

  },
  pjaxSubsidiary() {
    // 在 归档 / 标签 / 分类 / 页面内部切换页面
    this.$pjaxSubsidiaryPage = $('.pjax-subsidiary-page')
    this.$pjaxSubsidiaryLoading = $('.pjax-subsidiary-loading')
    this.$pjaxSubsidiaryLink = $('.pjax-subsidiary-link')
    if (ifExistNode('.pjax-subsidiary-link') && ifExistNode('.pjax-subsidiary-page')) {
      $(document).pjax('.pjax-subsidiary-link', '.pjax-subsidiary-page', {
        container: '.pjax-subsidiary-page',
        fragment: '.pjax-subsidiary-page',
        timeout: 8000
      })
      this.$pjaxSubsidiaryPage.on('pjax:send', (e) => {
        e.stopPropagation()
        this.$pjaxSubsidiaryPage.hide()
        this.$pjaxSubsidiaryLoading.fadeIn()
      })
      this.$pjaxSubsidiaryPage.on('pjax:complete', (e) => {
        e.stopPropagation()
        // 获取到的 pjax 的内容可能需要重新操作
        formatTime.render()
        leancloud.startHot()
        codeHighlight.renderCode()
        imageZooming.listen()
        headerIcon.render()
        setTimeout(() => {
          this.$pjaxSubsidiaryPage.fadeIn()
          this.$pjaxSubsidiaryLoading.hide()
        }, 500);
      })


    }
  }
}

/**
 * 
 */
