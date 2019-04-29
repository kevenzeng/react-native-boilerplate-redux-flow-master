import { createAction } from "redux-actions";

export const REQUEST = Symbol();
export const fetchDevice = createAction(REQUEST);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED);

export const QR_STORE_TRANS_DEVICE_INFO = Symbol();
export const qrInfoForStoreTransDeviceInfo = createAction(QR_STORE_TRANS_DEVICE_INFO);
