import {
    REQUEST_START,
    REQUEST_COMPLETE,
    REQUEST_FAILED
} from "../../actions/storeIn/findStoreInTrackAction";

const defaultState = {
    isFetching: false,
    list: []
};

export default function(state = defaultState, action) {
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
                list: action.payload.rows
            };
        case REQUEST_FAILED:
            return {
                ...state,
                isFetching: false,
                list: []
            };
        default:
            return state;
    }
}
