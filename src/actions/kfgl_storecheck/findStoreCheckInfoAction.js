// 查找盘点单信息（单条）
// 用途：用于盘点单查看或编辑时，显示在详情里的盘点单信息
import { createAction } from "redux-actions";

export const REQUEST = Symbol();
export const fetchStoreCheckInfo = createAction(REQUEST);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED);
