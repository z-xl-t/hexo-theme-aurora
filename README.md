# hexo-theme-aurora

## 说明

主题来源（vue）

主题：[蝉时雨](https://github.com/chanshiyucx/aurora)

网站：[蝉时雨](https://chanshiyu.com/#/)

主题移植（hexo）

v0.0.1 施工完成。

## FLAG

重新对这个主题进行优化，先提前插一下旗子。

打算使用 pjax 来让这个主题与原主题更加贴近，对于 CSS 方面也打算进行代码优化。

总之先提前写在 README 中， 免的自己忘记了。

## 食用指南

### 配置篇

0. 假设已经在本地生成了一个hexo博客站点，目录名为`blog`。

1. 下载好`hexo-theme-aurora`主题，解压、改名为`aurora`放入`blog/themes`目录。

2. 站点配置文件修改，只提供最小化修改，其他配置请参考官方文档[hexo](https://hexo.io/zh-cn/docs/index.html)

   ```
   # blog/_config.yml
   height:
   	enable: false
   
   themes: aurora
   ```

3. 主题配置文件修改，参考`/aurora/_config.yml`的各项说明。

4. 修改`blog/scaffolds/post.md`，这样不必每次手动在文章顶部添加[`Front-matter`](https://hexo.io/zh-cn/docs/front-matter)字段

   ```
   title: {{ title }}
   date: {{ date }}
   tags:
   categories:
   imageUrl: 
   ```

### 页面篇

将`/aurora/page/`下的所有文件，复制到`blog/source/`中。具体字段请看各文件的说明，其中`categories`和`tags`内的文件可以不做更改。

## 预览篇

点击下面链接，前往预览。

[aurora_site_live](https://sanshiliuxiao.github.io/aurora_site_live/)












