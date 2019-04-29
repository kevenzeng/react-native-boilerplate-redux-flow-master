// 用于出库单选择项
import { createAction } from "redux-actions";

export const SELECT = Symbol();
export const selectListItem = createAction(SELECT);
