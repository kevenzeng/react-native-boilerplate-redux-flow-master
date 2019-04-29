// 保存入库单
import {
    REQUEST_START,
    REQUEST_COMPLETE,
    REQUEST_FAILED,
} from "../../actions/storeIn/submitStoreInAction";

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
