// 查找移库单(分页)
// 用途：用于在移库管理中使用各种查询条件，分页查找移库单

import { createAction } from "redux-actions";

export const REQUEST = Symbol();
export const fetchStoreTrans = createAction(REQUEST);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED);
