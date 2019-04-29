import {
    createAction
} from "redux-actions";

export const REQUEST = Symbol();
export const fetchCheckBeforeConstruct = createAction(REQUEST);

export const REQUEST_START = Symbol();
export const request = createAction(REQUEST_START);

export const REQUEST_COMPLETE = Symbol();
export const success = createAction(REQUEST_COMPLETE);

export const REQUEST_FAILED = Symbol();
export const failure = createAction(REQUEST_FAILED);

export const TRIGGER_IS_DONE = Symbol();
export const triggerIsDone = createAction(TRIGGER_IS_DONE);

export const REMARK_UPDATES = Symbol();
export const remarkUpdates = createAction(REMARK_UPDATES);

export const DATE_UPDATE = Symbol();
export const dateUpdate = createAction(DATE_UPDATE);

// 作业区域核实
export const RACK_UPDATE = Symbol();
export const rackUpdate = createAction(RACK_UPDATE);

// 人员增删
export const DEL_OPERATOR = Symbol();
export const deleteOperator = createAction(DEL_OPERATOR);

export const ADD_OPERATOR = Symbol();
export const addOperator = createAction(ADD_OPERATOR);

// 照片增删
export const ADD_PHOTO = Symbol();
export const addPhoto = createAction(ADD_PHOTO);

export const DELETE_PHOTO = Symbol();
export const deletePhoto = createAction(DELETE_PHOTO);
