import {
    REQUEST_START,
    REQUEST_COMPLETE,
    REQUEST_FAILED,
} from "../../actions/sggl/06_exitConstructAction";

const defaultState = {
    isFetching: false,
    didInvalidate: false,
    responses: {
        "msg": "success",
        "displayCode": 1,
        "displayName": "toFollowUpList",
        "readOnlyFlag": "false",
        "sr_status": 0
    }
};

export default function (state = defaultState, action) {
    switch (action.type) {
        case REQUEST_START:
            return {
                ...state,
                isFetching: true,
                responses: {}
            };
        case REQUEST_COMPLETE:
            return {
                ...state,
                isFetching: false,
                responses: action.payload
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
