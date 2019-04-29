// 备件类型列表查询（分页）
// 用途：在盘点单添加盘点入库备件时，添加入库明细记录可从备件类型中选择
import { createAction } from "redux-actions";

export const REQUEST = Symbol();
export const fetchStoreCheckDeviceType = createAction(REQUEST);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED);
