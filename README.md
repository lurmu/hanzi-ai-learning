# 汉字AI学习系统 (Hanzi AI Learning)

一个集成DeepSeek AI的儿童汉字学习平台，提供智能学习进度跟踪和个性化学习建议。

## ✨ 功能特性

- 👶 儿童友好的学习界面
- 🤖 基于DeepSeek API的AI智能分析
- 📊 学习进度实时跟踪
- 🎯 个性化学习推荐
- 🔄 自适应难度调整
- 👨‍👩‍👧 家长监控面板
- 📱 多设备支持

## 🏗️ 项目架构

```
hanzi-ai-learning/
├── frontend/          # React前端应用
├── backend/           # FastAPI后端服务
├── data/              # 汉字数据库
├── docker-compose.yml # 容器编排
└── docs/              # 文档
```

## 🚀 快速开始

### 前置要求

- Docker & Docker Compose
- Python 3.11+
- Node.js 18+
- DeepSeek API Key（[申请地址](https://www.deepseek.com)）

### 使用Docker启动（推荐）

```bash
# 1. 克隆项目
git clone https://github.com/lurmu/hanzi-ai-learning.git
cd hanzi-ai-learning

# 2. 创建.env文件
cp backend/.env.example backend/.env
# 编辑backend/.env，填入你的DeepSeek API Key
# DEEPSEEK_API_KEY=your_key_here

# 3. 启动所有服务
docker-compose up -d

# 4. 访问应用
# 前端: http://localhost:3000
# 后端API: http://localhost:8000
# API文档: http://localhost:8000/docs
```

### 本地开发启动

#### 后端

```bash
cd backend

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 设置环境变量
cp .env.example .env
# 编辑.env文件

# 初始化数据库
alembic upgrade head

# 启动服务
uv run uvicorn app.main:app --reload
```

#### 前端

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm start
```

## 📚 API文档

启动后端后，访问 http://localhost:8000/docs 查看Swagger文档。

### 主要端点

- `POST /api/v1/users/register` - 用户注册
- `POST /api/v1/users/login` - 用户登录
- `GET /api/v1/hanzi/{id}` - 获取汉字信息
- `POST /api/v1/learning/record` - 记录学习数据
- `GET /api/v1/learning/stats` - 获取学习统计
- `POST /api/v1/ai/analyze` - AI分析学习进度
- `GET /api/v1/ai/recommendations` - 获取AI推荐

## 📖 项目结构

### Backend (FastAPI)

```
backend/
├── app/
│   ├── models/          # SQLAlchemy数据库模型
│   ├── schemas/         # Pydantic验证模型
│   ├── api/
│   │   ├── users.py     # 用户管理API
│   │   ├── hanzi.py     # 汉字库API
│   │   ├── learning.py  # 学习记录API
│   │   └── ai.py        # AI分析API
│   ├── services/
│   │   ├── ai_service.py        # DeepSeek AI服务
│   │   ├── recommendation.py    # 推荐引擎
│   │   └── analysis.py          # 分析引擎
│   ├── core/
│   │   ├── config.py    # 配置管理
│   │   └── security.py  # 安全认证
│   ├── db/
│   │   └── database.py  # 数据库连接
│   └── main.py          # 应用入口
├── migrations/          # 数据库迁移
├── tests/               # 单元测试
├── requirements.txt     # Python依赖
├── .env.example         # 环境变量示例
└── Dockerfile           # Docker镜像配置
```

### Frontend (React)

```
frontend/
├── src/
│   ├── components/      # UI组件
│   ├── pages/           # 页面
│   ├── hooks/           # 自定义hooks
│   ├── services/        # API服务
│   ├── store/           # Zustand状态管理
│   ├── styles/          # 样式
│   └── App.tsx          # 应用入口
├── public/              # 静态资源
├── package.json
└── Dockerfile
```

## 🔐 环境变量

### Backend (.env)

```env
# 服务器
DEBUG=True
DATABASE_URL=postgresql://user:password@localhost/hanzi_db
REDIS_URL=redis://localhost:6379

# DeepSeek API
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_API_URL=https://api.deepseek.com/v1
DEEPSEEK_MODEL=deepseek-chat

# JWT
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=["http://localhost:3000", "http://localhost"]
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENV=development
```

## 📋 学习路径

1. **第一阶段**: 项目设置 + 基础API
2. **第二阶段**: 前端UI + 学习记录
3. **第三阶段**: DeepSeek AI集成
4. **第四阶段**: 分析引擎 + 推荐系统
5. **第五阶段**: 家长面板 + 报告生成
6. **第六阶段**: 移动端适配 + 优化

## 🧪 测试

```bash
# 后端测试
cd backend
pytest

# 前端测试
cd frontend
npm test
```

## 🐳 Docker命令

```bash
# 查看运行状态
docker-compose ps

# 查看日志
docker-compose logs -f backend
docker-compose logs -f frontend

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 清理所有
docker-compose down -v
```

## 🤝 贡献

欢迎提交 Pull Request！

## 📝 许可证

MIT License

## 📞 联系方式

- GitHub Issues: 提交bug和功能请求
- Discussions: 讨论和分享想法

## 🙏 致谢

- [hanzi-study](https://github.com/dhjz/hanzi-study) - 汉字数据灵感
- [DeepSeek](https://www.deepseek.com) - AI分析引擎
