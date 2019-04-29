import { Alert, AsyncStorage } from "react-native";
import { take, fork, select, put, call, spawn } from "redux-saga/effects";
import { startSubmit, stopSubmit, reset, change, arrayPush, formValueSelector } from "redux-form";

// Tools
import { fetchResource } from "../boot/sagaHelper";
import { toaster } from "../services/utils/toastUtils";
import {
    LOGINFORM,
    DEALWITHSTOREINFORM,
    DEALWITHSTOREOUTFORM,
    DEALWITHSTORETRANSFORM,
    FINDSHEETFORM,
    DEAL_WITH_DEVICE_SCREEN,
    STORE_CHECK_SCREEN,
    DEAL_WITH_STORE_CHECK_FORM,
    SGGL_00_SCREEN,
} from "../boot/config";
import _ from "lodash";
import NavigationService from "../services/NavigationService";
import { watchAlertChannel, alert } from "redux-saga-rn-alert";

// Form Actions
import * as resetFormActions from "../actions/formActions/resetFormAction";
// API Actions
import * as authorizeActions from "../actions/authorizeAction";
import * as findFollowUpCountsActions from "../actions/getFollowUpCountAction";

// 入库
import * as findStoreInActions from "../actions/storeIn/findStoreInAction";
import * as findDeviceTypeActions from "../actions/storeIn/findDeviceTypeAction";
import * as findDeviceActions from "../actions/storeIn/findDeviceAction";
import * as findStoreRoomActions from "../actions/storeIn/findStoreRoomAction";
import * as findRoomActions from "../actions/storeIn/findRoomAction";
import * as findSheetActions from "../actions/storeIn/findSheetAction";
import * as findStoreInInfoActions from "../actions/storeIn/findStoreInInfoAction";
import * as findStoreInDetailActions from "../actions/storeIn/findStoreInDetailAction";
import * as findStoreInTrackActions from "../actions/storeIn/findStoreInTrackAction";
import * as deleteStoreInInfoActions from "../actions/storeIn/deleteStoreInInfoAction";
import * as saveStoreInInfoActions from "../actions/storeIn/saveStoreInInfoAction";
import * as submitStoreInActions from "../actions/storeIn/submitStoreInAction";
import * as getStoreInOperateActions from "../actions/storeIn/getStoreInOperateAction";
import * as findOperatorActions from "../actions/storeIn/findOperatorsAction";
import * as setFirstListItemAction from "../actions/toDoListSelectAction";

// Actions - 出库
import * as findStoreOutActions from "../actions/storeOut/findStoreOutAction";
import * as findStoreOutDeviceActions from "../actions/storeOut/findStoreOutDeviceAction";
import * as findStoreOutRoomActions from "../actions/storeOut/findStoreOutRoomAction";
import * as findStoreOutInfoActions from "../actions/storeOut/findStoreOutInfoAction";
import * as findStoreOutDetailActions from "../actions/storeOut/findStoreOutDetailAction";
import * as findStoreOutTrackActions from "../actions/storeOut/findStoreOutTrackAction";
import * as deleteStoreOutInfoActions from "../actions/storeOut/deleteStoreOutInfoAction";
import * as saveStoreOutInfoActions from "../actions/storeOut/saveStoreOutInfoAction";
import * as submitStoreOutActions from "../actions/storeOut/submitStoreOutAction";
import * as getStoreOutOperateActions from "../actions/storeOut/getStoreOutOperateAction";
import * as findStoreOutOperatorActions from "../actions/storeOut/findStoreOutOperatorsAction";
import * as setFirstStoreOutListItemAction from "../actions/storeOut/selectedListItemAction";

// Actions - 库存管理
import * as deviceFindDeviceActions from "../actions/kfgl_device/findDeviceAction";
import * as deviceFindStoreRoomActions from "../actions/kfgl_device/findStoreRoomAction";
import * as deviceFindSheetActions from "../actions/kfgl_device/findSheetAction";
import * as deviceFindDeviceInfoActions from "../actions/kfgl_device/findDeviceInfoAction";

// Actions - 移库
import * as findStoreTransActions from "../actions/kfgl_storetrans/findStoreTransAction";
import * as findStoreTransInfoActions from "../actions/kfgl_storetrans/findStoreTransInfoAction";
import * as findStoreTransDetailActions from "../actions/kfgl_storetrans/findStoreTransDetailAction";
import * as findStoreTransRoomActions from "../actions/kfgl_storetrans/findRoomAction";
import * as findStoreTransStoreRoomActions from "../actions/kfgl_storetrans/findStoreRoomAction";
import * as findStoreTransDeviceActions from "../actions/kfgl_storetrans/findDeviceAction";
import * as findStoreTransSheetActions from "../actions/kfgl_storetrans/findSheetAction";
import * as findStoreTransTrackActions from "../actions/kfgl_storetrans/findStoreTransTrackAction";
import * as getStoreTransOperateActions from "../actions/kfgl_storetrans/getStoreTransOperateAction";
import * as findStoreTransOperatorsActions from "../actions/kfgl_storetrans/findOperatersAction";
import * as saveStoreTransInfoActions from "../actions/kfgl_storetrans/saveStoreTransInfoAction";
import * as submitStoreTransActions from "../actions/kfgl_storetrans/submitStoretransAction";

// Actions - 盘点
import * as findStoreCheckActions from "../actions/kfgl_storecheck/findStoreCheckAction";
import * as findStoreCheckRoomActions from "../actions/kfgl_storecheck/findRoomAction";
import * as findStoreCheckStoreRoomActions from "../actions/kfgl_storecheck/findStoreRoomAction";
import * as findStoreCheckSheetActions from "../actions/kfgl_storecheck/findSheetAction";
import * as findStoreCheckDeviceTypeActions from "../actions/kfgl_storecheck/findDeviceTypeAction";
import * as findStoreCheckInfoActions from "../actions/kfgl_storecheck/findStoreCheckInfoAction";
import * as findStoreCheckDetailActions from "../actions/kfgl_storecheck/findStoreCheckDetailAction";
import * as findStoreCheckDetailForType1Actions from "../actions/kfgl_storecheck/findStoreCheckDetailForType1Action";
import * as findStoreCheckTrackActions from "../actions/kfgl_storecheck/findStoreCheckTrackAction";
import * as saveStoreCheckInfoActions from "../actions/kfgl_storecheck/saveStoreCheckInfoAction";
import * as submitStoreCheckActions from "../actions/kfgl_storecheck/submitStorecheckAction";
import * as updateStoreCheckDetailActions from "../actions/kfgl_storecheck/updateStoreCheckDetailAction";
import * as getStoreCheckOperateActions from "../actions/kfgl_storecheck/getStoreCheckOperateAction";
import * as findStoreCheckOperatorsActions from "../actions/kfgl_storecheck/findOperatersAction";
import * as findStoreCheckSheetByCheckNoActions from "../actions/kfgl_storecheck/findSheetsByCheckNoAction";

// Actions - 标准化施工
import * as findToFollowUpListActions from "../actions/sggl/00_findToFollowUpListAction";
import * as findFollowUpHisListActions from "../actions/sggl/01_findFollowUpHisListAction";
import * as showConstructFormInfoActions from "../actions/sggl/02_showConstructFormInfoAction";
import * as toConstructPrepareActions from "../actions/sggl/03_toConstructPrepareAction";
import * as toCheckBeforeConstructActions from "../actions/sggl/04_toCheckBeforeConstructAction";
import * as toEndByExceptionActions from "../actions/sggl/05_endByExpectionAction";
import * as exitConstructActions from "../actions/sggl/06_exitConstructAction";
import * as constructPlanActions from "../actions/sggl/07_toConstructPlanAction";
import * as showStepInfoActions from "../actions/sggl/08_showStepInfoAction";
import * as checkAfterConstructActions from "../actions/sggl/09_toCheckAfterConstructAction";
import * as constructRecordActions from "../actions/sggl/10_ConstructRecordAction";
import * as showManualActions from "../actions/sggl/12_showManualAction";
import * as supervisionListActions from "../actions/sggl/15_ConstructSupervisionListAction";
import * as endManualActions from "../actions/sggl/16_endManualAction";
import * as confirmSupervisionActions from "../actions/sggl/17_confirmSupervisionAction";


// Combine APIs
// bind null -> 不改变 this 指向，在后续传入参数
import api from "../services/api";
import { MediaLibrary } from "expo";
const fetchLoginUserApi = fetchResource.bind(null, authorizeActions, api.fetchLoginUser);
const fetchFindFollowUpCountsApi = fetchResource.bind(null, findFollowUpCountsActions, api.fetchFollowUpCount);

// Combine APIs - 入库
const fetchFindStoreInApi = fetchResource.bind(null, findStoreInActions, api.findStoreIn);
const fetchFindDeviceTypeApi = fetchResource.bind(null, findDeviceTypeActions, api.findDeviceType);
const fetchFindDeviceApi = fetchResource.bind(null, findDeviceActions, api.findDevice);
const fetchFindStoreRoomApi = fetchResource.bind(null, findStoreRoomActions, api.findStoreRoom);
const fetchFindRoomApi = fetchResource.bind(null, findRoomActions, api.findRoom);
const fetchFindSheetApi = fetchResource.bind(null, findSheetActions, api.findSheet);
const fetchFindStoreInInfoApi = fetchResource.bind(null, findStoreInInfoActions, api.findStoreInInfo);
const fetchFindStoreInDetailApi = fetchResource.bind(null, findStoreInDetailActions, api.findStoreInDetail);
const fetchFindStoreInTrackApi = fetchResource.bind(null, findStoreInTrackActions, api.findStoreInTrack);
const deleteStoreInInfoApi = fetchResource.bind(null, deleteStoreInInfoActions, api.deleteStoreInInfo);
const saveStoreInInfoApi = fetchResource.bind(null, saveStoreInInfoActions, api.saveStoreInInfo);
const submitStoreInApi = fetchResource.bind(null, submitStoreInActions, api.submitStorein);
const getStoreInOperateApi = fetchResource.bind(null, getStoreInOperateActions, api.getStoreInOperate);
const findOperatorApi = fetchResource.bind(null, findOperatorActions, api.findOperators);

// Combine APIs - 出库
const fetchStoreOutApi = fetchResource.bind(null, findStoreOutActions, api.findStoreOut);
const fetchStoreOutDeviceApi = fetchResource.bind(null, findStoreOutDeviceActions, api.storeOutFindDevice);
const fetchStoreOutRoomApi = fetchResource.bind(null, findStoreOutRoomActions, api.storeOutFindStoreRoom);
const fetchStoreOutInfoApi = fetchResource.bind(null, findStoreOutInfoActions, api.findStoreOutInfo);
const fetchStoreOutDetailApi = fetchResource.bind(null, findStoreOutDetailActions, api.findStoreOutDetail);
const fetchStoreOutTrackApi = fetchResource.bind(null, findStoreOutTrackActions, api.findStoreOutTrack);
const deleteStoreOutInfoApi = fetchResource.bind(null, deleteStoreOutInfoActions, api.deleteStoreOutInfo);
const saveStoreOutInfoApi = fetchResource.bind(null, saveStoreOutInfoActions, api.saveStoreOutInfo);
const submitStoreOutApi = fetchResource.bind(null, submitStoreOutActions, api.submitStoreOut);
const getStoreOutOperateApi = fetchResource.bind(null, getStoreOutOperateActions, api.getStoreOutOperate);
const findStoreOutOperatorApi = fetchResource.bind(null, findStoreOutOperatorActions, api.findStoreOutOperators);

// Combine APIs - 库存管理
const fetchDeviceFindDeviceApi = fetchResource.bind(null, deviceFindDeviceActions, api.deviceFindDevice);
const fetchDeviceFindStoreRoomApi = fetchResource.bind(null, deviceFindStoreRoomActions, api.deviceFindStoreRoom);
const fetchDeviceFindSheetApi = fetchResource.bind(null, deviceFindSheetActions, api.deviceFindSheet);
const fetchDeviceFindDeviceInfoApi = fetchResource.bind(null, deviceFindDeviceInfoActions, api.deviceFindDeviceInfo);

// Combine APIs - 移库管理
const fetchStoreTransApi = fetchResource.bind(null, findStoreTransActions, api.findStoreTrans);
const fetchStoreTransInfoApi = fetchResource.bind(null, findStoreTransInfoActions, api.findStoreTransInfo);
const fetchStoreTransDetailApi = fetchResource.bind(null, findStoreTransDetailActions, api.findStoreTransDetail);
const fetchStoreTransRoomApi = fetchResource.bind(null, findStoreTransRoomActions, api.findStoreTransRoom);
const fetchStoreTransStoreRoomApi = fetchResource.bind(null, findStoreTransStoreRoomActions, api.findStoreTransStoreRoom);
const fetchStoreTransDeviceApi = fetchResource.bind(null, findStoreTransDeviceActions, api.findStoreTransDevice);
const fetchStoreTransSheetApi = fetchResource.bind(null, findStoreTransSheetActions, api.findStoreTransSheet);
const fetchStoreTransTrackApi = fetchResource.bind(null, findStoreTransTrackActions, api.findStoreTransTrack);
const fetchStoreTransOperateApi = fetchResource.bind(null, getStoreTransOperateActions, api.getStoreTransOperate);
const fetchStoreTransOperatorsApi = fetchResource.bind(null, findStoreTransOperatorsActions, api.storeTransFindOperaters);
const saveStoreTransInfoApi = fetchResource.bind(null, saveStoreTransInfoActions, api.saveStoreTransInfo);
const submitStoreTransApi = fetchResource.bind(null, submitStoreTransActions, api.submitStoreTrans);

// Combine APIs - 盘点管理
const fetchStoreCheckApi = fetchResource.bind(null, findStoreCheckActions, api.findStoreCheck);
const fetchStoreCheckRoomApi = fetchResource.bind(null, findStoreCheckRoomActions, api.storeCheckFindRoom);
const fetchStoreCheckStoreRoomApi = fetchResource.bind(null, findStoreCheckStoreRoomActions, api.storeCheckFindStoreRoom);
const fetchStoreCheckSheetApi = fetchResource.bind(null, findStoreCheckSheetActions, api.storeCheckFindSheet);
const fetchStoreCheckDeviceTypeApi = fetchResource.bind(null, findStoreCheckDeviceTypeActions, api.storeCheckFindDeviceType);
const fetchStoreCheckInfoApi = fetchResource.bind(null, findStoreCheckInfoActions, api.findStoreCheckInfo);
const fetchStoreCheckDetailApi = fetchResource.bind(null, findStoreCheckDetailActions, api.findStoreCheckDetail);
const fetchStoreCheckDetailForType1Api = fetchResource.bind(null, findStoreCheckDetailForType1Actions, api.findStoreCheckDetailForType1);
const fetchStoreCheckTrackApi = fetchResource.bind(null, findStoreCheckTrackActions, api.findStoreCheckTrack);
const saveStoreCheckInfoApi = fetchResource.bind(null, saveStoreCheckInfoActions, api.saveStoreCheckInfo);
const submitStoreCheckApi = fetchResource.bind(null, submitStoreCheckActions, api.submitStorecheck);
const updateStoreCheckDetailApi = fetchResource.bind(null, updateStoreCheckDetailActions, api.updateStoreCheckDetail);
const getStoreCheckOperateApi = fetchResource.bind(null, getStoreCheckOperateActions, api.getStoreCheckOperate);
const findStoreCheckOperatorsApi = fetchResource.bind(null, findStoreCheckOperatorsActions, api.storeCheckFindOperaters);
const findStoreCheckSheetByCheckNoApi = fetchResource.bind(null, findStoreCheckSheetByCheckNoActions, api.findSheetsByCheckNo);

// Combine APIs - 标准化施工
const fetchToFollowUpListApi = fetchResource.bind(null, findToFollowUpListActions, api.findToFollowUpList);
const fetchFollowUpHisListApi = fetchResource.bind(null, findFollowUpHisListActions, api.findFollowUpHisList);
const showConstructFormInfoApi = fetchResource.bind(null, showConstructFormInfoActions, api.showConstructFormInfo);
const toConstructPrepareApi = fetchResource.bind(null, toConstructPrepareActions, api.toConstructPrepare);
const toCheckBeforeConstructApi = fetchResource.bind(null, toCheckBeforeConstructActions, api.toCheckBeforeConstructApi);
const toEndByExceptionApi = fetchResource.bind(null, toEndByExceptionActions, api.toEndByException);
const exitConstructApi = fetchResource.bind(null, exitConstructActions, api.exitConstruct);
const constructPlanApi = fetchResource.bind(null, constructPlanActions, api.constructPlanApi);
const showStepInfoApi = fetchResource.bind(null, showStepInfoActions, api.showStepInfoApi);
const toCheckAfterConstructApi = fetchResource.bind(null, checkAfterConstructActions, api.toCheckAfterConstructApi);
const constructSupervisionRecordApi = fetchResource.bind(null, constructRecordActions, api.constructSupervisionRecordApi);
const showManualApi = fetchResource.bind(null, showManualActions, api.showManualApi);
const endManualApi = fetchResource.bind(null, endManualActions, api.endManualApi);
const superVisionListApi = fetchResource.bind(null, supervisionListActions, api.findSupervisionListApi);
const confirmSupervisionApi = fetchResource.bind(null, confirmSupervisionActions, api.confirmSupervisionApi);


function* watchResetSheetForm() {
    while (true) {
        yield take(resetFormActions.RESET_SHEET_FORM);
        yield put(reset(FINDSHEETFORM));
    }
}

function* watchLogin() {
    // Listening login request
    while (true) {
        const { payload } = yield take(authorizeActions.REQUEST);
        yield fork(formLoginSaga, payload);
    }
}

function* formLoginSaga(payload) {
    yield put( startSubmit(LOGINFORM));
    try {
        yield fork(fetchLoginUserApi, payload);
        yield put(stopSubmit(LOGINFORM));
        yield put(reset(LOGINFORM));
    } catch (e) {
        console.log("Into the error!");
        yield put(authorizeActions.failure(e));
        yield put( stopSubmit(LOGINFORM, e ));
    }
}

// 曾登录用户
function* watchRetrieveUser() {
    while (true) {
        yield take(authorizeActions.RETRIEVE);
        const authorization = yield call(getUserFromStorage);

        if (authorization) {
            const user = JSON.parse(authorization);
            yield put(authorizeActions.setAuthorization(user));
        }
    }
}

function getUserFromStorage() {
    return new Promise( resolve => AsyncStorage.getItem("authorization").then(resolve));
}

// 待办统计
function* watchFindFollowUpCounts() {
    while (true) {
        const { payload } = yield take(findFollowUpCountsActions.REQUEST);
        yield fork(fetchFollowUpCounts, payload);
    }
}

function* fetchFollowUpCounts(payload) {
    yield fork(fetchFindFollowUpCountsApi, payload);
}

// Find Store In sagas
function* watchFindStoreIn() {
    while (true) {
        const { payload } = yield take(findStoreInActions.REQUEST);
        yield fork(fetchFindStoreIn, payload);
    }
}

function* fetchFindStoreIn(payload) {
    yield call(fetchFindStoreInApi, payload);
    yield call(setFirstItemToList);
}

// 为待办列表设初值
function* setFirstItemToList() {
    const state = yield select( (state) => state.findStoreIn );
    yield put(setFirstListItemAction.selectListItem(_.first(state.list)));
}

// Find Device Type sagas
function* watchFindDeviceType() {
    while (true) {
        const { payload } = yield take(findDeviceTypeActions.REQUEST);
        yield fork(fetchFindDeviceType, payload);
    }
}

function* fetchFindDeviceType(payload) {
    yield fork(fetchFindDeviceTypeApi, payload);
}

// Find Device sagas
// 用于施工入库单，添加备件明细信息时，从库存中添加显示的记录。
function* watchFindDevice() {
    while (true) {
        const { payload } = yield take(findDeviceActions.REQUEST);
        yield fork(fetchFindDevice, payload);
    }
}

function* fetchFindDevice(payload) {
    yield fork(fetchFindDeviceApi, payload);
}

// Find Store Room sagas
function* watchFindStoreRoom() {
    while (true) {
        const { payload } = yield take(findStoreRoomActions.REQUEST);
        yield fork(fetchFindStoreRoom, payload);
    }
}

function* fetchFindStoreRoom(payload) {
    yield fork(fetchFindStoreRoomApi, payload);
}

// Find Room sagas
// 用于填写备件明细。从可选择的库房列表，双击列表的一项把库房信息添加到明细记录中。
function* watchFindRoom() {
    while (true) {
        const { payload } = yield take(findRoomActions.REQUEST);
        yield fork(fetchFindRoom, payload);
    }
}

function* fetchFindRoom(payload) {
    yield fork(fetchFindRoomApi, payload);
}

// Find Sheet sagas
// 用于填写备件明细。从可选择的库房列表，双击列表的一项把库房信息添加到明细记录中。
function* watchFindSheet() {
    while (true) {
        const { payload } = yield take(findSheetActions.REQUEST);
        yield fork(fetchFindSheet, payload);
    }
}

function* fetchFindSheet(payload) {
    yield fork(fetchFindSheetApi, payload);
    // 如果请求当中包含指定货架，为指定货架表单赋初值
    if (!_.isEmpty(payload.storeRoomId)) {
        yield put(change(FINDSHEETFORM, "storeRoomId", payload.storeRoomId));
    }
}


// Find Store In Info sagas
// 查看/编辑修改入库单，显示各个详细信息
function* watchFindStoreInInfo() {
    while (true) {
        const { payload } = yield take(findStoreInInfoActions.REQUEST);
        yield fork(fetchFindStoreInInfo, payload);
    }
}

function* fetchFindStoreInInfo(payload) {
    yield fork(fetchFindStoreInInfoApi, payload);
}

// Find Store In Detail sagas
// 用于修改入库单时显示入库备件明细列表
function* watchFindStoreInDetail() {
    while (true) {
        const { payload } = yield take(findStoreInDetailActions.REQUEST);
        yield fork(fetchFindStoreInDetail, payload);
    }
}

function* fetchFindStoreInDetail(payload) {
    yield fork(fetchFindStoreInDetailApi, payload);
}

// Find Store In Track sagas
// 在入库单详细信息中，显示流程流转记录列表
function* watchFindStoreInTrack() {
    while (true) {
        const { payload } = yield take(findStoreInTrackActions.REQUEST);
        yield fork(fetchFindStoreInTrack, payload);
    }
}

function* fetchFindStoreInTrack(payload) {
    yield fork(fetchFindStoreInTrackApi, payload);
}

// Delete Store In Info sagas
// 当入库单状态为“申请中”，而当前登录用户是入库申请人，或库房管理员时，可删除入库单信息，并包括所有与该入库单关联的信息。
function* watchDeleteStoreInInfo() {
    while (true) {
        const { payload } = yield take(deleteStoreInInfoActions.REQUEST);
        yield fork(deleteStoreInInfo, payload);
    }
}

function* deleteStoreInInfo(payload) {
    yield call(deleteStoreInInfoApi, payload);
    yield call(NavigationService.navigate, "NewStoreIn");
    yield call(updateStoreInList);
}

// Save Store In Info sagas
// 当入库状态为申请中或复核中时，可以保存入库单的信息。
function* watchSaveStoreInInfo() {
    while (true) {
        const { payload } = yield take(saveStoreInInfoActions.REQUEST);
        yield fork(saveStoreInInfo, payload);
    }
}

function* saveStoreInInfo(payload) {
    yield put( startSubmit(DEALWITHSTOREINFORM) );
    try {
        yield call(saveStoreInInfoApi, payload);
        yield put(stopSubmit(DEALWITHSTOREINFORM));
        yield call(NavigationService.navigate, "NewStoreIn");
        yield call(updateStoreInList);
    } catch (e) {
        console.log("Into Saga Save error");
        yield put( saveStoreInInfoActions.failure(e));
        yield put( stopSubmit(DEALWITHSTOREINFORM, e) );
    }
}

// Submit Store In sagas
// 用户提交入库单时，根据提交操作类型和入库单当前状态来使入库单变为下一个环节状态。
function* watchSubmitStoreIn() {
    while (true) {
        const { payload } = yield take(submitStoreInActions.REQUEST);
        if (_.includes(["01", "03"], payload.status)) {
            const { payload: response } = yield take(saveStoreInInfoActions.REQUEST_COMPLETE);
            const { inNo } = response;
            if (!_.isEmpty(inNo)) {
                payload.inNo = inNo;
            }
        }

        yield call(submitStoreIn, payload);
    }
}

function* submitStoreIn(payload) {
    yield call(submitStoreInApi, payload);
    yield call(NavigationService.navigate, "NewStoreIn");
    yield call(updateStoreInList);
}

function* updateStoreInList() {
    const { userName } = yield select( (state) => state.user.authorization );
    yield fork(fetchFindStoreIn, { user: userName, operator: userName });
}


// Get Store In Operation sagas
// 用户提交入库单时，根据提交操作类型和入库单当前状态来使入库单变为下一个环节状态。
function* watchGetStoreInOperation() {
    while (true) {
        const { payload } = yield take(getStoreInOperateActions.REQUEST);
        yield fork(getStoreInOperate, payload);
    }
}

function* getStoreInOperate(payload) {
    yield call(getStoreInOperateApi, payload);
    yield call(updateOperatorsList);
}

function* updateOperatorsList() {
    const selectedOperation = yield select( (state) => _.first(state.getStoreInOperate.list) );
    const { inType, status, inNo } = yield select( (state) => state.testSelectedToDoList );
    const { userName } = yield select( (state) => state.user.authorization );
    // set default value
    const operateType = selectedOperation && selectedOperation.operateType || "";
    console.log("currentOpType", operateType);
    yield put(change(DEALWITHSTOREINFORM, "opType", operateType));
    yield call(findOperator, {
        user: userName,
        inNo: inNo,
        inType: inType,
        opType: operateType,
        status: status
    });
}

// Find Operator sagas
// 根据入库单状态和操作类型来获取可提交下一步的处理人列表
function* watchFindOperator() {
    while (true) {
        const { payload } = yield take(findOperatorActions.REQUEST);
        yield fork(findOperator, payload);
    }
}

function* findOperator(payload) {
    yield call(findOperatorApi, payload);
    yield put(change(DEALWITHSTOREINFORM, "opType", payload.opType));
    yield call(setDefaultOperators);
}

// 设置默认处理人
function* setDefaultOperators() {
    const selectedUser = yield select( (state) => _.first(state.nextOperator.list) );
    yield put(change(DEALWITHSTOREINFORM, "nextOperator", selectedUser && selectedUser.nextOperator || ""));
}

// 出库二维码处理逻辑
function* watchQRStoreInDeviceInfo() {
    while (true) {
        const { payload } = yield take(findDeviceActions.QR_STORE_IN_DEVICE_INFO);
        yield call(NavigationService.back);
        console.log("QR logger - currentRows, summaryNo: ", payload);
        yield call(handleQRStoreInDeviceInfo, payload);
    }
}


function* handleQRStoreInDeviceInfo(payload) {
    const { userName } = yield select( (state) => state.user.authorization );
    const { currentRowOfItems } = payload;

    yield call(fetchFindDevice, {
        user: userName,
        summaryNo: payload.summaryNo
    });

    const response = yield select( (state) => state.findDevice.list );
    const targetItem = _.first(response);
    console.log("QR logger - QR Fetched Item: ", targetItem);

    const currentItems = yield select( (state) => formValueSelector(DEALWITHSTOREINFORM)(state, "storeInItems"));
    console.log("QR logger - Form Items List: ", currentItems);

    const { summaryNo, summaryNum, roomName, sheetName } = targetItem;
    if (_.find(currentItems, function(o) { return _.isEqual(o.summaryNo, summaryNo); })) {
        Alert.alert("填写提示", "您已添加过该备件");
        return;
    } else {
        const alertButtons = [
            { text: "取消", actions: []},
            { text: "确认", call: { method: insertStoreInFormData, args: { targetItem: targetItem, currentRowOfItems: currentRowOfItems }}}
        ];
        const alertButtonsToSelect = [
            { text: "取消", actions: []},
            { text: "确认并为好件", actions: [{ call: () => { targetItem.usability = "好件"; }}, { call: { method: insertStoreInFormData, args: { targetItem: targetItem, currentRowOfItems: currentRowOfItems } } }] },
            { text: "确认并为坏件", actions: [{ call: () => { targetItem.usability = "坏件"; }}, { call: { method: insertStoreInFormData, args: { targetItem: targetItem, currentRowOfItems: currentRowOfItems } } }] }
        ];
        if (!_.isEqual(targetItem.summaryNum, "0")) {
            yield call(alert, "库存备件选择确认", `汇总号：${summaryNo},\n设备名：${summaryNum},\n库房：${roomName},\n货架名：${sheetName}`, alertButtons);
        } else {
            yield call(alert, "库存备件选择确认", `汇总号：${summaryNo},\n设备名：${summaryNum},\n库房：${roomName},\n货架名：${sheetName}`, alertButtonsToSelect);
        }
    }
}

function* insertStoreInFormData({ targetItem, currentRowOfItems }) {
    const {
        belongUnit,
        deviceName,
        deviceSN,
        deviceTypeId,
        storeRoomId, roomName,
        sheetId, sheetName,
        summaryNo,
        summaryNum,
        unitName,
        usability,
        validMonths
    } = targetItem;
    console.log("Inserting data", targetItem, currentRowOfItems);
    yield put(arrayPush(DEALWITHSTOREINFORM, "storeInItems", {
        summaryNo: summaryNo,
        deviceName: deviceName,
        summaryNum: "1",
        unitName: unitName, // 单位
        validMonths: validMonths,
        usability: usability,
        roomName: roomName,
        sheetName: sheetName,
        deviceSN: _.isNull(deviceSN) ? "" : deviceSN,
        belongUnit: belongUnit,
    }));
    yield put(change(DEALWITHSTOREINFORM, `storeInItems.${currentRowOfItems}.oldSummaryNum`, summaryNum + ""));
    yield put(change(DEALWITHSTOREINFORM, `storeInItems.${currentRowOfItems}.deviceTypeId`, deviceTypeId + ""));
    yield put(change(DEALWITHSTOREINFORM, `storeInItems.${currentRowOfItems}.sheetId`, sheetId + ""));
    yield put(change(DEALWITHSTOREINFORM, `storeInItems.${currentRowOfItems}.storeRoomId`, storeRoomId + ""));
    yield put(change(DEALWITHSTOREINFORM, `storeInItems.${currentRowOfItems}.sourceType`, "2"));
}

// 出库
function* watchFindStoreOut() {
    while (true) {
        const { payload } = yield take(findStoreOutActions.REQUEST);
        yield fork(fetchFindStoreOut, payload);
    }
}

function* fetchFindStoreOut(payload) {
    yield call(fetchStoreOutApi, payload);
    yield call(setFirstItemToStoreOutList);
}

// 为待办列表设初值
function* setFirstItemToStoreOutList() {
    const state = yield select( (state) => state.findStoreOut );
    yield put(setFirstListItemAction.selectListItem(_.first(state.list)));
}

function* watchFindStoreOutDevice() {
    while (true) {
        const { payload } = yield take(findStoreOutDeviceActions.REQUEST);
        yield fork(fetchFindStoreOutDevice, payload);
    }
}

function* fetchFindStoreOutDevice(payload) {
    yield call(fetchStoreOutDeviceApi, payload);
}

function* watchFindStoreOutRoom() {
    while (true) {
        const { payload } = yield take(findStoreOutRoomActions.REQUEST);
        yield fork(fetchStoreOutRoom, payload);
    }
}

function* fetchStoreOutRoom(payload) {
    yield fork(fetchStoreOutRoomApi, payload);
}

function* watchFindStoreOutInfo() {
    while (true) {
        const { payload } = yield take(findStoreOutInfoActions.REQUEST);
        yield fork(fetchStoreOutInfo, payload);
    }
}

function* fetchStoreOutInfo(payload) {
    yield fork(fetchStoreOutInfoApi, payload);
}

function* watchFetchStoreOutDetail() {
    while (true) {
        const { payload } = yield take(findStoreOutDetailActions.REQUEST);
        yield fork(fetchStoreOutDetail, payload);
    }
}

function* fetchStoreOutDetail(payload) {
    yield fork(fetchStoreOutDetailApi, payload);
}

function* watchStoreOutTrack() {
    while (true) {
        const { payload } = yield take(findStoreOutTrackActions.REQUEST);
        yield fork(fetchStoreOutTrack, payload);
    }
}

function* fetchStoreOutTrack(payload) {
    yield fork(fetchStoreOutTrackApi, payload);
}

function* watchDeleteStoreOutInfo() {
    while (true) {
        const { payload } = yield take(deleteStoreOutInfoActions.REQUEST);
        yield fork(deleteStoreOutInfo, payload);
    }
}

function* deleteStoreOutInfo(payload) {
    yield fork(deleteStoreOutInfoApi, payload);
}

function* watchSaveStoreOutInfo() {
    while (true) {
        const { payload } = yield take(saveStoreOutInfoActions.REQUEST);
        yield fork(saveStoreOutInfo, payload);
    }
}

function* saveStoreOutInfo(payload) {
    yield put( startSubmit(DEALWITHSTOREOUTFORM) );
    try {
        yield call(saveStoreOutInfoApi, payload);
        yield put(stopSubmit(DEALWITHSTOREOUTFORM));
        yield call(NavigationService.navigate, "StoreOut");
        yield call(updateStoreOutList);
    } catch (e) {
        yield put(saveStoreOutInfoActions.failure(e));
        yield put(stopSubmit(DEALWITHSTOREOUTFORM, e));
    }
}

function* updateStoreOutList() {
    const { userName } = yield select( (state) => state.user.authorization );
    yield fork(fetchFindStoreOut, { user: userName, operator: userName });
}

function* watchSubmitStoreOut() {
    while (true) {
        const { payload } = yield take(submitStoreOutActions.REQUEST);
        if (_.includes(["01", "03"], payload.status)) {
            const { payload: response } = yield take(saveStoreOutInfoActions.REQUEST_COMPLETE);
            const { outNo } = response;
            if (!_.isEmpty(outNo)) {
                payload.outNo = outNo;
            }
        }

        yield call(submitStoreOut, payload);
    }
}

function* submitStoreOut(payload) {
    yield call(submitStoreOutApi, payload);
    yield call(NavigationService.navigate, "StoreOut");
    yield call(updateStoreOutList);
}

function* watchGetStoreOutOperate() {
    while (true) {
        const { payload } = yield take(getStoreOutOperateActions.REQUEST);
        yield fork(getStoreOutOperate, payload);
    }
}

function* getStoreOutOperate(payload) {
    yield call(getStoreOutOperateApi, payload);
    yield call(updateStoreOutOperatorsList);
}

function* updateStoreOutOperatorsList() {
    const selectedOperation = yield select( (state) => _.first(state.getStoreOutOperate.list) );
    const { outType, status, outNo } = yield select( (state) => state.testSelectedToDoList );
    const { userName } = yield select( (state) => state.user.authorization );
    const operateType = selectedOperation && selectedOperation.operateType || "";
    console.log("currentOpType", operateType);
    // set default value, add one more below
    yield put(change(DEALWITHSTOREOUTFORM, "opType", operateType));
    yield call(findStoreOutOperator, {
        user: userName,
        outNo: outNo,
        outType: outType,
        opType: operateType,
        status: status
    });
}

function* watchFindStoreOutOperator() {
    while (true) {
        const { payload } = yield take(findStoreOutOperatorActions.REQUEST);
        yield fork(findStoreOutOperator, payload);
    }
}

function* findStoreOutOperator(payload) {
    yield call(findStoreOutOperatorApi, payload);
    yield put(change(DEALWITHSTOREOUTFORM, "opType", payload.opType));
    yield call(setDefaultStoreOutOperators);
}

// 设置出库单默认处理人。因为选项默认未选择，需要进行手动设置初始项。
function* setDefaultStoreOutOperators() {
    const selectedUser = yield select( (state) => _.first(state.findStoreOutOperators.list) );
    console.log("selectedUser", selectedUser);
    yield put(change(DEALWITHSTOREOUTFORM, "nextOperator", selectedUser && selectedUser.nextOperator || ""));
}

function* watchQRStoreOutDeviceInfo() {
    while (true) {
        const { payload } = yield take(findStoreOutDeviceActions.QR_STORE_OUT_DEVICE_INFO);
        yield call(NavigationService.back);
        console.log("QR logger - currentRows, summaryNo: ", payload);
        yield call(handleQRStoreOutDeviceInfo, payload);
    }
}

// 出库二维码处理逻辑
function* handleQRStoreOutDeviceInfo(payload) {
    const { userName } = yield select( (state) => state.user.authorization );
    const { currentRowOfItems } = payload;

    yield call(fetchFindStoreOutDevice, {
        user: userName,
        summaryNo: payload.summaryNo
    });

    const response = yield select( (state) => state.findStoreOutDevice.list );
    const targetItem = _.first(response);
    console.log("QR logger - QR Fetched Item: ", targetItem);

    const currentItems = yield select( (state) => formValueSelector(DEALWITHSTOREOUTFORM)(state, "storeOutItems"));
    console.log("QR logger - Form Items List: ", currentItems);

    const { summaryNo, summaryNum, roomName, sheetName } = targetItem;
    if (_.find(currentItems, function(o) { return _.isEqual(o.summaryNo, summaryNo); })) {
        Alert.alert("填写提示", "您已添加过该备件");
        return;
    } else {
        const alertButtons = [
            { text: "取消", actions: []},
            { text: "确认", call: { method: insertStoreOutFormData, args: { targetItem: targetItem, currentRowOfItems: currentRowOfItems }}}
        ];
        const alertButtonsToSelect = [
            { text: "取消", actions: []},
            { text: "确认并为好件", actions: [{ call: () => { targetItem.usability = "好件"; }}, { call: { method: insertStoreOutFormData, args: { targetItem: targetItem, currentRowOfItems: currentRowOfItems } } }] },
            { text: "确认并为坏件", actions: [{ call: () => { targetItem.usability = "坏件"; }}, { call: { method: insertStoreOutFormData, args: { targetItem: targetItem, currentRowOfItems: currentRowOfItems } } }] }
        ];
        if (!_.isEqual(targetItem.summaryNum, "0")) {
            yield call(alert, "库存备件选择确认", `汇总号：${summaryNo},\n设备名：${summaryNum},\n库房：${roomName},\n货架名：${sheetName}`, alertButtons);
        } else {
            yield call(alert, "库存备件选择确认", `汇总号：${summaryNo},\n设备名：${summaryNum},\n库房：${roomName},\n货架名：${sheetName}`, alertButtonsToSelect);
        }
    }
}

function* insertStoreOutFormData({ targetItem, currentRowOfItems }) {
    const {
        belongUnit,
        deviceName,
        deviceSN,
        deviceTypeId,
        storeRoomId, roomName,
        sheetId, sheetName,
        summaryNo,
        summaryNum,
        unitName,
        usability,
        validMonths
    } = targetItem;
    console.log("Inserting data", targetItem, currentRowOfItems);
    yield put(arrayPush(DEALWITHSTOREOUTFORM, "storeOutItems", {
        summaryNo: summaryNo,
        deviceName: deviceName,
        summaryNum: "1",
        unitName: unitName, // 单位
        oldSummaryNum: summaryNum,
        usability: usability,
        roomName: roomName,
        sheetName: sheetName,
        deviceSN: _.isNull(deviceSN) ? "" : deviceSN,
        belongUnit: belongUnit,
    }));
    yield put(change(DEALWITHSTOREOUTFORM, `storeOutItems.${currentRowOfItems}.deviceTypeId`, deviceTypeId + ""));
    yield put(change(DEALWITHSTOREOUTFORM, `storeOutItems.${currentRowOfItems}.validMonths`, validMonths + ""));
    yield put(change(DEALWITHSTOREOUTFORM, `storeOutItems.${currentRowOfItems}.sheetId`, sheetId + ""));
    yield put(change(DEALWITHSTOREOUTFORM, `storeOutItems.${currentRowOfItems}.storeRoomId`, storeRoomId + ""));
    yield put(change(DEALWITHSTOREOUTFORM, `storeOutItems.${currentRowOfItems}.sourceType`, "2"));
}

// 库存管理
function* watchDeviceFindDevice() {
    while (true) {
        const { payload } = yield take(deviceFindDeviceActions.REQUEST);
        yield fork(deviceFindDevice, payload);
    }
}

function* deviceFindDevice(payload) {
    yield call(fetchDeviceFindDeviceApi, payload);
    yield call(setFirstItemToDeviceList);
}

function* setFirstItemToDeviceList() {
    const state = yield select( (state) => state.deviceFindDevice );
    yield put(setFirstListItemAction.selectListItem(_.first(state.list)));
}

function* watchDeviceFindStoreRoom() {
    while (true) {
        const { payload } = yield take(deviceFindDeviceActions.REQUEST);
        yield fork(deviceFindStoreRoom, payload);
    }
}

function* deviceFindStoreRoom(payload) {
    yield fork(fetchDeviceFindStoreRoomApi, payload);
}

function* watchDeviceFindSheet() {
    while (true) {
        const { payload } = yield take(deviceFindSheetActions.REQUEST);
        yield fork(deviceFindSheet, payload);
    }
}

function* deviceFindSheet(payload) {
    yield fork(fetchDeviceFindSheetApi, payload);
}

function* watchDeviceFindDeviceInfo() {
    while (true) {
        const { payload } = yield take(deviceFindDeviceInfoActions.REQUEST);
        yield fork(deviceFindDeviceInfo, payload);
    }
}

function* deviceFindDeviceInfo(payload) {
    yield fork(fetchDeviceFindDeviceInfoApi, payload);
}

function* watchQRDeviceInfo() {
    while (true) {
        const { payload } = yield take(deviceFindDeviceInfoActions.QR_DEVICE_DETAIL);
        yield fork(handleQRDeviceInfo, payload);
    }
}

function* handleQRDeviceInfo(payload) {
    yield call(NavigationService.navigate, DEAL_WITH_DEVICE_SCREEN, {
        currentSummaryNo: payload,
    });
}

// 移库
function* watchFindStoreTrans() {
    while (true) {
        const { payload } = yield take(findStoreTransActions.REQUEST);
        yield fork(findStoreTrans, payload);
    }
}

function* findStoreTrans(payload) {
    yield call(fetchStoreTransApi, payload);
    yield call(setFirstItemToTransList);
}

function* setFirstItemToTransList() {
    const state = yield select( (state) => state.findStoreTrans );
    yield put(setFirstListItemAction.selectListItem(_.first(state.list)));
}

function* watchFindStoreTransInfo() {
    while (true) {
        const { payload } = yield take(findStoreTransInfoActions.REQUEST);
        yield fork(findStoreTransInfo, payload);
    }
}

function* findStoreTransInfo(payload) {
    yield fork(fetchStoreTransInfoApi, payload);
}

function* watchFindStoreTransDetail() {
    while (true) {
        const { payload } = yield take(findStoreTransDetailActions.REQUEST);
        yield fork(findStoreTransDetail, payload);
    }
}

function* findStoreTransDetail(payload) {
    yield fork(fetchStoreTransDetailApi, payload);
}

function* watchFindStoreTransRoom() {
    while (true) {
        const { payload } = yield take(findStoreTransRoomActions.REQUEST);
        yield fork(findStoreTransRoom, payload);
    }
}

function* findStoreTransRoom(payload) {
    yield fork(fetchStoreTransRoomApi, payload);
}

function* watchFindStoreTransStoreRoom() {
    while (true) {
        const { payload } = yield take(findStoreTransStoreRoomActions.REQUEST);
        yield fork(findStoreTransStoreRoom, payload);
    }
}

function* findStoreTransStoreRoom(payload) {
    yield fork(fetchStoreTransStoreRoomApi, payload);
}

function* watchFindStoreTransDevice() {
    while (true) {
        const { payload } = yield take(findStoreTransDeviceActions.REQUEST);
        yield fork(findStoreTransDevice, payload);
    }
}

function* findStoreTransDevice(payload) {
    yield call(fetchStoreTransDeviceApi, payload);
}

function* watchFindStoreTransSheet() {
    while (true) {
        const { payload } = yield take(findStoreTransSheetActions.REQUEST);
        yield fork(findStoreTransSheet, payload);
    }
}

function* findStoreTransSheet(payload) {
    yield fork(fetchStoreTransSheetApi, payload);
    // 如果请求当中包含指定货架，为指定货架表单赋初值
    if (!_.isEmpty(payload.storeRoomId)) {
        yield put(change(FINDSHEETFORM, "storeRoomId", payload.storeRoomId));
    }
}

function* watchFindStoreTransTrack() {
    while (true) {
        const { payload } = yield take(findStoreTransTrackActions.REQUEST);
        yield fork(findStoreTransTrack, payload);
    }
}

function* findStoreTransTrack(payload) {
    yield fork(fetchStoreTransTrackApi, payload);
}

function* watchFindStoreTransOperate() {
    while (true) {
        const { payload } = yield take(getStoreTransOperateActions.REQUEST);
        yield fork(findStoreTransOperate, payload);
    }
}

function* findStoreTransOperate(payload) {
    yield call(fetchStoreTransOperateApi, payload);
    yield call(updateStoreTransOperatorsList);
}

function* updateStoreTransOperatorsList() {
    const selectedOperation = yield select( (state) => _.first(state.getStoreTransOperate.list) );
    const { status, transNo } = yield select( (state) => state.testSelectedToDoList );
    const { userName } = yield select( (state) => state.user.authorization );
    // set default value
    const operateType = selectedOperation && selectedOperation.operateType || "";
    console.log("currentOpType", operateType);
    yield put(change(DEALWITHSTORETRANSFORM, "opType", operateType));
    yield call(findStoreTransOperators, {
        user: userName,
        status: status,
        opType: operateType,
        transNo: transNo
    });
}

function* watchFindStoreTransOperators() {
    while (true) {
        const { payload } = yield take(findStoreTransOperatorsActions.REQUEST);
        yield fork(findStoreTransOperators, payload);
    }
}

function* findStoreTransOperators(payload) {
    yield call(fetchStoreTransOperatorsApi, payload);
    yield put(change(DEALWITHSTORETRANSFORM, "opType", payload.opType));
    yield call(setDefaultStoreTransOperators);
}

// 设置移库单默认处理人
function* setDefaultStoreTransOperators() {
    const selectedUser = yield select( (state) => _.first(state.findStoreTransOperaters.list) );
    yield put(change(DEALWITHSTORETRANSFORM, "nextOperator", selectedUser && selectedUser.nextOperator || ""));
}

function* watchSaveStoreTransInfo() {
    while (true) {
        const { payload } = yield take(saveStoreTransInfoActions.REQUEST);
        yield fork(toSaveStoreTransInfo, payload);
    }
}

function* toSaveStoreTransInfo(payload) {
    yield put(startSubmit(DEALWITHSTORETRANSFORM));
    try {
        yield call(saveStoreTransInfoApi, payload);
        yield put(stopSubmit(DEALWITHSTORETRANSFORM));
        yield call(NavigationService.navigate, "kfgl_storetrans");
        yield call(updateStoreTransList);
    } catch (e) {
        console.log("Into Store Trans Saga Save error");
        yield put( saveStoreTransInfoActions.failure(e));
        yield put( stopSubmit(DEALWITHSTORETRANSFORM, e) );
    }
}

function* watchSubmitStoreTrans() {
    while (true) {
        const { payload } = yield take(submitStoreTransActions.REQUEST);
        if (_.includes(["01"], payload.status)) {
            const { payload: response } = yield take(saveStoreTransInfoActions.REQUEST_COMPLETE);
            const { transNo } = response;
            if (!_.isEmpty(transNo)) {
                payload.transNo = transNo;
            }
        }

        yield call(toSubmitStoreTransInfo, payload);
    }
}

function* toSubmitStoreTransInfo(payload) {
    yield call(submitStoreTransApi, payload);
    yield call(NavigationService.navigate, "kfgl_storetrans");
    yield call(updateStoreTransList);
}

function* updateStoreTransList() {
    const { userName } = yield select( (state) => state.user.authorization );
    yield fork(findStoreTrans, { user: userName, operator: userName });
}

function* watchQRStoreTransDeviceInfo() {
    while (true) {
        const { payload } = yield take(findStoreTransDeviceActions.QR_STORE_TRANS_DEVICE_INFO);
        yield call(NavigationService.back);
        console.log("QR logger - currentRows, summaryNo: ", payload);
        yield call(handleQRStoreTransDeviceInfo, payload);
    }
}

function* handleQRStoreTransDeviceInfo(payload) {
    const { userName } = yield select( (state) => state.user.authorization );
    const { currentRowOfItems } = payload;
    yield call(findStoreTransDevice, {
        user: userName,
        summaryNo: payload.summaryNo
    });
    const response = yield select( (state) => state.findStoreTransDevice.list );
    console.log("QR logger - QR Fetched Item: ", _.first(response));
    const currentItems = yield select( (state) => formValueSelector(DEALWITHSTORETRANSFORM)(state, "storeTransItems"));
    console.log("QR logger - Form Items List: ", currentItems);
    if (_.find(currentItems, function(o) { return _.isEqual(o.summaryNo, _.first(response).summaryNo); })) {
        Alert.alert("填写提示", "您已添加过该备件");
        return;
    }
    yield call(insertStoreTransFormData, _.first(response), currentRowOfItems);
}

function* insertStoreTransFormData(response, currentRowOfItems) {
    const {
        belongUnit,
        brandName,
        deviceName,
        deviceSN,
        deviceTypeId,
        storeRoomId, roomName,
        sheetId, sheetName,
        summaryNo,
        summaryNum,
        unitName,
        usability,
        validMonths
    } = response;
    console.log("Inserting data");
    yield put(arrayPush(DEALWITHSTORETRANSFORM, "storeTransItems", {
        summaryNo: summaryNo,
        deviceName: deviceName,
        summaryNum: summaryNum,
        unitName: unitName, // 单位
        usability: usability,
        oldRoomName: roomName,
        oldSheetName: sheetName,
        deviceSN: _.isNull(deviceSN) ? "" : deviceSN,
        belongUnit: belongUnit,
        brandName: brandName
    }));
    yield put(change(DEALWITHSTORETRANSFORM, `storeTransItems.${currentRowOfItems}.deviceTypeId`, deviceTypeId + ""));
    yield put(change(DEALWITHSTORETRANSFORM, `storeTransItems.${currentRowOfItems}.validMonths`, validMonths + ""));
    yield put(change(DEALWITHSTORETRANSFORM, `storeTransItems.${currentRowOfItems}.oldSheetId`, sheetId + ""));
    yield put(change(DEALWITHSTORETRANSFORM, `storeTransItems.${currentRowOfItems}.oldStoreRoomId`, storeRoomId + ""));
    yield put(change(DEALWITHSTORETRANSFORM, `storeTransItems.${currentRowOfItems}.sourceType`, "2"));
}

// 盘点
function* watchStoreCheck() {
    while (true) {
        const { payload } = yield take(findStoreCheckActions.REQUEST);
        yield fork(toFindStoreCheck, payload);
    }
}

function* toFindStoreCheck(payload) {
    yield call(fetchStoreCheckApi, payload);
    yield call(setFirstItemToStoreCheckList);
}

// 为待办列表设初值
function* setFirstItemToStoreCheckList() {
    const state = yield select( (state) => state.findStoreCheck );
    yield put(setFirstListItemAction.selectListItem(_.first(state.list)));
}

function* watchStoreCheckRoom() {
    while (true) {
        const { payload } = yield take(findStoreCheckRoomActions.REQUEST);
        yield fork(toFindStoreCheckRoom, payload);
    }
}

function* toFindStoreCheckRoom(payload) {
    yield fork(fetchStoreCheckRoomApi, payload);
}

function* watchStoreCheckStoreRoom() {
    while (true) {
        const { payload } = yield take(findStoreCheckStoreRoomActions.REQUEST);
        yield fork(toFindStoreCheckStoreRoom, payload);
    }
}

function* toFindStoreCheckStoreRoom(payload) {
    yield fork(fetchStoreCheckStoreRoomApi, payload);
}

function* watchStoreCheckSheet() {
    while (true) {
        const { payload } = yield take(findStoreCheckSheetActions.REQUEST);
        yield fork(toFindStoreCheckSheet, payload);
    }
}

function* toFindStoreCheckSheet(payload) {
    yield fork(fetchStoreCheckSheetApi, payload);
    if (!_.isEmpty(payload.storeRoomId)) {
        yield put(change(FINDSHEETFORM, "storeRoomId", payload.storeRoomId));
    }
}

function* watchStoreCheckDeviceType() {
    while (true) {
        const { payload } = yield take(findStoreCheckDeviceTypeActions.REQUEST);
        yield fork(toFindStoreCheckDeviceType, payload);
    }
}

function* toFindStoreCheckDeviceType(payload) {
    yield fork(fetchStoreCheckDeviceTypeApi, payload);
}

function* watchStoreCheckInfo() {
    while (true) {
        const { payload } = yield take(findStoreCheckInfoActions.REQUEST);
        yield fork(toFindStoreCheckInfo, payload);
    }
}

function* toFindStoreCheckInfo(payload) {
    yield fork(fetchStoreCheckInfoApi, payload);
}

function* watchStoreCheckDetail() {
    while (true) {
        const { payload } = yield take(findStoreCheckDetailActions.REQUEST);
        yield fork(toFindStoreCheckDetail, payload);
    }
}

function* toFindStoreCheckDetail(payload) {
    yield fork(fetchStoreCheckDetailApi, payload);
}

function* watchStoreCheckDetailForType1() {
    while (true) {
        const { payload } = yield take(findStoreCheckDetailForType1Actions.REQUEST);
        yield fork(toFindStoreCheckDetailForType1, payload);
    }
}

function* toFindStoreCheckDetailForType1(payload) {
    yield fork(fetchStoreCheckDetailForType1Api, payload);
}

function* watchStoreCheckTrack() {
    while (true) {
        const { payload } = yield take(findStoreCheckTrackActions.REQUEST);
        yield fork(toFindStoreCheckTrack, payload);
    }
}

function* toFindStoreCheckTrack(payload) {
    yield fork(fetchStoreCheckTrackApi, payload);
}

function* watchSaveStoreCheckInfo() {
    while (true) {
        const { payload } = yield take(saveStoreCheckInfoActions.REQUEST);
        yield fork(toSaveStoreCheckInfo, payload);
    }
}

function* toSaveStoreCheckInfo(payload) {
    yield put( startSubmit(DEAL_WITH_STORE_CHECK_FORM));
    try {
        yield call(saveStoreCheckInfoApi, payload);
        yield put(stopSubmit(DEAL_WITH_STORE_CHECK_FORM));
        yield call(NavigationService.navigate, STORE_CHECK_SCREEN);
        yield call(updateStoreCheckList);
    } catch (e) {
        console.log("Into StoreCheck Saga Save error");
        yield put( saveStoreCheckInfoActions.failure(e));
        yield put( stopSubmit(DEAL_WITH_STORE_CHECK_FORM, e) );
    }
}

function* watchSubmitStoreCheck() {
    while (true) {
        const { payload } = yield take(submitStoreCheckActions.REQUEST);
        if (_.includes(["01", "03"], payload.status)) {
            const { payload: response } = yield take(saveStoreCheckInfoActions.REQUEST_COMPLETE);
            const { checkNo } = response;
            if (!_.isEmpty(checkNo)) {
                payload.checkNo = checkNo;
            }
        }

        yield call(toSubmitStoreCheck, payload);
    }
}

function* toSubmitStoreCheck(payload) {
    yield call(submitStoreCheckApi, payload);
    yield call(NavigationService.navigate, STORE_CHECK_SCREEN);
    yield call(updateStoreCheckList);
}

function* updateStoreCheckList() {
    const { userName } = yield select( (state) => state.user.authorization );
    yield fork(toFindStoreCheck, { user: userName, operator: userName });
}

function* watchUpdateStoreCheckDetail() {
    while (true) {
        const { payload } = yield take(updateStoreCheckDetailActions.REQUEST);
        yield fork(toUpdateStoreCheckDetail, payload);
    }
}

function* toUpdateStoreCheckDetail(payload) {
    yield call(updateStoreCheckDetailApi, payload);
    yield call(refreshStoreCheckDetail);
}

function* refreshStoreCheckDetail() {
    let payload = {};
    const { checkNo } = yield select( (state) => state.testSelectedToDoList );
    payload.checkNo = checkNo;
    payload.sourceType = 2;
    yield call(fetchStoreCheckDetailApi, payload);
}

function* watchGetStoreCheckOperate() {
    while (true) {
        const { payload } = yield take(getStoreCheckOperateActions.REQUEST);
        yield fork(toGetStoreCheckOperate, payload);
    }
}

function* toGetStoreCheckOperate(payload) {
    yield call(getStoreCheckOperateApi, payload);
    yield call(updateStoreCheckOperatorsList);
}

function* updateStoreCheckOperatorsList() {
    const selectedOperation = yield select( (state) => _.first(state.getStoreCheckOperate.list) );
    const { status, checkNo } = yield select( (state) => state.testSelectedToDoList );
    const { userName } = yield select( (state) => state.user.authorization );
    const operateType = selectedOperation && selectedOperation.operateType || "";
    console.log("currentOpType", operateType);
    // set default value, add one more below
    yield put(change(DEAL_WITH_STORE_CHECK_FORM, "opType", operateType));
    yield call(toFindStoreCheckOperators, {
        user: userName,
        checkNo: checkNo,
        opType: operateType,
        status: status
    });
}

function* watchStoreCheckOperators() {
    while (true) {
        const { payload } = yield take(findStoreCheckOperatorsActions.REQUEST);
        yield fork(toFindStoreCheckOperators, payload);
    }
}

function* toFindStoreCheckOperators(payload) {
    yield call(findStoreCheckOperatorsApi, payload);
    yield put(change(DEAL_WITH_STORE_CHECK_FORM, "opType", payload.opType));
    yield call(setDefaultStoreCheckOperators);
}

function* setDefaultStoreCheckOperators() {
    const selectedUser = yield select( (state) => _.first(state.storeCheckFindOperaters.list) );
    console.log("selectedUser", selectedUser);
    yield put(change(DEAL_WITH_STORE_CHECK_FORM, "nextOperator", selectedUser && selectedUser.nextOperator || ""));
}

function* watchStoreCheckSheetByCheckNo() {
    while (true) {
        const { payload } = yield take(findStoreCheckSheetByCheckNoActions.REQUEST);
        yield fork(toFindStoreCheckSheetByCheckNo, payload);
    }
}

function* toFindStoreCheckSheetByCheckNo(payload) {
    yield fork(findStoreCheckSheetByCheckNoApi, payload);
}

function* watch00() {
    while (true) {
        const { payload } = yield take(findToFollowUpListActions.REQUEST);
        yield fork(findToFollowUpList, payload);
    }
}

function* findToFollowUpList(payload) {
    yield fork(fetchToFollowUpListApi, payload);
}

function* watch01() {
    while (true) {
        const { payload } = yield take(findFollowUpHisListActions.REQUEST);
        yield fork(findFollowUpHisList, payload);
    }
}

function* findFollowUpHisList(payload) {
    yield fork(fetchFollowUpHisListApi, payload);
}

function* watch02() {
    while (true) {
        const { payload } = yield take(showConstructFormInfoActions.REQUEST);
        yield fork(showConstructFormInfoFunc, payload);
    }
}

function* showConstructFormInfoFunc(payload) {
    yield fork(showConstructFormInfoApi, payload);
}

function* watch03() {
    while (true) {
        const { payload } = yield take(toConstructPrepareActions.REQUEST);
        yield fork(toConstructPrepareFunc, payload);
    }
}

function* toConstructPrepareFunc(payload) {
    yield fork(toConstructPrepareApi, payload);
}

function* watch04() {
    while (true) {
        const { payload } = yield take(toCheckBeforeConstructActions.REQUEST);
        yield fork(toCheckBeforeConstructFunc, payload);
    }
}

function* toCheckBeforeConstructFunc(payload) {
    yield fork(toCheckBeforeConstructApi, payload);
}

function* watch05() {
    while (true) {
        const { payload } = yield take(toEndByExceptionActions.REQUEST);
        yield fork(toEndByExceptionFunc, payload);
    }
}

function* toEndByExceptionFunc(payload) {
    yield call(toEndByExceptionApi, payload);
    yield call(NavigationService.navigate, SGGL_00_SCREEN);
    yield call(updateSggl00Screen);
}

function* watch06() {
    while (true) {
        const { payload } = yield take(exitConstructActions.REQUEST);
        yield fork(exitConstructFunc, payload);
    }
}

function* exitConstructFunc(payload) {
    yield call(exitConstructApi, payload);
    const { sr_id } = yield select( (state) => state.toConstructPrepare.responses );
    yield call(uploadImages, sr_id);
    yield call(NavigationService.navigate, SGGL_00_SCREEN);
    yield call(updateSggl00Screen);
}

function* watch07() {
    while (true) {
        const { payload } = yield take(constructPlanActions.REQUEST);
        yield fork(constructPlanFunc, payload);
    }
}

function* constructPlanFunc(payload) {
    yield fork(constructPlanApi, payload);
}

function* watch08() {
    while (true) {
        const { payload } = yield take(showStepInfoActions.REQUEST);
        yield fork(showStepInfoFunc, payload);
    }
}

function* showStepInfoFunc(payload) {
    yield fork(showStepInfoApi, payload);
}

function* watch09() {
    while (true) {
        const { payload } = yield take(checkAfterConstructActions.REQUEST);
        yield fork(checkAfterConstructFunc, payload);
    }
}

function* checkAfterConstructFunc(payload) {
    yield fork(toCheckAfterConstructApi, payload);
}

function* watchBackToHistoryPage() {
    while (true) {
        const { payload } = yield take(checkAfterConstructActions.BACK_TO_HISTORY);
        yield call(backToHistoryPageFunc, payload);
    }
}

function* backToHistoryPageFunc() {
    yield call(NavigationService.navigate, SGGL_00_SCREEN);
    // yield call(updateSgglHistoryScreen);
}

function* watch10() {
    while (true) {
        const { payload } = yield take(constructRecordActions.REQUEST);
        yield fork(constructRecordFunc, payload);
    }
}

function* constructRecordFunc(payload) {
    yield fork(constructSupervisionRecordApi, payload);
}


function* watch12() {
    while (true) {
        const { payload } = yield take(showManualActions.REQUEST);
        yield fork(showManualFunc, payload);
    }
}

function* showManualFunc(payload) {
    yield fork(showManualApi, payload);
}

function* watch15() {
    while (true) {
        const { payload } = yield take(supervisionListActions.REQUEST);
        yield fork(findSuperVisionListFunc, payload);
    }
}

function* findSuperVisionListFunc(payload) {
    yield fork(superVisionListApi, payload);
}

function* watch16() {
    while (true) {
        const { payload } = yield take(endManualActions.REQUEST);
        yield call(endManualFunc, payload);
    }
}

function* endManualFunc(payload) {
    yield call(endManualApi, payload); // 保存最后一步，并且更新方案页
    yield call(NavigationService.back);
}

function* watch16Success() {
    while (true) {
        const { payload } = yield take(endManualActions.REQUEST_COMPLETE);
        if (payload.msg === "success") {
            toaster.showToast("本次手册执行完毕，记录已保存");
        } else {
            toaster.showToast("记录保存失败");
        }
    }
}

// 确认施工结束前检查按钮
function* watch17() {
    while (true) {
        const { payload } = yield take(confirmSupervisionActions.REQUEST);
        yield call(confirmSupervisionFunc, payload);
    }
}

function* confirmSupervisionFunc(payload) {
    // 1. 结束前检查请求
    yield call(confirmSupervisionApi, payload);

    // 2. 上传图片
    const { sr_id } = yield select( (state) => state.toCheckAfterConstruct.responses );
    yield put(checkAfterConstructActions.showModal());
    yield call(uploadImages, sr_id);
    yield put(checkAfterConstructActions.hideModal());

    // 3. 页面跳转
    yield call(NavigationService.navigate, SGGL_00_SCREEN);
    yield call(updateSggl00Screen);
}

function* updateSggl00Screen() {
    const { userName } = yield select( (state) => state.user.authorization );
    yield call(fetchToFollowUpListApi, { user: userName });
}

async function uploadImages(sr_id) {
    let album = await MediaLibrary.getAlbumAsync(`标准化施工_${sr_id}`);
    if(album) {
      let assetsObj = await MediaLibrary.getAssetsAsync({
          first: 1000,
          album: album,
          mediaType: MediaLibrary.MediaType.photo,
      });
      api.uploadImages(assetsObj.assets,sr_id).then(data => {
          // 已可取得返回结果，成功失败
          console.log("Uploading pics: ", JSON.stringify(data));
      });
    }
}

export default function* rootSaga() {
    yield fork(watchLogin);
    yield fork(watchRetrieveUser);
    yield fork(watchFindFollowUpCounts);

    // 出库
    yield fork(watchFindStoreIn);
    yield fork(watchFindDeviceType);
    yield fork(watchFindDevice);
    yield fork(watchFindStoreRoom);
    yield fork(watchFindRoom);
    yield fork(watchFindSheet);
    yield fork(watchFindStoreInInfo);
    yield fork(watchFindStoreInDetail);
    yield fork(watchFindStoreInTrack);
    yield fork(watchDeleteStoreInInfo);
    yield fork(watchSaveStoreInInfo);
    yield fork(watchSubmitStoreIn);
    yield fork(watchGetStoreInOperation);
    yield fork(watchFindOperator);
    yield fork(watchQRStoreInDeviceInfo);
    // 出库
    yield fork(watchFindStoreOut);
    yield fork(watchFindStoreOutDevice);
    yield fork(watchFindStoreOutRoom);
    yield fork(watchFindStoreOutInfo);
    yield fork(watchFetchStoreOutDetail);
    yield fork(watchStoreOutTrack);
    yield fork(watchDeleteStoreOutInfo);
    yield fork(watchSaveStoreOutInfo);
    yield fork(watchSubmitStoreOut);
    yield fork(watchGetStoreOutOperate);
    yield fork(watchFindStoreOutOperator);
    yield fork(watchQRStoreOutDeviceInfo);
    // 库存
    yield fork(watchDeviceFindDevice);
    yield fork(watchDeviceFindStoreRoom);
    yield fork(watchDeviceFindSheet);
    yield fork(watchDeviceFindDeviceInfo);
    yield fork(watchQRDeviceInfo);
    // 移库
    yield fork(watchFindStoreTrans);
    yield fork(watchFindStoreTransInfo);
    yield fork(watchFindStoreTransDetail);
    yield fork(watchFindStoreTransRoom);
    yield fork(watchFindStoreTransStoreRoom);
    yield fork(watchFindStoreTransDevice);
    yield fork(watchFindStoreTransSheet);
    yield fork(watchFindStoreTransTrack);
    yield fork(watchFindStoreTransOperate);
    yield fork(watchFindStoreTransOperators);
    yield fork(watchSaveStoreTransInfo);
    yield fork(watchSubmitStoreTrans);
    yield fork(watchQRStoreTransDeviceInfo);
    // 盘点
    yield fork(watchStoreCheck);
    yield fork(watchStoreCheckRoom);
    yield fork(watchStoreCheckStoreRoom);
    yield fork(watchStoreCheckSheet);
    yield fork(watchStoreCheckDeviceType);
    yield fork(watchStoreCheckInfo);
    yield fork(watchStoreCheckDetail);
    yield fork(watchStoreCheckDetailForType1);
    yield fork(watchStoreCheckTrack);
    yield fork(watchSaveStoreCheckInfo);
    yield fork(watchSubmitStoreCheck);
    yield fork(watchUpdateStoreCheckDetail);
    yield fork(watchGetStoreCheckOperate);
    yield fork(watchStoreCheckOperators);
    yield fork(watchStoreCheckSheetByCheckNo);
    // 标准化施工
    yield fork(watch00);
    yield fork(watch01);
    yield fork(watch02);
    yield fork(watch03);
    yield fork(watch04);
    yield fork(watch05);
    yield fork(watch06);
    yield fork(watch07);
    yield fork(watch08);
    yield fork(watch09);
    yield fork(watchBackToHistoryPage);
    yield fork(watch10);
    yield fork(watch12);
    yield fork(watch15);
    yield fork(watch16);
    yield fork(watch16Success);
    yield fork(watch17);
    // redux form
    yield fork(watchResetSheetForm);
    // redux-saga-rn-alert
    yield spawn(watchAlertChannel);
}
