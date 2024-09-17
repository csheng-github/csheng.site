# HTML & CSS & JavaScript

## HTML

## CSS

### 阴影样式

```css
/* x 偏移量 | y 偏移量 | 阴影模糊半径 | 阴影颜色 */
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
```

### table 布局实现居中

```html
<style>
.box{
  display: table;
  margin: 0 auto;
}
</style>


<div class="box">
    <img src="https://wpimg.wallstcn.com/9679ffb0-9e0b-4451-9916-e21992218054.jpg?imageView2/1/w/80/h/80">
</div>


```

### 响应布局参数

| 参数        |      完整      |  备注 |
| ------------- | :-----------: | ------------- |
| xs      | extra Small  | 超小 |
| sm      |   small           |   小 |
| md |   medium          |    中等 |
| lg |   large           |    大 |
| xl |   extra Large     |    超大 |
| xxl |   extra extra Large    |    特大 |


 

## JavaScript

### !! 和 !!+ 和 ??

① "`!!`" 能将 number 类型 直接转换为 Boolean 类型：

```javascript
const a = '' 或 1 或 '1'
console.log(!!a) //  false true true
```

② "`!!+`” 能将 字符串数字 快速转换为  Boolean 类型：

```javascript
const a = '0'
console.log(!!a) //  true  // [!code error]
console.log(!!+a) // false ✅这才是我们希望的 
```
项目中使用参考：
```javascript
import Cookies from "js-cookie";
 
const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
  },
  device: 'desktop'
}
```

③ "`??`"：空值合并运算符，用于在表达式左侧的表达式求值为 null 或 undefined 时，返回右侧的表达式的值。

```javascript
let foo = null;
let bar = foo ?? 'default';
console.log(bar); // 输出: 'default'
```

### 深拷贝

- ❌JSON 序列化与反序列化：无法处理函数、undefined、Symbol等特殊类型
- ❌lodash 库的 _.cloneDeep：依赖外部库，增加项目体积
- ✅手动遍历对象的属性

```javascript
/**
 * 这只是深拷贝的一个简单版本
 * 有很多边缘情况的bug
 * 如果你想使用一个完美的深拷贝，使用 lodash 的 _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}
```

### 禁止页面缩放

① H5端

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
```

② PC端

::: code-group

```javascript [html项目]
document.addEventListener('mousewheel', function (e) {
  e = e || window.event;
  if ((e.wheelDelta && event.ctrlKey) || e.detail) {
    event.preventDefault();
  }
}, {
  capture: false,
  passive: false
});
```

```javascript [VUE项目(创建)]
// 新建 utils/disableScale.js
const disableScale = (function () {
  function mousewheel(e) {
    if ((e.wheelDelta && e.ctrlKey) || e.detail) {
      e.preventDefault()
    }
  }

  function keydown(e) {
    if (
      (e.ctrlKey === true || e.metaKey === true) &&
      (e.keyCode === 61 ||
        e.keyCode === 107 ||
        e.keyCode === 173 ||
        e.keyCode === 109 ||
        e.keyCode === 187 ||
        e.keyCode === 189 ||
        e.keyCode === 48)
    ) {
      e.preventDefault()
    }
  }

  const addListener = function () {
    document.addEventListener('mousewheel', mousewheel, {
      capture: false,
      passive: false,
    })

    document.addEventListener('keydown', keydown, false)
  }

  const removeListener = function () {
    document.removeEventListener('mousewheel', mousewheel, false)
    document.removeEventListener('keydown', keydown, false)
  }

  return {
    addListener,
    removeListener,
  }
})()

export default disableScale
```
```javascript [VUE项目(使用)]
import disableScale from '@/utils/disableScale'

mounted() {
  disableScale.addListener()
},
beforeDestroy() {
  disableScale.removeListener()
},
```

:::