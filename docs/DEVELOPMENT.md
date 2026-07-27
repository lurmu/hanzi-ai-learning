# 开发文档

## 项目结构说明

### Backend (FastAPI)

```
app/
├── api/              # API路由
├── models/           # SQLAlchemy数据库模型
├── schemas/          # Pydantic数据验证模式
├── services/         # 业务逻辑服务
├── core/             # 核心配置和安全
├── db/               # 数据库配置
└── main.py          # FastAPI应用入口
```

### Frontend (React)

```
src/
├── components/       # 可复用React组件
├── pages/            # 页面组件
├── services/         # API调用服务
├── store/            # Zustand状态管理
└── styles/           # Tailwind样式
```

## API端点

### 用户管理
- `POST /api/v1/users/register` - 注册用户
- `POST /api/v1/users/login` - 用户登录
- `GET /api/v1/users/me` - 获取当前用户信息

### 汉字库
- `GET /api/v1/hanzi/` - 获取汉字列表
- `GET /api/v1/hanzi/{id}` - 获取单个汉字

### 学习记录
- `POST /api/v1/learning/record` - 记录学习数据
- `GET /api/v1/learning/stats/{user_id}` - 获取学习统计

### AI分析
- `POST /api/v1/ai/analyze` - 使用DeepSeek分析学习进度
- `GET /api/v1/ai/recommendations/{user_id}` - 获取个性化推荐

## 开发流程

### 1. 后端开发

```bash
cd backend

# 创建虚拟环境
python -m venv venv
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 复制环境变量
cp .env.example .env

# 初始化数据库
python init_db.py

# 启动服务
uvicorn app.main:app --reload
```

访问 http://localhost:8000/docs 查看API文档

### 2. 前端开发

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 深度集成DeepSeek API

### 配置API密钥

1. 访问 https://www.deepseek.com 申请API密钥
2. 在 `backend/.env` 中设置：
   ```env
   DEEPSEEK_API_KEY=your_api_key
   DEEPSEEK_API_URL=https://api.deepseek.com/v1
   DEEPSEEK_MODEL=deepseek-chat
   ```

### AI分析功能

AI服务会分析用户的学习数据，提供：
- 学习水平评估
- 优势和弱点分析
- 个性化学习建议
- 学习策略推荐

## 测试

```bash
# 后端测试
cd backend
pytest

# 前端测试
cd frontend
npm test
```

## 部署

使用Docker Compose一键部署：

```bash
docker-compose up -d
```

## 下一步

1. 填充完整的汉字库（1200+个）
2. 优化AI分析算法
3. 实现WebSocket实时通知
4. 添加更多游戏化学习模式
5. 完善家长监控面板
