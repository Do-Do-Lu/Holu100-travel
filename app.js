// ============================================================
// 100种不可思议旅行 — 前端应用逻辑 (Mock 数据驱动)
// ============================================================

import { filterAndRecommend } from './recommend.js';

// ------------------------------------------------------
// 1. Mock 数据（从 SQLite 样例数据映射）
// ------------------------------------------------------
const mockTravels = [
  {
    id: 1,
    title: '冰岛高地蓝火山温泉',
    slug: 'iceland-highland-blue-lagoon',
    subtitle: '在火山与冰川的裂缝中，泡进一池不真实的蓝',
    description: '冰岛高地深处，火山活动与千年冰川共同雕刻出一片隐秘的蓝。这不是游客手册上的蓝湖，而是需要四驱车穿越熔岩荒原、徒步穿越硫磺雾气才能抵达的原生温泉池。水色因地下矿物质而呈现出近乎电子般的荧光蓝，池底是天然的黑色火山岩，蒸汽在零下的空气中凝结成白色的纱幔。入夜后，若极光恰好降临，你会同时被地热与星空拥抱——一种地球上最接近外星的体验。',
    location: '冰岛 · 内陆高地',
    coordinates: { lat: 64.8, lng: -19.0 },
    cover_image_url: 'https://images.unsplash.com/photo-1579033461380-adb47c3eb938?w=800&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80',
      'https://images.unsplash.com/photo-1520769945061-0a448c463865?w=800&q=80',
      'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800&q=80'
    ],
    video_url: null,
    rarity_score: 9,
    visual_impact: 10,
    healing_vibe: 9,
    tags: ['温泉', '火山', '北欧', '孤独', '极光', '航拍', '极地'],
    category: 'landscape',
    difficulty: 'hard',
    best_season: '6月-8月',
    estimated_days: 3,
    check_in_count: 1284,
    emotion_count: 3567
  },
  {
    id: 2,
    title: '埃塞俄比亚达纳基尔凹地硫磺湖',
    slug: 'ethiopia-danakil-depression',
    subtitle: '站在地球最接近地狱的地方，看见生命的起源色',
    description: '这里是全球海拔最低、气温最高的陆地之一，被称为「地狱之门」。达纳基尔凹地的达洛尔火山区，地下喷涌的硫磺与盐矿在地表凝结成霓虹色般的酸性温泉池——柠檬黄、孔雀绿、电光橙交织成一片外星地貌。空气温度可达50°C，地面布满了盐壳裂缝。只有少数探险者能忍受这里的极端环境，但当你站在那片荧光色盐池边缘时，会突然理解为什么科学家认为：火星上如果存在过生命，可能就以类似这里的化能合成细菌形式存在。',
    location: '埃塞俄比亚 · 阿法尔州',
    coordinates: { lat: 14.24, lng: 40.30 },
    cover_image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
      'https://images.unsplash.com/photo-1434394354979-a235cd36269d?w=800&q=80'
    ],
    video_url: null,
    rarity_score: 10,
    visual_impact: 10,
    healing_vibe: 3,
    tags: ['硫磺湖', '火山', '极端环境', '外星地貌', '航拍', '地质奇观'],
    category: 'adventure',
    difficulty: 'extreme',
    best_season: '11月-3月',
    estimated_days: 4,
    check_in_count: 89,
    emotion_count: 342
  },
  {
    id: 3,
    title: '法罗群岛海上悬湖',
    slug: 'faroe-islands-lake-sorvagsvatn',
    subtitle: '一片湖泊悬在大西洋之上，像天空遗漏在人间的镜子',
    description: '法罗群岛的Sørvágsvatn湖，是世界上最大的「海上悬湖」。从特定角度看，湖面仿佛高悬于大西洋海平面之上数百米，形成视觉上的不可能图景——一片淡水仿佛被魔法固定在悬崖边缘。周围是寸草不生的玄武岩峭壁和墨绿色苔原，常年被雾气笼罩。这里的风大到能吹弯人， silence 却深得让人耳鸣。只有丹麦与冰岛之间的这18座火山岛，才拥有这种北欧式的荒凉与纯净。',
    location: '法罗群岛 · 瓦加尔岛',
    coordinates: { lat: 62.05, lng: -7.35 },
    cover_image_url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80'
    ],
    video_url: null,
    rarity_score: 8,
    visual_impact: 10,
    healing_vibe: 8,
    tags: ['悬湖', '北欧', '大西洋', '孤独', '悬崖', '雾气', '治愈'],
    category: 'landscape',
    difficulty: 'moderate',
    best_season: '5月-9月',
    estimated_days: 2,
    check_in_count: 567,
    emotion_count: 1890
  },
  {
    id: 4,
    title: '墨西哥奈卡水晶洞',
    slug: 'mexico-naica-crystal-cave',
    subtitle: '在地下三百米，闯入一座由巨型水晶构成的地下大教堂',
    description: '墨西哥奇瓦瓦沙漠地下290米处，隐藏着人类发现过的最大水晶矿洞。洞内的亚硒酸盐水晶长达11米，直径可达4米，像冰柱一样从地面和天花板双向生长，在头灯光束下折射出幽灵般的琥珀色光芒。洞内温度高达58°C，湿度接近100%，必须穿着特制冷却服才能进入，每次停留不能超过10分钟。这里不是旅游景点——它是被严格保护的科研现场，每年仅允许极少数获得许可的研究者进入。但那些水晶的照片，足以让你重新思考地球内部还藏着什么。',
    location: '墨西哥 · 奇瓦瓦州',
    coordinates: { lat: 27.85, lng: -105.50 },
    cover_image_url: 'https://images.unsplash.com/photo-1518173946687-a5d3f5fcc32f?w=800&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
      'https://images.unsplash.com/photo-1459908676235-d5f02a50184b?w=800&q=80'
    ],
    video_url: null,
    rarity_score: 10,
    visual_impact: 10,
    healing_vibe: 5,
    tags: ['水晶洞', '地下探险', '地质奇观', '超现实', '科研禁区', '墨西哥'],
    category: 'adventure',
    difficulty: 'extreme',
    best_season: '全年（需科研许可）',
    estimated_days: 1,
    check_in_count: 12,
    emotion_count: 89
  },
  {
    id: 5,
    title: '日本青森县十和田美术馆',
    slug: 'japan-aomori-towada-art-center',
    subtitle: '一座将艺术种进森林与河流之间的美术馆',
    description: '青森县十和田市郊，奥入濑溪流汇入十和田湖的河口处，一座「没有围墙的美术馆」静静生长。建筑师西泽立卫将建筑体量拆分为16个不规则的白色盒子，散落在白桦林与草甸之间。馆藏以草间弥生、奈良美智、让·穆克等当代艺术家的作品为主，但真正的展品是建筑与自然之间的缝隙——阳光透过树影打在奈良美智的「青森犬」脸上，河流的声音成为草间弥生南瓜装置的永久背景音。这里不是去看艺术，而是去被艺术与自然同时凝视。',
    location: '日本 · 青森县十和田市',
    coordinates: { lat: 40.61, lng: 141.12 },
    cover_image_url: 'https://images.unsplash.com/photo-1544531585-9847b68c8c86?w=800&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&q=80',
      'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=800&q=80'
    ],
    video_url: null,
    rarity_score: 7,
    visual_impact: 9,
    healing_vibe: 9,
    tags: ['美术馆', '建筑', '森林', '当代艺术', '日本', '治愈', '设计'],
    category: 'art',
    difficulty: 'easy',
    best_season: '4月-11月',
    estimated_days: 2,
    check_in_count: 2341,
    emotion_count: 5678
  },
  {
    id: 6,
    title: '纳米比亚死亡谷',
    slug: 'namibia-deadvlei',
    subtitle: '在八百年枯树与红色沙丘之间，时间凝固成一幅超现实画作',
    description: '纳米比亚诺克卢福国家公园深处，一片被红色沙丘环绕的白色盐盆中，挺立着约900棵枯死的骆驼刺树。它们已经死了近千年，却因为极度干旱的气候而未曾腐朽，黑色的树干与脚下龟裂的白色盐地、背后高达300米的橙红色沙丘形成极致的色彩对比。日出时分，第一缕光从沙丘顶部倾泻而下，枯树的长影像指针一样扫过盐地。这里没有生命，却有一种沉默的庄严感——仿佛地球自己创作了一幅关于死亡与永恒的静物画。',
    location: '纳米比亚 · 诺克卢福国家公园',
    coordinates: { lat: -24.76, lng: 15.29 },
    cover_image_url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80'
    ],
    video_url: null,
    rarity_score: 8,
    visual_impact: 10,
    healing_vibe: 7,
    tags: ['沙漠', '枯树', '沙丘', '超现实', '非洲', '苍凉', '摄影'],
    category: 'landscape',
    difficulty: 'moderate',
    best_season: '5月-9月',
    estimated_days: 2,
    check_in_count: 890,
    emotion_count: 2345
  }
];

// 每个旅行项目的默认情绪共鸣（作为 seed 数据）
const defaultEmotionsBySlug = {
  'iceland-highland-blue-lagoon': [
    { id: 1, user: { nickname: '午夜飞行', avatar_url: null, archetype: 'z_gen' }, content: '看到这片蓝的时候，我忽然原谅了去年所有熬过的夜。', emotion_tag: 'healed', created_at: '2025-05-18T14:22:00Z' },
    { id: 2, user: { nickname: '反方向时钟', avatar_url: null, archetype: 'rebel' }, content: '游客手册上没有的地方，才是地球真正的样子。', emotion_tag: 'inspired', created_at: '2025-05-17T09:15:00Z' },
    { id: 3, user: { nickname: '像素猎人', avatar_url: null, archetype: 'visual_hunter' }, content: '相机拍不出那种蓝，它有一种穿透视网膜的质地。', emotion_tag: 'amazed', created_at: '2025-05-16T21:40:00Z' }
  ],
  'ethiopia-danakil-depression': [
    { id: 4, user: { nickname: '地心探险家', avatar_url: null, archetype: 'rebel' }, content: '50度的空气里，每一口呼吸都在提醒你：这里不属于人类。', emotion_tag: 'amazed', created_at: '2025-05-15T10:10:00Z' },
    { id: 5, user: { nickname: '盐壳行者', avatar_url: null, archetype: 'visual_hunter' }, content: '那种荧光色不是地球该有的配色，像打翻了一整盒霓虹颜料。', emotion_tag: 'amazed', created_at: '2025-05-14T18:30:00Z' }
  ],
  'faroe-islands-lake-sorvagsvatn': [
    { id: 6, user: { nickname: '雾岛居民', avatar_url: null, archetype: 'visual_hunter' }, content: '风大到站不稳，但那一刻我觉得自己是被天空选中的。', emotion_tag: 'wanderlust', created_at: '2025-05-13T08:45:00Z' },
    { id: 7, user: { nickname: '大西洋失眠者', avatar_url: null, archetype: 'z_gen' }, content: '湖水悬在海上的瞬间，我对「不可能」三个字产生了怀疑。', emotion_tag: 'inspired', created_at: '2025-05-12T22:15:00Z' }
  ],
  'mexico-naica-crystal-cave': [
    { id: 8, user: { nickname: '地下策展人', avatar_url: null, archetype: 'rebel' }, content: '58度的地狱里，藏着地球最沉默的珠宝展。', emotion_tag: 'amazed', created_at: '2025-05-11T14:00:00Z' }
  ],
  'japan-aomori-towada-art-center': [
    { id: 9, user: { nickname: '森林画廊', avatar_url: null, archetype: 'visual_hunter' }, content: '奈良美智的狗在树林里等我，比任何约会都准时。', emotion_tag: 'healed', created_at: '2025-05-10T11:20:00Z' },
    { id: 10, user: { nickname: '白桦树影', avatar_url: null, archetype: 'z_gen' }, content: '艺术和自然在这里不是邻居，是恋人。', emotion_tag: 'healed', created_at: '2025-05-09T16:50:00Z' },
    { id: 11, user: { nickname: '溪流旁听者', avatar_url: null, archetype: 'healing' }, content: '坐在河边听了一下午水声，草间弥生的南瓜在旁边陪着我。', emotion_tag: 'healed', created_at: '2025-05-08T09:10:00Z' }
  ],
  'namibia-deadvlei': [
    { id: 12, user: { nickname: '红沙丘过客', avatar_url: null, archetype: 'visual_hunter' }, content: '那些树死了九百年，却比活着的任何一棵树都有尊严。', emotion_tag: 'melancholy', created_at: '2025-05-07T06:30:00Z' },
    { id: 13, user: { nickname: '日出收集者', avatar_url: null, archetype: 'rebel' }, content: '枯树的影子在盐地上移动，像地球自己的钟表。', emotion_tag: 'inspired', created_at: '2025-05-06T19:00:00Z' }
  ]
};

// ============================================================
// 2. 本地存储层 —— 模拟数据库持久化
// ============================================================
const DB = {
  KEY_CHECKINS: 'holu100_checkins_v1',
  KEY_EMOTIONS: 'holu100_emotions_v1',

  getCheckIns() {
    try {
      const raw = localStorage.getItem(this.KEY_CHECKINS);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch { return new Set(); }
  },

  saveCheckIns(set) {
    localStorage.setItem(this.KEY_CHECKINS, JSON.stringify([...set]));
  },

  getEmotions() {
    try {
      const raw = localStorage.getItem(this.KEY_EMOTIONS);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  },

  saveEmotions(map) {
    localStorage.setItem(this.KEY_EMOTIONS, JSON.stringify(map));
  },

  // 首次访问时初始化 seed 数据到 localStorage
  initSeedData() {
    if (!localStorage.getItem(this.KEY_EMOTIONS)) {
      this.saveEmotions(JSON.parse(JSON.stringify(defaultEmotionsBySlug)));
    }
    // 基于 seed 数据校准各项目的 emotion_count
    const emotions = this.getEmotions();
    mockTravels.forEach(t => {
      const list = emotions[t.slug] || defaultEmotionsBySlug[t.slug] || [];
      t.emotion_count = list.length;
    });
  }
};

DB.initSeedData();

// ------------------------------------------------------
// 3. 状态管理（从 localStorage 恢复用户交互状态）
// ------------------------------------------------------
const storedCheckIns = DB.getCheckIns();

// 校准 check_in_count：把已持久化的用户打卡合并到基准计数中
storedCheckIns.forEach(slug => {
  const travel = mockTravels.find(t => t.slug === slug);
  if (travel) travel.check_in_count++;
});

let state = {
  travels: [...mockTravels],
  filteredTravels: [...mockTravels],
  activeFilter: 'all',
  filters: {
    category: 'all',
    minRarity: 1,
    minVisual: 1,
    minHealing: 1,
    tags: []
  },
  checkedIn: storedCheckIns,
  detailOpen: false,
  exploreOpen: false,
  currentTravel: null
};

// ------------------------------------------------------
// 4. 工具函数
// ------------------------------------------------------
const formatNumber = (n) => n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n;

const formatDate = (iso) => {
  const d = new Date(iso);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
};

const getEmotionLabel = (tag) => {
  const map = { amazed: '震撼', healed: '治愈', inspired: '启发', wanderlust: '渴望', melancholy: '苍凉' };
  return map[tag] || tag;
};

const getEmotionColor = (tag) => {
  const map = { amazed: 'text-accent-rose', healed: 'text-accent-amber', inspired: 'text-accent-cyan', wanderlust: 'text-purple-400', melancholy: 'text-gray-400' };
  return map[tag] || 'text-gray-400';
};

const getCategoryLabel = (cat) => {
  const map = { landscape: '景观', culture: '文化', art: '艺术', adventure: '冒险', healing: '治愈' };
  return map[cat] || cat;
};

const getDifficultyLabel = (dif) => {
  const map = { easy: '轻松', moderate: '适中', hard: '困难', extreme: '极限' };
  return map[dif] || dif;
};

// ------------------------------------------------------
// 4. 渲染函数
// ------------------------------------------------------
function renderFilterBar() {
  const filters = [
    { key: 'all', label: '全部' },
    { key: 'landscape', label: '景观' },
    { key: 'art', label: '艺术' },
    { key: 'adventure', label: '冒险' },
    { key: 'healing', label: '治愈' }
  ];

  const bar = document.getElementById('filterBar');
  bar.innerHTML = filters.map(f => `
    <button
      data-filter="${f.key}"
      class="filter-chip px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
        state.activeFilter === f.key
          ? 'bg-white text-deep'
          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
      }"
    >${f.label}</button>
  `).join('');

  bar.querySelectorAll('.filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeFilter = btn.dataset.filter;
      applyFilters();
      renderFilterBar();
    });
  });
}

function renderWaterfall() {
  const container = document.getElementById('waterfall');
  const empty = document.getElementById('emptyState');

  if (state.filteredTravels.length === 0) {
    container.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');

  container.innerHTML = state.filteredTravels.map((t, i) => `
    <article
      class="travel-card group relative rounded-2xl overflow-hidden cursor-pointer bg-card border border-white/[0.04]"
      style="animation-delay: ${i * 0.08}s"
      onclick="openDetail('${t.slug}')"
    >
      <!-- 封面图 -->
      <div class="relative aspect-[4/5] overflow-hidden">
        <img
          src="${t.cover_image_url}"
          alt="${t.title}"
          class="w-full h-full object-cover"
          loading="lazy"
        >
        <!-- 渐变遮罩 -->
        <div class="card-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80"></div>

        <!-- 内容层 -->
        <div class="absolute inset-0 p-5 flex flex-col justify-end">
          <!-- 标签 -->
          <div class="flex flex-wrap gap-1.5 mb-3">
            ${t.tags.slice(0, 3).map(tag => `
              <span class="px-2 py-0.5 text-xs rounded-full bg-white/10 backdrop-blur-sm text-white/80 border border-white/10">${tag}</span>
            `).join('')}
          </div>

          <!-- 标题 -->
          <h3 class="text-lg font-bold text-white leading-tight mb-1">${t.title}</h3>
          <p class="text-xs text-gray-400 mb-3">${t.location}</p>

          <!-- 评分（hover 显示） -->
          <div class="card-meta flex items-center gap-4">
            <div class="flex items-center gap-1.5">
              <span class="text-[10px] text-gray-500 uppercase tracking-wider">小众</span>
              <span class="text-sm font-bold text-accent-cyan">${t.rarity_score}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="text-[10px] text-gray-500 uppercase tracking-wider">视觉</span>
              <span class="text-sm font-bold text-accent-rose">${t.visual_impact}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="text-[10px] text-gray-500 uppercase tracking-wider">治愈</span>
              <span class="text-sm font-bold text-accent-amber">${t.healing_vibe}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  `).join('');

  // 添加 stagger 类
  container.querySelectorAll('.travel-card').forEach((el, i) => {
    el.classList.add('stagger-item');
    el.style.animationDelay = `${i * 0.08}s`;
  });
}

function openDetail(slug) {
  const travel = state.travels.find(t => t.slug === slug);
  if (!travel) return;

  state.currentTravel = travel;
  state.detailOpen = true;

  const modal = document.getElementById('detailModal');
  const content = document.getElementById('detailContent');

  content.innerHTML = `
    <!-- 封面图 -->
    <div class="relative aspect-video sm:aspect-[21/9] overflow-hidden">
      <img src="${travel.cover_image_url}" alt="${travel.title}" class="w-full h-full object-cover">
      <div class="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent"></div>
      <button onclick="closeDetail()" class="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <div class="px-6 pb-8 -mt-16 relative">
      <!-- 标题区 -->
      <div class="mb-6">
        <div class="flex flex-wrap gap-2 mb-3">
          <span class="px-2.5 py-1 text-xs rounded-full bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">${getCategoryLabel(travel.category)}</span>
          <span class="px-2.5 py-1 text-xs rounded-full bg-white/5 text-gray-400 border border-white/10">${getDifficultyLabel(travel.difficulty)}</span>
          <span class="px-2.5 py-1 text-xs rounded-full bg-white/5 text-gray-400 border border-white/10">${travel.estimated_days}天</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-bold text-white mb-2">${travel.title}</h2>
        <p class="text-sm text-gray-400 flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          ${travel.location} · 最佳季节 ${travel.best_season}
        </p>
      </div>

      <!-- 正文 -->
      <p class="text-gray-300 leading-relaxed mb-6 text-[15px]">${travel.description}</p>

      <!-- 画廊 -->
      <div class="mb-6">
        <p class="text-xs text-gray-500 uppercase tracking-wider mb-3">影像</p>
        <div class="flex gap-3 overflow-x-auto gallery-scroll pb-2 -mx-6 px-6">
          ${travel.gallery_urls.map(url => `
            <div class="flex-shrink-0 w-64 h-40 rounded-xl overflow-hidden">
              <img src="${url}" alt="" class="w-full h-full object-cover" loading="lazy">
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 三维评分 -->
      <div class="mb-6 p-4 rounded-xl bg-deep/50 border border-white/[0.04]">
        <p class="text-xs text-gray-500 uppercase tracking-wider mb-4">维度评分</p>
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <span class="text-xs text-gray-400 w-12">小众度</span>
            <div class="flex-1 score-bar"><div class="score-fill bg-accent-cyan" style="width: ${travel.rarity_score * 10}%"></div></div>
            <span class="text-sm font-bold text-accent-cyan w-6 text-right">${travel.rarity_score}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs text-gray-400 w-12">视觉</span>
            <div class="flex-1 score-bar"><div class="score-fill bg-accent-rose" style="width: ${travel.visual_impact * 10}%"></div></div>
            <span class="text-sm font-bold text-accent-rose w-6 text-right">${travel.visual_impact}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs text-gray-400 w-12">治愈</span>
            <div class="flex-1 score-bar"><div class="score-fill bg-accent-amber" style="width: ${travel.healing_vibe * 10}%"></div></div>
            <span class="text-sm font-bold text-accent-amber w-6 text-right">${travel.healing_vibe}</span>
          </div>
        </div>
      </div>

      <!-- 标签 -->
      <div class="flex flex-wrap gap-2 mb-6">
        ${travel.tags.map(tag => `
          <span class="px-3 py-1 text-sm rounded-full bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 transition-colors cursor-default">${tag}</span>
        `).join('')}
      </div>

      <!-- 操作栏 -->
      <div class="flex gap-3 mb-8">
        <button
          id="checkInBtn"
          onclick="handleCheckIn('${travel.slug}')"
          class="flex-1 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
            state.checkedIn.has(travel.slug)
              ? 'bg-accent-amber/20 text-accent-amber border border-accent-amber/30 cursor-default'
              : 'bg-accent-amber text-deep hover:bg-amber-400'
          }"
        >
          ${state.checkedIn.has(travel.slug) ? '✓ 已打卡' : `打卡 · ${formatNumber(travel.check_in_count)} 人已打卡`}
        </button>
        <button class="px-4 py-3 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 transition-all">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
          </svg>
        </button>
      </div>

      <!-- 情绪共鸣区 -->
      <div class="border-t border-white/[0.06] pt-6">
        <div class="flex items-center justify-between mb-4">
          <p class="text-xs text-gray-500 uppercase tracking-wider">情绪共鸣 · ${formatNumber(travel.emotion_count)}</p>
        </div>

        <!-- 共鸣列表 -->
        <div id="emotionList" class="space-y-4 mb-6">
          ${(DB.getEmotions()[travel.slug] || defaultEmotionsBySlug[travel.slug] || []).map(e => `
            <div class="flex gap-3">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-accent-cyan/30 to-accent-amber/30 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                ${e.user.nickname[0]}
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-sm font-medium text-white">${e.user.nickname}</span>
                  <span class="text-xs ${getEmotionColor(e.emotion_tag)}">#${getEmotionLabel(e.emotion_tag)}</span>
                  <span class="text-xs text-gray-600 ml-auto">${formatDate(e.created_at)}</span>
                </div>
                <p class="text-sm text-gray-400 leading-relaxed">${e.content}</p>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- 共鸣输入 -->
        <div class="flex gap-3">
          <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">我</div>
          <div class="flex-1">
            <textarea
              id="emotionInput"
              placeholder="这片风景让你产生了什么情绪..."
              rows="2"
              class="w-full px-3 py-2 rounded-lg bg-deep border border-white/10 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-white/20 transition-colors"
            ></textarea>
            <div class="flex items-center justify-between mt-2">
              <select id="emotionTag" class="bg-deep border border-white/10 rounded-lg text-xs text-gray-400 px-2 py-1 focus:outline-none">
                <option value="amazed">震撼</option>
                <option value="healed" selected>治愈</option>
                <option value="inspired">启发</option>
                <option value="wanderlust">渴望</option>
                <option value="melancholy">苍凉</option>
              </select>
              <button onclick="submitEmotion()" class="px-4 py-1.5 rounded-lg bg-white/5 text-sm text-gray-300 hover:bg-white/10 border border-white/10 transition-colors">发布</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeDetail() {
  state.detailOpen = false;
  state.currentTravel = null;
  document.getElementById('detailModal').classList.add('hidden');
  document.body.style.overflow = '';
}

function openExplore() {
  state.exploreOpen = true;
  const modal = document.getElementById('exploreModal');
  const content = document.getElementById('exploreContent');

  const allTags = [...new Set(state.travels.flatMap(t => t.tags))];

  content.innerHTML = `
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-bold text-white">探索筛选</h3>
        <button onclick="closeExplore()" class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- 三维滑块 -->
      <div class="space-y-5 mb-6">
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm text-gray-300">最小小众度</label>
            <span id="rarityValue" class="text-sm font-bold text-accent-cyan">${state.filters.minRarity}</span>
          </div>
          <input type="range" min="1" max="10" value="${state.filters.minRarity}" class="w-full" oninput="updateSlider('rarity', this.value)">
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm text-gray-300">最小视觉冲击力</label>
            <span id="visualValue" class="text-sm font-bold text-accent-rose">${state.filters.minVisual}</span>
          </div>
          <input type="range" min="1" max="10" value="${state.filters.minVisual}" class="w-full" oninput="updateSlider('visual', this.value)">
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm text-gray-300">最小治愈度</label>
            <span id="healingValue" class="text-sm font-bold text-accent-amber">${state.filters.minHealing}</span>
          </div>
          <input type="range" min="1" max="10" value="${state.filters.minHealing}" class="w-full" oninput="updateSlider('healing', this.value)">
        </div>
      </div>

      <!-- 分类选择 -->
      <div class="mb-6">
        <p class="text-xs text-gray-500 uppercase tracking-wider mb-3">分类</p>
        <div class="flex flex-wrap gap-2">
          ${[['all', '全部'], ['landscape', '景观'], ['art', '艺术'], ['adventure', '冒险'], ['healing', '治愈']].map(([key, label]) => `
            <button
              onclick="setCategory('${key}')"
              class="explore-cat px-3 py-1.5 rounded-lg text-sm transition-all ${state.filters.category === key ? 'bg-white text-deep font-medium' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'}"
              data-cat="${key}"
            >${label}</button>
          `).join('')}
        </div>
      </div>

      <!-- 标签云 -->
      <div class="mb-8">
        <p class="text-xs text-gray-500 uppercase tracking-wider mb-3">标签</p>
        <div class="flex flex-wrap gap-2">
          ${allTags.map(tag => `
            <button
              onclick="toggleTag('${tag}')"
              class="explore-tag px-2.5 py-1 rounded-full text-xs transition-all ${state.filters.tags.includes(tag) ? 'bg-accent-amber/20 text-accent-amber border border-accent-amber/30' : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'}"
              data-tag="${tag}"
            >${tag}</button>
          `).join('')}
        </div>
      </div>

      <button onclick="applyExploreFilters()" class="w-full py-3 rounded-xl bg-white text-deep font-bold text-sm hover:bg-gray-100 transition-colors">
        应用筛选
      </button>
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeExplore() {
  state.exploreOpen = false;
  document.getElementById('exploreModal').classList.add('hidden');
  document.body.style.overflow = '';
}

// ------------------------------------------------------
// 5. 交互处理
// ------------------------------------------------------
function applyFilters() {
  const { activeFilter } = state;
  if (activeFilter === 'all') {
    state.filteredTravels = [...state.travels];
  } else {
    state.filteredTravels = state.travels.filter(t => t.category === activeFilter);
  }
  renderWaterfall();
}

function updateSlider(type, value) {
  const num = parseInt(value);
  if (type === 'rarity') state.filters.minRarity = num;
  if (type === 'visual') state.filters.minVisual = num;
  if (type === 'healing') state.filters.minHealing = num;

  const el = document.getElementById(type + 'Value');
  if (el) el.textContent = num;
}

function setCategory(cat) {
  state.filters.category = cat;
  document.querySelectorAll('.explore-cat').forEach(btn => {
    const isActive = btn.dataset.cat === cat;
    btn.className = `explore-cat px-3 py-1.5 rounded-lg text-sm transition-all ${isActive ? 'bg-white text-deep font-medium' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'}`;
  });
}

function toggleTag(tag) {
  const idx = state.filters.tags.indexOf(tag);
  if (idx > -1) {
    state.filters.tags.splice(idx, 1);
  } else {
    state.filters.tags.push(tag);
  }

  document.querySelectorAll('.explore-tag').forEach(btn => {
    const t = btn.dataset.tag;
    const isActive = state.filters.tags.includes(t);
    btn.className = `explore-tag px-2.5 py-1 rounded-full text-xs transition-all ${isActive ? 'bg-accent-amber/20 text-accent-amber border border-accent-amber/30' : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'}`;
  });
}

function applyExploreFilters() {
  const preferences = {
    targetRarity: state.filters.minRarity,
    emotionTags: state.filters.tags,
    minRarity: state.filters.minRarity,
    minVisual: state.filters.minVisual,
    minHealing: state.filters.minHealing,
  };

  const recommended = filterAndRecommend(state.travels, preferences);
  let travels = recommended.map(r => r.travel);

  // category 作为额外硬过滤
  if (state.filters.category !== 'all') {
    travels = travels.filter(t => t.category === state.filters.category);
  }

  state.filteredTravels = travels;
  state.activeFilter = state.filters.category !== 'all' ? state.filters.category : 'all';
  renderFilterBar();
  renderWaterfall();
  closeExplore();
}

function handleCheckIn(slug) {
  if (state.checkedIn.has(slug)) return;

  state.checkedIn.add(slug);
  DB.saveCheckIns(state.checkedIn);

  const travel = state.travels.find(t => t.slug === slug);
  if (travel) travel.check_in_count++;

  const btn = document.getElementById('checkInBtn');
  if (btn) {
    btn.className = 'flex-1 py-3 rounded-xl font-medium text-sm transition-all duration-200 bg-accent-amber/20 text-accent-amber border border-accent-amber/30 cursor-default';
    btn.innerHTML = '✓ 已打卡';
  }

  renderWaterfall();
}

function submitEmotion() {
  const input = document.getElementById('emotionInput');
  const tagSelect = document.getElementById('emotionTag');
  const content = input.value.trim();

  if (!content || content.length < 2) {
    input.classList.add('border-accent-rose');
    setTimeout(() => input.classList.remove('border-accent-rose'), 1000);
    return;
  }

  const tag = tagSelect.value;
  const newEmotion = {
    id: Date.now(),
    user: { nickname: '我', avatar_url: null, archetype: 'z_gen' },
    content,
    emotion_tag: tag,
    created_at: new Date().toISOString()
  };

  // 写入模拟数据库（localStorage）
  if (state.currentTravel) {
    const slug = state.currentTravel.slug;
    const allEmotions = DB.getEmotions();
    if (!allEmotions[slug]) allEmotions[slug] = [];
    allEmotions[slug].unshift(newEmotion);
    DB.saveEmotions(allEmotions);

    state.currentTravel.emotion_count = allEmotions[slug].length;
  }

  const list = document.getElementById('emotionList');
  const item = document.createElement('div');
  item.className = 'flex gap-3 fade-in';
  item.innerHTML = `
    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-accent-cyan/30 to-accent-amber/30 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">我</div>
    <div class="flex-1">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-sm font-medium text-white">我</span>
        <span class="text-xs ${getEmotionColor(tag)}">#${getEmotionLabel(tag)}</span>
        <span class="text-xs text-gray-600 ml-auto">刚刚</span>
      </div>
      <p class="text-sm text-gray-400 leading-relaxed">${content}</p>
    </div>
  `;
  list.insertBefore(item, list.firstChild);

  input.value = '';
  renderWaterfall();
}

// ------------------------------------------------------
// 6. Navbar 滚动效果
// ------------------------------------------------------
function handleScroll() {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 20) {
    navbar.classList.add('bg-deep/80', 'backdrop-blur-md', 'border-b', 'border-white/5');
  } else {
    navbar.classList.remove('bg-deep/80', 'backdrop-blur-md', 'border-b', 'border-white/5');
  }
}

// ------------------------------------------------------
// 7. 事件绑定 & 初始化
// ------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  renderFilterBar();
  renderWaterfall();

  document.getElementById('exploreBtn').addEventListener('click', openExplore);

  // 点击遮罩关闭弹窗
  document.getElementById('detailBackdrop').addEventListener('click', closeDetail);
  document.getElementById('exploreBackdrop').addEventListener('click', closeExplore);

  // ESC 关闭弹窗
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (state.detailOpen) closeDetail();
      if (state.exploreOpen) closeExplore();
    }
  });

  window.addEventListener('scroll', handleScroll, { passive: true });
});

// 将交互函数暴露到全局，供模板中的 onclick 调用
Object.assign(window, {
  openDetail,
  closeDetail,
  handleCheckIn,
  submitEmotion,
  closeExplore,
  updateSlider,
  setCategory,
  toggleTag,
  applyExploreFilters
});
