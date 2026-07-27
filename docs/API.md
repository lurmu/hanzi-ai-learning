# API文档

## 认证

所有需要认证的端点都需要在请求头中包含JWT token：

```
Authorization: Bearer {access_token}
```

## 用户管理

### 注册用户

**请求**
```bash
POST /api/v1/users/register
Content-Type: application/json

{
  "username": "student1",
  "email": "student@example.com",
  "password": "password123",
  "full_name": "张三"
}
```

**响应**
```json
{
  "id": "uuid",
  "username": "student1",
  "email": "student@example.com",
  "full_name": "张三",
  "is_active": true,
  "created_at": "2024-01-15T10:30:00"
}
```

### 用户登录

**请求**
```bash
POST /api/v1/users/login
Content-Type: application/json

{
  "username": "student1",
  "password": "password123"
}
```

**响应**
```json
{
  "access_token": "eyJhbGci...",
  "token_type": "bearer"
}
```

## 汉字库

### 获取汉字列表

**请求**
```bash
GET /api/v1/hanzi/?skip=0&limit=20&difficulty=1
```

**响应**
```json
[
  {
    "id": "hanzi-001",
    "character": "一",
    "pinyin": "yī",
    "english": "one",
    "radical": "一",
    "strokes": 1,
    "difficulty_level": 1,
    "grade_level": "kindergarten",
    "audio_url": null,
    "stroke_order_url": null,
    "frequency": 1.0
  }
]
```

### 获取单个汉字

**请求**
```bash
GET /api/v1/hanzi/hanzi-001
```

## 学习记录

### 记录学习数据

**请求**
```bash
POST /api/v1/learning/record?user_id=user123
Content-Type: application/json

{
  "hanzi_id": "hanzi-001",
  "is_correct": true,
  "time_spent": 5,
  "attempts": 1,
  "confidence": 0.9
}
```

**响应**
```json
{
  "id": "record-001",
  "user_id": "user123",
  "hanzi_id": "hanzi-001",
  "is_correct": true,
  "time_spent": 5,
  "attempts": 1,
  "confidence": 0.9,
  "created_at": "2024-01-15T10:35:00"
}
```

### 获取学习统计

**请求**
```bash
GET /api/v1/learning/stats/user123
```

**响应**
```json
{
  "total_hanzi_learned": 45,
  "accuracy_rate": 85.5,
  "learning_streak": 7,
  "total_study_time": 3600,
  "current_level": 3
}
```

## AI分析

### 分析学习进度

**请求**
```bash
POST /api/v1/ai/analyze?user_id=user123
```

**响应**
```json
{
  "analysis": "学生在汉字学习方面表现出色，准确率为85%...",
  "statistics": {
    "total_attempts": 100,
    "accuracy": 85.0,
    "correct_attempts": 85
  }
}
```

### 获取个性化推荐

**请求**
```bash
GET /api/v1/ai/recommendations/user123
```

**响应**
```json
{
  "recommendations": [
    {
      "type": "review",
      "title": "复习有难度的字",
      "hanzi_ids": ["hanzi-005", "hanzi-010"],
      "reason": "这些字的准确率较低"
    },
    {
      "type": "new",
      "title": "学习新字符",
      "hanzi_ids": ["hanzi-101", "hanzi-102"],
      "reason": "你已准备好进入第3级"
    }
  ]
}
```

## 错误处理

所有错误响应都遵循以下格式：

```json
{
  "detail": "错误描述信息"
}
```

常见错误码：
- `400` - 请求参数错误
- `401` - 未授权（需要登录）
- `404` - 资源不存在
- `500` - 服务器错误
