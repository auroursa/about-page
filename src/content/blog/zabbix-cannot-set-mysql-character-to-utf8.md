---
title: 记一次 zabbix 数据库编码排错
pubDate: 2022-07-22 14:36:10
description: 简单记录在 zabbix 5.0 上遇到数据库乱码的解决过程
category: 技术
slug: zabbix-cannot-set-mysql-character-to-utf8
---

这几天在折腾 zabbix 5.x 上奇怪的编码问题，原型规则写的是中文，页面上也正常显示了中文，但 Discover 到具体监控项，以及告警推送就全部变 "???" 了。

查日志报错 cannot set MySQL character set to "utf8"，如图：

![issue-1](/img/posts/zabbix-cannot-set-mysql-character-to-utf8/issue-1.png)

搜了一圈推测是 zabbix 和 MariaDB 的兼容问题，MariaDB 10.6 不支持直接 'utf8'，只支持具体到 'utf8mb3' 或 'utf8mb4'，而 zabbix 的检测逻辑没考虑到数据库不支持 'utf8' 的情况，而官方问题追踪里说已经在 zabbix 5.0.26 里 [修了](https://support.zabbix.com/browse/ZBX-21301)。

![issue-2](/img/posts/zabbix-cannot-set-mysql-character-to-utf8/issue-2.jpg)

在 zabbix 推出 5.0.26 正式版本之前，建议改用其他数据库，或使用 zabbix 6.x 版本并改用 'utf8mb4' 编码。