// 查找移库单（分页）
// 用途：盘点单的多条件查询，列表分页显示
import { createAction } from "redux-actions";

export const REQUEST = Symbol();
export const fetchStoreCheck = createAction(REQUEST);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED);
