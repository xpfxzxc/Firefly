---
title: 基于 Firefly 主题的 Astro 博客部署（一）：从零到 GitHub Pages
published: 2025-10-29
description: "记录了自己是如何使用开源的 Firefly 主题，在 GitHub Pages 上从零开始部署基于 Astro 的个人博客。"
tags: ["博客部署", "Astro", "Firefly", "开源主题", "GitHub Pages", "GitHub Actions", "Git"]
category: 实操记录
slug: astro-firefly-blog-deploy-part1
---

## 前言

前几天，我像平时一样在网站 [**LINUX DO**](https://linux.do/) 上逛帖子，偶然看到有人开源了一个名为 **Firefly** 的博客主题模板。在查看了主题的预览效果图并访问了演示站点后，我认为它设计精致、外观美观，且集成了众多的实用功能。

::github{repo="CuteLeaf/Firefly"}

### 回顾

我回顾了下过去的几年经历：

- 学过不少编程知识，但大部分现在都忘了
- 曾经有过主动总结知识的想法，但苦于不知将记录存放到哪里
- 曾经有过搭建个人博客的想法，但一直未付诸实践，甚至觉得没必要
- 今年频繁与 AI 交流，许多问题反复提问，相关知识点也被反复提及，但我仍未记住；相关问题和回答分散到各网站上，不方便去检索

### 需求

想了想，现在是时候去试着部署个人博客玩玩了！我的需求很简单：

- 快速开始，且可定制化
- 界面风格现代，外观精美
- 无需支付服务器和域名的费用
- 不想太多人关注我的博客
- 不想在不知名的网站上写博客
- 能够获取主题更新
- 以后能为主题贡献代码

## 平台选择

根据需求，与 AI 沟通并查阅相关资料后，我觉得可以借助该开源项目在 **GitHub Pages** 上部署个人博客网站。

我进行了以下几方面的考虑，最终选择将 GitHub Pages 作为博客托管平台。

### 完全免费

GitHub Pages 对公开仓库免费提供静态网站托管服务，无需支付服务器或流量费用。我不用再操心服务器域名的费用，同时也让网站启用了 **HTTPS**。

### 长期稳定

近几年，伴随大语言模型的冲击，问答社区、博客等网站，比如：**CSDN**、**简书**、**StackOverflow** 等网站迅速走向衰弱。然而，**GitHub** 作为代码托管平台反而越来越火。从长远来看，GitHub 会倒闭的可能性极低。

### 与 GitHub 无缝集成

博客网站、博客内容以文件以代码形式存在，天然支持版本控制。借助 GitHub 页面 UI 和 **Git**，可以很好地处理好各方的远程仓库和本地仓库的版本控制。GitHub 自带的 **Discussion** 又能免费地作为博客文章的讨论区。

### 部署简单，可自动化

只需将静态文件推送到远程仓库指定的分支，GitHub 就会自动构建并发布。更进一步，允许借助 **GitHub Actions** 自定义自动化流程。

## 实操

我打算先让博客上线运行，之后再逐步调整。

### 思路

作为博客网站，最重要的是展示博客文章内容。博客文章内容相对稳定，除非博主更新文章，不然用户反复刷新网页，网页的内容也不会变化。用户通常是通过点击链接，从一个页面跳转到另一个页面，几乎不需要再进行额外的复杂交互。

[**Astro**](https://astro.build/) 作为静态站点生成器，构建时生成的 **HTML** 文件可直接放到免费的托管平台上运行，不需要服务器。生成的网页不带多余的 **JavaScript**（可以按需加载），加载速度飞快，对 **SEO** 友好。由此可见，Astro 很适配我的需求。

关于仓库的版本控制和管理：

- 我想能轻松拉取原 Firefly 代码的更改，所以需要先 `fork` 一份到我的仓库。
- 我想能定制化代码、发表博客文章，所以需要 `clone` 到本地仓库。
- 我想能选择性地获取原 Firefly 代码的更新、定制化代码、发表博客内容，所以需要新建分支 `custom`。
- 我想以后能贡献代码给原 Firefly，所以不能改动主分支 `master`。
- 我想将 `https://<username>.github.io` 作为我的博客主页，所以我需要新建仓库 `<username>.github.io`（将 `<username>` 替换为 GitHub 用户名，下文同理）。
- 我想让我对博客网站的更改，能自动被推送到线上，所以我需要在我的 Fork 仓库配置一个 GitHub Actions 工作流：每当向我的 Fork 仓库推送代码时，GitHub Actions 会自动构建静态网站，并将生成的文件推送到 `<username>.github.io` 仓库，从而更新线上站点。

思路理清了后，就开始动手实操了。

### 步骤

#### 1. 创建仓库 `<username>.github.io`

在创建仓库页面中，依次填入以下内容：

- `Repository name`：`<username>.github.io`
- `Description`：`Personal blog website hosted on GitHub Pages`

直接点击 `Create Repository` 按钮创建仓库，无需调整其他选项。

#### 2. `Fork` 原项目到我的仓库

打开项目 [**Firefly**](https://github.com/CuteLeaf/Firefly) 主页，点击页面右上角的 `Fork` 按钮，无需修改任何选项，直接点击 `Create fork` 按钮即可。

> [!NOTE]
> 原项目使用 `master` 作为默认分支，而非现在常见的 `main`。

#### 3. 将我的 Fork 仓库 `clone` 到本地

在项目目录下运行：

```bash
git clone git@github.com:<username>/Firefly.git
code Firefly
```

这将用 **VSCode** 打开刚拉取下来的项目。

#### 4. 在本地仓库创建并切换到 `custom` 分支

在项目目录下运行：

```bash
git branch custom
git checkout custom
```

#### 5. 禁用会报错的 workflow 文件

在实操过程中，我发现 `.github/workflows` 目录下工作流文件 `biome.yml` 和 `build.yml` 运行时会报错。考虑到后续可能需要修改，暂不删除，而是通过在文件名末尾添加 `.disabled` 后缀来禁用它们。

#### 6. 修改 workflow 文件以自动部署到另一个仓库

根据之前的思路：每当接收到推送事件时，自动构建静态网站，并将生成的文件推送到 `<username>.github.io` 仓库。

需要修改 `.github/workflows` 目录下的 `deploy.yml` 文件：

```diff title="deploy.yml" lang="yaml"
name: Deploy to Pages Branch

on:
-  # 每次推送到 `main` 分支时触发这个"工作流程"
-  # 如果你使用了别的分支名，请按需将 `main` 替换成你的分支名
+  # 每次推送到 `custom` 分支时触发这个"工作流程"
  push:
-    branches: [ main ]
+    branches: [ custom ]
  # 允许你在 GitHub 上的 Actions 标签中手动触发此"工作流程"
  workflow_dispatch:

# 需要写入权限来推送到pages分支
permissions:
  contents: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout your repository using git
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9.14.4
          run_install: false
          
      - name: Install dependencies
        run: pnpm install --no-frozen-lockfile
      
      - name: Build site
        run: pnpm run build
      
      - name: Deploy to pages branch
        uses: JamesIves/github-pages-deploy-action@v4
        with:
-          branch: pages # 部署到pages分支
+          token: ${{ secrets.GH_PAT }} # 需要在仓库的Settings->Secrets and variables->Actions中添加GH_PAT，该Token需要有写入权限
+          repository-name: <username>/<username>.github.io # 你的GitHub Pages仓库名称
+          branch: main # 部署到custom分支
          folder: dist # Astro默认构建输出目录
          clean: true # 清理目标分支中的旧文件
```

#### 7. 创建 **PAT**

点击 GitHub 账号右上角头像 → 选择 `Settings` → 左侧边栏点击 `Developer settings` → 点击 `Personal access tokens` → 选择 `Fine-grained tokens` → 点击右侧 `Generate new token`。

在创建页面中，依次填写以下内容：

- `Token name`： 为令牌命名（如：`blog-deploy`）
- `Expiration`： 设置过期时间（如：`90 days`）
- `Repository access`：选择 `Only select repositories`，并仅勾选 `<username>.github.io`
- `Permissions`：点击 `Add permissions`，添加以下三项权限：
  - `Contents` → 设为 `Read and write`（用于更改仓库内容）
  - `Pages` → 设为 `Read and write`（用于部署 GitHub Pages）
  - `Metadata` → 保持默认（`Read-only`，自动包含）

这样可避免生成的令牌可访问的仓库范围过广或权限过大。

点击 `Generate token` 按钮，并记录下生成的令牌。

#### 8. 创建环境变量

在我的 Fork 仓库页面，点击顶部导航栏的 `Settings` → 左侧边栏点击 `Secrets and variables` → 选择下拉项 `Actions` → 点击右侧 `New repository secret` 按钮。

在创建页面中，依次填写以下内容：

- `Name`：`GH_PAT`
- `Secret`：粘贴刚才保存的令牌

点击 `Add secret` 按钮。

#### 9. 修改部署地址

根据 Astro 官方文档里的[部署指南](https://docs.astro.build/en/guides/deploy/github/)，需要将 `astro.config.mjs` 文件里的 `site` 改成 GitHub Pages 部署地址：

```diff title="astro.config.mjs" lang="js"
export default defineConfig({
-    site: "https://demo-firefly.netlify.app/",
+    site: "https://<username>.github.io",
})
```

#### 10. 添加 `.nojekyll` 文件

在使用 Astro 构建项目时，Astro 会在 `dist` 输出目录中生成一个 `_astro` 文件夹，其中包含 JavaScript 代码和静态资源。

GitHub Pages 对于基于分支自动构建的方式，会默认启用 **Jekyll** 构建引擎，而 Jekyll 会自动忽略所有以下划线 `_` 开头的文件和目录。

因此，当基于分支把 Astro 构建出的 `dist` 目录部署到 GitHub Pages 时，`_astro` 目录会被 Jekyll 忽略，不会被发布，这导致网页显示不正常，功能异常。

解决办法很简单，在部署目录 `dist` 添加一个名为 `.nojekyll` 的空文件，用于告诉 GitHub Pages：不要用 Jekyll 处理这个站点。

实际上，在我的项目 `public` 目录下添加空文件 `.nojekyll` 即可。因为 Astro 在构建站点时，会将它复制到 `dist` 部署目录。

在项目目录下运行：

```bash
touch public/.nojekyll
```

#### 11. 提交 commit 并推送代码到远程仓库

在项目目录下运行：

```bash
git rm .github/workflows/biome.yml
git add .github/workflows/biome.yml.disabled
git rm .github/workflows/build.yml
git add .github/workflows/build.yml.disabled
git commit -m "chore: 临时禁用冗余的 workflow 文件"

git add .github/workflows/deploy.yml
git commit -m "chore: 调整工作流文件中的引用 main 为 custom，并使打包后的文件部署到另一个仓库的 main 分支上"

git add astro.config.mjs
git commit -m "修改部署地址"

git add public/.nojekyll
git commit -m "fix: 添加文件 public/.nojekyll 以正确提供 _astro 目录中的文件"

git push origin custom
```

#### 12. 验证部署结果

- 打开我的 Fork 仓库页面，点击顶部导航栏的 `Actions`
- 等待最新的工作流运行完成，确保没有发生错误
- 打开 `<username>.github.io` 仓库页面，可看到已部署好的站点文件。GitHub Pages 会自动从 `main` 分支部署站点，无需额外操作
- 点击顶部导航栏的 `Actions`，等待 GitHub Pages 部署站点完成
- 访问 `https://<username>.github.io`，观察页面是否正常显示
- 按 `F12` 键打开`开发人员工具`，切换到`控制台`面板，检查其中是否有严重错误报告信息

## 后续

- 当上游更新代码后，可在我的 Fork 仓库页面点击 `Sync fork` 按钮同步更新
- 建议在 `custom` 分支上进行个性化定制（如撰写博客文章）
- 当本地仓库需要同步上游更新时，有以下方式：
  - 完整同步：在 `master` 分支上拉取上游最新更改，再通过 `git merge master` 或 `git rebase master` 将全部变更整合到 `custom` 分支
  - 部分同步：使用 `git cherry-pick` 选取特定提交，或通过 `git checkout master -- <file>` 仅更新个别文件
- 当想为原主题仓库贡献代码时，可先在 `master` 主分支上拉取上游最新更改。然后，基于主分支创建新的分支，并根据工作性质合理命名，例如新功能使用 `feature/xxx`，Bug 修复使用 `fix/xxx`。在新分支上完成修改并提交后，将其推送到自己的 Fork 仓库。最后向原主题仓库发起 **Pull Request** 请求合并分支。