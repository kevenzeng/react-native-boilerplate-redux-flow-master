// 用途：用于在修改/编辑/显示出库单时，显示已保存的备件明细信息
import {
    REQUEST_START,
    REQUEST_COMPLETE,
    REQUEST_FAILED,
} from "../../actions/storeOut/findStoreOutDetailAction";

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
                list: action.payload.data
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
