# 100种不可思议旅行 — 推荐算法测试文档

> 本文档遵循 TDD（Test-Driven Development）原则，先定义测试用例，再驱动算法实现。

---

## 测试环境

| 工具 | 说明 |
|------|------|
| 运行器 | Node.js 内置 `node:test`（零依赖） |
| 断言库 | Node.js 内置 `node:assert/strict` |
| 执行命令 | `node --test recommend.test.js` |

---

## 推荐算法核心函数

```typescript
filterAndRecommend(
  travels: TravelItem[],
  preferences: UserPreferences
): RecommendationResult[]
```

### 输入数据结构

**`TravelItem`**（与 Stage 1 schema 对齐）：
```typescript
{
  id: number;
  title: string;
  slug: string;
  rarity_score: number;      // 1-10，小众度
  visual_impact: number;     // 1-10，视觉冲击力
  healing_vibe: number;      // 1-10，治愈度
  tags: string[];            // 标签数组
  category: string;          // 分类
  check_in_count: number;    // 打卡数（热度参考）
  emotion_count: number;     // 情绪共鸣数
}
```

**`UserPreferences`**：
```typescript
{
  targetRarity?: number;       // 目标冷门度 1-10，越接近得分越高
  emotionTags?: string[];      // 偏好情绪/场景标签
  minRarity?: number;          // 冷门度硬阈值（>=）
  minVisual?: number;          // 视觉冲击力硬阈值（>=）
  minHealing?: number;         // 治愈度硬阈值（>=）
  weights?: {
    rarity: number;            // 冷门度匹配权重，默认 0.3
    emotion: number;           // 情绪标签匹配权重，默认 0.3
    visual: number;            // 视觉冲击力权重，默认 0.2
    healing: number;           // 治愈度权重，默认 0.2
  };
}
```

**`RecommendationResult`**：
```typescript
{
  travel: TravelItem;          // 原始旅行数据
  score: number;               // 综合匹配得分（0-100）
  matchDetails: {
    rarityScore: number;       // 冷门度匹配子得分 0-10
    emotionScore: number;      // 情绪标签匹配子得分 0-10
    visualScore: number;       // 视觉冲击力子得分 0-10
    healingScore: number;      // 治愈度子得分 0-10
  };
  matchReasons: string[];      // 人类可读推荐理由
}
```

---

## 测试用例清单

### TC-01: 基础阈值筛选（硬过滤）
**目的**：验证 `minRarity` / `minVisual` / `minHealing` 能正确过滤低于阈值的项目。

**输入**：6 条 mock 数据，`minRarity = 9`
**期望**：只返回 `rarity_score >= 9` 的项目（冰岛 9、达纳基尔 10、奈卡水晶洞 10）
**断言**：`results.length === 3`，每个结果的 `rarity_score >= 9`

---

### TC-02: 冷门度精准匹配排序
**目的**：验证 `targetRarity` 越接近的项目得分越高。

**输入**：冰岛(rarity=9)、法罗群岛(rarity=8)、纳米比亚(rarity=8)
**偏好**：`targetRarity = 9`
**期望**：冰岛排在最前
**断言**：`results[0].travel.slug === 'iceland-highland-blue-lagoon'`

---

### TC-03: 情绪标签匹配加分
**目的**：验证包含用户偏好情绪标签的项目获得更高得分。

**输入**：全部 6 条数据
**偏好**：`emotionTags = ['治愈', '温泉', '孤独']`
**期望**：冰岛（有温泉、孤独、治愈相关）得分显著高于达纳基尔（无匹配标签）
**断言**：冰岛 score > 达纳基尔 score

---

### TC-04: 多维度综合加权排序
**目的**：验证多维度加权后的综合排序正确性。

**输入**：全部 6 条数据
**偏好**：`targetRarity = 8, emotionTags = ['治愈', '艺术'], weights = { rarity: 0.2, emotion: 0.4, visual: 0.2, healing: 0.2 }`
**期望**：十和田美术馆（art类别+高治愈+多个匹配标签）排名靠前
**断言**：十和田美术馆在结果前三名内

---

### TC-05: 无匹配结果返回空数组
**目的**：验证极端筛选条件下不会崩溃，优雅返回空数组。

**输入**：全部 6 条数据
**偏好**：`minRarity = 10, minVisual = 10, minHealing = 10`
**期望**：没有任何项目同时满足三个 10
**断言**：`results.length === 0`

---

### TC-06: 默认权重行为
**目的**：验证未传 `weights` 时使用默认权重，算法仍能正常工作。

**输入**：2 条数据，仅传 `targetRarity = 8`
**期望**：算法正常运行，使用默认权重计算得分
**断言**：`results.length === 2`，均有有效 score

---

### TC-07: 边界值 — 冷门度极值
**目的**：验证 `targetRarity = 1` 和 `targetRarity = 10` 时边界行为正确。

**输入**：包含 rarity_score = 1 和 rarity_score = 10 的数据
**偏好**：`targetRarity = 1`，然后 `targetRarity = 10`
**期望**：rarity=1 的项目在第一种情况下得分最高，rarity=10 的项目在第二种情况下得分最高
**断言**：分别验证两种场景的首条结果

---

### TC-08: 空情绪标签数组不崩溃
**目的**：验证 `emotionTags = []` 时不崩溃，情绪匹配得分为 0。

**输入**：任意数据
**偏好**：`emotionTags = []`
**期望**：正常返回结果，所有 emotionScore = 0
**断言**：所有结果的 `matchDetails.emotionScore === 0`

---

### TC-09: 得分范围验证
**目的**：验证最终得分始终在 0-100 范围内。

**输入**：任意数据 + 任意偏好
**期望**：所有结果的 `score` 满足 `0 <= score <= 100`
**断言**：遍历所有结果验证范围

---

### TC-10: 推荐理由生成
**目的**：验证 `matchReasons` 数组包含人类可读的推荐理由。

**输入**：包含匹配标签的项目
**偏好**：`targetRarity = 9, emotionTags = ['温泉', '极光']`
**期望**：推荐理由包含「冷门度高度匹配」「包含你偏好的标签：温泉、极光」等
**断言**：`results[0].matchReasons.length > 0`，包含关键词

---

## 测试执行记录

| 轮次 | 阶段 | 结果 | 说明 |
|------|------|------|------|
| #1 | Red | FAIL | 仅编写测试，recommend.js 未实现 |
| #2 | Green | PASS | 实现 recommend.js，所有测试通过 |

---

## 算法公式参考

```
rarityScore = max(0, 10 - |travel.rarity_score - targetRarity|)
emotionScore = (匹配标签数 / max(用户标签数, 1)) * 10
visualScore = travel.visual_impact
healingScore = travel.healing_vibe

total = rarityScore * w.rarity + emotionScore * w.emotion + visualScore * w.visual + healingScore * w.healing
score = round(total, 2)   // 0-100 范围
```
