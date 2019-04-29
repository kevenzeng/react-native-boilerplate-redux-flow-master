// 删除盘点单(单条)
// 用途：在盘点单列表中选择一条盘点单进行删除操作，只有申请中状态下，由处理人或管理员删除
import {
    REQUEST_START,
    REQUEST_COMPLETE,
    REQUEST_FAILED,
} from "../../actions/kfgl_storecheck/deleteStoreCheckInfoAction";

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
