// 用途：用于修改入库单时,显示入库备件(复数)明细列表
import { createAction } from "redux-actions";

export const REQUEST = Symbol();
export const fetchStoreInDetail = createAction(REQUEST);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED);
