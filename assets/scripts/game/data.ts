/** Original Greyline content, separated from rendering and gameplay state. */
export type Category = 'repair' | 'life' | 'collect';
export type Check = 'condition' | 'function' | 'authenticity';
export type NpcId = 'lin' | 'zhou' | 'tao' | 'wen' | 'que' | 'kou';
export type ItemId = 'I01' | 'I02' | 'I03' | 'I04' | 'I05' | 'I06' | 'I07' | 'I08' | 'I09' | 'I10' | 'I11' | 'I12';
export interface ItemDef {
  readonly id: ItemId; readonly name: string; readonly category: Category;
  readonly base: number; readonly sprite: number; readonly imitation: boolean;
  readonly subtitle: string; readonly lore: string; readonly appearance: readonly string[];
  readonly functionClue: readonly string[]; readonly code: string;
  readonly originalClue: string; readonly alternateClue: string;
}
export interface NpcDef {
  readonly id: NpcId; readonly name: string; readonly title: string; readonly sprite: number;
  readonly preferences: readonly Category[]; readonly floor: number; readonly ask: number;
  readonly budget: number; readonly risk: boolean; readonly color: string; readonly bio: string;
  readonly lines: {
    readonly intro: string; readonly revisit: readonly string[]; readonly sell: readonly string[];
    readonly buy: readonly string[]; readonly counter: readonly string[]; readonly deal: readonly string[];
    readonly refuse: readonly string[]; readonly noStock: string; readonly inspect: readonly string[];
    readonly special: string;
  };
}
export const categories: Record<Category, { name: string; en: string; color: string }> = {
  repair: { name: '维修器具', en: 'WORKSHOP', color: '#95afa3' },
  life: { name: '生活用品', en: 'EVERYDAY', color: '#d4b77f' },
  collect: { name: '旧世珍藏', en: 'RELICS', color: '#bf9d98' },
};
export const checks: Record<Check, { name: string; minutes: number; steps: number; hint: string }> = {
  condition: { name: '外观检查', minutes: 4, steps: 3, hint: '寻找三处使用痕迹，确认真实品相。' },
  function: { name: '功能测试', minutes: 8, steps: 1, hint: '启动密闭测试台，检查性能档位。' },
  authenticity: { name: '编号核验', minutes: 12, steps: 1, hint: '对照旧站档案，辨认出厂与维修印记。' },
};
export const commissionParts: readonly { name: string; category: Category }[] = [
  { name: '旧铜线', category: 'repair' }, { name: '搪瓷杯', category: 'life' },
  { name: '旧站车票', category: 'collect' }, { name: '齿轮零件', category: 'repair' },
  { name: '棉布手套', category: 'life' }, { name: '褪色明信片', category: 'collect' },
];
export const dayStories: readonly (readonly [string, string])[] = [
  ['风从旧站台吹来', '灰线旧货铺重新亮灯了。先做一笔踏实的生意，让这间屋子慢慢热闹起来。'],
  ['有人记住了你的招牌', '商队带来了新的消息。注意今日行情，手里的旧物，也许正是别人缺少的东西。'],
  ['第一张租金单', '今晚需支付 90 票租金。别把所有现金压在货架上；门口的社区委托也能帮上忙。'],
  ['沙尘里的午后', '午后有一场小沙尘，来客会带着满身风沙。好在灯还亮着，热水也还有。'],
  ['旧物找到了新家', '聚落开始习惯来这里找东西。每一件诚实标注的商品，都让招牌多一分可信。'],
  ['最后一班商队', '商队明天清早出发。留意货架上的珍藏，路过的人，也许会愿意带它们走远一点。'],
  ['为明天留一盏灯', '七日试营业的最后一天。结清 210 票租金，留足 120 票周转金，让故事继续。'],
];

export const itemDefs: readonly ItemDef[] = [
  {
    "id": "I01",
    "name": "磁扣工具盒",
    "category": "repair",
    "base": 60,
    "sprite": 0,
    "imitation": false,
    "subtitle": "南站维修班 · 制式工具",
    "lore": "内盖刻着历任维修工的名字。盒子传了四双手，最小的那把扳手始终没有离开过它的位置。",
    "appearance": [
      "锁扣边缘被磨得发亮",
      "内衬留下不齐的工具压痕",
      "提手缠过两层旧帆布"
    ],
    "functionClue": [
      "磁扣连续吸合，锁定机构可靠。",
      "磁扣吸力衰减，需要反复按压才能扣牢。"
    ],
    "code": "NS–03 / △",
    "originalClue": "内盖三角维修印与南站第三批目录一致。",
    "alternateClue": "内盖为后配板，维修印来自兼容批次。"
  },
  {
    "id": "I02",
    "name": "旧式蓄电池",
    "category": "repair",
    "base": 60,
    "sprite": 1,
    "imitation": false,
    "subtitle": "旧陆工厂 · 储能单元",
    "lore": "壳体上还贴着一张褪色的值班表。停电之后，有人用它守过整整一夜的站台信号灯。",
    "appearance": [
      "接线座有暗绿色氧化层",
      "外壳侧面留着旧补胶",
      "底部有搬运留下的擦痕"
    ],
    "functionClue": [
      "密闭测试台显示：容量档位正常。",
      "密闭测试台显示：容量仅余六成，降级可用。"
    ],
    "code": "DL–60 / B14",
    "originalClue": "型号与第十四批出厂记录相符。",
    "alternateClue": "壳体原装，内部为后期兼容储能单元。"
  },
  {
    "id": "I03",
    "name": "折叠测距镜",
    "category": "repair",
    "base": 120,
    "sprite": 2,
    "imitation": false,
    "subtitle": "铁路测绘所 · 光学仪器",
    "lore": "一块蓝布塞在镜筒缝里，用来挡住风沙。镜片里最后测过的路，如今已经不在地图上。",
    "appearance": [
      "折叠镜架略有歪斜",
      "镜片边缘有细小划痕",
      "校准环上沾着灰白粉末"
    ],
    "functionClue": [
      "标尺在测试轨上准确对齐。",
      "标尺偏移，测距效率下降到六成。"
    ],
    "code": "CL–12 / 7",
    "originalClue": "镜筒校准位与原厂登记编号相合。",
    "alternateClue": "校准环来自民间兼容维修件。"
  },
  {
    "id": "I04",
    "name": "黄铜压力表",
    "category": "repair",
    "base": 80,
    "sprite": 3,
    "imitation": false,
    "subtitle": "东泵站 · 仪表备件",
    "lore": "铜圈上的小凹痕像一弯月亮。原主人说，那是泵站恢复供水那天，大家太高兴留下的。",
    "appearance": [
      "表盘外圈有月牙压痕",
      "指针轴稍微松动",
      "铜背板的颜色深浅不一"
    ],
    "functionClue": [
      "标准气囊台：偏差在正常范围。",
      "标准气囊台：指针偏差较大，降级可用。"
    ],
    "code": "DB–08 / 22",
    "originalClue": "背面泵站维修印与二十二号档案一致。",
    "alternateClue": "背板是兼容件，原厂封印已被替换。"
  },
  {
    "id": "I05",
    "name": "保温水壶",
    "category": "life",
    "base": 80,
    "sprite": 4,
    "imitation": false,
    "subtitle": "北线运输队 · 随行物资",
    "lore": "壶底被敲平了两次，仍能稳稳放在桌上。把手缠着蓝布，内侧藏着一个名字的首字。",
    "appearance": [
      "内胆有不规则暗斑",
      "壶盖边缘有细裂纹",
      "蓝色布条包住了提手"
    ],
    "functionClue": [
      "密封台：保温与密封档位正常。",
      "密封台：保温效率下降，仍可使用。"
    ],
    "code": "BX–08 / 41",
    "originalClue": "壶底工厂码与运输队物资目录相符。",
    "alternateClue": "壶底编码来自后期兼容生产批次。"
  },
  {
    "id": "I06",
    "name": "长明台灯",
    "category": "life",
    "base": 100,
    "sprite": 5,
    "imitation": false,
    "subtitle": "站务室旧藏 · 夜班的光",
    "lore": "开关被一代代夜班人磨得发亮。灯罩内侧写着一句小字：末班车到站，再熄灯。",
    "appearance": [
      "灯罩边缘有一处缺角",
      "开关被手指磨得光滑",
      "底座还粘着半张纸条"
    ],
    "functionClue": [
      "灯光稳定，续航达到原设计档位。",
      "灯光偏暗，续航降至正常的六成。"
    ],
    "code": "ZW–10 / L3",
    "originalClue": "底座线序与站务原装电路图一致。",
    "alternateClue": "底座线序是后配兼容电路。"
  },
  {
    "id": "I07",
    "name": "手摇应急电台",
    "category": "life",
    "base": 100,
    "sprite": 6,
    "imitation": false,
    "subtitle": "旧陆防务 · 短波接收机",
    "lore": "它陪跑腿员走过三次沙暴。调到最左边的频段，偶尔还能听见远处有人报平安。",
    "appearance": [
      "摇柄握位留下浅浅指痕",
      "天线接口曾经仔细补焊",
      "皮革提手边缘略微起毛"
    ],
    "functionClue": [
      "摇柄转动顺畅，信号指示达到三格。",
      "摇柄空转，信号只能维持一格。"
    ],
    "code": "YL–10 / R09",
    "originalClue": "防拆封签完整，生产批次与旧陆目录吻合。",
    "alternateClue": "封签重贴，接收模块为兼容替代。"
  },
  {
    "id": "I08",
    "name": "陶芯滤水壶",
    "category": "life",
    "base": 110,
    "sprite": 7,
    "imitation": false,
    "subtitle": "聚落水务 · 家庭净水器",
    "lore": "奶白色的滤芯外套着一只手缝布袋。卖家说孩子把它叫作“小水塔”，从不许别人碰倒。",
    "appearance": [
      "滤芯接口有反复旋拧痕迹",
      "陶壳边缘有轻微磕碰",
      "壶嘴下方积着白色水垢"
    ],
    "functionClue": [
      "封闭检测台：过滤机构正常。",
      "封闭检测台：流量效率下降至六成。"
    ],
    "code": "SW–11 / F6",
    "originalClue": "滤芯封签日期与型号相互匹配。",
    "alternateClue": "滤芯来自登记过的兼容工坊。"
  },
  {
    "id": "I09",
    "name": "车站翻页钟",
    "category": "collect",
    "base": 90,
    "sprite": 8,
    "imitation": true,
    "subtitle": "旧中央站 · 时间的残页",
    "lore": "它曾挂在第三候车室。最后一班车离开之后，钟没有停，只是再也没人急着看它。",
    "appearance": [
      "翻页纸片有一角缺失",
      "黑色面板已经褪成灰色",
      "玻璃后面落着细细的沙"
    ],
    "functionClue": [
      "翻页顺畅，每一格都准确落位。",
      "翻页机构偶尔卡住，效率下降。"
    ],
    "code": "ZY–09 / T2",
    "originalClue": "纸片字体与中央站原厂印版相同。",
    "alternateClue": "纸片是后期补印，字体与原厂不同。"
  },
  {
    "id": "I10",
    "name": "发条鸣鸟",
    "category": "collect",
    "base": 75,
    "sprite": 9,
    "imitation": true,
    "subtitle": "旧城百货 · 会唱歌的小东西",
    "lore": "尾巴的蓝漆掉了一半，旋律却还完整。没有人记得歌名，每个听过的人都说有点熟悉。",
    "appearance": [
      "尾部蓝色漆面部分剥落",
      "底座边缘有一条旧焊缝",
      "发条钥匙磨成了亮铜色"
    ],
    "functionClue": [
      "上弦后完整奏出四小节旋律。",
      "旋律断续，发条机构效率下降。"
    ],
    "code": "JC–75 / B5",
    "originalClue": "底板冲压标记与旧城百货目录一致。",
    "alternateClue": "底板为后压，属于复刻生产批次。"
  },
  {
    "id": "I11",
    "name": "旧城投影匣",
    "category": "collect",
    "base": 150,
    "sprite": 10,
    "imitation": true,
    "subtitle": "城市档案馆 · 一帧往日",
    "lore": "匣子里装着一帧雨天的老街。如今聚落的孩子没见过下雨，却都认得画面里那把红伞。",
    "appearance": [
      "透镜表面有一层薄雾",
      "插槽边缘被反复磨损",
      "匣盖留着档案馆贴纸残片"
    ],
    "functionClue": [
      "旧城街景投射清晰，进片稳定。",
      "投影偏暗，进片偶有停顿。"
    ],
    "code": "DA–15 / P8",
    "originalClue": "胶片序号与八型原装外壳匹配。",
    "alternateClue": "胶片与外壳版本不符，是后配组合。"
  },
  {
    "id": "I12",
    "name": "铜轨纪念章盒",
    "category": "collect",
    "base": 70,
    "sprite": 11,
    "imitation": true,
    "subtitle": "铁路通车纪念 · 留给后来人",
    "lore": "红绒盒衬换过一次，铜章还留着手心的光。背面刻着通车日期，那条铁路曾经通向海。",
    "appearance": [
      "铜章边缘的齿纹已变浅",
      "盒衬是后来更换的红绒布",
      "铰链附近有一圈油迹"
    ],
    "functionClue": [
      "盒锁及展示机构正常开合。",
      "盒锁松动，展示机构降级可用。"
    ],
    "code": "TL–70 / M1",
    "originalClue": "压印年份与首次通车发行目录吻合。",
    "alternateClue": "压印版式与原年份不符，是后来制作的。"
  }
];

export const npcs: readonly NpcDef[] = [
  {
    "id": "lin",
    "name": "林鹭",
    "title": "穿行沙海的跑腿员",
    "sprite": 0,
    "preferences": [
      "life",
      "repair"
    ],
    "floor": 0.7,
    "ask": 1.1,
    "budget": 1,
    "risk": false,
    "color": "#b88965",
    "bio": "她记得每条小路，也记得路尽头的人。肩上的包，总比看起来更重一点。",
    "lines": {
      "intro": "门口这只铃铛真好听。你就是新来的店主吧？",
      "revisit": [
        "又碰面啦，我趁下一趟出发前绕过来。",
        "路过南站，给你带了点新消息。"
      ],
      "sell": [
        "这台{item}跟我跑了不少路，给它找个新主人吧。",
        "包里装不下了。{item}，你收不收？"
      ],
      "buy": [
        "下一趟要走得远，我想挑件能靠得住的东西。",
        "找点{category}，好用比好看要紧。"
      ],
      "counter": [
        "这个数，我还不够付今晚的车费呢。",
        "再添一点吧，你知道好东西不常见。",
        "最后这口价了，我真该赶路了。"
      ],
      "deal": [
        "好，就这么定。它跟着你，我放心。",
        "票子收好了。下次有好东西先来找你。"
      ],
      "refuse": [
        "没事，买卖不成，路上见。",
        "那我再背一程，说不定有人正需要。"
      ],
      "noStock": "没找到合适的，明天我再来看看。",
      "inspect": [
        "慢慢看。摇柄的地方是我自己补过的。",
        "有问题问我，别看我记不住那些编号。"
      ],
      "special": "它陪我穿过三次沙暴。卖家说法，你听听就好。"
    }
  },
  {
    "id": "zhou",
    "name": "周砾",
    "title": "南站的老维修工",
    "sprite": 1,
    "preferences": [
      "repair"
    ],
    "floor": 0.78,
    "ask": 1.08,
    "budget": 1.05,
    "risk": true,
    "color": "#779b8f",
    "bio": "不爱解释，擅长修复。他总说，零件有脾气，听懂就不难相处。",
    "lines": {
      "intro": "周砾。南站修东西的，有事去机房找我。",
      "revisit": [
        "手头活儿做完了，过来转转。",
        "刚擦过手，不弄脏你柜台。"
      ],
      "sell": [
        "{item}。换下来的，还能用，自己检查。",
        "这件{item}腾出来了，你看着给。"
      ],
      "buy": [
        "要件维修器具，能干活就行。",
        "兼容件也收。标清来路，我自己会判断。"
      ],
      "counter": [
        "太低。材料都不止这个数。",
        "这个价不行，再想想。",
        "最后一次。机房还有活等着。"
      ],
      "deal": [
        "成。说好的数，不改了。",
        "东西拿稳。要修，来找我。"
      ],
      "refuse": [
        "不合适就算了，省得彼此耽误。",
        "行，我带回去。"
      ],
      "noStock": "没合适的零件。我先回机房。",
      "inspect": [
        "测吧。用台子，别拿手碰接头。",
        "看功能，再看编号。两回事。"
      ],
      "special": "原装也有坏的，替代件也有顶用的。"
    }
  },
  {
    "id": "tao",
    "name": "陶叔",
    "title": "公共厨房的掌勺人",
    "sprite": 2,
    "preferences": [
      "life",
      "collect"
    ],
    "floor": 0.68,
    "ask": 1.12,
    "budget": 1.1,
    "risk": false,
    "color": "#c8b17c",
    "bio": "掌着六十个人的饭勺，也记着六十个人的口味。他不愿意浪费任何东西。",
    "lines": {
      "intro": "小店主，叫我陶叔就成。饿了来厨房。",
      "revisit": [
        "趁锅里慢炖着，出来走动走动。",
        "又来叨扰你了，今天生意怎么样？"
      ],
      "sell": [
        "收拾库房找到的{item}，放着怪可惜。",
        "{item}还挺好，给需要的人用吧。"
      ],
      "buy": [
        "厨房缺点生活用品，耐用最要紧。",
        "想找件{category}，用得顺手就好。"
      ],
      "counter": [
        "再商量商量，厨房的预算紧呀。",
        "这个数，叔心里还有点舍不得。",
        "就到这儿吧，汤可不能熬过了。"
      ],
      "deal": [
        "好，好。东西总算找着用处了。",
        "说定了。晚上来喝碗热汤。"
      ],
      "refuse": [
        "没关系，生意不急这一回。",
        "那就先放着，回头再说。"
      ],
      "noStock": "不凑合，叔改天再来。",
      "inspect": [
        "细看是好事，做饭也得看火候。",
        "后来配的地方，你都给我标清楚。"
      ],
      "special": "我买的是能亮一晚的灯，不是墙上的影子。"
    }
  },
  {
    "id": "wen",
    "name": "闻苇",
    "title": "为旧世界做注的人",
    "sprite": 3,
    "preferences": [
      "collect",
      "repair"
    ],
    "floor": 0.8,
    "ask": 1.22,
    "budget": 1.15,
    "risk": false,
    "color": "#8ca8ad",
    "bio": "随身带着卡片簿，正在整理一座不再存在的城市。她相信记得也是一种修复。",
    "lines": {
      "intro": "我是闻苇，在整理车站旧档案。很高兴这里又亮灯了。",
      "revisit": [
        "上回的条目补好了，顺便来看看。",
        "又有一页空白等着填，今天有新东西吗？"
      ],
      "sell": [
        "这件{item}有重复藏品，愿意转给你。",
        "{item}的出身值得记，你先看实物。"
      ],
      "buy": [
        "想找件编号清楚的旧物，版本很重要。",
        "今天在查{category}的目录，有合适的吗？"
      ],
      "counter": [
        "这个价格，还没有把完整性算进去。",
        "我理解你的考量，但得再接近一些。",
        "这是最后的余地，我不急着出手。"
      ],
      "deal": [
        "谢谢。它的故事会留在档案里。",
        "成交。我会记下今天的日期。"
      ],
      "refuse": [
        "没关系，好的去处值得等一等。",
        "那留给下一位有缘的人吧。"
      ],
      "noStock": "没有合适的版本。我下次再来。",
      "inspect": [
        "编号和功能要分别看，别被外壳带偏。",
        "这里有一处细节，目录上恰好有。"
      ],
      "special": "我记录旧物，不代表我相信每一个故事。"
    }
  },
  {
    "id": "que",
    "name": "鹊姐",
    "title": "跟着商队来的掮客",
    "sprite": 4,
    "preferences": [
      "collect",
      "life"
    ],
    "floor": 0.82,
    "ask": 1.25,
    "budget": 0.95,
    "risk": false,
    "color": "#b18381",
    "bio": "敲两下柜台是她的习惯。她谈价寸步不让，谈好的事却从不失约。",
    "lines": {
      "intro": "鹊姐。商队过路，顺便认识一下新邻居。",
      "revisit": [
        "又见面了，看看你有没有练出眼力。",
        "商队还没走，咱们再做一笔？"
      ],
      "sell": [
        "这件{item}，路上已经有人问过价了。",
        "给你先看{item}，别让我白跑一趟。"
      ],
      "buy": [
        "找点好转手的{category}，你的货架呢？",
        "我不靠故事吃饭，拿实物出来说。"
      ],
      "counter": [
        "这可不叫还价，这叫让我做慈善。",
        "再往中间走一步，别兜圈子。",
        "最后一口，大家都省点时间。"
      ],
      "deal": [
        "痛快。说定的事，鹊姐从不反悔。",
        "成交。票子当面点，交情慢慢处。"
      ],
      "refuse": [
        "眼光不同，各走各的路。",
        "好，改天再做买卖。"
      ],
      "noStock": "今天的货不对路，回见。",
      "inspect": [
        "尽管查。做生意，明白比好听重要。",
        "这点时间我等得起，别光听故事。"
      ],
      "special": "价钱明着谈，来路写清楚，咱们就能长久。"
    }
  },
  {
    "id": "kou",
    "name": "阿扣",
    "title": "总有新点子的杂工",
    "sprite": 5,
    "preferences": [
      "repair",
      "life",
      "collect"
    ],
    "floor": 0.62,
    "ask": 1.05,
    "budget": 0.9,
    "risk": true,
    "color": "#b4a482",
    "bio": "成年以后接过的第一份活，是把站台的钟修好。修没修好另说，他从不轻易放弃。",
    "lines": {
      "intro": "我叫阿扣，什么活都接。你这儿缺帮手吗？",
      "revisit": [
        "又是我！今天捡到个有意思的东西。",
        "活干完啦，过来看看你的新货。"
      ],
      "sell": [
        "{item}，我本来想留着自己研究的。",
        "这件{item}你看看，我保证没乱拆。"
      ],
      "buy": [
        "想挑件{category}，不过我口袋不太鼓。",
        "不确定的也行，标出来让我自己选。"
      ],
      "counter": [
        "再高一点？我就能把欠的饭钱还上。",
        "差一点点，真的就一点点。",
        "最后一次啦，我得去接活了。"
      ],
      "deal": [
        "成交！我就知道能谈成。",
        "谢啦，回头帮你把门轴上点油。"
      ],
      "refuse": [
        "好吧，我先抱回去研究。",
        "没事，下回再来碰运气。"
      ],
      "noStock": "没有合适的呀，那我先去干活。",
      "inspect": [
        "这个我没试过，你测测看？",
        "编号不认识。我只知道它能不能动。"
      ],
      "special": "旧的也有旧的好嘛，修修还能陪人很久。"
    }
  }
];

export function getItemDef(id: string): ItemDef {
  const result = itemDefs.find(def => def.id === id);
  if (!result) throw new Error('Unknown item definition: ' + id);
  return result;
}
export function getNpc(id: string): NpcDef {
  const result = npcs.find(npc => npc.id === id);
  if (!result) throw new Error('Unknown NPC: ' + id);
  return result;
}
export function conditionLabel(value: number): string {
  return ({ 0.5: '破损', 0.75: '磨损', 0.8: '可用', 0.9: '良好', 1: '近新' } as Record<number, string>)[value] || '未知';
}
export function authenticityLabel(value: number): string {
  return value === 1 ? '原装' : value === 0.65 ? '兼容替代' : '仿制纪念品';
}
