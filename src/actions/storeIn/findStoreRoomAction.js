// 用途：下拉库房列表中显示（不分页）

import { createAction } from "redux-actions";

export const REQUEST = Symbol();
export const fetchStoreRoom = createAction(REQUEST);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED);
