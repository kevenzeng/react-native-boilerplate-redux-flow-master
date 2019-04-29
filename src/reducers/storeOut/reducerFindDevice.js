// 用途：用于添加备件明细信息时，从库存中添加显示的记录。(只能查找状态为在库的备件)
import {
    REQUEST_START,
    REQUEST_COMPLETE,
    REQUEST_FAILED,
} from "../../actions/storeOut/findStoreOutDeviceAction";

const defaultState = {
    isFetching: false,
    didInvalidate: false,
    list: []
};

export default function(state = defaultState, action) {
    switch (action.type) {
        case REQUEST_START:
            return {
                ...state,
                isFetching: true
            };
        case REQUEST_COMPLETE:
            return {
                ...state,
                isFetching: false,
                list: action.payload.rows
            };
        case REQUEST_FAILED:
            return {
                ...state,
                isFetching: false,
                list: []
            };
        default:
            return state;
    }
}
