import type {OrbitalItem,ToolId} from './types';
import {CONTENT_ITEMS} from './ContentExpansion';

// Mechanical/functional symptoms are separate from authenticity and provenance.
const functionFaults:Record<string,string>={
  'ITM-001':'滤层接缝渗漏，循环压力无法维持','ITM-002':'加热温升断续，底部触点电阻偏高',
  'ITM-003':'灯叶照度不均，老化透片使光斑偏蓝','ITM-009':'投影三色轮廓存在像差，光路需要重校',
  'ITM-010':'电流偏高，电源线圈接近失效','ITM-011':'一臂转速延迟，悬浮重心偏移',
  'ITM-017':'第二关节回弹慢，接口有氧化阻滞','ITM-018':'镜片微划痕造成重影，成像清晰度下降',
  'ITM-019':'空载传感器偏移，自检红灯无法复位','ITM-025':'偏心配重引起转轴拖尾倾斜',
  'ITM-026':'齿杆末端缺齿，极限位置卡住','ITM-027':'悬浮线圈断路，无法维持额定间隙',
  'ITM-033':'机芯游丝迟滞，走时误差超出公差','ITM-034':'章体固定扣损坏，无法安全装戴',
  'ITM-035':'纸层受潮翘曲，图像与字迹难以完整辨认','ITM-041':'藻团出现污染灰点，遇光伸展不足',
  'ITM-042':'苔藓枯边扩大，余辉强度低于基准','ITM-043':'内部裂隙改变折射，传导响应不稳定',
  'ITM-048':'沙盒测试触点松动，演示响应间歇中断','ITM-049':'定位脉冲漂移，无法保持稳定信号',
  'ITM-050':'闭锁机构卡滞，货匣不能可靠封闭','ITM-055':'充放电轨迹存在固定缺口，容量不足',
  'ITM-056':'悬摆轴端磨损，摆幅无法保持稳定','ITM-057':'空载指示正常，但负载下电压快速跌落',
  'ITM-061':'陶瓷阀座开裂，增载时气阀回弹过慢','ITM-062':'整流线圈断续，手摇后电压快速跌落',
  'ITM-063':'蓝色透片老化，左右星图产生双影','ITM-064':'冷却凝胶干涸，保温曲线持续上扬',
  'ITM-065':'左后足驱动线圈失步，转弯时拖行','ITM-066':'传感头矿尘污染，风速输出跳变',
  'ITM-067':'回车棘爪磨损，连续输入后字车卡住','ITM-068':'浮子配重偏离基准，流量读数偏高',
  'ITM-069':'压杆弹簧偏移，压印回位缓慢','ITM-070':'轮缘偏磨，停转曲线过陡且伴随摆动',
  'ITM-071':'导电触点氧化，喷嘴脉冲断续','ITM-072':'晶柱读取响应不稳定，部分帧无法还原',
};

/** Reads saved physical facts without changing old objects, provenance or collected evidence. */
export function getItemFaultLabel(it:OrbitalItem):string {
  if(it.working)return it.repaired?'维修与复测通过，功能已恢复。':'功能响应正常，未发现失效症状。';
  return `异常响应：${functionFaults[it.defId]||CONTENT_ITEMS.find(d=>d.id===it.defId)?.defect||'功能响应偏离型号基准'}`;
}
function physicalClue(it:OrbitalItem,tool:ToolId):string {
  const wear=it.condition>=.85?'外壳仅有轻微使用痕迹':it.condition>=.65?'接缝有磨损和旧装配痕迹':'接缝与活动部件磨损明显';
  const result=it.working?(it.repaired?'维修后的复测响应稳定，故障已排除':'工作响应稳定，未出现失效症状'):getItemFaultLabel(it);
  switch(tool){
    case 'TOL-001':return `侧光观察：${wear}。${it.repaired?'可见本店修复标记。':''}`;
    case 'TOL-002':return `紫外显影：${getItemMark(it)}；${it.sourceVerified?'来源回执可交叉核对':'来源回执仍需补证'}。`;
    case 'TOL-003':return `材料谱线：${it.authentic?'主材与型号参考谱一致':'主材与原厂参考谱不一致，符合替代件或复制品特征'}。`;
    case 'TOL-004':return `接口回路：${result}。`;
    case 'TOL-005':return `质量校零：${it.authentic?'质量分布落在原型号公差内':'质量分布偏离原型号公差，需结合暗纹判断真伪'}。`;
    case 'TOL-006':return `模拟负载：${result}。${it.condition<.65?'磨损仍会限制长期可靠性。':''}`;
  }
}
export function getItemClue(it:OrbitalItem,tool:ToolId):string {
  const focus=CONTENT_ITEMS.find(def=>def.id===it.defId)?.clues[tool];
  return physicalClue(it,tool)+(focus?` 本次核对：${focus}。`:'');
}
export function getItemMark(it:OrbitalItem):string {
  return it.authentic?'原始编号与底层暗纹一致':'编号重叠 / 复制暗纹与原厂记录不符';
}
