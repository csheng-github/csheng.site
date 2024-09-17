# V3 Admin Vite

<div align="center">
  <img alt="V3 Admin Vite Logo" width="120" height="120" src="/v3-logo.png">
  <h1>V3 Admin Vite</h1>
  <span><a href="https://juejin.cn/column/7207659644487139387" target="_blank">🤚手摸手教程</a> | <a href="https://juejin.cn/post/7089377403717287972" target="_blank">中文文档</a> | <a href="https://github.com/un-pany/v3-admin-vite" target="_blank">⛪Github 地址</a> | <a href="https://un-pany.github.io/v3-admin-vi" target="_blank">👁️在线预览</a></span>
</div>

## 1、环境、下载、运行项目

参考文章：[《教程一：环境、下载、运行项目》](https://juejin.cn/post/7207824074708680763)
```bash
# 配置
node 版本 18.x 或 20+
pnpm 版本 8.x 或最新版

# 安装 pnpm
npm i -g pnpm

# 克隆项目
git clone https://github.com/csheng-github/v3-admin-vite.git

# 安装依赖
pnpm i

# 启动项目
pnpm dev
```

## 2、接口、跨域、打包
参考文章：[《教程二：接口、跨域、打包》](https://juejin.cn/post/7209852595002409018)

**① 设置后端接口**

```ts{11}
// utils/service.ts
function createRequest(service: AxiosInstance) {
  return function <T>(config: AxiosRequestConfig): Promise<T> {
    const token = getToken()
    const defaultConfig = {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
        "Content-Type": "application/json"
      },
      timeout: 5000,
      baseURL: import.meta.env.VITE_BASE_API,
      data: {}
    }
    // 将默认配置 defaultConfig 和传入的自定义配置 config 进行合并成为 mergeConfig
    const mergeConfig = merge(defaultConfig, config)
    return service(mergeConfig)
  }
}
```
```ts{2}
// .env.development
VITE_BASE_API = '/api/v1'
```


**② 反向代理**
:::info
本地接口路径：http://localhost:3333 /api/v1/users/login <br/>
上线完整路径：https://mock.mengxuegu.com/mock/123 /api/v1/users/login
:::

```ts{5-10}
// vite.config.ts
server: {
  /** 接口代理 */
  proxy: {
    "/api/v1": {
      target: "https://mock.mengxuegu.com/mock/123",
      ws: true,
      /** 是否允许跨域 */
      changeOrigin: true
    }
  },
}
```

## 3、登录模块（API、Axios、Pinia、路由守卫、鉴权）
参考文章：[《教程三：登录模块（API、Axios、Pinia、路由守卫、鉴权）》](https://juejin.cn/post/7214026775143350329)

### ① 配置登录接口

::: code-group

``` [目录]
src
├─ api
│  └─ login
│     ├─ types
|			└─ login.ts
└──── └─ index.ts

src
├─ api
│  └─ system
│     ├─ types
|	   	└─ role.ts
|       └─ user.ts
|     └─ role.ts
└──── └─ user.ts
```

```ts [TS 类型]
// types/api.d.ts
interface ApiResponseData<T> {
  code: number
  data: T
  message: string
}

/* ********************************** */

// api/login/types/login.ts
// 登录请求
export interface LoginRequestData {
  /** admin 或 editor */
  username: "admin" | "editor"
  /** 密码 */
  password: string
  /** 验证码 */
  code: string
}

// 获取 验证码 的格式
export type LoginCodeResponseData = ApiResponseData<string>
// 获取 token 的格式
export type LoginResponseData = ApiResponseData<{ token: string }>
// 获取 用户信息 的格式
export type UserInfoResponseData = ApiResponseData<{ username: string; roles: string[] }>
```

```ts [接口]
// api/login/index.ts
import { request } from "@/utils/service"
import type * as Login from "./types/login"

/** 获取登录验证码 */
export function getLoginCodeApi() {
  return request<Login.LoginCodeResponseData>({
    url: "login/code",
    method: "get"
  })
}

/** 登录并返回 Token */
export function loginApi(data: Login.LoginRequestData) {
  return request<Login.LoginResponseData>({
    url: "users/login",
    method: "post",
    data
  })
}

/** 获取用户详情 */
export function getUserInfoApi() {
  return request<Login.UserInfoResponseData>({
    url: "users/info",
    method: "get"
  })
}
```

:::

### ② 调用登录接口

::: code-group

```ts [点击登录]
// login/index.vue
const handleLogin = () => {
  loginFormRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      loading.value = true
      useUserStore()
        .login(loginFormData)
        .then(() => {
          router.push({ path: "/" })
        })
        .catch(() => {
          createCode()
          loginFormData.password = ""
        })
        .finally(() => {
          loading.value = false
        })
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}
```

```ts{7-12} [状态管理]
// store/modules/user.ts
export const useUserStore = defineStore("user", () => {
  const token = ref<string>(getToken() || "")
  const roles = ref<string[]>([])
  const username = ref<string>("")

  /** 登录 */
  const login = async ({ username, password, code }: LoginRequestData) => {
    const { data } = await loginApi({ username, password, code })
    setToken(data.token)
    token.value = data.token
  }
  ...
})
```

```ts [路由守卫]
- 判断用户是否登录，没登录则只能进入白名单页面，比如登录页
- 如果已经登录，那么将不允许进入登录页
- 如果已经登录，那么还要检查是否拿到用户角色，如果没有，则要调用用户详情接口
- 如果开启了动态路由功能，就根据角色去过滤动态路由；如果没有开启动态路由功能，则生成所有路由
- 不管什么情况，一旦发生错误，就重置 Token，并重定向到登录页

// router/permission.ts
import router from "@/router"
import { useUserStoreHook } from "@/store/modules/user"
import { usePermissionStoreHook } from "@/store/modules/permission"
import { ElMessage } from "element-plus"
import { setRouteChange } from "@/hooks/useRouteListener"
import { useTitle } from "@/hooks/useTitle"
import { getToken } from "@/utils/cache/cookies"
import routeSettings from "@/config/route"
import isWhiteList from "@/config/white-list"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

const { setTitle } = useTitle()
NProgress.configure({ showSpinner: false })

router.beforeEach(async (to, _from, next) => {
  NProgress.start()
  const userStore = useUserStoreHook()
  const permissionStore = usePermissionStoreHook()
  const token = getToken()

  // 如果没有登陆
  if (!token) {
    // 如果在免登录的白名单中，则直接进入
    if (isWhiteList(to)) return next()
    // 其他没有访问权限的页面将被重定向到登录页面
    return next("/login")
  }

  // 如果已经登录，并准备进入 Login 页面，则重定向到主页
  if (to.path === "/login") {
    return next({ path: "/" })
  }

  // 如果用户已经获得其权限角色
  if (userStore.roles.length !== 0) return next()

  // 否则要重新获取权限角色
  try {
    await userStore.getInfo()
    // 注意：角色必须是一个数组！ 例如: ["admin"] 或 ["developer", "editor"]
    const roles = userStore.roles
    // 生成可访问的 Routes
    routeSettings.dynamic ? permissionStore.setRoutes(roles) : permissionStore.setAllRoutes()
    // 将 "有访问权限的动态路由" 添加到 Router 中
    permissionStore.addRoutes.forEach((route) => router.addRoute(route))
    // 确保添加路由已完成
    // 设置 replace: true, 因此导航将不会留下历史记录
    next({ ...to, replace: true })
  } catch (err: any) {
    // 过程中发生任何错误，都直接重置 Token，并重定向到登录页面
    userStore.resetToken()
    ElMessage.error(err.message || "路由守卫过程发生错误")
    next("/login")
  }
})

router.afterEach((to) => {
  setRouteChange(to)
  setTitle(to.meta.title)
  NProgress.done()
})
```

:::


### ③ 鉴权
携带保存在前端的 `token` 去调用接口：
```ts{7}
// utils/service.ts
function createRequest(service: AxiosInstance) {
  return function <T>(config: AxiosRequestConfig): Promise<T> {
    const token = getToken()
    const defaultConfig = {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
        "Content-Type": "application/json"
      }, ...
    }
  }
}
```

如果 `token` 过期，响应时抛出 `401` 代码错误：

```ts{2-6,12-18}
// utils/service.ts
/** 退出登录并强制刷新页面（会重定向到登录页） */
function logout() {
  useUserStoreHook().logout()
  location.reload()
}

/** 创建请求实例 */
function createService() {
  service.interceptors.response.use(
    (error) => {
      const status = get(error, "response.status")
      switch (status) {
        case 401:
          // Token 过期时
          logout()
          break
      }
    }
}
```

## 4、平台配置（布局、路由菜单、全局样式）
参考文章：[教程四：平台配置（布局、路由菜单、全局样式）](https://juejin.cn/post/7216621821960781880)

::: code-group

```ts [布局配置]
// src/config/layouts.ts
/** 默认配置 */
const defaultSettings: LayoutSettings = {
  layoutMode: LayoutModeEnum.Left,
  showSettings: true,
  showTagsView: true,
  fixedHeader: true,
  showFooter: true,
  showLogo: true,
  showNotify: true,
  showThemeSwitch: true,
  showScreenfull: true,
  showSearchMenu: true,
  cacheTagsView: false,
  showWatermark: true,
  showGreyMode: false,
  showColorWeakness: false
}
```

```ts [路由菜单(参数)]
// 设置 noRedirect 的时候该路由在面包屑导航中不可被点击
redirect: 'noRedirect'

// 动态路由：必须设定路由的名字，一定要填写不然重置路由可能会出问题
// 如果要在 tags-view 中展示，也必须填 name
name: 'router-name'

meta: {
  // 设置该路由在侧边栏和面包屑中展示的名字
  title: 'title'
  
  // 设置该路由的图标，记得将 svg 导入 @/icons/svg
  svgIcon: 'svg name'
  
  // 设置该路由的图标，直接使用 Element Plus 的 Icon（与 svgIcon 同时设置时，svgIcon 将优先生效）
  elIcon: 'element-plus icon name'
  
  // 默认 false，设置 true 的时候该路由不会在侧边栏出现
  hidden: true
  
  // 设置该路由进入的权限，支持多个权限叠加（动态路由才需要设置）
  roles: ['admin', 'editor']
  
  // 默认 true，如果设置为 false，则不会在面包屑中显示
  breadcrumb: false
  
  // 默认 false，如果设置为 true，它则会固定在 tags-view 中
  affix: true
  
  // 当一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式
  // 只有一个时，会将那个子路由当做根路由显示在侧边栏
  // 若想不管路由下面的 children 声明的个数都显示你的根路由
  // 可以设置 alwaysShow: true，这样就会忽略之前定义的规则，一直显示根路由
  alwaysShow: true

  // 示例: activeMenu: "/xxx/xxx"
  // 当设置了该属性进入路由时，则会高亮 activeMenu 属性对应的侧边栏
  // 该属性适合使用在有 hidden: true 属性的路由上
  activeMenu: '/dashboard'
  

  // 是否缓存该路由页面
  // 默认为 false，为 true 时代表需要缓存，此时该路由和该页面都需要设置一致的 Name
  keepAlive: false
}
```

```ts [路由菜单(TS格式)]
// types/vue-router.d.ts
import "vue-router"

declare module "vue-router" {
  interface RouteMeta {
    /**
     * 设置该路由在侧边栏和面包屑中展示的名字
     */
    title?: string
    /**
     * 设置该路由的图标，记得将 svg 导入 @/icons/svg
     */
    svgIcon?: string
    /**
     * 设置该路由的图标，直接使用 Element Plus 的 Icon（与 svgIcon 同时设置时，svgIcon 将优先生效）
     */
    elIcon?: string
    /**
     * 默认 false，设置 true 的时候该路由不会在侧边栏出现
     */
    hidden?: boolean
    /**
     * 设置能进入该路由的角色，支持多个角色叠加
     */
    roles?: string[]
    /**
     * 默认 true，如果设置为 false，则不会在面包屑中显示
     */
    breadcrumb?: boolean
    /**
     * 默认 false，如果设置为 true，它则会固定在 tags-view 中
     */
    affix?: boolean
    /**
     * 当一个路由下面的 children 声明的路由大于 1 个时，自动会变成嵌套的模式，
     * 只有一个时，会将那个子路由当做根路由显示在侧边栏，
     * 若想不管路由下面的 children 声明的个数都显示你的根路由，
     * 可以设置 alwaysShow: true，这样就会忽略之前定义的规则，一直显示根路由
     */
    alwaysShow?: boolean
    /**
     * 示例: activeMenu: "/xxx/xxx"，
     * 当设置了该属性进入路由时，则会高亮 activeMenu 属性对应的侧边栏。
     * 该属性适合使用在有 hidden: true 属性的路由上
     */
    activeMenu?: string
    /**
     * 是否缓存该路由页面
     * 默认为 false，为 true 时代表需要缓存，此时该路由和该页面都需要设置一致的 Name
     */
    keepAlive?: boolean
  }
}
```

```ts [路由菜单(设置缓存)]
必须同时满足这4个条件：

1. 路由 `keepAlive` 为 true
2. 路由有 `Name`
3. 页面有 `Name`
4. 路由和页面 Name `保持一致`

defineOptions({
  // 命名当前组件
  name: "ElementPlus" 
})
```

```css [全局样式]
/** styles/variables.css */
/** 全局 CSS 变量，这种变量不仅可以在 CSS 和 SCSS 中使用，还可以导入到 JS 中使用 */

:root {
  /** Body */
  --v3-body-text-color: var(--el-text-color-primary);
  --v3-body-bg-color: var(--el-bg-color-page);
  /** Header 区域 = NavigationBar 组件 + TagsView 组件 */
  --v3-header-height: calc(
    var(--v3-navigationbar-height) + var(--v3-tagsview-height) + var(--v3-header-border-bottom-width)
  );
  --v3-header-bg-color: var(--el-bg-color);
  --v3-header-box-shadow: var(--el-box-shadow-lighter);
  --v3-header-border-bottom-width: 1px;
  --v3-header-border-bottom: var(--v3-header-border-bottom-width) solid var(--el-fill-color);
  /** NavigationBar 组件 */
  --v3-navigationbar-height: 50px;
  --v3-navigationbar-text-color: var(--el-text-color-regular);
  /** Sidebar 组件（左侧模式全部生效、顶部模式全部不生效、混合模式非颜色部分生效） */
  --v3-sidebar-width: 220px;
  --v3-sidebar-hide-width: 58px;
  --v3-sidebar-border-right: 1px solid var(--el-fill-color);
  --v3-sidebar-menu-item-height: 60px;
  --v3-sidebar-menu-tip-line-bg-color: var(--el-color-primary);
  --v3-sidebar-menu-bg-color: #001428;
  --v3-sidebar-menu-hover-bg-color: #409eff10;
  --v3-sidebar-menu-text-color: #cfd3dc;
  --v3-sidebar-menu-active-text-color: #ffffff;
  /** TagsView 组件 */
  --v3-tagsview-height: 34px;
  --v3-tagsview-text-color: var(--el-text-color-regular);
  --v3-tagsview-tag-active-text-color: #ffffff;
  --v3-tagsview-tag-bg-color: var(--el-bg-color);
  --v3-tagsview-tag-active-bg-color: var(--el-color-primary);
  --v3-tagsview-tag-border-radius: 2px;
  --v3-tagsview-tag-border-color: var(--el-border-color-lighter);
  --v3-tagsview-tag-active-border-color: var(--el-color-primary);
  --v3-tagsview-tag-icon-hover-bg-color: #00000030;
  --v3-tagsview-tag-icon-hover-color: #ffffff;
  --v3-tagsview-contextmenu-text-color: var(--el-text-color-regular);
  --v3-tagsview-contextmenu-hover-text-color: var(--el-text-color-primary);
  --v3-tagsview-contextmenu-bg-color: var(--el-bg-color-overlay);
  --v3-tagsview-contextmenu-hover-bg-color: var(--el-fill-color);
  --v3-tagsview-contextmenu-box-shadow: var(--el-box-shadow);
  /** Hamburger 组件 */
  --v3-hamburger-text-color: var(--el-text-color-primary);
  /** RightPanel 组件  */
  --v3-rightpanel-button-bg-color: #001428;
}
```

:::

## 5、前端权限（角色、动态路由、权限函数、权限指令）
参考文章：[教程五：前端权限（角色、动态路由、权限函数、权限指令）](https://juejin.cn/post/7226261250576597050)

### ① 页面权限

::: code-group

```ts [动态路由]
// @/router/index.ts

/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: "/permission",
    component: Layouts,
    redirect: "/permission/page",
    name: "Permission",
    meta: {
      title: "权限",
      svgIcon: "lock",
      roles: ["admin", "editor"], // 可以在根路由中设置角色
      alwaysShow: true // 将始终显示根菜单
    },
    children: [
      {
        path: "page",
        component: () => import("@/views/permission/page.vue"),
        name: "PagePermission",
        meta: {
          title: "页面级",
          roles: ["admin"] // 或者在子导航中设置角色
        }
      },
      {
        path: "directive",
        component: () => import("@/views/permission/directive.vue"),
        name: "DirectivePermission",
        meta: {
          title: "按钮级" // 如果未设置角色，则表示：该页面不需要权限，但会继承根路由的角色
        }
      }
    ]
  }
]
```

```ts{25} [开启动态路由功能]
// @/config/route.ts

/** 路由配置 */
interface RouteSettings {
  /**
   * 是否开启动态路由功能？
   * 1. 开启后需要后端配合，在查询用户详情接口返回当前用户可以用来判断并加载动态路由的字段（该项目用的是角色 roles 字段）
   * 2. 假如项目不需要根据不同的用户来显示不同的页面，则应该将 dynamic: false
   */
  dynamic: boolean
  /** 当动态路由功能关闭时：
   * 1. 应该将所有路由都写到常驻路由里面（表明所有登录的用户能访问的页面都是一样的）
   * 2. 系统自动给当前登录用户赋值一个没有任何作用的默认角色
   */
  defaultRoles: Array<string>
  /**
   * 是否开启三级及其以上路由缓存功能？
   * 1. 开启后会进行路由降级（把三级及其以上的路由转化为二级路由）
   * 2. 由于都会转成二级路由，所以二级及其以上路由有内嵌子路由将会失效
   */
  thirdLevelRouteCache: boolean
}

const routeSettings: RouteSettings = {
  dynamic: true, 
  defaultRoles: ["DEFAULT_ROLE"],
  thirdLevelRouteCache: false
}

export default routeSettings
```

```ts{10} [动态路由生效]
// @/router/permission.ts

router.beforeEach(async (to, _from, next) => {
  // 否则要重新获取权限角色
  try {
    await userStore.getInfo()
    // 注意：角色必须是一个数组！ 例如: ["admin"] 或 ["developer", "editor"]
    const roles = userStore.roles
    // 生成可访问的 Routes
    routeSettings.dynamic ? permissionStore.setRoutes(roles) : permissionStore.setAllRoutes()
    // 将 "有访问权限的动态路由" 添加到 Router 中
    permissionStore.addRoutes.forEach((route) => router.addRoute(route))
    // 确保添加路由已完成
    // 设置 replace: true, 因此导航将不会留下历史记录
    next({ ...to, replace: true })
  } catch (err: any) {
    // 过程中发生任何错误，都直接重置 Token，并重定向到登录页面
    userStore.resetToken()
    ElMessage.error(err.message || "路由守卫过程发生错误")
    next("/login")
  }
})
```

:::

### ② 内容权限

::: code-group

```ts [权限函数]
// @/utils/permission.ts

import { useUserStoreHook } from "@/store/modules/user"

/** 权限判断函数 */
export const checkPermission = (permissionRoles: string[]): boolean => {
  if (Array.isArray(permissionRoles) && permissionRoles.length > 0) {
    const { roles } = useUserStoreHook()
    return roles.some((role) => permissionRoles.includes(role))
  } else {
    console.error("need roles! Like checkPermission(['admin','editor'])")
    return false
  }
}

/* -------------------------------------------------------- */

import { checkPermission } from "@/utils/permission"

<el-button v-if="checkPermission(['admin'])">按钮</el-button>

```

```ts [权限指令]
// @/directives/permission/index.ts

import { type Directive } from "vue"
import { useUserStoreHook } from "@/store/modules/user"

/** 权限指令 */
export const permission: Directive = {
  mounted(el, binding) {
    const { value: permissionRoles } = binding
    const { roles } = useUserStoreHook()
    if (Array.isArray(permissionRoles) && permissionRoles.length > 0) {
      const hasPermission = roles.some((role) => permissionRoles.includes(role))
      // hasPermission || (el.style.display = "none") // 隐藏
      hasPermission || el.parentNode?.removeChild(el) // 销毁
    } else {
      throw new Error(`need roles! Like v-permission="['admin','editor']"`)
    }
  }
}

/* -------------------------------------------------------- */

<el-button v-permission="['admin']">按钮</el-button>
```

:::

### ③ 后端返回动态路由（待续）


## 6、前端项目规范

参考文章：[教程六：前端项目规范](https://juejin.cn/post/7231771821832618043)

::: code-group

```md [命名规范]
Components 组件：大驼峰（PascalCase），例如：`@/components/SvgIcon/index.vue`
View 页面：短横线连接（kebab-case），例如：`@/views/hook-demo/use-fetch-select.vue`
Hooks / Composables：小驼峰（camelCase），例如：`@/hooks/useTheme.ts`
Props：小驼峰（camelCase）

<!-- 模板和 JSX 中使用 短横线连接 (kebab-case) -->
<Screenfull open-tips="内容区全屏" />

const props = defineProps({
  // 命名采用 小驼峰 (camelCase)
  exitTips: {
    type: String,
    default: "退出全屏"
  }
})

其他 .ts 或 .js 文件：短横线连接（kebab-case）
```

```md [代码规范]
https://v2.cn.vuejs.org/v2/style-guide
```

```md [Git 提交规范]
- **feat:** 增加新的业务功能
- **fix:** 修复业务问题/BUG
- **perf:** 优化性能
- **style:** 更改代码风格, 不影响运行结果
- **refactor:** 重构代码
- **revert:** 撤销更改
- **test:** 测试相关, 不涉及业务代码的更改
- **docs:** 文档和注释相关
- **chore:** 更新依赖/修改脚手架配置等琐事
- **workflow:** 工作流改进
- **ci:** 持续集成相关
- **types:** 类型定义文件更改
- **wip:** 开发中
```

```md [注释规范]
由于项目采用 TS 5.x 进行开发，为了获得更好的 TS 提示，项目采用了大量的 `/** xxx */` 注释。
```

```md [代码校验与格式化]
项目拥有基于 `eslint + prettier + husky + lint-staged` 依赖的格式化校验规则和流程。
```

:::

## 7、后端配套接口
参考文章：[教程七：后端配套接口](https://juejin.cn/post/7249382407244087351)
### ① 接口数据格式 
```typescript
{
  code: number
  data: T
  message: string
}
```
### ② Token 鉴权
```typescript
Authorization: token ? `Bearer ${token}` : undefined,
```
### ③ 现有接口

**登录模块**

::: code-group

```ts [获取验证码]
// `get`，`/api/v1/login/code`
{
  "code": 0,
  "data": string, // 验证码 url
  "message": "获取验证码成功"
}
```

```ts [登录]
{
  username: string
  password: string
  code: string // 验证码
}

// `post`，`/api/v1/users/login`
{
  "code": 0,
  "data": {
    "token": string
  },
  "message": "登录成功"
}
```

```ts [获取用户详情]
// `get`，`/api/v1/users/info`
{
  "code": 0,
  "data": {
    "username": string,
    "roles": string[]
  },
  "message": "获取用户详情成功"
}
```

:::

**表格模块：**

::: code-group

```ts [增]
// `post`，`/api/v1/table`
{
  username: string
  password: string
}

{
  "code": 0,
  "data": {},
  "message": "新增成功"
}
```

```ts [删]
// `delete`，`/api/v1/table/{id}`
{
  "code": 0,
  "data": {},
  "message": "删除成功"
}
```

```ts [改]
// `put`，`/api/v1/table`
{
  id: string
  username: string
  password: string | undefined
}

{
  "code": 0,
  "data": {},
  "message": "修改成功"
}
```

```ts [查]
// `get`，`/api/v1/table`
// /api/v1/table?currentPage=1&size=10&username=用户名&phone=手机号
{
  "code": 0,
  "data": {
    list: [], // 当前要展示的表格数据
    total: number // 数据库里的总数
  },
  "message": "获取表格数据成功"
}
```

:::

## 8、多主题（动态换肤）
参考文章：[教程八：多主题（动态换肤）模式的实现](https://juejin.cn/post/7268123683222257701)
