// 查找盘点单的盘点货架列表
// 用途：用于在盘点单编辑详情界面中，获取盘点单保存过的盘点货架列表

import { createAction } from "redux-actions";

export const REQUEST = Symbol();
export const fetchSheetsByCheckNo = createAction(REQUEST);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED);
