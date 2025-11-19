---
title: 基于 Firefly 主题的 Astro 博客部署（三）：站点配置修改
published: 2025-11-06
description: "记录了自己在基于 Firefly 主题的 Astro 博客上修改个人名称、头像、介绍、公告、背景壁纸等配置的操作。"
tags: ["博客部署", "Astro", "Firefly", "开源主题", "站点配置"]
category: 实操记录
slug: astro-firefly-blog-deploy-part3
---

在成功地在 **GitHub Pages** 上部署了博客，并紧接着在博客上发布文章后，看着自己撰写的文章被编排、美化成好看的页面显示在博客网站上，我的内心里瞬间有了以后在博客上撰写文章的动力。

目前，我的博客网站上包括个人名称、头像、介绍、公告、背景壁纸等在内的各种信息，仍是原 [**Firefly**](https://github.com/CuteLeaf/Firefly) 主题作者预设的默认内容。我计划接下来逐步替换这些信息。毕竟，GitHub Pages 上的内容能够被搜索引擎收录的，作为博主，我当然不希望自己写的文章被他人阅读时，被误认为是他人所写；同时，也不希望博客中的其他信息与其他人雷同。

`src/config` 目录下存放着博客的相关配置文件：

```text showLineNumbers=false
src/
├── config/
│   ├── index.ts              # 配置索引文件
│   ├── siteConfig.ts         # 站点基础配置
│   ├── profileConfig.ts      # 用户资料配置
│   ├── commentConfig.ts      # 评论系统配置
│   ├── announcementConfig.ts # 公告配置
│   ├── licenseConfig.ts      # 许可证配置
│   ├── footerConfig.ts       # 页脚配置
│   ├── FooterConfig.html     # 页脚HTML内容
│   ├── expressiveCodeConfig.ts # 代码高亮配置
│   ├── sakuraConfig.ts       # 樱花特效配置
│   ├── fontConfig.ts         # 字体配置
│   ├── sidebarConfig.ts      # 侧边栏布局配置
│   ├── navBarConfig.ts       # 导航栏配置
│   ├── musicConfig.ts        # 音乐播放器配置
│   ├── pioConfig.ts          # 看板娘配置
│   ├── adConfig.ts           # 广告配置
│   ├── friendsConfig.ts      # 友链配置
│   └── sponsorConfig.ts      # 赞助配置
```

## 元数据配置

站点元数据配置，主要包括标题、描述、关键词和 **Favicon**。这些配置信息对于 **SEO** 至关重要，通常会被注入到网站的 HTML 头部（`<head>` 区域），供浏览器和搜索引擎读取。

`siteConfig.ts` 文件里存放着这些配置信息。

关于 `title` 和 `subtitle` 字段，最终会被如何使用，`src/layouts/Layout.astro` 文件里有相关代码段：

```typescript title="src/layouts/Layout.astro"
let pageTitle: string;
if (title) {
	pageTitle = `${title} - ${siteConfig.title}`;
} else {
	pageTitle = siteConfig.subtitle
		? `${siteConfig.title} - ${siteConfig.subtitle}`
		: siteConfig.title;
}
```

这段代码根据是否传入 `title` 参数来决定页面标题的格式，这样可以确保：

- 文章页面显示：`文章标题 - <title>`
- 首页显示：`<title> - <subtitle>`
- 其他页面根据传入的 `title` prop 显示对应标题

为了有利于 SEO，对于标题、描述和关键词，我将 `siteConfig.ts` 文件内容修改为：

```diff lang="typescript" title="src/config/siteConfig.ts"
export const siteConfig: SiteConfig = {
-  title: "Firefly",
-  subtitle: "Demo site",
-  description:
-    "Firefly 是一款基于 Astro 框架开发的清新美观且现代化个人博客主题，专为技术爱好者和内容创作者设计。该主题融合了现代 Web 技术栈，提供了丰富的功能模块和高度可定制的界面，让您能够轻松打造出专业且美观的个人博客网站。",
+  title: "未来之蓝 | xpfxzxc 的个人博客",
+  subtitle: "个人学习和日常零散想法的记录空间，内容随性且不定期更新",
+  description: "未来之蓝是 xpfxzxc 的个人博客，记录个人学习和日常零散想法。心怀蔚蓝愿景，脚踏实地前行。每一篇记录都是通向理想未来的坚实脚印。",
  keywords: [
-    "Firefly",
-    "Fuwari",
-    "Astro",
-    "ACGN",
-    "博客",
-    "技术博客",
-    "静态博客",
+    "xpfxzxc", "未来之蓝", "个人博客",
+    "个人成长", "技术分享", "生活随想",
+    "编程学习", "ACGN", "动漫", "二次元", "游戏",
+    "非专业博客", "学习记录", "读书笔记"
  ],
```

**Favicon** 是 favorites icon 的缩写，也被称为网页图标，它是与网站相关联的图标，通常显示在浏览器的地址栏、书签栏或标签页上。通常而言，Favicon 与网站 Logo 在设计上是相同的，仅尺寸不同。它也可能是 Logo 中的首字或首字母，或是某个标志性图案的提炼。

我打算先完成 Logo 的设计（具体步骤后述），随后使用 [**ImageMagick**](https://imagemagick.org) 将其转换为 ICO 格式（`.ico`），目标尺寸为 32×32 像素（假设 Logo 原始尺寸已为 1:1 比例）:

```bash
magick logo.png -resize 32x32 favicon.ico
```

替换了 Favicon 后，维持 `siteConfig.ts` 文件内相关配置代码段不动：

```diff lang="typescript" title="src/config/siteConfig.ts"
// ...
favicon: [
  // 留空以使用默认 favicon
  {
    src: "/assets/images/favicon.ico", // 图标文件路径
    theme: "light", // 可选，指定主题 'light' | 'dark'
    sizes: "32x32", // 可选，图标大小
  },
],
// ...
```

如果将 `favicon` 字段设置为空数组，将使用 `public/favicon` 目录里的图标。

## 站点 Logo 和名称

站点 Logo 和名称位于顶部导航栏的左部分。其配置不在 `navBarConfig.ts` 文件中，而在 `siteConfig.ts` 文件中的一部分。

Logo 与相对通用的头像或背景壁纸不同，它需要具备独特的辨识度，以避免与其他站点雷同，从而体现博客的个性。因此，若懂设计，强烈推荐亲自设计。若不懂，也有以下解决方案：

- AI 智能生成（抽卡）：
  - [**Canva**](https://www.canva.com)：全球最流行的在线设计工具
  - [**NovelAI**](https://novelai.net)：专注于二次元图像生成和故事创作
  - [**Stable Diffusion**](https://stabledifffusion.com)：免费、开源、控制力强，拥有大量各种的模型，可本地部署或使用在线平台
  - [**Midjourney**](https://www.midjourney.com)：收费、闭源，艺术感和质感之王
  - [**LibibAI**](https://www.liblib.art)：国内领先的 AI 创作平台，提供了原汁原味的 **webUI**、**comfyUI** 等在线 AI 绘图工具免费试用，可在线进行模型训练、使用各种模型
- 打造纯文字 Logo：挑选一款特色字体，文字使用中英文组合，进行细节修饰、微调
- 交给专业人士：
  - 淘宝/咸鱼：搜索“Logo设计”，有许多工作室接单，价格非常亲民
  - 专业设计平台：[**特赞**](https://creativesku.com)、[**站酷**](https://www.zcool.com.cn/)
  - 社交媒体：在微博、小红书等平台上找独立设计师约稿

Firefly 主题风格简洁美观，并且与二次元元素非常契合，这从主题演示站点的出色效果可见一斑。这让我决定采用二次元风格的头像和背景壁纸。自然地，与之配套的 Logo 和 Favicon 也应选择统一的二次元风格。

我打算先在 NovelAI 平台上输入 Prompt 来进行“抽卡”，看能不能抽出看得过去的 Logo。NovelAI 平台的新账号拥有 30 张图片的免费生成额度。

我通过 AI 来辅助生成 Prompt：首先，我将网站的标题、副标题、描述、关键词，还有之后要使用的头像和背景壁纸的相关信息输入到 AI；然后，将其生成的多个 Prompt 逐一复制到 NovelAI 里的 `Prompt` 输入框里，并执行图片生成。在生成图片之前，可以设置其尺寸大小，例如：1:1 比例的 1024×1024 尺寸。根据生成的情况，可能要尝试好几种 Prompt，也可能需对同一个 Prompt 多次执行图片生成。最后，从生成的多张图片中挑选出几张看得过去的图片。

我最终使用的 Logo，是根据以下 Prompt 生成的：

```text showLineNumbers=false
masterpiece, minimalist logo, an open book from which emerges a constellation of three stars flying upwards, symbolizing ideas reaching for the future. Solid color design in hue 230, white background, clean vector graphic, no gradient --niji 6 --style raw
```

使用该 Prompt 生成的图片通常为白底。若直接用作 Logo，视觉效果不佳，因此下一步需移除背景，将其变为透明。可以选用 [**removebg**](https://www.remove.bg) 等在线工具或其他软件来移除背景。

目前得到的 Logo 图片格式是 PNG。作为优化流程的一环，Logo 应被转换为 WEBP 这类现代图片格式：

```bash
magick logo.png -quality 85 logo.webp
```

给博客站点取了个名称后，我将 `siteConfig.ts` 文件内容修改为：

```diff lang="typescript" title="src/config/siteConfig.ts"
// ...
// 导航栏Logo
// navbarLogo 支持三种类型：Astro图标库，本地图片，网络图片
// { type: "icon", value: "material-symbols:home-pin-outline" }
// { type: "image", value: "/assets/images/logo.webp", alt: "Firefly Logo" }
// { type: "image", value: "https://example.com/logo.png", alt: "Firefly Logo" }
navbarLogo: {
  type: "image",
-    value: "/assets/images/LiuYingPure3.svg",
+    value: "/assets/images/logo.webp",
-    alt: "🍀",
+    alt: "未来之蓝博客 Logo - 一本翻开的书与飞向上方的星辰，象征知识、记录与通向未来的愿景",
  },
-  navbarTitle: "Firefly", // 导航栏标题，可以设置为与 title 不同的值，如果不设置则使用 title
+  navbarTitle: "未来之蓝", // 导航栏标题，可以设置为与 title 不同的值，如果不设置则使用 title
}
// ...
```

## 个人基本资料

个人基本资料位于页面的左侧栏。`profileConfig.ts` 文件里存放着个人资料配置，例如修改个人头像、名称、介绍和社交栏设置。

个人头像的获取渠道很多，选取时需与网站主题风格保持一致。个人名称可直接使用自己熟悉的网名。个人介绍若无灵感，可先参考其他博主的写法。在社交栏处，可以登记下自己常用的社交媒体链接。

对于像头像这样较大或更大的图片，最好使用 **WebP** 格式，WebP 的优势如下：

- 在同等视觉质量下，惊人的体积压缩
- 更快的页面加载速度
- 支持无损或有损压缩、透明度

使用 ImageMagick 将 **PNG** 或 **JPG** 批量或单个转换为 WebP 格式很简单，例如：

```bash
# 有损压缩，质量 85（常用）
magick avatar.png -quality 85 avatar.webp
```

替换了头像图片之后，我将 `profileConfig.ts` 文件内容修改为：

```diff lang="typescript" title="src/config/profileConfig.ts"
import type { ProfileConfig } from "../types/config";

export const profileConfig: ProfileConfig = {
  avatar: "/assets/images/avatar.webp",
-  name: "Firefly",
-  bio: "Hello, I'm Firefly.",
+  name: "xpfxzxc",
+  bio: "不愿沉溺于无力感，正试着将碎片化的思考转化成可见的成长足迹。",
  links: [
    {
-      name: "Bilibli",
-      icon: "fa6-brands:bilibili",
-      url: "https://space.bilibili.com/38932988",
+      name: "Email",
+      icon: "material-symbols:mail",
+      url: "mailto:xpfxzxc@gmail.com",
    },
    {
      name: "GitHub",
      icon: "fa6-brands:github",
-      url: "https://github.com/CuteLeaf",
+      url: "https://github.com/xpfxzxc",
+    },
+    {
+      name: "Bilibli",
+      icon: "fa6-brands:bilibili",
+      url: "https://space.bilibili.com/12533717",
+    },
+    {
+      name: "Steam",
+      icon: "fa6-brands:steam",
+      url: "https://steamcommunity.com/profiles/76561198327614842",
    },
  ],
};
```

关于 `icon` 字段，在网络上搜索 `fa6-brands online`，即可查询到相关的图标搜索网站：

- [FontAwesome](https://fontawesome.com/search)
- [Iconbuddy](https://iconbuddy.com/fa6-brands)

## 站点公告

公告同样位于页面的左侧栏。`announcementConfig.ts` 文件里存放着公告配置，但卡片上的 `公告` 字样可以自定义为其他标题，因此严格来说该区域的内容不一定是“公告”？

我将文件内容修改为：

```diff lang="typescript" title="src/config/announcementConfig.ts"
import type { AnnouncementConfig } from "../types/config";

export const announcementConfig: AnnouncementConfig = {
-  title: "公告", // 公告标题
-  content: "欢迎来到我的博客！这是一则示例公告。", // 公告内容
-  closable: true, // 允许用户关闭公告
+  title: "站点说明", // 公告标题
+  content: "个人学习和日常零散想法的记录空间，内容随性且不定期更新。", // 公告内容
+  closable: false, // 禁止用户关闭公告
  link: {
-    enable: true, // 启用链接
+    enable: false, // 关闭链接
    text: "了解更多", // 链接文本
    url: "/about/", // 链接 URL
    external: false, // 内部链接
  },
};
```

## 导航栏

导航栏位于页面的顶部中间部分。`navBarConfig.ts` 文件里存放着导航栏配置，它是一个链接对象数组。每个链接对象，要么是 `LinkPreset` 链接预设枚举，要么是自定义链接对象。当自定义链接对象时，使用 `children` 字段可以生成多级菜单。

我将文件内容修改为：

```diff lang="typescript" title="src/config/navBarConfig.ts"
import type { NavBarConfig, NavBarLink } from "../types/config";
import { LinkPreset } from "../types/config";
import { siteConfig } from "./siteConfig";

// 根据页面开关动态生成导航栏配置
const getDynamicNavBarConfig = (): NavBarConfig => {
  const links: (NavBarLink | LinkPreset)[] = [
    LinkPreset.Home,
    LinkPreset.Archive,
  ];

  // 支持自定义导航栏链接,并且支持多级菜单
  links.push({
    name: "链接",
    url: "/links/",
    icon: "material-symbols:link",
    children: [
+      {
+        name: "Email",
+        url: "mailto:xpfxzxc@gmail.com",
+        external: true,
+        icon: "material-symbols:mail",
+      },
      {
        name: "GitHub",
-        url: "https://github.com/CuteLeaf/Firefly",
+        url: "https://github.com/xpfxzxc",
        external: true,
        icon: "fa6-brands:github",
      },
      {
        name: "Bilibili",
-        url: "https://space.bilibili.com/38932988",
+        url: "https://space.bilibili.com/12533717",
        external: true,
        icon: "fa6-brands:bilibili",
      },
+      {
+        name: "Steam",
+        url: "https://steamcommunity.com/profiles/76561198327614842",
+        external: true,
+        icon: "fa6-brands:steam",
+      },
    ],
  });

  links.push(LinkPreset.Friends);

  // 根据配置决定是否添加留言板页面
  if (siteConfig.pages.guestbook) {
    links.push(LinkPreset.Guestbook);
  }

  links.push({
    name: "关于",
    url: "/content/",
    icon: "material-symbols:info",
    children: [
      ...(siteConfig.pages.anime ? [LinkPreset.Anime] : []), // 根据配置决定是否添加追番页面
      ...(siteConfig.pages.sponsor ? [LinkPreset.Sponsor] : []), // 根据配置决定是否添加赞助页面
      LinkPreset.About,
    ],
  });
  return { links };
};

export const navBarConfig: NavBarConfig = getDynamicNavBarConfig();
```

关于 `icon` 字段里用到的 **Material Symbols**，更多图标可在 [Material Symbols and Icons](https://fonts.google.com/icons) 网站中搜索。


## 背景壁纸

虽然 [**Unsplash**](https://unsplash.com)、[**Pexels**](https://www.pexels.com)、[**Pixabay**](https://pixabay.com) 等网站提供海量高质量图片，但是我不喜欢这些网站上的图片风格，比如：自然、生活、简约、插画、抽象、纹理、摄影、渐变、写实等。我认为这些图片倒是比较适合作为商业册子上的图案或者电子设备上的背景壁纸。其中，大部分图片看着令我感到压抑感；小部分图片单独看着还可以，但作为网页背景壁纸时不太适配 Firefly 主题现有元素风格。与其用这些背景壁纸，不如采用极简风格的色彩搭配或直接使用纯色背景。

既然我之前选用的头像是二次元风格，而且 Firefly 主题演示站点用的背景壁纸看起来美观，令人感到舒适，那就使用 [**Pixiv**](https://www.pixiv.co.jp) 或 [**zerochan**](https://www.zerochan.net) 等网站上高质量插画来作为博客的背景壁纸。在选择的过程中，要注意避免版权问题，最好选择作者明确标明“可自由使用” 或 **CC0**、**CC BY** 授权的插画。

此外，在网友自建的壁纸站里找高质量壁纸也是一种很好的选择。比如：[**恋风画廊 - 高质量壁纸下载**](https://www.lovewind.de)。

针对不同设备的屏幕比例特性，一般来说：移动端优先采用竖屏背景壁纸，而非移动端（如 PC、平板）则统一采用横屏背景壁纸。

为了优化浏览体验，建议将选定的背景壁纸转换为 WEBP 格式。可以替换掉 `public/assets/images` 目录下的 `d1.webp`（桌面端）和 `m1.webp`（移动端）文件，也可另取文件名保存。注意，将背景壁纸本地化保存可有效避免因外部链接失效导致的显示问题。 

背景壁纸相关的配置在 `siteConfig.ts` 文件里 `backgroundWallpaper` 字段上，里面有非常多的选项可以配置。几乎所有的选项都已有注释，非常好理解，不过，`position` 选项的理解需要额外学习一些 **CSS** 知识点。

```typescript title="src/config/siteConfig.ts"
// ...
// 图片位置
// 支持所有CSS object-position值，如: 'top', 'center', 'bottom', 'left top', 'right bottom', '25% 75%', '10px 20px'..
// 如果不知道怎么配置百分百之类的配置，推荐直接使用：'center'居中，'top'顶部居中，'bottom' 底部居中，'left'左侧居中，'right'右侧居中
position: "0% 20%",
// ...
```

根据代码注释和源码，这里 `position` 选项的值会直接运用到 CSS 的 `object-position` 属性上。`object-position` 属性的作用：想象成照片（可替换元素）在相框（内容框）里移动，具体来说，照片上的哪个点与相框上的哪个点对齐。

CSS `object-fit` 通常配合 `object-position` 属性使用，它的值：

- `cover`：照片按其宽高比进行缩放，直至完全覆盖相框，可能会裁剪一部分
- `contain`：照片按其宽高比进行缩放，直到完整显示在相框内，可能会留有空白
- `fill`（默认）：照片会被拉伸或压缩，以填满整个相框，可能会变形

在源码中，已经将 `object-fit` 属性的值设置成 `cover` 了。

综上来看，配置文件中的 `position: 0 20%` 的含义是：保持相框不动，让图片在垂直方向上向上移动，从而在容器中展示出图片更靠下的区域，就等于告诉浏览器：“不想看这张大图最顶上的一部分，请把画面往下挪一点再给我看。”这表明如果使用这个值的话，使用的背景壁纸顶部将被裁剪掉的一小部分不要有“太重要”的内容。

在“横幅壁纸”模式下，主页横幅区域设有标题与副标题文字，其中副标题会从预设的若干组文字中动态轮换，并呈现逐字键入与删除的动态效果。文字内容需要兼顾节奏与韵律、意境与画面、情感共鸣、系列感与统一。

在该模式下，当前可能存在两个显示协调性问题：

1. 在主页面中，横幅的主标题和副标题可能会遮挡背景壁纸的关键部分（如角色脸部），影像画面整体协调，此时可能需要调整配置文件中的 `position` 字段。
2. 其他页面的背景壁纸位置相较于主页会略微上移，下方卡片区域也向上移动，导致背景壁纸被遮挡的区域更大，画面看起来不协调。因此，同样可能需要通过调整 `position` 字段进行修正。

不过，即使调整好了 `position` 字段，在其他视口尺寸的情况下，同样可能出现遮挡问题。要彻底规避遮挡问题，要么投入更多开发量引入响应式定位机制，要么改用“全屏壁纸”或“纯色背景”模式，甚至直接更换背景壁纸。

最终，我将背景壁纸相关配置改为：

```diff lang="typescript" title="src/config/siteConfig.ts"
  backgroundWallpaper: {
    // 壁纸模式："banner" 横幅壁纸，"overlay" 全屏壁纸，"none" 纯色背景无壁纸
    mode: "banner",
    // 是否允许用户通过导航栏切换壁纸模式，设为false可提升性能（只渲染当前模式）
    switchable: true,

    // 背景图片配置
    src: {
      // 桌面背景图片
      desktop: "/assets/images/d1.webp",
      // 移动背景图片
      mobile: "/assets/images/m1.webp",
    },

    // Banner模式特有配置
    banner: {
      // 图片位置
      // 支持所有CSS object-position值，如: 'top', 'center', 'bottom', 'left top', 'right bottom', '25% 75%', '10px 20px'..
      // 如果不知道怎么配置百分百之类的配置，推荐直接使用：'center'居中，'top'顶部居中，'bottom' 底部居中，'left'左侧居中，'right'右侧居中
-     position: "0% 20%",
+     position: "center 9%",
      
      homeText: {
        // 主页显示自定义文本（全局开关）
        enable: true,
        // 主页横幅主标题
-       title: "Lovely firefly!",
+       title: "Future Archives!",
        // 主页横幅副标题
        subtitle: [
-         "In Reddened Chrysalis, I Once Rest",
-         "From Shattered Sky, I Free Fall",
-         "Amidst Silenced Stars, I Deep Sleep",
-         "Upon Lighted Fyrefly, I Soon Gaze",
-         "From Undreamt Night, I Thence Shine",
-         "In Finalized Morrow, I Full Bloom",
+         "In Reddened Chrysalis, I Once Rest",
+         "From Shattered Sky, I Free Fall",
+         "Amidst Silenced Stars, I Deep Sleep",
+         "Upon Lighted Fyrefly, I Soon Gaze",
+         "From Undreamt Night, I Thence Shine",
+         "In Finalized Morrow, I Full Bloom",
        ],
        typewriter: {
          enable: true, // 启用副标题打字机效果
          speed: 100, // 打字速度（毫秒）
          deleteSpeed: 50, // 删除速度（毫秒）
          pauseTime: 2000, // 完全显示后的暂停时间（毫秒）
        },
      },
      credit: {
        enable: {
          desktop: true, // 桌面端显示横幅图片来源文本
-         mobile: false, // 移动端显示横幅图片来源文本
+         mobile: true, // 移动端显示横幅图片来源文本
        },
        text: {
-         desktop: "Pixiv - 晚晚喵", // 桌面端要显示的来源文本
-         mobile: "Mobile Credit", // 移动端要显示的来源文本
+         desktop: "Pixiv - 鈴木シロリ", // 桌面端要显示的来源文本
+         mobile: "Pixiv - Orivayne", // 移动端要显示的来源文本
        },
        url: {
-         desktop: "https://www.pixiv.net/artworks/135490046", // 桌面端原始艺术品或艺术家页面的 URL 链接
-         mobile: "", // 移动端原始艺术品或艺术家页面的 URL 链接
+         desktop: "https://www.pixiv.net/artworks/108043909", // 桌面端原始艺术品或艺术家页面的 URL 链接
+         mobile: "https://www.pixiv.net/artworks/130379063", // 移动端原始艺术品或艺术家页面的 URL 链接
        },
      },
      navbar: {
        transparentMode: "semifull", // 导航栏透明模式："semi" 半透明加圆角，"full" 完全透明，"semifull" 动态透明
      },
      // 波浪动画效果配置，开启可能会影响页面性能，请根据实际情况开启
      waves: {
        enable: {
          desktop: true, // 桌面端启用波浪动画效果
          mobile: true, // 移动端启用波浪动画效果
        },
        performance: {
          quality: "high",
          hardwareAcceleration: true, // 是否启用硬件加速
        },
        // 性能优化说明：
        // quality: "high" - 最佳视觉效果，但GPU占用较高，适合高性能设备
        // quality: "medium" - 平衡性能和质量，适合中等性能设备
        // quality: "low" - 最低GPU占用，动画更简单，适合低性能设备
        // hardwareAcceleration: true - 启用GPU加速，提升性能但增加GPU占用
        // hardwareAcceleration: false - 禁用GPU加速，降低GPU占用但可能影响性能
      },
    },

    // 全屏透明覆盖模式特有配置
    overlay: {
      zIndex: -1, // 层级，确保壁纸在背景层
      opacity: 0.8, // 壁纸透明度
-     blur: 1, // 背景模糊程度
+     blur: 0.5, // 背景模糊程度
    },
  },
```

## 主题色

更换好 Logo、Favicon、头像图片和背景壁纸后，下一步是选择合适的主题色，以确保网站各元素的色彩整体和谐统一。

当前的主题色系统基于 **OKLCH** 色彩空间构建。无论是通过配置文件还是界面调节器修改主题色，最终都会作用于 CSS 变量 `--hue`。系统中主题相关的颜色，都是基于固定的**亮度**（**Lightness**）与**色度**（**Chroma**）值，结合可变的**色相**（**Hue**）值动态计算得出的。例如：

```stylus title="src/styles/variables-unified.styl"
/* ===== 主题相关变量 ===== */
:root {
  --primary: oklch(0.70 0.14 var(--hue));
  --page-bg: oklch(0.95 0.01 var(--hue));
  --card-bg: white;
  --card-bg-transparent: rgba(255, 255, 255, 0.8);
  
  --btn-content: oklch(0.55 0.12 var(--hue));
  --btn-regular-bg: oklch(0.95 0.025 var(--hue));
  --btn-regular-bg-hover: oklch(0.9 0.05 var(--hue));
  --btn-regular-bg-active: oklch(0.85 0.08 var(--hue));
  /* ... */
}
/* ... */
```

因此，主题色可选的范围非常有限。

我将 `siteConfig.ts` 文件里的主题色配置为：

```diff lang="typescript" title="src/config/siteConfig.ts"
themeColor: {
-  hue: 165, // 主题色的默认色相，范围从 0 到 360。例如：红色：0，青色：200，蓝绿色：250，粉色：345
-  fixed: false, // 对访问者隐藏主题色选择器
+  hue: 230, // 主题色的默认色相，范围从 0 到 360。例如：红色：0，青色：200，蓝绿色：250，粉色：345
+  fixed: true, // 对访问者隐藏主题色选择器
  defaultMode: "system", // 默认模式："light" 亮色，"dark" 暗色，"system" 跟随系统
},
```

## 字体

基于目前的默认字体配置，虽说字体在我的电脑上显示得很美观，但是在其他电脑上就可能显示得不一样。对此，我有个需求：不管在什么设备上打开博客站点，页面上都要使用同样的字体。

由于我不太了解字体方面，所以在配置前查阅了相关资料，并阅读了一些源码。

字体的相关配置在 `fontConfig.ts` 文件里：

```typescript title="src/config/fontConfig.ts"
// 字体配置
export const fontConfig = {
  enable: true, // 启用自定义字体功能
  preload: true, // 预加载字体文件以提高性能
  selected: ["system"], // 当前选择的字体，支持多个字体组合
  fonts: {
    // 系统字体
    system: {
      id: "system",
      name: "系统字体",
      src: "", // 系统字体无需 src
      family:
        "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
    },
    // Google Fonts - Zen Maru Gothic
    "zen-maru-gothic": {
      id: "zen-maru-gothic",
      name: "Zen Maru Gothic",
      src: "https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@300;400;500;700;900&display=swap",
      family: "Zen Maru Gothic",
      display: "swap" as const,
    },
    // Google Fonts - Inter
    inter: {
      id: "inter",
      name: "Inter",
      src: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
      family: "Inter",
      display: "swap" as const,
    },
    // 小米字体 - MiSans Normal
    "misans-normal": {
      id: "misans-normal",
      name: "MiSans Normal",
      src: "https://unpkg.com/misans@4.1.0/lib/Normal/MiSans-Normal.min.css",
      family: "MiSans",
      weight: 400,
      display: "swap" as const,
    },
    // 小米字体 - MiSans Semibold
    "misans-semibold": {
      id: "misans-semibold",
      name: "MiSans Semibold",
      src: "https://unpkg.com/misans@4.1.0/lib/Normal/MiSans-Semibold.min.css",
      family: "MiSans",
      weight: 600,
      display: "swap" as const,
    },
  },
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "sans-serif",
  ], // 全局字体回退
};
```

从配置中可知，有两个结构需要去研究一下。

字体选择配置：

```typescript title="src/types/config.ts"
// 字体配置
export type FontConfig = {
  enable: boolean; // 是否启用自定义字体功能
  selected: string | string[]; // 当前选择的字体ID，支持单个或多个字体组合
  fonts: Record<string, FontItem>; // 字体库，以ID为键的对象
  fallback?: string[]; // 全局字体回退列表
  preload?: boolean; // 是否预加载字体文件以提高性能
};
```

单个字体项配置：

```typescript title="src/types/config.ts"
// 单个字体配置
export type FontItem = {
  id: string; // 字体唯一标识符
  name: string; // 字体显示名称
  src: string; // 字体文件路径或URL链接
  family: string; // CSS font-family 名称
  weight?: string | number; // 字体粗细，如 "normal", "bold", 400, 700 等
  style?: "normal" | "italic" | "oblique"; // 字体样式
  display?: "auto" | "block" | "swap" | "fallback" | "optional"; // font-display 属性
  unicodeRange?: string; // Unicode 范围，用于字体子集化
  format?:
    | "woff"
    | "woff2"
    | "truetype"
    | "opentype"
    | "embedded-opentype"
    | "svg"; // 字体格式，仅当 src 为本地文件时需要
};
```

其对应的处理代码片段都在 `src/components/interactive/FootManager.astro` 文件中。

CSS `font-family` 属性的值是一个按照优先级顺序的字体名称列表，被称为**字体栈**或**字体族堆栈**。浏览器会从列表的最左边开始尝试，如果用户设备上没有安装该字体或者无法下载该字体，浏览器就会尝试列表中的下一个字体，以此类推。最后通常会以一个通用字体族作为后备，确保内容在任何情况下都基本可读。

通用字体族是非常重要的后背方案（对应的名称不加引号）：

| 通用字体族 | 描述	| 典型示例 |
| --- | --- | --- |
| `serif` |	衬线体，字符笔画末端有装饰性的小细节。显得传统、正式、优雅 | Times New Roman, 宋体, SimSun |
| `sans-serif` | 无衬线体，字符笔画末端干净，没有装饰。显得现代、简洁、易读 |	Arial, Helvetica, 微软雅黑, Microsoft YaHei |
| `monospace` |	等宽字体，所有字符宽度相同。常用于显示代码、终端文本 | Courier New, Consolas, Monaco |
| `cursive` |	草书字体，模拟手写笔迹。具有艺术性，但可读性较差 | Comic Sans MS, 楷体 (有时) |
| `fantasy` |	奇幻字体，具有特殊艺术效果的字体。主要用于装饰 | Impact, Papyrus |
| `system-ui` |	系统默认字体，直接使用用户操作系统的默认界面字体 | San Francisco (macOS), Segoe UI (Windows) |

至于 `fallback` 字段里的其他值：

- `-apple-system`：专为 **macOS** 和 **iOS** 系统设计的字体家族名称，用于调用苹果系统的默认字体（San Francisco）
- `BlinkMacSystemFont`：针对 macOS 上使用 **Blink** 渲染引擎的浏览器（如 **Chrome**、**Edge**、**Opera**）的字体名称
- `Segoe UI`：**Misrosoft Windows** 从 **Vista** 开始使用的默认界面字体
- `Roboto`：**Google** 开发的 **Android** 系统和 **Chrome OS** 的默认字体

由此可见，`fallback` 字段值的基本核心思想是选择对应平台上的默认系统字体。

`selected` 字段主要作用是生成 CSS `font-family` 属性的堆叠，期间它会过滤掉传入的 id，其对应的单个字体项中 `src` 字段为空的：

```typescript title="src/components/interactive/FootManager.astro"
// 获取选中的字体
const getSelectedFonts = () => {
  if (!fontConfig.enable || !fontConfig.selected) return [];

  const selectedIds = Array.isArray(fontConfig.selected)
    ? fontConfig.selected
    : [fontConfig.selected];

  return selectedIds
    .map((id) => fontConfig.fonts[id])
    .filter((font) => font && font.src); // 过滤掉系统字体和不存在的字体
};
```

也就是说，目前填的 `selected: ["system"]`，相当于 `selected: []`，直接使用 `fallback` 字段生成 `font-family` 属性的值：`system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif`。

对于成功被选择的每一个单个字体项，根据传入的 `src` 字段的链接类型会生成不同类型的新标签：

```typescript title="src/components/interactive/FootManager.astro"
<!-- 字体样式表链接 -->{
  selectedFonts.map((font) => {
    // 判断是否为外部链接
    const isExternalUrl =
      font.src.startsWith("http://") ||
      font.src.startsWith("https://") ||
      font.src.startsWith("//");

    if (isExternalUrl) {
      // 外部字体链接 (如 Google Fonts, CDN等)
      return <link rel="stylesheet" href={font.src} />;
    } else {
      // 本地字体文件
      return (
        <style
          set:html={`
        @font-face {
          font-family: "${font.family}";
          src: url("${font.src}") ${font.format ? `format("${font.format}")` : ""};
          ${font.weight ? `font-weight: ${font.weight};` : ""}
          ${font.style ? `font-style: ${font.style};` : ""}
          ${font.display ? `font-display: ${font.display};` : ""}
          ${font.unicodeRange ? `unicode-range: ${font.unicodeRange};` : ""}
        }
      `}
        />
      );
    }
  })
}
```

单个字体项的各字段：

- `id`：不影响渲染。用于内部查找、CSS 类名生成
- `name`：不影响渲染。用于文档说明、可读性
- `family`：影响渲染。用于 CSS `font-family` 属性
- `weight`：仅影响渲染本地字体，由 `@font-face` 规则定义
- `display`：仅影响渲染本地字体，定义本地字体的加载行为，用于 CSS `font-display` 属性

从结果上看，不管是使用外部字体链接还是本地字体文件，最终都会引入 `@font-face` 规则。因为外部字体链接通常是一堆 `@font-face` 规则的 CSS 文件的链接。

`@font-face` 规则允许使用自定义字体，需要在 CSS 文件的顶层定义或者放在 `<style>` 标签内，声明一个字体家族供后续使用。例如：

```css
@font-face {
  font-family: 'Zen Maru Gothic';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/zenmarugothic/v19/o-0XIpIxzW5b-RxT-6A8jWAtCp-cQWpCOfKK_7mX3yPCWUgO7n9RJZk8vDuG3WM.2.woff2) format('woff2');
  unicode-range: U+ffd7, U+ffda-ffdc, U+ffe0-ffe2, U+ffe4, U+ffe6, U+ffe8-ffee, U+1f100-1f10c, U+1f110-1f16c, U+1f170-1f1ac, U+1f200-1f202, U+1f210-1f234;
}
```

关键属性解释：

- `font-family`：自定义字体的别名。将在后面的 CSS 规则中用这个名字来引用它
- `src`：字体文件的实际路径。可以通过 `url()` 指定一个或多个源，浏览器会按顺序加载第一个它能识别的格式。`format()` 用于帮助浏览器识别字体格式
- `font-weight`：告诉浏览器这个特定的字体文件对应哪种字重
- `font-style`：告诉浏览器这个特定的字体文件是正常样式还是斜体
- `unicode-range`：指定一个作用范围 —— 只有当网页中的字符落在指定的 Unicode 编码范围内时，才会下载并使用这个特定的字体文件

> [!WARNING]
> 如果只提供了一个字体文件（比如常规粗细 `400`），但在 CSS 中使用了 `font-weight: 700`，浏览器会尝试通过算法加粗这个字体。这种模拟效果很粗糙，远不如真正的粗体字文件美观。

CSS `font-display` 是另一个关键属性，专门用于控制网页字体的加载和显示方式。

当使用 `@font-face` 引入一个网络字体时，浏览器可能的默认行为：

- **FOIT**（闪烁的不可见文本）：在自定义字体加载完成之前，浏览器会将文字隐藏，显示一片空白
- **FOUT**（闪烁的无样式文本）：浏览器先使用备用字体显示文本，等自定义字体加载完成后再切换回来

`font-display` 提供了一些值让我们去覆盖这种浏览器的默认行为。不过，为了理解这些值的含义，要先了解理解浏览器处理字体加载的三个关键时间段：

- **阻塞期**：字体在加载时，浏览器会阻塞文本的显示，必须渲染不可见的备用字体。如果字体缓存中有，这个时期极其短
- **交换期**：如果阻塞期结束字体还没加载好，浏览器会使用备用字体。之后一旦自定义字体加载完成，就好立即交换过来
- **失效期**：如果交换期都结束了，字体还没加载好，浏览器就会放弃使用这个自定义字体，页面将一直使用备用字体

`font-display` 的不同值，能够调整这三个时间段的长度和行为：

| 值 | 行为描述 | 阻塞期 | 交换期 |
| :---: | :---: | :---: | :---: |
| `auto` | 浏览器默认行为。通常是 FOIT（隐藏文本直到超时） | 不确定 | 不确定 |
| `block` | 文字会暂时不可见，然后立即使用备用字体显示，最后再交换回自定义字体 | 极短 | 无限 |
| `swap` | 立即用备用字体显示，等自定义字体加载好后立即交换 | 0 | 无限 |
| `fallback` | 文字会极短暂不可见，然后使用备用字体。如果之后自定义字体在较短的交换期内加载好了，就交换；否则就永远使用备用字体 | 极短 | 短 |
| `optional` | 文字会极短暂不可见，然后使用备用字体。是否交换取决于用户的网络连接和速度。如果用户在第一次访问时网络慢，字体可能永远不会加载 | 极短 | 0 |

由此可见，`swap` 是最常用、最推荐的选项，适用于我们这种正文等需要快速展示内容的情况。

在了解了字体配置和显示的机制后，就可以修改字体的相关配置：

```diff lang="typescript" title="src/config/fontConfig.ts"
// 字体配置
export const fontConfig = {
  enable: true, // 启用自定义字体功能
  preload: true, // 预加载字体文件以提高性能
-  selected: ["system"], // 当前选择的字体，支持多个字体组合
+  selected: ["misans-light", "misans-normal", "misans-medium",  "misans-semibold", "misans-bold"], // 当前选择的字体，支持多个字体组合
  fonts: {
-    // 系统字体
-    system: {
-      id: "system",
-      name: "系统字体",
-      src: "", // 系统字体无需 src
-      family:
-        "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
-    },
-    // Google Fonts - Zen Maru Gothic
-    "zen-maru-gothic": {
-      id: "zen-maru-gothic",
-      name: "Zen Maru Gothic",
-      src: "https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@300;400;500;700;900&display=swap",
-      family: "Zen Maru Gothic",
-      display: "swap" as const,
-    },
-    // Google Fonts - Inter
-    inter: {
-      id: "inter",
-      name: "Inter",
-      src: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
-      family: "Inter",
-      display: "swap" as const,
-    },
+    // 小米字体 - MiSans Light
+    "misans-light": {
+      id: "misans-light",
+      name: "MiSans Light",
+      src: "https://unpkg.com/misans@4.1.0/lib/Normal/MiSans-Light.min.css",
+      family: "MiSans",
+      weight: 300,
+      display: "swap" as const,
+    },
    // 小米字体 - MiSans Normal
    "misans-normal": {
      id: "misans-normal",
      name: "MiSans Normal",
      src: "https://unpkg.com/misans@4.1.0/lib/Normal/MiSans-Normal.min.css",
      family: "MiSans",
      weight: 400,
      display: "swap" as const,
    },
+    // 小米字体 - MiSans Medium
+    "misans-medium": {
+      id: "misans-medium",
+      name: "MiSans Medium",
+      src: "https://unpkg.com/misans@4.1.0/lib/Normal/MiSans-Medium.min.css",
+      family: "MiSans",
+      weight: 500,
+      display: "swap" as const,
+    },
    // 小米字体 - MiSans Semibold
    "misans-semibold": {
      id: "misans-semibold",
      name: "MiSans Semibold",
      src: "https://unpkg.com/misans@4.1.0/lib/Normal/MiSans-Semibold.min.css",
      family: "MiSans",
      weight: 600,
      display: "swap" as const,
    },
+    // 小米字体 - MiSans Bold
+    "misans-bold": {
+      id: "misans-bold",
+      name: "MiSans Bold",
+      src: "https://unpkg.com/misans@4.1.0/lib/Normal/MiSans-Bold.min.css",
+      family: "MiSans",
+      weight: 700,
+      display: "swap" as const,
+    },
  }
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "sans-serif",
  ], // 全局字体回退
};
```

这样就确保所选用的自定义字体涵盖了中文、英文、数字及日文字符集，并包含了常用的 300 到 700 字重。

在调试的过程中，我注意到 Inter 是一款可变字体，只需加载一个智能的字体文件，就可以让浏览器通过算法“生成”指定范围内的任何字重。其 `@font-face` 规则里的 `font-weight` 不管是多少都是指向同一个字体文件——Inter-Thin。

> [!TIP]
> 在调试字体显示时，可按 `F12` 键打开浏览器的`开发人员工具`，切换到`元素`面板，接着按 `Ctrl+Shift+C` 键（或点击左上角的“选择元素”图标），在页面上点击要检查的元素。随后，在开发人员工具右下角找到并展开`已计算`面板，滚动到底部即可查看`呈现的字体`信息。

## 友链

Firefly 主题内置并默认开启友链页面。友链（友情链接）页面，初看只是列出跟本博客相关或有过联系的网站链接，从而提升对方网站的曝光率。但我在 AI 上询问得到了令人惊奇的回答，其中，对博主自身的好处有：

- 构建个人知识网络和灵感
- 塑造和表达博客的“个性”和“品味”
- 融入社区，获得归属感
- 潜在的流量回流和 SEO 益处

`friendsConfig.ts` 文件用于配置友链页面下的友链，例如可以添加 [Mizuki](https://github.com/matsuzaka-yuki/Mizuki) 和 [fuwari](https://github.com/saicaca/fuwari) 这两个跟主题相关的友情链接。

我在文件里添加：

```typescript title="src/config/friendsConfig.ts"
  // ...
  {
    "title": "Mizuki",
    imgurl: "https://mizuki.mysqil.com/_astro/avatar.Nvq3-FmN_Z28HWf5.webp",
    desc: "融合Android原生质感与二次元美学：Material Design 3规范下的Astro博客主题（Tailwind CSS实现）",
    siteurl: "https://github.com/matsuzaka-yuki/Mizuki",
    tags: ["GitHub", "Theme"],
    weight: 9,
    enabled: true,
  },
  {
    title: "fuwari",
    imgurl: "https://fuwari.vercel.app/_astro/demo-avatar.CxcI0ivM_1nbuVe.webp",
    desc: "✨A static blog template built with Astro.",
    siteurl: "https://github.com/saicaca/fuwari",
    tags: ["GitHub", "Theme"],
    weight: 9,
    enabled: true,
  },
  // ...
```

友链页面下面的自定义内容在 `src/content/spec/friends.md` 文件里，稍微修改一下：

```diff lang="markdown" title="src/content/spec/friends.md"
...
- 站点名称: 夏夜流萤
- 站点描述: 飞萤之火自无梦的长夜亮起，绽放在终竟的明天。
- 站点链接: https://blog.cuteleaf.cn
+ 站点名称: 未来之蓝
+ 站点描述: 心怀蔚蓝愿景，脚踏实地前行。每一篇记录都是通向理想未来的坚实脚印。
+ 站点链接: https://xpfxzxc.github.io
头像链接: https://q1.qlogo.cn/g?b=qq&nk=7618557&s=640

## ✉️申请友链

- 请将您的网站信息发送邮件至：`xxx@xxx.com`
+ 请将您的网站信息发送邮件至：`xpfxzxc@gmail.com`
...
```

## 追番

[**Bangumi**](https://bangumi.tv/)，名字来源于日语的“番组”（节目），致力于让阿宅们拥有一个轻松便捷独特的交流与沟通环境。目前设有五大分区：动画、书籍、音乐、游戏、三次元。

在 `siteConfig.ts` 文件里可以配置 Bangumi 用户 ID，用于在追番页面下显示该用户的收藏列表。

将 `bangumi` 字段下的 `userId` 的值改为自己的 Bangumi 用户 ID 即可：

```diff lang="typescript" title="src/config/siteConfig.ts"
// 追番配置
bangumi: {
-  userId: "1163581", // 在此处设置你的Bangumi用户ID
+  userId: "1175686", // 在此处设置你的Bangumi用户ID
},
```

## 赞助

赞助页面为博主提供一个渠道，来接受读者自愿性、直接的财务支持，通过支付宝/微信的一次性赞助，或者像**爱发电**等平台的定期赞助等。

`sponsorConfig.ts` 文件可以对赞助页面进行配置，需要将 `public/assets/images/sponsor` 目录下的 `alipay.png` 和 `wechat.png` 二维码图片替换成自己的收款二维码图片。

不过，微信 APP 和淘宝 APP 默认生成的收款二维码中自带头像。如果觉得这些收款二维码中的头像不好看，可以借助工具先解码二维码再重新生成二维码。更进一步的，甚至可以自定义二维码样式。

有两个网站用于方便解码和自定义生成二维码图片：

- [在线生成二维码 - 在线工具](https://tool.lu/qrcode)
- [码上游](https://ma3you.com)

如果二维码的尺寸较大，可以使用 ImageMagick 工具去调整大小，例如：

```bash
magick wechat.png -resize 400x400 -filter Lanczos wechat.png
```

根据实际需求，我将 `sponsorConfig.ts` 文件内容改成：

```diff lang="typescript" title="src/config/sponsorConfig.ts"
import type { SponsorConfig } from "../types/config";

export const sponsorConfig: SponsorConfig = {
  title: "", // 页面标题，如果留空则使用 i18n 中的翻译
  description:
    "", // 页面描述文本，如果留空则使用 i18n 中的翻译
  usage:
-    "您的赞助将用于服务器维护、内容创作和功能开发，帮助我持续提供优质内容。", // 赞助用途说明
+    "您的赞助将用于内容创作，帮助我持续提供优质内容。", // 赞助用途说明
  // 是否显示赞助者列表
  showSponsorsList: true,
  // 是否在文章详情页底部显示赞助按钮
  showButtonInPost: true,

  // 赞助方式列表
  methods: [
    {
      name: "支付宝",
      icon: "fa6-brands:alipay",
      qrCode: "/assets/images/sponsor/alipay.png", // 收款码图片路径（需要放在 public 目录下）
      link: "",
      description: "使用 支付宝 扫码赞助",
      enabled: true,
    },
    {
      name: "微信",
      icon: "fa6-brands:weixin",
      qrCode: "/assets/images/sponsor/wechat.png", // 收款码图片路径
      link: "",
      description: "使用 微信 扫码赞助",
      enabled: true,
    },
-    {
-      name: "爱发电",
-      icon: "simple-icons:afdian",
-      qrCode: "",
-      link: "https://afdian.com/a/cuteleaf",
-      description: "通过 爱发电 进行赞助",
-      enabled: true,
-    },
-    {
-      name: "Github",
-      icon: "fa6-brands:github",
-      qrCode: "",
-      link: "https://github.com/CuteLeaf/Firefly",
-      description: "点个Star就是最大的支持",
-      enabled: true,
-    },
  ],

  // 赞助者列表（可选）
  sponsors: [
-    // 示例：已实名赞助者
-    {
-      name: "夏叶",
-      amount: "¥50",
-      date: "2025-10-01",
-      message: "感谢分享！",
-    },
-    // 示例：匿名赞助者
-    {
-      name: "匿名用户",
-      amount: "¥20",
-      date: "2025-10-01",
-    },
  ],
};
```

## 关于我

“关于我”页面就是博客里专门用来介绍“我是谁、为什么写这个博客、在做什么”的地方。

可在 `src/content/spec/about.md` 文件里修改“关于我”页面的内容。

我将该文件内容改为：

```diff lang="text" title="src/content/spec/about.md"
# 关于我 / About Me

-你好！我是 **夏叶** ，一个在数字世界中默默无闻的一片叶子。
+欢迎来到我的小角落。这里，主要是我写给自己看的一些文字和记录。很高兴你路过这里，并驻足阅读。
+
+我是 **xpfxzxc**。这个昵称很久前就开始使用了，但我忘记了这个昵称如何是取的，这个昵称可能没有什么含义吧。
+
+我是一个 98 后的听障人，不擅长言语沟通，头脑反应略慢，没创作灵感，平时喜欢独来独往、在网上冲浪。没有什么特长，唯一我比较懂的就是编程和游戏了，但在圈子里算是在底层水平，在日常上也不太拿得出手。我对编程曾充满热情，现在有点生疏，仍然“玩”得不太懂，但不想放弃。
+
+建立这个博客的初衷是我单纯地想试试部署好看的个人博客，还有记录以后学习到的技能知识。有时头脑里会有较多的想法，此时如果能够主动去梳理思路并记录下来，对当前和以后都会颇有收获。
+
+这里可能没有干货和指南，只有非常个人的、不成熟的想法和个人学习记录。如果你在我的文字里，找到了一丝共鸣，或者从中受到启发，或者从中成功解决某些疑惑，那将是我莫大的荣幸。
+
+欢迎你在想说话的时候，通过评论或邮件与我分享你的感受。我不一定会及时回复，但会认真阅读。

## 🛠️ 关于本站

-这个网站使用 **Astro** 框架构建，采用了 [Firefly](https://github.com/CuteLeaf/Firefly)模板
+这个网站使用 **Astro** 框架构建，采用了 [Firefly](https://github.com/CuteLeaf/Firefly) 主题。


**Firefly** 是一款基于 Astro 框架开发的清新美观且现代化个人博客主题，专为技术爱好者和内容创作者设计。该主题融合了现代 Web 技术栈，提供了丰富的功能模块和高度可定制的界面，让您能够轻松打造出专业且美观的个人博客网站。

-
-**🖥️在线预览： [Firefly - Demo site](https://firefly.cuteleaf.cn/)**
-
-**🏠我的博客： [https://blog.cuteleaf.cn](https://blog.cuteleaf.cn/)**
-
-**📝Firefly使用文档： [https://docs-firefly.cuteleaf.cn](https://docs-firefly.cuteleaf.cn/)**
-
-**⭐Firefly开源地址：https://github.com/CuteLeaf/Firefly** 
-
::github{repo="CuteLeaf/Firefly"}

-<img src="/assets/images/firefly.png" />
-
-

## 📫 联系方式

如果你想和我交流技术问题，分享有趣的想法，或者只是想打个招呼，欢迎通过以下方式联系我：

-* 💻 **GitHub**: [CuteLeaf](https://github.com/CuteLeaf)
-* ✉️ **Email**: [xiaye@msn.com](mailto:xiaye@msn.com)
+* 💻 **GitHub**：[xpfxzxc](https://github.com/xpfxzxc)
+* ✉️ **Email**：[xpfxzxc@gmail.com](mailto:xpfxzxc@gmail.com)

---

-*感谢你的来访！希望在这里能找到对你有用的内容。Firefly博客系统完全开源，如果喜欢的话，不妨给个GitHub点个Star ⭐ 支持一下！*
+*感谢你的来访！希望在这里能找到对你有用的内容。如果想感谢或者想支持我继续创作，可以访问我的赞助页面。*

```

## 广告

广告栏内容的相关配置在 `adConfig.ts` 文件中。如需启用广告栏组件，则需在 `sidebarConfig.ts` 文件中进行相应配置。与站点公告类似，广告内容不一定局限于“广告”形式，例如也可以用于引导访客前往赞助页面。

我将相关配置改成引导访客前往赞助页面：

```diff lang="typescript" title="src/config/adConfig.ts"
// ...
// 广告配置2 - 完整内容广告
export const adConfig2: AdConfig = {
  title: "支持博主",
  content:
-    "如果您觉得本站内容对您有帮助，欢迎支持我们的创作！您的支持是我们持续更新的动力。",
+    "如果您觉得本站内容对您有帮助，欢迎支持我的创作！您的支持将激励我持续提供优质内容。",
  image: {
    src: "/assets/images/d2.webp",
    alt: "支持博主",
-    link: "about/",
+    link: "/sponsor/",
    external: false,
  },
  link: {
    text: "支持一下",
-    url: "about/",
+    url: "/sponsor/",
    external: false,
  },
  closable: true,
  displayCount: -1,
  padding: {
    // all: "1rem",
  },
};
```

然后开启该广告栏组件：

```diff lang="typescript" title="src/config/sidebarConfig.ts"
{
  // 组件类型：广告栏组件 2
  type: "advertisement",
  // 是否启用该组件
-  enable: false,
+  enable: true
  // 组件显示顺序
  order: 7,
  // 组件位置："sticky" 表示粘性定位
  position: "sticky",
  // CSS 类名
  class: "onload-animation",
  // 动画延迟时间
  animationDelay: 350,
  // 配置ID：使用第二个广告配置
  configId: "ad2",
},
```

## 收尾

完成了这些配置，个人博客便焕然一新，颇具个人风格了。接下来即可将变动提交并推送至线上。在此过程中，最好遵循 **Git** 最佳实践中的**原子性提交**原则，即每个 Commit 只包含单一、完整的逻辑变更，目的清晰，以避免产生中间状态。

**元数据配置**：

目前，`siteConfig.ts` 文件混杂着多个模块的改动，不适合一股脑全提交。虽然可以“倒回去分步提交”，但是有更省力的办法：用 `git add -p <文件名>` 交互式分块暂存，将一个文件的多处改动拆开，分批提交。

Git 会逐块显示差异，并询问如何处理每一块，例如：`(1/5) Stage this hunk [y,n,q,a,d,j,J,g,/,s,e,p,?]?`。可以输入以下常用命令：

| 命令 | 含义 |
| --- | --- |
| `y` | 接受（暂存）当前块 |
| `n` | 跳过当前块（不暂存） |
| `s` | 将当前块进一步拆分成更小的块（如果可拆）
| `e` | 手动编辑当前块（高级用法，需熟悉 diff 格式） |
| `q` | 退出，不再处理后续块 |
| `?` | 显示帮助信息 |

```bash
git add -p src/config/siteConfig.ts
git commit -m "chore: 更新站点元数据（标题、描述、关键词）"
git add public/assets/images/favicon.ico
git commit -m "chore: 更新 Favicon 图标"
```

**站点 Logo 和名称**：

```bash
git add -p src/config/siteConfig.ts
git rm public/assets/images/LiuYingPure3.svg
git add public/assets/images/logo.ico
git commit -m "chore: 更新站点 Logo 和名称"
```

**个人基本资料**：

```bash
git add src/config/profileConfig.ts
git add public/assets/images/avatar.webp
git commit -m "feat: 完善个人基本资料（头像、名称、介绍、社交媒体链接）" -m "- 更新个人基本信息（名称、介绍）" -m "替换个人头像图片" -m "调整现有社交媒体链接" -m "新增两个社交媒体平台链接"
```

**站点公告**：

```bash
git add src/config/announcementConfig.ts
git commit -m "feat: 更新站点公告配置" -m "- 更新公告标题和内容文案" -m "- 设置为不可关闭的永久显示模式" -m "- 移除公告链接按钮功能""
```

**导航栏**：

```bash
git add src/config/navBarConfig.ts
git commit -m "feat: 更新导航栏" -m "- 调整现有导航链接地址" -m "- 新增两个导航链接按钮"
```

**背景壁纸**：

```bash
git add -p src/config/siteConfig.ts
git add public/assets/images/d1.webp
git add public/assets/images/m1.webp
git commit -m "feat: 完善背景壁纸显示效果" -m "- 替换桌面端和移动端背景壁纸图片资源" -m "- 调整横幅模式下图片位置和主副标题内容" -m "- 优化全屏壁纸模式下遮罩层模糊程度" -m "- 完善壁纸来源信息显示设置"
```

**主题色**：

```bash
git add -p src/config/siteConfig.ts
git commit -m "feat: 更新主题色配置" -m "- 调整主题色的颜色" -m "- 锁定主题色选择器，对访客隐藏"
```

**字体**：

```bash
git add src/config/fontConfig.ts
git commit -m "feat: 更新字体配置" -m "- 调整 font-family 字体栈" -m "- 引入新的 @font-face 字体规则" -m "- 替换默认字体风格"
```

**友链**：

```bash
git add src/config/friendsConfig.ts
git add src/content/spec/friends.md
git commit -m "feat: 更新友链页面内容" -m "- 修改友链页面介绍文本内容" -m "- 新增两个友链条目"
```

**追番**：

```bash
git add src/config/siteConfig.ts
git commit -m "chore: 更新 Bangumi 用户 ID"
```

**赞助**：

```bash
git add src/config/sponsorConfig.ts
git add public/assets/images/sponsor/alipay.png
git add public/assets/images/sponsor/wechat.png
git commit -m "chore: 更新赞助页面信息和支付码" -m "- 调整赞助说明内容" -m "- 更新赞助方式列表" -m "- 替换支付宝和微信支付二维码" -m "- 清空赞助者列表"
```

**关于我**：

```bash
git add src/content/spec/about.md
git commit -m "chore: 更新关于我页面内容"
```

**广告**：

```bash
git add src/config/adConfig.ts
git add src/config/sidebarConfig.ts
git add public/assets/images/d2.webp
git commit -m "feat: 启用赞助引导广告栏" -m "- 开启赞助引导广告栏组件显示" -m "- 更新引导文案内容" -m "- 调整图片和按钮链接指向赞助页面" -m "- 替换展示图片"
```

最后，将代码推送到远程仓库：

```bash
git push origin custom
```