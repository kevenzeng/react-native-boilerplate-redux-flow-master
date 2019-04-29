import { createAction } from "redux-actions";

export const RETRIEVE_IP = Symbol();
export const getServerIpFromStorage = createAction(RETRIEVE_IP);
