import { createAction } from "redux-actions";

export const SELECT = Symbol();
export const selectListItem = createAction(SELECT);
