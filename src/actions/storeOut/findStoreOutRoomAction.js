// 查找全部库房
// 用途：在需要使用库房查询时，可选择的库房id和名称列表，（因为库房数量少，所以不需分页）

import { createAction } from "redux-actions";

export const REQUEST = Symbol();
export const fetchStoreOutRoom = createAction(REQUEST);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED);
