import {
    REQUEST_START,
    REQUEST_COMPLETE,
    REQUEST_FAILED,
    REMARK_UPDATES,
    TRIGGER_IS_DONE,
    DATE_UPDATE,
    RACK_UPDATE,
    DEL_OPERATOR,
    ADD_OPERATOR,
    ADD_PHOTO,
    DELETE_PHOTO,
} from "../../actions/sggl/04_toCheckBeforeConstructAction";
import {
    isEmpty
} from "lodash";

const defaultState = {
    isFetching: false,
    didInvalidate: false,
    responses: {}
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
        case TRIGGER_IS_DONE:
            return {
                ...state,
                responses: {
                    ...state.responses,
                    checkListData: state.responses.checkListData && state.responses.checkListData.map((data, index) => {
                        let key = `sr_O${action.payload}`;
                        let copy = Object.assign({}, data);
                        copy[key] = copy[key] === 1 ? 0 : 1;
                        return index === 0 && {
                            ...copy
                        };
                    }),
                }
            };
        case REMARK_UPDATES:
            return {
                ...state,
                responses: {
                    ...state.responses,
                    checkData: state.responses.checkData && state.responses.checkData.map((data, index) => {
                        return index === 0 && {
                            ...data,
                            sr_remarks: action.payload
                        };
                    })
                }
            };
        case DATE_UPDATE:
            return {
                ...state,
                responses: {
                    ...state.responses,
                    checkData: state.responses.checkData && state.responses.checkData.map((data, index) => {
                        return index === 0 && {
                            ...data,
                            sr_bgtime: action.payload
                        };
                    })
                }
            };
        case RACK_UPDATE:
            return {
                ...state,
                responses: {
                    ...state.responses,
                    checkData: state.responses.checkData && state.responses.checkData.map((data, index) => {
                        return index === 0 && {
                            ...data,
                            sr_rack: action.payload
                        };
                    })
                }
            };
        case DEL_OPERATOR:
            return {
                ...state,
                responses: {
                    ...state.responses,
                    checkData: state.responses.checkData && state.responses.checkData.map((data, index) => {
                        let {
                            key,
                            name
                        } = action.payload;
                        let copy = Object.assign({}, data);
                        copy[key] = copy[key]
                            .split(",")
                            .filter(word => word !== name)
                            .join(",");
                        return index === 0 && {
                            ...copy
                        };
                    })
                }
            };
        case ADD_OPERATOR:
            return {
                ...state,
                responses: {
                    ...state.responses,
                    checkData: state.responses.checkData && state.responses.checkData.map((data, index) => {
                        let {
                            key,
                            name
                        } = action.payload;
                        let copy = Object.assign({}, data);
                        copy[key] = isEmpty(copy[key]) ? [].concat(name).join(",") : copy[key].split(",").concat(name).join(",");
                        return index === 0 && {
                            ...copy
                        };
                    })
                }
            };
        case ADD_PHOTO:
            let addedPicAddress = action.payload;
            return {
                ...state,
                responses: {
                    ...state.responses,
                    checkData: state.responses.checkData && state.responses.checkData.map((data, index) => {
                        if (index === 0) {
                            return {
                                ...data,
                                sr_prepic: data.sr_prepic.concat(rename(addedPicAddress)),
                                sr_prepic_local: data.sr_prepic_local.concat(addedPicAddress),
                            };
                        }
                    }),
                }
            };
        case DELETE_PHOTO:
            let deletedPicName = action.payload;
            return {
                ...state,
                responses: {
                    ...state.responses,
                    checkData: state.responses.checkData && state.responses.checkData.map((data, index) => {
                        if (index === 0) {
                            return {
                                ...data,
                                sr_prepic: data.sr_prepic.filter(address => {
                                    return !address.includes(deletedPicName);
                                }),
                                sr_prepic_local: data.sr_prepic_local.filter(address => {
                                    return !address.includes(deletedPicName);
                                }),
                            };
                        }
                    }),
                }
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
