// ============================================================
// recommend.test.js — TDD Red 阶段
// 使用 Node.js 内置 node:test + node:assert/strict
// 运行: node --test recommend.test.js
// ============================================================

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { filterAndRecommend } from './recommend.js';

// ------------------------------------------------------
// Mock 数据（与 Stage 1 init_db.sql 数据对齐）
// ------------------------------------------------------
const mockTravels = [
  {
    id: 1, title: '冰岛高地蓝火山温泉', slug: 'iceland-highland-blue-lagoon',
    rarity_score: 9, visual_impact: 10, healing_vibe: 9,
    tags: ['温泉', '火山', '北欧', '孤独', '极光', '航拍', '极地'],
    category: 'landscape', check_in_count: 1284, emotion_count: 3567
  },
  {
    id: 2, title: '埃塞俄比亚达纳基尔凹地硫磺湖', slug: 'ethiopia-danakil-depression',
    rarity_score: 10, visual_impact: 10, healing_vibe: 3,
    tags: ['硫磺湖', '火山', '极端环境', '外星地貌', '航拍', '地质奇观'],
    category: 'adventure', check_in_count: 89, emotion_count: 342
  },
  {
    id: 3, title: '法罗群岛海上悬湖', slug: 'faroe-islands-lake-sorvagsvatn',
    rarity_score: 8, visual_impact: 10, healing_vibe: 8,
    tags: ['悬湖', '北欧', '大西洋', '孤独', '悬崖', '雾气', '治愈'],
    category: 'landscape', check_in_count: 567, emotion_count: 1890
  },
  {
    id: 4, title: '墨西哥奈卡水晶洞', slug: 'mexico-naica-crystal-cave',
    rarity_score: 10, visual_impact: 10, healing_vibe: 5,
    tags: ['水晶洞', '地下探险', '地质奇观', '超现实', '科研禁区', '墨西哥'],
    category: 'adventure', check_in_count: 12, emotion_count: 89
  },
  {
    id: 5, title: '日本青森县十和田美术馆', slug: 'japan-aomori-towada-art-center',
    rarity_score: 7, visual_impact: 9, healing_vibe: 9,
    tags: ['美术馆', '建筑', '森林', '当代艺术', '日本', '治愈', '设计'],
    category: 'art', check_in_count: 2341, emotion_count: 5678
  },
  {
    id: 6, title: '纳米比亚死亡谷', slug: 'namibia-deadvlei',
    rarity_score: 8, visual_impact: 10, healing_vibe: 7,
    tags: ['沙漠', '枯树', '沙丘', '超现实', '非洲', '苍凉', '摄影'],
    category: 'landscape', check_in_count: 890, emotion_count: 2345
  }
];

// ------------------------------------------------------
// 测试套件
// ------------------------------------------------------

describe('filterAndRecommend', () => {

  // TC-01: 基础阈值筛选（硬过滤）
  it('应按 minRarity 硬阈值正确过滤项目', () => {
    const prefs = { minRarity: 9 };
    const results = filterAndRecommend(mockTravels, prefs);

    assert.strictEqual(results.length, 3, '应返回 3 个冷门度≥9 的项目');
    results.forEach(r => {
      assert.ok(r.travel.rarity_score >= 9, `项目 ${r.travel.title} 的冷门度应 ≥ 9`);
    });
  });

  // TC-02: 冷门度精准匹配排序
  it('targetRarity 越接近的项目应排在越前面', () => {
    const prefs = { targetRarity: 9 };
    const results = filterAndRecommend(mockTravels, prefs);

    assert.ok(results.length > 0, '应有返回结果');
    assert.strictEqual(results[0].travel.slug, 'iceland-highland-blue-lagoon',
      '冷门度为 9 的冰岛项目应排在首位');
  });

  // TC-03: 情绪标签匹配加分
  it('包含用户偏好情绪标签的项目应获得更高得分', () => {
    const prefs = {
      emotionTags: ['治愈', '温泉', '孤独'],
      weights: { rarity: 0, emotion: 1, visual: 0, healing: 0 }
    };
    const results = filterAndRecommend(mockTravels, prefs);

    const iceland = results.find(r => r.travel.slug === 'iceland-highland-blue-lagoon');
    const danakil = results.find(r => r.travel.slug === 'ethiopia-danakil-depression');

    assert.ok(iceland, '应包含冰岛项目');
    assert.ok(danakil, '应包含达纳基尔项目');
    assert.ok(iceland.score > danakil.score,
      `冰岛应因标签匹配度高而获得更高分数 (冰岛:${iceland.score} vs 达纳基尔:${danakil.score})`);
  });

  // TC-04: 多维度综合加权排序
  it('应支持多维度加权综合排序', () => {
    const prefs = {
      targetRarity: 8,
      emotionTags: ['治愈', '艺术'],
      weights: { rarity: 0.2, emotion: 0.4, visual: 0.2, healing: 0.2 }
    };
    const results = filterAndRecommend(mockTravels, prefs);

    const towada = results.find(r => r.travel.slug === 'japan-aomori-towada-art-center');
    const towadaIndex = results.indexOf(towada);

    assert.ok(towadaIndex <= 2,
      `十和田美术馆应在前三名内（实际第 ${towadaIndex + 1} 名）`);
  });

  // TC-05: 无匹配结果返回空数组
  it('极端条件下应返回空数组且不崩溃', () => {
    const prefs = { minRarity: 10, minVisual: 10, minHealing: 10 };
    const results = filterAndRecommend(mockTravels, prefs);

    assert.strictEqual(results.length, 0, '同时要求三个维度都=10时应无匹配');
    assert.deepStrictEqual(results, [], '应返回空数组而非 undefined/null');
  });

  // TC-06: 默认权重行为
  it('未传 weights 时应使用默认权重正常计算', () => {
    const subset = mockTravels.slice(0, 2);
    const prefs = { targetRarity: 8 };
    const results = filterAndRecommend(subset, prefs);

    assert.strictEqual(results.length, 2, '应返回 2 个结果');
    results.forEach(r => {
      assert.ok(typeof r.score === 'number' && !isNaN(r.score),
        `项目 ${r.travel.title} 应有有效数值得分`);
    });
  });

  // TC-07: 边界值 — 冷门度极值
  it('应正确处理 targetRarity 的边界值 1 和 10', () => {
    // targetRarity = 1 时，rarity_score 最低的项目得分最高
    const lowPrefs = { targetRarity: 1, weights: { rarity: 1, emotion: 0, visual: 0, healing: 0 } };
    const lowResults = filterAndRecommend(mockTravels, lowPrefs);
    assert.strictEqual(lowResults[0].travel.rarity_score, 7,
      'targetRarity=1 时，rarity_score=7 的十和田美术馆应排第一');

    // targetRarity = 10 时，rarity_score 最高的项目得分最高
    const highPrefs = { targetRarity: 10, weights: { rarity: 1, emotion: 0, visual: 0, healing: 0 } };
    const highResults = filterAndRecommend(mockTravels, highPrefs);
    assert.strictEqual(highResults[0].travel.rarity_score, 10,
      'targetRarity=10 时，rarity_score=10 的项目应排第一');
  });

  // TC-08: 空情绪标签数组不崩溃
  it('emotionTags 为空数组时不应崩溃且 emotionScore 为 0', () => {
    const prefs = { emotionTags: [] };
    const results = filterAndRecommend(mockTravels, prefs);

    assert.ok(results.length > 0, '应有返回结果');
    results.forEach(r => {
      assert.strictEqual(r.matchDetails.emotionScore, 0,
        `项目 ${r.travel.title} 的 emotionScore 应为 0`);
    });
  });

  // TC-09: 得分范围验证
  it('所有结果的 score 应在 0-100 范围内', () => {
    const prefs = { targetRarity: 5, emotionTags: ['治愈', '孤独', '超现实'] };
    const results = filterAndRecommend(mockTravels, prefs);

    results.forEach(r => {
      assert.ok(r.score >= 0, `项目 ${r.travel.title} 的 score 应 ≥ 0，实际=${r.score}`);
      assert.ok(r.score <= 100, `项目 ${r.travel.title} 的 score 应 ≤ 100，实际=${r.score}`);
    });
  });

  // TC-10: 推荐理由生成
  it('应生成人类可读的 matchReasons', () => {
    const prefs = { targetRarity: 9, emotionTags: ['温泉', '极光'] };
    const results = filterAndRecommend(mockTravels, prefs);

    const iceland = results.find(r => r.travel.slug === 'iceland-highland-blue-lagoon');
    assert.ok(iceland, '应包含冰岛项目');
    assert.ok(iceland.matchReasons.length > 0, '应有至少一条推荐理由');

    const reasonsText = iceland.matchReasons.join(' ');
    assert.ok(reasonsText.includes('冷门') || reasonsText.includes('匹配'),
      '推荐理由应包含匹配相关信息');
  });

});
