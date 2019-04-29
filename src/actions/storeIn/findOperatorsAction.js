// 用途：根据入库单状态和操作类型来获取可提交下一步的处理人列表

import { createAction } from "redux-actions";

export const REQUEST = Symbol();
export const fetchOperators = createAction(REQUEST);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED);
