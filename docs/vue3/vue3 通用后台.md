# VUE3 通用后台

## 菜单权限 

### 方法一

在 `router/index.ts` 定义 常量路由、异步路由、任意路由，然后在获取用户信息时，将请求到的路由跟本地写死的对比筛选。

```ts
// stores/modules/user.ts
import { constantRoute, asyncRoute, anyRoute } from '@/router'

import cloneDeep from 'lodash/cloneDeep'
import router from '@/router'

/**
 * asyncRoute: 本地写死的异步路由
 * routes：请求到的路由
 */
function filterAsyncRoute(asyncRoute: any, routes: any) {
  return asyncRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}

export const useUserStore = defineStore(
  'user',
  () => {
    const menuRoutes = constantRoute
    const getUserInfo = () => {
      const result = await reqUserInfo()、
      // 匹配到的异步路由
      const userAsyncRoute = filterAsyncRoute(cloneDeep(asyncRoute), result.data.routes)
      // 最终的全部路由加起来
      this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute]
      // 动态追加
      ;[...userAsyncRoute, anyRoute].forEach((route: any) => {
        router.addRoute(route)
      })
    }

    return { menuRoutes, getUserInfo }
  },
  { persist: true }
)
```