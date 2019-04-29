// 根据入库单状态和操作类型来获取可提交下一步的处理人列表
import {
    REQUEST_START,
    REQUEST_COMPLETE,
    REQUEST_FAILED,
} from "../../actions/storeIn/findOperatorsAction";

const defaultState = {
    isFetching: false,
    didInvalidate: false,
    list: []
};

export default function (state = defaultState, action) {
    switch (action.type) {
        case REQUEST_START: {
            return {
                ...state,
                isFetching: true,
                // list: [] 这里不清空是留作表单显示控制
            };
        }
        case REQUEST_COMPLETE:
            return {
                ...state,
                isFetching: false,
                list: action.payload
            };
        case REQUEST_FAILED:
            return {
                ...state,
                isFetching: false,
            };
        default:
            return state;

    }
}
