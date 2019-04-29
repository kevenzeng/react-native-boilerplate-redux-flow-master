// 查找盘点流程流转信息
// 用途：用于在盘点单详情界面中，显示流程流转列表
import { createAction } from "redux-actions";

export const REQUEST = Symbol();
export const fetchStoreCheckTrack = createAction(REQUEST);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED);
