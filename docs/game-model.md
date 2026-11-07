# 灰线旧货铺：纯 TypeScript 游戏模型

`data.ts` 保留原网页的 12 件货物、6 位客人、对话、鉴定线索、每日故事和 6 件委托物资。
`model.ts` 是无渲染器、无 DOM、无存储依赖的不可变 reducer。`save.ts` 负责存档验证和旧版本迁移。

```ts
import { createGame, reduce, parseSave, serializeGame, SAVE_KEY, LEGACY_SAVE_KEY } from './game/model';
let state = parseSave(storage.getItem(SAVE_KEY))
  ?? parseSave(storage.getItem(LEGACY_SAVE_KEY))
  ?? createGame();
state = reduce(state, { type: 'ARRIVE' });
storage.setItem(SAVE_KEY, serializeGame(state));
```

状态与动作的类型从 `model.ts` 导入：`GameState`、`GameAction`、`ItemInstance`、`Trade`、
`DayReport`、`Check`（也可用 `CheckType`）、`Category`。数值和文本均不依赖 Cocos。

## UI 接口

- `createGame(seed?)`：180 票、3 件已鉴定初始货物、7 天试营业。相同种子得到相同来客和行情。
- `reduce(state, action)`：返回新状态；旧快照不受影响。无效动作一般返回原状态，规则阻挡说明见 `state.notice`。
- `ARRIVE`：接待客人；`trade.role` 是 `seller`（玩家收购）或 `buyer`（玩家出售）。
- `SELECT {uid}`：为买家选择可交易的陈列商品。`currentItem(state)` 统一取得当前商品。
- `START_CHECK {uid, check}`：扣除 4/8/12 分钟，创建 `inspection`。前置交互由 UI 完成，
  `CHECK_STEP` 记入证据：外观共 3 次，功能/编号各 1 次。过程中存档可继续，已完成项目不重复收费。
- `OFFER {price, acknowledge?}` / `ACCEPT`：每轮 4 分钟，最多 3 轮。达成后 `trade.locked=true`。
  `wouldOffend(state, price)` 可供 UI 前置提示，明确确认后传 `acknowledge:true`，同一交易只扣 2 点信誉。
- `DELIVER {tradeId}`：再用 6 分钟交割；必须传当前 `trade.id`，防止动画回调或重复点击交割。
  `deliveryBlocker(state)` 返回不能交割的原因。
- `REFUSE` 或 `DISMISS`：礼貌结束当前来访，耗时 2 分钟，无信誉惩罚。
- `DISPLAY {uid, riskLabel?}`：上架/撤下。`PLACE {uid, slot, riskLabel?}`：指定 0–7 号格，
  有货时交换原位置；`slot:null` 撤下。未核验商品必须明确传 `riskLabel:true`。
  `displaySlots(inventory)` 返回 8 个稳定格位。`PRICE {uid, price}` 更新标价。
- `START_COMMISSION`（别名 `COMMISSION`）：预扣 90 分钟。`SORT {index, category}` 正确归类后，
  6 件全部完成获得 40 票，每日一次。`SORT_ALL` 是保留的辅助动作。
- `RECYCLE {uid}`：6 分钟，取得真实当前价值的 35% 向下取整，每天最多 2 次，不计售出数量。
- `CLOSE` → `SETTLE` → `NEXT`：日结扣耗材 15，第三天租金 90，第七天 210。
  `BACK` 可在仍有时间时从待结算页返回营业。进行中的鉴定/委托必须先完成。

`appraisal(item, market)` 提供 `{center, exact, low, high, price}`。`price` 是模型真实价值，
UI 在 `exact=false` 时只应展示区间。`trueValue`、`reservationPrice` 供内部规则、调试使用。
`eligibleItems` 筛选当前买家愿意交易的商品；`clockLabel`、`remainingMinutes`、`rentDue` 供 HUD 使用。

## 存档与去重

`parseSave(raw)` 接收 JSON 字符串，校验失败返回 `null`，永不抛出解析错误。
优先读取 `greyline-save-v2`，再尝试旧 `greyline-save-v1`；成功迁移后写入新键，保留旧键供回退。
模型不会自行读写设备存储。

新格式同时带 `schema:2` 和 `version:2`。所有商品使用唯一实例 `uid`，所有账本变动使用唯一
`transactionId`；`completedTrades` 与交易账本互相核对，已交割交易 ID 不能再次结算。
迁移保留种子、随机数状态、当前来客、鉴定进度、库存和日结；缺失的旧陈列格恢复为稳定位置，
旧 `nextId` 按已存在身份向上修正。仅复制经过验证的字段，拒绝负数、重复 UID、重复交易、
非法引用、超限数组、伪造类别及超大存档。

七日结清费用后，现金至少 120、信誉至少 40、售出至少 12 为 `win`，否则为 `survive`；
结算费用不足为 `bankrupt`。`report.gross` 只算销售减商品收购成本，回收不混入销售毛利。

## 验证

```sh
node_modules/.bin/tsc --strict --target ES2019 --module commonjs --moduleResolution node --skipLibCheck --outDir work/model-test assets/scripts/game/data.ts assets/scripts/game/model.ts assets/scripts/game/save.ts
node tests/model.test.cjs "$PWD/work/model-test/model.js"
```

测试覆盖完整七日结算、两次租金、各结局边界、鉴定中断恢复、三轮议价、交易去重、
商品实例转移、陈列交换、社区委托、回收和恶意/旧存档处理。
