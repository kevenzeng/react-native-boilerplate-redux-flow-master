import {
    REQUEST_START,
    REQUEST_COMPLETED,
    REQUEST_FAILED,
    SET_AUTHORIZATION,
    RESET_AUTHORIZATION,
    RESET_AUTHORIZATION_RESULT,
    REMOVE_CACHE,
} from "../actions/authorizeAction";

const defaultUserState = {
    isFetching: false,
    authorization: {},
    hasError: false,
    result: false
};

export default function user(state = defaultUserState, action) {
    switch (action.type) {
        case REQUEST_START:
            return {
                ...state,
                isFetching: true,
                authorization: {},
                hasError: false,
                result: false
            };
        case REQUEST_COMPLETED:
            return {
                ...state,
                isFetching: true,
                authorization: action.payload[0], // array
                hasError: action.payload[0].msg !== "success",
                result: action.payload[0].msg === "success"
            };
        case REQUEST_FAILED:
            return {
                ...state,
                isFetching: false,
            };
        case REMOVE_CACHE:
            if (!action.payload.isLogin) {
                return defaultUserState;
            }
            return state;
        case RESET_AUTHORIZATION:
            return defaultUserState;
        case RESET_AUTHORIZATION_RESULT:
            return {
                ...state,
                result: false
            };
        case SET_AUTHORIZATION:
            return {
                ...state,
                authorization: action.payload  // object
            };
        default:
            return state;
    }
}
