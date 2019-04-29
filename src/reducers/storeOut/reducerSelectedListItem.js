// 用于出库单选择项
import { SELECT } from "../../actions/storeOut/selectedListItemAction";

export default function(state = {}, action) {
    switch (action.type) {
        case SELECT:
            if (action.payload) {
                return action.payload;
            } else {
                return {};
            }
        default:
            return state;
    }
}
