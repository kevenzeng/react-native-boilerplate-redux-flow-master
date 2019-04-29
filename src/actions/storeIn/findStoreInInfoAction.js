// 查看/编辑修改 *入库单*，显示各个详细信息
import { createAction } from "redux-actions";

export const REQUEST = Symbol();
export const fetchStoreInInfo = createAction(REQUEST);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED);
