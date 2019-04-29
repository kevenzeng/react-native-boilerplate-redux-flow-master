// 用途：用于在显示出库单列表时，选择一条记录删除操作。（仅出库单在申请中状态下才能删除）

import { createAction } from "redux-actions";

export const REQUEST = Symbol();
export const toDeleteStoreOutInfo = createAction(REQUEST);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED);
