import { createAction } from "redux-actions";

// 用户登录，登出，头像设置

export const REQUEST = Symbol();
export const userLogin = createAction(REQUEST);

export const RETRIEVE = Symbol();
export const getUserFromStorage = createAction(RETRIEVE);

export const REQUEST_START = Symbol();
export const REQUEST_COMPLETED = Symbol();
export const REQUEST_FAILED = Symbol();
export const request = createAction(REQUEST_START);
// return 2nd argument as `meta` field
export const success = createAction(REQUEST_COMPLETED, null, (...args) => args[1]); // ??
export const failure = createAction(REQUEST_FAILED);

export const SET_AUTHORIZATION = Symbol();
export const RESET_AUTHORIZATION = Symbol();
export const RESET_AUTHORIZATION_RESULT = Symbol();
export const setAuthorization = createAction(SET_AUTHORIZATION);
export const resetAuthorization = createAction(RESET_AUTHORIZATION);
export const resetAuthorizationResult = createAction(RESET_AUTHORIZATION_RESULT);

export const REMOVE_CACHE = Symbol();
export const cleanCache = createAction(REMOVE_CACHE);
