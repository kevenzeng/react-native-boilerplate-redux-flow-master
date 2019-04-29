import { createAction } from "redux-actions";

export const REQUEST = Symbol();
export const fetchStepInfo = createAction(REQUEST);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED);

export const START_DATE_UPDATE = Symbol();
export const startDateUpdate = createAction(START_DATE_UPDATE);

export const FINISH_DATE_UPDATE = Symbol();
export const finishDateUpdate = createAction(FINISH_DATE_UPDATE);

export const TRIGGER_RESULT = Symbol();
export const triggerResult = createAction(TRIGGER_RESULT);

export const TRIGGER_SITE = Symbol();
export const triggerSite = createAction(TRIGGER_SITE);

export const REMARK_UPDATES = Symbol();
export const remarkUpdates = createAction(REMARK_UPDATES);

// 照片增删
export const ADD_PHOTO = Symbol();
export const addPhoto = createAction(ADD_PHOTO);

export const DELETE_PHOTO = Symbol();
export const deletePhoto = createAction(DELETE_PHOTO);
