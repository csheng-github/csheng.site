# Sass 语法

## 使用变量

```scss
$nav-color: #F90;

nav {
  $width: 100px;
  width: $width;
  color: $nav-color;
}
```

## 嵌套CSS规则

子组合选择器和同层组合选择器：>、+和~

```scss
// 同层相邻组合选择器+：选择header元素后紧跟的p元素
header + p { font-size: 1.1em }

// 同层全体组合选择器~：选择所有跟在article后的同层article元素
article ~ article { border-top: 1px dashed #ccc }
```

嵌套属性

```scss
// ❌原版
nav {
  border-style: solid;
  border-width: 1px;
  border-color: #ccc;
}

// ✅改版
nav {
  border: {
  style: solid;
  width: 1px;
  color: #ccc;
  }
}
```

## 导入SASS文件

```scss
@import "themes/night-sky";
```

## 混合器

不带参数

```scss{1,8}
@mixin backgroundImage {
  background-image: url('img.png');
  background-repeat: no-repeat;
  background-size: 100%;
}

.animal {
  @include backgroundImage;
}
```

带参数

```scss{1,2,8}
@mixin backgroundImage($url) {
  background-image: url($url);
  background-repeat: no-repeat;
  background-size: 100%;
}

.animal {
  @include backgroundImage("@/assets/login/logo.png");
}
```