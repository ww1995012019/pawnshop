import type { ItemDef, ToolDef, MaterialDef, NpcDef, RecipeDef, OrderDef } from './types';
import {CONTENT_ITEMS,CONTENT_NPCS,CONTENT_RECIPES,CONTENT_ORDERS,CONTENT_ORDER_EARLIEST,PEOPLE_PROFILES} from './ContentExpansion';

export const itemDefs: ItemDef[] = [
  {
    "id": "ITM-001",
    "name": "循环水芯",
    "category": "民生与消费",
    "value": 90,
    "sprite": 0,
    "size": [
      1,
      2
    ],
    "tools": [
      "TOL-001",
      "TOL-004"
    ],
    "description": "青白陶瓷筒，透明窗可见滤层。旋转筒体→灯镜看滤层→拖动测试夹接入。",
    "defect": "裂纹在背面接缝；湿滤层与假新封签矛盾。",
    "clues": {
      "TOL-001": "侧光观察：裂纹在背面接缝；湿滤层与假新封签矛盾。",
      "TOL-004": "接口回路：裂纹在背面接缝；湿滤层与假新封签矛盾。",
      "TOL-002": "紫外显影：已记录该项读数，仍需结合相关物证。",
      "TOL-003": "材料谱线：已记录该项读数，仍需结合相关物证。",
      "TOL-005": "质量校零：已记录该项读数，仍需结合相关物证。",
      "TOL-006": "模拟负载：已记录该项读数，仍需结合相关物证。"
    },
    "recipeId": "REC-001"
  },
  {
    "id": "ITM-002",
    "name": "离子保温杯",
    "category": "民生与消费",
    "value": 55,
    "sprite": 1,
    "size": [
      1,
      1
    ],
    "tools": [
      "TOL-004",
      "TOL-006"
    ],
    "description": "铜色瘪杯，环形发光杯底。拧开杯底→探针接触两极→拨动加热档。",
    "defect": "温升曲线断续；杯底有非原装焊点。",
    "clues": {
      "TOL-004": "接口回路：温升曲线断续；杯底有非原装焊点。",
      "TOL-006": "模拟负载：温升曲线断续；杯底有非原装焊点。",
      "TOL-001": "侧光观察：已记录该项读数，仍需结合相关物证。",
      "TOL-002": "紫外显影：已记录该项读数，仍需结合相关物证。",
      "TOL-003": "材料谱线：已记录该项读数，仍需结合相关物证。",
      "TOL-005": "质量校零：已记录该项读数，仍需结合相关物证。"
    }
  },
  {
    "id": "ITM-003",
    "name": "便携光合灯",
    "category": "民生与消费",
    "value": 80,
    "sprite": 2,
    "size": [
      2,
      1
    ],
    "tools": [
      "TOL-001",
      "TOL-003"
    ],
    "description": "折叠三瓣灯，绿色透光罩。展开三片灯叶→拖动光罩比对光斑。",
    "defect": "一片灯叶偏蓝，透片老化会使照度不均。",
    "clues": {
      "TOL-001": "侧光观察：一片灯叶偏蓝，透片老化会使照度不均。",
      "TOL-003": "材料谱线：一片灯叶偏蓝，透片老化会使照度不均。",
      "TOL-002": "紫外显影：已记录该项读数，仍需结合相关物证。",
      "TOL-004": "接口回路：已记录该项读数，仍需结合相关物证。",
      "TOL-005": "质量校零：已记录该项读数，仍需结合相关物证。",
      "TOL-006": "模拟负载：已记录该项读数，仍需结合相关物证。"
    },
    "recipeId": "REC-013"
  },
  {
    "id": "ITM-009",
    "name": "袖珍全息机",
    "category": "精密电子",
    "value": 220,
    "sprite": 3,
    "size": [
      1,
      2
    ],
    "tools": [
      "TOL-002",
      "TOL-003"
    ],
    "description": "紫色三角棱体，折叠投影翼。展开投影翼→移动校准标靶→重合三色图形。",
    "defect": "紫外线下外壳编号重叠；投影像差暴露换芯。",
    "clues": {
      "TOL-002": "紫外显影：紫外线下外壳编号重叠；投影像差暴露换芯。",
      "TOL-003": "材料谱线：紫外线下外壳编号重叠；投影像差暴露换芯。",
      "TOL-001": "侧光观察：已记录该项读数，仍需结合相关物证。",
      "TOL-004": "接口回路：已记录该项读数，仍需结合相关物证。",
      "TOL-005": "质量校零：已记录该项读数，仍需结合相关物证。",
      "TOL-006": "模拟负载：已记录该项读数，仍需结合相关物证。"
    },
    "recipeId": "REC-002"
  },
  {
    "id": "ITM-010",
    "name": "腕式终端",
    "category": "精密电子",
    "value": 180,
    "sprite": 4,
    "size": [
      1,
      1
    ],
    "tools": [
      "TOL-004",
      "TOL-006"
    ],
    "description": "灰蓝腕带，可滑出的琥珀屏。滑开屏幕→拖接三根测试触点→亮屏自检。",
    "defect": "屏幕亮但电流偏高，电源线圈接近失效。",
    "clues": {
      "TOL-004": "接口回路：屏幕亮但电流偏高，电源线圈接近失效。",
      "TOL-006": "模拟负载：屏幕亮但电流偏高，电源线圈接近失效。",
      "TOL-001": "侧光观察：已记录该项读数，仍需结合相关物证。",
      "TOL-002": "紫外显影：已记录该项读数，仍需结合相关物证。",
      "TOL-003": "材料谱线：已记录该项读数，仍需结合相关物证。",
      "TOL-005": "质量校零：已记录该项读数，仍需结合相关物证。"
    },
    "recipeId": "REC-003"
  },
  {
    "id": "ITM-011",
    "name": "折叠巡检蜂",
    "category": "精密电子",
    "value": 320,
    "sprite": 5,
    "size": [
      2,
      2
    ],
    "tools": [
      "TOL-001",
      "TOL-006"
    ],
    "description": "橙黑微型无人机，四叶折翼。逐个展开机臂→测试夹触发悬浮→校正偏移环。",
    "defect": "一臂转速延迟，机腹编号被新漆覆盖。",
    "clues": {
      "TOL-001": "侧光观察：一臂转速延迟，机腹编号被新漆覆盖。",
      "TOL-006": "模拟负载：一臂转速延迟，机腹编号被新漆覆盖。",
      "TOL-002": "紫外显影：已记录该项读数，仍需结合相关物证。",
      "TOL-003": "材料谱线：已记录该项读数，仍需结合相关物证。",
      "TOL-004": "接口回路：已记录该项读数，仍需结合相关物证。",
      "TOL-005": "质量校零：已记录该项读数，仍需结合相关物证。"
    },
    "recipeId": "REC-014"
  },
  {
    "id": "ITM-017",
    "name": "仿生手指模组",
    "category": "义体与医疗",
    "value": 240,
    "sprite": 6,
    "size": [
      1,
      2
    ],
    "tools": [
      "TOL-001",
      "TOL-006"
    ],
    "description": "象牙白三节指，掌端金色接口。依次弯曲关节→测试夹接入→观察抓握标靶。",
    "defect": "第二关节回弹慢；接口氧化不等于报废。",
    "clues": {
      "TOL-001": "侧光观察：第二关节回弹慢；接口氧化不等于报废。",
      "TOL-006": "模拟负载：第二关节回弹慢；接口氧化不等于报废。",
      "TOL-002": "紫外显影：已记录该项读数，仍需结合相关物证。",
      "TOL-003": "材料谱线：已记录该项读数，仍需结合相关物证。",
      "TOL-004": "接口回路：已记录该项读数，仍需结合相关物证。",
      "TOL-005": "质量校零：已记录该项读数，仍需结合相关物证。"
    },
    "recipeId": "REC-004"
  },
  {
    "id": "ITM-018",
    "name": "视网膜镜片",
    "category": "义体与医疗",
    "value": 190,
    "sprite": 7,
    "size": [
      1,
      1
    ],
    "tools": [
      "TOL-001",
      "TOL-003"
    ],
    "description": "蓝绿弧形片，银色微型夹座。拖动校准光栅穿过镜片→旋转消除重影。",
    "defect": "斜光下三道微划痕；包装新旧不能证明品质。",
    "clues": {
      "TOL-001": "侧光观察：斜光下三道微划痕；包装新旧不能证明品质。",
      "TOL-003": "材料谱线：斜光下三道微划痕；包装新旧不能证明品质。",
      "TOL-002": "紫外显影：已记录该项读数，仍需结合相关物证。",
      "TOL-004": "接口回路：已记录该项读数，仍需结合相关物证。",
      "TOL-005": "质量校零：已记录该项读数，仍需结合相关物证。",
      "TOL-006": "模拟负载：已记录该项读数，仍需结合相关物证。"
    }
  },
  {
    "id": "ITM-019",
    "name": "便携诊断盘",
    "category": "义体与医疗",
    "value": 280,
    "sprite": 8,
    "size": [
      2,
      2
    ],
    "tools": [
      "TOL-004",
      "TOL-006"
    ],
    "description": "白红圆盘，环形传感灯。按顺序点亮自检环→拖动探针跨越故障区。",
    "defect": "红灯仅在空载出现；是传感器偏移而非整机坏。",
    "clues": {
      "TOL-004": "接口回路：红灯仅在空载出现；是传感器偏移而非整机坏。",
      "TOL-006": "模拟负载：红灯仅在空载出现；是传感器偏移而非整机坏。",
      "TOL-001": "侧光观察：已记录该项读数，仍需结合相关物证。",
      "TOL-002": "紫外显影：已记录该项读数，仍需结合相关物证。",
      "TOL-003": "材料谱线：已记录该项读数，仍需结合相关物证。",
      "TOL-005": "质量校零：已记录该项读数，仍需结合相关物证。"
    }
  },
  {
    "id": "ITM-025",
    "name": "姿态陀螺仪",
    "category": "机械与航行",
    "value": 310,
    "sprite": 9,
    "size": [
      2,
      2
    ],
    "tools": [
      "TOL-001",
      "TOL-006"
    ],
    "description": "金铜三环，中心蓝色转子。拨动外环→观察转轴漂移→拖动配重校准。",
    "defect": "偏心配重有新胶痕，旋转时拖尾倾斜。",
    "clues": {
      "TOL-001": "侧光观察：偏心配重有新胶痕，旋转时拖尾倾斜。",
      "TOL-006": "模拟负载：偏心配重有新胶痕，旋转时拖尾倾斜。",
      "TOL-002": "紫外显影：已记录该项读数，仍需结合相关物证。",
      "TOL-003": "材料谱线：已记录该项读数，仍需结合相关物证。",
      "TOL-004": "接口回路：已记录该项读数，仍需结合相关物证。",
      "TOL-005": "质量校零：已记录该项读数，仍需结合相关物证。"
    },
    "recipeId": "REC-005"
  },
  {
    "id": "ITM-026",
    "name": "舱门伺服器",
    "category": "机械与航行",
    "value": 170,
    "sprite": 10,
    "size": [
      2,
      2
    ],
    "tools": [
      "TOL-001",
      "TOL-004"
    ],
    "description": "厚灰盒体，侧面伸缩齿杆。拉动齿杆→探针测试限位→点亮开合状态灯。",
    "defect": "齿杆末端缺齿；启动正常但极限位置会卡住。",
    "clues": {
      "TOL-001": "侧光观察：齿杆末端缺齿；启动正常但极限位置会卡住。",
      "TOL-004": "接口回路：齿杆末端缺齿；启动正常但极限位置会卡住。",
      "TOL-002": "紫外显影：已记录该项读数，仍需结合相关物证。",
      "TOL-003": "材料谱线：已记录该项读数，仍需结合相关物证。",
      "TOL-005": "质量校零：已记录该项读数，仍需结合相关物证。",
      "TOL-006": "模拟负载：已记录该项读数，仍需结合相关物证。"
    }
  },
  {
    "id": "ITM-027",
    "name": "磁悬轴承",
    "category": "机械与航行",
    "value": 130,
    "sprite": 11,
    "size": [
      1,
      1
    ],
    "tools": [
      "TOL-004",
      "TOL-005"
    ],
    "description": "银黑圆环，六点蓝色线圈。微秤称重→测试夹激活→拖动环位让转子居中。",
    "defect": "伪件质量偏轻；真件也可能线圈断路。",
    "clues": {
      "TOL-004": "接口回路：伪件质量偏轻；真件也可能线圈断路。",
      "TOL-005": "质量校零：伪件质量偏轻；真件也可能线圈断路。",
      "TOL-001": "侧光观察：已记录该项读数，仍需结合相关物证。",
      "TOL-002": "紫外显影：已记录该项读数，仍需结合相关物证。",
      "TOL-003": "材料谱线：已记录该项读数，仍需结合相关物证。",
      "TOL-006": "模拟负载：已记录该项读数，仍需结合相关物证。"
    }
  },
  {
    "id": "ITM-033",
    "name": "老式星航怀表",
    "category": "记忆与文物",
    "value": 250,
    "sprite": 12,
    "size": [
      1,
      1
    ],
    "tools": [
      "TOL-001",
      "TOL-002"
    ],
    "description": "铜绿怀表，破损星形盖。开合表盖→微距照划痕→旋钮对齐星盘。",
    "defect": "表盖与机芯年代不同；维修品不等于假货。",
    "clues": {
      "TOL-001": "侧光观察：表盖与机芯年代不同；维修品不等于假货。",
      "TOL-002": "紫外显影：表盖与机芯年代不同；维修品不等于假货。",
      "TOL-003": "材料谱线：已记录该项读数，仍需结合相关物证。",
      "TOL-004": "接口回路：已记录该项读数，仍需结合相关物证。",
      "TOL-005": "质量校零：已记录该项读数，仍需结合相关物证。",
      "TOL-006": "模拟负载：已记录该项读数，仍需结合相关物证。"
    }
  },
  {
    "id": "ITM-034",
    "name": "蚀刻航海章",
    "category": "记忆与文物",
    "value": 160,
    "sprite": 13,
    "size": [
      1,
      1
    ],
    "tools": [
      "TOL-002",
      "TOL-005"
    ],
    "description": "黑银六边徽章，红色丝带。翻转徽章→紫外描出章底暗纹→称重。",
    "defect": "假章暗纹浮在表层，真章有不规则磨损。",
    "clues": {
      "TOL-002": "紫外显影：假章暗纹浮在表层，真章有不规则磨损。",
      "TOL-005": "质量校零：假章暗纹浮在表层，真章有不规则磨损。",
      "TOL-001": "侧光观察：已记录该项读数，仍需结合相关物证。",
      "TOL-003": "材料谱线：已记录该项读数，仍需结合相关物证。",
      "TOL-004": "接口回路：已记录该项读数，仍需结合相关物证。",
      "TOL-006": "模拟负载：已记录该项读数，仍需结合相关物证。"
    }
  },
  {
    "id": "ITM-035",
    "name": "纸质地球明信片",
    "category": "记忆与文物",
    "value": 210,
    "sprite": 14,
    "size": [
      1,
      1
    ],
    "tools": [
      "TOL-001",
      "TOL-002"
    ],
    "description": "褪色蓝海照片，透明保护袋。取出保护袋→侧光看纤维→对齐邮戳叠层。",
    "defect": "热感复制墨在紫外下过亮；手写日期与纸龄矛盾。",
    "clues": {
      "TOL-001": "侧光观察：热感复制墨在紫外下过亮；手写日期与纸龄矛盾。",
      "TOL-002": "紫外显影：热感复制墨在紫外下过亮；手写日期与纸龄矛盾。",
      "TOL-003": "材料谱线：已记录该项读数，仍需结合相关物证。",
      "TOL-004": "接口回路：已记录该项读数，仍需结合相关物证。",
      "TOL-005": "质量校零：已记录该项读数，仍需结合相关物证。",
      "TOL-006": "模拟负载：已记录该项读数，仍需结合相关物证。"
    }
  },
  {
    "id": "ITM-041",
    "name": "舱养藻苗罐",
    "category": "生物与异物",
    "value": 100,
    "sprite": 15,
    "size": [
      1,
      2
    ],
    "tools": [
      "TOL-001",
      "TOL-003"
    ],
    "description": "绿色藻团，方形防漏玻璃罐。移动光合灯照射→观察藻团伸展→扫描封口。",
    "defect": "健康藻团遇光展开；灰点是污染警讯。",
    "clues": {
      "TOL-001": "侧光观察：健康藻团遇光展开；灰点是污染警讯。",
      "TOL-003": "材料谱线：健康藻团遇光展开；灰点是污染警讯。",
      "TOL-002": "紫外显影：已记录该项读数，仍需结合相关物证。",
      "TOL-004": "接口回路：已记录该项读数，仍需结合相关物证。",
      "TOL-005": "质量校零：已记录该项读数，仍需结合相关物证。",
      "TOL-006": "模拟负载：已记录该项读数，仍需结合相关物证。"
    }
  },
  {
    "id": "ITM-042",
    "name": "发光苔藓砖",
    "category": "生物与异物",
    "value": 145,
    "sprite": 16,
    "size": [
      2,
      1
    ],
    "tools": [
      "TOL-001",
      "TOL-003"
    ],
    "description": "紫蓝苔层，黑色多孔基底。旋转砖体→遮挡光源→比对余辉衰减。",
    "defect": "染色仿品只反光不余辉；真品枯边可修复。",
    "clues": {
      "TOL-001": "侧光观察：染色仿品只反光不余辉；真品枯边可修复。",
      "TOL-003": "材料谱线：染色仿品只反光不余辉；真品枯边可修复。",
      "TOL-002": "紫外显影：已记录该项读数，仍需结合相关物证。",
      "TOL-004": "接口回路：已记录该项读数，仍需结合相关物证。",
      "TOL-005": "质量校零：已记录该项读数，仍需结合相关物证。",
      "TOL-006": "模拟负载：已记录该项读数，仍需结合相关物证。"
    }
  },
  {
    "id": "ITM-043",
    "name": "矿晶心核",
    "category": "生物与异物",
    "value": 270,
    "sprite": 17,
    "size": [
      1,
      1
    ],
    "tools": [
      "TOL-003",
      "TOL-005"
    ],
    "description": "透明六棱晶，内含橙色分叉。微秤称重→转晶体折射光斑→轻触测试台。",
    "defect": "玻璃仿品没有内部相位条纹；裂缝会改折射。",
    "clues": {
      "TOL-003": "材料谱线：玻璃仿品没有内部相位条纹；裂缝会改折射。",
      "TOL-005": "质量校零：玻璃仿品没有内部相位条纹；裂缝会改折射。",
      "TOL-001": "侧光观察：已记录该项读数，仍需结合相关物证。",
      "TOL-002": "紫外显影：已记录该项读数，仍需结合相关物证。",
      "TOL-004": "接口回路：已记录该项读数，仍需结合相关物证。",
      "TOL-006": "模拟负载：已记录该项读数，仍需结合相关物证。"
    }
  },
  {
    "id": "ITM-048",
    "name": "门禁演示牌",
    "category": "安全与边缘货",
    "value": 120,
    "sprite": 18,
    "size": [
      1,
      1
    ],
    "tools": [
      "TOL-002",
      "TOL-004"
    ],
    "description": "暗紫牌卡，三段滚动符号。接入隔离测试座→匹配虚构符号→核对注销灯。",
    "defect": "演示牌只响应沙盒；未注销牌带机构资产标记。",
    "clues": {
      "TOL-002": "紫外显影：演示牌只响应沙盒；未注销牌带机构资产标记。",
      "TOL-004": "接口回路：演示牌只响应沙盒；未注销牌带机构资产标记。",
      "TOL-001": "侧光观察：已记录该项读数，仍需结合相关物证。",
      "TOL-003": "材料谱线：已记录该项读数，仍需结合相关物证。",
      "TOL-005": "质量校零：已记录该项读数，仍需结合相关物证。",
      "TOL-006": "模拟负载：已记录该项读数，仍需结合相关物证。"
    }
  },
  {
    "id": "ITM-049",
    "name": "定位信标片",
    "category": "安全与边缘货",
    "value": 200,
    "sprite": 19,
    "size": [
      1,
      1
    ],
    "tools": [
      "TOL-003",
      "TOL-004"
    ],
    "description": "黑色薄片，橙色脉冲点。扫描外壳→滑动探针找脉冲→按沙盒停用测试。",
    "defect": "无外部开关但仍持续发光；不是普通纪念片。",
    "clues": {
      "TOL-003": "材料谱线：无外部开关但仍持续发光；不是普通纪念片。",
      "TOL-004": "接口回路：无外部开关但仍持续发光；不是普通纪念片。",
      "TOL-001": "侧光观察：已记录该项读数，仍需结合相关物证。",
      "TOL-002": "紫外显影：已记录该项读数，仍需结合相关物证。",
      "TOL-005": "质量校零：已记录该项读数，仍需结合相关物证。",
      "TOL-006": "模拟负载：已记录该项读数，仍需结合相关物证。"
    }
  },
  {
    "id": "ITM-050",
    "name": "封印货运匣",
    "category": "安全与边缘货",
    "value": 330,
    "sprite": 20,
    "size": [
      2,
      2
    ],
    "tools": [
      "TOL-002",
      "TOL-005"
    ],
    "description": "石墨色箱，黄色折角封签。旋转检查正背左右四视图及箱顶/箱底局部证据层→紫外叠看封签→称重对清单。",
    "defect": "封签编号与箱底号不同；重量超清单区间。",
    "clues": {
      "TOL-002": "紫外显影：封签编号与箱底号不同；重量超清单区间。",
      "TOL-005": "质量校零：封签编号与箱底号不同；重量超清单区间。",
      "TOL-001": "侧光观察：已记录该项读数，仍需结合相关物证。",
      "TOL-003": "材料谱线：已记录该项读数，仍需结合相关物证。",
      "TOL-004": "接口回路：已记录该项读数，仍需结合相关物证。",
      "TOL-006": "模拟负载：已记录该项读数，仍需结合相关物证。"
    }
  },
  {
    "id": "ITM-055",
    "name": "微型相位电容",
    "category": "稀有与战略件",
    "value": 720,
    "sprite": 21,
    "size": [
      1,
      1
    ],
    "tools": [
      "TOL-004",
      "TOL-006"
    ],
    "description": "银色三叉，中央青色光核。测试夹逐级施加虚构脉冲→拖动校准环抑制跳点。",
    "defect": "充放电轨迹有固定缺口；光亮程度不代表容量。",
    "clues": {
      "TOL-004": "接口回路：充放电轨迹有固定缺口；光亮程度不代表容量。",
      "TOL-006": "模拟负载：充放电轨迹有固定缺口；光亮程度不代表容量。",
      "TOL-001": "侧光观察：已记录该项读数，仍需结合相关物证。",
      "TOL-002": "紫外显影：已记录该项读数，仍需结合相关物证。",
      "TOL-003": "材料谱线：已记录该项读数，仍需结合相关物证。",
      "TOL-005": "质量校零：已记录该项读数，仍需结合相关物证。"
    }
  },
  {
    "id": "ITM-056",
    "name": "蓝金钟摆核",
    "category": "稀有与战略件",
    "value": 850,
    "sprite": 22,
    "size": [
      1,
      2
    ],
    "tools": [
      "TOL-003",
      "TOL-005"
    ],
    "description": "蓝金卵形核，细长悬丝。微秤记录质量→悬挂测试→滑动刻度校准摆幅。",
    "defect": "仿件摆幅与质量不匹配；原盒不是充分证据。",
    "clues": {
      "TOL-003": "材料谱线：仿件摆幅与质量不匹配；原盒不是充分证据。",
      "TOL-005": "质量校零：仿件摆幅与质量不匹配；原盒不是充分证据。",
      "TOL-001": "侧光观察：已记录该项读数，仍需结合相关物证。",
      "TOL-002": "紫外显影：已记录该项读数，仍需结合相关物证。",
      "TOL-004": "接口回路：已记录该项读数，仍需结合相关物证。",
      "TOL-006": "模拟负载：已记录该项读数，仍需结合相关物证。"
    }
  },
  {
    "id": "ITM-057",
    "name": "旧式能源匣",
    "category": "稀有与战略件",
    "value": 620,
    "sprite": 23,
    "size": [
      2,
      2
    ],
    "tools": [
      "TOL-001",
      "TOL-006"
    ],
    "description": "重型黄黑方匣，三色负载灯。打开外护盖→连接模拟负载→逐级切换看衰减。",
    "defect": "空载三灯亮但负载时快速跌落；封印过期。",
    "clues": {
      "TOL-001": "侧光观察：空载三灯亮但负载时快速跌落；封印过期。",
      "TOL-006": "模拟负载：空载三灯亮但负载时快速跌落；封印过期。",
      "TOL-002": "紫外显影：已记录该项读数，仍需结合相关物证。",
      "TOL-003": "材料谱线：已记录该项读数，仍需结合相关物证。",
      "TOL-004": "接口回路：已记录该项读数，仍需结合相关物证。",
      "TOL-005": "质量校零：已记录该项读数，仍需结合相关物证。"
    },
    "recipeId": "REC-015"
  }
];

const expansionArt=(index:number)=>({front:'orbital-expansion-front',back:'orbital-expansion-back',index,columns:4,rows:3});
itemDefs.push(
  {id:'ITM-061',name:'应急呼吸面罩',category:'义体与医疗',value:135,sprite:24,size:[2,1],tools:['TOL-001','TOL-006'],description:'橙白半面罩，双侧透明气阀。侧照阀圈，再接夹具比较密封响应。',defect:'陶瓷阀座开裂，增载时气阀回弹过慢。',clues:{'TOL-001':'阀座背面可见陶瓷细裂与压痕。','TOL-006':'气阀在增载后回弹迟缓，密封响应低于基准。'},recipeId:'REC-007',art:expansionArt(0)},
  {id:'ITM-062',name:'手摇短波电台',category:'精密电子',value:165,sprite:25,size:[2,2],tools:['TOL-004','TOL-006'],description:'橄榄绿收音机，折叠天线与黄铜摇柄。探针测整流，再测试手摇供电衰减。',defect:'整流线圈断续，摇柄转动后电压快速跌落。',clues:{'TOL-004':'整流回路间歇断开，端子有旧焊点。','TOL-006':'摇柄启动后指针跌落，无法维持接收。'},recipeId:'REC-008',art:expansionArt(1)},
  {id:'ITM-063',name:'星图胶片阅读器',category:'精密电子',value:230,sprite:26,size:[2,2],tools:['TOL-002','TOL-003'],description:'青铜双卷盘阅读器，中央放大光窗。紫外检查胶片批号，光谱对齐星图色层。',defect:'蓝色透片老化，左右星图产生双影。',clues:{'TOL-002':'胶片批号与底片边缘暗纹可交叉比对。','TOL-003':'蓝色透片透射谱偏移，星图边缘出现双影。'},recipeId:'REC-009',art:expansionArt(2)},
  {id:'ITM-064',name:'低温样本罐',category:'义体与医疗',value:260,sprite:27,size:[1,2],tools:['TOL-001','TOL-006'],description:'银色真空罐，蓝色测温窗与扣锁。检查口沿密封，再测试保温曲线。',defect:'冷却凝胶干涸，保温负载下温度持续上扬。',clues:{'TOL-001':'补给口可见干涸凝胶，外壳无承压裂纹。','TOL-006':'保温曲线斜升，接口散热异常。'},recipeId:'REC-010',art:expansionArt(3)},
  {id:'ITM-065',name:'多足爬管机器人',category:'机械与航行',value:360,sprite:28,size:[2,2],tools:['TOL-001','TOL-006'],description:'六足橙色检修机器人，柔性环形底盘。检查足端磨痕，再观察跨障步态。',defect:'左后足驱动线圈失步，转弯时拖行。',clues:{'TOL-001':'左后足磨痕单侧偏深，关节可自由转动。','TOL-006':'跨障节奏在第六步失步，驱动线圈响应迟滞。'},recipeId:'REC-011',art:expansionArt(4)},
  {id:'ITM-066',name:'便携气象桅杆',category:'机械与航行',value:210,sprite:29,size:[1,3],tools:['TOL-003','TOL-004'],description:'折叠银色桅杆，三杯风轮与琥珀传感头。测探头回路，再比对污染谱峰。',defect:'传感头沾有矿尘，风速输出跳变。',clues:{'TOL-003':'探头表面有矿尘特征峰，需与原厂主材区分。','TOL-004':'风轮转动与输出脉冲可逐次对照。'},art:expansionArt(5)},
  {id:'ITM-067',name:'机械打字终端',category:'民生与消费',value:175,sprite:30,size:[3,2],tools:['TOL-001','TOL-006'],description:'墨绿键盘机，外露字轮与窄纸卷。侧照字组完整度，再逐行检查卡键。',defect:'回车棘爪磨损，连续按键后字车卡住。',clues:{'TOL-001':'字轮字符组齐全，回车棘爪有磨痕。','TOL-006':'连续输入可确认字车是否顺畅回位。'},art:expansionArt(6)},
  {id:'ITM-068',name:'透明流量计',category:'民生与消费',value:125,sprite:31,size:[1,2],tools:['TOL-001','TOL-005'],description:'透明立管与红色浮子，黄铜双向接口。侧照承压管，再校零核对浮子配重。',defect:'浮子配重遭替换，流量读数比实际偏高。',clues:{'TOL-001':'承压立管的接缝和裂痕须单独记录。','TOL-005':'浮子质量必须与型号公差比对，不能只看刻度。'},art:expansionArt(7)},
  {id:'ITM-069',name:'站务票证压印机',category:'记忆与文物',value:190,sprite:32,size:[2,2],tools:['TOL-002','TOL-006'],description:'铸铁手压票机，铜质章头和红木手柄。紫外核章纹，再用测试夹观察压印回位。',defect:'章头为后制复制件，压杆弹簧存在偏移。',clues:{'TOL-002':'底层章纹必须与原始站务档案对照。','TOL-006':'压杆回位与压印偏移可分别记录。'},art:expansionArt(8)},
  {id:'ITM-070',name:'储能飞轮',category:'机械与航行',value:410,sprite:33,size:[2,2],tools:['TOL-001','TOL-006'],description:'蓝灰防护笼中的铜色飞轮，侧面测速窗。检查轮缘，再测停转衰减。',defect:'轮缘有偏磨，停转曲线过陡且伴随摆动。',clues:{'TOL-001':'轮缘配重与轴端磨痕可用于判断失衡。','TOL-006':'逐级增载可记录转速回落与摆动幅度。'},art:expansionArt(9)},
  {id:'ITM-071',name:'微型等离子焊炬',category:'机械与航行',value:290,sprite:34,size:[2,1],tools:['TOL-004','TOL-006'],description:'红铜握柄与陶瓷喷嘴，蓝色能量窗。先测回路，再在夹具内检查稳定脉冲。',defect:'导电触点氧化，陶瓷喷嘴局部烧蚀。',clues:{'TOL-004':'启动回路接触电阻偏高。','TOL-006':'测试夹记录到脉冲断续，与喷嘴烧蚀相符。'},recipeId:'REC-012',art:expansionArt(10)},
  {id:'ITM-072',name:'全息记忆晶匣',category:'记忆与文物',value:560,sprite:35,size:[2,1],tools:['TOL-002','TOL-003'],description:'紫金棱形存储匣，透明晶柱与三色封环。紫外查看写入暗纹，再比对晶格谱线。',defect:'封环暗纹被覆盖，晶格谱线可能来自复制介质。',clues:{'TOL-002':'写入暗纹与封环序号须同时比对。','TOL-003':'晶格谱线可区分原始介质与复制介质。'},art:expansionArt(11)}
);

export const tools: ToolDef[] = [
  {
    "id": "TOL-001",
    "name": "可变焦灯镜",
    "short": "侧光",
    "instruction": "拖动灯镜扫过裂纹，调焦后记录接缝。",
    "unit": "焦距 mm",
    "sprite": 0
  },
  {
    "id": "TOL-002",
    "name": "紫外检视灯",
    "short": "显纹",
    "instruction": "按住紫外灯扫过封签，旧编号随光带显影。",
    "unit": "荧光 nm",
    "sprite": 1
  },
  {
    "id": "TOL-003",
    "name": "轨道光谱台",
    "short": "谱峰",
    "instruction": "移动采样线，将峰值与基准谱线对齐。",
    "unit": "谱峰 nm",
    "sprite": 2
  },
  {
    "id": "TOL-004",
    "name": "双触点万用探针",
    "short": "回路",
    "instruction": "将红蓝探针分别接入两端，读取回路波形。",
    "unit": "电流 mA",
    "sprite": 3
  },
  {
    "id": "TOL-005",
    "name": "微重力秤",
    "short": "称量",
    "instruction": "将砝码移至校零标记，等待秤盘平衡。",
    "unit": "质量 g",
    "sprite": 4
  },
  {
    "id": "TOL-006",
    "name": "脉冲测试夹",
    "short": "负载",
    "instruction": "装入夹具并调整负载，观察机械响应和衰减。",
    "unit": "负载 %",
    "sprite": 5
  }
];

export const materials: MaterialDef[] = [
  {
    "id": "MAT-001",
    "name": "导电纤维",
    "price": 8,
    "description": "修复电路与连接端子"
  },
  {
    "id": "MAT-002",
    "name": "陶瓷补片",
    "price": 10,
    "description": "贴合破损非承压外壳"
  },
  {
    "id": "MAT-003",
    "name": "标准微线圈",
    "price": 14,
    "description": "替换老化线圈"
  },
  {
    "id": "MAT-004",
    "name": "合规封签",
    "price": 6,
    "description": "保存检测记录；不等同于所有权证明"
  },
  {
    "id": "MAT-005",
    "name": "冷却凝胶",
    "price": 9,
    "description": "冷却接口与医用回收检测"
  },
  {
    "id": "MAT-006",
    "name": "光学透片",
    "price": 12,
    "description": "修正投影与灯具光路"
  }
];

export const npcs: NpcDef[] = [
  {
    "id": "CHR-001",
    "name": "岑舟",
    "title": "店主 · 前货运鉴定员",
    "faction": "salvage",
    "sprite": 0,
    "line": "先把物证放在光下，再谈它值多少钱。"
  },
  {
    "id": "CHR-002",
    "name": "阿篁",
    "title": "维修工 · 稳定供货人",
    "faction": "salvage",
    "sprite": 1,
    "line": "螺丝我排好了，坏接口就在这里。"
  },
  {
    "id": "CHR-003",
    "name": "饶静",
    "title": "港务稽查员",
    "faction": "station",
    "sprite": 2,
    "line": "先核箱号和来源，再决定是否放行。"
  },
  {
    "id": "CHR-004",
    "name": "栗叔",
    "title": "拾荒船长",
    "faction": "salvage",
    "sprite": 3,
    "line": "旧航道捞回来的，给它找个能用上的人。"
  },
  {
    "id": "CHR-005",
    "name": "澄九",
    "title": "数据修复师",
    "faction": "merchant",
    "sprite": 4,
    "line": "不确定的地方就写未知，别为了成交把话说满。"
  }
];

export const recipes: RecipeDef[] = [
  {
    "id": "REC-001",
    "name": "循环水芯翻修",
    "itemId": "ITM-001",
    "materials": {
      "MAT-002": 2,
      "MAT-004": 1
    },
    "steps": [
      "侧照定位裂纹",
      "贴合两片陶瓷补片",
      "滚压合规封签"
    ],
    "ap": 1,
    "kind": "repair"
  },
  {
    "id": "REC-002",
    "name": "全息机重校",
    "itemId": "ITM-009",
    "materials": {
      "MAT-006": 2,
      "MAT-001": 1
    },
    "steps": [
      "展开光学翼片",
      "换入光学透片",
      "对齐三色标靶"
    ],
    "ap": 1,
    "kind": "repair"
  },
  {
    "id": "REC-003",
    "name": "腕式终端换芯",
    "itemId": "ITM-010",
    "materials": {
      "MAT-003": 1,
      "MAT-001": 2
    },
    "steps": [
      "滑开保护壳",
      "拖入线圈并连接纤维",
      "通电闭合复测"
    ],
    "ap": 1,
    "kind": "repair"
  },
  {
    "id": "REC-004",
    "name": "仿生指模组合规回收",
    "itemId": "ITM-017",
    "materials": {
      "MAT-005": 1,
      "MAT-004": 1
    },
    "steps": [
      "清理氧化接口",
      "调整关节限位",
      "完成模拟抓握"
    ],
    "ap": 1,
    "kind": "repair"
  },
  {
    "id": "REC-005",
    "name": "陀螺仪重平衡",
    "itemId": "ITM-025",
    "materials": {
      "MAT-003": 1,
      "MAT-002": 1
    },
    "steps": [
      "拆下旧配重",
      "将新配重移入误差圈",
      "复测转轴漂移"
    ],
    "ap": 1,
    "kind": "repair"
  },
  {
    "id": "REC-006",
    "name": "舱门维护套组",
    "itemId": "ITM-026",
    "materials": {
      "MAT-001": 2,
      "MAT-004": 1
    },
    "steps": [
      "装入伺服器与注销轴承",
      "连接通用端子",
      "验证双向限位"
    ],
    "ap": 2,
    "kind": "craft",
    "outputId": "BND-001"
  }
];

recipes.push(
  {id:'REC-007',name:'面罩气阀重封',itemId:'ITM-061',materials:{'MAT-002':1,'MAT-005':1},steps:['取出裂损的陶瓷阀座','贴合陶瓷补片并给阀座降温','闭合气阀并做密封负载复测'],ap:1,kind:'repair'},
  {id:'REC-008',name:'短波电台整流修复',itemId:'ITM-062',materials:{'MAT-003':1,'MAT-001':1},steps:['拆开整流仓并断开旧接点','换入线圈并接回导电纤维','转动摇柄复测稳定供电'],ap:1,kind:'repair'},
  {id:'REC-009',name:'星图阅读器光路校正',itemId:'ITM-063',materials:{'MAT-006':2,'MAT-004':1},steps:['退出胶片并打开光窗','换入双层光学透片','重合左右星图并封存校准记录'],ap:1,kind:'repair'},
  {id:'REC-010',name:'低温罐密封翻修',itemId:'ITM-064',materials:{'MAT-005':2,'MAT-004':1},steps:['打开补给口并排出干涸凝胶','填入冷却凝胶并闭合扣锁','复测保温曲线并封签'],ap:1,kind:'repair'},
  {id:'REC-011',name:'爬管机器人足端换驱',itemId:'ITM-065',materials:{'MAT-003':1,'MAT-001':2},steps:['展开底盘并定位失步足','换入线圈连接足端纤维','完成六步跨障负载复测'],ap:1,kind:'repair'},
  {id:'REC-012',name:'焊炬触点与喷嘴翻修',itemId:'ITM-071',materials:{'MAT-001':1,'MAT-002':2},steps:['移除氧化触点与烧蚀护口','连接导电纤维并装陶瓷护片','在夹具内复测连续脉冲'],ap:1,kind:'repair'},
  {id:'REC-013',name:'光合灯灯叶校光',itemId:'ITM-003',materials:{'MAT-006':1,'MAT-001':1},steps:['展开三片灯叶并定位偏蓝光斑','换入老化灯叶的透片并接回导电纤维','移动照度标靶复测三叶光斑均匀度'],ap:1,kind:'repair'},
  {id:'REC-014',name:'巡检蜂旋翼驱动校准',itemId:'ITM-011',materials:{'MAT-003':1,'MAT-001':2},steps:['展开四条机臂并定位延迟旋翼','更换延迟旋翼的驱动线圈并重接导电纤维','在夹具内增载复测四旋翼转速与悬浮重心'],ap:1,kind:'repair'},
  {id:'REC-015',name:'能源匣均衡回路重建',itemId:'ITM-057',materials:{'MAT-003':2,'MAT-001':1,'MAT-004':1},steps:['断开供电并打开均衡回路护盖','更换双均衡线圈并连接导电纤维','逐级增载确认电压稳定后封存复测记录'],ap:1,kind:'repair'}
);

export const orderDefs: OrderDef[] = [
  {
    "id": "ORD-001",
    "name": "一支不漏水的滤芯",
    "itemId": "ITM-001",
    "reward": 50,
    "dueDay": 1,
    "minCondition": 0.7,
    "needsRepair": true,
    "faction": "salvage",
    "customerOwned": true,
    "description": "灯镜侧照背面接缝并框选裂纹；按REC-001贴两片陶瓷补片并滚压封签；将同一物件拖入订单轮廓，回放修前/修后接缝并确认交付。"
  },
  {
    "id": "ORD-002",
    "name": "腕上屏幕别再发烫",
    "itemId": "ITM-010",
    "reward": 62,
    "dueDay": 2,
    "minCondition": 0.7,
    "needsRepair": true,
    "faction": "merchant",
    "customerOwned": true,
    "description": "把红蓝探针分别吸附到标记端子，记录电流偏高；按REC-003滑盖、换线圈、接回导电纤维；同档复测后将终端拖回顾客托盘。"
  },
  {
    "id": "ORD-003",
    "name": "栗叔的保温杯",
    "itemId": "ITM-002",
    "reward": 60,
    "dueDay": 1,
    "minCondition": 0.45,
    "needsRepair": false,
    "faction": "salvage",
    "customerOwned": false,
    "description": "拧开杯底，用探针检查回路；查看三档温升预览并勾选已披露旧焊点；拖到交付垫，报价在明确预算内确认。"
  },
  {
    "id": "ORD-004",
    "name": "给船舱留一点绿色",
    "itemId": "ITM-003",
    "reward": 205,
    "dueDay": 3,
    "minCondition": 0.45,
    "needsRepair": false,
    "faction": "salvage",
    "customerOwned": false,
    "description": "展开三瓣灯，移动标靶检查照度；将藻罐置于光源下，观察伸展并核对无灰点；把两件实物各拖进同一订单的两个轮廓，分别核对再封箱。"
  },
  {
    "id": "ORD-005",
    "name": "指节只做合规回收",
    "itemId": "ITM-017",
    "reward": 55,
    "dueDay": 3,
    "minCondition": 0.7,
    "needsRepair": true,
    "faction": "salvage",
    "customerOwned": true,
    "description": "灯镜定位氧化，夹具依次弯曲三节关节；按REC-004清理接口、调限位、完成模拟抓握；贴回收等级封签，在交付前朗读标签预览并确认。"
  },
  {
    "id": "ORD-006",
    "name": "无人机编号核对",
    "itemId": "ITM-011",
    "reward": 42,
    "dueDay": 3,
    "minCondition": 0.45,
    "needsRepair": false,
    "faction": "station",
    "customerOwned": true,
    "description": "展开四叶机臂，以侧光观察机腹新漆边缘；夹具在室内模拟悬浮，记录一臂延迟；将编号照片与检测波形拖到订单证据两槽，交回原机。"
  },
  {
    "id": "ORD-007",
    "name": "投影先对齐再上墙",
    "itemId": "ITM-009",
    "reward": 90,
    "dueDay": 3,
    "minCondition": 0.7,
    "needsRepair": true,
    "faction": "merchant",
    "customerOwned": true,
    "description": "紫外扫过壳体编号并记录是否重叠；按REC-002展开翼片、换透片、对齐三色图形；以修复版本与仍存外观瑕疵预览交付。"
  },
  {
    "id": "ORD-008",
    "name": "徽章是真还是纪念品",
    "itemId": "ITM-034",
    "reward": 38,
    "dueDay": 3,
    "minCondition": 0.45,
    "needsRepair": false,
    "faction": "salvage",
    "customerOwned": true,
    "description": "翻到章底，用紫外灯扫出暗纹层次；在微秤放基准砝码校零，记录重量误差；把纹理与质量证据各放一槽，选择有依据的“原作/复制/证据不足”结论。"
  },
  {
    "id": "ORD-009",
    "name": "蓝海照片的年代",
    "itemId": "ITM-035",
    "reward": 36,
    "dueDay": 3,
    "minCondition": 0.45,
    "needsRepair": false,
    "faction": "merchant",
    "customerOwned": true,
    "description": "取出保护袋，以灯镜侧光查看纸纤维；在灯镜下叠合邮戳，标记可见矛盾；已有TOL-002时可免费补看墨层荧光；将照片重新放入保护袋，与已确认线索及不确定性说明一同交付。"
  },
  {
    "id": "ORD-010",
    "name": "封匣不等于盲盒",
    "itemId": "ITM-050",
    "reward": 44,
    "dueDay": 3,
    "minCondition": 0.45,
    "needsRepair": false,
    "faction": "station",
    "customerOwned": true,
    "description": "旋转检查六面并紫外叠看封签号；称重对比清单区间，圈出箱底编号与封签差异；把货匣拖入安检托盘，与差异报告一同退回。"
  },
  {
    "id": "ORD-011",
    "name": "信标归位",
    "itemId": "ITM-049",
    "reward": 30,
    "dueDay": 3,
    "minCondition": 0.45,
    "needsRepair": false,
    "faction": "station",
    "customerOwned": false,
    "description": "光谱扫描外壳并以探针记录脉冲；把比对记录与原物拖入归还托盘，预览放弃所有权；确认移交、拿到返还凭证并从普通架移除此件。"
  },
  {
    "id": "ORD-012",
    "name": "陀螺别再偏航",
    "itemId": "ITM-025",
    "reward": 82,
    "dueDay": 3,
    "minCondition": 0.7,
    "needsRepair": true,
    "faction": "salvage",
    "customerOwned": true,
    "description": "拨动外环，以侧光看新胶痕并记录转轴拖尾；按REC-005拆旧配重、移动新配重到误差圈内；夹具复测稳定后装回护盖、回放前后轨迹并交付。"
  }
];

orderDefs.push(
  {id:'ORD-013',name:'救援队的面罩气阀',itemId:'ITM-061',reward:75,dueDay:6,minCondition:.7,needsRepair:true,faction:'station',customerOwned:true,description:'检视开裂阀座，按气阀重封配方修复，再用夹具记录密封复测。交还救援队原件。'},
  {id:'ORD-014',name:'远航前的短波呼叫',itemId:'ITM-062',reward:82,dueDay:7,minCondition:.7,needsRepair:true,faction:'salvage',customerOwned:true,description:'探针定位整流断路，换线圈接回纤维，手摇负载稳定后交回原电台。'},
  {id:'ORD-015',name:'把两张星图重合',itemId:'ITM-063',reward:88,dueDay:9,minCondition:.7,needsRepair:true,faction:'merchant',customerOwned:true,description:'记录胶片批号和透片谱偏，换透片重合左右星图，封存记录后交还原阅读器。'},
  {id:'ORD-016',name:'样本罐别再升温',itemId:'ITM-064',reward:90,dueDay:10,minCondition:.7,needsRepair:true,faction:'station',customerOwned:true,description:'检查凝胶干涸并记录保温曲线；换入凝胶闭合扣锁，交还复测通过的原罐。'},
  {id:'ORD-017',name:'第六只足也要跟上',itemId:'ITM-065',reward:105,dueDay:12,minCondition:.7,needsRepair:true,faction:'salvage',customerOwned:true,description:'记录偏磨足和六步失步，换入驱动线圈，再完成跨障复测后交回机器人。'},
  {id:'ORD-018',name:'气象桅杆的尘埃报告',itemId:'ITM-066',reward:58,dueDay:13,minCondition:.45,needsRepair:false,faction:'station',customerOwned:true,description:'对原桅杆做探针与光谱检查，区分矿尘污染和回路问题，提交两条物证并归还原件。'},
  {id:'ORD-019',name:'档案员逐字验收',itemId:'ITM-067',reward:62,dueDay:15,minCondition:.45,needsRepair:false,faction:'merchant',customerOwned:true,description:'检查字轮完整度，夹具记录连续输入和字车回位；如实报告卡键情况，交还原机。'},
  {id:'ORD-020',name:'浮子的重量不能猜',itemId:'ITM-068',reward:54,dueDay:16,minCondition:.45,needsRepair:false,faction:'station',customerOwned:true,description:'侧照承压立管并校零称量浮子，交付质量与裂纹两条证据，原流量计随报告归还。'},
  {id:'ORD-021',name:'站务印章的两层纹',itemId:'ITM-069',reward:68,dueDay:18,minCondition:.45,needsRepair:false,faction:'merchant',customerOwned:true,description:'紫外核对章头暗纹，夹具观察压印回位。区分复制章与机械磨损，交回原机。'},
  {id:'ORD-022',name:'备用动力的飞轮',itemId:'ITM-070',reward:455,dueDay:20,minCondition:.7,needsRepair:false,faction:'salvage',description:'备一台品相至少七成、负载正常且来源已核的储能飞轮。侧照与负载两项记录随货交付。'},
  {id:'ORD-023',name:'焊炬的稳定脉冲',itemId:'ITM-071',reward:95,dueDay:20,minCondition:.7,needsRepair:true,faction:'salvage',customerOwned:true,description:'探针定位氧化触点，换纤维和陶瓷护片，再在夹具内复测连续脉冲，交还原焊炬。'},
  {id:'ORD-024',name:'记忆晶匣鉴真档案',itemId:'ITM-072',reward:96,dueDay:21,minCondition:.45,needsRepair:false,faction:'merchant',customerOwned:true,description:'紫外对照封环暗纹，光谱记录晶格材质；提交原始介质或复制介质的证据说明并归还原匣。'}
);

export const orderEarliest: Record<string,number> = {
  "ORD-001": 1,
  "ORD-002": 1,
  "ORD-003": 1,
  "ORD-004": 2,
  "ORD-005": 2,
  "ORD-006": 2,
  "ORD-007": 2,
  "ORD-008": 2,
  "ORD-009": 3,
  "ORD-010": 3,
  "ORD-011": 3,
  "ORD-012": 3,
  "ORD-013": 4,"ORD-014": 4,"ORD-015": 6,"ORD-016": 7,
  "ORD-017": 9,"ORD-018": 10,"ORD-019": 12,"ORD-020": 13,
  "ORD-021": 15,"ORD-022": 12,"ORD-023": 17,"ORD-024": 18
};

export const bundleDef: ItemDef = {id:'BND-001',name:'舱门维护套组',category:'组装成品',value:390,sprite:10,size:[3,2],tools:['TOL-004','TOL-006'],description:'伺服器与轴承装在同一维护框内，双向限位已验证。',defect:'封签与接线记录完整。',clues:{'TOL-004':'双向回路闭合','TOL-006':'负载与限位通过'}};
itemDefs.push(...CONTENT_ITEMS);npcs.push(...CONTENT_NPCS);recipes.push(...CONTENT_RECIPES);orderDefs.push(...CONTENT_ORDERS);
Object.assign(orderEarliest,CONTENT_ORDER_EARLIEST);
for(const npc of npcs)Object.assign(npc,PEOPLE_PROFILES[npc.id]||{});

export function getDef(id:string):ItemDef {const v=id==='BND-001'?bundleDef:itemDefs.find(x=>x.id===id);if(!v)throw new Error('Unknown item '+id);return v;}
export function getTool(id:string):ToolDef {const v=tools.find(x=>x.id===id);if(!v)throw new Error('Unknown tool '+id);return v;}
export function getNpc(id:string):NpcDef {const v=npcs.find(x=>x.id===id);if(!v)throw new Error('Unknown NPC '+id);return v;}
export function getRecipe(id:string):RecipeDef {const v=recipes.find(x=>x.id===id);if(!v)throw new Error('Unknown recipe '+id);return v;}
export function getOrder(id:string):OrderDef {const v=orderDefs.find(x=>x.id===id);if(!v)throw new Error('Unknown order '+id);return v;}
