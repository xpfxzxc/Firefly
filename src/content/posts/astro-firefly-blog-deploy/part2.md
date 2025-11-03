---
title: 基于 Firefly 主题的 Astro 博客部署（二）：文章发布
published: 2025-11-03
description: "记录了自己在基于 Firefly 主题的 Astro 博客上，对文章文件各要素的探索与简单总结，并接触到 Front matter 和 Markdown 扩展语法。"
tags: ["博客部署", "Astro", "Firefly", "开源主题", "Front matter", "Markdown"]
category: 实操记录
slug: astro-firefly-blog-deploy-part2
---

在成功将博客站点部署到 **GitHub Pages** 上后，我打算暂不修改博客的个人资料（如个人名称、头像、介绍、公告、背景图等），而是先撰写文章再发布，所以首先研究一下这部分。

## 探索

在博客主页中可以看到，刚部署后的博客自带了几篇示例文章。这些示例文章是 [**Firefly**](https://github.com/CuteLeaf/Firefly) 主题作者特意留下的，里面讲解了在撰写文章时可以用的 **Markdown** 语法。

### 文章位置

随便截取其中一篇示例文章中的几个字，然后在 **VSCode** 中按快捷键 `Ctrl+Shift+F` 或点击左侧栏 🔍 打开左侧栏的`搜索栏`，将几个字粘贴到`搜索框`中，很快就能够在 VSCode 左侧看见示例文章在项目中的具体位置：在 `src/content/posts` 目录下。

该目录下存放了所有文章，文章也可以存放在子目录中。文章在 `src/content/posts` 目录下的相对路径决定其最终的 URL。例如，文件 `src/content/posts/firefly/hello-world.md` 对应的访问 URL 为：`https://<username>.github.io/posts/firefly/hello-world`（`<username>` 需替换成 **GitHub** 用户名，下文同理）。

> [!TIP]
> 创建子目录可以更好地组织文章和资源。

### 文章组成

每个文章文件的内容由两部分组成：
- **元数据**：位于文章文件的开头，为 Markdown 文件本身提供了结构化信息（**YAML** 格式），由一对 `---` 分隔符包裹着
- **文章主体**：Markdown 格式的正文内容，紧接在元数据下方

### 元数据

从各个示例文章文件里，可以总结出元数据中可使用的字段：

- `title`（**必填**）：文章标题
- `published`（**必填**）：文章发布日期，日期格式 `YYYY-MM-DD`
- `updated`：文章的最后一次更新日期，日期格式 `YYYY-MM-DD`
- `pinned`：将文章置顶在文章列表顶部
- `description`：文章的简短描述，显示在文章列表里
- `image`：文章封面图片路径，有三种格式：
  - 以 `http` 或 `https` 开头：网络图片
  - 以 `/` 开头：`public` 目录下的图片
  - 不带任何前缀：相对于 Markdown 文件的路径
- `tags`：文章标签，字符串数组格式，例如：`["技术", "随笔"]`
- `category`：文章分类
- `licenseName`：文章内容的许可协议的显示名称
- `licenseUrl`：文章内容的许可协议 URL
- `author`：文章作者
- `sourceLink`：文章内容的来源链接
- `draft`：将文章标记为草稿。设为 `true` 后，文章仅在开发环境下可见，不会包含在最终发布的网站中
- `slug`：自定义文章 URL 的末尾路径。如果未设置，将默认使用文章在 `posts` 目录下的相对路径（不含 `.md` 扩展名）作为路径
- `lang`：仅当文章语言与 `config.ts` 文件中的网站语言不同时需要设置

字段的值即为该行冒号（：）之后的所有内容，因此通常无需使用引号。

以下是一篇示例文章中的片段：

```markdown title="src/content/posts/guide/index.md"
---
title: Firefly 简单使用指南
published: 2025-10-11
pinned: true
description: "如何使用 Firefly 博客模板。"
image: "./cover.webp"
tags: ["Firefly", "博客", "Markdown", "使用指南"]
category: 博客指南
draft: true
---

这个博客模板是基于 [Astro](https://astro.build/) 构建的。对于本指南中未提及的内容，您可以在 [Astro 文档](https://docs.astro.build/) 中找到答案。
```

## 实操

了解了以上信息后，就可以开始撰写文章并发布了。不过，我打算先将自带的示例文章标记为草稿，保留而不是删除这些示例文章。这样，如果以后在撰写文章的过程中，一时想不起元数据或 Markdown 语法，那么可以在这些示例文章中查阅。

### 步骤

#### 1. 标记示例文章为草稿

用 VSCode 打开本地项目，手动将在 `src/content/posts` 目录下的所有示例文章文件中元数据里的 `draft: false` 改为 `draft: true`。

接着在项目目录下运行：

```bash
git add .
git commit -m "chore: 标记自带的文章为草稿"
```

#### 2. 撰写文章

注意到项目目录下的 `package.json` 文件里有可执行的脚本：

```json title="package.json"
  "scripts": {
    "new-post": "node scripts/new-post.js"
  }
```

打开 `scripts/new-post.js` 文件，研究代码后知道：它接收文件名参数，并在 `src/content/posts` 目录下生成仅包含元数据模板的文章文件。

在项目目录下运行：
```bash
pnpm run new-post astro-firefly-blog-deploy/part1.md
```

这将在 `src/content/posts` 目录下创建子目录 `astro-firefly-blog-deploy`，并在该子目录下创建文章文件 `part1.md`。这文章文件包含着初始元数据模板：

```markdown title="src/content/posts/astro-firefly-blog-deploy/part1.md"
---
title: part1.md
published: 2025-10-30
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: ''
---

```

通过 URL 路径 `/posts/astro-firefly-blog-deploy/part1` 访问到该文章。

为了避免使用嵌套过多的 URL 子路径，添加 `slug: astro-firefly-blog-deploy-part1` 到元数据块里。这样，可以通过 URL 路径 `/posts/astro-firefly-blog-deploy-part1` 访问到该文章。

#### 3. 发布文章

修改元数据，并撰写文章主体后，就可以将文章发布出去了。

在项目目录下运行：

```bash
git add .
git commit -m "feat: 添加文章 '基于 Firefly 主题的 Astro 博客部署（一）：从零到 GitHub Pages'"
git push origin custom
```

## 扩展内容：Front Matter

在与 AI 沟通元数据相关内容的时候，注意到 AI 对这些元数据的格式和使用的单词颇为熟悉。经过深入询问才知道：其实前面所说的元数据有个标准名称叫做 **Front Matter**。

### 定义

Front Matter 是位于文件（通常是 Markdown 或 **HTML** 文件）顶部区域的一段特定格式（通常是 YAML 格式）的代码块，文件正文就写在这个 Front Matter 块的下方。

### 作用

用于为文章或页面定义元数据，告知静态网站生成器如何处理这些文件：

- 内容和页面分离：无需改动模板代码，就能通过简单的键值对控制每个页面的行为和展示方式
- 驱动网站生成
  - 为文章排序（根据 `date`）
  - 生成标签页和分类页（根据 `tags` 和 `category`）
  - 在列表中显示文章标题、摘要和封面（根据 `title`、`description` 和 `image`）
- 控制构建行为：像 `draft: true` 这样的键值对告知生成器：“这篇文章是草稿，在正式构建时请忽略它” 

## 扩展内容：从文章文件到文章展示

已经知道 Firefly 主题项目里 `src/content/posts` 目录存放着文章内容。在构建静态站点时，Astro 会为非草稿文章逐一生成对应的 HTML 页面和路由。要进一步了解这个过程是如何在代码中体现的，就需要对 Astro 框架的相关知识有所了解。

### 官方文档相关资料

- [页面](https://docs.astro.build/en/basics/astro-pages/)
- [路由](https://docs.astro.build/en/guides/routing/)
- [组件](https://docs.astro.build/en/basics/astro-components/)
- [内容集合](https://docs.astro.build/en/guides/content-collections/)
- [模板表达式参考](https://docs.astro.build/en/reference/astro-syntax/)
- [旧版：v2.0 内容集合 API](https://docs.astro.build/en/guides/upgrade-to/v5/#legacy-v20-content-collections-api)

### 解析项目代码

接下来，将结合 Astro 的相关知识点，来解析项目代码。

#### 页面文件

`src/pages` 目录下的文件（支持 `.astro`、`.ts` 等格式）会被 Astro 自动识别为**页面**。

下面展示了项目 `src/pages` 目录的实际结构，其中的每一个文件都对应一个或多个页面：

```text title="src/pages 目录"
src/pages/
├── 404.astro
├── [...page].astro
├── about.astro
├── anime.astro
├── archive.astro
├── friends.astro
├── og/
│   └── [...slug].png.ts
├── posts/
│   └── [...slug].astro
├── robots.txt.ts
├── rss.astro
└── rss.xml.ts
```

#### 静态路由

Astro 使用基于文件的路由，根据项目 `src/pages` 目录下的文件结构来构建链接，自动将它们作为网站页面。

这意味着，虽然 Astro 项目没有单独的路由配置，但依然可以通过页面文件在 `src/pages` 目录中的路径推断出最终生成的路由。例如：

```text
mysite.com/about -> src/pages/about.astro
mysite.com/404   -> src/pages/404.astro
```

注：像 `[...slug].astro` 这样采用特殊命名的页面文件属于**动态路由**，不属于**静态路由**的范畴。

#### 组件脚本

以 `.astro` 为后缀的文件是 Astro 组件，每个 Astro 组件由**组件脚本**和**组件模板**两部分组成。

Astro 使用代码围栏 `---` 来识别组件脚本部分。虽然这种语法形式与 Front Matter 相似，但是两者作用不同：组件脚本内编写的是 **TypeScript** 代码，而非元数据。

后续会提到组件脚本中的一些作用和组件模板的一些语法。

#### 动态路由

类似 `[...slug].astro` 这样文件名中包含方括号的 Astro 组件用于实现动态路由。这类文件根据传入的动态参数，将文件名内方括号对应的部分替换为具体的参数值，生成对应的多个路由和匹配页面。

例如，对于 `src/pages/posts/[category]/[post].astro` 文件，当传入参数 `{ category: 'demo', post: 'hello-world' }` 时，将会生成如下路由：

```text
mysite.com/pages/posts/demo/hello-world -> src/pages/posts/[category]/[post].astro
```

**剩余参数**（例如：`[...slug]`）可以匹配任何深度的文件路径。

项目中 `src/pages/posts` 目录下的 `[...slug].astro` 文件，自然地令人联想到文章页面的生成和路由跟这页面文件有关，且动态路由参数的值与 `slug` 的值有关。

在**静态站点生成**模式下，因为必须在构建时确定所有路由。所以，在组件的脚本部分中，需要通过导出 `getStaticPaths()` 函数来指定所有可能的参数组合。该函数返回一个对象数组，其中每个对象的 `param` 字段定义了 `slug` 参数的具体取值。

```astro title="src/pages/posts/[...slug].astro"
// ...
export async function getStaticPaths() {
  const blogEntries = await getSortedPosts();
  return blogEntries.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}
// ...
```

这代码片段对应了之前提到的：

- 通过修改文章元数据里的 `slug` 字段值，能够更改文章的访问路径
- 组件脚本的作用之一是通过导出特定函数，向框架提供所需信息

#### 内容集合

根据前面的分析，文章内容存储在 `src/pages` 目录之外，这意味着默认情况下不会为内容生成页面和路由。文章页面的生成好像跟 `src/content/posts` 目录无关。那么，Astro 是如何定位文章文件、并为每篇文章生成对应的页面和路由的呢？

答案是通过**内容集合**。通过将 `src/content/posts` 目录定义为内容集合，让 Astro 统一管理其中的内容，每篇博客文章都作为该集合中的一个条目。

Astro 会自动扫描 `src/content` 目录下的所有子目录，将每个子目录识别为一个独立的内容集合。通过在 `src/content` 目录下添加 `config.ts` 文件，可以定义 **Schema** 来规范集合中内容的 Front Matter 或条目数据，这些 Schema 会通过 **Zod** 进行数据验证，确保数据格式的一致性。

项目中 `src/content/config.ts` 文件内容如下：

```ts title="src/content/config.ts"
import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		published: z.date(),
		updated: z.date().optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(""),
		image: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		category: z.string().optional().nullable().default(""),
		lang: z.string().optional().default(""),
		pinned: z.boolean().optional().default(false),
		author: z.string().optional().default(""),
		sourceLink: z.string().optional().default(""),
		licenseName: z.string().optional().default(""),
		licenseUrl: z.string().optional().default(""),

		/* Page encryption fields */
		encrypted: z.boolean().optional().default(false),
		password: z.string().optional().default(""),

		series: z.string().optional(),

		/* For internal use */
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
	}),
});
const specCollection = defineCollection({
	schema: z.object({}),
});
export const collections = {
	posts: postsCollection,
	spec: specCollection,
};
```

Astro 提供了辅助函数 `getCollection()`，用于获取指定集合的全部内容，并以数组形式返回所有条目。

在 `src/pages/posts/[...slug].astro` 文件中，通过调用了 `getSortedPosts()` 函数间接使用了 `getCollection()` 函数，最终获得了经过排序的博客文章数组。

以下是第一篇博客文章的条目结构：

```js
{
  id: 'astro-firefly-blog-deploy/part1.md',
  data: {
    title: '基于 Firefly 主题的 Astro 博客部署（一）：从零到 GitHub Pages',
    published: 2025-10-29T00:00:00.000Z,
    draft: false,
    description: '记录了自己是如何使用开源的 Firefly 主题，在 GitHub Pages 上从零开始部署基于 Astro 的个人博客。',
    image: '',
    tags: [
      '博客部署',
      'Astro',
      'Firefly',
      '开源主题',
      'GitHub Pages',
      'GitHub Actions',
      'Git'
    ],
    category: '实操记录',
    lang: '',
    pinned: false,
    author: '',
    sourceLink: '',
    licenseName: '',
    licenseUrl: '',
    encrypted: false,
    password: '',
    prevTitle: '',
    prevSlug: '',
    nextTitle: '',
    nextSlug: ''
  },
  body: '## 前言\r\n' +
    '\r\n' +
    '...',
  filePath: 'src/content/posts/astro-firefly-blog-deploy/part1.md',
  digest: '474c5b5ac94b1108',
  rendered: {
    html: '<section><h2 id="前言">前言<a class="anchor" href="#前言">....',
    metadata: {
      headings: [Array],
      localImagePaths: [],
      remoteImagePaths: [],
      frontmatter: [Object],
      imagePaths: []
    }
  },
  collection: 'posts',
  slug: 'astro-firefly-blog-deploy-part1',
  render: [Function: render]
}
```

观察上面的条目可以发现，虽然文章文件路径为 `src/content/posts/astro-firefly-blog-deploy/part1.md`，但其 `slug` 字段的值为 `astro-firefly-blog-deploy-part1`。值得注意的是，尽管在 `src/content/config.ts` 文件中的 Scheme 中并未定义 `slug` 字段，但仍然成功获取到了文章 Front Matter 中设置的 `slug` 值。

由于 `slug` 字段与 `data` 字段处于同一层级，猜测 Astro 会自动提取 Front Matter 中的 `slug` 字段值。这点可以通过检查其他未设置 `slug` 值的文章条目，观察其行为差异来验证。

在动态路由的实现中，通过在组件脚本中导出 `getStaticPaths()` 函数，其中该函数返回包含 `params` 字段的对象数组，每个 `params` 对象都包含一个 `slug` 字段。这意味着，通过修改文章 Front Matter 中的 `slug` 值，能够控制文章最终生成的访问路径。

> [!NOTE]
> 在撰写本文章的时候，虽然 Firefly 主题使用的 Astro 版本是 `5.15.3`，但是它使用的内容集合 API 是旧版的。Astro 5 引入了内容层 API 用于替代旧的版本 API。例如，在 Astro 5 中，要定义集合，必须在项目中创建 `src/content.config.ts` 文件，且在使用 `defineCollection()` 函数的时候必须配置 `loader` 用于加载数据源。再比如，渲染方法 `entry.render()` 被 `render(entry)` 函数取代。如果在项目里 `src/content/config.ts` 文件中强行添加 `loader: glob({ ... })`，也就启用了 Astro 5 的新内容层 API，这导致项目里 `entry.render()` 调用失败。

#### 变量注入

根据前面的分析，文章条目对象的 `data` 字段中存储着文章元数据。

组件脚本的另一个重要作用是创建可在模板中使用的变量。这些变量通过 Astro 的组件模板语法在组件模板中被引用。

具体实现的过程如下：将文章条目对象通过 `getStaticPaths()` 函数返回对象的 `props` 字段传入后，可以在组件脚本里通过 `Astro.props` 获取该对象，并基于其声明变量。随后，可以使用类似 JSX 语法在组件模板中使用。

通过在组件模板中使用组件脚本中定义的数据和值，最终生成动态创建的 HTML：

```astro title="src/pages/posts/[...slug].astro"
// ...
export async function getStaticPaths() {
  const blogEntries = await getSortedPosts();
  return blogEntries.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

const { entry } = Astro.props;
// ...

---
<MainGridLayout
  banner={entry.data.image}
  title={entry.data.title}
  description={entry.data.description}
  lang={entry.data.lang}
  setOGTypeArticle={true}
  postSlug={entry.slug}
  headings={headings}
>
<!-- ... -->
</MainGridLayout>
```
