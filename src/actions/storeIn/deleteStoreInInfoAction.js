// 用途：当入库单状态为“申请中”，而当前登录用户是入库申请人，或库房管理员时，可删除入库单信息包括所有与该入库单关联的信息。

import { createAction } from "redux-actions";

export const REQUEST = Symbol();
export const toDeleteStoreInInfo = createAction(REQUEST);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED);
