# 100种不可思议旅行 — API 契约

> 风格：轻量级 JSON REST API，语义化 URL，状态码符合 HTTP 规范。所有时间戳采用 ISO 8601 格式（UTC）。

---

## 1. 获取旅行列表

### GET /api/travels

获取旅行项目列表，支持分页、筛选与排序。

#### 请求参数（Query）

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `page` | `integer` | 否 | `1` | 页码 |
| `per_page` | `integer` | 否 | `10` | 每页条数，上限 `50` |
| `category` | `string` | 否 | | 分类过滤：`landscape` / `culture` / `art` / `adventure` / `healing` |
| `tag` | `string` | 否 | | 标签过滤（精确匹配单个标签） |
| `min_rarity` | `integer` | 否 | `1` | 最小小众度（1-10） |
| `sort_by` | `string` | 否 | `created_at` | 排序字段：`created_at` / `rarity_score` / `visual_impact` / `healing_vibe` / `check_in_count` |
| `sort_order` | `string` | 否 | `desc` | 排序方向：`asc` / `desc` |

#### 请求示例

```http
GET /api/travels?page=1&per_page=6&min_rarity=7&sort_by=visual_impact&sort_order=desc
```

#### 响应 200 OK

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "list": [
      {
        "id": 1,
        "title": "冰岛高地蓝火山温泉",
        "slug": "iceland-highland-blue-lagoon",
        "subtitle": "在火山与冰川的裂缝中，泡进一池不真实的蓝",
        "location": "冰岛 · 高地",
        "cover_image_url": "https://cdn.example.com/travels/iceland-blue-lagoon-cover.jpg",
        "rarity_score": 9,
        "visual_impact": 10,
        "healing_vibe": 9,
        "tags": ["温泉", "火山", "北欧", "孤独", "航拍"],
        "category": "landscape",
        "difficulty": "hard",
        "check_in_count": 1284,
        "emotion_count": 3567
      }
    ],
    "pagination": {
      "page": 1,
      "per_page": 6,
      "total": 42,
      "total_pages": 7
    }
  }
}
```

#### 错误响应

```json
// 400 Bad Request
{
  "code": 400001,
  "message": "参数错误：min_rarity 必须在 1-10 之间"
}

// 500 Internal Server Error
{
  "code": 500001,
  "message": "服务器内部错误"
}
```

---

## 2. 获取旅行详情

### GET /api/travels/:slug

获取单个旅行项目的完整详情。

#### 路径参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `slug` | `string` | 旅行项目 URL 标识 |

#### 请求示例

```http
GET /api/travels/iceland-highland-blue-lagoon
```

#### 响应 200 OK

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "id": 1,
    "title": "冰岛高地蓝火山温泉",
    "slug": "iceland-highland-blue-lagoon",
    "subtitle": "在火山与冰川的裂缝中，泡进一池不真实的蓝",
    "description": "冰岛高地深处，火山活动与千年冰川共同雕刻出一片隐秘的蓝...",
    "location": "冰岛 · 高地",
    "coordinates": { "lat": 64.8, "lng": -19.0 },
    "cover_image_url": "https://cdn.example.com/travels/iceland-blue-lagoon-cover.jpg",
    "gallery_urls": [
      "https://cdn.example.com/travels/iceland-blue-lagoon-1.jpg",
      "https://cdn.example.com/travels/iceland-blue-lagoon-2.jpg"
    ],
    "video_url": "https://cdn.example.com/travels/iceland-blue-lagoon-drone.mp4",
    "rarity_score": 9,
    "visual_impact": 10,
    "healing_vibe": 9,
    "tags": ["温泉", "火山", "北欧", "孤独", "航拍"],
    "category": "landscape",
    "difficulty": "hard",
    "best_season": "6月-8月",
    "estimated_days": 3,
    "check_in_count": 1284,
    "emotion_count": 3567,
    "created_at": "2025-01-15T08:30:00Z",
    "updated_at": "2025-03-20T14:22:00Z"
  }
}
```

#### 错误响应

```json
// 404 Not Found
{
  "code": 404001,
  "message": "旅行项目不存在"
}
```

---

## 3. 提交打卡

### POST /api/travels/:slug/check-in

用户对某一旅行项目进行「打卡」。同一用户对同一项目仅能打卡一次。

#### 路径参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `slug` | `string` | 旅行项目 URL 标识 |

#### 请求头

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

#### 请求体

```json
{
  "is_public": true
}
```

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `is_public` | `boolean` | 否 | `true` | 打卡记录是否公开 |

#### 响应 201 Created

```json
{
  "code": 0,
  "message": "打卡成功",
  "data": {
    "interaction_id": 1024,
    "travel_item_id": 1,
    "type": "check_in",
    "is_public": true,
    "created_at": "2025-05-20T06:15:30Z"
  }
}
```

#### 错误响应

```json
// 401 Unauthorized
{
  "code": 401001,
  "message": "未登录或登录已过期"
}

// 409 Conflict
{
  "code": 409001,
  "message": "已打卡，无需重复操作"
}

// 404 Not Found
{
  "code": 404001,
  "message": "旅行项目不存在"
}
```

---

## 4. 提交情绪共鸣

### POST /api/travels/:slug/emotion

用户对旅行项目发表「情绪共鸣」评论，支持选择情绪标签。

#### 路径参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `slug` | `string` | 旅行项目 URL 标识 |

#### 请求头

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

#### 请求体

```json
{
  "content": "看到这片蓝的时候，我忽然原谅了去年所有熬过的夜。",
  "emotion_tag": "healed",
  "is_public": true
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `content` | `string` | **是** | 共鸣文字内容，长度限制 10-280 字符 |
| `emotion_tag` | `string` | **是** | 情绪标签：`amazed` / `healed` / `inspired` / `wanderlust` / `melancholy` |
| `is_public` | `boolean` | 否 | 是否公开，默认 `true` |

#### 响应 201 Created

```json
{
  "code": 0,
  "message": "情绪共鸣已发布",
  "data": {
    "interaction_id": 2048,
    "travel_item_id": 1,
    "type": "emotion_note",
    "content": "看到这片蓝的时候，我忽然原谅了去年所有熬过的夜。",
    "emotion_tag": "healed",
    "is_public": true,
    "created_at": "2025-05-20T06:18:45Z"
  }
}
```

#### 错误响应

```json
// 400 Bad Request
{
  "code": 400002,
  "message": "内容长度需在 10-280 字符之间"
}

// 400 Bad Request
{
  "code": 400003,
  "message": "emotion_tag 值不合法"
}

// 401 Unauthorized
{
  "code": 401001,
  "message": "未登录或登录已过期"
}
```

---

## 5. 获取情绪共鸣列表

### GET /api/travels/:slug/emotions

获取某一旅行项目的公开情绪共鸣列表。

#### 请求参数（Query）

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `page` | `integer` | 否 | `1` | 页码 |
| `per_page` | `integer` | 否 | `20` | 每页条数，上限 `50` |
| `emotion_tag` | `string` | 否 | | 按情绪标签过滤 |

#### 响应 200 OK

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "list": [
      {
        "interaction_id": 2048,
        "user": {
          "id": 42,
          "nickname": "蓝调收集者",
          "avatar_url": "https://cdn.example.com/avatars/u42.jpg",
          "archetype": "visual_hunter"
        },
        "content": "看到这片蓝的时候，我忽然原谅了去年所有熬过的夜。",
        "emotion_tag": "healed",
        "created_at": "2025-05-20T06:18:45Z"
      }
    ],
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 3567,
      "total_pages": 179
    }
  }
}
```

---

## 通用规范

### 响应包装

所有成功与错误响应均采用统一包装结构：

```json
{
  "code": 0,        // 业务状态码：0 表示成功，非 0 表示具体错误
  "message": "ok",  // 人类可读描述
  "data": {}        // 业务数据（错误时可能为 null 或省略）
}
```

### 认证方式

当前 MVP 阶段采用 `Bearer Token` JWT 认证。未登录用户可浏览列表与详情，但打卡与情绪共鸣需登录。

### 分页规范

- 服务端必须返回 `pagination` 对象
- `total_pages` 由服务端计算：`ceil(total / per_page)`
- 越界请求返回空数组（`list: []`），不返回错误
