// 用途：在入库单详细信息中，显示流程流转记录列表

import { createAction } from "redux-actions";

export const REQUEST = Symbol();
export const fetchStoreInTrack = createAction(REQUEST);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED);
