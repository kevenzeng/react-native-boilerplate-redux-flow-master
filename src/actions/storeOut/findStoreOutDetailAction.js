// 用途：用于在修改/编辑/显示出库单时，显示已保存的备件明细信息
import { createAction } from "redux-actions";

export const REQUEST = Symbol();
export const fetchStoreOutDetail = createAction(REQUEST);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED);
