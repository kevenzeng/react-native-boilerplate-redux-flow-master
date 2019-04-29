import { createAction } from "redux-actions";

export const REQUEST = Symbol();
export const fetchConstructPrepare = createAction(REQUEST);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED);

export const TRIGGER_READY = Symbol();
export const triggerReady = createAction(TRIGGER_READY);

export const ADD_NEW_ROW = Symbol();
export const addNewRow = createAction(ADD_NEW_ROW);

export const DELETE_A_ROW = Symbol();
export const deleteARow = createAction(DELETE_A_ROW);
