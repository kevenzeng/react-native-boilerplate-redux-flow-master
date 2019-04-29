// 保存入库单
import {
    REQUEST_START,
    REQUEST_COMPLETE,
    REQUEST_FAILED,
} from "../../actions/storeIn/saveStoreInInfoAction";

const defaultState = {
    isFetching: false,
    inNo: [],
};
export default function (state = defaultState, action) {

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
                inNo: action.payload,
            };
        case REQUEST_FAILED:
            return {
                ...state,
                isFetching: false,
                inNo: [],
            };
        default:
            return state;
    }
}
