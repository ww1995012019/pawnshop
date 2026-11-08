import type {ItemDef,NpcDef,RecipeDef,OrderDef} from './types';

const item=(index:number,def:Omit<ItemDef,'id'|'sprite'|'art'>):ItemDef=>({
  ...def,id:`ITM-${String(81+index).padStart(3,'0')}`,sprite:36+index,
  art:{front:'orbital-annex-front',back:'orbital-annex-back',index,columns:5,rows:5},
});

/** Cell order is shared with the shipped twenty-object front/back atlases. */
export const CONTENT_ITEMS:ItemDef[]=[
  item(0,{name:'折叠磁靴',category:'机械与航行',value:155,size:[2,2],tools:['TOL-001','TOL-004'],description:'一对可折叠的船外作业磁靴，鞋跟有手动解锁扣。检修铰链与吸附回路后，才能安心登上舱壁。',defect:'右靴吸附线圈接触不良，锁钩磨损使解锁行程过长。',clues:{'TOL-001':'鞋跟铰链、锁钩和靴底磨痕','TOL-004':'左右靴的吸附线圈与解锁端子'},recipeId:'REC-016'}),
  item(1,{name:'真空热封钳',category:'机械与航行',value:245,size:[2,1],tools:['TOL-001','TOL-006'],description:'橙色耐热钳口夹着两道封合条，常用于修补真空包装。别把钳口能发光当作整条封口都可靠。',defect:'热封条中段温升不足，钳口弹簧回位缓慢。',clues:{'TOL-001':'钳口压纹、封条接缝与回位弹簧','TOL-006':'整条封合面的持续温升与冷却响应'},recipeId:'REC-017'}),
  item(2,{name:'离子净水壶',category:'民生与消费',value:195,size:[1,2],tools:['TOL-003','TOL-005'],description:'透明壶腹包着青色离子滤芯，壶柄上刻着居民舱的水配额。用料和滤芯质量比外壳干净更要紧。',defect:'离子滤芯失活，循环流量下降且壶底配重偏离基准。',clues:{'TOL-003':'滤芯介质与壶口残留物','TOL-005':'空壶校零、滤芯和底部配重'} }),
  item(3,{name:'便携培养箱',category:'生物与异物',value:310,size:[2,2],tools:['TOL-002','TOL-006'],description:'透明穹罩里留着育苗盘，铜色框边能插入温湿探头。先核对种源封签，再比较恒温负载。',defect:'罩缘密封条老化，恒温负载下湿度持续流失。',clues:{'TOL-002':'种源封签、罩缘批号和育苗盘暗纹','TOL-006':'温控回路、罩缘密封与湿度保持曲线'},recipeId:'REC-018'}),
  item(4,{name:'环形导航仪',category:'精密电子',value:280,size:[2,1],tools:['TOL-003','TOL-004'],description:'三圈黄铜标尺围着一枚小小的航向窗，适合没有主屏的旧船。环能转动，并不说明信号会跟着走。',defect:'内环编码触点氧化，航向读数在固定角度跳变。',clues:{'TOL-003':'航向窗滤片与刻度涂层','TOL-004':'三只同心环的编码触点与共地端'} }),
  item(5,{name:'旧式机械相机',category:'记忆与文物',value:220,size:[2,1],tools:['TOL-001','TOL-002'],description:'黑色折叠皮腔旁有黄铜快门和小卷片轮。有人拿它记录靠港，也有人只想找回一张没洗出的照片。',defect:'卷片棘轮缺齿，快门回位后胶片不能稳定前进。',clues:{'TOL-001':'皮腔折缝、快门和卷片齿轮','TOL-002':'机身序号、底盖维修印和旧胶片边码'} }),
  item(6,{name:'低重力咖啡机',category:'民生与消费',value:170,size:[2,2],tools:['TOL-004','TOL-006'],description:'带旋锁杯座的小咖啡机，压力表比杯子还大。试机必须接测试回收杯，不能让热液珠飘进仪器。',defect:'加热回路接点松动，萃取泵在持续负载下失压。',clues:{'TOL-004':'加热圈、泵端子与杯座联锁','TOL-006':'试验杯上的萃取压力与回收曲线'},recipeId:'REC-019'}),
  item(7,{name:'外骨骼腕架',category:'义体与医疗',value:295,size:[2,1],tools:['TOL-001','TOL-006'],description:'只托住前臂的轻型助力架，手腕端保留了布质绑带。看清限位磨痕，才能判断它是否适合继续辅助搬运。',defect:'腕端限位轴磨损，负载上升时助力响应过冲。',clues:{'TOL-001':'限位轴、绑带固定点与关节磨痕','TOL-006':'测试夹中的助力上升与回位缓冲'},recipeId:'REC-020'}),
  item(8,{name:'光纤信号鼓',category:'精密电子',value:210,size:[2,2],tools:['TOL-003','TOL-004'],description:'缠着细光纤的金属线鼓，末端还亮着一小点青光。整鼓发亮也可能藏着一个难找的折损点。',defect:'内层光纤折损，固定波段出现间歇衰减。',clues:{'TOL-003':'光纤端面的透射波段','TOL-004':'鼓轴接口、收发端和连续信号回路'} }),
  item(9,{name:'便携除尘泵',category:'机械与航行',value:180,size:[2,2],tools:['TOL-001','TOL-006'],description:'一根盘起的软管抱着小型真空泵，滤仓上有矿尘划过的痕迹。检修前先把残尘封进测试回收袋。',defect:'叶轮积尘失衡，软管接口漏气导致抽吸衰减。',clues:{'TOL-001':'滤仓、软管卡箍与叶轮接缝','TOL-006':'密闭测试袋上的抽吸衰减与振动'},recipeId:'REC-021'}),
  item(10,{name:'对接舱灯笼',category:'民生与消费',value:105,size:[1,2],tools:['TOL-003','TOL-006'],description:'六角护框围着暖黄色灯罩，旧拖船会把它挂在门边等人回家。它亮不亮之外，还要看能亮多久。',defect:'稳流元件老化，照明负载下亮度周期性下降。',clues:{'TOL-003':'灯罩与发光介质的色谱','TOL-006':'整段照明周期的亮度和供电响应'} }),
  item(11,{name:'冷凝水回收盘',category:'民生与消费',value:150,size:[3,1],tools:['TOL-001','TOL-005'],description:'浅盘底部焊着回收管，边缘挂着细小的凝结鳍片。居民舱里，这一点点水也会被认真计量。',defect:'回收管焊缝渗漏，配重架偏移使集水盘倾斜。',clues:{'TOL-001':'回收管焊缝与鳍片接合处','TOL-005':'干盘校零和四角配重分布'} }),
  item(12,{name:'轨道食盒',category:'民生与消费',value:95,size:[1,2],tools:['TOL-001','TOL-006'],description:'三层旋锁食盒，最上层还有一道别人认真补过的封圈。夜班的人通常比收藏家更懂它的价值。',defect:'中层锁环回位不全，保温负载下密封持续漏热。',clues:{'TOL-001':'层间锁环与封圈的装配痕迹','TOL-006':'三层盒体的密封保温曲线'} }),
  item(13,{name:'双筒测距镜',category:'精密电子',value:340,size:[2,1],tools:['TOL-003','TOL-004'],description:'双镜筒中间藏着小小的测距读数，船员用它核对靠泊间隙。镜像清楚时，也别跳过测距回路。',defect:'右侧光路偏移，测距联接端存在间歇断续。',clues:{'TOL-003':'左右镜筒的透射谱与基准光路','TOL-004':'测距发射、接收和联接端子'},recipeId:'REC-022'}),
  item(14,{name:'维修听诊器',category:'机械与航行',value:160,size:[2,1],tools:['TOL-001','TOL-005'],description:'黄铜耳管接着一支长探针，用来听见机壳里细小的摩擦。老维修工喜欢安静地用它，不需要屏幕。',defect:'探针联接处松动，内部配重脱位使接触响应不稳。',clues:{'TOL-001':'耳管接口、探针尖端和联接套','TOL-005':'探针与内部配重的质量分布'} }),
  item(15,{name:'航行记录盒',category:'记忆与文物',value:460,size:[2,1],tools:['TOL-002','TOL-004'],description:'橙黑防撞盒上保留着搬运环，外壳比里面的记录更容易修好。读取前必须把来源和授权记在票据上。',defect:'读取端子接触氧化，数据帧返回存在间歇中断。',clues:{'TOL-002':'授权封签、机壳暗纹与航次号','TOL-004':'隔离测试口与只读数据回路'} }),
  item(16,{name:'声纹门禁器',category:'精密电子',value:230,size:[1,2],tools:['TOL-002','TOL-004'],description:'圆形拾音栅和小屏幕挤在同一块旧门牌上。转卖时只检查沙盒响应，不触碰仍在使用的门禁权限。',defect:'拾音回路增益漂移，沙盒声样不能稳定触发指示。',clues:{'TOL-002':'注销回执、背盖序号与封签暗纹','TOL-004':'沙盒拾音、指示与隔离测试回路'} }),
  item(17,{name:'栽培架湿度计',category:'生物与异物',value:120,size:[1,2],tools:['TOL-003','TOL-004'],description:'两根土壤探针连着一枚旧式指针表，表壳缠了绿色护线。植物不会告诉你读数偏了多少。',defect:'探针表面盐垢积累，湿度输出零点漂移。',clues:{'TOL-003':'探针表面的盐垢与敏感涂层','TOL-004':'双探针、零点校准和表头回路'} }),
  item(18,{name:'陨铁摆钟',category:'记忆与文物',value:520,size:[2,2],tools:['TOL-003','TOL-005'],description:'镂空钟架里悬着一块暗银色摆锤，细看能看见结晶纹路。年代可以讲故事，材料和质量仍需仪器说话。',defect:'摆轴磨损，摆锤配重失准导致周期持续偏移。',clues:{'TOL-003':'摆锤金属的晶纹与成分谱','TOL-005':'机架校零、摆锤质量及配重分布'} }),
  item(19,{name:'旅行织补机',category:'民生与消费',value:205,size:[2,2],tools:['TOL-001','TOL-006'],description:'折叠机臂抱着一卷粗线，底板能压住工作服的磨破处。补丁是否扎实，要看连续走针后的线迹。',defect:'送布齿磨损，连续走针时机臂张力不稳定。',clues:{'TOL-001':'针座、送布齿与折叠机臂的磨痕','TOL-006':'测试布上的连续走针与张力曲线'},recipeId:'REC-023'}),
];

export const CONTENT_RECIPES:RecipeDef[]=[
  {id:'REC-016',name:'磁靴锁钩与线圈修复',itemId:'ITM-081',materials:{'MAT-003':1,'MAT-001':1},steps:['打开靴跟并核对锁钩磨痕','更换吸附线圈并重接端子','夹具内复核吸附与手动解锁'],ap:1,kind:'repair'},
  {id:'REC-017',name:'热封钳口回温校正',itemId:'ITM-082',materials:{'MAT-002':1,'MAT-001':2},steps:['退出冷钳口并定位断续接点','换入陶瓷护片并接回发热条','在测试封条上复核整段温升'],ap:1,kind:'repair'},
  {id:'REC-018',name:'培养箱密封与恒温整备',itemId:'ITM-084',materials:{'MAT-004':1,'MAT-005':1},steps:['移出育苗盘并打开罩缘','更换合规封圈并填入冷却介质','空载复测密封与恒温曲线'],ap:1,kind:'repair'},
  {id:'REC-019',name:'低重力咖啡机泵检修',itemId:'ITM-087',materials:{'MAT-003':1,'MAT-001':1},steps:['断开供电并打开萃取泵仓','更换泵线圈并固定加热端子','接回收杯复测压力与杯座联锁'],ap:1,kind:'repair'},
  {id:'REC-020',name:'腕架限位与助力校准',itemId:'ITM-088',materials:{'MAT-002':1,'MAT-003':1},steps:['卸下绑带并定位磨损限位轴','更换轴套和助力线圈','在夹具内复测缓冲与回位'],ap:1,kind:'repair'},
  {id:'REC-021',name:'除尘泵叶轮与气路整备',itemId:'ITM-090',materials:{'MAT-004':1,'MAT-001':1},steps:['封存滤尘并打开叶轮仓','清理叶轮并更换接口封圈','接密闭测试袋复核抽吸与振动'],ap:1,kind:'repair'},
  {id:'REC-022',name:'测距镜双光路复校',itemId:'ITM-094',materials:{'MAT-006':2,'MAT-001':1},steps:['拆下右侧光窗并记录原位','换入透片并重接测距端子','对齐基准靶复核双筒距离'],ap:1,kind:'repair'},
  {id:'REC-023',name:'织补机送布与张力检修',itemId:'ITM-100',materials:{'MAT-002':1,'MAT-001':1},steps:['打开机臂并退出磨损送布齿','换入齿片并固定张力联接','在测试布上完成连续走针复测'],ap:1,kind:'repair'},
];

const art=(index:number)=>({key:'orbital-people-annex',index,columns:2,rows:2});
export const CONTENT_NPCS:NpcDef[]=[
  {id:'CHR-006',name:'季棠',title:'站医 · 夜班诊所负责人',faction:'station',sprite:5,art:art(0),line:'诊所里的每次稳定响应，背后都有人能安心睡一觉。',bio:'在回环九号守了十年夜班，习惯先问设备能否连续工作。她把旧病床改成检修台，也替预算不足的船员寻找可靠备件。',desire:'采购诊疗、助力和日用设备；要求正品、功能正常，品相至少 65%。',purchase:{minCondition:.65,authentic:true,working:true,categories:['义体与医疗','民生与消费']},voice:{arrival:['今天有点安静，我趁交班来看看能用的设备。','诊所不追新款，可靠和清楚的来路就够了。'],counter:['这笔钱要从诊所的备件预算里出。我能接受 {price} Cr。','如果连续响应还有疑问，我只能按 {price} Cr 来算。'],agreed:['记录齐全，这个价我放心。等你确认交割。','好，就按票据来。谢谢你把不确定的地方讲清楚。'],refused:['那就先不勉强，别让一笔生意耽误设备该有的检验。','我得回诊所了，改天有合适的再谈。']}},
  {id:'CHR-007',name:'桑禾',title:'舱间快递员 · 航道消息灵通',faction:'merchant',sprite:6,art:art(1),line:'有些东西跨过半座站才找到主人，我负责把最后一段跑完。',bio:'跑熟了货梯、气闸和每一条临时封闭的通道。看起来总很急，却从不省掉核对箱号的那一步，常给旧港带来第一手的靠港消息。',desire:'偏爱便携、耐用的机械和日用品；功能正常，品相至少 55%。',purchase:{minCondition:.55,authentic:false,working:true,categories:['机械与航行','民生与消费']},voice:{arrival:['下一班货梯还有十分钟，够不够咱们认真看一件？','我把箱号写在外面了，里头的事还得请你看看。'],counter:['把路费也算进去，我这边能做到 {price} Cr。','这件要跟我跑不少舱室，{price} Cr 我就认真考虑。'],agreed:['成交有着落了！等钱货清点完，我再赶下一趟。','好，票据别丢，我能把它稳稳带到该去的地方。'],refused:['这趟先空着手回去，路上总还能遇见别的机会。','时间到了，我先跑单。别急着把东西随便卖掉。']}},
  {id:'CHR-008',name:'洛弥',title:'温室看护人 · 种源保存者',faction:'salvage',sprite:7,art:art(2),line:'苗长得慢，仪表偏一点也要早一点发现。',bio:'把停用的客舱改成了公共温室，靠一小罐一小罐的种子维持旧港的绿色。愿意收有修复痕迹的旧器具，但不愿拿活物冒险。',desire:'寻找栽培和民生用具；功能正常、来源清楚，品相至少 50%。',purchase:{minCondition:.5,authentic:false,working:true,categories:['生物与异物','民生与消费']},voice:{arrival:['今早的新芽多了一片叶子，旧设备也该再有一段日子。','我带了温室的清单，不急，你按实物慢慢看。'],counter:['种子和水都得留够，我能匀出 {price} Cr。','有修补痕迹没关系，只要试过。{price} Cr 行不行？'],agreed:['那就好。明天它会在温室里派上用场。','证据讲明白了，价钱也明白，等你确认。'],refused:['没关系，苗也不是一天长成的，下次再看看。','今天先把这件事放一放，别为了我凑合检测。']}},
  {id:'CHR-009',name:'闻铎',title:'旧物收藏者 · 航行史记录人',faction:'merchant',sprite:8,art:art(3),line:'一件旧物的故事可以很长，票据上的事实要很短，也很准。',bio:'记录过多条已经停航的货运线，收藏相机、摆钟和旧航次记录。他愿意为清楚的来历付钱，却对复制的编号和编造的传奇格外谨慎。',desire:'收藏记忆文物与精密电子；正品、功能正常，品相至少 70%。',purchase:{minCondition:.7,authentic:true,working:true,categories:['记忆与文物','精密电子']},voice:{arrival:['我想找一件经得起查证的旧东西，不一定最漂亮。','听说你会把未知也写进记录，这让我愿意来看看。'],counter:['来历和读数摆在这里，我的估价是 {price} Cr。','故事留给以后慢慢讲，眼前这件我能给 {price} Cr。'],agreed:['足够清楚了。这次收进来的会是一件实物，不是传闻。','好，就这样记。交割之后，我会连票据一起妥善保存。'],refused:['还差一点能说服我的证据，今天先不成交。','让它留在这里等一个更合适的去处，也不错。']}},
];

export const PEOPLE_PROFILES:Record<string,Partial<NpcDef>>={
 'CHR-001':{bio:'以前在远洋货运船上鉴定备件，熟悉设备磨损，也见过太多被一句“还能用”敷衍过去的风险。如今接下旧港的小店，希望让实物、票据和人都各归其位。',desire:'把每笔采购、维修和交付写清楚，让旧港的旧物继续可靠地工作。'},
 'CHR-002':{bio:'在靠港维修队里长大，能听出轴承里很细的杂音。供货时会把拆下的螺丝排成一行，怕丢零件，也怕别人漏掉一个应当说明的故障。',desire:'收购来源清楚的零件和旧设备，故障件也可作为修复材料。',voice:{arrival:['这件的旧螺丝我都装回袋里了，你检查看看。','有些毛病我能修，有些还得请你把读数摆出来。'],counter:['拆开修还要工时，我能让到 {price} Cr。','咱们都按实物算，{price} Cr 已经给修复留出空间了。'],agreed:['行，接点和价钱都对上了，等你交割。','这单说明白了。以后修好的声音应该会更顺一点。'],refused:['那就先合上盖子，别为了赶生意漏了工序。','修理台还有活儿，下次再拿别的来给你看。']}},
 'CHR-003':{bio:'负责核验旧港的来源与封签，常被误以为只想多盖几枚章。她更在意的是出了事以后，能不能沿着真实的记录找到那一件原物。',desire:'站务采购只收正品、功能正常、品相至少 65% 的合规货物。',voice:{arrival:['今天核验路线经过这里，先从箱号看起。','先分清哪些是已知，哪些还需要补证。'],counter:['站务采购需要复核，我的预算是 {price} Cr。','这份检测记录支持的报价是 {price} Cr。'],agreed:['箱号、读数与票据一致，可以确认交割。','这笔会如实进入经营记录，按确认的价格办理。'],refused:['尚不能把缺失的证据当成已核验，今天先到这里。','不成交也要把原物和票据对应好。']}},
 'CHR-004':{bio:'航过旧航道的拾荒船长，把还能修的东西一点点带回港。讲起打捞经过总比讲价有耐心，最喜欢看到旧设备被真正需要它的人买走。',desire:'回收零件与旧设备，可收故障品；来源必须清楚。',voice:{arrival:['这一趟没捞着传说，倒带回来几件扎实的旧货。','先别听我讲航道，看看这件东西自己留下的痕迹。'],counter:['船舱和燃料都要开销，{price} Cr 是我这趟能给的数。','你再算算，{price} Cr，让它还有个修起来的去处。'],agreed:['好，有人接着用就值了。咱们把票据清点完。','这个价说得过去，我等你确认。'],refused:['今天这股风不对，咱们改天再谈。','别急，旧航道还在，合适的东西也还会来。']}},
 'CHR-005':{bio:'擅长从损坏的数据介质里保住仍然可靠的部分。与其替缺失的记忆编一个完整版本，她宁愿把空白清楚地留下，连做生意也一样。',desire:'整备与收藏要求正品、功能正常、品相至少 55%。',voice:{arrival:['我把能确定的部分单独写了，剩下的请你复核。','旧介质也值得认真对待，但别替它补一个假的来历。'],counter:['按可验证的部分估算，我能给到 {price} Cr。','还原和复测都需要时间，{price} Cr 比较合适。'],agreed:['好，已知的足够支持这次成交，未知的也照样保留。','记录不必漂亮，准确就行。等你完成交割。'],refused:['先把未知留着吧，今天不成交也没有损失一段事实。','我得回去看恢复日志了，下次再聊。']}},
};

export const CONTENT_ORDERS:OrderDef[]=[
 {id:'ORD-025',name:'贴得牢也松得开的磁靴',itemId:'ITM-081',reward:90,dueDay:6,minCondition:.75,needsRepair:true,faction:'station',customerOwned:true,description:'季棠替搬运班送修一对磁靴。检查锁钩和线圈，完成专用修复后交还本单原物。'},
 {id:'ORD-026',name:'给晚发芽的种子一个暖箱',itemId:'ITM-084',reward:110,dueDay:8,minCondition:.75,needsRepair:true,faction:'salvage',customerOwned:true,description:'洛弥的培养箱保不住湿度。记录罩缘暗纹与恒温响应，更换封圈后交还原箱。'},
 {id:'ORD-027',name:'货袋别在气闸前漏封',itemId:'ITM-082',reward:240,dueDay:11,minCondition:.75,needsRepair:false,faction:'merchant',description:'桑禾寻找一把能稳定连续热封的钳子，要求店铺自有、来源清楚并有两项物证。'},
 {id:'ORD-028',name:'两只镜筒看向同一个泊位',itemId:'ITM-094',reward:125,dueDay:13,minCondition:.75,needsRepair:true,faction:'station',customerOwned:true,description:'港务观测点送来双筒测距镜。对齐双光路并复测端子，保持原物与票据一一对应。'},
 {id:'ORD-029',name:'夜班最后一杯不失压',itemId:'ITM-087',reward:85,dueDay:16,minCondition:.75,needsRepair:true,faction:'salvage',customerOwned:true,description:'夜班休息室的咖啡机需要检修泵与加热接点。用回收杯完成复测，再交还这台原机。'},
 {id:'ORD-030',name:'一段有授权的旧航行',itemId:'ITM-096',reward:510,dueDay:18,minCondition:.7,needsRepair:false,faction:'merchant',description:'闻铎收集可核验航次的记录盒。只接受自有、功能正常且来源已登记的实物，至少两项独立物证。'},
 {id:'ORD-031',name:'把工作服的破口补结实',itemId:'ITM-100',reward:95,dueDay:20,minCondition:.75,needsRepair:true,faction:'salvage',customerOwned:true,description:'搬运班的织补机走针不稳。检修送布齿和张力联接，完成试布复测后归还本单原机。'},
 {id:'ORD-032',name:'旧港灯会前的一只摆钟',itemId:'ITM-099',reward:580,dueDay:21,minCondition:.8,needsRepair:false,faction:'merchant',description:'旧港展柜征集一只正常工作的陨铁摆钟。材料与质量记录齐全，来源可追溯，交付的是所选实物。'},
];
export const CONTENT_ORDER_EARLIEST:Record<string,number>={'ORD-025':4,'ORD-026':6,'ORD-027':9,'ORD-028':11,'ORD-029':13,'ORD-030':16,'ORD-031':18,'ORD-032':19};
