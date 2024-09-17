# VUE3 <Badge type="tip" text="基础" />

## 创建项目

Node.js：`18.3+`

```bash
pnpm create vue@latest
```

## 基础

### 模板语法（v-bind）

```html{10}
<script lang="ts" setup>
const objectOfAttrs = {
  id: 'container',
  class: 'wrapper',
  style: 'background-color:green'
}
</script>

<template>
  <div v-bind="objectOfAttrs"></div>
</template>
```

### 响应式基础（ref）

::: code-group
```ts{4} [DOM更新时机]
const count = ref(0)
const changeCount = async () => {
  count.value++
  await nextTick()
  console.log('DOM已更新')
}
```
```ts{1,3} [ref]
const count = ref(0)
const changeCount = () => {
  count.value++
}
```
:::

### 计算属性（computed）

> 使用计算属性来描述 **依赖响应式状态** 的复杂逻辑，会基于其响应式依赖被 **缓存**，默认 **只读**。

::: code-group
```ts [基本示例]
const author = ref({
  name: 'John Doe',
  books: ['西游记', '水浒传', '红楼梦']
})

const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? 'Yes' : 'No'
})
```
```ts [可写计算属性]
const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  get() {
    return firstName.value + ' ' + lastName.value
  },
  set(newValue) {
    // 注意：我们这里使用的是解构赋值语法
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})
```
:::

### 类与样式绑定

::: code-group
```html [动态样式]
<!-- 对象：单个动态 或者 多个动态 -->
<div :class="{ active: isActive }"></div>
<div :class="{ active: isActive, 'text-danger': hasError }"></div>

<!-- 数组：单个动态 + 静态 样式 -->
<div :class="[isActive ? activeClass : '', errorClass]"></div>
```
```html [组件上使用]
<!-- 父组件：传递类名 -->
<MyComponent class="baz" />

<!-- 子组件：在指定位置接收类名 -->
<p :class="$attrs.class">Hi!</p>
<span>我是子组件</span>
```
:::

### 列表渲染（v-for）

展示过滤或排序后的结果：`computed` 搭配 **数组方法** 使用

```ts
const numbers = ref([1, 2, 3, 4, 5])

const evenNumbers = computed(() => {
  // 过滤
  return numbers.value.filter((n) => n % 2 === 0)
  // 排序：reverse 和 sort 将变更原始数组，需创建一个原数组的副本
  return [...numbers.value].reverse()
  return [...numbers.value].sort()
})
```

### 事件处理

::: code-group
```html [事件修饰符]
<!-- 单击事件将停止传递 -->
<a @click.stop="doThis"></a>

<!-- 提交事件将不再重新加载页面 -->
<form @submit.prevent="onSubmit"></form>

<!-- 修饰语可以使用链式书写 -->
<a @click.stop.prevent="doThat"></a>

<!-- 也可以只有修饰符 -->
<form @submit.prevent></form>

<!-- 仅当 event.target 是元素本身时才会触发事件处理器 -->
<!-- 例如：事件处理器不来自子元素 -->
<div @click.self="doThat">...</div>

<!-- 单击事件将停止传递 -->
<a @click.stop="doThis"></a>

<!-- 提交事件将不再重新加载页面 -->
<form @submit.prevent="onSubmit"></form>

<!-- 修饰语可以使用链式书写 -->
<a @click.stop.prevent="doThat"></a>

<!-- 也可以只有修饰符 -->
<form @submit.prevent></form>

<!-- 📱仅当 event.target 是元素本身时才会触发事件处理器 -->
<!-- 例如：事件处理器不来自子元素 -->
<div @click.self="doThat">...</div>
```
```html [按键修饰符]
<!-- 仅在 `key` 为 `Enter` 时调用 `submit` -->
<input @keyup.enter="submit" />
<!-- 直接使用 KeyboardEvent.key 暴露的按键名称作为修饰符 -->
<input @keyup.page-down="onPageDown" />

<!-- Alt + Enter -->
<input @keyup.alt.enter="clear" />

<!-- Ctrl + 点击 -->
<div @click.ctrl="doSomething">Do something</div>

<!-- 当按下 Ctrl 时，即使同时按下 Alt 或 Shift 也会触发 -->
<button @click.ctrl="onClick">A</button>

<!-- 仅当按下 Ctrl 且未按任何其他键时才会触发 -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- 仅当没有按下任何系统按键时触发 -->
<button @click.exact="onClick">A</button>
```
:::

### 表单输入绑定

① 值绑定

::: code-group
```vue [复选框]
<div>Checked names: {{ checkedNames }}</div>

<input type="checkbox" id="jack" value="Jack" v-model="checkedNames" />
<label for="jack">Jack</label>

<input type="checkbox" id="john" value="John" v-model="checkedNames" />
<label for="john">John</label>

<input type="checkbox" id="mike" value="Mike" v-model="checkedNames" />
<label for="mike">Mike</label>
```
```vue [单选按钮]
<div>Picked: {{ picked }}</div>

<input type="radio" id="one" value="One" v-model="picked" />
<label for="one">One</label>

<input type="radio" id="two" value="Two" v-model="picked" />
<label for="two">Two</label>
```
```html [选择器]
<!-- 如果 v-model 表达式的初始值不匹配任何一个选择项，
  <select> 元素会渲染成一个“未选择”的状态。
  在 iOS 上，这将导致用户无法选择第一项，
  因为 iOS 在这种情况下不会触发一个 change 事件。
  因此，我们建议提供一个空值的禁用选项，如下面的例子所示。 -->
<div>Selected: {{ selected }}</div>

<select v-model="selected">
  <option disabled value="">Please select one</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```
:::

② 修饰符

::: code-group
```vue [.lazy]
<!-- 在 "change" 事件后同步更新而不是 "input" -->
<input v-model.lazy="msg" />
```
```vue [.number]
<input v-model.number="age" />
```
```vue [.trim]
<input v-model.trim="msg" />
```
:::

### 生命周期
> 创建阶段：`setup` <br/>
> 挂载阶段：`onBeforeMount`、`onMounted`⭐ <br/>
> 更新阶段：`onBeforeUpdate`、`onUpdated`⭐ <br/>
> 卸载阶段：`onBeforeUnmount`⭐、`onUnmounted`

```typescript
// 生命周期钩子
onBeforeMount(() => {
  console.log("挂载之前");
});
onMounted(() => {
  console.log("挂载完毕");
});
onBeforeUpdate(() => {
  console.log("更新之前");
});
onUpdated(() => {
  console.log("更新完毕");
});
onBeforeUnmount(() => {
  console.log("卸载之前");
});
onUnmounted(() => {
  console.log("卸载完毕");
});
```

### 侦听器（watch）

::: code-group
```ts [基本示例]
const x = ref(0)
const y = ref(0)
const obj = reactive({ count: 0 })

// 单个 ref
watch(x, (newX) => {
  console.log(`x is ${newX}`)
})

// getter 函数
watch(
  () => obj.count,
  (count) => {
    console.log(`Count is: ${count}`)
  }
)
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`sum of x + y is: ${sum}`)
  }
)

// 多个来源组成的数组
watch([x, () => y.value], ([newX, newY]) => {
  console.log(`x is ${newX} and y is ${newY}`)
})
```
```ts [深层/即时回调/一次性 侦听器]
watch(
  source,
  (newValue, oldValue) => { },
  { deep: true, immediate: true, once: true }
)
```
```ts [watchEffect 简写]
/* ❌watch 写法 */
watch(
  todoId,
  async () => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId.value}`)
    data.value = await response.json()
  },
  { immediate: true }
)

/* ✅用 watchEffect 简化上面的写法 */
watchEffect(async () => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId.value}`)
  data.value = await response.json()
})
```
:::

### 模板引用

::: code-group
```vue [访问模板引用]
<script setup>
const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<template>
  <input ref="inputRef" />
</template>
```
```vue [v-for 中的模板引用]
<script setup>
import { ref, onMounted } from 'vue'

const list = ref([
  /* ... */
])

const itemRefs = ref([])

onMounted(() => console.log(itemRefs.value))
</script>

<template>
  <ul>
    <li v-for="item in list" ref="itemRefs">
      {{ item }}
    </li>
  </ul>
</template>
```
```vue [组件上的 ref]
<script setup>
import { ref, onMounted } from 'vue'
import Child from './Child.vue'

const child = ref(null)

onMounted(() => {
  // child.value 是 <Child /> 组件的实例
})
</script>

<template>
  <Child ref="child" />
</template>
```
:::

## 深入组件

### 注册

::: code-group
```ts [全局注册]
// main.ts
import ComponentA from './components/ComponentA'
import ComponentB from './components/ComponentB'
import ComponentC from './components/ComponentC'

app
  .component('ComponentA', ComponentA)
  .component('ComponentB', ComponentB)
  .component('ComponentC', ComponentC)
```
```vue [局部注册]
<script setup>
import ComponentA from './ComponentA.vue'
</script>

<template>
  <ComponentA />
</template>
```
:::

### Props & 事件

**① Props（父传子）**

::: code-group
```ts [Props声明]
defineProps<{
  title?: string
  likes?: number
}>()
```
```ts [Props带默认值]
withDefaults(
  defineProps<{
    foo: string
    bar?: number
  }>(),
  {
    foo: 'hello',
    bar: 18
  }
)
```
:::

**② 事件（子传父）**

::: code-group
```ts [基本用法]
defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
```
```ts [3.3+新语法]
defineEmits<{
  change: [id: number]
  update: [value: string]
}>()
```
:::


### 组件 v-model

::: code-group
```vue [单个 v-model]
<!-- 父组件 -->
<Child v-model="count" />

<!-- 子组件 -->
<script lang="ts" setup>
const model = defineModel()

const update = () => {
  model.value++
}
</script>
```
```vue [多个 v-model]
<!-- 父组件 -->
<Child v-model:first-name="first" v-model:last-name="last" />

<!-- 子组件 -->
<script lang="ts" setup>
const firstName = defineModel('firstName')
const lastName = defineModel('lastName')
</script>
```
```vue [v-model 修饰符]
<!-- 父组件 -->
<Child v-model.capitalize="myName" />

<!-- 子组件 -->
<script lang="ts" setup>
const [model, modifiers] = defineModel({
  set(value) {
    if (modifiers.capitalize) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
    return value
  }
})
</script>
```
```vue [带参数的 v-model 修饰符]
<!-- 父组件 -->
<Child v-model:first-name.capitalize="first" v-model:last-name.uppercase="last" />

<!-- 子组件 -->
<script lang="ts" setup>
const [firstName, firstNameModifiers] = defineModel('firstName')
const [lastName, lastNameModifiers] = defineModel('lastName')

console.log(firstNameModifiers) // { capitalize: true }
console.log(lastNameModifiers) // { uppercase: true }
</script>
```
:::

### 透传 Attributes

::: code-group
```vue [禁用 Attributes 继承]
<!-- 父组件 -->
<Child class="foo" />

<!-- 子组件 -->
<script lang="ts" setup>
defineOptions({
  inheritAttrs: false
})
</script>

<template>
  <div class="child1">child1</div>
  <div :class="['child2', $attrs.class]">child2</div>
</template>
```
```vue [多根节点的 Attributes 继承]
<!-- 父组件 -->
<Child id="child" />

<!-- 子组件 -->
<header>...</header>
<main v-bind="$attrs">...</main>
<footer>...</footer>
```
```ts [在 JavaScript 中访问透传 Attributes]
// 子组件
import { useAttrs } from 'vue'

const attrs = useAttrs()
```
:::

### 插槽（slot）

::: code-group
```html [默认插槽]
<!-- 父组件 -->
<Child />

<!-- 子组件 -->
<div class="child">
  <slot>默认内容</slot>
</div>
```
```html [具名插槽]
<!-- 父组件 -->
<Child>
  <template #header>
    <h1>头部</h1>
  </template>
  <template #default>
    <p>默认内容</p>
  </template>
  <template #footer>
    <p>底部</p>
  </template>
</Child>

<!-- 子组件 -->
<div class="child">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```
```vue [条件插槽]
<!-- 子组件 -->
<template>
  <div class="card">
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>
    <div v-if="$slots.default" class="card-content">
      <slot />
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>
```
```vue [作用域插槽]
<!-- 父组件 -->
<Child v-slot="slotProps">
  {{ slotProps.text }} {{ slotProps.count }}
</Child>

<!-- 子组件 -->
<slot :text="greetingMessage" :count="1"></slot>
```
```html [作用域插槽(案例)]
<!-- 父组件 -->
<FancyList :api-url="url" :per-page="10">
  <template #item="{ body, username, likes }">
    <div class="item">
      <p>{{ body }}</p>
      <p>by {{ username }} | {{ likes }} likes</p>
    </div>
  </template>
</FancyList>

<!-- 子组件 -->
<ul>
  <li v-for="item in items">
    <slot name="item" v-bind="item"></slot>
  </li>
</ul>
```
:::

### 依赖注入（provide/inject）

::: code-group
```ts [基本使用]
// 供给方（组件）
provide('message', 'hello')
// 供给方（应用层）
app.provide('message', 'hello!')

// 注入方
const message = inject('message') // 写法1
const message = inject('message', '默认值') // 写法2
```
```ts [和响应式数据配合使用]
// 供给方
const location = ref('North Pole')
const updateLocation = () => {
  location.value = 'South Pole'
}
provide('location', { location,updateLocation })

// 注入方
const { location, updateLocation } = inject('location')
```
```ts [供给方的数据仅可读]
const count = ref(0)
provide('read-only-count', readonly(count))
```
```ts [使用 Symbol 作注入名]
// keys.js：统一存放独一无二的键名
export const myInjectionKey = Symbol()

// 供给方
import { myInjectionKey } from './keys.js'
provide(myInjectionKey, {  });

// 注入方
import { myInjectionKey } from './keys.js'
const injected = inject(myInjectionKey)
```
:::

### 异步组件

```vue
<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'

const Child = defineAsyncComponent(() => import('@/components/ComponentA.vue'))
</script>

<template>
  <div class="about">
    <h1>This is an about page</h1>
    <Suspense>
      <template #default>
        <Child />
      </template>
      <template #fallback>
        <h3>请稍等</h3>
      </template>
    </Suspense>
  </div>
</template>
```

## 逻辑复用

### 组合式函数（useXXX）

**① 鼠标跟踪器示例1**

::: code-group
```ts [hooks/mouse.ts]
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  function update(event: MouseEvent) {
    x.value = event.pageX
    y.value = event.pageY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  return { x, y }
}
```
```ts [任意组件使用]
import { useMouse } from './hooks/mouse'

const { x, y } = useMouse()
```
:::

**② 鼠标跟踪器示例2（再优化）**

::: code-group
```ts [hooks/event.ts]
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target, event, callback) {
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}
```
```ts [hooks/mouse.ts]
import { ref } from 'vue'
import { useEventListener } from './event'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  useEventListener(window, 'mousemove', (event) => {
    x.value = event.pageX
    y.value = event.pageY
  })

  return { x, y }
}
```
:::

**③ 异步状态示例1**

::: code-group
```ts [hooks/fetch.ts]
import { ref } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  fetch(url)
    .then((res) => res.json())
    .then((json) => (data.value = json))
    .catch((err) => (error.value = err))

  return { data, error }
}
```
```ts [组件中使用]
import { useFetch } from '@/hooks/fetch.ts'

const { data, error } = useFetch('https://request/api')
```
:::

**④ 异步状态示例2（再优化）**

::: code-group
```ts [hooks/fetch.ts]
import { ref, watchEffect, toValue } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  const fetchData = () => {
    data.value = null
    error.value = null

    fetch(toValue(url))
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err))
  }

  watchEffect(() => {
    fetchData()
  })

  return { data, error }
}
```
:::

### 自定义指令（v-xxx）

::: code-group
```vue{2-6,10} [基本使用]
<script lang="ts" setup>
const vFocus = {
  mounted: (el: HTMLInputElement) => {
    el.focus()
  }
}
</script>

<template>
  <input type="text" v-focus />
</template>
```
```ts{4-8} [全局指令]
const app = createApp({})

// 使 v-focus 在所有组件中都可用
app.directive('focus', {
  mounted: (el: HTMLInputElement) => {
    el.focus()
  }
})
```
```ts [指令钩子]
const myDirective = {
  // 在绑定元素的 attribute 前
  // 或事件监听器应用前调用
  created(el, binding, vnode) {
    // 下面会介绍各个参数的细节
  },
  // 在元素被插入到 DOM 前调用
  beforeMount(el, binding, vnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都挂载完成后调用
  mounted(el, binding, vnode) {},
  // 绑定元素的父组件更新前调用
  beforeUpdate(el, binding, vnode, prevVnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都更新后调用
  updated(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件卸载前调用
  beforeUnmount(el, binding, vnode) {},
  // 绑定元素的父组件卸载后调用
  unmounted(el, binding, vnode) {}
}
```
```vue [简化形式]
<!-- 仅仅需要在 mounted 和 updated 上实现相同的行为 -->
<div v-color="color"></div>

app.directive('color', (el, binding) => {
  el.style.color = binding.value
})
```
```vue [对象字面量]
<div v-demo="{ color: 'white', text: 'hello!' }"></div>

app.directive('demo', (el, binding) => {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text) // => "hello!"
})
```
:::

### 插件（Plugins）

**① 编写一个插件**

::: code-group
```ts [plugins/i18n.ts]
import type { App } from 'vue'

export default {
  install: (app: App, options: Record<string, any>) => {
    app.config.globalProperties.$translate = (key: string) => {
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, options)
    }
  }
}
```
```ts [main.ts]
import i18nPlugin from '@/plugins/i18n'

app.use(i18nPlugin, {
  greetings: {
    hello: 'csheng!'
  }
})
```
```vue [组件中使用]
<h1>{{ $translate('greetings.hello') }}</h1>
```
:::

**② 插件中的 Provide / Inject**

::: code-group
```ts [plugins/i18n.ts]
import type { App } from 'vue'

export default {
  install: (app: App, options: Record<string, any>) => {
    app.provide('i18n', options)
  }
}
```
```ts [main.ts]
app.use(i18nPlugin, {
  greetings: {
    hello: 'csheng!'
  }
})
```
```ts [组件中使用]
const i18n = inject('i18n') 
console.log(i18n.greetings.hello)
```
:::

## 内置组件

### Transition（过渡）

① **Transition**

::: code-group
```vue [基本使用]
<Transition>
  <p>hello</p>
</Transition>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
```
```vue [自定义类名]
<Transition name="csheng">
  <p>hello</p>
</Transition>

<style lang="scss" scoped>
.csheng-enter-active,
.csheng-leave-active {
  transition: opacity 0.5s ease;
}

.csheng-enter-from,
.csheng-leave-to {
  opacity: 0;
}
</style>
```
```vue [出现时过渡]
<Transition appear>
  ...
</Transition>
```
```vue [过渡模式]
<Transition mode="out-in">
  ...
</Transition>
```
```vue [组件间过渡]
<Transition name="fade" mode="out-in">
  <component :is="activeComponent"></component>
</Transition>
```
```vue [使用 Key Attribute 过渡]
<script lang="ts" setup>
const count = ref(0);
setInterval(() => count.value++, 1000);
</script>

<template>
  <Transition>
    <span :key="count">{{ count }}</span>
  </Transition>
</template>
```
:::

② **TransitionGroup**

```vue 
<script lang="ts" setup>
import { ref } from 'vue'

const items = ref([1, 2, 3, 4, 5])
</script>

<template>
  <TransitionGroup name="list" tag="ul">
    <li v-for="item in items" :key="item">
      {{ item }}
    </li>
  </TransitionGroup>
</template>

<style lang="scss" scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
```

### KeepAlive（缓存）

::: code-group
```vue [基本使用]
<KeepAlive>
  <component :is="activeComponent" />
</KeepAlive>
```
```vue [包含/排除]
<KeepAlive :include="['a', 'b']">
  <component :is="view" />
</KeepAlive>
```
```vue [最大缓存实例数]
<KeepAlive :max="10">
  <component :is="activeComponent" />
</KeepAlive>
```
```ts [生命周期]
onActivated(() => {
  // 调用时机为首次挂载
  // 以及每次从缓存中被重新插入时
})

onDeactivated(() => {
  // 在从 DOM 上移除、进入缓存
  // 以及组件卸载时调用
})
```
:::

### Teleport（传输）

::: code-group
```html{4} [基本使用]
<template>
  <!-- 弹窗 -->
  <Teleport to="body">
    <div v-if="open" class="modal">
      ...
    </div>
  </Teleport>
</template>
```
```html [禁用 Teleport]
<Teleport :disabled="isMobile">
  ...
</Teleport>
```
```html [多个 Teleport 共享目标]
<Teleport to="#modals">
  <div>A</div>
</Teleport>
<Teleport to="#modals">
  <div>B</div>
</Teleport>

<!-- 最终渲染的结构 -->
<div id="modals">
  <div>A</div>
  <div>B</div>
</div>
```
:::

## TypeScript

::: code-group
```ts [ref]
const year = ref<string | number>('2020')
```
```html{3} [事件处理函数]
<script setup lang="ts">
const handleChange = (event: Event) => {
  console.log((event.target as HTMLInputElement).value)
}
</script>

<template>
  <input type="text" @change="handleChange" />
</template>
```
```html [模板]
<script setup lang="ts">
const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<template>
  <input ref="inputRef" />
</template>
```
:::
