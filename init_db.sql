-- ============================================================
-- 100种不可思议旅行 — SQLite 数据库初始化脚本
-- 包含：表结构 + 索引 + 6 条高质量硬核样例数据
-- ============================================================

-- ------------------------------------------------------
-- 1. travel_items（旅行项目表）
-- ------------------------------------------------------
CREATE TABLE IF NOT EXISTS travel_items (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    title           TEXT NOT NULL,
    slug            TEXT UNIQUE NOT NULL,
    subtitle        TEXT,
    description     TEXT NOT NULL,
    location        TEXT NOT NULL,
    coordinates     TEXT,   -- JSON: {"lat": x, "lng": y}
    cover_image_url TEXT NOT NULL,
    gallery_urls    TEXT,   -- JSON array
    video_url       TEXT,
    rarity_score    INTEGER CHECK (rarity_score BETWEEN 1 AND 10),
    visual_impact   INTEGER CHECK (visual_impact BETWEEN 1 AND 10),
    healing_vibe    INTEGER CHECK (healing_vibe BETWEEN 1 AND 10),
    tags            TEXT,   -- JSON array
    category        TEXT NOT NULL DEFAULT 'landscape',
    difficulty      TEXT DEFAULT 'moderate',
    best_season     TEXT,
    estimated_days  INTEGER,
    is_published    INTEGER DEFAULT 1,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_travel_items_slug        ON travel_items(slug);
CREATE INDEX IF NOT EXISTS idx_travel_items_category    ON travel_items(category);
CREATE INDEX IF NOT EXISTS idx_travel_items_scores      ON travel_items(rarity_score, visual_impact, healing_vibe);
CREATE INDEX IF NOT EXISTS idx_travel_items_published   ON travel_items(is_published);

-- ------------------------------------------------------
-- 2. users（用户表）
-- ------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    openid          TEXT UNIQUE,
    nickname        TEXT,
    avatar_url      TEXT,
    archetype       TEXT CHECK (archetype IN ('z_gen','rebel','visual_hunter')),
    bio             TEXT,
    check_in_count  INTEGER DEFAULT 0,
    emotion_count   INTEGER DEFAULT 0,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_openid     ON users(openid);
CREATE INDEX IF NOT EXISTS idx_users_archetype  ON users(archetype);

-- ------------------------------------------------------
-- 3. interactions（互动表）
-- ------------------------------------------------------
CREATE TABLE IF NOT EXISTS interactions (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    travel_item_id  INTEGER NOT NULL REFERENCES travel_items(id) ON DELETE CASCADE,
    type            TEXT NOT NULL CHECK (type IN ('check_in','emotion_note')),
    content         TEXT,
    emotion_tag     TEXT CHECK (emotion_tag IN ('amazed','healed','inspired','wanderlust','melancholy')),
    is_public       INTEGER DEFAULT 1,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_interactions_user          ON interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_interactions_travel        ON interactions(travel_item_id);
CREATE INDEX IF NOT EXISTS idx_interactions_type          ON interactions(type);
CREATE INDEX IF NOT EXISTS idx_interactions_created       ON interactions(created_at);
CREATE INDEX IF NOT EXISTS idx_interactions_travel_emotion ON interactions(travel_item_id, emotion_tag) WHERE type = 'emotion_note';

-- 同一用户对同一项目只能打卡一次
CREATE UNIQUE INDEX IF NOT EXISTS idx_interactions_unique_checkin
ON interactions(user_id, travel_item_id, type) WHERE type = 'check_in';

-- ------------------------------------------------------
-- 4. 高质量样例数据（6 条硬核不可思议旅行）
-- ------------------------------------------------------

INSERT INTO travel_items (
    title, slug, subtitle, description, location, coordinates,
    cover_image_url, gallery_urls, video_url,
    rarity_score, visual_impact, healing_vibe,
    tags, category, difficulty, best_season, estimated_days, is_published
) VALUES (
    '冰岛高地蓝火山温泉',
    'iceland-highland-blue-lagoon',
    '在火山与冰川的裂缝中，泡进一池不真实的蓝',
    '冰岛高地深处，火山活动与千年冰川共同雕刻出一片隐秘的蓝。这不是游客手册上的蓝湖，而是需要四驱车穿越熔岩荒原、徒步穿越硫磺雾气才能抵达的原生温泉池。水色因地下矿物质而呈现出近乎电子般的荧光蓝，池底是天然的黑色火山岩，蒸汽在零下的空气中凝结成白色的纱幔。入夜后，若极光恰好降临，你会同时被地热与星空拥抱——一种地球上最接近外星的体验。',
    '冰岛 · 内陆高地',
    '{"lat": 64.8, "lng": -19.0}',
    'https://cdn.100travel.com/travels/iceland-blue-lagoon-cover.jpg',
    '["https://cdn.100travel.com/travels/iceland-blue-lagoon-1.jpg","https://cdn.100travel.com/travels/iceland-blue-lagoon-2.jpg","https://cdn.100travel.com/travels/iceland-blue-lagoon-3.jpg"]',
    'https://cdn.100travel.com/travels/iceland-blue-lagoon-drone.mp4',
    9, 10, 9,
    '["温泉","火山","北欧","孤独","极光","航拍","极地"]',
    'landscape', 'hard', '6月-8月', 3, 1
);

INSERT INTO travel_items (
    title, slug, subtitle, description, location, coordinates,
    cover_image_url, gallery_urls, video_url,
    rarity_score, visual_impact, healing_vibe,
    tags, category, difficulty, best_season, estimated_days, is_published
) VALUES (
    '埃塞俄比亚达纳基尔凹地硫磺湖',
    'ethiopia-danakil-depression',
    '站在地球最接近地狱的地方，看见生命的起源色',
    '这里是全球海拔最低、气温最高的陆地之一，被称为「地狱之门」。达纳基尔凹地的达洛尔火山区，地下喷涌的硫磺与盐矿在地表凝结成霓虹色般的酸性温泉池——柠檬黄、孔雀绿、电光橙交织成一片外星地貌。空气温度可达50°C，地面布满了盐壳裂缝。只有少数探险者能忍受这里的极端环境，但当你站在那片荧光色盐池边缘时，会突然理解为什么科学家认为：火星上如果存在过生命，可能就以类似这里的化能合成细菌形式存在。',
    '埃塞俄比亚 · 阿法尔州',
    '{"lat": 14.24, "lng": 40.30}',
    'https://cdn.100travel.com/travels/danakil-cover.jpg',
    '["https://cdn.100travel.com/travels/danakil-1.jpg","https://cdn.100travel.com/travels/danakil-2.jpg","https://cdn.100travel.com/travels/danakil-3.jpg"]',
    'https://cdn.100travel.com/travels/danakil-aerial.mp4',
    10, 10, 3,
    '["硫磺湖","火山","极端环境","外星地貌","航拍","地质奇观"]',
    'adventure', 'extreme', '11月-3月', 4, 1
);

INSERT INTO travel_items (
    title, slug, subtitle, description, location, coordinates,
    cover_image_url, gallery_urls, video_url,
    rarity_score, visual_impact, healing_vibe,
    tags, category, difficulty, best_season, estimated_days, is_published
) VALUES (
    '法罗群岛海上悬湖',
    'faroe-islands-lake-sorvagsvatn',
    '一片湖泊悬在大西洋之上，像天空遗漏在人间的镜子',
    '法罗群岛的Sørvágsvatn湖，是世界上最大的「海上悬湖」。从特定角度看，湖面仿佛高悬于大西洋海平面之上数百米，形成视觉上的不可能图景——一片淡水仿佛被魔法固定在悬崖边缘。周围是寸草不生的玄武岩峭壁和墨绿色苔原，常年被雾气笼罩。这里的风大到能吹弯人， silence 却深得让人耳鸣。只有丹麦与冰岛之间的这18座火山岛，才拥有这种北欧式的荒凉与纯净。',
    '法罗群岛 · 瓦加尔岛',
    '{"lat": 62.05, "lng": -7.35}',
    'https://cdn.100travel.com/travels/faroe-lake-cover.jpg',
    '["https://cdn.100travel.com/travels/faroe-lake-1.jpg","https://cdn.100travel.com/travels/faroe-lake-2.jpg","https://cdn.100travel.com/travels/faroe-lake-3.jpg"]',
    'https://cdn.100travel.com/travels/faroe-lake-cliff.mp4',
    8, 10, 8,
    '["悬湖","北欧","大西洋","孤独","悬崖","雾气","治愈"]',
    'landscape', 'moderate', '5月-9月', 2, 1
);

INSERT INTO travel_items (
    title, slug, subtitle, description, location, coordinates,
    cover_image_url, gallery_urls, video_url,
    rarity_score, visual_impact, healing_vibe,
    tags, category, difficulty, best_season, estimated_days, is_published
) VALUES (
    '墨西哥奈卡水晶洞',
    'mexico-naica-crystal-cave',
    '在地下三百米，闯入一座由巨型水晶构成的地下大教堂',
    '墨西哥奇瓦瓦沙漠地下290米处，隐藏着人类发现过的最大水晶矿洞。洞内的亚硒酸盐水晶长达11米，直径可达4米，像冰柱一样从地面和天花板双向生长，在头灯光束下折射出幽灵般的琥珀色光芒。洞内温度高达58°C，湿度接近100%，必须穿着特制冷却服才能进入，每次停留不能超过10分钟。这里不是旅游景点——它是被严格保护的科研现场，每年仅允许极少数获得许可的研究者进入。但那些水晶的照片，足以让你重新思考地球内部还藏着什么。',
    '墨西哥 · 奇瓦瓦州',
    '{"lat": 27.85, "lng": -105.50}',
    'https://cdn.100travel.com/travels/naica-cave-cover.jpg',
    '["https://cdn.100travel.com/travels/naica-cave-1.jpg","https://cdn.100travel.com/travels/naica-cave-2.jpg","https://cdn.100travel.com/travels/naica-cave-3.jpg"]',
    'https://cdn.100travel.com/travels/naica-cave-explore.mp4',
    10, 10, 5,
    '["水晶洞","地下探险","地质奇观","超现实","科研禁区","墨西哥"]',
    'adventure', 'extreme', '全年（需科研许可）', 1, 1
);

INSERT INTO travel_items (
    title, slug, subtitle, description, location, coordinates,
    cover_image_url, gallery_urls, video_url,
    rarity_score, visual_impact, healing_vibe,
    tags, category, difficulty, best_season, estimated_days, is_published
) VALUES (
    '日本青森县十和田美术馆',
    'japan-aomori-towada-art-center',
    '一座将艺术种进森林与河流之间的美术馆',
    '青森县十和田市郊，奥入濑溪流汇入十和田湖的河口处，一座「没有围墙的美术馆」静静生长。建筑师西泽立卫将建筑体量拆分为16个不规则的白色盒子，散落在白桦林与草甸之间。馆藏以草间弥生、奈良美智、让·穆克等当代艺术家的作品为主，但真正的展品是建筑与自然之间的缝隙——阳光透过树影打在奈良美智的「青森犬」脸上，河流的声音成为草间弥生南瓜装置的永久背景音。这里不是去看艺术，而是去被艺术与自然同时凝视。',
    '日本 · 青森县十和田市',
    '{"lat": 40.61, "lng": 141.12}',
    'https://cdn.100travel.com/travels/towada-art-cover.jpg',
    '["https://cdn.100travel.com/travels/towada-art-1.jpg","https://cdn.100travel.com/travels/towada-art-2.jpg","https://cdn.100travel.com/travels/towada-art-3.jpg"]',
    'https://cdn.100travel.com/travels/towada-art-walk.mp4',
    7, 9, 9,
    '["美术馆","建筑","森林","当代艺术","日本","治愈","设计"]',
    'art', 'easy', '4月-11月', 2, 1
);

INSERT INTO travel_items (
    title, slug, subtitle, description, location, coordinates,
    cover_image_url, gallery_urls, video_url,
    rarity_score, visual_impact, healing_vibe,
    tags, category, difficulty, best_season, estimated_days, is_published
) VALUES (
    '纳米比亚死亡谷',
    'namibia-deadvlei',
    '在八百年枯树与红色沙丘之间，时间凝固成一幅超现实画作',
    '纳米比亚诺克卢福国家公园深处，一片被红色沙丘环绕的白色盐盆中，挺立着约900棵枯死的骆驼刺树。它们已经死了近千年，却因为极度干旱的气候而未曾腐朽，黑色的树干与脚下龟裂的白色盐地、背后高达300米的橙红色沙丘形成极致的色彩对比。日出时分，第一缕光从沙丘顶部倾泻而下，枯树的长影像指针一样扫过盐地。这里没有生命，却有一种沉默的庄严感——仿佛地球自己创作了一幅关于死亡与永恒的静物画。',
    '纳米比亚 · 诺克卢福国家公园',
    '{"lat": -24.76, "lng": 15.29}',
    'https://cdn.100travel.com/travels/deadvlei-cover.jpg',
    '["https://cdn.100travel.com/travels/deadvlei-1.jpg","https://cdn.100travel.com/travels/deadvlei-2.jpg","https://cdn.100travel.com/travels/deadvlei-3.jpg"]',
    'https://cdn.100travel.com/travels/deadvlei-sunrise.mp4',
    8, 10, 7,
    '["沙漠","枯树","沙丘","超现实","非洲","苍凉","摄影"]',
    'landscape', 'moderate', '5月-9月', 2, 1
);

-- ------------------------------------------------------
-- 5. 样例用户（用于测试互动数据）
-- ------------------------------------------------------

INSERT INTO users (openid, nickname, avatar_url, archetype, bio, check_in_count, emotion_count) VALUES
('wx_001_z_gen',    '午夜飞行',    'https://cdn.100travel.com/avatars/u1.jpg', 'z_gen',        '不想被定义的一代，只想被风景震撼。', 12, 34),
('wx_002_rebel',    '反方向时钟',  'https://cdn.100travel.com/avatars/u2.jpg', 'rebel',        '拒绝打卡式旅行，只去没人去的地方。', 8, 21),
('wx_003_visual',   '像素猎人',    'https://cdn.100travel.com/avatars/u3.jpg', 'visual_hunter', '我用眼睛收集这个世界的高光时刻。', 15, 67);
