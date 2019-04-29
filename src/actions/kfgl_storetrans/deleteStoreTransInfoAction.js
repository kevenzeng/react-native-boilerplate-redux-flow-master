// 删除移库单(单条)
// 用途：在移库单列表中选择一条移库单进行删除操作，只有申请中状态下，由处理人或管理员删除

import { createAction } from "redux-actions";

export const REQUEST = Symbol();
export const deleteStoreTransInfo = createAction(REQUEST);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED);
