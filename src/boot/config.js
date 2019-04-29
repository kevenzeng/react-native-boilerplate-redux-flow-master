/* api 开始 */


// export const DOMAIN_ROOT = "10.132.8.16";
export const DOMAIN_ROOT = "www.smallforest.cn";
// export const DOMAIN_ROOT = "192.168.191.1";
// export const DOMAIN_ROOT = "http://10.132.8.73/nzx/";
// export const DOMAIN_ROOT = "http://10.132.8.10/nzx/";
// export const DOMAIN_ROOT = "http://192.168.191.1/nzx/";

// 登录
export const LOGIN = "/nzx/Android/AndroidLogin.php";

export const ANDROID_ROOT = "/nzx/Android/AndroidApi.php?method=";

// 手机图片存储地址
export const SCGL_PICS = "/nzx/yunwei/scgl/";

// 监理图片存储地址
export const SGGL_PICS_PATH = "/nzx/yunwei/sggl_new/ajax.php";

// 待办数量
export const FOLLOW_UP_COUNT_URL = ANDROID_ROOT + "getFollowUpCount";

// 库存管理 入库 根地址
export const KFGL_STOREIN_ROOT = "/nzx/yunwei/kfgl/kfgl_storein/controller/storein_controller.php?method=";

// 用途：按条件查询入库单列表
export const KFGL_STOREIN_FINDSTOREIN = KFGL_STOREIN_ROOT + "findStoreIn";

// 备件类型列表分页查询
// 用途：在入库单中编辑时，添加入库明细记录可从备件类型中选择。
export const KFGL_STOREIN_FINDDEVIDETYPE = KFGL_STOREIN_ROOT + "findDeviceType";

// 备件库存查询(分页)
// 用途：用于施工入库单，添加备件明细信息时，从库存中添加显示的记录。
export const KFGL_STOREIN_FINDDEVICE = KFGL_STOREIN_ROOT + "findDevice";

// 库房查询（下拉列表）
// 用途：下拉库房列表中显示（不分页）
export const KFGL_STOREIN_FINDSTOREROOM = KFGL_STOREIN_ROOT + "findStoreRoom";

// 库房查询（下拉列表）
// 用途：下拉库房列表中显示（不分页）
export const KFGL_STOREIN_FINDROOM = KFGL_STOREIN_ROOT + "findRoom";

// 货架分页查询
// 用途：用于在入库明细信息中，填写货架时，可供选择。
export const KFGL_STOREIN_FINDSHEET = KFGL_STOREIN_ROOT + "findSheet";

// 查找入库单信息（单条）
// 用途：查看/编辑修改入库单，显示各个详细信息 ?method=findStoreInInfo&inNo=I20180525002
export const KFGL_STOREIN_FINDSTOREININFO = KFGL_STOREIN_ROOT + "findStoreInInfo";

// 查找入库备件明细列表
// 用途：用于修改入库单时显示入库备件明细列表 ?method=findStoreInDetail&inNo=I20180525002
export const KFGL_STOREIN_FINDSTOREINDETAIL = KFGL_STOREIN_ROOT + "findStoreInDetail";

// 查找入库单流程流转记录列表
// 用途：在入库单详细信息中，显示流程流转记录列表 ?method=findStoreInTrack&inNo=I20180525002
export const KFGL_STOREIN_FINDSTOREINTRACK = KFGL_STOREIN_ROOT + "findStoreInTrack";

// 删除入库单（单条）
// ?method=deleteStoreInInfo&inNo=I20180525002
// 用途：当入库单状态为“申请中”，而当前登录用户是入库申请人，或库房管理员时，可删除入库单信息包括所有与该入库单关联的信息。
export const KFGL_STOREIN_DELETESTOREININFO = KFGL_STOREIN_ROOT + "deleteStoreInInfo";

// 保存入库单
// 用途：当入库状态为申请中或复核中时，可以保存入库单的信息。
export const KFGL_STOREIN_SAVESTOREININFO = KFGL_STOREIN_ROOT + "saveStoreInInfo";

// 提交入库单
// 用途：用户提交入库单时，根据提交操作类型和入库单当前状态来使入库单变为下一个环节状态。
export const KFGL_STOREIN_SUBMITSTOREIN = KFGL_STOREIN_ROOT + "submitStorein";

// 获取入库处理操作列表
// 用途：根据入库单状态来获取当前环节下的可操作的类型列表
export const KFGL_STOREIN_GETSTOREINOPERATE = KFGL_STOREIN_ROOT + "getStoreInOperate";

export const KFGL_STOREIN_FINDOPERATORS = KFGL_STOREIN_ROOT + "findOperaters";

/*
  入库管理 api 结束
  出库管理 api 开始
*/

// 库存管理 出库 根地址
export const KFGL_STOREOUT_ROOT = "/nzx/yunwei/kfgl/kfgl_storeout/controller/storeout_controller.php?method=";

// 用途：按条件查询出库单列表
export const KFGL_STOREOUT_FINDSTOREOUT = KFGL_STOREOUT_ROOT + "findStoreOut";

// 备件库存分页查询
// 用途：用于添加备件明细信息时，从库存中添加显示的记录。(只能查找状态为在库的备件)
export const KFGL_STOREOUT_FINDDEVICE = KFGL_STOREOUT_ROOT + "findDevice";

// 查找全部库房
// 用途：在需要使用库房查询时，可选择的库房id和名称列表，（因为库房数量少，所以不需分页）
export const KFGL_STOREOUT_FINDSTOREROOM = KFGL_STOREOUT_ROOT + "findStoreRoom";

// 查找出库单信息（单条）
// 用途：查看/编辑修改出库单，显示各个详细信息 ?method=findStoreInInfo&inNo=I20180525002
export const KFGL_STOREOUT_FINDSTOREOUTINFO = KFGL_STOREOUT_ROOT + "findStoreOutInfo";

// 查找出库备件明细列表
// 用途：用于在修改/编辑/显示出库单时，显示已保存的备件明细信息
export const KFGL_STOREOUT_FINDSTOREOUTDETAIL = KFGL_STOREOUT_ROOT + "findStoreOutDetail";

// 查找出库单流程流转记录列表
// 用途：用于在修改、显示出库单时，显示的流程流转记录，列表显示，不分页
export const KFGL_STOREOUT_FINDSTOREOUTTRACK = KFGL_STOREOUT_ROOT + "findStoreOutTrack";

// 删除出库单（单条）
// 用途：用于在显示出库单列表时，选择一条记录删除操作。（仅出库单在申请中状态下才能删除）
export const KFGL_STOREOUT_DELETESTOREOUTINFO = KFGL_STOREOUT_ROOT + "deleteStoreOutInfo";

// 获取出库处理操作列表
// 用途：用于在出库单修改/显示界面中，出库单的当前处理人是当前用户时，需要提交操作，可供选择的列表
export const KFGL_STOREOUT_GETSTOREOUTOPERATE = KFGL_STOREOUT_ROOT + "getStoreOutOperate";

// 获取出库下一步处理人列表
// 用途：用于在出库单修改/显示界面中，当选择了处理操作项后，获取可供选择的下一步处理人列表
export const KFGL_STOREOUT_FINDOPERATORS = KFGL_STOREOUT_ROOT + "findOperaters";

// 保存出库信息
// 用途：在出库单详情界面中，保存功能
export const KFGL_STOREOUT_SAVESTOREOUTINFO = KFGL_STOREOUT_ROOT + "saveStoreOutInfo";

// 提交出库单
// 用途：用于提交出库单的操作信息，包括操作类型、下一步处理人、处理意见等，出库单提交后，进入下一个环节。
export const KFGL_STOREOUT_SUBMITSTOREOUT = KFGL_STOREOUT_ROOT + "submitStoreout";

// 库存管理 url
export const KFGL_DEVICE_ROOT = "/nzx/yunwei/kfgl/kfgl_device/controller/device_controller.php?method=";

// 查找库存列表（分页）
// 用途：用于在库存管理中输入各种查询条件查询库存
export const KFGL_DEVICE_FINDDEVICE = KFGL_DEVICE_ROOT + "findDevice";

// 查找库房列表
// 用途：下拉库房列表中显示（不分页）
export const KFGL_DEVICE_FINDSTOREROOM = KFGL_DEVICE_ROOT + "findStoreRoom";

// 查找货架列表
// 用途：通过库房id查询货架列表，即库房内的货架列表
export const KFGL_DEVICE_FINDSHEET = KFGL_DEVICE_ROOT + "findSheet";

// 获取备件库存详细信息（单条）
// 用途：查看备件详细信息，只读显示。
export const KFGL_DEVICE_FINDDEVICEINFO = KFGL_DEVICE_ROOT + "findDeviceInfo";


// 移库管理 url
export const KFGL_STORETRANS_ROOT = "/nzx/yunwei/kfgl/kfgl_storetrans/controller/storetrans_controller.php?method=";

// 查找移库单
export const KFGL_STORETRANS_FINDSTORETRANS = KFGL_STORETRANS_ROOT + "findStoreTrans";

// 查找移库单信息（单条）
export const KFGL_STORETRANS_FINDSTORETRANSINFO = KFGL_STORETRANS_ROOT + "findStoreTransInfo";

// 查找移库单明细信息
export const KFGL_STORETRANS_FINDSTORETRANSDETAIL = KFGL_STORETRANS_ROOT + "findStoreTransDetail";

// 查找全部库房，填写用
export const KFGL_STORETRANS_FINDROOM = KFGL_STORETRANS_ROOT + "findRoom";

// 查找全部库房
export const KFGL_STORETRANS_FINDSTOREROOM = KFGL_STORETRANS_ROOT + "findStoreRoom";

// 查找库存信息
export const KFGL_STORETRANS_FINDDEVICE = KFGL_STORETRANS_ROOT + "findDevice";

// 查找货架信息
export const KFGL_STORETRANS_FINDSHEET = KFGL_STORETRANS_ROOT + "findSheet";

// 查找移库流程流转信息
export const KFGL_STORETRANS_TRANSTRACK = KFGL_STORETRANS_ROOT + "findStoreTransTrack";

// 获取下一步操作处理列表
export const KFGL_STORETRANS_GETSTORETRANSOPERATE = KFGL_STORETRANS_ROOT + "getStoreTransOperate";

// 获取处理人列表
export const KFGL_STORETRANS_FINDOPERATERS = KFGL_STORETRANS_ROOT + "findOperaters";

// 删除移库单(单条)
export const KFGL_STORETRANS_DELETESTORETRANSINFO = KFGL_STORETRANS_ROOT + "deleteStoreTransInfo";

// 保存移库单
export const KFGL_STORETRANS_SAVESTORETRANSINFO = KFGL_STORETRANS_ROOT + "saveStoreTransInfo";

// 提交移库单
export const KFGL_STORETRANS_SUBMITSTORETRANSINFO = KFGL_STORETRANS_ROOT + "submitStoretrans";


// 盘点 url
export const KFGL_STORECHECK_ROOT = "/nzx/yunwei/kfgl/kfgl_storecheck/controller/storecheck_controller.php?method=";

// 查找移库单
export const KFGL_STORECHECK_FINDSTORECHECK = KFGL_STORECHECK_ROOT + "findStoreCheck";

// 查找库房
export const KFGL_STORECHECK_FINDROOM = KFGL_STORECHECK_ROOT + "findRoom";

// 查找库房，有“请选择”
export const KFGL_STORECHECK_FINDSTOREROOM = KFGL_STORECHECK_ROOT + "findStoreRoom";

// 查找货架列表
export const KFGL_STORECHECK_FINDSHEET = KFGL_STORECHECK_ROOT + "findSheet";

// 备件类型列表查询
export const KFGL_STORECHECK_FINDDEVICETYPE = KFGL_STORECHECK_ROOT + "findDeviceType";

// 查找盘点单信息
export const KFGL_STORECHECK_FINDSTORECHECKINFO = KFGL_STORECHECK_ROOT + "findStoreCheckInfo";

// 查找盘点备件明细列表
export const KFGL_STORECHECK_FINDSTORECHECKDETAIL = KFGL_STORECHECK_ROOT + "findStoreCheckDetail";

// 查找盘点流程流转信息
export const KFGL_STORECHECK_FINDSTORECHECKTRACK = KFGL_STORECHECK_ROOT + "findStoreCheckTrack";

// 删除盘点单
export const KFGL_STORECHECK_DELETESTORECHECKINFO = KFGL_STORECHECK_ROOT + "deleteStoreCheckInfo";

// 保存盘点单
export const KFGL_STORECHECK_SAVESTORECHECKINFO = KFGL_STORECHECK_ROOT + "saveStoreCheckInfo";

// 提交盘点单
export const KFGL_STORECHECK_SUBMITSTORECHECK = KFGL_STORECHECK_ROOT + "submitStorecheck";

// 修改盘点明细记录数量
export const KFGL_STORECHECK_UPDATESTORECHECKDETAIL = KFGL_STORECHECK_ROOT + "updateStoreCheckDetail";

// 获取下一步操作处理列表
export const KFGL_STORECHECK_GETSTORECHECKOPERATE = KFGL_STORECHECK_ROOT + "getStoreCheckOperate";

// 获取处理人列表
export const KFGL_STORECHECK_FINDOPERATERS = KFGL_STORECHECK_ROOT + "findOperaters";

// 查找盘点单的盘点货架列表
export const KFGL_STORECHECK_FINDSHEETSBYCHECKNO = KFGL_STORECHECK_ROOT + "findSheetsByCheckNo";

// 标准化施工
// 查询待跟进施工单列表
export const SGGL_ROOT = "/nzx/yunwei/sggl_new/api/";

export const SGGL_00_FINDTOFOLLOWUPLIST = SGGL_ROOT + "findToFollowUpList.php";

export const SGGL_01_FINDFOLLOWUPHISLIST = SGGL_ROOT + "findFollowUpHisList.php";

export const SGGL_02_SHOWCONSTRUCTFORMINFO = SGGL_ROOT + "showConstructFormInfo.php";

export const SGGL_03_TO_CONSTRUCT_PREPARE = SGGL_ROOT + "toConstructPrepare.php";

export const SGGL_04_TO_CHECK_BEFORE_CONSTRUCT = SGGL_ROOT + "toCheckBeforeConstruct.php";

export const SGGL_05_END_BY_EXCEPTION = SGGL_ROOT + "endByException.php";

export const SGGL_06_EXIT_CONSTRUCT = SGGL_ROOT + "exitConstruct.php";

export const SGGL_07_CONSTRUCT_PLAN = SGGL_ROOT + "toConstructPlan.php";

export const SGGL_08_SHOW_STEP_INFO = SGGL_ROOT + "showStepInfo.php";

export const SGGL_09_CHECK_AFTER_CONSTRUCT = SGGL_ROOT + "toCheckAfterConstruct.php";

export const SGGL_10_CONSTRUCT_SUPERVISION_RECORD = SGGL_ROOT + "toConstructSupervisionRecord.php";

export const SGGL_12_SHOW_MANUAL = SGGL_ROOT + "showManual.php";

export const SGGL_15_FIND_SUPERVISION_LIST = SGGL_ROOT + "findConstructSupervisionList.php";

export const SGGL_16_END_MANUAL = SGGL_ROOT + "endManual.php";

export const SGGL_17_CONFIRM_SUPERVISION = SGGL_ROOT + "confirmSupervision.php";

export const MAX_UPLOAD_IMAGES_COUNT = 9;

export const VERSION = "v0.1.0";

export const COPY_RIGHT = `2018 - ${new Date().getFullYear()} 太极华保`;

// 流转操作类型
export const OPTYPE_STR_ARRAY = ["", "提交审批", "审批同意", "审批不同意", "取消", "关闭", "转派"];

// 入库单流转环节状态
export const ROUNDED_STATUS = ["", "未提交", "已提交"];

// 单条入库单信息入库单状态
export const STOREIN_INFO_STATUS = ["", "申请中", "申请待审批", "复核中", "复核待审批", "完成", "取消", "完成关闭", "取消关闭"];

// 审批状态
export const JUDGETOSTR = ["待审批", "通过", "不通过"];

// 复核状态
export const REVIEWTOSTR = ["处理中", "提交申请", "取消"];

// 备件类型
export const DEVICETYPETOSTR = ["", "整机", "组件", "辅助配件"];

// 库存状态
export const INSTORESTATUSTOSTR = ["", "", "在库", "全部出库"];

// 单据状态
export const RECIPIENT_STATUS = [ {
    "value": "",
    "status": "请选择"
},{
    "value": "01",
    "status": "申请中"
}, {
    "value": "02",
    "status": "申请待审批"
}, {
    "value": "03",
    "status": "复核中"
}, {
    "value": "04",
    "status": "复核待审批"
}, {
    "value": "05",
    "status": "完成"
}, {
    "value": "06",
    "status": "取消"
}, {
    "value": "07",
    "status": "完成关闭"
}, {
    "value": "08",
    "status": "取消关闭"
} ];

export const STORE_OUT_RECIPIENT_TYPE = [{
    "value": "",
    "status": "请选择"
}, {
    "value": "1",
    "status": "一般出库"
}, {
    "value": "2",
    "status": "施工出库"
}];

export const STORE_STATUS = [{
   "value": "",
   "status": "请选择"
}, {
    "value": "1",
    "status": "申请入库"
}, {
    "value": "2",
    "status": "在库"
}, {
    "value": "3",
    "status": "全部出库"
}];

export const USABILITY = [{
    "value": "",
    "status": "请选择"
}, {
    "value": "好件",
    "status": "好件"
}, {
    "value": "坏件",
    "status": "坏件"
}];

export const EXPIRE_FLAG = [{
    "value": "",
    "status": "请选择"
}, {
    "value": "0",
    "status": "否"
}, {
    "value": "1",
    "status": "是"
}];

export const DEVICE_TYPE = [{
   "value": "",
   "status": "请选择"
}, {
    "value": "1",
    "status": "整机"
}, {
    "value": "2",
    "status": "组件"
}, {
    "value": "3",
    "status": "辅助配件"
}];


// Forms Name
export const DEALWITHSTOREINFORM = "dealWithStoreIn";

export const DEALWITHSTOREOUTFORM = "dealWithStoreOut";

export const DEALWITHDEVICEFORM = "dealWithDevice";

export const DEALWITHSTORETRANSFORM = "dealWithStoreTransForm";

export const DEAL_WITH_STORE_CHECK_FORM = "dealWithStoreCheckForm";

export const FINDSHEETFORM = "findSheetForm";

export const LOGINFORM = "login";

// Screen Name
export const DEVICE_SCREEN = "kfgl_device";
export const DEAL_WITH_DEVICE_SCREEN = "DealWithDevice";

export const DEAL_WITH_STORE_IN_SCREEN = "DealWithStoreIn";

export const DEAL_WITH_STORE_OUT_SCREEN = "DealWithStoreOut";

export const DEAL_WITH_STORE_TRANS_SCREEN = "DealWithStoreTrans";

export const STORE_CHECK_SCREEN = "kfgl_storecheck";
export const DEAL_WITH_STORE_CHECK_SCREEN = "DealWithStoreCheck";
export const STORE_CHECK_TRANS_INFO_SCREEN = "StoreCheckTransInfo";
export const STORE_CHECK_ITEMS_LIST_SCREEN = "StoreCheckItemsList";

export const SGGL_00_SCREEN = "sggl_00";

export const QR_SCANNER_SCREEN = "BarCodeScanner";
