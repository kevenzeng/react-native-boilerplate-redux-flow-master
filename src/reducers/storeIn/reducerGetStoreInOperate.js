// 根据入库单状态来获取当前环节下的可操作的类型列表
import {
    REQUEST_START,
    REQUEST_COMPLETE,
    REQUEST_FAILED,
} from "../../actions/storeIn/getStoreInOperateAction";

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