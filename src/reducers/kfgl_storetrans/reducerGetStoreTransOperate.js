// 获取下一步操作处理列表
// 用途：在移库单详细界面，根据移库单状态，显示可选择的操作列表
import {
    REQUEST_START,
    REQUEST_COMPLETE,
    REQUEST_FAILED,
} from "../../actions/kfgl_storetrans/getStoreTransOperateAction";

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
                isFetching: true,
                list: []
            };
        case REQUEST_COMPLETE:
            return {
                ...state,
                isFetching: false,
                list: action.payload
            };
        case REQUEST_FAILED:
            return {
                ...state,
                isFetching: false
            };
        default:
            return state;
    }
}
