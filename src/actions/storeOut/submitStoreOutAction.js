// 提交出库单
// 用途：用于提交出库单的操作信息，包括操作类型、下一步处理人、处理意见等，出库单提交后，进入下一个环节

import { createAction } from "redux-actions";

export const REQUEST = Symbol();
export const toSubmitStoreOut = createAction(REQUEST);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED);
