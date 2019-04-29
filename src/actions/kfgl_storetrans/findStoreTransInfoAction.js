// 查找移库单信息（单条）
// 用途：获取移库单详细信息


import { createAction } from "redux-actions";

export const REQUEST = Symbol();
export const fetchStoreTransInfo = createAction(REQUEST);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED);
