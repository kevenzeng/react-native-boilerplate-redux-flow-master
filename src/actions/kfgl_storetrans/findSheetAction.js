// 查找库房货架列表（分页）
// 用途：用于在添加备件明细后，选择新货架时，可以先查找后供挑选
import { createAction } from "redux-actions";

export const REQUEST = Symbol();
export const fetchSheet = createAction(REQUEST);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED);
