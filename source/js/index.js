
// 已经引入 jquery.js
// 已经引入 timeage.js


const AuroraUtil = {

  throttle(fn, wait, time) {
    let previous = null //记录上一次运行的时间
    let timer = null // 定时器
    return () => {
      const now = +new Date()
      if (!previous) {
        previous = now
      }
      //当上一次执行的时间与当前的时间差大于设置的执行间隔时长的话，就主动执行一次
      if (now - previous > time) {
        clearTimeout(timer)
        fn()
        previous = now
      } else {
        clearTimeout(timer)
        timer = setTimeout(fn(), wait)
      }
    }
  },
  scrollSmoothTo(position, cb, scrollSelecter ="body") {
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function (callback, element) {
        return setTimeout(callback, 17);
      };
    }
    // 当前滚动高度
    var scrollNode = window || document.querySelector(scrollSelecter);
    var scrollTop =  document.documentElement.scrollTop || document.body.scrollTop || document.querySelector(scrollSelecter).scrollTop ;
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
  },
}

const backToTop = {
  init() {
    console.log('back to top init')
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
    console.log($('.layout'), this.$window, this.$backToTop)
    this.$window.scroll(this.listener)
    this.$backToTop.on('click', () => {
      if (this.data.showBackTop) {
        this.data.showBackTop = false
        this.$window.unbind('scroll', this.listener)
        AuroraUtil.scrollSmoothTo(0, this.hiddenBcakToTop.bind(this))
      }
    })
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
    const showBackTop = pageYOffset >= 200
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
  }

}
const formatTime = {
  init() {
    timeago && timeago.render(document.querySelectorAll('.timeago'), 'zh_CN')
  }
}

$(function() {
  backToTop.init()
  formatTime.init()
})
