import type {Node} from 'cc';
import type {CoachStep} from './Coach';
import type {PageId} from './types';
import {tools} from './data';
import {PhoneUI} from './PhoneUI';
import type {OrbitalUI,HudIcon} from './OrbitalUI';

/** First-day guided tour. Steps with `until` wait for the player to act through the spotlight. */
export const TUTORIAL:CoachStep[]=[
  {id:'welcome',title:'欢迎接手轨道旧货局',text:'你刚接下回环九号下层旧港的这家当铺。\n收购旧物、鉴定真伪、修好再卖，每 7 天交一次租金，撑满 21 天就算站稳脚跟。'},
  {id:'hud',title:'经营仪表',target:'player-resource-hud',text:'营业日：21 天中的第几天。\n行动点：每天 12 点，接客、首次鉴定、维修都会用掉。\n现金：每天打烊扣 20 Cr 维护费，第 7/14/21 天还要交租。'},
  {id:'arrive',title:'接待第一位客人',target:'button-接待下一位来客',pages:['counter'],until:s=>!!s.trade,skip:s=>!!s.trade,text:'点击「接待下一位来客」。客人会把要卖的东西放到柜台上（消耗 1 行动点）。'},
  {id:'terminal',title:'看懂交易终端',target:'counter-terminal',pages:['counter','trade'],skip:s=>!s.trade,text:'大数字是客人开的价，下面是你对这件货的估值区间。\n区间越宽，说明你越没把握——先鉴定再出价。'},
  {id:'pickup',title:'拿起实物',target:'button-拿起实物 · 鉴定',pages:['counter'],until:(_s,p)=>p==='inspect',skip:s=>!s.trade,text:'点击「拿起实物 · 鉴定」，把货拿到鉴定台上仔细看。'},
  {id:'tools',title:'六种鉴定仪器',target:'inspection-tools',pages:['inspect'],pad:6,text:'左边是六种仪器：侧光、显纹、谱峰、回路、称量、负载。\n不同货物适合不同仪器，货物图鉴里写着建议检测。\n第一次鉴定一件货花 1 行动点，之后再测免费。'},
  {id:'sidelight',title:'用侧光找痕迹',target:'inspection-viewport',pages:['inspect'],pad:0,until:s=>!!(s.trade?.item&&s.trade.item.evidence.length>0),skip:s=>!s.trade?.item,text:'现在选中的是「侧光」。点击实物上标着 1、2、3 的三处疑点，记录下第一条物证。\n也可以按键盘 1–6 切换其他仪器。'},
  {id:'book',title:'物证册',target:'evidence-book',pages:['inspect'],pad:4,skip:s=>!s.trade,text:'每条物证都会让估值区间收窄。\n证据越多，你越清楚这件货值多少，还价也越有底气。'},
  {id:'back',title:'回到柜台',target:'button-01 柜台',until:(_s,p)=>p==='counter'||p==='trade',skip:s=>!s.trade,text:'点击底部的「柜台」回到客人面前。'},
  {id:'haggle',title:'开始议价',target:'button-商量报价',pages:['counter'],until:(_s,p)=>p==='trade',skip:s=>!s.trade||s.trade.locked,text:'点击「商量报价」进入还价。'},
  {id:'desk',title:'还价台',target:'negotiation-console',pages:['trade'],pad:4,skip:s=>!s.trade||s.trade.locked,text:'在报价屏上直接输入，或用 −10 / +10 调整。\n把物证小票拖到报价屏上作为依据，再点提出键。\n客人只有 3 轮耐心，压价太狠会直接走人。'},
  {id:'accept',title:'成交',target:'counter-terminal',pages:['counter','trade'],until:s=>!s.trade||s.trade.locked,skip:s=>!s.trade,text:'觉得价格合适，就点「接受当前报价」锁定价格；也可以先还价试试。'},
  {id:'deliver',title:'钱货交割',target:'button-确认钱货交割',pages:['counter','trade'],until:s=>!s.trade,skip:s=>!s.trade,text:'价格锁定后，点击「确认钱货交割」——钱和货在这一刻才真正交换（1 行动点）。'},
  {id:'dock',title:'其余业务',target:'navigation-dock',pad:4,text:'维修：修好故障货，售价更高。\n仓储：整理货架、扫描来源、挂牌出售。\n订单：接委托赚报酬。\n日结：打烊、结算维护费和租金。'},
  {id:'help',title:'随时查看说明',target:'button-帮助',text:'不清楚规则时，点这里打开完整的经营手册，也能重新播放这段引导。\n祝你好运，店主！'},
];

/** One-time page tips shown on the first visit to each workspace. */
export const PAGE_TIPS:Partial<Record<PageId,CoachStep>>={
  repair:{id:'tip-repair',title:'维修台',target:'repair-process-rail',text:'左边选一件待修的货，按工序条的三步操作：拆盖、换件/接线、校准复测。\n材料和工时在最后「确认维修并复测」时才扣除。修好的货估值更高。'},
  warehouse:{id:'tip-warehouse',title:'仓储与安检',target:'warehouse-grid-bed',text:'后仓是 10×6 的格子，拖动货物换位置，「旋转 90°」可以转向。\n右侧档案里可以上架出售、扫描、登记来源、隔离可疑货。来源不明的货会提高站务关注度。'},
  orders:{id:'tip-orders',title:'订单与委托',target:'order-clipboard',text:'选一张委托单查看要求，先「接取订单」。\n备好符合条件的货后，把它拖进交付盘，确认交付即可领取报酬。注意截止日期。'},
  report:{id:'tip-report',title:'日结',target:'daily-navigation-ledger',text:'打烊后在这里看今天的收支小票。\n每天扣 20 Cr 维护费，第 7/14/21 天交租。第 3 天起，日结时可以选购一项设备升级。'},
};

interface ManualSection {title:string;icon:HudIcon;body:string;tools?:boolean}
const SECTIONS:ManualSection[]=[
  {title:'目标与节奏',icon:'goal',body:'你经营回环九号下层旧港的一家旧货当铺，共 21 天。\n\n• 开局现金 1200 Cr，每天 12 行动点（AP），次日补满。\n• 每天打烊扣 20 Cr 能源维护费。\n• 第 7、14、21 天交租：450 / 495 / 545 Cr。\n• 现金不够付账时，会开放一次「应急清仓」救济：在仓储把合法自有货按估值 55% 变现。\n• 21 天结束时，根据你的经营方式和站务关注度给出结局。'},
  {title:'柜台交易',icon:'counter',body:'• 「接待下一位来客」消耗 1 AP，每天最多 6 位预约。\n• 交易终端显示客人报价和你的估值区间；估值区间随物证收窄。\n• 「商量报价」：输入或用 ±10 调整还价，把物证小票拖到报价屏上做依据，再「提出」。\n• 客人有 3 轮耐心；连续两次报价太离谱，客人会直接离开。\n• 「接受当前报价」锁定价格，「确认钱货交割」才真正成交（1 AP）。\n• 「更多」里可以礼貌拒绝，或签抵押合同：付估值约 40% 的本金，3 天赎期 + 1 天宽限，服务费 8%。'},
  {title:'鉴定仪器',icon:'inspect',tools:true,body:'第一次鉴定一件货消耗 1 AP，之后同一件货再用其他仪器都免费。每件货只对部分仪器有反应，货物图鉴里写着建议检测。\n\n鉴定台操作：拖动实物移动，滚轮或 −/+ 缩放，R 旋转，F 翻面，键盘 1–6 切换仪器。'},
  {title:'维修与组装',icon:'repair',body:'• 在维修台左侧选择一件待修货物。\n• 按工序条完成三步：拆开检修盖 → 换件或接线 → 校准复测。每步都可以点「辅助」按钮完成拖放。\n• 材料和工时 AP 在「确认维修并复测」时一次性扣除；缺材料时去「材料箱 / 采购」购买（不耗 AP）。\n• 修好后货物恢复功能，估值上升。\n• 「拆解回收」把自有货拆成材料；「组装维护套组」把伺服器和轴承组装成新货。'},
  {title:'仓储与安检',icon:'warehouse',body:'• 后仓 10×6 格，拖动货物到空格放置，「旋转 90°」改变占格方向；红色表示位置冲突。\n• 「放上销售架」挂牌出售，采购商来访时可以从仓库挑货推荐。\n• 「扫描当前物件」记录货物状态；「登记并封签」需要扫描 + 2 项独立物证 + 35 Cr / 1 AP，登记后来源合法。\n• 来源不明的收购会提高站务关注度；可疑货可以放进隔离柜，或退回来源方。\n• 抵押柜里的货在赎期内不能出售或维修。'},
  {title:'订单委托',icon:'orders',body:'• 订单分「当前委托 / 历史记录 / 待开放」三组；待开放的委托到指定日期才能接。\n• 选中订单后点「接取订单」。顾客委修的原物会放进保管位，归属仍是顾客。\n• 准备好符合型号、品相、修复状态和物证要求的货，点击或拖进交付盘，系统会列出缺项。\n• 确认交付后领取报酬（1 AP）。过期的委托会失败，原物仍需按归属处理。'},
  {title:'日结与升级',icon:'report',body:'• 点底部「日结」确认打烊：扣除维护费和到期租金，生成当天的营业小票。\n• 第 3 天起，日结时可以选一项设备升级（每天限一项）：\n   精密工作灯 120 Cr：之后每件货的首次鉴定不再消耗 AP。\n   模组销售架 160 Cr：合规货物的挂牌价提高 5%。\n• 点「迎接第 N 天」进入下一天，行动点补满，新客人和新订单陆续到来。'},
  {title:'操作提示',icon:'tip',body:'• 鼠标：点击按钮，拖动货物、物证小票、探针和滑块。悬停顶栏图标可以看到说明。\n• 触屏：点击和拖动相同；手机竖握时游戏会自动横向铺满屏幕。\n• 键盘：Esc 返回或关闭弹窗，空格跳过动画，Tab 切换焦点、回车确认；鉴定台 1–6 换仪器、R 旋转、F 翻面、方向键移动。\n• 右上角：图鉴查看全部货物，站务查看租金和关注度，喇叭开关声音，齿轮进入设置（减少动态、放大文字、导出档案）。'},
  {title:'每日经营事件',icon:'alert',body:'• 每天可处理一则站内消息，入口在营业菜单或站务。\n• 明确选择后才提交；关闭面板不会自动扣款。\n• 每项会写明现金、AP、材料与关系变化，资源不足时不会部分扣除。\n• 先完成当前交易，再处理事件；同一天不能重复领取结果。\n• 已处理的消息保存在事件记录，收支也会进入营业流水。'},
];

/** Illustrated manual with section tabs and a "replay tutorial" key. */
export function openManual(host:{ui:OrbitalUI;button(parent:Node,text:string,x:number,y:number,w:number,h:number,fn:()=>void,options?:{tone?:'gold'|'quiet'|'green';size?:number;name?:string;selected?:boolean}):Node},replay:()=>void,start=0):void{
  if(host.ui.phone){
    const phone=new PhoneUI(host),m=phone.sheet('经营手册');let current=Math.max(0,Math.min(SECTIONS.length-1,start));
    const draw=()=>{
      host.ui.clear(m.body);const sec=SECTIONS[current];
      phone.row(m.body,`${current+1} / ${SECTIONS.length} · ${sec.title}`,20,0,1400,76,40,'#E0A16C');
      const phoneBody:Record<string,string>={
        '柜台交易':'• 点击「接待下一位来客」，每天最多 6 位预约，消耗 1 AP。\n• 右侧终端显示客人报价；先鉴定，估值会更准确。\n• 「商量报价」可直接输入或用 ±10 改价，点「选择支持还价的物证」选依据，再提出还价。\n• 客人最多接受 3 轮议价；接受报价只锁价，点「确认钱货交割」才成交（1 AP）。\n• 「更多」可礼貌拒绝，或签抵押合同。顾客赎回时，店铺收回本金与 8% 服务费，并归还原物。',
        '鉴定仪器':'• 左侧六个大按钮切换仪器，中央可拖动实物。\n• 底部按钮负责缩放、旋转、翻面和归位。\n• 点「工具操作」，逐步观察接缝、背面扫描、调整谱峰、接线、配重或负载；条件达成后点「记录证据」。\n• 首次鉴定一件货消耗 1 AP，之后同件取证或复测免费。\n• 右上「物证」可逐页查看记录；菜单里的货物图鉴会提示建议仪器。',
        '维修与组装':'• 左侧大卡片选择实物，上一页 / 下一页浏览库存。\n• 按右侧工序按钮依次拆盖、换件、复测，再点「确认维修并复测」。\n• 缺材料时打开「材料箱 / 采购」，购买会立即扣款，维修工时在最后确认时扣除。\n• 「组装维护套组」内先装入伺服器、装入注销轴承、连接端子，再确认消耗主料和材料。\n• 顾客原物、抵押品和隔离件不能当作自有主料。',
        '仓储与安检':'• 左侧选择货物，右侧查看归属、估值和来源。\n• 「移动仓位 / 旋转」打开大格子面板；先旋转，再点选新仓位的左上格。灰格表示放不下或会重叠。\n• 登记来源需要扫描、两项独立物证、35 Cr 和 1 AP。\n• 「货物详情 / 更多」提供来源记录、隔离柜、抵押柜和返还操作。\n• 还未成交的柜台来件，需要返回柜台交割后才会入库。',
        '订单委托':'• 顶部切换当前委托、历史记录和待开放。\n• 选择订单后接取；顾客原物仍归顾客所有。\n• 在维修或仓储左侧找到本单原物，鉴定并维修；同型号的自有货不能替代委修原物。\n• 回到订单点「选择交付原物」，检查缺项，再预览并确认交付（1 AP）。\n• 光合灯订单会自动配套合格藻苗罐；两件货和报酬在最终确认时一起提交。',
        '操作提示':'• 手机横屏操作，竖握时画面会自动旋转。\n• 底部六个大按钮切换柜台、鉴定、维修、仓储、订单和日结。\n• 顶部「菜单」包含货物图鉴、站务记录、声音、设置和导出档案。\n• 工具面板支持逐步点按，关闭后会保留当前实物的操作进度。\n• 设置可开启放大文字和减少动态。确认弹窗里的「返回」会取消本次提交。',
      };
      phone.text(m.body,phoneBody[sec.title]||sec.body,20,92,1400,416,32);
      phone.button(m.body,'上一节',20,536,440,()=>{current=(current+SECTIONS.length-1)%SECTIONS.length;draw();},{name:'manual-prev'});
      phone.button(m.body,'返回游戏',504,536,440,()=>m.close(),{tone:'gold',name:'manual-phone-return'});
      phone.button(m.body,'下一节',988,536,440,()=>{current=(current+1)%SECTIONS.length;draw();},{name:'manual-next'});
    };draw();return;
  }
  const ui=host.ui,m=ui.modal('经营手册',{width:1380,height:800});
  let current=start;
  const tabs=ui.container(m.body,0,0,300,600,'manual-tabs'),page=ui.container(m.body,320,0,1000,660,'manual-page');
  const draw=()=>{
    ui.clear(tabs);ui.clear(page);
    SECTIONS.forEach((sec,i)=>{
      const step=SECTIONS.length>8?64:75;
      const b=host.button(tabs,'',0,i*step,290,step-11,()=>{current=i;draw();},{tone:'quiet',selected:i===current,name:`manual-tab-${i}`});
      const face=b.getChildByName('tech-button-surface')||b;
      ui.hudIcon(face,sec.icon,12,9,44,44);
      ui.label(face,sec.title,66,0,212,62,{size:19,color:i===current?'#FFE0B0':'#E4DFD2',verticalAlign:'center',wrap:false});
    });
    const sec=SECTIONS[current];
    const sheet=ui.paperSlip(page,0,0,1000,600,{name:'manual-sheet',torn:true});
    ui.hudIcon(sheet,sec.icon,30,24,56,56);
    ui.label(sheet,sec.title,100,24,600,56,{size:32,bold:true,color:'#2A241C',verticalAlign:'center',wrap:false});
    ui.line(sheet,30,94,970,94,'#8C7A5C66',1);
    const bodyH=sec.tools?236:470;
    ui.label(sheet,sec.body,34,110,932,bodyH,{size:19,lineHeight:30,color:'#2A241C',wrap:true,overflow:'shrink'});
    if(sec.tools){
      tools.forEach((t,i)=>{
        const x=34+(i%2)*470,y=350+Math.floor(i/2)*78;
        ui.toolIcon(sheet,t.id,x,y,64,64);
        ui.label(sheet,`${i+1} · ${t.short}`,x+76,y+2,370,26,{size:19,bold:true,color:'#9A4A1F',verticalAlign:'center',wrap:false});
        ui.label(sheet,t.instruction,x+76,y+30,380,48,{size:15,lineHeight:21,color:'#4A4034',wrap:true,overflow:'shrink'});
      });
    }
  };
  draw();
  host.button(m.body,'重新播放新手引导',0,622,290,48,()=>{m.close();replay();},{tone:'green',size:17,name:'manual-replay'});
  host.button(m.body,'上一节',320,622,180,48,()=>{current=(current+SECTIONS.length-1)%SECTIONS.length;draw();},{tone:'quiet',size:17,name:'manual-prev'});
  host.button(m.body,'下一节',1140,622,180,48,()=>{current=(current+1)%SECTIONS.length;draw();},{tone:'gold',size:17,name:'manual-next'});
}
