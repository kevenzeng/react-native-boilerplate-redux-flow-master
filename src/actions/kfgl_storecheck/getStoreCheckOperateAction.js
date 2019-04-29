// 获取下一步操作处理列表
// 用途：在移库单详细界面，根据移库单状态，显示可选择的操作列表
import { createAction } from "redux-actions";

export const REQUEST = Symbol();
export const getStoreCheckOperate = createAction(REQUEST);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED);
