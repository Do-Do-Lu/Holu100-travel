# 100种不可思议旅行 — 数据库 Schema 设计

> 设计原则：轻量、可扩展、与 SQLite 原生特性兼容。所有外键均建立索引，JSON 字段以 `TEXT` 存储并在应用层解析。

---

## 1. travel_items（旅行项目表）

存储每一条「不可思议旅行」的核心内容元数据。

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` | 主键 |
| `title` | `TEXT` | `NOT NULL` | 项目标题，如「冰岛高地蓝火山温泉」 |
| `slug` | `TEXT` | `UNIQUE NOT NULL` | URL 友好标识，如 `iceland-highland-blue-lagoon` |
| `subtitle` | `TEXT` | | 一句话副标题，用于卡片展示 |
| `description` | `TEXT` | `NOT NULL` | 详细内容正文（Markdown 格式） |
| `location` | `TEXT` | `NOT NULL` | 地理位置，如「冰岛 · 高地」 |
| `coordinates` | `TEXT` | | 经纬度 JSON，`{"lat": 64.8, "lng": -19.0}` |
| `cover_image_url` | `TEXT` | `NOT NULL` | 封面主图高分辨率 URL |
| `gallery_urls` | `TEXT` | | 画廊图片 URL 数组 JSON |
| `video_url` | `TEXT` | | 短视频或航拍视频 URL（可选） |
| `rarity_score` | `INTEGER` | `CHECK(rarity_score BETWEEN 1 AND 10)` | 小众度：1=大众化，10=极致隐秘 |
| `visual_impact` | `INTEGER` | `CHECK(visual_impact BETWEEN 1 AND 10)` | 视觉冲击力：1=日常，10=震撼 |
| `healing_vibe` | `INTEGER` | `CHECK(healing_vibe BETWEEN 1 AND 10)` | 治愈度：1=刺激冒险，10=极致治愈 |
| `tags` | `TEXT` | | 标签数组 JSON，如 `["温泉","火山","北欧","孤独","航拍"]` |
| `category` | `TEXT` | `NOT NULL DEFAULT 'landscape'` | 分类：`landscape` / `culture` / `art` / `adventure` / `healing` |
| `difficulty` | `TEXT` | `DEFAULT 'moderate'` | 抵达难度：`easy` / `moderate` / `hard` / `extreme` |
| `best_season` | `TEXT` | | 最佳季节，如「6月-8月」 |
| `estimated_days` | `INTEGER` | | 建议停留天数 |
| `is_published` | `INTEGER` | `DEFAULT 1` | 是否上线：1=发布，0=草稿 |
| `created_at` | `DATETIME` | `DEFAULT CURRENT_TIMESTAMP` | 创建时间 |
| `updated_at` | `DATETIME` | `DEFAULT CURRENT_TIMESTAMP` | 更新时间 |

### 索引
```sql
CREATE INDEX idx_travel_items_slug ON travel_items(slug);
CREATE INDEX idx_travel_items_category ON travel_items(category);
CREATE INDEX idx_travel_items_scores ON travel_items(rarity_score, visual_impact, healing_vibe);
CREATE INDEX idx_travel_items_published ON travel_items(is_published);
```

---

## 2. users（用户表）

对应目标人群分类，极简设计，避免过度收集。

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` | 主键 |
| `openid` | `TEXT` | `UNIQUE` | 微信/第三方登录唯一标识 |
| `nickname` | `TEXT` | | 用户昵称 |
| `avatar_url` | `TEXT` | | 头像 URL |
| `archetype` | `TEXT` | `CHECK(archetype IN ('z_gen','rebel','visual_hunter'))` | 人群画像：Z世代 / 反常规 / 视觉系 |
| `bio` | `TEXT` | | 个人简介 |
| `check_in_count` | `INTEGER` | `DEFAULT 0` | 累计打卡次数（反范化缓存） |
| `emotion_count` | `INTEGER` | `DEFAULT 0` | 累计情绪共鸣次数（反范化缓存） |
| `created_at` | `DATETIME` | `DEFAULT CURRENT_TIMESTAMP` | 创建时间 |

### 索引
```sql
CREATE INDEX idx_users_openid ON users(openid);
CREATE INDEX idx_users_archetype ON users(archetype);
```

---

## 3. interactions（互动表）

记录用户的「打卡」与「情绪共鸣」行为，是核心业务数据。

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` | 主键 |
| `user_id` | `INTEGER` | `NOT NULL REFERENCES users(id) ON DELETE CASCADE` | 用户外键 |
| `travel_item_id` | `INTEGER` | `NOT NULL REFERENCES travel_items(id) ON DELETE CASCADE` | 旅行项目外键 |
| `type` | `TEXT` | `NOT NULL CHECK(type IN ('check_in','emotion_note'))` | 互动类型：打卡 / 情绪共鸣 |
| `content` | `TEXT` | | 情绪共鸣文字内容（`type='emotion_note'` 时必填） |
| `emotion_tag` | `TEXT` | `CHECK(emotion_tag IN ('amazed','healed','inspired','wanderlust','melancholy'))` | 情绪标签：震撼 / 治愈 / 启发 / 渴望 / 苍凉 |
| `is_public` | `INTEGER` | `DEFAULT 1` | 是否公开：1=公开，0=仅自己可见 |
| `created_at` | `DATETIME` | `DEFAULT CURRENT_TIMESTAMP` | 创建时间 |

### 约束
```sql
-- 同一用户对同一项目只能打卡一次
CREATE UNIQUE INDEX idx_interactions_unique_checkin 
ON interactions(user_id, travel_item_id, type) WHERE type = 'check_in';

-- 情绪共鸣允许多条，但建立复合索引加速查询
CREATE INDEX idx_interactions_travel_emotion 
ON interactions(travel_item_id, emotion_tag) WHERE type = 'emotion_note';
```

### 索引
```sql
CREATE INDEX idx_interactions_user ON interactions(user_id);
CREATE INDEX idx_interactions_travel ON interactions(travel_item_id);
CREATE INDEX idx_interactions_type ON interactions(type);
CREATE INDEX idx_interactions_created ON interactions(created_at);
```

---

## 关系图

```
users (1) ───────< (N) interactions (N) >────── (1) travel_items

- 一个用户可以有多条互动记录
- 一个旅行项目可以有多条互动记录
- 同一用户对同一项目的打卡（check_in）有唯一约束
- 情绪共鸣（emotion_note）允许多条
```

---

## 扩展预留（未来迭代）

| 表名 | 用途 |
|------|------|
| `travel_collections` | 用户自建收藏夹（多对多关系） |
| `travel_routes` | 路线组合：将多个 `travel_items` 串联成主题路线 |
| `user_follows` | 用户关注关系（社交化） |
| `notifications` | 系统通知与互动提醒 |
