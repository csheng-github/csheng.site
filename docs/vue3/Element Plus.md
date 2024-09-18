# Element Plus - PC端

## 用到的 TypeScript

form 表单与规则

```html
<script lang="ts" setup>
import { type FormInstance, type FormRules } from "element-plus"

const loginFormRef = ref<FormInstance | null>(null)
const loginFormRules: FormRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  //...
}
</script>

<template>
    <el-form ref="loginFormRef" :rules="loginFormRules" ></el-form>
</template>
```
