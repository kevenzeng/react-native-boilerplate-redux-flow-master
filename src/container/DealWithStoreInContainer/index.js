// @flow
import * as React from "react";
import { View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { connect } from "react-redux";
import DealWithStoreIn from "../../stories/screens/DealWithStoreIn";
import { Field, reduxForm, FieldArray, change, formValueSelector } from "redux-form";
import { Form, Text, Item, Button, Label, Picker, Icon, H3, Header, Left, Right, Body, Segment } from "native-base";
import PopupDialog, { DialogTitle } from "react-native-popup-dialog";
import { ProgressDialog } from "react-native-simple-dialogs";
import { Table, Row } from "react-native-table-component";
import renderIf from "../../services/utils/renderIf";
import { required, maxLength50CN, maxLength100CN, maxLength500CN, maxLength10CN, maxLength30, maxLength200, maxLength1000CN, postInt } from "../../services/utils/formValidateUtils";
import _ from "lodash";
import formUrlEncoded from "form-urlencoded";
import {
    renderSimpleInput,
    renderSelect,
    renderDateField,
    renderTextArea,
    renderItemDetails,
} from "../../components/formComponents/renderItems";
import LeftHeader from "../common/Header/LeftHeader";
import FindDeviceTypeForm from "../../components/formComponents/FindDeviceTypeForm";
import FindDeviceForm from "../../components/formComponents/FindDeviceForm";
import FindSheetForm from "../../components/formComponents/FindSheetForm";
import {
    JUDGETOSTR,
    REVIEWTOSTR,
    DEALWITHSTOREINFORM,
    DEVICETYPETOSTR,
    INSTORESTATUSTOSTR,
    QR_SCANNER_SCREEN,
    DEAL_WITH_STORE_IN_SCREEN
} from "../../boot/config";
import { fetchStoreInInfo } from "../../actions/storeIn/findStoreInInfoAction";
import { fetchStoreInDetail } from "../../actions/storeIn/findStoreInDetailAction";
import { fetchStoreInTrack as fetchStoreInTrackAction } from "../../actions/storeIn/findStoreInTrackAction";
import { fetchDeviceType } from "../../actions/storeIn/findDeviceTypeAction";
import { fetchDevice } from "../../actions/storeIn/findDeviceAction";
import { fetchRoom } from "../../actions/storeIn/findRoomAction";
import { fetchStoreRoom } from "../../actions/storeIn/findStoreRoomAction";
import { fetchSheet } from "../../actions/storeIn/findSheetAction";
import { fetchOperators } from "../../actions/storeIn/findOperatorsAction";
import { fetchStoreInOperation } from "../../actions/storeIn/getStoreInOperateAction";
import { toSaveStoreInInfo } from "../../actions/storeIn/saveStoreInInfoAction";
import { toDeleteStoreInInfo } from "../../actions/storeIn/deleteStoreInInfoAction";
import { toSubmitStoreIn } from "../../actions/storeIn/submitStoreInAction";
import { resetFindSheetForm } from "../../actions/formActions/resetFormAction";

export interface Props {
    navigation: any,
}

export interface State {
}

// styles
import styles from "../../styles/dealWithPages";
const {
    arrowBackFontSize, segmentStyle, segmentFirstStyle, segmentLastStyle, disableBgColor, errorBorderStyle,
    storeRoomItemStyle, storeRoomItemTextStyle,
    renderPickerStyle,
    nextOpLabelStyle,
    contentGapStyle, padding10, height20,
    itemsRowStyle, itemsRowTextStyle,
    progressDialogStyle,
    popUpTitleTextStyle, popUpContainerStyle, popUpRowStyle, popUpFindDeviceContentStyle, popUpFindRoomContentStyle
} = styles;

class DealWithStoreInForm extends React.Component<Props, State> {

    constructor(props) {
        super(props);

        this.state = {
            selected: "key0",
            currentRowOfItems: 0, // 获得当前行次序
            indexForSelectRoomAndSheet: 0,
        };
    }

    static navigationOptions = ({navigation}) => ({
        header: _.isEqual(navigation.getParam("currentOperateType"), "add")
            ? <LeftHeader navigation={navigation} headerTitle={ navigation.getParam("headerTitle") } />
            : <Header hasSegment>
                <Left style={{ flex: 1 }}>
                    <Button transparent onPress={() => navigation.goBack()}>
                        <Icon name="ios-arrow-back" style={arrowBackFontSize} />
                    </Button>
                </Left>

                <Body style={{ flex: 1 }}>
                    <Segment style={ segmentStyle }>
                        <Button active style={ segmentFirstStyle } first><Text>     入库单信息     </Text></Button>
                        <Button style={ segmentLastStyle }
                                onPress={() => {
                                    navigation.navigate("TransInfo", {
                                        "currentPage": "storeIn",
                                        "leftSegmentTitle": "     入库单信息     ",
                                        "rightSegmentTitle": "入库流程流转信息",
                                    });
                                }}
                                last>
                            <Text>入库流程流转信息</Text>
                        </Button>
                    </Segment>
                </Body>

                <Right style={{ flex: 1 }} />
            </Header>
    });

    componentDidMount() {
        // The Hidden Fields Setting
        const { getParam } = this.props.navigation;
        this.props.dispatch(change(DEALWITHSTOREINFORM, "status", getParam("currentStatus") || "01"));
        this.props.dispatch(change(DEALWITHSTOREINFORM, "operateType", getParam("currentOperateType")));
        this.props.dispatch(change(DEALWITHSTOREINFORM, "inType", getParam("currentInType")));
        this.mainRequests();
    }

    mainRequests() {
        const { getParam } = this.props.navigation;
        const { userName } = this.props.user.authorization;
        const inNo = getParam("currentInNo");
        const status = getParam("currentStatus");
        const operator = getParam("currentOperator");
        const operateType = getParam("currentOperateType");
        const currentInType = getParam("currentInType");
        if (_.isEqual(operateType, "update") && !_.isEmpty(inNo)) {
            this.props.fetchStoreInInfo({
                user: userName,
                inNo: inNo,
                operateType: "update",
            });
            this.props.fetchStoreInTrackAction({
                user: userName,
                inNo: inNo
            });

            if (_.isEqual(operator, userName)) {
                this.props.fetchStoreInOperation({
                    user: userName,
                    status: status,
                });
            }
            this.props.fetchStoreInDetail({
                user: userName,
                inNo: inNo
            });
        } else {
            // 为新建单 operation type 赋值
            this.props.dispatch(change(DEALWITHSTOREINFORM, "opType", "01"));
            // 获取新建单下一处理人
            this.props.fetchOperators({
                user: userName,
                inType: currentInType,
                status: status,
                opType: "01" // 操作类型，“提交审批”
            });
        }
    }
    /**
     * currentOperateType 表单是否为新建 add / update
    */
    isNewReceipt() {
        const operateType = this.props.navigation.getParam("currentOperateType");
        return _.isEqual("add", operateType);
    }

    /**
     * 辨识身份
     * 显示入库单，控制信息是否只读
     * 控制是否显示操作信息，不匹配不显示操作信息
     * @returns {boolean|*}
     */
    isCurrentUserAsOperator() {
        // operator 不是登录人 user 时，只显示入库单，所有信息都是只读，不显示操作信息
        const { userName } = this.props.user.authorization;
        const operator = this.props.navigation.getParam("currentOperator");
        return _.isEqual(userName, operator);
    }

    /**
     * 1. 编辑区-表单
     * 最后整体取反用于 disable
     * @returns {boolean|*}
     * */
    isEditAreaEditable() {
        const cStatus = this.props.navigation.getParam("currentStatus");
        return !(this.isCurrentUserAsOperator() && (_.includes(["01", "03"], cStatus)));
    }

    /**
     * 2. 操作信息区控制
     * - 当前处理人
     * - 下一步操作
     * - 处理意见
     * */

    // 操作信息区的显示控制
    toShowOperationArea() {
        return this.isCurrentUserAsOperator();
    }

    // 当前处理人 的显示
    toShowCurrentOperatorControl() {
        const cStatus = this.props.navigation.getParam("currentStatus");
        return !(_.includes(["07", "08"], cStatus));
    }

    // 下一步操作 的显示
    toShowNextOperationControl() {
        const cStatus = this.props.navigation.getParam("currentStatus");
        return !(_.includes(["07", "08"], cStatus));
    }

    // 下一步处理人 & 处理意见 的显示
    toShowNextOperatorControl() {
        const cStatus = this.props.navigation.getParam("currentStatus");
        return !(_.includes(["05", "06", "07", "08"], cStatus)) &&
            !(_.isEqual(cStatus, "01") && _.isEqual(this.props.currentOperateTypeFromPicker, "05")); // 申请中关闭
    }

    // 库存、货架和归属单位填写控制 true: not required
    isStoreRoomRequired() {
        const { getParam } = this.props.navigation;
        const cInType = getParam("currentInType");
        const cStatus = getParam("currentStatus");
        return (_.isEqual(cInType, "1") && _.isEqual(cStatus, "01")) || !(_.includes(["01", "03"], cStatus));
    }

    // 根据单据状态进行控制
    receiptTypeControl() {
        const cInType = this.props.navigation.getParam("currentInType");
        return _.isEqual(cInType, "2");
    }

    // Render Local Redux Form Components
    renderItemStoreRoom = ({ input: { onFocus, value , ...restInput }, itemStyle, label, type, disable, placeHolder, necessary, currentRowIndex, meta: { touched, error, warning }}) => (
        <Item regular style={[storeRoomItemStyle, itemStyle && itemStyle]}>
            <Button transparent dark
                    onPress={
                        () => {
                            this.setState({ indexForSelectRoomAndSheet: currentRowIndex });
                            this.storeRoomInfoDialog.show();
                        }
                    }
                    disabled={disable}
                    style={[ touched && error && errorBorderStyle
                    , disable && disableBgColor
                    , {
                        width: "100%",
                        height: "100%",
                        justifyContent: "center",
                    } ]}
            >
                <Text style={[storeRoomItemTextStyle, disable && { color: "#666666" }]}{...restInput}>
                    {value}
                </Text>
            </Button>
        </Item>
    );

    renderItemSheet = ({ input: { onFocus, value, ...restInput }, itemStyle, label, type, disable, placeHolder, necessary, currentRowIndex, meta: { touched, error, warning }}) => (
        <Item regular style={[storeRoomItemStyle, itemStyle && itemStyle]}>
            <Button transparent dark
                    onPress={ () => {
                        this.setState({ indexForSelectRoomAndSheet: currentRowIndex });
                        this.sheetSelectionDialog.show();
                    }}
                    disabled={disable}
                    style={[ touched && error && errorBorderStyle
                    , disable && disableBgColor
                    , {
                        width: "100%",
                        height: "100%",
                        justifyContent: "center",
                    } ]}
            >
                <Text style={[storeRoomItemTextStyle, disable && { color: "#666666" }]}{...restInput}>
                    {value}
                </Text>
            </Button>
        </Item>
    );

    renderItems = ({ fields, meta: { error, } }) => (
        <View>
            <View>
                {fields.map((item, index) => (
                    <View name={item} key={`${index}`} style={{ flexDirection: "row", width: "100%" }}>
                        <Field name={`${item}.summaryNo`} disable type="text" label="备件汇总号" component={renderItemDetails} itemStyle={{ flex: 2.5 }} />
                        <Field name={`${item}.deviceName`} disable type="text" label="备件名称" component={renderItemDetails} itemStyle={{ flex: 2.5 }} />
                        <Field name={`${item}.summaryNum`} disable={this.isEditAreaEditable()} type="text" label="入库数量" validate={[required, postInt]} component={renderItemDetails} itemStyle={{ flex: 1 }} />
                        <Field name={`${item}.unitName`} disable type="text" label="单位" component={renderItemDetails} itemStyle={{ flex: 0.5 }} />
                        <Field name={`${item}.validMonths`} disable={this.isEditAreaEditable()} type="text" label="有效月数" component={renderItemDetails} itemStyle={{ flex: 1 }} validate={[required]} />
                        <Field name={`${item}.roomName`} disable={this.isEditAreaEditable()} type="text" label="库房" component={this.renderItemStoreRoom} itemStyle={{ flex: 2 }} currentRowIndex={index} validate={this.isStoreRoomRequired() ? [] : [required]} />
                        <Field name={`${item}.sheetName`} disable={this.isEditAreaEditable()} type="text" label="货架" component={this.renderItemSheet} itemStyle={{ flex: 2 }} currentRowIndex={index} validate={this.isStoreRoomRequired() ? [] : [required]} />
                        <Field name={`${item}.deviceSN`} disable={this.isEditAreaEditable()} type="text" label="SN/PN" component={renderItemDetails} itemStyle={{ flex: 2 }} />
                        <Field name={`${item}.usability`} disable type="text" label="可用性" component={renderItemDetails} itemStyle={{ flex: 1 }} />
                        <Field name={`${item}.belongUnit`} disable={this.isEditAreaEditable()} type="text" label="归属单位" component={renderItemDetails} itemStyle={{ flex: 1 }} validate={this.isStoreRoomRequired() ? [] : [required]} />
                        <Button disabled={this.isEditAreaEditable()} style={{ flex: 0.7, height: "100%", justifyContent: "center", borderColor: "#E5E5E5", borderWidth: 1, borderTopWidth: 0 }} transparent onPress={() => {
                            fields.remove(index);
                        }}>
                            <Icon name="md-remove-circle" style={[ this.isEditAreaEditable() ? {color: "gray"} : {color: "red"}]} />
                        </Button>
                    </View>
                ))}
            </View>
            {renderIf(!this.isEditAreaEditable())(
                <View style={{  borderColor: "#E5E5E5", borderWidth: 1, borderTopWidth: 0, width: "100%", flexDirection: "row" }}>
                    <Button disabled={this.isEditAreaEditable()} transparent danger
                            onPress={ () => {
                                this.setState({ currentRowOfItems: fields.length });
                                this.findDeviceTypeDialog.show();
                            }} style={{ width: "100%", justifyContent: "center", flex: 1 }}>
                        <Text>+添加备件</Text>
                    </Button>
                    {renderIf(this.receiptTypeControl())(
                        <Button transparent danger
                                onPress={ () => {
                                    this.setState({ currentRowOfItems: fields.length });
                                    this.findDeviceDialog.show();
                                }
                                } style={{ width: "100%", justifyContent: "center", flex: 1 }}
                        >
                            <Text>+从库房添加备件</Text>
                        </Button>
                    )}
                    {renderIf(this.receiptTypeControl())(
                        <Button transparent danger
                                onPress={ () => {
                                    this.setState({ currentRowOfItems: fields.length });
                                    this.props.navigation.navigate(QR_SCANNER_SCREEN, { routeName: DEAL_WITH_STORE_IN_SCREEN, currentRowOfItems: fields.length });
                                }
                                } style={{ width: "100%", justifyContent: "center", flex: 1 }}
                        >
                            <Text>+二维码添加备件</Text>
                        </Button>
                    )}
                </View>
            )}
        </View>
    );

    renderNextOperationSel = ({ input, disable, label, children, meta: { touched, error }, ...custom }) => (
        <Picker style={[touched && error && errorBorderStyle, renderPickerStyle]}
                mode="dropdown" {...input}
                selectedValue={input.value}
                enabled={ !disable }
                onValueChange={(value) => {
                    setTimeout(() => {
                        input.onChange(value);
                        if (!_.isEqual(value, "05")) {
                            this.props.fetchOperators({
                                user: this.props.user.authorization.userName,
                                inType: this.props.navigation.getParam("currentInType"),
                                inNo: this.props.navigation.getParam("currentInNo"),
                                status: this.props.navigation.getParam("currentStatus"),
                                opType: value
                            });
                        }
                    }, 10);
                }} children={children} {...custom} />
    );

    saveHelper(values) {
        const { getParam } = this.props.navigation;
        let tempValues = _.cloneDeep(values); // 不能直接操作 values
        let formattedValues = {
            "sourceType": [],
            "summaryNo": [],
            "summaryNum": [],
            "oldSummaryNum": [],
            "storeRoomId": [],
            "sheetId": [],
            "deviceTypeId": [],
            "deviceSN": [],
            "unitName": [],
            "validMonths": [],
            "usability": [],
            "belongUnit": [],
        };
        let { storeInItems } = tempValues;
        if (_.isEmpty(storeInItems)) {
            Alert.alert(
                "表单填写错误",
                "请添加至少一条入库明细信息",
                [{
                  text: "确认",
                  onPress: () => {}
                }]
            );
            return;
        }
        for ( let item in storeInItems) {
            formattedValues.sourceType.push(storeInItems[item].sourceType || "");
            formattedValues.summaryNo.push(storeInItems[item].summaryNo || "");
            formattedValues.summaryNum.push(storeInItems[item].summaryNum || "");
            formattedValues.oldSummaryNum.push(storeInItems[item].oldSummaryNum || "");
            formattedValues.storeRoomId.push(storeInItems[item].storeRoomId || "");
            formattedValues.sheetId.push(storeInItems[item].sheetId || "");
            formattedValues.deviceTypeId.push(storeInItems[item].deviceTypeId || "");
            formattedValues.deviceSN.push(storeInItems[item].deviceSN || "");
            formattedValues.validMonths.push(storeInItems[item].validMonths || "");
            formattedValues.unitName.push(storeInItems[item].unitName || "");
            formattedValues.usability.push(storeInItems[item].usability || "");
            formattedValues.belongUnit.push(storeInItems[item].belongUnit || "");
        }
        delete tempValues.storeInItems;
        formattedValues = { ...tempValues, ...formattedValues };
        formattedValues.user = this.props.user.authorization.userName;
        formattedValues.operateType = getParam("currentOperateType");
        formattedValues.inType = getParam("currentInType");
        this.props.toSaveStoreInInfo(formUrlEncoded(formattedValues, { ignorenull : true, skipIndex: true, sorted: false }));
    }

    deleteHelper() {
        const inNo = this.props.navigation.getParam("currentInNo");
        const { userName } = this.props.user.authorization;
        this.props.toDeleteStoreInInfo({
            user: userName,
            inNo: inNo
        });
        this.props.navigation.goBack();
    }

    submitHelper(values) {
        const { getParam } = this.props.navigation;
        const cStatus = getParam("currentStatus");
        const operator = getParam("currentOperator");
        const currentInType = getParam("currentInType");
        const currentInNo = getParam("currentInNo");
        const { userName } = this.props.user.authorization;
        const { currentOperateTypeFromPicker,
            currentOpinion,
            currentNextOperator
        } = this.props;

        let submittedObj = {
            user: userName,
            inNo: currentInNo,
            inType: currentInType,
            opType: currentOperateTypeFromPicker,
            status: cStatus,
        };

        if (_.includes(["01", "03"], cStatus)) {
            this.saveHelper(values);
        }
        if (!_.isEqual(cStatus, "05") &&
            !_.isEqual(cStatus, "06") &&
            !_.isEqual(currentOperateTypeFromPicker, "05"))
        {
            submittedObj.operator = operator;
            submittedObj.nextOperator = currentNextOperator;
            submittedObj.opinion = currentOpinion;
        } else {
            submittedObj.operator = null;
        }
        this.props.toSubmitStoreIn(submittedObj);
    }

    render() {
        const { handleSubmit } = this.props;
        const { userName } = this.props.user.authorization;

        // loader controller
        const isFetching = this.props.findStoreInTrack.isFetching ||
            this.props.isFindStoreInInfoFetching ||
            this.props.findDeviceType.isFetching ||
            this.props.findDevice.isFetching ||
            this.props.nextOperator.isFetching ||
            this.props.saveStoreIn.isFetching ||
            this.props.submitStoreIn.isFetching ||
            this.props.findRoom.isFetching ||
            this.props.findSheet.isFetching;

        const popUpDeviceType = ["整机", "组件", "辅助配件"]; // 下拉列表

        // Tables Header
        const findDeviceTypeTableHeader = ["", "备件名称", "厂商", "设备型号", "有效月数", "类型"]; // 备件
        const findDeviceTableHeader = ["", "备件汇总号", "备件名称", "厂商", "库存数量", "单位" , "有效月数", "可用性", "适用设备", "类型", "库房", "货架", "归属单位", "过期日期", "状态"]; // 库存
        const findRoomHeader = ["", "库房名称", "库房楼层", "面积"]; // 库房
        const findSheetHeader = ["", "库房名称", "库房楼层", "货架名称", "货架备注"]; // 货架

        // Tables Column Width
        const findDeviceTypeTableColWidthArr = [1, 3, 2, 3, 2, 2];
        const findDeviceTableColWidthArr = [20, 120, 120, 90, 60, 30, 60, 60, 60, 70, 100, 70, 70, 90, 70];
        const findRoomColWidthArr = [1, 3, 2, 2];
        const findSheetColWidthArr = [1, 3, 2, 3, 2];

        // Tables Row Data
        let findDeviceTypeTableData = [];
        let findDeviceTableData = [];
        let findRoomTableData = [];
        let findSheetTableData = [];

        // Construct Table Data
        // 从备件类型
        this.props.findDeviceType.list.map(
            (row, index) => {
                let tempArr = [], tempObj = {
                    index: "",
                    deviceName: "",
                    brandName: "",
                    deviceModel: "",
                    validMonths: "",
                    deviceType: "",
                    unitName: "",
                    deviceTypeId: "",
                };
                tempObj.index = index + 1;
                tempObj.deviceName = row.deviceName; // 1 备件名称
                tempObj.brandName = row.brandName; // 2 厂商名称
                tempObj.deviceModel = row.deviceModel; // 3 适用设备型号
                tempObj.validMonths = row.validMonths; // 4 有效月数
                tempObj.deviceType = popUpDeviceType[row.deviceType - 1]; // 5 备件类型
                tempObj.unitName = row.unitName; // 6 数量单位
                tempObj.deviceTypeId = row.id; // 7 备件类型ID

                Object.entries(tempObj).forEach(([key, value]) => {
                    tempArr.push(value);
                });

                findDeviceTypeTableData.push(tempArr);
            }
        );

        // 从库存
        this.props.findDevice.list.map(
            (row, index) => {
                let tempArr = [], tempObj = {
                    index: "",
                    summaryNo: "",
                    deviceName: "",
                    brandName: "",
                    summaryNum: "",
                    unitName: "",
                    validMonths: "",
                    usability: "",
                    deviceModel: "",
                    deviceType: "",
                    roomName: "",
                    sheetName: "",
                    belongUnit: "",
                    expireDate: "",
                    status: "",
                    deviceSN: "",
                    storeRoomId: "",
                    sheetId: "",
                    deviceTypeId: "",
                };
                tempObj.index = index + 1; // 0 表索引
                tempObj.summaryNo = row.summaryNo; // 1 备件汇总号
                tempObj.deviceName = row.deviceName; // 2 备件名称
                tempObj.brandName = row.brandName; // 3 厂商
                tempObj.summaryNum = row.summaryNum; // 4 库存数量
                tempObj.unitName = row.unitName; // 5 单位
                tempObj.validMonths = row.validMonths; // 6 有效月数
                tempObj.usability = row.usability; // 7 可用性
                tempObj.deviceModel = row.deviceModel === "deviceMode" ? "无" : row.deviceModel; // 8 适用设备
                tempObj.deviceType = DEVICETYPETOSTR[row.deviceType]; // 9 类型，只负责显示，不需要当作请求参数返回
                tempObj.roomName = row.roomName; // 10 库房名称
                tempObj.sheetName = row.sheetName; // 11 货架名称
                tempObj.belongUnit = row.belongUnit; // 12 归属单位
                tempObj.expireDate = row.expireDate; // 13 过期日期
                tempObj.status = INSTORESTATUSTOSTR[row.status]; // 14 状态
                tempObj.deviceSN = row.deviceSN; // 15 状态
                tempObj.storeRoomId = row.storeRoomId; // 16 库房 id，保存不显示
                tempObj.sheetId = row.sheetId; // 17 货架 id, 保存不显示
                tempObj.deviceTypeId = row.deviceTypeId; // 18 设备 id, 保存不显示

                Object.entries(tempObj).forEach(([key, value]) => {
                    tempArr.push(value);
                });

                findDeviceTableData.push(tempArr);
            }
        );

        // 选库房
        this.props.findRoom.list.map((row, index) => {
            let tempArr = [], tempObj = {
                index : "",
                roomName: "",
                roomLevel: "",
                roomArea: "",
                id: ""
            };
            tempObj.index = index;
            tempObj.roomName = row.roomName;
            tempObj.roomLevel = row.roomLevel;
            tempObj.roomArea = row.roomArea;
            tempObj.id = row.id;

            Object.entries(tempObj).forEach(([key, value]) => {
                tempArr.push(value);
            });

            findRoomTableData.push(tempArr);
        });

        // 选货架
        this.props.findSheet.list.map((row, index) => {
            let tempArr = [], tempObj = {
                index: "",
                roomName: "",
                roomLevel: "",
                sheetName: "",
                remark: "",
                sheetId: "",
                roomId: "",
            };
            tempObj.index = index;
            tempObj.roomName = row.roomName; // 1 库房名称
            tempObj.roomLevel = row.roomLevel; // 2 楼层
            tempObj.sheetName = row.sheetName; // 3 货架名称
            tempObj.remark = row.remark; // 4 货架标注
            tempObj.sheetId = row.sheetId; // 5 货架 id
            tempObj.roomId = row.storeRoomId; // 6 库房 id

            Object.entries(tempObj).forEach(([key, value]) => {
                tempArr.push(value);
            });

            findSheetTableData.push(tempArr);
        });

        // 为新建单设置默认操作
        let opTypePickerItem = [];
        if (this.props.navigation.getParam("currentOperateType") === "update") {
            opTypePickerItem = this.props.getStoreInOperate.list.map((value, key) => {
                    return <Picker.Item label={`${value.operateTypeName}`}
                                        value={value.operateType} key={key}/>;
            });
        } else {
            opTypePickerItem = [<Picker.Item label = "请选择" value="" key={"0"} />, <Picker.Item label = "提交审批" value="01" key={"1"}/>];
        }

        const tableHeader = ["备件汇总号", "备件名称", "入库数量", "单位", "有效月数", "库房", "货架", "SN/PN", "可用性", "归属单位", "操作"];

        const form = (
            <Form>
                <Field name="inNo" disable type="input" label="入库单号" component={renderSimpleInput} />
                <Field name="applyDate" disable type="text" label="申请日期" component={renderDateField} />
                <Field name="applyer" disable type="text" label="入库申请人" component={renderSimpleInput} />
                <Field name="applyerPhone" disable type="text" label="联系电话" component={renderSimpleInput} />
                <Field name="brandName" disable={this.isEditAreaEditable()} type="text" label="入库厂商" component={renderSimpleInput} validate={[maxLength10CN]} />
                <Field name="brandInfo" disable={this.isEditAreaEditable()} type="text" label="厂商信息" component={renderSimpleInput} validate={[maxLength50CN]} />
                <Field name="expectedDate" disable={this.isEditAreaEditable()} type="text" label="预计入库日期" necessary component={renderDateField} validate={[required]}/>
                <Field name="actualDate" disable placeHolder="-" type="text" label="实际入库日期" component={renderDateField} />
                <Field name="sg_tag" disable={this.isEditAreaEditable()} type="text" label="施工单号" component={renderSimpleInput} validate={[maxLength30]} />
                <Field name="sg_cm_no" disable={this.isEditAreaEditable()} type="text" label="变更单号" component={renderSimpleInput} validate={[maxLength30]}/>
                <Field name="sg_group_no" disable={this.isEditAreaEditable()} type="text" label="集团工单号" component={renderSimpleInput} validate={[maxLength30]} />
                <Field name="statusName" disable placeHolder="申请中" type="text" label="入库单状态" necessary component={renderSimpleInput} />
                {renderIf(!this.receiptTypeControl())(
                    <Field name="contractName" disable={this.isEditAreaEditable()} type="text" label="采购合同名称" component={renderSimpleInput} validate={[maxLength100CN]} />
                )}
                {renderIf(!this.receiptTypeControl())(
                    <Field name="signNo" disable={this.isEditAreaEditable()} type="text" label="报签号" component={renderSimpleInput} validate={[maxLength200]}/>
                )}
                <Field name="remark" disable={this.isEditAreaEditable()} type="text" label="描述信息" necessary component={renderSimpleInput} validate={[required, maxLength1000CN]} />
                <View style={ contentGapStyle }>{}</View>
                <View style={ padding10 }>
                    <H3 style={ padding10 }>入库备件明细</H3>
                    <Table borderStyle={{ borderColor: "#E5E5E5" }}>
                        <Row data={tableHeader} flexArr={[2.5, 2.5, 1, 0.5, 1, 2, 2, 2, 1, 1, 0.7]} style={ itemsRowStyle } textStyle={ itemsRowTextStyle } />
                    </Table>
                    <FieldArray name="storeInItems" component={this.renderItems} />
                </View>
                {renderIf(!this.isNewReceipt() && !_.isNull(this.props.findStoreInInfo.applyAduitStatus))(
                    <View>
                        <View style={ contentGapStyle }>{}</View>
                        <View>
                            <H3 style={ padding10 }>入库申请审批信息</H3>
                            <Field name="applyAduitor" type="text" label="入库申请审批人" disable component={renderSimpleInput} />
                            <Field name="applyAduitorPhone" type="text" label="联系电话" disable component={renderSimpleInput} />
                            <Field name="applyAduitStatus" type="text" label="申请审批状态" disable component={renderSimpleInput} />
                            <Field name="applyAduitTime" type="text" label="审批时间" disable component={renderSimpleInput} />
                            <Field name="applyAduitOpinion" type="text" label="审批意见" disable component={renderSimpleInput} />
                        </View>
                    </View>
                )}
                {renderIf(!this.isNewReceipt() && !_.isNull(this.props.findStoreInInfo.checkStatus))(
                    <View>
                        <View style={ contentGapStyle }>{}</View>
                        <View>
                            <H3 style={ padding10 }>入库复核信息</H3>
                            <Field name="checker" type="text" label="复核人" disable component={renderSimpleInput} />
                            <Field name="checkerPhone" type="text" label="联系电话" disable component={renderSimpleInput} />
                            <Field name="checkStatus" type="text" label="复核提交状态" disable component={renderSimpleInput} />
                            <Field name="checkTime" type="text" label="复核提交时间" disable component={renderSimpleInput} />
                            <Field name="checkOpinion" type="text" label="复核提交意见" disable component={renderSimpleInput} />
                        </View>
                    </View>
                )}
                {renderIf(!this.isNewReceipt() && !_.isNull(this.props.findStoreInInfo.checkAduitStatus))(
                    <View>
                        <View style={ contentGapStyle }>{}</View>
                        <View>
                            <H3 style={ padding10 }>入库复核审批信息</H3>
                            <Field name="checkAduitor" type="text" label="复核审批人" disable component={renderSimpleInput} />
                            <Field name="checkAduitorPhone" type="text" label="联系电话" disable component={renderSimpleInput} />
                            <Field name="checkAduitStatus" type="text" label="复核提交状态" disable component={renderSimpleInput} />
                            <Field name="checkAduitTime" type="text" label="复核提交时间" disable component={renderSimpleInput} />
                            <Field name="checkAduitOpinion" type="text" label="复核提交意见" disable component={renderSimpleInput} />
                        </View>
                    </View>
                )}
                {renderIf(this.toShowOperationArea())(
                    <View>
                        <View style={ contentGapStyle }>{}</View>
                        <View>
                            <H3 style={ padding10 }>操作信息</H3>
                            {renderIf(this.toShowCurrentOperatorControl())(
                                <Field name="operator" type="text" label="当前处理人" disable placeHolder="当前处理人" component={renderSimpleInput} />
                            )}
                            {renderIf(this.toShowNextOperationControl())(
                                <Item fixedLabel style={{ borderBottomWidth: 0 }}>
                                    <Label style={ nextOpLabelStyle } ><Label style={{color: "red"}}>*  </Label>下一步操作</Label>
                                    <Field name="opType" type="text" label="下一步操作" component={this.renderNextOperationSel} validate={[required]} >
                                        { opTypePickerItem }
                                    </Field>
                                    <View style={{flex: 3}}>{}</View>
                                </Item>
                            )}
                            {renderIf(this.toShowNextOperatorControl() && this.props.nextOperator.list.length)(
                                <View>
                                    <Item fixedLabel style={{ borderBottomWidth: 0 }}>
                                        <Label style={ nextOpLabelStyle } ><Label style={{color: "red"}}>*  </Label>下一步处理人</Label>
                                        <Field name="nextOperator" type="text" label="选择处理人" component={renderSelect} validate={[required]}>
                                            {this.props.nextOperator.list.map((value, key) => {
                                                return <Picker.Item label={`${value.nextOperator}`} value={value.nextOperator} key={key} />;
                                            })}
                                        </Field>
                                        <View style={{flex: 3}}>{}</View>
                                    </Item>
                                    <Field name="opinion" label="处理意见" placeHolder="填写处理意见" component={renderTextArea} validate={[required, maxLength500CN]}/>
                                    <View style={ height20 }>{}</View>
                                </View>
                            )}
                        </View>
                    </View>
                )}
                {/* Four PopUpDialogs - findDeviceTypeDialog */}
                <PopupDialog
                    dialogTitle={
                        <DialogTitle
                            title="备件类型选择"
                            hasTitleBar={false}
                            titleTextStyle={ popUpTitleTextStyle }
                        />
                    }
                    ref={(popupDialog) => {
                        this.findDeviceTypeDialog = popupDialog;
                    }}
                    overlayOpacity={0.5}
                    containerStyle={popUpContainerStyle}
                    width={0.9}
                    height={0.9}
                    onShown={() => {
                        if (_.isEmpty(this.props.findDeviceType.list)) {
                            this.props.fetchDeviceType({
                                user: userName,
                            });
                        }
                    }}
                >
                    <View>
                        { <FindDeviceTypeForm fetchDeviceTypeAction={this.props.fetchDeviceType}/> }
                        <View style={ popUpFindDeviceContentStyle }>
                            <Table borderStyle={{ borderColor: "#E5E5E5" }} style={ [findDeviceTypeTableData.length && { borderBottomWidth: 0 }] }>
                                <Row data={findDeviceTypeTableHeader} flexArr={findDeviceTypeTableColWidthArr} style={ popUpRowStyle } textStyle={{ textAlign: "center" }} />
                            </Table>
                            <ScrollView>
                                <Table borderStyle={{ borderColor: "#E5E5E5" }}>
                                    {
                                        findDeviceTypeTableData.map((row, index) => {
                                            let tableRow = row.slice(0, row.length - 2);
                                            return <TouchableOpacity
                                                key={index}
                                                onPress={ () => {
                                                    Alert.alert("选择备件类型", `备件类型选择确认：${JSON.stringify(row)}`, [
                                                        { text: "取消", onPress: () => {}},
                                                        { text: "确认", onPress: () => {
                                                                this.props.array.push("storeInItems", {
                                                                    deviceName: `${row[1]}`,
                                                                    summaryNum: "1",
                                                                    validMonths: row[4],
                                                                    unitName: `${row[row.length - 2]}`,
                                                                    usability: "好件",
                                                                    belongUnit: `${row[2]}`
                                                                });
                                                                this.props.change(`storeInItems.${this.state.currentRowOfItems}.oldSummaryNum`, "0");
                                                                this.props.change(`storeInItems.${this.state.currentRowOfItems}.deviceTypeId`, row[row.length - 1] + "");
                                                                this.props.change(`storeInItems.${this.state.currentRowOfItems}.sourceType`, "1"); // sourceType == 1 表示从备件类型中添加
                                                                this.findDeviceTypeDialog.dismiss();
                                                            }},
                                                        ]);
                                                    }
                                                }
                                            >
                                                <Row
                                                    data={tableRow}
                                                    flexArr={findDeviceTypeTableColWidthArr}
                                                    style={ [ popUpRowStyle, index % 2 && disableBgColor, index === 1 && { borderTopWidth: 0 } ] }
                                                    textStyle={{ textAlign: "center" }}
                                                    borderStyle={{ borderColor: "#E5E5E5" }}
                                                />
                                            </TouchableOpacity>;
                                        })
                                    }
                                </Table>
                            </ScrollView>
                        </View>
                    </View>
                </PopupDialog>

                {/* findDeviceDialog */}
                <PopupDialog
                    dialogTitle={
                        <DialogTitle
                            title="库存备件选择"
                            hasTitleBar={false}
                            titleTextStyle={popUpTitleTextStyle}
                        />
                    }
                    ref={(popupDialog) => {
                        this.findDeviceDialog = popupDialog;
                    }}
                    overlayOpacity={0.5}
                    containerStyle={popUpContainerStyle}
                    width={0.9}
                    height={0.9}
                    onShown={() => {
                        if (_.isEmpty(this.props.findDevice.list)) {
                            this.props.fetchDevice({
                                user: userName,
                                status: "2"
                            });
                        }
                        if (_.isEmpty(this.props.findStoreRoom.list)) {
                            this.props.fetchStoreRoom({
                                user: userName
                            });
                        }
                    }}
                >
                    <View>
                        { <FindDeviceForm searchAction={this.props.fetchDevice} storeRoomList={this.props.findStoreRoom.list} /> }
                        <View style={popUpFindDeviceContentStyle}>
                            <ScrollView  horizontal={true}>
                                <View>
                                    <Table borderStyle={{ borderColor: "#E5E5E5" }} style={ [findDeviceTableData.length && { borderBottomWidth: 0 }] }>
                                        <Row data={findDeviceTableHeader} widthArr={findDeviceTableColWidthArr} style={ popUpRowStyle } textStyle={{ textAlign: "center" }} />
                                    </Table>
                                    <ScrollView style={{ marginTop: -1 }}>
                                        <Table borderStyle={{ borderColor: "#E5E5E5" }}>
                                            {
                                                findDeviceTableData.map((row, index) => {
                                                    let tableRow = row.slice(0, row.length - 4);
                                                    return <TouchableOpacity
                                                        key={index}
                                                        onPress={() => {
                                                            let currentSummaryNo = row[1];
                                                            let currentDeviceName = row[2];
                                                            let currentUnitName = row[5];
                                                            let cOldSumNum = row[4];
                                                            let cValidMonths = row[6];
                                                            let cUsability = row[7];
                                                            let cRoomName = row[10];
                                                            let cSheetName = row[11];
                                                            let cSN = row[15];
                                                            let cBelongUnit = row[12];
                                                            let cStoreRoomId = row[16];
                                                            let cSheetId = row[17];
                                                            let cDeviceTypeId = row[18];
                                                            if (_.find(this.props.currentStoreInItems, function(o) { return _.isEqual(o.summaryNo, currentSummaryNo); })) {
                                                                Alert.alert("填写提示", "您已添加过该备件");
                                                            } else {
                                                                if (!_.isEqual(cOldSumNum, "0")) {
                                                                    Alert.alert("库存备件选择确认", `汇总号：${currentSummaryNo},\n设备名：${currentDeviceName},\n库房：${cRoomName},\n货架名：${cSheetName}`, [
                                                                        { text: "取消", onPress: () => {} },
                                                                        { text: "确认", onPress: () => {
                                                                                this.props.array.push("storeInItems", {
                                                                                    summaryNo: currentSummaryNo,
                                                                                    deviceName: currentDeviceName,
                                                                                    summaryNum: "1",
                                                                                    unitName: currentUnitName, // 单位
                                                                                    validMonths: cValidMonths,
                                                                                    usability: cUsability,
                                                                                    roomName: cRoomName,
                                                                                    sheetName: cSheetName,
                                                                                    deviceSN: _.isNull(cSN) ? "" : cSN,
                                                                                    belongUnit: cBelongUnit,
                                                                                });
                                                                                this.props.change(`storeInItems.${this.state.currentRowOfItems}.oldSummaryNum`, cOldSumNum + "");
                                                                                this.props.change(`storeInItems.${this.state.currentRowOfItems}.deviceTypeId`, cDeviceTypeId + "");
                                                                                this.props.change(`storeInItems.${this.state.currentRowOfItems}.sheetId`, cSheetId + "");
                                                                                this.props.change(`storeInItems.${this.state.currentRowOfItems}.storeRoomId`, cStoreRoomId + "");
                                                                                this.props.change(`storeInItems.${this.state.currentRowOfItems}.sourceType`, "2"); // sourceType === 2 表示从库存中添加
                                                                                this.findDeviceDialog.dismiss();
                                                                            }
                                                                        },
                                                                    ]);
                                                                } else {
                                                                    Alert.alert("库存备件选择确认", `汇总号：${currentSummaryNo},\n设备名：${currentDeviceName},\n库房：${cRoomName},\n货架名：${cSheetName}\n\n因原数量为 0，需判断当前可用性`, [
                                                                        { text: "取消", onPress: () => {} },
                                                                        { text: "确认并为好件", onPress: () => {
                                                                                this.props.array.push("storeInItems", {
                                                                                    summaryNo: currentSummaryNo,
                                                                                    deviceName: currentDeviceName,
                                                                                    summaryNum: "1",
                                                                                    unitName: currentUnitName, // 单位
                                                                                    validMonths: cValidMonths, // 原数量
                                                                                    usability: "好件",
                                                                                    roomName: cRoomName,
                                                                                    sheetName: cSheetName,
                                                                                    deviceSN: _.isNull(cSN) ? "" : cSN,
                                                                                    belongUnit: cBelongUnit,
                                                                                });
                                                                                this.props.change(`storeInItems.${this.state.currentRowOfItems}.oldSummaryNum`, cOldSumNum + "");
                                                                                this.props.change(`storeInItems.${this.state.currentRowOfItems}.deviceTypeId`, cDeviceTypeId + "");
                                                                                this.props.change(`storeInItems.${this.state.currentRowOfItems}.sheetId`, cSheetId + "");
                                                                                this.props.change(`storeInItems.${this.state.currentRowOfItems}.storeRoomId`, cStoreRoomId + "");
                                                                                this.props.change(`storeInItems.${this.state.currentRowOfItems}.sourceType`, "2"); // sourceType === 2 表示从库存中添加
                                                                                this.findDeviceDialog.dismiss();
                                                                            }
                                                                        },
                                                                        { text: "确认并为坏件", onPress: () => {
                                                                                this.props.array.push("storeInItems", {
                                                                                    summaryNo: currentSummaryNo,
                                                                                    deviceName: currentDeviceName,
                                                                                    summaryNum: "1",
                                                                                    unitName: currentUnitName, // 单位
                                                                                    validMonths: cValidMonths, // 原数量
                                                                                    usability: "坏件",
                                                                                    roomName: cRoomName,
                                                                                    sheetName: cSheetName,
                                                                                    deviceSN: _.isNull(cSN) ? "" : cSN,
                                                                                    belongUnit: cBelongUnit,
                                                                                });
                                                                                this.props.change(`storeInItems.${this.state.currentRowOfItems}.oldSummaryNum`, cOldSumNum + "");
                                                                                this.props.change(`storeInItems.${this.state.currentRowOfItems}.deviceTypeId`, cDeviceTypeId + "");
                                                                                this.props.change(`storeInItems.${this.state.currentRowOfItems}.sheetId`, cSheetId + "");
                                                                                this.props.change(`storeInItems.${this.state.currentRowOfItems}.storeRoomId`, cStoreRoomId + "");
                                                                                this.props.change(`storeInItems.${this.state.currentRowOfItems}.sourceType`, "2"); // sourceType === 2 表示从库存中添加
                                                                                this.findDeviceDialog.dismiss();
                                                                            }
                                                                        },
                                                                    ]);
                                                                }

                                                                }
                                                            }
                                                        }
                                                    >
                                                        <Row
                                                            data={tableRow}
                                                            widthArr={findDeviceTableColWidthArr}
                                                            style={ [ popUpRowStyle, index % 2 && disableBgColor ] }
                                                            textStyle={{ textAlign: "center" }}
                                                            borderStyle={{ borderColor: "#E5E5E5" }}
                                                        />
                                                    </TouchableOpacity>;
                                                })
                                            }
                                        </Table>
                                    </ScrollView>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </PopupDialog>

                {/* findRoomDialog */}
                <PopupDialog
                    dialogTitle={
                        <DialogTitle
                            title="库房信息"
                            hasTitleBar={false}
                            titleTextStyle={popUpTitleTextStyle}
                        />
                    }
                    ref={(popupDialog) => {
                        this.storeRoomInfoDialog = popupDialog;
                    }}
                    overlayOpacity={0.5}
                    containerStyle={popUpContainerStyle}
                    width={0.6}
                    height={0.6}
                    onShown={ () => {
                        if (_.isEmpty(this.props.findRoom.list)) {
                            this.props.fetchRoom({
                                user: userName
                            });
                        }
                    }}
                >
                    <View>
                        <View style={popUpFindRoomContentStyle}>
                            <Table borderStyle={{ borderColor: "#E5E5E5" }} style={ [findRoomTableData.length && { borderBottomWidth: 0 }] }>
                                <Row data={findRoomHeader} flexArr={findRoomColWidthArr} style={ popUpRowStyle } textStyle={{ textAlign: "center" }} />
                            </Table>
                            <ScrollView>
                                <Table borderStyle={{ borderColor: "#E5E5E5" }}>
                                    {
                                        findRoomTableData.map((row, index) => {
                                            let tableRow = row.slice(0, row.length - 1);
                                            return <TouchableOpacity
                                                key={index}
                                                onPress={ () => {
                                                    Alert.alert("选择库房", `库房选择确认：${JSON.stringify(row)}`, [
                                                        { text: "取消", onPress: () => {}},
                                                        { text: "确认", onPress: () => {
                                                                this.props.change(`storeInItems.${this.state.indexForSelectRoomAndSheet}.storeRoomId`, row[row.length - 1] + "");
                                                                this.props.change(`storeInItems.${this.state.indexForSelectRoomAndSheet}.roomName`, row[1] + "");
                                                                this.storeRoomInfoDialog.dismiss();
                                                            }},
                                                        ]);
                                                    }
                                                }
                                            >
                                                <Row
                                                    data={tableRow}
                                                    flexArr={findRoomColWidthArr}
                                                    style={ [ popUpRowStyle, index % 2 && disableBgColor ] }
                                                    textStyle={{ textAlign: "center" }}
                                                    borderStyle={{ borderColor: "#E5E5E5" }}
                                                />
                                            </TouchableOpacity>;
                                        })
                                    }
                                </Table>
                            </ScrollView>
                        </View>
                    </View>
                </PopupDialog>

                {/* findSheetDialog */}
                <PopupDialog
                    dialogTitle={
                        <DialogTitle
                            title="货架选择"
                            hasTitleBar={false}
                            titleTextStyle={popUpTitleTextStyle}
                        />
                    }
                    ref={(popupDialog) => {
                        this.sheetSelectionDialog = popupDialog;
                    }}
                    overlayOpacity={0.5}
                    containerStyle={popUpContainerStyle}
                    width={0.7}
                    height={0.6}
                    onShown={() => {
                        if (_.isEmpty(this.props.findStoreRoom.list)) {
                            this.props.fetchStoreRoom({
                                user: userName
                            });
                        }
                        // 每次都请求，满足根据有没有库房进行判断
                        let currentIndex = this.state.indexForSelectRoomAndSheet;
                        let cStoreRoomId = this.props.currentStoreInItems[currentIndex].storeRoomId;
                        this.props.fetchSheet({
                            user: userName,
                            storeRoomId: cStoreRoomId || ""
                        });
                    }}
                >
                    <View>
                        { <FindSheetForm
                            fetchSheetAction={this.props.fetchSheet}
                            storeRoomList={this.props.findStoreRoom.list}
                        /> }
                        <View style={popUpFindRoomContentStyle}>
                            <Table borderStyle={{ borderColor: "#E5E5E5" }} style={ [findSheetTableData.length && { borderBottomWidth: 0 }] }>
                                <Row data={findSheetHeader} flexArr={findSheetColWidthArr} style={ popUpRowStyle } textStyle={{ textAlign: "center" }} />
                            </Table>
                            <ScrollView>
                                <Table borderStyle={{ borderColor: "#E5E5E5" }}>
                                    {
                                        findSheetTableData.map((row, index) => {
                                            let tableRow = row.slice(0, row.length - 2); // 不显示 sheetId, storeRoomId
                                            return <TouchableOpacity
                                                key={index}
                                                onPress={ () => {
                                                    Alert.alert("选择货架", `货架选择确认：${JSON.stringify(row)}`, [
                                                        { text: "取消", onPress: () => {}},
                                                        { text: "确认", onPress: () => {
                                                                this.props.change(`storeInItems.${this.state.indexForSelectRoomAndSheet}.roomName`, row[1] + "");
                                                                this.props.change(`storeInItems.${this.state.indexForSelectRoomAndSheet}.storeRoomId`, row[6] + "");
                                                                this.props.change(`storeInItems.${this.state.indexForSelectRoomAndSheet}.sheetName`, row[3] + "");
                                                                this.props.change(`storeInItems.${this.state.indexForSelectRoomAndSheet}.sheetId`, row[5] + "");
                                                                this.props.resetFindSheetForm();
                                                                this.sheetSelectionDialog.dismiss();
                                                            }},
                                                        ]);
                                                    }
                                                }
                                            >
                                                <Row
                                                    data={tableRow}
                                                    flexArr={findSheetColWidthArr}
                                                    style={ [ popUpRowStyle, index % 2 && disableBgColor ] }
                                                    textStyle={{ textAlign: "center" }}
                                                    borderStyle={{ borderColor: "#E5E5E5" }}
                                                />
                                            </TouchableOpacity>;
                                        })
                                    }
                                </Table>
                            </ScrollView>
                        </View>
                    </View>
                </PopupDialog>
                {/* Loader */}
                <ProgressDialog
                    visible={ isFetching }
                    title="更新入库单"
                    message="更新中，请稍后..."
                    dialogStyle={ progressDialogStyle }
                >
                </ProgressDialog>
            </Form>
        );

        return <DealWithStoreIn
            navigation={this.props.navigation}
            DealWithStoreInForm={form}
            fetchedStoreInTrack={this.props.findStoreInTrack}
            storeInInfo={ this.props.findStoreInInfo }
            currentUser={ this.props.user.authorization}
            currentOperateTypeFromPicker={this.props.currentOperateTypeFromPicker}
            currentNextOperator={this.props.currentNextOperator}
            onSave={ handleSubmit( (values) => {
                this.saveHelper(values);
            }) }
            onDelete={() => {
                this.deleteHelper();
            }}
            onSubmit={ handleSubmit((values) => {
                this.submitHelper(values);
            })}
        />;
    }
}

function mapStateToProps(state, ownProps) {
    let { nextOperator,
        getStoreInOperate,
        findDeviceType,
        findDevice,
        findRoom,
        findStoreRoom,
        findSheet,
        findStoreInInfo,
        findStoreInDetail,
        findStoreInTrack,
        saveStoreIn,
        submitStoreIn,
        user } = state;
    const isFindStoreInInfoFetching = findStoreInInfo.isFetching;
    const { getParam } = ownProps.navigation;
    let operateType = getParam("currentOperateType");
    findStoreInInfo = findStoreInInfo.list;
    return {
        currentOperateTypeFromPicker : formSelector(state, "opType"),
        currentOpinion : formSelector(state, "opinion"),
        currentNextOperator : formSelector(state, "nextOperator"),
        currentStoreInItems: formSelector(state, "storeInItems"),
        nextOperator,
        getStoreInOperate,
        findDeviceType,
        findDevice,
        findRoom,
        findStoreRoom,
        findStoreInInfo,
        isFindStoreInInfoFetching,
        findStoreInTrack,
        findSheet,
        saveStoreIn,
        submitStoreIn,
        user,
        initialValues: _.isEqual(operateType, "add") ? {
            applyer: getParam("currentApplier"),
            applyerPhone: getParam("currentPhoneNum"),
            statusName: getParam("currentStatusName"),
            status: getParam("currentStatus"),
            operator: getParam("currentOperator"),
        } : {
            inNo: findStoreInInfo.inNo,
            applyDate: findStoreInInfo.applyDate,
            applyer: findStoreInInfo.applyer,
            applyerPhone: findStoreInInfo.applyerPhone,
            brandName: findStoreInInfo.brandName,
            brandInfo: findStoreInInfo.brandInfo,
            expectedDate: findStoreInInfo.expectedDate,
            actualDate: findStoreInInfo.actualDate,
            sg_tag: findStoreInInfo.sg_tag,
            sg_cm_no: findStoreInInfo.sg_cm_no,
            sg_group_no: findStoreInInfo.sg_group_no,
            statusName: findStoreInInfo.statusName,
            status: findStoreInInfo.status,
            contractName: findStoreInInfo.contractName,
            signNo: findStoreInInfo.signNo,
            remark: findStoreInInfo.remark,
            applyAduitor: findStoreInInfo.applyAduitor,
            applyAduitorPhone: findStoreInInfo.applyAduitorPhone,
            applyAduitStatus: JUDGETOSTR[parseInt(findStoreInInfo.applyAduitStatus, 10)],
            applyAduitTime: findStoreInInfo.applyAduitTime,
            applyAduitOpinion: findStoreInInfo.applyAduitOpinion,
            checker: findStoreInInfo.checker,
            checkerPhone: findStoreInInfo.checkerPhone,
            checkStatus: REVIEWTOSTR[parseInt(findStoreInInfo.checkStatus, 10)],
            checkTime: findStoreInInfo.checkTime,
            checkOpinion: findStoreInInfo.checkOpinion,
            checkAduitor: findStoreInInfo.checkAduitor,
            checkAduitorPhone: findStoreInInfo.checkAduitorPhone,
            checkAduitStatus: JUDGETOSTR[parseInt(findStoreInInfo.checkAduitStatus, 10)],
            checkAduitTime: findStoreInInfo.checkAduitTime,
            checkAduitOpinion: findStoreInInfo.checkAduitOpinion,
            operator: findStoreInInfo.operator,
            opType: findStoreInInfo.opType,
            nextOperator: findStoreInInfo.nextOperator,
            opinion: findStoreInInfo.opinion,
            storeInItems: findStoreInDetail.list
        },
        enableReinitialize: true,
    };
}

const DealWithStoreInContainer = connect(mapStateToProps, {
    fetchStoreInInfo,
    fetchStoreInDetail,
    fetchStoreInTrackAction,
    fetchDeviceType,
    fetchDevice,
    fetchRoom,
    fetchStoreRoom,
    fetchSheet,
    fetchStoreInOperation,
    fetchOperators,
    toSaveStoreInInfo,
    toDeleteStoreInInfo,
    toSubmitStoreIn,
    resetFindSheetForm,
})(
    reduxForm({
        form: DEALWITHSTOREINFORM,
    })(DealWithStoreInForm)
);

const formSelector = formValueSelector(DEALWITHSTOREINFORM);

export default DealWithStoreInContainer;
