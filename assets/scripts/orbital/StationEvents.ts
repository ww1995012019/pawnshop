import {materials} from './data';
import type {Faction,OrbitalState} from './types';

export interface StationEventEffects {
 readonly cash?:number;readonly ap?:number;readonly risk?:number;
 readonly materials?:Readonly<Record<string,number>>;
 readonly relations?:Readonly<Partial<Record<Faction,number>>>;
}
export interface StationEventChoice {
 readonly id:string;readonly label:string;readonly costText:string;readonly rewardText:string;
 readonly result:string;readonly effects:StationEventEffects;
}
export interface StationEvent {
 readonly id:string;readonly title:string;readonly description:string;readonly speakerId:string;
 readonly choices:readonly StationEventChoice[];
}
export interface StationEventRecord {day:number;eventId:string;choiceId:string}

function freezeEvent(event:StationEvent):StationEvent {
 for(const choice of event.choices){
  if(choice.effects.materials)Object.freeze(choice.effects.materials);
  if(choice.effects.relations)Object.freeze(choice.effects.relations);
  Object.freeze(choice.effects);Object.freeze(choice);
 }
 Object.freeze(event.choices);return Object.freeze(event);
}

const eventDefinitions:StationEvent[]=[
 {id:'EVT-001',title:'诊疗舱的一盏灯',speakerId:'CHR-006',description:'季棠推来诊疗舱的备用灯架。夜班还有病人，接头修好就能继续使用；也可以给诊疗舱添一份照明补给。',choices:[
  {id:'EVT-001-repair',label:'重接灯架线路',costText:'1AP、导电纤维×1',rewardText:'35Cr；站务关系+3；风险−1',result:'灯架复测通过，季棠带回诊疗舱。维修费35Cr到账，消耗1AP与导电纤维×1；站务关系+3，风险−1。',effects:{cash:35,ap:-1,risk:-1,materials:{'MAT-001':-1},relations:{station:3}}},
  {id:'EVT-001-donate',label:'添一份照明补给',costText:'30Cr',rewardText:'站务关系+5',result:'30Cr照明补给已登记，季棠替夜班同事道谢。站务关系+5。',effects:{cash:-30,relations:{station:5}}},
  {id:'EVT-001-pass',label:'先照顾今天的柜台',costText:'无',rewardText:'保留现有资源',result:'季棠另找了轮值维修员，今天的柜台照常营业；现金、AP和材料均未变化。',effects:{}}
 ]},
 {id:'EVT-002',title:'温室里的细雾',speakerId:'CHR-008',description:'洛弥带来堵塞的雾化喷头。幼苗的水分不能忽多忽少，她愿意用温室备用耗材换一次修整。',choices:[
  {id:'EVT-002-service',label:'修整喷头',costText:'1AP、陶瓷补片×1',rewardText:'冷却凝胶×3；站务关系+3',result:'喷头恢复均匀细雾。消耗1AP与陶瓷补片×1，收到冷却凝胶×3；站务关系+3。',effects:{ap:-1,materials:{'MAT-002':-1,'MAT-005':3},relations:{station:3}}},
  {id:'EVT-002-water',label:'合购温室维护包',costText:'24Cr',rewardText:'导电纤维×2；站务关系+2',result:'温室维护包按合购价结清24Cr。洛弥分给店里导电纤维×2，站务关系+2。',effects:{cash:-24,materials:{'MAT-001':2},relations:{station:2}}},
  {id:'EVT-002-pass',label:'让温室按原排班维修',costText:'无',rewardText:'保留现有资源',result:'洛弥记下原排班时间，先用手动喷壶照看幼苗；店铺资源未变化。',effects:{}}
 ]},
 {id:'EVT-003',title:'短波里的空白',speakerId:'CHR-002',description:'阿篁的公共短波电台只剩沙沙声。整流线圈老化，修好后拾荒船就能收到今晚的安全航道播报。',choices:[
  {id:'EVT-003-coil',label:'换线圈并复测',costText:'2AP、标准微线圈×1',rewardText:'65Cr；拾荒关系+3',result:'短波里重新传来航道播报。消耗2AP、标准微线圈×1，收到维修费65Cr；拾荒关系+3。',effects:{cash:65,ap:-2,materials:{'MAT-003':-1},relations:{salvage:3}}},
  {id:'EVT-003-tune',label:'帮忙调到备用频段',costText:'1AP',rewardText:'20Cr；拾荒关系+1',result:'备用频段暂时接通，阿篁会另约换件。调频消耗1AP，劳务费20Cr到账；拾荒关系+1。',effects:{cash:20,ap:-1,relations:{salvage:1}}},
  {id:'EVT-003-pass',label:'请他联系无线电值班室',costText:'无',rewardText:'保留现有资源',result:'阿篁把电台送去值班室，没有从店里领取钱或材料。',effects:{}}
 ]},
 {id:'EVT-004',title:'夜班补给的最后一段',speakerId:'CHR-007',description:'桑禾的补给车停在货梯另一侧。夜班保温箱只差一段短驳，她把搬运工钱和合购清单摊在柜台上。',choices:[
  {id:'EVT-004-route',label:'帮忙完成短驳',costText:'1AP',rewardText:'32Cr；商会关系+2',result:'保温箱准点送到夜班入口。短驳消耗1AP，收到32Cr；商会关系+2。',effects:{cash:32,ap:-1,relations:{merchant:2}}},
  {id:'EVT-004-pool',label:'搭车合购冷却耗材',costText:'24Cr',rewardText:'冷却凝胶×3；商会关系+1',result:'桑禾把合购的冷却凝胶×3送到工具柜，支付24Cr；商会关系+1。',effects:{cash:-24,materials:{'MAT-005':3},relations:{merchant:1}}},
  {id:'EVT-004-pass',label:'留在柜台等预约',costText:'无',rewardText:'保留现有资源',result:'桑禾叫来了货梯值班员，店铺继续接待预约；资源未变化。',effects:{}}
 ]},
 {id:'EVT-005',title:'失物柜的无名信标',speakerId:'CHR-003',description:'饶静带来一枚失物柜信标，需要把序号和拾取地点写清楚。它是站务托管物，不会进入店铺货架。',choices:[
  {id:'EVT-005-register',label:'核号封存失物记录',costText:'1AP、合规封签×1',rewardText:'站务关系+4；风险−5',result:'无名信标已随核号记录交回失物柜，消耗1AP与合规封签×1。站务关系+4，风险−5；店铺库存归属未变。',effects:{ap:-1,risk:-5,materials:{'MAT-004':-1},relations:{station:4}}},
  {id:'EVT-005-location',label:'只补充目击地点',costText:'无',rewardText:'站务关系+1',result:'你补充了信标的目击地点，饶静接着核对失主。站务关系+1，没有收取或交出货物。',effects:{relations:{station:1}}},
  {id:'EVT-005-pass',label:'让失物柜按流程查询',costText:'无',rewardText:'保留现有资源',result:'饶静将信标带回失物柜继续查询，店铺资源未变化。',effects:{}}
 ]},
 {id:'EVT-006',title:'废舱维修联保',speakerId:'CHR-004',description:'栗叔把几家小店的备件需求凑成一张表。有人缺纤维，有人缺线圈；交换都当面点清，不牵动店里的实物库存。',choices:[
  {id:'EVT-006-exchange',label:'换取通用接线',costText:'标准微线圈×1',rewardText:'导电纤维×2；拾荒关系+1',result:'一枚标准微线圈换到导电纤维×2，双方当面点清。拾荒关系+1。',effects:{materials:{'MAT-003':-1,'MAT-001':2},relations:{salvage:1}}},
  {id:'EVT-006-sort',label:'替联保组整理备件',costText:'2AP',rewardText:'标准微线圈×1、陶瓷补片×1；拾荒关系+2',result:'联保备件分箱完成，消耗2AP，收到标准微线圈×1和陶瓷补片×1；拾荒关系+2。',effects:{ap:-2,materials:{'MAT-003':1,'MAT-002':1},relations:{salvage:2}}},
  {id:'EVT-006-pass',label:'暂不加入本次联保',costText:'无',rewardText:'保留现有资源',result:'栗叔在表上留了下次联保的位置，本次没有交换资源。',effects:{}}
 ]},
 {id:'EVT-007',title:'第一期租金日的互助工时',speakerId:'CHR-003',description:'今天日结会收第一期租金。饶静带来一份有偿站务清点工作，报酬现在入账；它不会代扣或减免日结租金。',choices:[
  {id:'EVT-007-work',label:'接下临时清点',costText:'2AP',rewardText:'75Cr；站务关系+2',result:'临时清点完成，消耗2AP，劳务费75Cr到账；站务关系+2。租金仍在日结按原额结算。',effects:{cash:75,ap:-2,relations:{station:2}}},
  {id:'EVT-007-receipts',label:'补印邻里租务凭单',costText:'20Cr',rewardText:'站务关系+4；风险−2',result:'凭单印制费20Cr已付，邻里核账更清楚。站务关系+4，风险−2；本店租金仍由日结收取。',effects:{cash:-20,risk:-2,relations:{station:4}}},
  {id:'EVT-007-pass',label:'按原计划准备日结',costText:'无',rewardText:'保留现有资源',result:'你继续准备日结，本次互助未扣款；租金会在日结时显示。',effects:{}}
 ]},
 {id:'EVT-008',title:'打字机里的遗失页',speakerId:'CHR-009',description:'闻铎从旧打字机里找到一页未寄出的家书。他愿意出整理费，把纸页与来历分开记录，等待真正的收信人。',choices:[
  {id:'EVT-008-copy',label:'整理可辨认的文字',costText:'1AP',rewardText:'20Cr；商会关系+2',result:'可辨认的文字与未知处分别记下，家书由闻铎带走。消耗1AP，整理费20Cr到账；商会关系+2。',effects:{cash:20,ap:-1,relations:{merchant:2}}},
  {id:'EVT-008-seal',label:'赠一枚保护封签',costText:'合规封签×1',rewardText:'商会关系+4',result:'家书加上保护封签×1，闻铎会继续查找收信人；商会关系+4。',effects:{materials:{'MAT-004':-1},relations:{merchant:4}}},
  {id:'EVT-008-pass',label:'让他向档案室求助',costText:'无',rewardText:'保留现有资源',result:'闻铎收好家书前往档案室，店铺没有接收这件失物。',effects:{}}
 ]},
 {id:'EVT-009',title:'诊疗样本的冷却接力',speakerId:'CHR-006',description:'季棠要把诊疗样本转交检验舱。保冷箱缺凝胶，也需要有人走一趟检查运输通道。',choices:[
  {id:'EVT-009-gel',label:'供应保冷凝胶',costText:'冷却凝胶×2',rewardText:'45Cr；站务关系+3',result:'保冷箱补入冷却凝胶×2，耗材款45Cr结清；站务关系+3。',effects:{cash:45,materials:{'MAT-005':-2},relations:{station:3}}},
  {id:'EVT-009-route',label:'帮忙检查运输通道',costText:'1AP',rewardText:'冷却凝胶×1；站务关系+1',result:'通道检查完毕，消耗1AP，季棠送来备用冷却凝胶×1；站务关系+1。',effects:{ap:-1,materials:{'MAT-005':1},relations:{station:1}}},
  {id:'EVT-009-pass',label:'请检验舱安排接力',costText:'无',rewardText:'保留现有资源',result:'检验舱安排了接力员，样本没有留在店里，店铺资源未变化。',effects:{}}
 ]},
 {id:'EVT-010',title:'给幼苗重排光时',speakerId:'CHR-008',description:'洛弥发现温室一排灯片老化，幼苗的光时表需要重排。她把替换灯片和合购耗材的两种办法写得清清楚楚。',choices:[
  {id:'EVT-010-light',label:'更换灯片校光',costText:'1AP、光学透片×1',rewardText:'55Cr；站务关系+3',result:'光斑与光时表重新校准，消耗1AP、光学透片×1，收到55Cr；站务关系+3。',effects:{cash:55,ap:-1,materials:{'MAT-006':-1},relations:{station:3}}},
  {id:'EVT-010-pool',label:'参与温室耗材合购',costText:'28Cr',rewardText:'冷却凝胶×2、合规封签×1；站务关系+2',result:'支付28Cr合购款，工具柜收到冷却凝胶×2与合规封签×1；站务关系+2。',effects:{cash:-28,materials:{'MAT-005':2,'MAT-004':1},relations:{station:2}}},
  {id:'EVT-010-pass',label:'保留今天的维修排班',costText:'无',rewardText:'保留现有资源',result:'洛弥按温室原排班处理灯片，你的现金、AP和材料未变化。',effects:{}}
 ]},
 {id:'EVT-011',title:'数据风暴前的一份备份',speakerId:'CHR-005',description:'澄九正在帮居民备份旧终端。她只收有授权的数据，需要有人核对清单并把备份封装好。',choices:[
  {id:'EVT-011-backup',label:'核对并封装备份',costText:'2AP、合规封签×1',rewardText:'68Cr；商会关系+3；风险−2',result:'授权与备份清单逐项核对完成。消耗2AP、合规封签×1，收到68Cr；商会关系+3，风险−2。',effects:{cash:68,ap:-2,risk:-2,materials:{'MAT-004':-1},relations:{merchant:3}}},
  {id:'EVT-011-sponsor',label:'资助居民备份名额',costText:'25Cr',rewardText:'商会关系+4；站务关系+1',result:'25Cr居民备份名额已登记，商会关系+4，站务关系+1。',effects:{cash:-25,relations:{merchant:4,station:1}}},
  {id:'EVT-011-pass',label:'请她按预约顺序处理',costText:'无',rewardText:'保留现有资源',result:'澄九收起授权表继续处理预约，店铺没有接收居民数据。',effects:{}}
 ]},
 {id:'EVT-012',title:'货船共用的清点台',speakerId:'CHR-007',description:'桑禾组织几艘货船共用清点台。她需要人手核对箱数，也愿意按清单交换两种通用耗材。',choices:[
  {id:'EVT-012-count',label:'协助核箱与签收',costText:'2AP',rewardText:'58Cr；商会关系+3',result:'箱数与签收单一致，消耗2AP，清点费58Cr到账；商会关系+3。',effects:{cash:58,ap:-2,relations:{merchant:3}}},
  {id:'EVT-012-swap',label:'交换船用护片',costText:'导电纤维×2',rewardText:'陶瓷补片×2；拾荒关系+1',result:'导电纤维×2换成陶瓷补片×2，双方当面点清；拾荒关系+1。',effects:{materials:{'MAT-001':-2,'MAT-002':2},relations:{salvage:1}}},
  {id:'EVT-012-pass',label:'不占用今天的清点台',costText:'无',rewardText:'保留现有资源',result:'桑禾把清点台留给其他船组，店铺资源未变化。',effects:{}}
 ]},
 {id:'EVT-013',title:'旧轨航标的值夜灯',speakerId:'CHR-004',description:'栗叔的船组准备值夜巡航，岸边航标要换线圈。也可以给站务值夜组补一份照明物资。',choices:[
  {id:'EVT-013-beacon',label:'修好航标驱动',costText:'1AP、标准微线圈×1',rewardText:'48Cr；拾荒关系+4；风险−2',result:'航标恢复稳定闪烁。消耗1AP、标准微线圈×1，收到48Cr；拾荒关系+4，风险−2。',effects:{cash:48,ap:-1,risk:-2,materials:{'MAT-003':-1},relations:{salvage:4}}},
  {id:'EVT-013-lights',label:'添置值夜照明',costText:'25Cr',rewardText:'站务关系+4',result:'25Cr值夜照明物资已送到港口，站务关系+4。',effects:{cash:-25,relations:{station:4}}},
  {id:'EVT-013-pass',label:'请港务维修组接手',costText:'无',rewardText:'保留现有资源',result:'栗叔联系了港务维修组，店铺照常营业，没有资源变化。',effects:{}}
 ]},
 {id:'EVT-014',title:'第二期租金日的合作单',speakerId:'CHR-003',description:'第二期租金将在日结收取。饶静带来仓单复核与凭证封装两项有偿工作，可以择一接下，报酬不改变租金金额。',choices:[
  {id:'EVT-014-audit',label:'协作复核仓单',costText:'2AP',rewardText:'90Cr；站务关系+2',result:'仓单复核完成，消耗2AP，合作报酬90Cr到账；站务关系+2。第二期租金仍在日结按原额收取。',effects:{cash:90,ap:-2,relations:{station:2}}},
  {id:'EVT-014-seal',label:'供应凭证封装耗材',costText:'合规封签×2',rewardText:'40Cr；站务关系+1',result:'合规封签×2交给凭证组，耗材款40Cr到账；站务关系+1。本次没有预扣日结租金。',effects:{cash:40,materials:{'MAT-004':-2},relations:{station:1}}},
  {id:'EVT-014-pass',label:'留出工时处理本店账目',costText:'无',rewardText:'保留现有资源',result:'合作单交回值班室，你按原计划准备租金与日结；本次资源未变化。',effects:{}}
 ]},
 {id:'EVT-015',title:'育苗箱旁的交换桌',speakerId:'CHR-008',description:'洛弥在温室摆了张小交换桌。闲置的透片可以交换保温材料，育苗箱维护团购也还有余量。',choices:[
  {id:'EVT-015-swap',label:'交换备用透片',costText:'冷却凝胶×1、陶瓷补片×1',rewardText:'光学透片×2；站务关系+3',result:'冷却凝胶×1与陶瓷补片×1换到光学透片×2；站务关系+3。',effects:{materials:{'MAT-005':-1,'MAT-002':-1,'MAT-006':2},relations:{station:3}}},
  {id:'EVT-015-pool',label:'参加育苗箱维护团购',costText:'32Cr',rewardText:'标准微线圈×2；站务关系+1',result:'支付32Cr团购款，收到标准微线圈×2；站务关系+1。',effects:{cash:-32,materials:{'MAT-003':2},relations:{station:1}}},
  {id:'EVT-015-pass',label:'给别的维修铺留份额',costText:'无',rewardText:'保留现有资源',result:'洛弥把余量留给其他维修铺，店铺资源未变化。',effects:{}}
 ]},
 {id:'EVT-016',title:'失物归航的签收单',speakerId:'CHR-007',description:'桑禾终于联系上失物柜一只工具箱的主人。工具箱一直由站务保管，她请你帮忙核对归航船班与签收清单。',choices:[
  {id:'EVT-016-sign',label:'核对船班并封好清单',costText:'1AP、合规封签×1',rewardText:'28Cr；商会关系+4；风险−3',result:'归航船班与失主签收一致。消耗1AP、合规封签×1，收到28Cr；商会关系+4，风险−3。工具箱由站务直接交还。',effects:{cash:28,ap:-1,risk:-3,materials:{'MAT-004':-1},relations:{merchant:4}}},
  {id:'EVT-016-call',label:'提供失物柜联系号码',costText:'无',rewardText:'站务关系+1',result:'失主拿到失物柜的联系号码，后续由站务办理；站务关系+1。',effects:{relations:{station:1}}},
  {id:'EVT-016-pass',label:'请桑禾直接去失物柜',costText:'无',rewardText:'保留现有资源',result:'桑禾前往失物柜办理签收，店铺资金、AP、材料和实物归属未变。',effects:{}}
 ]},
 {id:'EVT-017',title:'公共电台里的晚安',speakerId:'CHR-002',description:'阿篁想恢复旧港的晚安广播。播报台的信号灯与接线都得检修，备用收音机也缺一枚线圈。',choices:[
  {id:'EVT-017-broadcast',label:'检修播报台',costText:'1AP、导电纤维×1、光学透片×1',rewardText:'62Cr；拾荒关系+3',result:'信号灯亮起，旧港又听见晚安广播。消耗1AP、导电纤维×1和光学透片×1，收到62Cr；拾荒关系+3。',effects:{cash:62,ap:-1,materials:{'MAT-001':-1,'MAT-006':-1},relations:{salvage:3}}},
  {id:'EVT-017-radio',label:'赠送备用收音机线圈',costText:'标准微线圈×1',rewardText:'站务关系+3；风险−1',result:'标准微线圈×1送到公共电台，备用接收机恢复值守；站务关系+3，风险−1。',effects:{risk:-1,materials:{'MAT-003':-1},relations:{station:3}}},
  {id:'EVT-017-pass',label:'等广播恢复后再收听',costText:'无',rewardText:'保留现有资源',result:'阿篁继续安排检修，你留下收听频率，店铺资源未变化。',effects:{}}
 ]},
 {id:'EVT-018',title:'收藏家的公开展示柜',speakerId:'CHR-009',description:'闻铎准备开放一个免费展示柜。他不需要店里的货，只需要为自带藏品整理说明，或者凑一批展示灯片。',choices:[
  {id:'EVT-018-labels',label:'整理藏品说明与封签',costText:'2AP、合规封签×1',rewardText:'80Cr；商会关系+4',result:'藏品说明标清已知与未知，消耗2AP、合规封签×1，收到80Cr；商会关系+4。藏品仍由闻铎保管。',effects:{cash:80,ap:-2,materials:{'MAT-004':-1},relations:{merchant:4}}},
  {id:'EVT-018-lenses',label:'合购展示灯片',costText:'40Cr',rewardText:'光学透片×3；商会关系+2',result:'展示灯片合购结清40Cr，店里分得光学透片×3；商会关系+2。',effects:{cash:-40,materials:{'MAT-006':3},relations:{merchant:2}}},
  {id:'EVT-018-pass',label:'先收下开放时间表',costText:'无',rewardText:'保留现有资源',result:'闻铎留下展示柜开放时间表，本次没有委托或物品交接。',effects:{}}
 ]},
 {id:'EVT-019',title:'救援艇补给清单',speakerId:'CHR-006',description:'季棠替救援艇核对耗材。急救箱要补凝胶与护片，也有一份只需人手的清单复核工作。',choices:[
  {id:'EVT-019-supply',label:'供应救援艇耗材',costText:'冷却凝胶×2、陶瓷补片×1',rewardText:'72Cr；站务关系+5',result:'救援艇收到冷却凝胶×2和陶瓷补片×1，补给款72Cr结清；站务关系+5。',effects:{cash:72,materials:{'MAT-005':-2,'MAT-002':-1},relations:{station:5}}},
  {id:'EVT-019-list',label:'帮助复核急救清单',costText:'1AP',rewardText:'25Cr；站务关系+2',result:'清单复核完成，消耗1AP，劳务费25Cr到账；站务关系+2。',effects:{cash:25,ap:-1,relations:{station:2}}},
  {id:'EVT-019-pass',label:'请救援艇走常规补给',costText:'无',rewardText:'保留现有资源',result:'季棠联系了常规补给点，店铺的现金、AP和材料未变化。',effects:{}}
 ]},
 {id:'EVT-020',title:'旧港重新点灯的周年',speakerId:'CHR-004',description:'今天是旧港公共灯带重新点亮的周年。栗叔把邻里请到廊桥，既缺聚餐经费，也缺布置灯带的人手。',choices:[
  {id:'EVT-020-table',label:'添一桌邻里饭菜',costText:'60Cr',rewardText:'站务、拾荒、商会关系各+4；风险−3',result:'60Cr添了邻里饭菜，旧港的三班人坐到了一起。站务、拾荒、商会关系各+4，风险−3。',effects:{cash:-60,risk:-3,relations:{station:4,salvage:4,merchant:4}}},
  {id:'EVT-020-lights',label:'接下灯带布置',costText:'2AP',rewardText:'45Cr；拾荒关系+4；商会关系+2',result:'廊桥灯带按时亮起。布置消耗2AP，劳务费45Cr到账；拾荒关系+4，商会关系+2。',effects:{cash:45,ap:-2,relations:{salvage:4,merchant:2}}},
  {id:'EVT-020-pass',label:'从店门口向邻里问好',costText:'无',rewardText:'保留现有资源',result:'你从店门口向廊桥挥手，继续照看柜台；没有扣款或消耗材料。',effects:{}}
 ]},
 {id:'EVT-021',title:'第三期租金与回环之约',speakerId:'CHR-005',description:'第三期租金仍将在今天日结时收取。澄九带来最后一批账目，也提醒你给这段忙碌的经营留一点喘息。',choices:[
  {id:'EVT-021-accounts',label:'封装邻里账目副本',costText:'1AP、合规封签×1',rewardText:'50Cr；商会关系+3；站务关系+3',result:'邻里账目副本封装完成，消耗1AP、合规封签×1，收到50Cr；商会关系+3，站务关系+3。第三期租金仍在日结收取。',effects:{cash:50,ap:-1,materials:{'MAT-004':-1},relations:{merchant:3,station:3}}},
  {id:'EVT-021-rest',label:'在茶凉前歇一会儿',costText:'无',rewardText:'恢复2AP（上限12）；风险−2',result:'你和澄九喝完一杯茶，再回到柜台。恢复2AP（不超过12AP），风险−2；租金与维护费仍按原流程结算。',effects:{ap:2,risk:-2}},
  {id:'EVT-021-pass',label:'按原计划完成今天',costText:'无',rewardText:'保留现有资源',result:'澄九留下回环之约，你继续今天的业务；本次资源没有变化，日结照常开放。',effects:{}}
 ]}
];
export const stationEvents:readonly StationEvent[]=Object.freeze(eventDefinitions.map(freezeEvent));

const fixedDays:Readonly<Record<number,string>>=Object.freeze({1:'EVT-001',7:'EVT-007',14:'EVT-014',20:'EVT-020',21:'EVT-021'});

/** A complete, stable deck; rent and anniversary invitations keep their calendar dates. */
export function eventForDay(seed:string,day:number):StationEvent|null {
 if(!Number.isInteger(day)||day<1||day>21)return null;
 if(fixedDays[day])return stationEvents.find(event=>event.id===fixedDays[day])||null;
 const fixedIds=Object.values(fixedDays),deck=stationEvents.filter(event=>!fixedIds.includes(event.id));
 let draw=2166136261;
 for(let i=0;i<seed.length;i++){draw^=seed.charCodeAt(i);draw=Math.imul(draw,16777619);}
 for(let i=deck.length-1;i>0;i--){draw=(Math.imul(draw,1664525)+1013904223)>>>0;const j=draw%(i+1);[deck[i],deck[j]]=[deck[j],deck[i]];}
 let index=0;for(let date=2;date<day;date++)if(!fixedDays[date])index++;
 return deck[index]||null;
}

/** Shared UI/reducer gate. Choice ids are resolved against today's canonical effects. */
export function eventAvailability(state:OrbitalState,choice:StationEventChoice):string|null {
 if(state.phase!=='open')return'每日事件只在营业期间处理。';
 if(state.trade)return'先完成当前交易或送客，再处理每日事件。';
 const event=eventForDay(state.seed,state.day),option=event?.choices.find(candidate=>candidate.id===choice.id);
 if(!event||!option)return'这项选择已不属于今天的事件。';
 if(state.events.some(record=>record.day===state.day)||state.ledger.some(entry=>entry.id===`station-event-day-${state.day}`))return'今天的事件已经处理，不能重复领取结果。';
 const effect=option.effects,cash=state.cash+(effect.cash||0);
 if(cash<0)return`现金不足，需要${-(effect.cash||0)}Cr。`;
 if(!Number.isFinite(cash)||cash>1e9)return'现金已达到保存上限，请先安排其他业务。';
 if(state.ap+(effect.ap||0)<0)return`行动点不足，需要${-(effect.ap||0)}AP。`;
 for(const [id,delta] of Object.entries(effect.materials||{})){
  const material=materials.find(material=>material.id===id),amount=(state.materials[id]||0)+delta;
  if(!material||amount<0)return`${material?.name||'材料'}不足，本次不会扣除其他资源。`;
  if(!Number.isSafeInteger(amount)||amount>99999)return`${material.name}已达到材料容量上限，本次不会扣除其他资源。`;
 }
 return null;
}
