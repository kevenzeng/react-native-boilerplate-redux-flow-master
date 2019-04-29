// 获取出库处理操作列表
// 用途：用于在出库单修改/显示界面中，出库单的当前处理人是当前用户时，需要提交操作，可供选择的列表

import {
    REQUEST_START,
    REQUEST_COMPLETE,
    REQUEST_FAILED,
} from "../../actions/storeOut/getStoreOutOperateAction";

const defaultState = {
    isFetching: false,
    didInvalidate: false,
    list: []
};
export default function (state = defaultState, action) {

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
                list: action.payload,
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
