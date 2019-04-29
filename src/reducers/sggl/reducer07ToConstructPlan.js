import {
    REQUEST_START,
    REQUEST_COMPLETE,
    REQUEST_FAILED,
} from "../../actions/sggl/07_toConstructPlanAction";
import { REQUEST_COMPLETE as END_MANUAL_REQUEST_COMPLETE } from "../../actions/sggl/16_endManualAction";

const defaultState = {
    isFetching: false,
    didInvalidate: false,
    responses: {},
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
        case END_MANUAL_REQUEST_COMPLETE:
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
