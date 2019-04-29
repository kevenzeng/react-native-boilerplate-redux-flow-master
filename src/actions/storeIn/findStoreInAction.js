// 按条件查询入库单列表
import { createAction } from "redux-actions";

export const REQUEST = Symbol();
export const fetchStoreIn = createAction(REQUEST);

export const RESET = Symbol();
export const resetFetchStoreIn = createAction(RESET);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

// return 2nd argument as `meta` field
export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE, null, (...args) => args[1]);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED, null, (...args) => args[1]);
