// 修改盘点明细记录数量
// 用途：用于在盘点复核时，由复核人修改某个备件汇总里的数量。
import { createAction } from "redux-actions";

export const REQUEST = Symbol();
export const toUpdateStoreCheckDetail = createAction(REQUEST);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED);
