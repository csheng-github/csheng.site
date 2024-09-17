# 前端素材

## 在线图片

直接访问的图片：

```js
https://wpimg.wallstcn.com/9679ffb0-9e0b-4451-9916-e21992218054.jpg
https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif
```

后缀拼接：

```js
?imageView2/1/w/80/h/80
?imageView2/2/h/440
```

## ChatGpt 提问模板

```
请基于 elementPlus 和 Vue3 的语法，生成组件代码
要求：
一、表单结构要求
1. 组件中包含一个el-form表单，有四行内容，前三行是表单输入框，第四行是两个按钮
2. 第一行 label 原密码
3. 第二行 label 新密码
4. 第三行 label 确认密码
5. 第四行两个按钮，修改密码 和 重置

二、form绑定字段如下：
const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})

三、校验需求
所有字段，都是 6-15位 非空
自定义校验1：原密码 和 新密码不能一样
自定义校验2：新密码 和 确认密码必须一样
```