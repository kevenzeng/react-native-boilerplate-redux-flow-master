// 查找货架列表
// 用途：用于盘点时，选择库房后，添加需要盘点的货架，可以先查找后供挑选
import { createAction } from "redux-actions";

export const REQUEST = Symbol();
export const fetchStoreCheckSheet = createAction(REQUEST);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED);
