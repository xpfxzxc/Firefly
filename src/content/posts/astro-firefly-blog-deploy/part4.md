---
title: 基于 Firefly 主题的 Astro 博客部署（四）：giscus 评论系统配置
published: 2025-11-24
description: "记录了自己在基于 Firefly 主题的 Astro 博客上配置启用 giscus 评论系统，并简单总结了该评论系统的部分流程。"
tags: ["博客部署", "Astro", "Firefly", "开源主题", "评论系统", "giscus"]
category: 实操记录
slug: astro-firefly-blog-deploy-part4
---

站点经过批量配置更新后，如今已颇具辨识度。尽管整体结构仍保留着 [**Firefly**](https://github.com/CuteLeaf/Firefly) 主题的影子，但最起码能让访客一眼将它与其他博客区分开来。

目前，访客在站内仅能通过点击链接跳转页面、阅读内容。尚缺少一个公开的交流渠道，让访客与访客、博主与访客之间能够直接对话，引入评论系统势在必行。虽然之前设置过 Email 地址、**GitHub** 链接等，但这些渠道不够直接，也缺乏公开讨论的氛围。要知道，有时评论的价值甚至超越文章本身，沉淀下来的评论也能为后来的访客提供宝贵的线索与回顾。

## 选择

回想我最初对博客部署的核心需求：快速开始、无需支付服务器和域名的定期费用、界面风格现代，外观精美、可定制化。这些需求也同样延伸到了对评论系统的考量上，并进一步考虑到第三方登录、数据所有权、浏览量统计等方面。

Firefly 主题内置了四种供选择使用的评论系统：[**Twikoo**](https://twikoo.js.org)、[**Waline**](https://waline.js.org)、[**giscus**](https://giscus.app)、[**Disqus**](https://disqus.com)。经过调研，得到下面对比结果：

| 需求 | Twikoo | Waline | giscus | Disqus |
| :---: | :---: | :---: | :---: | :---: |
| 快速开始 | ⭐⭐⭐ 快 | ⭐⭐⭐ 快 | ⭐⭐⭐⭐ 很快 | ⭐⭐⭐⭐⭐ 极快（注册即用） |
| 无需定期费用 | ⭐⭐⭐ 可完全免费 | ⭐⭐⭐ 可完全免费 | ⭐⭐⭐⭐⭐ 完全免费 | ⭐⭐ 免费版含广告，去广告/高级功能需付费 |
| 界面现代美观 | ⭐⭐⭐ 默认较简洁 | ⭐⭐⭐⭐ 默认较现代 | ⭐⭐⭐ 原生 GitHub 风格 | ⭐⭐ 默认较现代、杂乱，但含广告 |
| 可定制化 | ⭐⭐⭐⭐⭐ 高 | ⭐⭐⭐⭐⭐ 高 | ⭐⭐⭐ 有限 | ⭐⭐ 较低 |
| 第三方登录 | ⭐ 不支持，只需填写昵称和邮箱 | ⭐⭐⭐⭐ 支持国内外社交账号 | ⭐⭐ 仅支持 GitHub 登录 | ⭐⭐⭐⭐ 支持国外社交账号 |
| 数据所有权 | ⭐⭐⭐⭐ 完全自己掌握 | ⭐⭐⭐⭐ 完全自己掌握 | ⭐⭐⭐ 自己掌握数据在 GitHub 仓库中，公开透明 | ⭐⭐ 归属于 Disqus |
| 浏览量统计 | ⭐⭐⭐ 支持 | ⭐⭐⭐ 支持 | ⭐ 不支持 | ⭐⭐⭐⭐ 提供基础访问分析，但含广告追踪 | 

综上来看，可以给出选择依据了：

- 不选 Twikoo：如果不想自行部署或者注重身份识别
- 不选 Waline：如果不想自行部署或者不注重身份识别
- 不选 GitHub：如果希望完全自己掌控或者需要除 GitHub 以外的第三方登录方式
- 不选 Disqus：如果希望自己完全掌控或者无法接受页面中嵌入广告

对于刚才提出的需求，这四种评论系统其实都基本满足，但在逐一权衡后，我采用了排除法进行决策：

- Disqus：因免费版包含广告，首先排除
- Twikoo：希望强制评论者进行身份验证，因此排除
- Waline：虽然功能强大，但我对免费数据库的数据持久性和请求延迟存疑。相比之下，没有任何免费平台比 GitHub 更能让我对数据安全放心，因此忍痛割舍

最终，考虑到我已经将博客部署于 GitHub Pages，那就索性地用 giscus 好了。虽然浏览量统计的功能，我还是希望有的，但胜在数据安全与深度集成。若未来迁移到云平台上部署，届时再考虑切换至 Waline。

## 实操

按照 giscus 主页的说明一步一步地操作，并结合 Firefly 主题代码来修改就好。由于 Firefly 主题已经集成好评论系统，所以使用起来很简单。

### 原理

简单来说，giscus 利用 GitHub Discussions 作为评价系统的后端，通过 **GitHub App** 和前端嵌入脚本，在静态网站上实现动态评论功能。

下面是它的工作原理分解：

* 将 **GitHub Discussions** 作为评论系统的后端（需要手动在仓库设置里开启）
* 仓库维护者通过安装 [**giscus App**](https://github.com/apps/giscus)，授予它能读写指定的公开仓库的 Discussions 的权限
* 在前端借助 `<script>` 标签嵌入 giscus 提供的脚本并传入参数，作用是：
  - giscus 加载时会使用 [**GitHub Discussions 搜索 API**](https://docs.github.com/en/graphql/guides/using-the-graphql-api-for-discussions) 根据选定的映射方式（如 URL、`pathname`、`<title>` 等）来查找与当前页面关联的 discussion。如果找不到匹配的 discussion，giscus 就会在第一次有人留下评论或回应时自动创建一个 discussion
  - 动态加载评论界面
  - 向 giscus 服务发起请求，带上当前页面的标识
  - 将 discussion 的评论内容渲染到页面上
* 访客需要 GitHub 账号，按照 **OAuth** 流程登录，授予 giscus App 代表他发布评论的权限（不过从源码可知，实际是 giscus 前端代表访客发布评论的），因为 GitHub 的写操作 API（如创建评论）必须携带访客 OAuth token

由此可见，这过程依赖第三方服务（giscus.app）。由于它是开源的，所以也可以自建。

### 步骤

#### 1. 启用 GitHub Discussions

在 `<username>.github.io` （将 `<username>` 替换为 GitHub 用户名，下文同理）仓库页面下，点击顶部导航栏的 `Settings` → 向下滚动页面至 `Features` 部分 → 勾选 `Discussions` 选项，开启仓库的 Discussions 功能。

#### 2. 安装 giscus GitHub App

访问 [GitHub App - giscus](https://github.com/apps/giscus) → 点击页面右侧栏的 `Install` 按钮 → 选择 `Only select repositories` → 点击 `Select repositories` 下拉列表 → 选择 `<username>.github.io` 项 → 点击 `Install` 按钮 → 输入登录密码，确认权限。

#### 3. 修改配置文件

`src/config/commentConfig.ts` 文件存放着关于评论系统的配置。先配置启用 `giscus` 评论系统，然后依次设置 `repo`、`repoId`、`category`、`categoryId` 字段，其中 `category` 字段选择 `Announcements`（只有仓库的维护者和 giscus App 本身可以在“Announcements”分类中创建新的 discussion），其他字段根据代码注释去设置。建议先在 giscus 主页上配置下，再将配置的值填入到代码中。

我将文件内容改为：

```diff lang="typescript" title="src/config/commentConfig.ts"
import type { CommentConfig } from "../types/config";

export const commentConfig: CommentConfig = {
-  type: 'none', // 当前启用的评论系统类型: none, twikoo, waline, giscus, disqus，默认为none，即不启用评论系统。
+  type: 'giscus', // 当前启用的评论系统类型: none, twikoo, waline, giscus, disqus，默认为none，即不启用评论系统。
  // ...
  //giscus评论系统配置（还未测试）
  giscus: {
-    repo: 'CuteLeaf/Firefly', // 设置 Giscus 评论系统仓库
-    repoId: 'R_kgD2gfdFGd', // 设置 Giscus 评论系统仓库ID
-    category: 'General', // 设置 Giscus 评论系统分类
-    categoryId: 'DIC_kwDOKy9HOc4CegmW', // 设置 Giscus 评论系统分类ID
+    repo: 'xpfxzxc/xpfxzxc.github.io', // 设置 Giscus 评论系统仓库
+    repoId: 'R_kgDOQIvG_Q', // 设置 Giscus 评论系统仓库ID
+    category: 'Announcements', // 设置 Giscus 评论系统分类
+    categoryId: 'DIC_kwDOQIvG_c4Cxnv0', // 设置 Giscus 评论系统分类ID
    mapping: 'title', // 设置 Giscus 评论系统映射方式
    strict: '0', // 设置 Giscus 评论系统严格模式
    reactionsEnabled: '1', // 设置 Giscus 评论系统反应功能
    emitMetadata: '1', // 设置 Giscus 评论系统元数据
    inputPosition: 'top', // 设置 Giscus 评论系统输入位置
    theme: 'light', // 设置 Giscus 评论系统主题
    lang: 'zh-CN', // 设置 Giscus 评论系统语言
    loading: 'lazy', // 设置 Giscus 评论系统加载方式
  },
  // ...
};
```

4. 提交更改并推送至线上

```bash
git add src/config/commentConfig.ts
git commit -m "feat: 启用 giscus 评论系统" -m "- 启用评论功能，类型设置为 giscus" -m "- 配置个人 GitHub 仓库作为评论存储" -m "- 设置分类等交互选项"
git push origin custom
```

## 扩展内容：OAuth 2.0

在博客页面下，若想通过使用 API 向 GitHub 提交评论至相应的 discussion，必须携带 GitHub 账号登录凭证或者授权令牌。否则 GitHub 将拒绝该请求，这意味着无法匿名评论 —— 每一条评论都需以某一 GitHub 用户的身份发布。

从访客的角度来看，在第三方博客页面直接输入 GitHub 账号和密码，通常存在安全风险，一般访客会对此有所顾虑。此外，受浏览器**同源策略**的限制，博客网站无法直接获取到 GitHub 域下的凭证信息，哪怕访客当前已在 GitHub 上保持登录状态。

### 目的

OAuth 2.0 就是为了解决上述问题而生的！它允许**资源所有者**（访客）在不分享密码的情况下，允许**授权服务器**（GitHub）授权一个第三方应用（**客户端**，giscus App）有限地访问存储在另一个服务（**资源服务器**，GitHub）上的资源。

> [!NOTE]
> 虽说可以让博客站点成为类似 giscus 这样“第三方应用”的存在，从而不需要 giscus 服务，但是这增加了维护后端的负担。而且，访客是否愿意信任博客站点，这也是一个问题。

OAuth 2.0 里有 4 种授权模式，这里只讲解**授权码模式**，该模式是最安全、最常用，适用于有后端的 Web 应用。

### 授权码模式

- 流程：
  1. 用户访问客户端，客户端将用户重定向到授权服务器
  2. 用户在授权服务器上登录并同意授权
  3. 授权服务器将用户重定向回客户端事先指定的地址（回调地址），并在 URL 中带上一个授权码
  4. 客户端的后端服务器用这个授权码，连同自己的客户端 ID 和密钥，向授权服务器请求访问令牌
  5. 授权服务器验证通过后，返回访问令牌（和可选的刷新令牌）
- 优点：访问令牌不会暴露给前端浏览器，非常安全

> [!NOTE]
> 在实际过程中，通信时携带的数据，需查阅相关文档以确定哪些参数是必需或可选的。

### 例子

在静态博客站点中借助第三方 giscus App 实现在仓库的 Discussions 发布评论，由于静态博客站点本身不具备后端服务且未注册为 GitHub App，同时还需引入第三方 giscus App 作为中介，整个授权和发布流程会因此变得相对复杂。

下面将结合博客站点、giscus App 和 giscus 代码片段具体讲解整个过程，开始前有准备工作。

#### 将 giscus 注册为 GitHub App

（这步 giscus 已经做了）先部署 giscus，然后要在 [Register new GitHub App](https://github.com/settings/apps/new) 页面上将 giscus 注册为 GitHub App，并按照要求填入信息：

- `GitHub App name`
- `Description`（可选）
- `Homepage URL`
- `Callback URL`：使用 `https://[YOUR-DOMAIN-HERE]/api/oauth/authorized` 作为授权回调 URL，例如：`https://giscus.app/api/oauth/authorized`
- `Expire user authorization tokens`：不勾选，目前 giscus 不支持它
- `Request user authorization (OAuth) during installation`：不勾选
- Webhook 部分的 `Active`：不勾选
- `Repository permissions`：选择 `Discussions` 的 `Access: Read & write`

点击 `Create GitHub App` 按钮后，将 giscus 注册为 GitHub App，以后称呼它为 giscus App。

一旦创建完成，就要点击 `Generate a new client secret` 和 `Generate a private key` 按钮分别创建客户端密钥和私钥，其中私钥会自动被下载下来。

上面的 `Callback URL`、`App ID`、`Client ID`、`Client secret`、`Private key` 后面都会用到的。

#### 为仓库安装 giscus App

在目标仓库中完成该 GitHub App 的授权安装后，GitHub 会为此次安装分配一个唯一的 **installation ID**。giscus 服务端后续可凭此 ID 换取一个 **installation access token**，从而获得以 App 身份在仓库中创建“Announcements”类型 discussion 的权限：

1. giscus 服务端会用 App 的私钥生成一个 **JWT** 用于证明“我是这个 GitHub App”  
2. giscus 服务端接着携带该 `installation ID` 和 `JWT`，调用 GitHub API 请求安装令牌  
3. 经 GitHub 验证 JWT 后，服务端会得到一个 `installation access token`，这个令牌带有仓库级别的权限（比如 Discussions 的读写）  
4. giscus 服务端缓存它，等到需要的时候再使用

接着，启用该仓库的 Discussions 功能，并在前端页面插入脚本并配置好后，访客就可以正常使用 giscus 评论系统了。

#### 授权和使用流程

**第一步：博客站点引导访客至 GitHub 授权端点**  

当访客在博客文章页面里点击 giscus 界面上的 `使用 GitHub 登录` 按钮后，浏览器将跳转至 giscus 的授权请求端点。此端点 URL 中已通过 `redirect_url` 参数指定了回调地址，例如：

```text showLineNumbers=false
https://giscus.app/api/oauth/authorize?redirect_uri=http%3A%2F%2Flocalhost%3A4321%2Fposts%2Fastro-firefly-blog-deploy-part4%2F%23comments
```

这意味着，授权流程结束后，访客将被带回初始的文章页面（`http://localhost:4321/posts/astro-firefly-blog-deploy-part4/#comments`）。

giscus App 会处理该请求，根据源码：

```typescript title="giscus/pages/api/oauth/authorize.ts"
import type { NextApiRequest, NextApiResponse } from 'next';
import { encodeState } from '../../../lib/oauth/state';
import { env } from '../../../lib/variables';

const GITHUB_OAUTH_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';

export default async function OAuthAuthorizeApi(req: NextApiRequest, res: NextApiResponse) {
  const appReturnUrl = req.query.redirect_uri as string;

  if (!appReturnUrl) {
    res.status(400).json({ error: '`redirect_uri` is required.' });
    return;
  }

  const { client_id } = env;
  const proto = req.headers['x-forwarded-proto'] || 'http';
  const redirect_uri = `${proto}://${req.headers.host}/api/oauth/authorized`;
  const state = await encodeState(appReturnUrl, env.encryption_password);

  const oauthParams = new URLSearchParams({ client_id, redirect_uri, state });
  res.redirect(302, `${GITHUB_OAUTH_AUTHORIZE_URL}?${oauthParams}`);
}
```

giscus 服务端会立即构造一个特殊的 GitHub URL 并将访客的浏览器重定向过去。

例如，URL 和参数：

```text showLineNumbers=false
GET https://github.com/login/oauth/authorize?
  client_id=Iv1.c654bd032df6a55f&
  redirect_uri=https://giscus.app/api/oauth/authorized&
  state=032e2710f1484e164291ddferX/0OIIoT+b4Dsmy6hhD6QimL9cdx4EN2PZdmQGrLBwfCGbC5n6pEL9mJVYEGIiakJc8ZSd34wtSoxebcDhqV2IIryat1TK+D89AK37hQyi/tDvko5swfzlYgnlMZ2qOvNgZeFqM2/Bl64oJkyc+xo0OkVNB6r5vpA==
```

参数讲解：

- `client_id`：giscus App 的唯一标识符。这个就是在注册为 GitHub App 后得到的 `Client ID`
- `redirect_uri`：回调地址。这是将 giscus 注册为 GitHub App 时预先填写的 `Callback URL`。授权成功后，GitHub 会把访客（和授权码）送回这个地址。这是安全的关键，防止授权码被发送到任意地址
- `state`：一个随机的、不可猜测的字符串。从上面 giscus 源码片段可知，它将重定向地址（博客网页地址）进行了加密并作为 `state` 的值

**第二步：访客在 GitHub 上进行认证和授权**

1. 访客的浏览器被重定向到 `https://github.com/login/oauth/authorize?...`
2. 如果访客未登录 GitHub，会看到登录页面，访客需要输入 GitHub 的用户名和密码。<strong>注意：</strong>密码是输给 GitHub 的，博客站点完全看不到
3. 登录成功后，GitHub 会显示一个授权页面，询问访客：“Giscus by Giscus 希望获得以下许可...”，并列出请求的权限
4. 访客点击绿色的 `Authorize giscus` 按钮

> [!NOTE]
> 还有一些情况是：重定向后，需要从多个账号中选择；或者，之前已经授权过，不需要再授权。但不管怎么样，授权过程类似。

**第三步：GitHub 重定向回 giscus App 并携带授权码**

访客点击授权后，GitHub 的授权服务器会生成一个短期有效的授权码，然后将访客的浏览器重定向到 giscus App 预先注册的回调地址（与第一步中 giscus 服务端指定的 `redirect_uri` 参数一致），即 `https://giscus.app/api/oauth/authorized`。

URL 和参数：

```text showLineNumbers=false
GET https://giscus.app/api/oauth/authorized?
  code=604a74dcc85e661b7a9b&
  state=c036727482c11062ed961334%2FdS8DSACyyCYlAhLeDC1cK1jhxrjUGctAQQDiSm6mdevw1crmOPggFYjkPBH2cpuP5ZhHtuB5VFvmnYPJ3x6Fv%2B9YoynA667JiUnaHx6iaULJtOlH%2Bzodau0S4pVQq19p%2BigTYnhXZ%2BsyaHLhIin0rBX2w%2BeBflD9A%3D%3D
```

参数讲解：

- `code`：授权码。它是一个代表用户同意的凭证，但本身不能用来访问 API
- `state`：原样返回第一步中传来的 `state` 参数

**第四步：giscus App 用授权码向 GitHub 兑换访问令牌**

giscus App 在 `/api/oauth/authorized` 端点处理回调：

```typescript title="giscus/pages/api/oauth/authorized.ts"
import type { NextApiRequest, NextApiResponse } from 'next';
import { encodeState, decodeState } from '../../../lib/oauth/state';
import { env } from '../../../lib/variables';

const GITHUB_OAUTH_ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const TOKEN_VALIDITY_PERIOD = 1000 * 60 * 60 * 24 * 365; // 1 year;

export default async function OAuthAuthorizedApi(req: NextApiRequest, res: NextApiResponse) {
  const code = req.query.code as string;
  const state = req.query.state as string;
  const error = req.query.error as string;

  const { client_id, client_secret, encryption_password } = env;

  let appReturnUrl: string;
  try {
    appReturnUrl = await decodeState(state, encryption_password);
  } catch (err) {
    res.status(400).json({ error: err.message });
    return;
  }

  const returnUrl = new URL(appReturnUrl);

  if (error && error === 'access_denied') {
    res.redirect(302, returnUrl.href);
    return;
  }

  if (!code || !state) {
    res.status(400).json({ error: '`code` and `state` are required.' });
    return;
  }

  const init = {
    method: 'POST',
    body: new URLSearchParams({ client_id, client_secret, code, state }),
    headers: {
      Accept: 'application/json',
      'User-Agent': 'giscus',
    },
  };

  let accessToken: string;
  try {
    const response = await fetch(GITHUB_OAUTH_ACCESS_TOKEN_URL, init);
    if (response.ok) {
      const data = await response.json();
      accessToken = data.access_token;
    } else {
      throw new Error(`Access token response had status ${response.status}.`);
    }
  } catch (err) {
    res.status(503).json({ error: err.message });
    return;
  }

  const session = await encodeState(
    accessToken,
    encryption_password,
    Date.now() + TOKEN_VALIDITY_PERIOD,
  );
  returnUrl.searchParams.set('giscus', session);

  res.redirect(302, returnUrl.href);
}
```

giscus App 会解析和验证 `state` 参数，然后构造一个服务器对服务器的 POST 请求向 GitHub 请求访问令牌，请求体包含 `client_id`、`client_secret`、`code` 和 `state` 参数。

**第五步：GitHub 返回访问令牌给 giscus App**

GitHub 验证 `client_secret` 和 `code` 后，返回 JSON 数据。giscus App 从响应中提取出 `access_token`。

**第六步：giscus App 创建加密 Session 并重定向回博客站点**

giscus App 没有像传统 Web 应用那样用这个 token 直接为用户创建会话 Cookie，而是将 token 安全地“传回”给博客站点上的 giscus 前端组件。

它将得到的访问令牌加密成一个名为 `session` 的字符串，并将解密得到的 `appReturnUrl`（即博客文章页面的地址）在其 URL 参数后附加 `?giscus=<加密的session字符串>`，然后向访客的浏览器返回一个 302 重定向指令。

最终重定向 URL，例如：

```text showLineNumbers=false
GET http://localhost:4321/posts/astro-firefly-blog-deploy-part4/?
  giscus=84c57886f2d88be979c1674dQODpjiFTL2GxjTO2QRcnHEHvvyshy%2Bxf5iI6Re5SlXkrbo6o0MkqMMLyr8X8fL3zxlSvW3IFtr5OTbmJ%2FQN%2Fw%2BDmch0KKPwK4bViYUoeI5gtD1P5WNI8d5Xg08s%3D#comments
```

访客的浏览器此刻被带回了最初的博客文章页面，并且 URL 中携带了一个神秘的 `giscus` 参数。

**第七步：静态博客网页处理 giscus 回调参数**

当浏览器被重定向回后，嵌入在页面中的 giscus 客户端脚本（[client.ts](https://github.com/giscus/giscus/blob/main/client.ts)）开始工作。

1. 检测并存储 Session：

```typescript title="giscus/client.ts"
// Set up session and clear the session param on load
const url = new URL(location.href);
let session = url.searchParams.get('giscus') || '';
const savedSession = localStorage.getItem(GISCUS_SESSION_KEY);
url.searchParams.delete('giscus');
url.hash = '';
const cleanedLocation = url.toString();

if (session) {
  localStorage.setItem(GISCUS_SESSION_KEY, JSON.stringify(session));
  history.replaceState(undefined, document.title, cleanedLocation);
} else if (savedSession) {
  try {
    session = JSON.parse(savedSession);
  } catch (e) {
    localStorage.removeItem(GISCUS_SESSION_KEY);
    console.warn(`${formatError(e?.message)} Session has been cleared.`);
  }
}
```

加密的 `session` 字符串被安全地存储在浏览器 `localStorage` 中，URL 被清理干净。此时，前端持有了代表用户授权状态的凭证（加密的 session），但还无法直接使用它。

**第八步：giscus Widget Iframe 加载并传递 Session**

giscus 客户端脚本开始构造并加载评论组件的 Iframe。

1. 构造 widget 参数

```typescript title="giscus/client.ts"
const attributes = script.dataset;
const params: Record<string, string> = {};

params.origin = cleanedLocation;
params.session = session as string;
params.theme = attributes.theme as string;
params.reactionsEnabled = attributes.reactionsEnabled || '1';
params.emitMetadata = attributes.emitMetadata || '0';
params.inputPosition = attributes.inputPosition || 'bottom';
params.repo = attributes.repo as string;
params.repoId = attributes.repoId as string;
params.category = attributes.category || '';
params.categoryId = attributes.categoryId as string;
params.strict = attributes.strict || '0';
params.description = getMetaContent('description', true);
params.backLink = getMetaContent('giscus:backlink') || cleanedLocation;

switch (attributes.mapping) {
  case 'url':
    params.term = cleanedLocation;
    break;
  case 'title':
    params.term = document.title;
    break;
  case 'og:title':
    params.term = getMetaContent('title', true);
    break;
  case 'specific':
    params.term = attributes.term as string;
    break;
  case 'number':
    params.number = attributes.term as string;
    break;
  case 'pathname':
  default:
    params.term =
      location.pathname.length < 2
        ? 'index'
        : location.pathname.substring(1).replace(/\.\w+$/, '');
    break;
}

// Check anchor of the existing container and append it to origin URL
const existingContainer = document.querySelector('.giscus');
const id = existingContainer && existingContainer.id;
if (id) {
  params.origin = `${cleanedLocation}#${id}`;
}

// Set up iframe src and loading attribute
const locale = attributes.lang ? `/${attributes.lang}` : '';
const src = `${giscusOrigin}${locale}/widget?${new URLSearchParams(params)}`;
const loading = attributes.loading === 'lazy' ? 'lazy' : undefined;
```

最终生成的 Iframe URL：

```text showLineNumbers=false
https://giscus.app/zh-CN/widget?
  origin=http://localhost:4321/posts/astro-firefly-blog-deploy-part4/#comments&session=9217fcd7459b93e3e27c1e25V7QDChvHmxQVKInMCD9q7LmScNiJfdGOBFZalw4jOEKaUeEPkQV2pgryenES7rtkfn4u3n9deNbmgvgCPXpMb4n5QsySzFbOGounl/MNrSEd6gTuX5nGeK8j0Vw=&
  repo=xpfxzxc/xpfxzxc.github.io&
  repoId=R_kgDOQIvG_Q&
  category=Announcements&
  categoryId=DIC_kwDOQIvG_c4Cxnv0&
  term=基于 Firefly 主题的 Astro 博客部署（四）：giscus 评论系统配置 - 未来之蓝 | xpfxzxc 的个人博客&
  number=&
  strict=0&
  reactionsEnabled=1&
  emitMetadata=1&
  inputPosition=top&
  theme=light&
  description=记录了自己在基于 Firefly 主题的 Astro 博客上配置启用 giscus 评论系统，并简单总结了该评论系统的部分流程。&
  backLink=http://localhost:4321/posts/astro-firefly-blog-deploy-part4/
```

2. 创建并加载 Iframe：

```typescript title="giscus/client.ts"
// Set up iframe element
const iframeElement = document.createElement('iframe');
const iframeAttributes = {
  class: 'giscus-frame giscus-frame--loading',
  title: 'Comments',
  scrolling: 'no',
  allow: 'clipboard-write',
  src,
  loading,
};
Object.entries(iframeAttributes).forEach(
  ([key, value]) => value && iframeElement.setAttribute(key, value),
);
```

iframe 开始加载，向 `giscus.app/widget` 发起请求，并带上了所有配置参数和加密的 `session`。

**第九步：giscus Widget 服务端解密 Session 获取 Token**

当 iframe 加载 `https://giscus.app/widget?...` 时，由 **Next.js** 的 `getServerSideProps` 服务端处理。

1. 服务端接收参数：

```tsx title="giscus/pages/widget.tsx"
const session = (query.session as string) || '';
const repo = (query.repo as string) || '';
// ... 接收其他参数
```

2. 解密 Session 获取 Access Token：

```tsx title="giscus/pages/widget.tsx"
const { encryption_password } = env;
const token = await decodeState(session, encryption_password)
  .catch(() => getAppAccessToken(repo))
  .catch(() => '');
```

3. 服务端渲染 Widget：

* 使用获取到的 `token`，服务端可以调用 GitHub API 获取评论数据、用户信息等
* 将数据作为 props 传递给 React 组件，渲染出包含评论列表和评论框的完整 UI
* 服务端会设置重要的 CSP 头，确保 iframe 只能被授权的站点嵌入

**第十步：前端 Token 的安全使用与消息通信**

1. Token 不暴露给父页面

解密出的真实 Access Token 仅存在于 giscus App 和它返回的 Widget 页面上下文中。Token 永远不会发送回博客站点的父页面脚本，从而避免了潜在的前端安全风险。

2. 基于 postMessage 的通信

当访客在 Iframe 的评论框中发表评论时，<u>iframe 内部的 giscus 代码会直接使用它拥有的 Token 去调用 GitHub API*</u>。

iframe 与父页面之间通过 `postMessage` 进行安全的跨域通信，仅传递 UI 状态，绝不传递 Access Token。

```typescript title="giscus/client.ts"
// Listen to messages
window.addEventListener('message', (event) => {
  if (event.origin !== giscusOrigin) return;

  const { data } = event;
  if (!(typeof data === 'object' && data.giscus)) return;

  if (data.giscus.resizeHeight) {
    iframeElement.style.height = `${data.giscus.resizeHeight}px`;
  }

  if (data.giscus.signOut) {
    localStorage.removeItem(GISCUS_SESSION_KEY);
    console.log(`[giscus] User has logged out. Session has been cleared.`);
    signOut();
    return;
  }
  // ...
})
```

**第十一步：用户状态维持与登出**

只要 localStorage 中的加密 `session` 不被清除，访客下次访问博客站点时，giscus 客户端会自动从 localStorage 读取 `session` 并传递给 Widget，让访客保持登录状态。

当在 Widget 中点击登出时，iframe 会通过 `postMessage` 发送一个 `signOut` 指令。博客文章页面的 giscus 客户端收到后，会重置 iframe 的 `src`（不带 session），强制重新加载为未登录状态，同时清理本地存储：

```typescript title="giscus/client.ts"
function signOut() {
  delete params.session;
  const src = `${giscusOrigin}${locale}/widget?${new URLSearchParams(params)}`;
  iframeElement.src = src; // Force reload
}
```
