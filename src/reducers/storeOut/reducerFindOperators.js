// 用途：用于在出库单修改/显示界面中，当选择了处理操作项后，获取可供选择的下一步处理人列表
import {
    REQUEST_START,
    REQUEST_COMPLETE,
    REQUEST_FAILED,
} from "../../actions/storeOut/findStoreOutOperatorsAction";

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
