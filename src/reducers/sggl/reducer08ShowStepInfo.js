import {
    REQUEST_START,
    REQUEST_COMPLETE,
    REQUEST_FAILED,
    START_DATE_UPDATE,
    FINISH_DATE_UPDATE,
    TRIGGER_RESULT,
    TRIGGER_SITE,
    REMARK_UPDATES,
    ADD_PHOTO,
    DELETE_PHOTO,
} from "../../actions/sggl/08_showStepInfoAction";
import { cloneDeep } from "lodash";

const defaultState = {
    isFetching: false,
    didInvalidate: false,
    responses: {}
};


export default function (state = defaultState, action) {
    let copy = cloneDeep(state.responses);
    switch (action.type) {
        case REQUEST_START:
            return {
                ...state,
                isFetching: true,
                responses: copy
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
        case TRIGGER_RESULT:
            copy.bzData[0].jlData[0].bz_jieguo = action.payload === 1 ? "正常" : "异常";
            return {
                ...state,
                responses: copy
            };
        case TRIGGER_SITE:
          copy.bzData[0].jlData[0].bz_site = action.payload === 1 ? "办公区" : "机房";
          return {
              ...state,
              responses: copy
          };
        case REMARK_UPDATES:
            if(copy) copy.bzData[0].jlData[0].sr_remark_bz = action.payload ? action.payload : "";
            return {
                ...state,
                responses: copy
            };
        case START_DATE_UPDATE:
            copy.bzData[0].jlData[0].sr_bz_startTime = action.payload;
            return {
                ...state,
                responses: copy
            };
            case FINISH_DATE_UPDATE:
                copy.bzData[0].jlData[0].sr_bz_endTime = action.payload;
                return {
                    ...state,
                    responses: copy
                };
        case ADD_PHOTO:
            let addedPicAddress = action.payload;
            copy.bzData[0].jlData[0].sr_jianlipic.push(rename(addedPicAddress));
            copy.bzData[0].jlData[0].sr_jianlipic_local.push(addedPicAddress);
            return {
                ...state,
                responses: copy,
            };
        case DELETE_PHOTO:
            let deletedPicName = action.payload;
            copy.bzData[0].jlData[0].sr_jianlipic = copy.bzData[0].jlData[0].sr_jianlipic.filter(address => { return !address.includes(deletedPicName); });
            copy.bzData[0].jlData[0].sr_jianlipic_local = copy.bzData[0].jlData[0].sr_jianlipic_local.filter(address => { return !address.includes(deletedPicName); });
            return {
                ...state,
                responses: copy,
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
