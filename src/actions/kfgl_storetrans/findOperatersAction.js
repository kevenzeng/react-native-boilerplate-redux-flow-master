// 获取处理人列表
// 用途：用于在选择了下一步操作后，获取对应可选择的处理人列表

import { createAction } from "redux-actions";

export const REQUEST = Symbol();
export const fetchStoreTransOperators = createAction(REQUEST);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED);
