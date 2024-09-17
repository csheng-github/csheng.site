# Vue Router 4

## 基础

### 入门🚪

::: code-group
```html{2,4,5,7} [App.vue]
<template>
  <strong>当前路由路径:</strong> {{ $route.fullPath }}

  <RouterLink to="/">首页</RouterLink>
  <RouterLink to="/about">关于</RouterLink>

  <RouterView />
</template>
```
```ts{6-9} [router/index.ts]
const routes = [
  { path: '/', component: HomeView },
  { path: '/about', component: AboutView },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
```
```ts{2} [main.ts]
const app = createApp(App)
app.use(router)
app.mount('#app')
```
```ts [访问路由器和路由]
const router = useRouter()
const route = useRoute()
```
:::

### 动态路由匹配🔐

::: code-group
```ts [响应路由参数的变化]
// 方法1
watch(() => route.params.id, (newId, oldId) => {
  // 对路由变化做出响应...
})

// 方法2
onBeforeRouteUpdate(async (to, from) => {
  // 对路由变化做出响应...
  userData.value = await fetchUser(to.params.id)
})
```
```ts [捕获所有路由或 404 Not found 路由]
// 路由配置
const routes = [
  // 将匹配所有内容并将其放在 `route.params.pathMatch` 下
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  // 将匹配以 `/user-` 开头的所有内容，并将其放在 `route.params.afterUser` 下
  { path: '/user-:afterUser(.*)', component: UserGeneric },
]

// 跳转到指定路由
router.push({
  name: 'NotFound',
  // 保留当前路径并删除第一个字符，以避免目标 URL 以 `//` 开头。
  params: { pathMatch: this.$route.path.substring(1).split('/') },
  // 保留现有的查询和 hash 值，如果有的话
  query: route.query,
  hash: route.hash,
})
```
:::

### 路由的匹配语法🗝️

::: code-group
```ts [在参数中自定义正则]
const routes = [
  // 匹配 /o/3549
  { path: '/o/:orderId' },
  // 仅匹配数字
  { path: '/:orderId(\\d+)' },
  // 匹配其他任何内容
  { path: '/:productName' },
]
```
```ts [可重复的参数]
const routes = [
  // `+`：后面可接 1到多个 任意参数
  { path: '/:chapters+' },
  // `*`：后面可接 0到多个 任意参数
  { path: '/:chapters*' },
  // 匹配数字 /1, /1/2, 等
  { path: '/:chapters(\\d+)+' },
  // 匹配数字 /, /1, /1/2, 等
  { path: '/:chapters(\\d+)*' },
]
```
```ts [Sensitive 与 strict 路由配置]
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/users/:id', sensitive: true }, // 大小写敏感
    { path: '/users/:id?' },
  ],
  strict: true, // 严格模式：没有 `/` 结尾
})
```
```ts [可选参数]
const routes = [
  // 匹配 /users 和 /users/posva
  { path: '/users/:userId?' },
  // 匹配 /users 和 /users/42
  { path: '/users/:userId(\\d+)?' },
]
```
:::

### 嵌套路由 & 命名路由😁

::: code-group
```ts [嵌套路由]
const routes = [
  {
    path: '/admin',
    children: [
      { path: '', component: AdminOverview },
      { path: 'users', component: AdminUserList },
      { path: 'users/:id', component: AdminUserDetails },
    ], 
  },
]
```
```ts [命名路由]
// 路由配置
const routes = [
  {
    path: '/user/:id',
    name: 'User',
    component: User,
    children: [
      { path: '', name: 'UserHome', component: UserHome },
      { path: 'profile', name: 'UserProfile', component: UserProfile },
      { path: 'posts', name: 'UserPosts', component: UserPosts },
    ],
  },
]

// 通过 name 跳转到指定路由
router.push({ name: 'user', params: { username: 'erina' } })
```
:::

### 编程式导航🗺️

::: code-group
```ts [导航到不同的位置]
// 字符串路径
router.push('/users/eduardo')

// 带有路径的对象
router.push({ path: '/users/eduardo' })

// 命名的路由，并加上参数，让路由建立 url
router.push({ name: 'user', params: { username: 'eduardo' } })

// 带查询参数，结果是 /register?plan=private
router.push({ path: '/register', query: { plan: 'private' } })

// 带 hash，结果是 /about#team
router.push({ path: '/about', hash: '#team' })
```
```ts [替换当前位置]
router.push({ path: '/home', replace: true })
// 相当于
router.replace({ path: '/home' })
```
```ts [横跨历史]
// 向前移动一条记录，与 router.forward() 相同
router.go(1)

// 返回一条记录，与 router.back() 相同
router.go(-1)

// 前进 3 条记录
router.go(3)

// 如果没有那么多记录，静默失败
router.go(-100)
router.go(100)
```
:::

### 命名视图📺

**① 命名视图：**

::: code-group
```ts [路由]
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      components: {
        default: Home,
        // LeftSidebar: LeftSidebar 的缩写
        LeftSidebar,
        // 它们与 `<router-view>` 上的 `name` 属性匹配
        RightSidebar,
      },
    },
  ],
})
```
```html [组件]
<router-view class="view left-sidebar" name="LeftSidebar" />
<router-view class="view main-content" />
<router-view class="view right-sidebar" name="RightSidebar" />
```
:::

**② 嵌套命名视图：**

::: code-group
```ts [路由]
{
  path: '/settings',
  component: UserSettings,
  children: [
    // 只匹配到1个router-view
    { path: 'emails', component: UserEmailsSubscriptions }, 
    // 匹配到2个router-view
    {
      path: 'profile',
      components: {
        default: UserProfile,
        helper: UserProfilePreview
      }
    }
  ]
}
```
```html [组件]
<NavBar />
<router-view />
<router-view name="helper" />
```
:::

### 重定向和别名🤵

::: code-group
```ts [重定向]
const routes = [
  { 
    path: '/home', 
    // 或 { name: 'homepage' } 
    redirect: '/', 
  },
  {
    // /search/screens -> /search?q=screens
    path: '/search/:searchText',
    redirect: to => {
      return { path: '/search', query: { q: to.params.searchText } }
    },
  },
  {
    // 把/users/123/posts重定向到/users/123/profile。
    path: '/users/:id/posts',
    redirect: to => {
      // 或 { path: 'profile'}
      return 'profile'
    },
  },
]
```
```ts [别名]
const routes = [
  // 一个别名
  { path: '/', component: Homepage, alias: '/home' },
  // 多个别名
  {
    path: '/users',
    component: UsersLayout,
    children: [{ path: '', component: UserList, alias: ['/people', 'list'] }],
  },
  // 携带参数的别名
  {
    path: '/users/:id',
    component: UsersByIdLayout,
    children: [
      { path: 'profile', component: UserDetails, alias: ['/:id', ''] },
    ],
  },
]
```
:::

### 路由组件传参🐭

::: code-group
```ts{6,11-13} [将 props 传递给路由组件]
// 路由配置
const routes = [
  { 
    path: '/user/:id', 
    component: User, 
    props: true
  }
]

// 对应组件
defineProps<{
  id: string
}>()
```
```ts{5} [命名视图]
const routes = [
  {
    path: '/user/:id',
    components: { default: User, sidebar: Sidebar },
    props: { default: true, sidebar: false }
  }
]
```
```ts{5} [对象模式]
const routes = [
  {
    path: '/promotion/from-newsletter',
    component: Promotion,
    props: { newsletterPopup: false }
  }
]
```
```ts{5} [函数模式]
const routes = [
  {
    path: '/search',
    component: SearchUser,
    props: route => ({ query: route.query.q })
  }
]
```
```html{2} [通过 RouterView]
<RouterView v-slot="{ Component }">
  <component :is="Component" view-prop="value" />
</RouterView>
```
:::

### 匹配当前路由的链接🐱

::: code-group
```html [配置类别1]
<RouterLink
  activeClass="border-indigo-500"
  exactActiveClass="border-indigo-700"
  ...
>
```
```ts [配置类别2]
const router = createRouter({
  linkActiveClass: 'border-indigo-500',
  linkExactActiveClass: 'border-indigo-700',
  // ...
})
```
:::

### 不同的历史记录模式💩

::: code-group
```ts{5} [Hash 模式]
// 它在内部传递的实际 URL 之前使用了一个哈希字符（#）。
// 由于这部分 URL 从未被发送到服务器，所以它不需要在服务器层面上进行任何特殊处理。
// 它在 SEO 中确实有不好的影响。
const router = createRouter({
  history: createWebHashHistory(),
})
```
```ts{5} [Memory 模式]
// Memory 模式不会假定自己处于浏览器环境，因此不会与 URL 交互也不会自动触发初始导航。
// 这使得它非常适合 Node 环境和 SSR。
// 虽然不推荐，你仍可以在浏览器应用程序中使用此模式，但请注意它不会有历史记录，这意味着你无法后退或前进。
const router = createRouter({
  history: createMemoryHistory(),
})
```
```ts{5} [HTML5 模式]
// 当使用这种历史模式时，URL 会看起来很 "正常"，例如 https://example.com/user/id。漂亮!
// 不过，如果没有适当的服务器配置，用户在浏览器中直接访问 https://example.com/user/id，就会得到一个 404 错误。
// 解决：在服务器上添加一个简单的回退路由。如果 URL 不匹配任何静态资源，它应提供与你的应用程序中的 index.html 相同的页面。
const router = createRouter({
  history: createWebHistory(),
})
```
:::

## 进阶

### 导航守卫🧭

::: code-group
```ts [全局前置守卫]
/* Vue Router 4 已移除第三个参数 next */
router.beforeEach((to, from) => {
  // 没登录 而且 跳转的页面不是登录页
  if (!isAuthenticated.value && to.name !== 'Login') {
    return { name: 'Login' }
  }
  return false // 不准跳转页面
})
```
```ts [全局解析守卫]
/* 如果用户无法进入页面时希望避免执行的操作 */
router.beforeResolve(async (to) => {
  if (to.meta.requiresCamera) {
    try {
      await askForCameraPermission()
    } catch (error) {
      if (error instanceof NotAllowedError) {
        return false // 不允许跳转
      } else {
        throw error // 意料之外的错误，取消导航并把错误传给全局处理器
      }
    }
  }
})
```
```ts [全局后置钩子]
/* 分析、更改页面标题、声明页面等辅助功能 */
router.afterEach((to) => {
  setTitle(to.meta.title) // 设置标题
  NProgress.done() // 关闭进度条
})
```
```ts [在守卫内的全局注入]
// main.ts
const app = createApp(App)
app.provide('msg', '你好')

// router.ts
router.beforeEach((to, from) => {
  const msg = inject('msg')
})
```
```ts{6-9} [路由独享的守卫]
/* ⚠️不会在 params、query 或 hash 改变时触发 */
const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: (to, from) => {
      // ...
      return false // 不允许跳转
    },
  },
]
```
```ts [组件内的守卫]
onBeforeRouteLeave((to, from) => {
  const answer = window.confirm('您真的想离开吗? 您有未保存的更改!')
  if (!answer) return false // 不跳转
})

onBeforeRouteUpdate(async (to, from) => {
  // 仅当 id 更改时才获取用户
  if (to.params.id !== from.params.id) {
    console.log('id已更新')
  }
})
```
:::

### 路由元信息😶‍🌫️

::: code-group
```ts [使用示例]
router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !auth.isLoggedIn()) {
    // 如果没有登录且访问的是需授权页面，则重定向到登录页面
    return {
      path: '/login',
      // 保存我们所在的位置，以便以后再来
      query: { redirect: to.fullPath },
    }
  }
})
```
```ts [TypeScript]
/* 实际开发中，我们经常在根目录新建 types/vue-router.d.ts 声明文件 */
import 'vue-router'

// 为了确保这个文件被当作一个模块，添加至少一个 `export` 声明
export {}

declare module 'vue-router' {
  interface RouteMeta {
    // 是可选的
    isAdmin?: boolean
    // 每个路由都必须声明
    requiresAuth: boolean
  }
}
```
:::

### 数据获取🛜

```vue
<script setup>
const loading = ref(false)
const post = ref(null)
const error = ref(null)

watch(() => route.params.id, fetchData, { immediate: true })

async function fetchData(id) {
  error.value = post.value = null
  loading.value = true

  try {
    post.value = await getPost(id)
  } catch (err) {
    error.value = err.toString()
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="post">
    <!-- 加载中 -->
    <div v-if="loading" class="loading">Loading...</div>
    <!-- 响应错误❌ -->
    <div v-if="error" class="error">{{ error }}</div>
    <!-- 响应正确✅ -->
    <div v-if="post" class="content">
      <h2>{{ post.title }}</h2>
      <p>{{ post.body }}</p>
    </div>
  </div>
</template>
```

### 组合式 API🫂

::: code-group
```vue [在 setup 中访问路由和当前路由]
<script setup>
import { useRouter, useRoute } from 'vue-router'

/* setup 中访问：useRouter、useRoute */
const router = useRouter()
const route = useRoute()
</script>

<template>
  <!-- 结构中访问：$router、$route -->
  <button @click="$router.push('/login')">跳转</button>
</template>
```
```ts [useLink]
import { RouterLink, useLink } from 'vue-router'
import { computed } from 'vue'

const props = defineProps({
  // 如果使用 TypeScript，请添加 @ts-ignore
  ...RouterLink.props,
  inactiveClass: String
})

const {
  // 解析出来的路由对象
  route,
  // 用在链接里的 href
  href,
  // 布尔类型的 ref 标识链接是否匹配当前路由
  isActive,
  // 布尔类型的 ref 标识链接是否严格匹配当前路由
  isExactActive,
  // 导航至该链接的函数
  navigate
} = useLink(props)

const isExternalLink = computed(() => typeof props.to === 'string' && props.to.startsWith('http'))
```
:::

### RouterView 插槽🔏

::: code-group
```html [KeepAlive & Transition]
<router-view v-slot="{ Component }">
  <keep-alive>
    <component :is="Component" />
  </keep-alive>
</router-view>

<router-view v-slot="{ Component }">
  <transition>
    <component :is="Component" />
  </transition>
</router-view>

<router-view v-slot="{ Component }">
  <transition>
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </transition>
</router-view>
```
```html [模板引用]
<router-view v-slot="{ Component }">
  <component :is="Component" ref="mainContent" />
</router-view>
```
:::

### 过渡动效🎞️

::: code-group
```html [基本使用]
<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style scoped>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```
```html{6,11} [单个路由的过渡]
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { transition: 'slide-left' }
  },
]

<router-view v-slot="{ Component, route }">
  <transition :name="route.meta.transition || 'fade'">
    <component :is="Component" />
  </transition>
</router-view>
```
```html{10} [基于路由的动态过渡]
<router-view v-slot="{ Component, route }">
  <transition :name="route.meta.transition">
    <component :is="Component" />
  </transition>
</router-view>

router.afterEach((to, from) => {
  const toDepth = to.path.split('/').length
  const fromDepth = from.path.split('/').length
  to.meta.transition = toDepth < fromDepth ? 'slide-right' : 'slide-left'
})
```
```html{3} [强制在复用的视图之间进行过渡]
<router-view v-slot="{ Component, route }">
  <transition name="fade">
    <component :is="Component" :key="route.path" />
  </transition>
</router-view>
```
:::

### 滚动行为🚶‍♂️

::: code-group
```ts{3} [始终滚动到顶部]
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  },
})
```
```ts{3} [指定元素]
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    return { el: '#main',top: 10 }
  },
})
```
```ts{3-7} [浏览器原生]
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})
```
```ts{3-6} [滚动到锚点]
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { el: to.hash }
    }
  },
})
```
```ts{4} [滚动流畅]
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
  }
})
```
```ts{2-8} [延迟滚动]
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ left: 0, top: 0 })
      }, 500)
    })
  },
})
```
:::

### 路由懒加载😪

::: code-group
```ts{4} [路由懒加载]
const router = createRouter({
  // ...
  routes: [
    { path: '/users/:id', component: () => import('./views/UserDetails.vue') },
  ],
})
```
```ts{6-18} [把组件按组分块]
// vite.config.ts
/* 以下代码作用：
   把 [ './src/UserDetails', './src/UserDashboard', './src/UserProfileEdit'] 
   分到 group-user 块中 */
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'group-user': [
            './src/UserDetails',
            './src/UserDashboard',
            './src/UserProfileEdit',
          ],
        },
      },
    },
  },
})
```
:::

### 扩展 RouterLink📢

```vue
<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

defineOptions({
  inheritAttrs: false // 禁用透传
})

const props = defineProps({
  // 如果使用 TypeScript，请添加 @ts-ignore
  ...RouterLink.props,
  inactiveClass: String
})

const isExternalLink = computed(() => {
  return typeof props.to === 'string' && props.to.startsWith('http')
})
</script>

<template>
  <a v-if="isExternalLink" v-bind="$attrs" :href="to" target="_blank">
    <slot />
  </a>
  <router-link v-else v-bind="$props" custom v-slot="{ isActive, href, navigate }">
    <a
      v-bind="$attrs"
      :href="href"
      @click="navigate"
      :class="isActive ? activeClass : inactiveClass"
    >
      <slot />
    </a>
  </router-link>
</template>
```

### 动态路由🦍

::: code-group
```ts [添加路由]
// 添加一个新的路由
router.addRoute({ path: '/about', component: About })
// 覆盖原来的位置
router.replace(router.currentRoute.value.fullPath)
```
```ts [在导航守卫中添加路由]
router.beforeEach(to => {
  if (!hasNecessaryRoute(to)) {
    router.addRoute(generateRoute(to))
    // 触发重定向
    return to.fullPath
  }
})
```
```ts [删除路由]
router.addRoute({ path: '/about', name: 'about', component: About })
// 这将会删除之前已经添加的路由，因为他们具有相同的名字且名字必须是唯一的
router.addRoute({ path: '/other', name: 'about', component: Other })

// 通过使用 router.removeRoute() 按名称删除路由：
router.removeRoute('about')
```
```ts [添加嵌套路由]
router.addRoute({ name: 'admin', path: '/admin', component: Admin })
router.addRoute('admin', { path: 'settings', component: AdminSettings })

/* 等效于 */
router.addRoute({
  name: 'admin',
  path: '/admin',
  component: Admin,
  children: [{ path: 'settings', component: AdminSettings }],
})
```
```md [查看现有路由]
- router.hasRoute()：检查路由是否存在。
- router.getRoutes()：获取一个包含所有路由记录的数组。
```
:::