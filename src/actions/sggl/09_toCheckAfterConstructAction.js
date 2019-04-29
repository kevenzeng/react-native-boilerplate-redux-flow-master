import { createAction } from "redux-actions";

export const REQUEST = Symbol();
export const fetchCheckAfterConstruct = createAction(REQUEST);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED);

export const SET_PROGRESS = Symbol();
export const setProgress = createAction(SET_PROGRESS);

export const SET_END_TIME = Symbol();
export const setEndTime = createAction(SET_END_TIME);

export const SET_REASON = Symbol();
export const setReason = createAction(SET_REASON);

export const TRIGGER_IS_DONE = Symbol();
export const triggerIsDone = createAction(TRIGGER_IS_DONE);

export const REMARK_UPDATES = Symbol();
export const remarkUpdates = createAction(REMARK_UPDATES);

// 旧备件增删
export const ADD_NEW_ROW = Symbol();
export const addNewRow = createAction(ADD_NEW_ROW);

export const DELETE_A_ROW = Symbol();
export const deleteARow = createAction(DELETE_A_ROW);

// 添加新照片
export const ADD_PHOTO = Symbol();
export const addPhoto = createAction(ADD_PHOTO);

export const DELETE_PHOTO = Symbol();
export const deletePhoto = createAction(DELETE_PHOTO);

// 上传照片 Modal 控制
export const SHOW_MODAL = Symbol();
export const showModal = createAction(SHOW_MODAL);

export const HIDE_MODAL = Symbol();
export const hideModal = createAction(HIDE_MODAL);

// 点击完成，返回历史页
export const BACK_TO_HISTORY = Symbol();
export const backToHistoryPage = createAction(BACK_TO_HISTORY);
