# Git 教程

## ai 问答模板

```bash
Git提交规范参考如下：

feat: 增加新的业务功能
fix: 修复业务问题/BUG
perf: 优化性能
style: 更改代码风格, 不影响运行结果
refactor: 重构代码
revert: 撤销更改
test: 测试相关, 不涉及业务代码的更改
docs: 文档和注释相关
chore: 更新依赖/修改脚手架配置等琐事
workflow: 工作流改进
ci: 持续集成相关
types: 类型定义文件更改
wip: 开发中

按照上面的规范，假设我执行了“  ”的操作，那么git提交信息该写什么？
```

## 提交规范

将以下代码粘贴到 `vue` 项目的 `README.md`

```bash
## Git 提交规范参考

- `feat` 增加新的业务功能
- `fix` 修复业务问题/BUG
- `perf` 优化性能
- `style` 更改代码风格, 不影响运行结果
- `refactor` 重构代码
- `revert` 撤销更改
- `test` 测试相关, 不涉及业务代码的更改
- `docs` 文档和注释相关
- `chore` 更新依赖/修改脚手架配置等琐事
- `workflow` 工作流改进
- `ci` 持续集成相关
- `types` 类型定义文件更改
- `wip` 开发中
```

## 复制代码

```bash
# 拉取代码（干净版）
npx tiged 作者/仓库名称 自定义名称

# 复制指定分支的代码
git clone -b 分支名 项目地址
```

## 取消已跟踪的文件

> 当在 `.gitignore` 新增已跟踪的文件，再次提交，发现还是会跟踪提交。

```html
git rm --cached <文件名>
git rm --cached -r <文件夹>
```

## 分支处理

```bash
# 修改分支名称
git branch -m 新分支名称

# 删除本地分支
git branch -d 分支名
git branch -D 分支名

# 删除远程分支
git push origin --delete 分支名
git push origin :分支名

# 同步删除本地缓存的远程分支
git fetch --prune
```

## 拉取指定分支

```bash
git clone -b <指定分支名> <项目地址>

# 修改分支名称
git branch -m <旧名称> <新名称>
```

## cherry 拉取指定分支

```bash
git cherry-pick hash值
```
