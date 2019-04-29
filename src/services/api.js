import request from "./request";
import {
    LOGIN,
    FOLLOW_UP_COUNT_URL,
    KFGL_STOREIN_FINDSTOREIN,
    KFGL_STOREIN_FINDDEVIDETYPE,
    KFGL_STOREIN_FINDDEVICE,
    KFGL_STOREIN_FINDSTOREROOM,
    KFGL_STOREIN_FINDROOM,
    KFGL_STOREIN_FINDSHEET,
    KFGL_STOREIN_FINDSTOREININFO,
    KFGL_STOREIN_FINDSTOREINDETAIL,
    KFGL_STOREIN_FINDSTOREINTRACK,
    KFGL_STOREIN_DELETESTOREININFO,
    KFGL_STOREIN_SUBMITSTOREIN,
    KFGL_STOREIN_SAVESTOREININFO,
    KFGL_STOREIN_GETSTOREINOPERATE,
    KFGL_STOREIN_FINDOPERATORS,
    KFGL_STOREOUT_FINDSTOREOUT,
    KFGL_STOREOUT_FINDDEVICE,
    KFGL_STOREOUT_FINDSTOREROOM,
    KFGL_STOREOUT_FINDSTOREOUTINFO,
    KFGL_STOREOUT_FINDSTOREOUTDETAIL,
    KFGL_STOREOUT_FINDSTOREOUTTRACK,
    KFGL_STOREOUT_DELETESTOREOUTINFO,
    KFGL_STOREOUT_GETSTOREOUTOPERATE,
    KFGL_STOREOUT_FINDOPERATORS,
    KFGL_STOREOUT_SAVESTOREOUTINFO,
    KFGL_STOREOUT_SUBMITSTOREOUT,
    KFGL_DEVICE_FINDDEVICE,
    KFGL_DEVICE_FINDSTOREROOM,
    KFGL_DEVICE_FINDSHEET,
    KFGL_DEVICE_FINDDEVICEINFO,
    KFGL_STORETRANS_FINDSTORETRANS,
    KFGL_STORETRANS_FINDSTORETRANSINFO,
    KFGL_STORETRANS_FINDSTORETRANSDETAIL,
    KFGL_STORETRANS_FINDROOM,
    KFGL_STORETRANS_FINDSTOREROOM,
    KFGL_STORETRANS_FINDDEVICE,
    KFGL_STORETRANS_FINDSHEET,
    KFGL_STORETRANS_TRANSTRACK,
    KFGL_STORETRANS_GETSTORETRANSOPERATE,
    KFGL_STORETRANS_FINDOPERATERS,
    KFGL_STORETRANS_DELETESTORETRANSINFO,
    KFGL_STORETRANS_SAVESTORETRANSINFO,
    KFGL_STORETRANS_SUBMITSTORETRANSINFO,
    KFGL_STORECHECK_FINDSTORECHECK,
    KFGL_STORECHECK_FINDROOM,
    KFGL_STORECHECK_FINDSTOREROOM,
    KFGL_STORECHECK_FINDSHEET,
    KFGL_STORECHECK_FINDDEVICETYPE,
    KFGL_STORECHECK_FINDSTORECHECKINFO,
    KFGL_STORECHECK_FINDSTORECHECKDETAIL,
    KFGL_STORECHECK_FINDSTORECHECKTRACK,
    KFGL_STORECHECK_DELETESTORECHECKINFO,
    KFGL_STORECHECK_SAVESTORECHECKINFO,
    KFGL_STORECHECK_SUBMITSTORECHECK,
    KFGL_STORECHECK_UPDATESTORECHECKDETAIL,
    KFGL_STORECHECK_GETSTORECHECKOPERATE,
    KFGL_STORECHECK_FINDOPERATERS,
    KFGL_STORECHECK_FINDSHEETSBYCHECKNO,
    // 标准化施工
    SGGL_00_FINDTOFOLLOWUPLIST,
    SGGL_01_FINDFOLLOWUPHISLIST,
    SGGL_02_SHOWCONSTRUCTFORMINFO,
    SGGL_03_TO_CONSTRUCT_PREPARE,
    SGGL_04_TO_CHECK_BEFORE_CONSTRUCT,
    SGGL_05_END_BY_EXCEPTION,
    SGGL_06_EXIT_CONSTRUCT,
    SGGL_07_CONSTRUCT_PLAN,
    SGGL_08_SHOW_STEP_INFO,
    SGGL_09_CHECK_AFTER_CONSTRUCT,
    SGGL_10_CONSTRUCT_SUPERVISION_RECORD,
    SGGL_12_SHOW_MANUAL,
    SGGL_15_FIND_SUPERVISION_LIST,
    SGGL_16_END_MANUAL,
    SGGL_17_CONFIRM_SUPERVISION,
    // Tools
    SGGL_PICS_PATH,
} from "../boot/config";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGESIZE = 20;
import md5 from "md5";
import formUrlEncoded from "form-urlencoded";

// Help Method
function callApi(endpoint, options) {
    return request(`${endpoint}`, options);
}

function getPublishFetchOptions(body) {
    return {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body
    };
}

function getUploadFetchOptions(body) {
    return {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data;charset=UTF-8"
        },
        body
    };
}

// API Method

// If we use `application/x-www-form-urlencoded` as `Content-Type`, the body should be
// `key1=value1&key2=value2`, and the specific symbols in value1 and value2 will be treated
// as same as we used them in the query string of GET request. That being said, we should
// encode the values especially do comparing with database.

export default {
    fetchLoginUser: ({
                         username,
                         password
                     }) => {
        let body = `id=${encodeURIComponent(username)}&password=${encodeURIComponent(md5(password))}`;
        console.log("API CALL", body);
        let fetchOptions = getPublishFetchOptions(body);
        return callApi(LOGIN, fetchOptions);
    },
    fetchFollowUpCount: ({ user }) => {
        let fetchOptions = getPublishFetchOptions(`user=${encodeURIComponent(user)}`);
        return callApi(FOLLOW_UP_COUNT_URL, fetchOptions);
    },
    findStoreIn: ({
                      user = "",
                      page = DEFAULT_PAGE,
                      rows = DEFAULT_PAGESIZE,
                      inNo = "",
                      applyDateSt = "",
                      applyDateEn = "",
                      applyer = "",
                      inType = "",
                      brandName = "",
                      operator = "",
                      applyAduitor = "",
                      checker = "",
                      status = ""
                  }) => {
        let body = `user=${encodeURIComponent(user)}` +
            `&page=${encodeURIComponent(page)}` +
            `&rows=${encodeURIComponent(rows)}` +
            `&inNo=${encodeURIComponent(inNo)}` +
            `&applyDateSt=${encodeURIComponent(applyDateSt)}` +
            `&applyDateEn=${encodeURIComponent(applyDateEn)}` +
            `&applyer=${encodeURIComponent(applyer)}` +
            `&inType=${encodeURIComponent(inType)}` +
            `&brandName=${encodeURIComponent(brandName)}` +
            `&operator=${encodeURIComponent(operator)}` +
            `&applyAduitor=${encodeURIComponent(applyAduitor)}` +
            `&checker=${encodeURIComponent(checker)}` +
            `&status=${encodeURIComponent(status)}`;

        let fetchOptions = getPublishFetchOptions(body);
        return callApi(KFGL_STOREIN_FINDSTOREIN, fetchOptions);
    },
    findDeviceType: ({
                         user = "",
                         page = DEFAULT_PAGE,
                         rows = DEFAULT_PAGESIZE,
                         deviceName = "",
                         brandName = "",
                         deviceType = ""
                     }) => {
        let body = `user=${encodeURIComponent(user)}` +
        `&page=${encodeURIComponent(DEFAULT_PAGE)}` +
        `&rows=${encodeURIComponent(rows)}` +
        `&deviceName=${encodeURIComponent(deviceName)}` +
        `&brandName=${encodeURIComponent(brandName)}` +
        `&deviceType=${encodeURIComponent(deviceType)}`;

        let fetchOptions = getPublishFetchOptions(body);
        return callApi(KFGL_STOREIN_FINDDEVIDETYPE, fetchOptions);
    },
    // 用于施工入库库存查询
    findDevice: ({
                     user = "",
                     page = DEFAULT_PAGE,
                     rows = DEFAULT_PAGESIZE,
                     summaryNo = "",
                     deviceName = "",
                     brandName = "",
                     deviceType = "",
                     storeRoomId = "",
                     sheetName = "",
                     usability = "",
                     belongUnit = "",
                     status = "",
                 }) => {
        let body = `user=${encodeURIComponent(user)}` +
        `&page=${encodeURIComponent(DEFAULT_PAGE)}` +
        `&rows=${encodeURIComponent(rows)}` +
        `&summaryNo=${encodeURIComponent(summaryNo)}` +
        `&deviceName=${encodeURIComponent(deviceName)}` +
        `&brandName=${encodeURIComponent(brandName)}` +
        `&deviceType=${encodeURIComponent(deviceType)}` +
        `&storeRoomId=${encodeURIComponent(storeRoomId)}` +
            `&sheetName=${encodeURIComponent(sheetName)}` +
        `&usability=${encodeURIComponent(usability)}` +
        `&belongUnit=${encodeURIComponent(belongUnit)}` +
        `&status=${encodeURIComponent(status)}`;

        let fetchOptions = getPublishFetchOptions(body);
        return callApi(KFGL_STOREIN_FINDDEVICE, fetchOptions);
    },
    findStoreRoom: ({
                        user = ""
                    }) => {
        let body = `user=${encodeURIComponent(user)}`;
        let fetchOptions = getPublishFetchOptions(body);
        return callApi(KFGL_STOREIN_FINDSTOREROOM, fetchOptions);
    },
    findRoom: ({
                   user = ""
               }) => {
        let body = `user=${encodeURIComponent(user)}`;
        let fetchOptions = getPublishFetchOptions(body);
        return callApi(KFGL_STOREIN_FINDROOM, fetchOptions);
    },
    findSheet: ({
                    user = "",
                    page = DEFAULT_PAGE,
                    rows = DEFAULT_PAGESIZE,
                    storeRoomId = "",
                    roomLevel = "",
                    sheetName = ""
                }) => {
        let body = `user=${encodeURIComponent(user)}` +
        `&page=${encodeURIComponent(DEFAULT_PAGE)}` +
        `&rows=${encodeURIComponent(rows)}` +
        `&storeRoomId=${encodeURIComponent(storeRoomId)}` +
        `&roomLevel=${encodeURIComponent(roomLevel)}` +
        `&sheetName=${encodeURIComponent(sheetName)}`;

        let fetchOptions = getPublishFetchOptions(body);
        return callApi(KFGL_STOREIN_FINDSHEET, fetchOptions);
    },
    findStoreInInfo: ({
                          user = "",
                          inNo = "",
                          operateType = ""
                      }) => {
        let body = `user=${encodeURIComponent(user)}`;
        let fetchOptions = getPublishFetchOptions(body);
        return callApi(KFGL_STOREIN_FINDSTOREININFO + `&inNo=${inNo}&operateType=${operateType}`, fetchOptions);
    },
    updateStoreInInfo: ({
                            user = "",
                            inNo = "",
                            operateType = ""
                        }) => {
        let body = `user=${encodeURIComponent(user)}`;
        let fetchOptions = getPublishFetchOptions(body);
        return callApi(KFGL_STOREIN_FINDSTOREININFO + `&inNo=${inNo}&operateType=${operateType}`, fetchOptions);
    },
    findStoreInDetail: ({
                            user = "",
                            inNo = ""
                        }) => {
        let body = `user=${encodeURIComponent(user)}`;
        let fetchOptions = getPublishFetchOptions(body);
        return callApi(KFGL_STOREIN_FINDSTOREINDETAIL + `&inNo=${inNo}`, fetchOptions);
    },
    findStoreInTrack: ({
                           user = "",
                           inNo = ""
                       }) => {
        let body = `user=${encodeURIComponent(user)}`;
        let fetchOptions = getPublishFetchOptions(body);
        return callApi(KFGL_STOREIN_FINDSTOREINTRACK + `&inNo=${inNo}`, fetchOptions);
    },
    deleteStoreInInfo: ({
                            user = "",
                            inNo = ""
                        }) => {
        let body = `user=${encodeURIComponent(user)}`;
        let fetchOptions = getPublishFetchOptions(body);
        return callApi(KFGL_STOREIN_DELETESTOREININFO + `&inNo=${inNo}`, fetchOptions);
    },
    saveStoreInInfo: (valuesToStore) => {
        let fetchOptions = getPublishFetchOptions(valuesToStore);
        return callApi(KFGL_STOREIN_SAVESTOREININFO, fetchOptions);
    },
    submitStorein: ({
                        user = "",
                        operateType = "",
                        inNo = "",
                        inType = "",
                        opType = "",
                        nextOperator = "",
                        opinion = "",
                        status = "",
                        operator = ""
                    }) => {
        let body = `user=${encodeURIComponent(user)}` +
        `&nextOperator=${encodeURIComponent(nextOperator)}` +
        `&operator=${encodeURIComponent(operator)}` +
        `&opType=${encodeURIComponent(opType)}` +
        `&opinion=${encodeURIComponent(opinion)}`;

        let urlStr = `&inNo=${inNo}` +
        `&inType=${inType}` +
        `&status=${status}`;

        let fetchOptions = getPublishFetchOptions(body);
        return callApi(KFGL_STOREIN_SUBMITSTOREIN + urlStr, fetchOptions);
    },
    getStoreInOperate: ({
                            user = "",
                            status = "",
                        }) => {
        let body = `user=${encodeURIComponent(user)}`;

        let fetchOptions = getPublishFetchOptions(body);
        return callApi(KFGL_STOREIN_GETSTOREINOPERATE + `&status=${status}`, fetchOptions);
    },
    findOperators: ({
                        user = "",
                        inNo = "",
                        inType = "",
                        opType = "",
                        status = "",
                    }) => {
        let body = `user=${encodeURIComponent(user)}`;
        let fetchOptions = getPublishFetchOptions(body);

        let urlStr = `&inNo=${inNo}` +
        `&inType=${inType}` +
        `&opType=${opType}` +
        `&status=${status}`;

        return callApi(KFGL_STOREIN_FINDOPERATORS + urlStr, fetchOptions);
    },
    findStoreOut: ({
                       user = "",
                       page = DEFAULT_PAGE,
                       rows = DEFAULT_PAGESIZE,
                       outNo = "",
                       applyDateSt = "",
                       applyDateEn = "",
                       applyer = "",
                       outType = "",
                       brandName = "",
                       operator = "",
                       applyAduitor = "",
                       checker = "",
                       status = ""
                   }) => {
        let body = `user=${encodeURIComponent(user)}` +
            `&page=${encodeURIComponent(page)}` +
            `&rows=${encodeURIComponent(rows)}` +
            `&outNo=${encodeURIComponent(outNo)}` +
            `&applyDateSt=${encodeURIComponent(applyDateSt)}` +
            `&applyDateEn=${encodeURIComponent(applyDateEn)}` +
            `&applyer=${encodeURIComponent(applyer)}` +
            `&outType=${encodeURIComponent(outType)}` +
            `&brandName=${encodeURIComponent(brandName)}` +
            `&operator=${encodeURIComponent(operator)}` +
            `&applyAduitor=${encodeURIComponent(applyAduitor)}` +
            `&checker=${encodeURIComponent(checker)}` +
            `&status=${encodeURIComponent(status)}`;

        let fetchOptions = getPublishFetchOptions(body);
        return callApi(KFGL_STOREOUT_FINDSTOREOUT, fetchOptions);
    },
    // 用途：用于添加备件明细信息时，从库存中添加显示的记录。(只能查找状态为在库的备件)
    storeOutFindDevice: ({
                             user = "",
                             page = DEFAULT_PAGE,
                             rows = DEFAULT_PAGESIZE,
                             summaryNo = "",
                             deviceName = "",
                             brandName = "",
                             deviceType = "",
                             storeRoomId = "",
                             sheetName = "",
                             usability = "",
                             belongUnit = "",
                             status = "",
                         }) => {
        let body = `user=${encodeURIComponent(user)}` +
            `&page=${encodeURIComponent(DEFAULT_PAGE)}` +
            `&rows=${encodeURIComponent(rows)}` +
            `&summaryNo=${encodeURIComponent(summaryNo)}` +
            `&deviceName=${encodeURIComponent(deviceName)}` +
            `&brandName=${encodeURIComponent(brandName)}` +
            `&deviceType=${encodeURIComponent(deviceType)}` +
            `&storeRoomId=${encodeURIComponent(storeRoomId)}` +
            `&sheetName=${encodeURIComponent(sheetName)}` +
            `&usability=${encodeURIComponent(usability)}` +
            `&belongUnit=${encodeURIComponent(belongUnit)}` +
            `&status=${encodeURIComponent(status)}`;

        let fetchOptions = getPublishFetchOptions(body);
        return callApi(KFGL_STOREOUT_FINDDEVICE, fetchOptions);
    },
    storeOutFindStoreRoom: ({
                                user = ""
                            }) => {
        let body = `user=${encodeURIComponent(user)}`;
        let fetchOptions = getPublishFetchOptions(body);
        return callApi(KFGL_STOREOUT_FINDSTOREROOM, fetchOptions);
    },
    findStoreOutInfo: ({
                           user = "",
                           outNo = "",
                           operateType = ""
                       }) => {
        let body = `user=${encodeURIComponent(user)}`;
        let fetchOptions = getPublishFetchOptions(body);
        return callApi(KFGL_STOREOUT_FINDSTOREOUTINFO + `&outNo=${outNo}&operateType=${operateType}`, fetchOptions);
    },
    findStoreOutDetail: ({
                             user = "",
                             outNo = ""
                         }) => {
        let body = `user=${encodeURIComponent(user)}`;
        let fetchOptions = getPublishFetchOptions(body);
        return callApi(KFGL_STOREOUT_FINDSTOREOUTDETAIL + `&outNo=${outNo}`, fetchOptions);
    },
    findStoreOutTrack: ({
                            user = "",
                            outNo = ""
                        }) => {
        let body = `user=${encodeURIComponent(user)}`;
        let fetchOptions = getPublishFetchOptions(body);
        return callApi(KFGL_STOREOUT_FINDSTOREOUTTRACK + `&outNo=${outNo}`, fetchOptions);
    },
    deleteStoreOutInfo: ({
                             user = "",
                             outNo = ""
                         }) => {
        let body = `user=${encodeURIComponent(user)}`;
        let fetchOptions = getPublishFetchOptions(body);
        return callApi(KFGL_STOREOUT_DELETESTOREOUTINFO + `&outNo=${outNo}`, fetchOptions);
    },
    getStoreOutOperate: ({
                             user = "",
                             status = "",
                         }) => {
        let body = `user=${encodeURIComponent(user)}`;

        let fetchOptions = getPublishFetchOptions(body);
        return callApi(KFGL_STOREOUT_GETSTOREOUTOPERATE + `&status=${status}`, fetchOptions);
    },
    findStoreOutOperators: ({
                                user = "",
                                outNo = "",
                                outType = "",
                                opType = "",
                                status = "",
                            }) => {
        let body = `user=${encodeURIComponent(user)}`;
        let fetchOptions = getPublishFetchOptions(body);

        let urlStr = `&outNo=${outNo}` +
            `&outType=${outType}` +
            `&opType=${opType}` +
            `&status=${status}`;

        return callApi(KFGL_STOREOUT_FINDOPERATORS + urlStr, fetchOptions);
    },
    saveStoreOutInfo: (valuesToStore) => {
        let fetchOptions = getPublishFetchOptions(valuesToStore);
        return callApi(KFGL_STOREOUT_SAVESTOREOUTINFO, fetchOptions);
    },
    submitStoreOut: ({
                         user = "",
                         operateType = "",
                         outNo = "",
                         outType = "",
                         opType = "",
                         nextOperator = "",
                         opinion = "",
                         status = "",
                         operator = ""
                     }) => {
        let body = `user=${encodeURIComponent(user)}` +
            `&nextOperator=${encodeURIComponent(nextOperator)}` +
            `&operator=${encodeURIComponent(operator)}` +
            `&opType=${encodeURIComponent(opType)}` +
            `&opinion=${encodeURIComponent(opinion)}`;

        let urlStr = `&outNo=${outNo}` +
            `&outType=${outType}` +
            `&status=${status}`;

        let fetchOptions = getPublishFetchOptions(body);
        return callApi(KFGL_STOREOUT_SUBMITSTOREOUT + urlStr, fetchOptions);
    },
    deviceFindDevice: (values) => {
        values.page = DEFAULT_PAGE;
        values.rows = DEFAULT_PAGESIZE;
        let fetchOptions = getPublishFetchOptions(urlEncoded(values));
        return callApi(KFGL_DEVICE_FINDDEVICE, fetchOptions);
    },
    deviceFindStoreRoom: ({ user = "" }) => {
        let fetchOptions = getPublishFetchOptions(`user=${encodeURIComponent(user)}`);
        return callApi(KFGL_DEVICE_FINDSTOREROOM + "&operateType=combobox", fetchOptions);
    },
    deviceFindSheet: ({
                          user = "",
                          storeRoomId = ""
                      }) => {
        let fetchOptions = getPublishFetchOptions(`user=${encodeURIComponent(user)}`);
        let urlStr = `&storeRoomId=${storeRoomId}`;
        return callApi(KFGL_DEVICE_FINDSHEET + urlStr, fetchOptions);
    },
    deviceFindDeviceInfo: ({
                               user = "",
                               summaryNo = ""
                           }) => {
        let fetchOptions = getPublishFetchOptions(`user=${encodeURIComponent(user)}`);
        let urlStr = `&summaryNo=${summaryNo}`;
        return callApi(KFGL_DEVICE_FINDDEVICEINFO + urlStr, fetchOptions);
    },
    // 移库管理 api
    findStoreTrans: (values) => {
        values.page = DEFAULT_PAGE;
        values.rows = DEFAULT_PAGESIZE;
        let fetchOptions = getPublishFetchOptions(urlEncoded(values));
        return callApi(KFGL_STORETRANS_FINDSTORETRANS, fetchOptions);
    },
    findStoreTransInfo: ({ user = "", transNo = "", operateType = "update" }) => {
        let urlStr = `&transNo=${transNo}&operateType=${operateType}`;
        let fetchOptions = getPublishFetchOptions(`user=${encodeURIComponent(user)}`);
        return callApi(KFGL_STORETRANS_FINDSTORETRANSINFO + urlStr, fetchOptions);
    },
    findStoreTransDetail: ({ user = "", transNo = ""}) => {
        let urlStr = `&transNo=${transNo}`;
        let fetchOptions = getPublishFetchOptions(`user=${encodeURIComponent(user)}`);
        return callApi(KFGL_STORETRANS_FINDSTORETRANSDETAIL + urlStr, fetchOptions);
    },
    findStoreTransRoom: ({ user = ""}) => {
        let fetchOptions = getPublishFetchOptions(`user=${encodeURIComponent(user)}`);
        return callApi(KFGL_STORETRANS_FINDROOM, fetchOptions);
    },
    findStoreTransStoreRoom: ({ user = ""}) => {
        let fetchOptions = getPublishFetchOptions(`user=${encodeURIComponent(user)}`);
        return callApi(KFGL_STORETRANS_FINDSTOREROOM, fetchOptions);
    },
    findStoreTransDevice: values => {
        values.page = DEFAULT_PAGE;
        values.rows = DEFAULT_PAGESIZE;
        let fetchOptions = getPublishFetchOptions(urlEncoded(values));
        return callApi(KFGL_STORETRANS_FINDDEVICE, fetchOptions);
    },
    findStoreTransSheet: values => {
        values.page = DEFAULT_PAGE;
        values.rows = DEFAULT_PAGESIZE;
        let fetchOptions = getPublishFetchOptions(urlEncoded(values));
        return callApi(KFGL_STORETRANS_FINDSHEET, fetchOptions);
    },
    findStoreTransTrack: ({ user = "", transNo = "" }) => {
        let fetchOptions = getPublishFetchOptions(`user=${encodeURIComponent(user)}`);
        let urlStr = `&transNo=${transNo}`;
        return callApi(KFGL_STORETRANS_TRANSTRACK + urlStr, fetchOptions);
    },
    getStoreTransOperate: ({ user = "", status = ""}) => {
        let fetchOptions = getPublishFetchOptions(`user=${encodeURIComponent(user)}`);
        let urlStr = `&status=${status}`;
        return callApi(KFGL_STORETRANS_GETSTORETRANSOPERATE + urlStr, fetchOptions);
    },
    storeTransFindOperaters: ({ user = "", transNo = "", status = "", opType = ""}) => {
        let fetchOptions = getPublishFetchOptions(`user=${encodeURIComponent(user)}`);
        let urlStr = `&transNo=${transNo}&status=${status}&opType=${opType}`;
        return callApi(KFGL_STORETRANS_FINDOPERATERS + urlStr, fetchOptions);
    },
    deleteStoreTransInfo: ({ user = "", transNo = ""}) => {
        let fetchOptions = getPublishFetchOptions(`user=${encodeURIComponent(user)}`);
        let urlStr = `&transNo=${transNo}`;
        return callApi(KFGL_STORETRANS_DELETESTORETRANSINFO + urlStr, fetchOptions);
    },
    saveStoreTransInfo: (values) => {
        let fetchOptions = getPublishFetchOptions(values);
        return callApi(KFGL_STORETRANS_SAVESTORETRANSINFO, fetchOptions);
    },
    submitStoreTrans: ({ user = "", transNo = "", status = "", opType = "", nextOperator = "", operator = "", opinion = ""}) => {
        let fetchOptions = getPublishFetchOptions(`user=${encodeURIComponent(user)}&opType=${encodeURIComponent(opType)}&nextOperator=${encodeURIComponent(nextOperator)}&operator=${encodeURIComponent(operator)}&opinion=${encodeURIComponent(opinion)}`);
        let urlStr = `&transNo=${transNo}&status=${status}`;
        return callApi(KFGL_STORETRANS_SUBMITSTORETRANSINFO + urlStr, fetchOptions);
    },
    // 盘点 api
    findStoreCheck: values => {
        values.page = DEFAULT_PAGE;
        values.rows = DEFAULT_PAGESIZE;
        let fetchOptions = getPublishFetchOptions(urlEncoded(values));
        return callApi(KFGL_STORECHECK_FINDSTORECHECK, fetchOptions);
    },
    storeCheckFindRoom: ({ user = "" }) => {
        let fetchOptions = getPublishFetchOptions(`user=${encodeURIComponent(user)}`);
        return callApi(KFGL_STORECHECK_FINDROOM, fetchOptions);
    },
    storeCheckFindStoreRoom: ({ user = "" }) => {
        let fetchOptions = getPublishFetchOptions(`user=${encodeURIComponent(user)}`);
        return callApi(KFGL_STORECHECK_FINDSTOREROOM, fetchOptions);
    },
    storeCheckFindSheet: ({ user = "", storeRoomId = "", sheetName = ""}) => {
        let fetchOptions = getPublishFetchOptions(`user=${encodeURIComponent(user)}&storeRoomId=${storeRoomId}&sheetName=${sheetName}`);
        return callApi(KFGL_STORECHECK_FINDSHEET, fetchOptions);
    },
    storeCheckFindDeviceType: values => {
        values.page = DEFAULT_PAGE;
        values.rows = DEFAULT_PAGESIZE;
        let fetchOptions = getPublishFetchOptions(urlEncoded(values));
        return callApi(KFGL_STORECHECK_FINDDEVICETYPE, fetchOptions);
    },
    findStoreCheckInfo: ({ user = "", checkNo = "", operateType = ""}) => {
        let fetchOptions = getPublishFetchOptions(`user=${encodeURIComponent(user)}`);
        let urlStr = `&checkNo=${checkNo}&operateType=${operateType}`;
        return callApi(KFGL_STORECHECK_FINDSTORECHECKINFO + urlStr, fetchOptions);
    },
    findStoreCheckDetail: ({ user = "", page = DEFAULT_PAGE, rows = 100, checkNo = "", sourceType = ""}) => {
        let fetchOptions = getPublishFetchOptions(`user=${encodeURIComponent(user)}&page=${page}&rows=${rows}`);
        let urlStr = `&checkNo=${checkNo}&sourceType=${sourceType}`;
        return callApi(KFGL_STORECHECK_FINDSTORECHECKDETAIL + urlStr, fetchOptions);
    },
    findStoreCheckDetailForType1: ({ user = "", page = DEFAULT_PAGE, rows = DEFAULT_PAGESIZE, checkNo = "", sourceType = "1"}) => {
        let fetchOptions = getPublishFetchOptions(`user=${encodeURIComponent(user)}&page=${page}&rows=${rows}`);
        let urlStr = `&checkNo=${checkNo}&sourceType=${sourceType}`;
        return callApi(KFGL_STORECHECK_FINDSTORECHECKDETAIL + urlStr, fetchOptions);
    },
    findStoreCheckTrack: ({ user = "", checkNo = ""}) => {
        let fetchOptions = getPublishFetchOptions(`user=${encodeURIComponent(user)}`);
        let urlStr = `&checkNo=${checkNo}`;
        return callApi(KFGL_STORECHECK_FINDSTORECHECKTRACK + urlStr, fetchOptions);
    },
    deleteStoreCheckInfo: ({ user = "", checkNo = "" }) => {
        let fetchOptions = getPublishFetchOptions(`user=${encodeURIComponent(user)}`);
        let urlStr = `&checkNo=${checkNo}`;
        return callApi(KFGL_STORECHECK_DELETESTORECHECKINFO + urlStr, fetchOptions);
    },
    saveStoreCheckInfo: values => {
        let fetchOptions = getPublishFetchOptions(values);
        return callApi(KFGL_STORECHECK_SAVESTORECHECKINFO, fetchOptions);
    },
    submitStorecheck: ({ user = "", checkNo = "", status = "", opType = "", nextOperator = "", opinion = "" }) => {
        let fetchOptions = getPublishFetchOptions(`user=${encodeURIComponent(user)}&opType=${encodeURIComponent(opType)}&nextOperator=${encodeURIComponent(nextOperator)}&opinion=${encodeURIComponent(opinion)}`);
        let urlStr = `&checkNo=${checkNo}&status=${status}`;
        return callApi(KFGL_STORECHECK_SUBMITSTORECHECK + urlStr, fetchOptions);
    },
    updateStoreCheckDetail: ({ user = "", checkNo = "", summaryNo = "", summaryNum = ""}) => {
        let fetchOptions = getPublishFetchOptions(`user=${encodeURIComponent(user)}`);
        let urlStr = `&checkNo=${checkNo}&summaryNo=${summaryNo}&summaryNum=${summaryNum}`;
        return callApi(KFGL_STORECHECK_UPDATESTORECHECKDETAIL + urlStr, fetchOptions);
    },
    getStoreCheckOperate: ({ user = "", status = "" }) => {
        let fetchOptions = getPublishFetchOptions(`user=${encodeURIComponent(user)}`);
        return callApi(KFGL_STORECHECK_GETSTORECHECKOPERATE + `&status=${status}`, fetchOptions);
    },
    storeCheckFindOperaters: ({ user = "", checkNo = "", status = "", opType = "" }) => {
        let fetchOptions = getPublishFetchOptions(`user=${encodeURIComponent(user)}`);
        let urlStr = `&checkNo=${checkNo}&status=${status}&opType=${opType}`;
        return callApi(KFGL_STORECHECK_FINDOPERATERS + urlStr, fetchOptions);
    },
    findSheetsByCheckNo: ({ user = "", checkNo = "" }) => {
        let fetchOptions = getPublishFetchOptions(`user=${encodeURIComponent(user)}`);
        let urlStr = `&checkNo=${checkNo}`;
        return callApi(KFGL_STORECHECK_FINDSHEETSBYCHECKNO + urlStr, fetchOptions);
    },
    // 标准化施工
    findToFollowUpList: ({ user = "", page = DEFAULT_PAGE, rows = DEFAULT_PAGESIZE }) => {
        let fetchOptions = getPublishFetchOptions(`user=${encodeURIComponent(user)}&page=${page}&rows=${rows}`);
        return callApi(SGGL_00_FINDTOFOLLOWUPLIST, fetchOptions);
    },
    findFollowUpHisList: values => {
        values.page = DEFAULT_PAGE;
        values.pagesize = DEFAULT_PAGESIZE;
        let fetchOptions = getPublishFetchOptions(urlEncoded(values));
        return callApi(SGGL_01_FINDFOLLOWUPHISLIST, fetchOptions);
    },
    showConstructFormInfo: ({ user = "", sggl_tag = "", sr_id = "", displayCode = 1 }) => {
        let fetchOptions = getPublishFetchOptions(`user=${encodeURIComponent(user)}&sggl_tag=${encodeURIComponent(sggl_tag)}&sr_id=${encodeURIComponent(sr_id)}&displayCode=${encodeURIComponent(displayCode)}`);
        return callApi(SGGL_02_SHOWCONSTRUCTFORMINFO, fetchOptions);
    },
    toConstructPrepare: values => {
        let fetchOptions = getPublishFetchOptions(urlEncoded(values));
        return callApi(SGGL_03_TO_CONSTRUCT_PREPARE, fetchOptions);
    },
    // 04
    toCheckBeforeConstructApi: values => {
        let fetchOptions = getPublishFetchOptions(values);
        return callApi(SGGL_04_TO_CHECK_BEFORE_CONSTRUCT, fetchOptions);
    },
    toEndByException: values => {
        let fetchOptions = getPublishFetchOptions(values);
        return callApi(SGGL_05_END_BY_EXCEPTION, fetchOptions);
    },
    exitConstruct: values => {
        let fetchOptions = getPublishFetchOptions(values);
        return callApi(SGGL_06_EXIT_CONSTRUCT, fetchOptions);
    },
    // 07
    constructPlanApi: values => {
        let fetchOptions = getPublishFetchOptions(values);
        return callApi(SGGL_07_CONSTRUCT_PLAN, fetchOptions);
    },
    showStepInfoApi: values => {
        let fetchOptions = getPublishFetchOptions(values);
        return callApi(SGGL_08_SHOW_STEP_INFO, fetchOptions);
    },
    // 09
    toCheckAfterConstructApi: values => {
        let fetchOptions = getPublishFetchOptions(values);
        return callApi(SGGL_09_CHECK_AFTER_CONSTRUCT, fetchOptions);
    },
    // 10
    constructSupervisionRecordApi: values => {
        let fetchOptions = getPublishFetchOptions(values);
        return callApi(SGGL_10_CONSTRUCT_SUPERVISION_RECORD, fetchOptions);
    },
    // 12
    showManualApi: values => {
        let fetchOptions = getPublishFetchOptions(values);
        return callApi(SGGL_12_SHOW_MANUAL, fetchOptions);
    },
    //15
    findSupervisionListApi: values => {
        let fetchOptions = getPublishFetchOptions(values);
        return callApi(SGGL_15_FIND_SUPERVISION_LIST, fetchOptions);
    },
    endManualApi: values => {
        let fetchOptions = getPublishFetchOptions(values);
        return callApi(SGGL_16_END_MANUAL, fetchOptions);
    },
    confirmSupervisionApi: values => {
        let fetchOptions = getPublishFetchOptions(values);
        return callApi(SGGL_17_CONFIRM_SUPERVISION, fetchOptions);
    },
    // tools
    uploadImages: (images,sr_id) => {
        if (!images || images.length === 0) { return Promise.resolve(null); }

        let promises = images.map((image) => {
            let formData = new FormData();
            formData.append("file", {
                type: "image/jpg",
                name: image.filename,
                uri: image.uri
            });
            let fetchOptions = getUploadFetchOptions(formData);
            let upload_path = SGGL_PICS_PATH + "?sr_id=" + sr_id;
            return callApi(upload_path, fetchOptions);
        });
        return Promise.all(promises);
    }
};

function urlEncoded(values) {
    return formUrlEncoded(values, { ignorenull : true, skipIndex: true, sorted: false });
}
