// 用途：用户提交入库单时，根据提交操作类型和入库单当前状态来使入库单变为下一个环节状态。

import { createAction } from "redux-actions";

export const REQUEST = Symbol();
export const toSubmitStoreIn = createAction(REQUEST);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED);
