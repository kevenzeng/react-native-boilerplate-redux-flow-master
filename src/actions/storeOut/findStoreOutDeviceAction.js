// 用途：用于添加备件明细信息时，从库存中添加显示的记录。(只能查找状态为在库的备件)
import { createAction } from "redux-actions";

export const REQUEST = Symbol();
export const fetchStoreOutDevice = createAction(REQUEST);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED);

export const QR_STORE_OUT_DEVICE_INFO = Symbol();
export const qrInfoForStoreOutDevice = createAction(QR_STORE_OUT_DEVICE_INFO);
