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
  function SetRem() {
    const html = document.documentElement
    const hWidth = html.getBoundingClientRect().width
    const fz = hWidth / 7.5
    html.style.fontSize = fz <= 100 ? fz + 'px' : '100px'
  }
  SetRem()
  window.addEventListener('resize', throttle(SetRem, 500, 1000))
})()
