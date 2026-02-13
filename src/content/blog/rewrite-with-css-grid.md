---
title: 使用 CSS Grid 重写个人页
pubDate: 2023-08-01 11:00
description: 从古代迈入现代，终于摆脱上古 Float 浮动排版了
category: 技术
slug: rewrite-with-css-grid
---

最近趁着自己还有时间精力，把个人页（包括使用 Pelican 生成的文章部分）由 Float 换成 Grid 排版。其中一大原因是学前端比较早，即使当前的个人页是 2022 年编写的，仍保留了相当一部分早前的排版习惯。随着个人页功能模块的增多，愈加发现 Float 排版的局限性。例如必须时刻记得添加 `clear: both` 标签，浮动位置调整不灵活等等。

于是决定保留设计风格，将网页包括 CSS 部分整体翻新，显著增加了个人页的可维护性。

## 直观的网格排版

不同于 Float 的浮动概念，Grid 是通过一个个网格来划分内容区块。最初在重写 [友链列表](https://cynosura.one/friends) 时，便在右侧列表部分运用了 Grid 排版。在实际运用过程中发现这种排版方式相当简单直觉，像常见的两栏、三栏等比例划分，都只需要一行指定行列个数即可搞定，还也可自由指定每一行的宽度占比。

例如需要实现友链列表的两栏均分效果，只需要一个大 div 将列表包裹起来，加上简单的样式设定，只要规划好网格排版即可，以下是我实际划分友链列表的 CSS 代码，非常简单。

```css
.friends-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 0.8rem;
}
```

同时在一个大网格里还可以嵌套数个 Grid，在实际运用过程中十分灵活。 

## 兼容性

Grid 的最大问题其实是兼容性。现代浏览器都需要迟至 2017 年才开始逐渐支持显示 Grid 样式，IE11 就更不可能支持了。在一些需要考虑兼容性的场合，可能还需要依赖 Flex 或是更老的 Float 进行网页排版。

![can-i-use-css-grid](/img/posts/rewrite-with-css-grid/can-i-use-css-grid.png)

像我这种没人看的个人页用用还好，毕竟原先图方便就有用各种 CSS3 的简化标签，已经无所谓再多个 Grid 排版了。实际运用还可参考 [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout) 的相关文档，个人也是参考了 MDN 文档和 ChatGPT 的问答，才逐渐将个人页改写完毕的。

## 参考
1. [grid - CSS: Cascading Style Sheets | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/grid)
2. [CSS Grid Layout (level 1) | Can I use...](https://caniuse.com/css-grid)