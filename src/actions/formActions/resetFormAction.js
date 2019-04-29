import { createAction } from "redux-actions";

export const RESET_SHEET_FORM = Symbol();
export const resetFindSheetForm = createAction(RESET_SHEET_FORM);
