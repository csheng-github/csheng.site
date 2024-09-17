# Git 教程

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

## 取消已跟踪的文件

> 当在 `.gitignore` 新增已跟踪的文件，再次提交，发现还是会跟踪提交。

```html
# 指定文件
git rm --cached <filename>

# 指定文件夹
git rm --cached -r <directoryName>
```

## 分支处理

```bash
# 修改分支名称
git branch -m 新分支名称

# 新建并切换分支
git checkout -b 分支名

# 删除分支（-D：强制）
git branch -d 分支名
git branch -D 分支名

# 删除远程分支
git push origin --delete 分支名
git push origin :分支名

# 确认远程分支是否已删除
git remote -v

# 查看远程仓库所有分支的列表
git fetch --prune origin (移除远程未跟踪的分支）
git branch -r
```

## 拉取指定分支

```bash
git clone -b template 地址 （template 是具体分支）

git branch -m template main （修改分支名称）
```

## cherry 拉取指定分支

```bash
git cherry-pick hash值
```
