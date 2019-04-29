// 用途：根据入库单状态来获取当前环节下的可操作的类型列表

import { createAction } from "redux-actions";

export const REQUEST = Symbol();
export const fetchStoreInOperation = createAction(REQUEST);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED);
