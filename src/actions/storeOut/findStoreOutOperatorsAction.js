// 用途：用于在出库单修改/显示界面中，当选择了处理操作项后，获取可供选择的下一步处理人列表

import { createAction } from "redux-actions";

export const REQUEST = Symbol();
export const fetchStoreOutOperators = createAction(REQUEST);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED);
