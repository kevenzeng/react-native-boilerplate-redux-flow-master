// 获取出库处理操作列表
// 用途：用于在出库单修改/显示界面中，出库单的当前处理人是当前用户时，需要提交操作，可供选择的列表

import { createAction } from "redux-actions";

export const REQUEST = Symbol();
export const fetchStoreOutOperation = createAction(REQUEST);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED);
