import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { alertReducer } from "redux-saga-rn-alert";

import homeReducer from "../container/HomeContainer/reducer";
import user from "./user";
import currentServerIp from "./getServerIpReducer";
import followUpCounts from "./getFollowUpCountReducer";
import nextOperator from "./storeIn/reducerFindOperators";
import getStoreInOperate from "./storeIn/reducerGetStoreInOperate";
import findDevice from "./storeIn/reducerFindDevice";
import findDeviceType from "./storeIn/reducerFindDeviceType";
import findRoom from "./storeIn/reducerFindRoom";
import findSheet from "./storeIn/reducerFindSheet";
import findStoreRoom from "./storeIn/reducerFindStoreRoom";
import findStoreInTrack from "./storeIn/reducerFindStoreInTrack";
import findStoreIn from "./storeIn/reducerFindStoreIn";
import findStoreInInfo from "./storeIn/reducerFindStoreInInfo";
import findStoreInDetail from "./storeIn/reducerFindStoreInDetail";
import saveStoreIn from "./storeIn/reducerSaveStoreInInfo";
import submitStoreIn from "./storeIn/reducerSubmitStoreIn";
import testUser from "./testUser";
import testToDoList from "./toDoList/testToDoList";
import testSelectedToDoList from "./toDoList/testSelectedToDoList";

// 出库
import findStoreOut from "./storeOut/reducerFindStoreOut";
import findStoreOutDevice from "./storeOut/reducerFindDevice";
import findStoreOutRoom from "./storeOut/reducerFindStoreRoom";
import findStoreOutInfo from "./storeOut/reducerFindStoreOutInfo";
import findStoreOutDetail from "./storeOut/reducerFindStoreOutDetail";
import findStoreOutTrack from "./storeOut/reducerFindStoreOutTrack";
import getStoreOutOperate from "./storeOut/reducerGetStoreOutOperate";
import findStoreOutOperators from "./storeOut/reducerFindOperators";
import saveStoreOutInfo from "./storeOut/reducerSaveStoreOutInfo";
import submitStoreOut from "./storeOut/reducerSaveStoreOutInfo";

// 库存
import deviceFindDevice from "./kfgl_device/reducerFindDevice";
import deviceFindDeviceInfo from "./kfgl_device/reducerFindDeviceInfo";
import deviceFindStoreRoom from "./kfgl_device/reducerFindStoreRoom";
import deviceFindSheet from "./kfgl_device/reducerFindSheet";

// 移库
import findStoreTrans from "./kfgl_storetrans/reducerFindStoreTrans";
import findStoreTransInfo from "./kfgl_storetrans/reducerFindStoreTransInfo";
import findStoreTransDetail from "./kfgl_storetrans/reducerFindStoreTransDetail";
import findStoreTransRoom from "./kfgl_storetrans/reducerFindRoom";
import findStoreTransStoreRoom from "./kfgl_storetrans/reducerFindStoreRoom";
import findStoreTransDevice from "./kfgl_storetrans/reducerFindDevice";
import findStoreTransSheet from "./kfgl_storetrans/reducerFindSheet";
import findStoreTransTrack from "./kfgl_storetrans/reducerFindStoreTransTrack";
import getStoreTransOperate from "./kfgl_storetrans/reducerGetStoreTransOperate";
import findStoreTransOperaters from "./kfgl_storetrans/reducerFindOperaters";
import deleteStoreTransInfo from "./kfgl_storetrans/reducerDeleteStoreTransInfo";
import saveStoreTransInfo from "./kfgl_storetrans/reducerSaveStoreTransInfo";
import submitStoretrans from "./kfgl_storetrans/reducerSubmitStoretrans";

// 盘点
import findStoreCheck from "./kfgl_storecheck/reducerFindStoreCheck";
import findStoreCheckRoom from "./kfgl_storecheck/reducerFindRoom";
import findStoreCheckStoreRoom from "./kfgl_storecheck/reducerFindStoreRoom";
import findStoreCheckSheet from "./kfgl_storecheck/reducerFindSheet";
import findStoreCheckDeviceType from "./kfgl_storecheck/reducerFindDeviceType";
import findStoreCheckInfo from "./kfgl_storecheck/reducerFindStoreCheckInfo";
import findStoreCheckDetail from "./kfgl_storecheck/reducerFindStoreCheckDetail";
import findStoreCheckDetailForType1 from "./kfgl_storecheck/reducerFindStoreCheckDetailForType1";
import findStoreCheckTrack from "./kfgl_storecheck/reducerFindStoreCheckTrack";
import deleteStoreCheckInfo from "./kfgl_storecheck/reducerDeleteStoreCheckInfo";
import saveStoreCheckInfo from "./kfgl_storecheck/reducerSaveStoreCheckInfo";
import submitStorecheck from "./kfgl_storecheck/reducerSubmitStoreCheck";
import updateStoreCheckDetail from "./kfgl_storecheck/reducerUpdateStoreCheckDetail";
import getStoreCheckOperate from "./kfgl_storecheck/reducerGetStoreCheckOperate";
import storeCheckFindOperaters from "./kfgl_storecheck/reducerFindOperaters";
import findSheetsByCheckNo from "./kfgl_storecheck/reducerFindSheetsByCheckNo";

// 标准化施工
import findToFollowUpList from "./sggl/reducer00FindFollowUpList";
import findFollowUpHisList from "./sggl/reducer01FindFollowUpHisList";
import showConstructFormInfo from "./sggl/reducer02showConstructFormInfo";
import toConstructPrepare from "./sggl/reducer03ToConstructPrepare";
import toCheckBeforeConstruct from "./sggl/reducer04ToCheckBeforeConstruct";
import reducerEndByException from "./sggl/reducer05EndByException";
import reducerExitConstruct from "./sggl/reducer06ExitConstruct";
import toConstructPlan from "./sggl/reducer07ToConstructPlan";
import showStepInfo from "./sggl/reducer08ShowStepInfo";
import toCheckAfterConstruct from "./sggl/reducer09ToCheckAfterConstruct";
import supervisionRecordList from "./sggl/reducer10SupervisionRecordList";
import showManual from "./sggl/reducer12showManual";
import supervisionList from "./sggl/reducer15SupervisionList";
import endManual from "./sggl/reducer16EndManual";
import confirmSupervision from "./sggl/reducer17ConfirmSupervision";

export default combineReducers({
	form: formReducer,
	homeReducer,
    followUpCounts,
    user,
    currentServerIp,
    testUser,
    testToDoList,
    testSelectedToDoList,
    nextOperator,
    getStoreInOperate,
    findDevice,
    findDeviceType,
    findRoom,
    findStoreRoom,
    findStoreInTrack,
    findStoreInInfo,
    findStoreInDetail,
    findStoreIn,
    findSheet,
    saveStoreIn,
    submitStoreIn,
    // 出库
    findStoreOut,
    findStoreOutDevice,
    findStoreOutRoom,
    findStoreOutInfo,
    findStoreOutDetail,
    findStoreOutTrack,
    getStoreOutOperate,
    findStoreOutOperators,
    saveStoreOutInfo,
    submitStoreOut,
    // 库存管理
    deviceFindDevice,
    deviceFindDeviceInfo,
    deviceFindStoreRoom,
    deviceFindSheet,
    // 移库
    findStoreTrans,
    findStoreTransInfo,
    findStoreTransDetail,
    findStoreTransRoom,
    findStoreTransStoreRoom,
    findStoreTransDevice,
    findStoreTransSheet,
    findStoreTransTrack,
    getStoreTransOperate,
    findStoreTransOperaters,
    deleteStoreTransInfo,
    saveStoreTransInfo,
    submitStoretrans,
    // 盘点
    findStoreCheck,
    findStoreCheckRoom,
    findStoreCheckStoreRoom,
    findStoreCheckSheet,
    findStoreCheckDeviceType,
    findStoreCheckDetailForType1,
    findStoreCheckInfo,
    findStoreCheckDetail,
    findStoreCheckTrack,
    deleteStoreCheckInfo,
    saveStoreCheckInfo,
    submitStorecheck,
    updateStoreCheckDetail,
    getStoreCheckOperate,
    storeCheckFindOperaters,
    findSheetsByCheckNo,
    // 标准化施工
    findToFollowUpList,
    findFollowUpHisList,
    showConstructFormInfo,
    toConstructPrepare,
    toCheckBeforeConstruct,
    reducerEndByException,
    reducerExitConstruct,
    toConstructPlan,
    showStepInfo,
    toCheckAfterConstruct,
    supervisionRecordList,
    showManual,
    supervisionList,
    endManual,
    confirmSupervision,
    // 3rd Party Tools
    alertReducer,
});
