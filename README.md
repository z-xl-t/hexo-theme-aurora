# hexo-theme-aurora

## 说明

主题来源（vue）

主题：[aurora](https://github.com/chanshiyucx/aurora)

网站：[蝉时雨](https://chanshiyu.com)

主题移植（hexo）

主题: [hexo-theme-aurora](https://github.com/sanshiliuxiao/hexo-theme-aurora)

网站：[椎咲良田](https://sanshiliuxiao.top)

## 时间线

2019-11-23：再次重构主题。

2019-09-05：不断添加主题功能，主题趋于稳定。

2019-04-20：主题重构完成。

2019-03-18：第一次重构主题。

2019-02-17：主题移植。

## 食用指南

### 配置篇

0. 假设你已经在本地使用 `hexo init` 生成了一个博客站点 目录名为 `blog`， 以下操作均在此目录下。

1. 下载 `hexo-theme-aurora` 主题，使用命令行，
    ```bash
      # 当前 为 blog 目录下， 切换至 themes 目录
      cd themes
      # 拉取主题
      git clone https://github.com/sanshiliuxiao/hexo-theme-aurora.git
    ```

    或者点击 github 上的 clone 按钮， 放入 `blog/themes` 目录下

2. 查看 `blog/package.json`，如果里面没有 `hexo-render-pug` 和 `hexo-renderer-stylus` ，运行下面指令

    ```bash
    # 当前路径为 blog
    npm install hexo-render-pug hexo-renderer-stylus
    ```
3.  站点的配置文件修改， 只提供最小化修改，其他配置请参考官方文档：[hexo](https://hexo.io/zh-cn/docs/index.html)

    ```YAML
      # blog/_config.yml

      # 建议开启这个

      post_asset_folder: true

      # 这个是必须要关闭的，
      # 不然就会使用 hexo 默认的代码高亮模式
      height:
        enable: false
      # 主题更改
      themes: hexo-theme-aurora
    ```
4. 修改 `blog/scaffolds/post.md`，修改为如下，Front-matter 字段，具体规则遵循 YAML 语法。
    ```YAML
    title: {{ title }}
    date: {{ date }}
    tags: []
    categories: []
    imageUrl:  ""
    imageSource: ""
    description: ""
    comments: true
    ```
### 页面篇

  将 `hexo-theme-aurora/page` 下的所有文件，复制到 `blog/source` 下，其中 `CNAME`,修改为自己的域名（如果有域名的话）

  其余文件根据各文件里面的内容说明进行修改，修改遵循 YAML 语法。


## 其他

欢迎使用本主题。

欢迎提交 PR 和 Issues。








