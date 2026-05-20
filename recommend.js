// ============================================================
// recommend.js — 推荐与筛选核心算法
// 输入: 旅行项目列表 + 用户偏好
// 输出: 按匹配度排序的推荐结果
// ============================================================

/**
 * 默认权重配置
 * rarity:  冷门度匹配权重 — 用户偏好越冷门的项目，此权重越高
 * emotion: 情绪标签匹配权重 — 用户有明确情绪偏好时，此权重越高
 * visual:  视觉冲击力权重 — 视觉系用户此权重高
 * healing: 治愈度权重 — 寻求治愈体验的用户此权重高
 */
const DEFAULT_WEIGHTS = {
  rarity: 0.3,
  emotion: 0.3,
  visual: 0.2,
  healing: 0.2,
};

/**
 * 计算两个数值之间的接近度得分
 * 越接近 target，得分越高（0-10）
 */
function calcProximityScore(actual, target) {
  if (target === undefined || target === null) return 5; // 无目标时给中性分
  const diff = Math.abs(actual - target);
  return Math.max(0, 10 - diff);
}

/**
 * 计算情绪标签匹配得分
 * @param {string[]} travelTags — 项目标签
 * @param {string[]} userTags — 用户偏好标签
 * @returns {number} 0-10
 */
function calcEmotionScore(travelTags, userTags) {
  if (!userTags || userTags.length === 0) return 0;

  const matchCount = userTags.filter((tag) =>
    travelTags.some((t) => t.includes(tag) || tag.includes(t))
  ).length;

  return (matchCount / Math.max(userTags.length, 1)) * 10;
}

/**
 * 生成人类可读的推荐理由
 */
function generateMatchReasons(travel, prefs, matchDetails) {
  const reasons = [];

  // 冷门度匹配
  if (prefs.targetRarity !== undefined && prefs.targetRarity !== null) {
    const diff = Math.abs(travel.rarity_score - prefs.targetRarity);
    if (diff === 0) {
      reasons.push(`冷门度完美匹配（${travel.rarity_score}/10）`);
    } else if (diff <= 1) {
      reasons.push(`冷门度高度匹配（${travel.rarity_score}/10）`);
    } else if (diff <= 2) {
      reasons.push(`冷门度较为匹配（${travel.rarity_score}/10）`);
    }
  }

  // 情绪标签匹配
  if (prefs.emotionTags && prefs.emotionTags.length > 0) {
    const matched = prefs.emotionTags.filter((tag) =>
      travel.tags.some((t) => t.includes(tag) || tag.includes(t))
    );
    if (matched.length > 0) {
      reasons.push(`包含你偏好的标签：${matched.join('、')}`);
    }
  }

  // 高分维度亮点
  if (travel.visual_impact >= 9) {
    reasons.push('视觉冲击力极强');
  }
  if (travel.healing_vibe >= 9) {
    reasons.push('治愈度极高');
  }
  if (travel.rarity_score >= 9) {
    reasons.push('极其小众隐秘');
  }

  return reasons;
}

/**
 * 核心推荐函数
 *
 * @param {Object[]} travels — 旅行项目数组，需包含 rarity_score, visual_impact, healing_vibe, tags
 * @param {Object} preferences — 用户偏好
 * @param {number} [preferences.targetRarity] — 目标冷门度 1-10
 * @param {string[]} [preferences.emotionTags] — 偏好情绪/场景标签
 * @param {number} [preferences.minRarity] — 冷门度硬阈值（>=）
 * @param {number} [preferences.minVisual] — 视觉冲击力硬阈值（>=）
 * @param {number} [preferences.minHealing] — 治愈度硬阈值（>=）
 * @param {Object} [preferences.weights] — 自定义权重
 * @returns {Object[]} 推荐结果数组，按 score 降序排列
 */
export function filterAndRecommend(travels, preferences = {}) {
  if (!Array.isArray(travels) || travels.length === 0) return [];

  const prefs = {
    targetRarity: preferences.targetRarity,
    emotionTags: preferences.emotionTags || [],
    minRarity: preferences.minRarity ?? 1,
    minVisual: preferences.minVisual ?? 1,
    minHealing: preferences.minHealing ?? 1,
    weights: { ...DEFAULT_WEIGHTS, ...(preferences.weights || {}) },
  };

  // --- 第一步：硬阈值过滤 ---
  const filtered = travels.filter((t) => {
    const rarityOk = (t.rarity_score ?? 0) >= prefs.minRarity;
    const visualOk = (t.visual_impact ?? 0) >= prefs.minVisual;
    const healingOk = (t.healing_vibe ?? 0) >= prefs.minHealing;
    return rarityOk && visualOk && healingOk;
  });

  if (filtered.length === 0) return [];

  // --- 第二步：计算匹配得分 ---
  const results = filtered.map((travel) => {
    const rarityScore = calcProximityScore(travel.rarity_score, prefs.targetRarity);
    const emotionScore = calcEmotionScore(travel.tags, prefs.emotionTags);
    const visualScore = travel.visual_impact ?? 0;
    const healingScore = travel.healing_vibe ?? 0;

    const w = prefs.weights;
    const rawScore =
      rarityScore * w.rarity +
      emotionScore * w.emotion +
      visualScore * w.visual +
      healingScore * w.healing;

    const score = Math.round(rawScore * 100) / 100;

    const matchDetails = {
      rarityScore: Math.round(rarityScore * 100) / 100,
      emotionScore: Math.round(emotionScore * 100) / 100,
      visualScore,
      healingScore,
    };

    const matchReasons = generateMatchReasons(travel, prefs, matchDetails);

    return {
      travel,
      score,
      matchDetails,
      matchReasons,
    };
  });

  // --- 第三步：按得分降序排列 ---
  return results.sort((a, b) => b.score - a.score);
}
