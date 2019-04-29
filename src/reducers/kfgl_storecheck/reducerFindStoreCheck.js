// 查找移库单（分页）
// 用途：盘点单的多条件查询，列表分页显示
import {
    REQUEST_START,
    REQUEST_COMPLETE,
    REQUEST_FAILED,
} from "../../actions/kfgl_storecheck/findStoreCheckAction";

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
                list: action.payload.rows
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
