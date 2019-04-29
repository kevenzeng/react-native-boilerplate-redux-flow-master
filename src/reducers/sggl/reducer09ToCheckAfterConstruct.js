import {
    REQUEST_START,
    REQUEST_COMPLETE,
    REQUEST_FAILED,
    SET_PROGRESS,
    SET_END_TIME,
    SET_REASON,
    REMARK_UPDATES,
    TRIGGER_IS_DONE,
    ADD_NEW_ROW,
    DELETE_A_ROW,
    ADD_PHOTO,
    DELETE_PHOTO,
    SHOW_MODAL,
    HIDE_MODAL,
} from "../../actions/sggl/09_toCheckAfterConstructAction";
import { cloneDeep } from "lodash";

const defaultState = {
    isFetching: false,
    didInvalidate: false,
    isUploading: false,
    responses: {},
};

export default function (state = defaultState, action) {
    const { sr_endpic, sr_endpic_local } = state.responses;
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
        case SET_PROGRESS:
            return {
                ...state,
                responses: {
                    ...state.responses,
                    sr_progress: action.payload + "",
                }
            };
        case SET_END_TIME:
            return {
                ...state,
                responses: {
                    ...state.responses,
                    sr_endtime: action.payload,
                }
            };
        case SET_REASON:
            return {
                ...state,
                responses: {
                    ...state.responses,
                    sr_reason: action.payload,
                }
            };
        case TRIGGER_IS_DONE:
            return {
                ...state,
                responses: {
                    ...state.responses,
                    endCheckListData: state.responses.endCheckListData.map((data, index) => {
                        let key = `sr_end_O${action.payload}`;
                        let copy = cloneDeep(data);
                        copy[ key ] = copy[ key ] === 1 ? 0 : 1;
                        return index === 0 && { ...copy };
                    }),
                }
            };
        case REMARK_UPDATES:
            return {
                ...state,
                responses: {
                    ...state.responses,
                    sr_end_remarks: action.payload,
                }
            };
        case ADD_NEW_ROW:
            return {
                ...state,
                responses: {
                    ...state.responses,
                    olditemData: [
                        ...state.responses.olditemData,
                        action.payload
                    ]
                }
            };
        case DELETE_A_ROW:
            let rowIndex = action.payload;
            return {
                ...state,
                responses: {
                    ...state.responses,
                    olditemData: [
                        ...state.responses.olditemData.slice(0, rowIndex),
                        ...state.responses.olditemData.slice(rowIndex + 1)
                    ]
                }
            };
        case ADD_PHOTO:
            let addedPicAddress = action.payload;
            return {
                ...state,
                responses: {
                    ...state.responses,
                    sr_endpic: sr_endpic.concat(rename(addedPicAddress)),
                    sr_endpic_local: sr_endpic_local.concat(addedPicAddress),
                }
            };
        case DELETE_PHOTO:
            let deletedPicName = action.payload;
            return {
                ...state,
                responses: {
                    ...state.responses,
                    sr_endpic: sr_endpic.filter(address => { return !address.includes(deletedPicName); }),
                    sr_endpic_local: sr_endpic_local.filter(address => { return !address.includes(deletedPicName); }),
                }
            };
        case SHOW_MODAL:
            return {
                ...state,
                isUploading: true,
            };
        case HIDE_MODAL:
            return {
                ...state,
                isUploading: false,
            };
        default:
            return state;
    }
}

// Convert local uri
function rename(str) {
    var picName = str.slice(str.lastIndexOf("/") + 1);
    return `uploads/${picName}`;
}
