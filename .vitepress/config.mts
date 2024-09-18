import { defineConfig } from 'vitepress'

// https://vitepress.dev/zh/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: "升崽の博客",
  description: "技术交流平台",
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  cleanUrls: false,
  ignoreDeadLinks: true,
  lastUpdated: true,
  // https://vitepress.dev/zh/reference/default-theme-config
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: '首页', link: '/' },
      { text: '素材', link: '/docs/prepare' },
      { text: 'Git', link: '/docs/git' },
      { text: 'HTML/CSS/JS', link: '/docs/html&css&js' },
      { text: 'Vue2人资', link: '/docs/vue2/人资/01.环境搭建' },
      { text: 'Vue3', link: '/docs/vue3/vue3' },
    ],
    sidebar: {
      '/docs/vue2': [
        {
          text: '大纲',
          items: [
            { text: '01.环境搭建', link: '/docs/vue2/人资/01.环境搭建' },
            { text: '02.登录模块', link: '/docs/vue2/人资/02.登录模块' },
            { text: '03.vue-cli配置接口代理转发', link: '/docs/vue2/人资/03.vue-cli配置接口代理转发' },
            { text: '04.主页模块', link: '/docs/vue2/人资/04.主页模块' },
            { text: '05.路由和页面', link: '/docs/vue2/人资/05.路由和页面' },
            { text: '06.组织架构', link: '/docs/vue2/人资/06.组织架构' },
            { text: '07.角色管理md', link: '/docs/vue2/人资/07.角色管理md' },
            { text: '08.员工管理', link: '/docs/vue2/人资/08.员工管理' },
            { text: '09.员工详情', link: '/docs/vue2/人资/09.员工详情' },
            { text: '10.权限点管理', link: '/docs/vue2/人资/10.权限点管理' },
            { text: '11.RBAC权限设计思想及权限实际应用', link: '/docs/vue2/人资/11.RBAC权限设计思想及权限实际应用' },
            { text: '12.首页功能实现', link: '/docs/vue2/人资/12.首页功能实现' },
            { text: '13.全屏-多语言', link: '/docs/vue2/人资/13.全屏-多语言' },
            { text: '14.打包优化并发布', link: '/docs/vue2/人资/14.打包优化并发布' },
          ],
        },
      ],
      '/docs/vue3': [
        {
          text: 'Vue3 知识',
          items: [
            { text: 'vue3', link: '/docs/vue3/vue3' },
            { text: 'TypeScript', link: '/docs/vue3/TypeScript' },
            { text: 'Vue Router 4', link: '/docs/vue3/Vue Router 4' },
          ],
        },
        {
          text: 'Vue3 组件库',
          items: [
            { text: 'Element Plus', link: '/docs/vue3/Element Plus' },
            { text: 'Vant', link: '/docs/vue3/Vant' },
          ],
        },
        {
          text: 'Vue3 项目',
          items: [
            { text: '前期准备', link: '/docs/vue3/vue3 项目准备' },
            { text: '通用后台', link: '/docs/vue3/vue3 通用后台' },
            { text: 'V3 Admin Vite 模板', link: '/docs/vue3/v3-admin-vite' },
          ],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/csheng-github' }],
    outline: [2, 6],
    outlineTitle: '目录',
    footer: { copyright: 'Copyright © 2024-present 升崽' },
    editLink: {
      pattern: 'https://github.com/csheng-github/csheng.site/blob/main/:path',
      text: '在GitHub上编辑此页'
    },
    lastUpdated: { text: '最近更新' },
    docFooter: { prev: '前一篇', next: '后一篇' },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档',
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
          },
        },
      },
    },
  },
  markdown: {
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详细信息',
    },
    image: {
      lazyLoading: true
    }
  }
})
