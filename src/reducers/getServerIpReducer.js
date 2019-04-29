import { RETRIEVE_IP, } from "../actions/getServerAddressAction";

const defaultState = {
    currentServerIp: ""
};

export default function(state = defaultState, action) {
    switch (action.type) {
        case RETRIEVE_IP:
            return { currentServerIp: action.payload };
        default:
            return state;
    }
}
