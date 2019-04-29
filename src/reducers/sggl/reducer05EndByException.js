import {
    REQUEST_START,
    REQUEST_COMPLETE,
    REQUEST_FAILED,
} from "../../actions/sggl/05_endByExpectionAction";

const defaultState = {
    isFetching: false,
    didInvalidate: false,
    responses: {
        "msg": "success",
        "displayCode": 1,
        "displayName": "toFollowUpList",
        "readOnlyFlag": "false",
        "sr_status": 10,
        "sr_end_remarks": "厂商人员迟到"
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
