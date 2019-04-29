// 删除移库单(单条)
// 用途：在移库单列表中选择一条移库单进行删除操作，只有申请中状态下，由处理人或管理员删除
import {
    REQUEST_START,
    REQUEST_COMPLETE,
    REQUEST_FAILED,
} from "../../actions/kfgl_storetrans/deleteStoreTransInfoAction";

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
                list: action.payload.msg
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
