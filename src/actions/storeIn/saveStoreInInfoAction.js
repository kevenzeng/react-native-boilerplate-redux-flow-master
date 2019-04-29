// 用途：当入库状态为申请中或复核中时，可以保存入库单的信息。

import { createAction } from "redux-actions";

export const REQUEST = Symbol();
export const toSaveStoreInInfo = createAction(REQUEST);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED);
