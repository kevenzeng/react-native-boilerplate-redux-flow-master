// 待办列表点击事件的状态处理
import { SELECT } from "../../actions/toDoListSelectAction";

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
