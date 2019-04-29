import {
    REQUEST_START,
    REQUEST_COMPLETE,
    REQUEST_FAILED,
} from "../../actions/kfgl_storetrans/submitStoretransAction";

const defaultState = {
    isFetching: false,
    didInvalidate: false,
    list: ""
};

export default function(state = defaultState, action) {
    switch (action.type) {
        case REQUEST_START:
            return {
                ...state,
                isFetching: true,
                list: ""
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
