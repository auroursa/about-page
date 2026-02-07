---
title: Hello Pelican
pubDate: 2023-07-27 21:07
description: 尝试利用 Pelican 替代原本使用的 Hexo
category: 技术
slug: hello-pelican
---

尝试利用 [Pelican](https://getpelican.com) 替代原本使用的 Hexo，并废除了独立 Blog 入口。

Pelican 上手还是挺简单的，基本上参照 [官方文档](https://docs.getpelican.com/en/latest/quickstart.html) 即可快速生成可用的文章页。

相较于 Hexo，Pelican 基于 Python，终于不用被 Node.js 那堆依赖折腾得死去活来了，整体操作逻辑也更加清晰。但由于 Pelican 的用户较少，网络上可用的主题屈指可数，无意中拉高了使用门槛。建议对 Pelican 有兴趣的可以像我一样动手折腾自定义主题；基于官方的 simple 主题修改不难，只要对着文档修改，加上自己的一点样式即可。

用半天时间移植了原本用于 Hexo 的自定义主题，目前只修改好了 base、article 和 index 页就仓促上线了，难免存在疏漏。如果遇到样式问题请在下面留言告诉我，非常感谢~

## 增加 RSS 支持
斟酌再三，还是决定为文章页增加 RSS (实际是 Atom) 支持，仅需在配置文件里指定生成路径即可。

```conf
FEED_ALL_ATOM = 'feeds/all.atom.xml'
FEED_DOMAIN = SITEURL
FEED_MAX_ITEMS  =  15
RSS_FEED_SUMMARY_ONLY = False
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None
```

`FEED_ALL_ATOM` 指定 RSS 的生成位置。Pelican 提倡尽量使用绝对地址，这种理念在 [官方文档](https://docs.getpelican.com/en/stable/settings.html#feed-settings) 的相关设置中就有所体现。

若该值未设置成绝对地址，则在每次生成中会跳出警告：Feeds generated without SITEURL set properly may not be valid。要使用相对地址并去除警告，则必须设置 FEED_DOMAIN。

`FEED_DOMAIN` 指定 RSS 生成域名，可直接使用 SITEURL 变量，更加灵活。

`FEED_MAX_ITEMS` 设置 RSS 生成的最大文章量。这里推荐设置一个合适的限制值，以防文章较多时，RSS 为读者推送动辄上百篇的文章，影响阅读体验。我认为设置在 10~20 篇左右为宜。

`RSS_FEED_SUMMARY_ONLY` 指定 RSS 包括全文，还是仅生成摘要信息。个人建议 RSS 包含全文而非摘要，仅生成摘要虽然能引导读者跳转到网站阅读，但这种操作十分影响阅读体验。试想当你在阅读器看到感兴趣的文章，却要跳转到网页才能继续观看，你会选择跳转还是直接关闭呢，相信你心里自有答案。

设置并重新执行文章生成后，RSS 就会在指定位置生成好了，添加到网页任意位置即可。

## 生成站点地图 (Sitemap)

生成站点地图 (Sitemap) 可以告诉搜索引擎应该抓取哪些页面，及文章优先级排序，从而帮助搜索引擎准确收录文章。Pelican 支持通过 pip 来安装及管理插件，安装 [Sitemap 插件](https://github.com/pelican-plugins/sitemap) 并写入配置文件，即可一键生成站点地图。

首先通过 pip 来安装插件: `python -m pip install pelican-sitemap`

安装完成后，将如下信息放入配置文件，并重新生成站点。

```conf
SITEMAP = {
    "format": "xml",
    "priorities": {
        "articles": 0.8,
        "indexes": 1.0,
        "pages": 0.8
    },
    "changefreqs": {
        "articles": "monthly",
        "indexes": "daily",
        "pages": "monthly"
    }
}
```

其中 `priorities` 指定了页面的优先级，`changefreqs` 则告知搜索引擎页面的更新频率。一般首页拉取频率设置高一点，文章不是周更的就保持默认月更选项，无需变动。

生成站点地图并部署在服务器以后，在 [Google Search Console](https://search.google.com/search-console) 填入站点地图的 URL 地址并上传，之后 Google 将会定期抓取站点地图并生成索引收录。