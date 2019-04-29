// 提交出库单
import {
    REQUEST_START,
    REQUEST_COMPLETE,
    REQUEST_FAILED,
} from "../../actions/storeOut/submitStoreOutAction";

const defaultState = {
    isFetching: false,
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
