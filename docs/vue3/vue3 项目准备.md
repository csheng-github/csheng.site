# VUE3 项目准备

## .vscode 配置

::: code-group
```json [extensions.json]
{
  "recommendations": [
    "Vue.volar",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "editorconfig.editorconfig",
  ]
}
```
```json [settings.json]
{
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit"
  },
  "editor.formatOnSave": false,
}
```
```json [typescript.code-snippets]
{
	"ts注释": {
		"prefix": "tszs",
		"body": [
			"/** $1 */"
		],
		"description": "ts注释"
	}
}
```
```json [vue.code-snippets]
{
	"vue3-ts-scss模板": {
		"prefix": "v3tss",
		"body": [
			"<script lang=\"ts\" setup>",
			"",
			"</script>",
			"",
			"<template>",
			"  <div class=\"$1-page\">",
			"    $1",
			"  </div>",
			"</template>",
			"",
			"<style lang=\"scss\" scoped>",
			"",
			"</style>"
		],
		"description": "vue3-ts-scss模板"
	}
}
```
:::

## ESLint & prettier 配置代码风格

复制下面代码到 `.eslintrc.cjs`

```jsx
rules: {
  'prettier/prettier': [
    'warn',
    {
      singleQuote: true, // 单引号
      semi: false, // 无分号
      printWidth: 80, // 每行宽度至多80字符
      trailingComma: 'none', // 不加对象|数组最后逗号
      endOfLine: 'auto' // 换行符号不限制（win mac 不一致）
    }
  ],
  'vue/multi-word-component-names': [
    'warn',
    {
      ignores: ['index'] // vue组件名称多单词组成（忽略index.vue）
    }
  ],
  'vue/no-setup-props-destructure': ['off'], // 关闭 props 解构的校验
  // 添加未定义变量错误提示
  'no-undef': 'error'
}
```

## .editorconfig 

⚠️必须先安装扩展插件 `EditorConfig for VS Code`

在根目录新建 `.editorconfig`

```json
# 配置项文档：https://editorconfig.org/

# 告知 EditorConfig 插件，当前即是根文件
root = true

# 适用全部文件
[*]
## 设置字符集
charset = utf-8
## 缩进风格 space | tab，建议 space（会自动继承给 Prettier）
indent_style = space
## 缩进的空格数（会自动继承给 Prettier）
indent_size = 2
## 换行符类型 lf | cr | crlf，一般都是设置为 lf
end_of_line = lf
## 是否在文件末尾插入空白行
insert_final_newline = true
## 是否删除一行中的前后空格
trim_trailing_whitespace = true

# 适用 .md 文件
[*.md]
insert_final_newline = false
trim_trailing_whitespace = false
```

## husky 代码检查工作流

**① husky 配置：** 如果代码有误，则阻止提交并报错（缺点：全量检查，耗时很长，不符合规范）
```jsx
pnpm dlx husky-init && pnpm install
```

**② lint-staged 配置**（仅校验 **暂存区**，对自己写的代码负责，更符合我们的规范）
```jsx
pnpm install lint-staged -D
```
```jsx
// package.json
{
  "scripts": {
    // ...
    "lint-staged": "lint-staged" // [!code ++]
  }
  // ...
  "lint-staged": { // [!code ++]
    "*.{js,ts,vue}": [ // [!code ++]
      "eslint --fix" // [!code ++]
    ] // [!code ++]
  }, // [!code ++]
}
```

**③ 修改 `.husky/pre-commit`**

```jsx
pnpm lint-staged
```

## commitlint 代码提交规范

```jsx
pnpm add @commitlint/config-conventional @commitlint/cli -D
```

在根目录新建 `commitlint.config.cjs`

```jsx
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'revert',
        'build',
      ],
    ],
    'type-case': [0],
    'type-empty': [0],
    'scope-empty': [0],
    'scope-case': [0],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never'],
    'header-max-length': [0, 'always', 72],
  },
}
```

在 `package.json` 添加 `script` 命令配置

```json
"commitlint": "commitlint --config commitlint.config.cjs -e -V"
```

自动命令安装

```jsx
npx husky add .husky/commit-msg 
```

修改 `.husky/commit-msg`

```json
pnpm commitlint
```

## module.exports 报红处理

修改 `.eslintrc.cjs`

```jsx
module.exports = {
  root: true,
  env: { // [!code ++]
    node: true // [!code ++]
  }, // [!code ++]
}
```

## 强制 pnpm 包管理器工具

在根目录新建 `scripts/preinstall.js`

```js
if (!/pnpm/.test(process.env.npm_execpath || "")) {
  console.warn(
    `\u001b[33mThis repository must using pnpm as the package manager ` +
      ` for scripts to work properly.\u001b[39m\n`
  );
  process.exit(1);
}
```

在 `package.json` 添加 `script` 命令配置

```json
"preinstall": "node ./scripts/preinstall.js"
```

## Pinia 构建用户仓库 & 持久化

文件目录结构：

```json
|—— stores
|—————— modules / user.ts
|—————— index.ts
```

安装 pinia 持久插件
```jsx
pnpm add pinia-plugin-persistedstate -D
```

::: code-group

```jsx [stores/modules/user.ts]
export const useUserStore = defineStore(
  'cs-user',
  () => {
    const token = ref('')
    const setToken = (newToken) => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }

    return {
      token,
      setToken,
      removeToken
    }
  },
  { persist: true }
)
```
```jsx [stores/index.ts]
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(persist)

export default pinia

export * from './modules/user'
```
```jsx [导入 pinia]
import pinia from './stores'
...
app.use(pinia)
```
```html [组件中使用]
<script setup>
import { useUserStore } from '@/stores'

const userStore = useUserStore()
</script>

<template>
  <div>token：{{ userStore.token }}</div>
  <button @click="userStore.setToken('Bearer abcdef')">登录</button>
  <button @click="userStore.removeToken()">注销</button>
</template>
```
:::


## 动态HTML标题

```jsx
pnpm add vite-plugin-html -D
```

::: code-group
```ts{1,6} [vite.config.ts]
import { createHtmlPlugin } from 'vite-plugin-html'

export default defineConfig({
  plugins: [
    // ...
    createHtmlPlugin()
  ]
})
```
```ts [环境变量配置]
// .env.development
VITE_APP_TITLE = 'VUE3-PC模板(dev)'

// .env.production
VITE_APP_TITLE = 'VUE3-PC模板(prod)'
```
```html [index.html]
<title><%=VITE_APP_TITLE%></title>
```
:::

## SVG 图标配置

**安装SVG依赖插件**

```bash
pnpm add vite-plugin-svg-icons -D
```

::: code-group
```ts [vite.config.ts]
// SVG图标
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons' // [!code ++]

export default defineConfig({
  //...
  plugins: [
    //...
    createSvgIconsPlugin({ // [!code ++]
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')], // [!code ++]
      symbolId: 'icon-[dir]-[name]' // [!code ++]
    }) // [!code ++]
  ]
})
```
```ts [main.ts]
import 'virtual:svg-icons-register'
```
```vue [封装 SvgIcon 组件]
<script setup lang="ts">
defineProps({
  prefix: {
    type: String,
    default: '#icon-'
  },
  name: String,
  color: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '16px'
  },
  height: {
    type: String,
    default: '16px'
  }
})
</script>

<template>
  <svg :style="{ width, height }">
    <use :xlink:href="prefix + name" :fill="color"></use>
  </svg>
</template>
```
```html [在组件中使用]
<svg-icon name="welcome" width="600px" height="300px" />
```
:::

## 环境变量配置

::: code-group
```ts [.env.development]
NODE_ENV = 'development'

VITE_APP_TITLE = 'VUE3-PC模板(dev)'

VITE_APP_BASE_API = '/dev-api'
```
```ts [.env.production]
NODE_ENV = 'production'

VITE_APP_TITLE = 'VUE3-PC模板(prod)'

VITE_APP_BASE_API = '/prod-api'
```
```ts [.env.test]
NODE_ENV = 'test'

VITE_APP_TITLE = 'VUE3-PC模板(test)'

VITE_APP_BASE_API = '/test-api'
```
:::

修改 `package.json` 的 `scripts` 配置

```json
"build": "run-p type-check \"build-only {@}\" --", // [!code --]
"build:test": "vue-tsc && vite build --mode test", // [!code ++]
"build:pro": "vue-tsc && vite build --mode production", // [!code ++]
```

## UI 组件库

### Element Plus

#### ① 安装与使用

安装 Element Plus
```jsx
pnpm install element-plus
```

按需导入:

```jsx
pnpm add unplugin-vue-components unplugin-auto-import -D
```

```ts
// vite.config.ts
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite' // [!code ++]
import Components from 'unplugin-vue-components/vite' // [!code ++]
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers' // [!code ++]

export default defineConfig({
  // ...
  plugins: [
    vue(),
    AutoImport({ // [!code ++]
      resolvers: [ElementPlusResolver()], // [!code ++]
    }), // [!code ++]
    Components({ // [!code ++]
      resolvers: [ElementPlusResolver()], // [!code ++]
    }), // [!code ++]
  ],
})
```

测试是否生效
```html
<el-button>Default</el-button>
<el-button type="primary">Primary</el-button>
<el-button type="success">Success</el-button>
<el-button type="info">Info</el-button>
<el-button type="warning">Warning</el-button>
<el-button type="danger">Danger</el-button>
```
:::danger 彩蛋
默认 **src/components** 下的文件也会被自动注册✨！
:::

#### ② 国际化

```ts
// main.ts
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

app.use(ElementPlus, {
  locale: zhCn
})
```

测试是否生效

```html
<script lang="ts" setup>
import { ref } from 'vue'
import type { ComponentSize } from 'element-plus'
const currentPage4 = ref(4)
const pageSize4 = ref(100)
const size = ref<ComponentSize>('default')
const background = ref(false)
const disabled = ref(false)

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}
</script>

<template>
  <el-pagination
    v-model:current-page="currentPage4"
    v-model:page-size="pageSize4"
    :page-sizes="[100, 200, 300, 400]"
    :size="size"
    :disabled="disabled"
    :background="background"
    layout="total, sizes, prev, pager, next, jumper"
    :total="400"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>
```

#### ③ 自定义主题

[查看 element-plus 定义好的 scss 变量](https://github.com/element-plus/element-plus/blob/dev/packages/theme-chalk/src/common/var.scss)

在 styles 新建 `element.scss` 和 `main.scss`

::: code-group
```scss [element.scss]
@forward 'element-plus/theme-chalk/src/common/var.scss' with (
  $colors: (
    'primary': (
      'base': green,
    ),
  ),
);
```
```scss [main.scss]
@import 'reset.scss';

:root{
  --cs-plain: red;
}
```
:::

分别导入 `element.scss` 和 `main.scss`

::: code-group
```ts{13} [vite.config.ts]
export default defineConfig({
  // ...
  css: {// [!code ++]
    preprocessorOptions: {// [!code ++]
      scss: {// [!code ++]
        additionalData: `@use "@/styles/element.scss" as *;`// [!code ++]
      }// [!code ++]
    }// [!code ++]
  },// [!code ++]
  plugins: [
    // ...
    Components({
      resolvers: [ElementPlusResolver({ importStyle: 'sass' })]
    })
  ]
})
```
```ts [main.ts]
// 导入样式
import '@/styles/main.scss'
```
:::

测试是否生效

```html
<template>
  <div class="app-page">app pc</div>
  <el-button>Default</el-button>
  <el-button type="primary">Primary</el-button>
  <el-button type="success">Success</el-button>
  <el-button type="info">Info</el-button>
  <el-button type="warning">Warning</el-button>
  <el-button type="danger">Danger</el-button>
</template>

<style lang="scss" scoped>
.app-page {
  color: var(--cs-plain);
}
</style>
```


#### ④ Icon 图标

采取 **自动引入** 的方式，减少打包体积。

::: code-group
```jsx [安装 unplugin-icons 插件]
npm i -D unplugin-icons
```
```ts [修改 vite.config.ts]
import { fileURLToPath, URL } from 'node:url'
import path from 'path' // [!code ++]
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/* 按需导入 Icon 图标 */
import Icons from 'unplugin-icons/vite' // [!code ++]
import IconsResolver from 'unplugin-icons/resolver' // [!code ++]


const pathSrc = fileURLToPath(new URL('./src', import.meta.url)) // [!code ++]

// https://vitejs.dev/config/
export default defineConfig({
  // ...
  plugins: [
    // ...
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'], // [!code ++]
      resolvers: [
        ElementPlusResolver(), 
        // 自动导入图标组件 // [!code ++]
        IconsResolver({ // [!code ++]
          prefix: 'Icon' // [!code ++]
        }) // [!code ++]
      ],
      dts: path.resolve(pathSrc, 'types/auto-imports.d.ts') // [!code ++]
    }),
    Components({
      resolvers: [
        ElementPlusResolver({ importStyle: 'sass' }),
        // 自动注册图标组件 // [!code ++]
        IconsResolver({ // [!code ++]
          enabledCollections: ['ep'] // [!code ++]
        }) // [!code ++]
      ],
      dts: path.resolve(pathSrc, 'types/components.d.ts') // [!code ++]
    }),
    Icons({ // [!code ++]
      autoInstall: true // [!code ++]
    }) // [!code ++]
  ]
})
```
```html [使用图标]
<!-- 格式：`<i-ep-图标名称>` -->
<i-ep-plus />

<!-- 结合 el-icon 使用 -->
<el-icon :size="50">
    <i-ep-edit />
</el-icon>
```
:::

#### ⑤ AutoImport 配置导致 ESLint 报红

> 比如删除 Vue 的 createApp 导入，但发现报红但不报错，推断出是 ESLint 没识别的原因。<br/>
> 这时就需要用到 `.eslintrc-auto-import.json` 文件。

::: code-group
```ts [vite.config.ts]
AutoImport({
  // ...
  dts: path.resolve(pathSrc, 'types/auto-imports.d.ts'),
  /* 解决配置 unplugin-auto-import 后 ESLint 依旧报错 */ // [!code ++]
  eslintrc: { // [!code ++]
    enabled: true, // 仅需开启一次，后面记得关闭 // [!code ++]
    filepath: './.eslintrc-auto-import.json' // [!code ++]
  } // [!code ++]
}),
```
```ts [.eslintrc.cjs]
module.exports = {
  extends: [
    // ...
    './.eslintrc-auto-import.json' // [!code ++]
  ],
}
```
:::

#### ⑥ Message(Box) 样式丢失

```ts
// main.ts
import 'element-plus/theme-chalk/src/message-box.scss' // [!code ++]
import 'element-plus/theme-chalk/src/message.scss' // [!code ++]
import '@/styles/main.scss'
```

#### ⑦ 封装日期格式化函数

element-plus 自带 dayjs 插件，可直接利用它来封装一个日期格式化函数。

```ts
// 新建 `utils/format.ts`
import { dayjs } from 'element-plus'

export const formatTime = (time: dayjs.ConfigType): string =>
  dayjs(time).format('YYYY年MM月DD日')
```

#### ⑧ 富文本编辑器

[VueQuill](https://vueup.github.io/vue-quill/)
```bash
pnpm install @vueup/vue-quill@latest
```
```jsx
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
```
```jsx
<div class="editor">
  <quill-editor
    theme="snow"
    v-model:content="formModel.content"
    contentType="html"
  />
</div>
```
```jsx
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
```


### Vant 4

#### ① 安装使用

安装 `vant`

```jsx
pnpm add vant
```

按需导入

```jsx
pnpm add @vant/auto-import-resolver unplugin-vue-components unplugin-auto-import -D
```
```ts
// vite.config.ts
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite'; // [!code ++]
import Components from 'unplugin-vue-components/vite'; // [!code ++]
import { VantResolver } from '@vant/auto-import-resolver'; // [!code ++]

export default {
  plugins: [
    vue(),
    AutoImport({ // [!code ++]
      resolvers: [VantResolver({ importStyle: false })], // [!code ++]
    }), // [!code ++]
    Components({ // [!code ++]
      resolvers: [VantResolver({ importStyle: false })], // [!code ++]
    }), // [!code ++]
  ],
};
```

在 `main.ts` 一次性导入 vant 全部样式

```ts
// 导入vant组件库样式 // [!code ++]
import 'vant/lib/index.css' // [!code ++]
// 导入自定义样式
import '@/styles/main.scss'
```

测试是否生效
```vue
<script>
import { showConfirmDialog } from 'vant'

showConfirmDialog({
  title: '标题',
  message:
    '如果解决方法是丑陋的，那就肯定还有更好的解决方法，只是还没有发现而已。'
})
  .then(() => {
    // on confirm
  })
  .catch(() => {
    // on cancel
  })
</script>

<template>
  <van-button type="primary" />
</template>
```

发现不报错但报红，参考 `Element Plus` 的 `vite.config.ts` 来配置。

#### ② 浏览器适配

安装 postcss-px-to-viewport-8-plugin 插件

```bash
pnpm add postcss-px-to-viewport-8-plugin -D
```

新建 `postcss.config.cjs`

```js
module.exports = {
  plugins: {
    'postcss-px-to-viewport-8-plugin': {
      viewportWidth: 375
    }
  }
}
```

重启项目，即可生效。

#### ③ 底部安全区适配

```html
<!-- 在 head 标签中添加 meta 标签，并设置 viewport-fit=cover 值 -->
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, viewport-fit=cover"
/>

<!-- 开启顶部安全区适配 -->
<van-nav-bar safe-area-inset-top />

<!-- 开启底部安全区适配 -->
<van-number-keyboard safe-area-inset-bottom />
```

#### ④ 自定义主题

::: code-group
```scss [vant.scss]
:root {
  --van-primary-color: green;
}
```
```scss [main.scss]
@import 'reset.scss';

:root{
  --cs-plain: red;
}
```
```ts [vite.config.ts]
export default defineConfig({
  //...
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/vant.scss" as *;`
      }
    }
  },
})
```
:::

#### ⑤ 常见问题

⚠️在 iOS 上无法触发组件的点击反馈效果？

```html
<body ontouchstart="">
  ...
</body>
```

⚠️在 HTML 中无法正确渲染组件？

答：单标签换为双标签。


## echarts 图标（缩放保持一致）

```html
<script lang="ts" setup>
import Rank from './components/rankView.vue'

let screen = ref()

function getScale(w = 1920, h = 1080) {
  const ww = window.innerWidth / w
  const wh = window.innerHeight / h
  return ww < wh ? ww : wh
}

onMounted(() => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
})

window.onresize = () => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
}
</script>

<template>
  <div class="screen-page">
    <div class="screen" ref="screen">
      <div class="top"></div>
      <div class="bottom">
        <div class="left">left</div>
        <div class="center">center</div>
        <div class="right">
          <Rank />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.screen-page {
  width: 100vw;
  height: 100vh;
  background: url('@/assets/screen_bg.png') no-repeat;
  background-size: cover;
  .screen {
    position: fixed;
    left: 50%;
    top: 50%;
    width: 1920px;
    height: 1080px;
    transform-origin: left top;
    .top {
      width: 100%;
      height: 40px;
    }
    .bottom {
      display: flex;
      .left {
        flex: 1;
        height: 1040px;
        display: flex;
        flex-direction: column;
      }
      .center {
        flex: 1.5;
        display: flex;
        flex-direction: column;
      }
      .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-left: 40px;
      }
    }
  }
}
</style>
```