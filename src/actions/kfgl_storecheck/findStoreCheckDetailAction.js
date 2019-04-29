// 查找盘点备件明细列表（分页）
// 用途：用于盘点单复核或审批时显示盘点备件明细列表，包括盘点入库已保存的明细，需要盘点的库存明细,可分页查询
import { createAction } from "redux-actions";

export const REQUEST = Symbol();
export const fetchStoreCheckDetail = createAction(REQUEST);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED);
