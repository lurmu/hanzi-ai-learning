# 贡献指南

感谢您对 Hanzi AI Learning 项目的兴趣！

## 如何贡献

### 1. Fork项目

在GitHub上点击Fork按钮创建自己的副本。

### 2. 创建分支

```bash
git checkout -b feature/your-feature-name
```

### 3. 提交更改

```bash
git add .
git commit -m "feat: 添加新功能的简要描述"
```

### 4. 推送到远程

```bash
git push origin feature/your-feature-name
```

### 5. 创建Pull Request

在GitHub上创建Pull Request，描述你的更改。

## 代码规范

### Python
- 使用Black进行代码格式化
- 使用Flake8进行代码检查
- 添加类型提示

```bash
black app/
flake8 app/
mypy app/
```

### JavaScript/TypeScript
- 使用ESLint进行代码检查
- 使用Prettier进行代码格式化

```bash
npm run lint
npm run format
```

## 提交信息规范

使用以下格式编写提交信息：

```
<type>(<scope>): <subject>

<body>

<footer>
```

类型包括：
- `feat` - 新功能
- `fix` - 修复bug
- `docs` - 文档
- `style` - 代码风格
- `refactor` - 重构
- `test` - 测试
- `chore` - 工具

示例：
```
feat(learning): 添加AI分析功能

增加了基于学习数据的AI分析功能，用户可以获得个性化的学习建议。

Fixes #123
```

## 报告问题

在GitHub Issues上报告问题。请包括：

1. 问题描述
2. 重现步骤
3. 预期行为
4. 实际行为
5. 环境信息（OS、浏览器等）

## 功能请求

在GitHub Discussions中提出功能请求。

## 许可证

通过贡献，你同意你的代码在MIT许可证下发布。
