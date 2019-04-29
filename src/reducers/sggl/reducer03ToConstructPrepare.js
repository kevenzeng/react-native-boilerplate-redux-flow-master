// 用途：查询历史跟进施工单列表
import {
    REQUEST_START,
    REQUEST_COMPLETE,
    REQUEST_FAILED,
    TRIGGER_READY,
    ADD_NEW_ROW,
    DELETE_A_ROW
} from "../../actions/sggl/03_toConstructPrepareAction";

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
        case TRIGGER_READY:
            return {
                ...state,
                responses: {
                    ...state.responses,
                    toolsData: state.responses.toolsData.map((data, index) => {
                        return index === action.payload ? { ...data, sr_gongju: data.sr_gongju === 1 ? 0 : 1 } : data;
                    }),
                }
            };
        case ADD_NEW_ROW:
            let newRow = action.payload;
            return {
                ...state,
                responses: {
                    ...state.responses,
                    newitemData: [
                        ...state.responses.newitemData,
                        newRow,
                    ]
                }
            };
        case DELETE_A_ROW:
            let rowIndex = action.payload;
            return {
                ...state,
                responses: {
                    ...state.responses,
                    newitemData: [
                        ...state.responses.newitemData.slice(0, rowIndex),
                        ...state.responses.newitemData.slice(rowIndex + 1)
                    ]
                }
            };
        default:
            return state;
    }
}
