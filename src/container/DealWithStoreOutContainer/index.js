// @flow
import * as React from "react";
import { View, ScrollView, TouchableOpacity, Alert, Dimensions } from "react-native";
import { connect } from "react-redux";
import DealWithStoreOut from "../../stories/screens/DealWithStoreOut";
import { Field, reduxForm, FieldArray, change, formValueSelector } from "redux-form";
import { Form, Text, Item, Button, Label, Picker, Icon, H3, Header, Left, Right, Body, Segment } from "native-base";
import PopupDialog, { DialogTitle } from "react-native-popup-dialog";
import { ProgressDialog } from "react-native-simple-dialogs";
import { Table, Row } from "react-native-table-component";
import renderIf from "../../services/utils/renderIf";
import { required, maxLength50CN, maxLength500CN, maxLength10CN, maxLength30, maxLength1000CN, postInt } from "../../services/utils/formValidateUtils";
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
import FindDeviceForm from "../../components/formComponents/kfgl_storeout/StoreOutFindDeviceForm";
import {
    JUDGETOSTR,
    REVIEWTOSTR,
    DEALWITHSTOREOUTFORM,
    DEVICETYPETOSTR,
    QR_SCANNER_SCREEN,
    DEAL_WITH_STORE_OUT_SCREEN
} from "../../boot/config";
import { fetchStoreOutInfo } from "../../actions/storeOut/findStoreOutInfoAction";
import { fetchStoreOutDetail } from "../../actions/storeOut/findStoreOutDetailAction";
import { fetchStoreOutTrack as fetchStoreOutTrackAction } from "../../actions/storeOut/findStoreOutTrackAction";
import { fetchStoreOutDevice } from "../../actions/storeOut/findStoreOutDeviceAction";
import { fetchStoreOutRoom } from "../../actions/storeOut/findStoreOutRoomAction";
import { fetchStoreOutOperators } from "../../actions/storeOut/findStoreOutOperatorsAction";
import { fetchStoreOutOperation } from "../../actions/storeOut/getStoreOutOperateAction";
import { toSaveStoreOutInfo } from "../../actions/storeOut/saveStoreOutInfoAction";
import { toDeleteStoreOutInfo } from "../../actions/storeOut/deleteStoreOutInfoAction";
import { toSubmitStoreOut } from "../../actions/storeOut/submitStoreOutAction";

export interface Props {
    navigation: any,
}

export interface State {
}

// styles
import styles from "../../styles/dealWithPages";
const {
    arrowBackFontSize, segmentFirstStyle, segmentLastStyle, disableBgColor, errorBorderStyle,
    storeRoomItemStyle, storeRoomItemTextStyle,
    renderPickerStyle,
    nextOpLabelStyle,
    contentGapStyle, padding10, height20,
    itemsRowStyle, itemsRowTextStyle,
    progressDialogStyle,
    popUpTitleTextStyle, popUpContainerStyle, popUpRowStyle, popUpFindDeviceContentStyle, popUpFindRoomContentStyle
} = styles;

class DealWithStoreOutForm extends React.Component<Props, State> {

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
                <Left>
                    <Button transparent onPress={() => navigation.goBack()}>
                        <Icon name="ios-arrow-back" style={arrowBackFontSize}/>
                    </Button>
                </Left>

                <Body style={{ flex: 1 }}>
                <Segment style={{backgroundColor: "transparent", borderColor: "transparent", alignSelf: "flex-end"}}>
                    <Button active style={segmentFirstStyle} first><Text>     出库单信息     </Text></Button>
                    <Button style={segmentLastStyle}
                            onPress={() => {
                                navigation.navigate("TransInfo", {
                                    "currentPage": "storeOut",
                                    "leftSegmentTitle": "     出库单信息     ",
                                    "rightSegmentTitle": "出库流程流转信息",
                                });
                            }}
                            last>
                        <Text>出库流程流转信息</Text>
                    </Button>
                </Segment>
                </Body>

                <Right style={{ flex: 1 }} />
            </Header>
    });

    componentDidMount() {
        // The Hidden Fields Setting
        const { getParam } = this.props.navigation;
        this.props.dispatch(change(DEALWITHSTOREOUTFORM, "status", getParam("currentStatus") || "01"));
        this.props.dispatch(change(DEALWITHSTOREOUTFORM, "operateType", getParam("currentOperateType")));
        this.props.dispatch(change(DEALWITHSTOREOUTFORM, "outType", getParam("currentOutType")));
        this.mainRequests();
    }

    mainRequests() {
        const { getParam } = this.props.navigation;
        const { userName } = this.props.user.authorization;
        const outNo = getParam("currentOutNo");
        const status = getParam("currentStatus");
        const operator = getParam("currentOperator");
        const operateType = getParam("currentOperateType");
        const currentOutType = getParam("currentOutType");
        if (_.isEqual(operateType, "update") && !_.isEmpty(outNo)) {
            this.props.fetchStoreOutInfo({
                user: userName,
                outNo: outNo,
                operateType: "update",
            });
            this.props.fetchStoreOutTrackAction({
                user: userName,
                outNo: outNo
            });

            if (_.isEqual(operator, userName)) {
                this.props.fetchStoreOutOperation({
                    user: userName,
                    status: status,
                });
            }
            if (!this.isEditAreaEditable()) {
                this.props.fetchStoreOutDevice({
                    user: userName,
                    status: "2",
                });
            }
            this.props.fetchStoreOutDetail({
                user: userName,
                outNo: outNo
            });
        } else {
            // 为新建单 operation type 赋值
            this.props.dispatch(change(DEALWITHSTOREOUTFORM, "opType", "01"));
            // 获取新建单下一处理人
            this.props.fetchStoreOutOperators({
                user: userName,
                outType: currentOutType,
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
     * 显示出库单，控制信息是否只读
     * 控制是否显示操作信息，不匹配不显示操作信息
     * @returns {boolean|*}
     */
    isCurrentUserAsOperator() {
        // operator 不是登录人 user 时，只显示出库单，所有信息都是只读，不显示操作信息
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
        const cOutType = getParam("currentOutType");
        const cStatus = getParam("currentStatus");
        return (_.isEqual(cOutType, "1") && _.isEqual(cStatus, "01")) || !(_.includes(["01", "03"], cStatus));
    }

    // 根据单据状态进行控制
    receiptTypeControl() {
        const cInType = this.props.navigation.getParam("currentOutType");
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
                        <Field name={`${item}.summaryNum`} disable={this.isEditAreaEditable()} type="text" label="出库数量" validate={[required, postInt]} component={renderItemDetails} itemStyle={{ flex: 1 }} />
                        <Field name={`${item}.unitName`} disable type="text" label="单位" component={renderItemDetails} itemStyle={{ flex: 0.5 }} />
                        <Field name={`${item}.oldSummaryNum`} disable type="text" label="原数量" component={renderItemDetails} itemStyle={{ flex: 1 }} />
                        <Field name={`${item}.roomName`} disable type="text" label="库房" component={this.renderItemStoreRoom} itemStyle={{ flex: 2 }} currentRowIndex={index} validate={this.isStoreRoomRequired() ? [] : [required]} />
                        <Field name={`${item}.sheetName`} disable type="text" label="货架" component={this.renderItemSheet} itemStyle={{ flex: 2 }} currentRowIndex={index} validate={this.isStoreRoomRequired() ? [] : [required]} />
                        <Field name={`${item}.deviceSN`} disable type="text" label="SN/PN" component={renderItemDetails} itemStyle={{ flex: 2 }} />
                        <Field name={`${item}.usability`} disable type="text" label="可用性" component={renderItemDetails} itemStyle={{ flex: 1 }} />
                        <Field name={`${item}.belongUnit`} disable type="text" label="归属单位" component={renderItemDetails} itemStyle={{ flex: 1 }} validate={this.isStoreRoomRequired() ? [] : [required]} />
                        <Button disabled={this.isEditAreaEditable()} style={{ flex: 0.7, height: "100%", justifyContent: "center", borderColor: "#E5E5E5", borderWidth: 1, borderTopWidth: 0 }} transparent onPress={() => {
                            fields.remove(index);
                        }}>
                            <Icon name="md-remove-circle" style={[ this.isEditAreaEditable() ? {color: "gray"} : {color: "red"}]} />
                        </Button>
                    </View>
                ))}
            </View>
            {renderIf(!this.isEditAreaEditable())(
                <View style={{
                    borderColor: "#E5E5E5",
                    borderWidth: 1,
                    borderTopWidth: 0,
                    width: "100%",
                    flexDirection: "row"
                }}>
                    <Button transparent danger
                            onPress={() => {
                                this.setState({ currentRowOfItems: fields.length });
                                this.findDeviceDialog.show();
                            }
                            } style={{ width: "100%", justifyContent: "center", flex: 1 }}
                    >
                        <Text>+从库房添加备件</Text>
                    </Button>
                    <Button transparent danger
                            onPress={ () => {
                                    this.setState({ currentRowOfItems: fields.length });
                                    this.props.navigation.navigate(QR_SCANNER_SCREEN, { routeName: DEAL_WITH_STORE_OUT_SCREEN, currentRowOfItems: fields.length });
                                }
                            } style={{ width: "100%", justifyContent: "center", flex: 1 }}
                    >
                        <Text>+二维码添加备件</Text>
                    </Button>
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
                            this.props.fetchStoreOutOperators({
                                user: this.props.user.authorization.userName,
                                inType: this.props.navigation.getParam("currentOutType"),
                                outNo: this.props.navigation.getParam("currentOutNo"),
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
            "usability": [],
            "belongUnit": [],
            "validMonths": [],
        };
        let { storeOutItems } = tempValues;
        if (_.isEmpty(storeOutItems)) {
            Alert.alert(
                "表单填写错误",
                "请添加至少一条出库明细信息",
                [{
                  text: "确认",
                  onPress: () => {}
                }]
            );
            return;
        }
        for ( let item in storeOutItems) {
            formattedValues.sourceType.push(storeOutItems[item].sourceType || ""); // To avoid null
            formattedValues.summaryNo.push(storeOutItems[item].summaryNo || "");
            formattedValues.summaryNum.push(storeOutItems[item].summaryNum || "");
            formattedValues.oldSummaryNum.push(storeOutItems[item].oldSummaryNum || "");
            formattedValues.storeRoomId.push(storeOutItems[item].storeRoomId || "");
            formattedValues.sheetId.push(storeOutItems[item].sheetId || "");
            formattedValues.deviceTypeId.push(storeOutItems[item].deviceTypeId || "");
            formattedValues.deviceSN.push(storeOutItems[item].deviceSN || "");
            formattedValues.unitName.push(storeOutItems[item].unitName || "");
            formattedValues.usability.push(storeOutItems[item].usability || "");
            formattedValues.belongUnit.push(storeOutItems[item].belongUnit || "");
            formattedValues.validMonths.push(storeOutItems[item].validMonths || "");
        }
        delete tempValues.storeOutItems;
        formattedValues = { ...tempValues, ...formattedValues };
        formattedValues.user = this.props.user.authorization.userName;
        formattedValues.operateType = getParam("currentOperateType");
        formattedValues.outType = getParam("currentOutType");
        this.props.toSaveStoreOutInfo(formUrlEncoded(formattedValues, { ignorenull : true, skipIndex: true, sorted: false }));
    }

    deleteHelper() {
        const outNo = this.props.navigation.getParam("currentOutNo");
        const { userName } = this.props.user.authorization;
        this.props.toDeleteStoreOutInfo({
            user: userName,
            outNo: outNo
        });
        this.props.navigation.goBack();
    }

    submitHelper(values) {
        const { getParam } = this.props.navigation;
        const cStatus = getParam("currentStatus");
        const operator = getParam("currentOperator");
        const currentOutType = getParam("currentOutType");
        const currentOutNo = getParam("currentOutNo");
        const { userName } = this.props.user.authorization;
        const { currentOperateTypeFromPicker,
            currentOpinion,
            currentNextOperator
        } = this.props;

        let submittedObj = {
            user: userName,
            outNo: currentOutNo,
            outType: currentOutType,
            opType: currentOperateTypeFromPicker,
            status: cStatus,
        };

        if (_.includes(["01", "03"], cStatus)) {
            values.tempSave = true;
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
        console.log("submittedObj",  submittedObj);
        this.props.toSubmitStoreOut(submittedObj);
    }

    render() {
        const { handleSubmit } = this.props;
        const { userName } = this.props.user.authorization;

        // loader controller
        const isFetching = this.props.findStoreOutTrack.isFetching ||
            this.props.isFindStoreOutInfoFetching ||
            this.props.findStoreOutDevice.isFetching ||
            this.props.findStoreOutOperators.isFetching ||
            this.props.findStoreOutRoom.isFetching ||
            this.props.saveStoreOutInfo.isFetching ||
            this.props.submitStoreOut.isFetching;

        // Tables Header
        const findDeviceTableHeader = ["", "备件汇总号", "备件名称", "厂商", "库存数", "单位" , "有效月数", "可用性", "适用设备", "类型", "库房", "货架", "归属单位", "过期日期"]; // 库存

        // Tables Column Width
        const findDeviceTableColWidthArr = [20, 120, 120, 90, 60, 30, 60, 60, 60, 70, 100, 70, 70, 90];

        // Tables Row Data
        let findDeviceTableData = [];

        // Construct Table Data, order display order using tempObj
        // 从库存
        this.props.findStoreOutDevice.list.map(
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
                tempObj.deviceSN = row.deviceSN; // 14 SN
                tempObj.storeRoomId = row.storeRoomId; // 15 库房 id，保存不显示
                tempObj.sheetId = row.sheetId; // 16 货架 id, 保存不显示
                tempObj.deviceTypeId = row.deviceTypeId; // 17 设备 id, 保存不显示

                Object.entries(tempObj).forEach(([key, value]) => {
                    tempArr.push(value);
                });

                findDeviceTableData.push(tempArr);
            }
        );

        // 为新建单设置默认操作
        let opTypePickerItem = [];
        if (this.props.navigation.getParam("currentOperateType") === "update") {
            opTypePickerItem = this.props.getStoreOutOperate.list.map((value, key) => {
                    return <Picker.Item label={`${value.operateTypeName}`}
                                        value={value.operateType} key={key}/>;
            });
        } else {
            opTypePickerItem = [<Picker.Item label = "请选择" value="" key={"0"} />, <Picker.Item label = "提交审批" value="01" key={"1"}/>];
        }

        const tableHeader = ["备件汇总号", "备件名称", "出库数量", "单位", "原数量", "库房", "货架", "SN/PN", "可用性", "归属单位", "操作"];

        const form = (
            <Form>
                <Field name="outNo" disable type="input" label="出库单号" component={renderSimpleInput} />
                <Field name="applyDate" disable type="text" label="申请日期" component={renderDateField} />
                <Field name="applyer" disable type="text" label="出库申请人" component={renderSimpleInput} />
                <Field name="applyerPhone" disable type="text" label="联系电话" component={renderSimpleInput} />
                <Field name="brandName" disable={this.isEditAreaEditable()} type="text" label="出库厂商" component={renderSimpleInput} validate={[maxLength10CN]} />
                <Field name="brandInfo" disable={this.isEditAreaEditable()} type="text" label="厂商信息" component={renderSimpleInput} validate={[maxLength50CN]} />
                <Field name="expectedDate" disable={this.isEditAreaEditable()} type="text" label="预计出库日期" necessary component={renderDateField} validate={[required]}/>
                <Field name="actualDate" disable placeHolder="-" type="text" label="实际出库日期" component={renderDateField} />
                <Field name="sg_tag" disable={this.isEditAreaEditable()} type="text" label="施工单号" component={renderSimpleInput} validate={[maxLength30]} />
                <Field name="sg_cm_no" disable={this.isEditAreaEditable()} type="text" label="变更单号" component={renderSimpleInput} validate={[maxLength30]}/>
                <Field name="sg_group_no" disable={this.isEditAreaEditable()} type="text" label="集团工单号" component={renderSimpleInput} validate={[maxLength30]} />
                <Field name="statusName" disable placeHolder="申请中" type="text" label="出库单状态" necessary component={renderSimpleInput} />
                <Field name="whereabout" disable={this.isEditAreaEditable()} type="text" label="出库去向" component={renderSimpleInput} />
                <Field name="remark" disable={this.isEditAreaEditable()} type="text" label="描述信息" necessary component={renderSimpleInput} validate={[required, maxLength1000CN]} />
                <View style={contentGapStyle}>{}</View>
                <View style={padding10}>
                    <H3 style={padding10}>出库备件明细</H3>
                    <Table borderStyle={{ borderColor: "#E5E5E5" }}>
                        <Row data={tableHeader} flexArr={[2.5, 2.5, 1, 0.5, 1, 2, 2, 2, 1, 1, 0.7]} style={itemsRowStyle} textStyle={itemsRowTextStyle} />
                    </Table>
                    <FieldArray name="storeOutItems" component={this.renderItems} />
                </View>
                {renderIf(!this.isNewReceipt() && !_.isNull(this.props.findStoreOutInfo.applyAduitStatus))(
                    <View>
                        <View style={contentGapStyle}>{}</View>
                        <View>
                            <H3 style={padding10}>出库申请审批信息</H3>
                            <Field name="applyAduitor" type="text" label="出库申请审批人" disable component={renderSimpleInput} />
                            <Field name="applyAduitorPhone" type="text" label="联系电话" disable component={renderSimpleInput} />
                            <Field name="applyAduitStatus" type="text" label="申请审批状态" disable component={renderSimpleInput} />
                            <Field name="applyAduitTime" type="text" label="审批时间" disable component={renderSimpleInput} />
                            <Field name="applyAduitOpinion" type="text" label="审批意见" disable component={renderSimpleInput} />
                        </View>
                    </View>
                )}
                {renderIf(!this.isNewReceipt() && !_.isNull(this.props.findStoreOutInfo.checkStatus))(
                    <View>
                        <View style={contentGapStyle}>{}</View>
                        <View>
                            <H3 style={padding10}>出库复核信息</H3>
                            <Field name="checker" type="text" label="复核人" disable component={renderSimpleInput} />
                            <Field name="checkerPhone" type="text" label="联系电话" disable component={renderSimpleInput} />
                            <Field name="checkStatus" type="text" label="复核提交状态" disable component={renderSimpleInput} />
                            <Field name="checkTime" type="text" label="复核提交时间" disable component={renderSimpleInput} />
                            <Field name="checkOpinion" type="text" label="复核提交意见" disable component={renderSimpleInput} />
                        </View>
                    </View>
                )}
                {renderIf(!this.isNewReceipt() && !_.isNull(this.props.findStoreOutInfo.checkAduitStatus))(
                    <View>
                        <View style={contentGapStyle}>{}</View>
                        <View>
                            <H3 style={padding10}>出库复核审批信息</H3>
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
                        <View style={contentGapStyle}>{}</View>
                        <View>
                            <H3 style={padding10}>操作信息</H3>
                            {renderIf(this.toShowCurrentOperatorControl())(
                                <Field name="operator" type="text" label="当前处理人" disable placeHolder="当前处理人" component={renderSimpleInput} />
                            )}
                            {renderIf(this.toShowNextOperationControl())(
                                <Item fixedLabel style={{ borderBottomWidth: 0 }}>
                                    <Label style={nextOpLabelStyle} ><Label style={{color: "red"}}>*  </Label>下一步操作</Label>
                                    <Field name="opType" type="text" label="下一步操作" component={this.renderNextOperationSel} validate={[required]} >
                                        { opTypePickerItem }
                                    </Field>
                                    <View style={{flex: 3}}>{}</View>
                                </Item>
                            )}
                            {renderIf(this.toShowNextOperatorControl() && this.props.findStoreOutOperators.list.length)(
                                <View>
                                    <Item fixedLabel style={{ borderBottomWidth: 0 }}>
                                        <Label style={nextOpLabelStyle} ><Label style={{color: "red"}}>*  </Label>下一步处理人</Label>
                                        <Field name="nextOperator" type="text" label="选择处理人" component={renderSelect} validate={[required]}>
                                            {this.props.findStoreOutOperators.list.map((value, key) => {
                                                return <Picker.Item label={`${value.nextOperator}`} value={value.nextOperator} key={key} />;
                                            })}
                                        </Field>
                                        <View style={{flex: 3}}>{}</View>
                                    </Item>
                                    <Field name="opinion" label="处理意见" placeHolder="填写处理意见" component={renderTextArea} validate={[required, maxLength500CN]}/>
                                    <View style={height20}>{}</View>
                                </View>
                            )}
                        </View>
                    </View>
                )}
                {/* A PopUpDialogs - findDeviceDialog */}
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
                        if (_.isEmpty(this.props.findStoreOutDevice.list)) {
                            this.props.fetchStoreOutDevice({
                                user: userName,
                                status: "2",
                            });
                        }
                        if (_.isEmpty(this.props.findStoreOutRoom.list)) {
                            this.props.fetchStoreOutRoom({
                                user: userName
                            });
                        }
                    }}
                >
                    <View>
                        { <FindDeviceForm /> }
                        <View style={popUpFindDeviceContentStyle}>
                            <ScrollView  horizontal={true}>
                                <View>
                                    <Table borderStyle={{ borderColor: "#E5E5E5" }} style={ [findDeviceTableData.length && { borderBottomWidth: 0 }] }>
                                        <Row data={findDeviceTableHeader} widthArr={findDeviceTableColWidthArr} style={ popUpRowStyle } textStyle={{ textAlign: "center" }} />
                                    </Table>
                                    <ScrollView style={{ marginTop: -1, width: "100%" }}>
                                        <Table borderStyle={{ borderColor: "#E5E5E5" }}>
                                            {
                                                findDeviceTableData.map((row, index) => {
                                                    let tableRow = row.slice(0, row.length - 4); // 需要显示的表内容
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
                                                            let cSN = row[14];
                                                            let cBelongUnit = row[12];
                                                            let cStoreRoomId = row[15];
                                                            let cSheetId = row[16];
                                                            let cDeviceTypeId = row[17];
                                                            if (_.find(this.props.currentStoreInItems, function(o) { return _.isEqual(o.summaryNo, currentSummaryNo); })) {
                                                                Alert.alert("填写提示", "您已添加过该备件");
                                                            } else {
                                                                if (!_.isEqual(cOldSumNum, "0")) {
                                                                    Alert.alert("库存备件选择确认", `汇总号：${currentSummaryNo},\n设备名：${currentDeviceName},\n库房：${cRoomName},\n货架名：${cSheetName}`, [
                                                                        { text: "取消", onPress: () => {} },
                                                                        { text: "确认", onPress: () => {
                                                                                this.props.array.push("storeOutItems", {
                                                                                    summaryNo: currentSummaryNo,
                                                                                    deviceName: currentDeviceName,
                                                                                    summaryNum: "1",
                                                                                    unitName: currentUnitName, // 单位
                                                                                    oldSummaryNum: cOldSumNum, // 原数量
                                                                                    usability: cUsability,
                                                                                    roomName: cRoomName,
                                                                                    sheetName: cSheetName,
                                                                                    deviceSN: _.isNull(cSN) ? "" : cSN,
                                                                                    belongUnit: cBelongUnit,
                                                                                });
                                                                                this.props.change(`storeOutItems.${this.state.currentRowOfItems}.validMonths`, cValidMonths + "");
                                                                                this.props.change(`storeOutItems.${this.state.currentRowOfItems}.deviceTypeId`, cDeviceTypeId + "");
                                                                                this.props.change(`storeOutItems.${this.state.currentRowOfItems}.sheetId`, cSheetId + "");
                                                                                this.props.change(`storeOutItems.${this.state.currentRowOfItems}.storeRoomId`, cStoreRoomId + "");
                                                                                this.props.change(`storeOutItems.${this.state.currentRowOfItems}.sourceType`, "2"); // sourceType === 2 表示从库存中添加
                                                                                this.findDeviceDialog.dismiss();
                                                                            }
                                                                        },
                                                                    ]);
                                                                } else {
                                                                    Alert.alert("库存备件选择确认", `汇总号：${currentSummaryNo},\n设备名：${currentDeviceName},\n库房：${cRoomName},\n货架名：${cSheetName}\n\n因原数量为 0，需判断当前可用性`, [
                                                                        { text: "取消", onPress: () => {} },
                                                                        { text: "确认并为好件", onPress: () => {
                                                                                this.props.array.push("storeOutItems", {
                                                                                    summaryNo: currentSummaryNo,
                                                                                    deviceName: currentDeviceName,
                                                                                    summaryNum: "1",
                                                                                    unitName: currentUnitName, // 单位
                                                                                    oldSummaryNum: cOldSumNum, // 原数量
                                                                                    usability: "好件",
                                                                                    roomName: cRoomName,
                                                                                    sheetName: cSheetName,
                                                                                    deviceSN: _.isNull(cSN) ? "" : cSN,
                                                                                    belongUnit: cBelongUnit,
                                                                                });
                                                                                this.props.change(`storeOutItems.${this.state.currentRowOfItems}.validMonths`, cValidMonths + "");
                                                                                this.props.change(`storeOutItems.${this.state.currentRowOfItems}.deviceTypeId`, cDeviceTypeId + "");
                                                                                this.props.change(`storeOutItems.${this.state.currentRowOfItems}.sheetId`, cSheetId + "");
                                                                                this.props.change(`storeOutItems.${this.state.currentRowOfItems}.storeRoomId`, cStoreRoomId + "");
                                                                                this.props.change(`storeOutItems.${this.state.currentRowOfItems}.sourceType`, "2"); // sourceType === 2 表示从库存中添加
                                                                                this.findDeviceDialog.dismiss();
                                                                            }
                                                                        },
                                                                        { text: "确认并为坏件", onPress: () => {
                                                                                this.props.array.push("storeOutItems", {
                                                                                    summaryNo: currentSummaryNo,
                                                                                    deviceName: currentDeviceName,
                                                                                    summaryNum: "1",
                                                                                    unitName: currentUnitName, // 单位
                                                                                    oldSummaryNum: cOldSumNum, // 原数量
                                                                                    usability: "坏件",
                                                                                    roomName: cRoomName,
                                                                                    sheetName: cSheetName,
                                                                                    deviceSN: _.isNull(cSN) ? "" : cSN,
                                                                                    belongUnit: cBelongUnit,
                                                                                });
                                                                                this.props.change(`storeOutItems.${this.state.currentRowOfItems}.validMonths`, cValidMonths + "");
                                                                                this.props.change(`storeOutItems.${this.state.currentRowOfItems}.deviceTypeId`, cDeviceTypeId + "");
                                                                                this.props.change(`storeOutItems.${this.state.currentRowOfItems}.sheetId`, cSheetId + "");
                                                                                this.props.change(`storeOutItems.${this.state.currentRowOfItems}.storeRoomId`, cStoreRoomId + "");
                                                                                this.props.change(`storeOutItems.${this.state.currentRowOfItems}.sourceType`, "2"); // sourceType === 2 表示从库存中添加
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
                                                            style={ [ { height: 28 }, index % 2 && disableBgColor ] }
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
                {/* Loader */}
                <ProgressDialog
                    visible={ isFetching }
                    title="更新出库单"
                    message="更新中，请稍后..."
                    dialogStyle={progressDialogStyle}
                >
                </ProgressDialog>
            </Form>
        );

        return <DealWithStoreOut
            navigation={this.props.navigation}
            DealWithStoreOutForm={form}
            fetchedStoreOutTrack={this.props.findStoreOutTrack}
            storeOutInfo={ this.props.findStoreOutInfo }
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
    let { findStoreOutOperators,
        getStoreOutOperate,
        findStoreOutDevice,
        findStoreOutRoom,
        findStoreOutInfo,
        findStoreOutDetail,
        findStoreOutTrack,
        saveStoreOutInfo,
        submitStoreOut,
        user } = state;
    const isFindStoreOutInfoFetching = findStoreOutInfo.isFetching;
    const { getParam } = ownProps.navigation;
    let operateType = getParam("currentOperateType");
    findStoreOutInfo = findStoreOutInfo.list;
    return {
        currentOperateTypeFromPicker : formSelector(state, "opType"),
        currentOpinion : formSelector(state, "opinion"),
        currentNextOperator : formSelector(state, "nextOperator"),
        currentStoreInItems: formSelector(state, "storeOutItems"),
        findStoreOutOperators,
        getStoreOutOperate,
        findStoreOutDevice,
        findStoreOutRoom,
        findStoreOutInfo,
        isFindStoreOutInfoFetching,
        findStoreOutTrack,
        saveStoreOutInfo,
        submitStoreOut,
        user,
        initialValues: _.isEqual(operateType, "add") ? {
            applyer: getParam("currentApplier"),
            applyerPhone: getParam("currentPhoneNum"),
            statusName: getParam("currentStatusName"),
            status: getParam("currentStatus"),
            operator: getParam("currentOperator"),
        } : {
            outNo: findStoreOutInfo.outNo,
            applyDate: findStoreOutInfo.applyDate,
            applyer: findStoreOutInfo.applyer,
            applyerPhone: findStoreOutInfo.applyerPhone,
            brandName: findStoreOutInfo.brandName,
            brandInfo: findStoreOutInfo.brandInfo,
            expectedDate: findStoreOutInfo.expectedDate,
            actualDate: findStoreOutInfo.actualDate,
            sg_tag: findStoreOutInfo.sg_tag,
            sg_cm_no: findStoreOutInfo.sg_cm_no,
            sg_group_no: findStoreOutInfo.sg_group_no,
            statusName: findStoreOutInfo.statusName,
            whereabout: findStoreOutInfo.whereabout,
            status: findStoreOutInfo.status,
            remark: findStoreOutInfo.remark,
            applyAduitor: findStoreOutInfo.applyAduitor,
            applyAduitorPhone: findStoreOutInfo.applyAduitorPhone,
            applyAduitStatus: JUDGETOSTR[parseInt(findStoreOutInfo.applyAduitStatus, 10)],
            applyAduitTime: findStoreOutInfo.applyAduitTime,
            applyAduitOpinion: findStoreOutInfo.applyAduitOpinion,
            checker: findStoreOutInfo.checker,
            checkerPhone: findStoreOutInfo.checkerPhone,
            checkStatus: REVIEWTOSTR[parseInt(findStoreOutInfo.checkStatus, 10)],
            checkTime: findStoreOutInfo.checkTime,
            checkOpinion: findStoreOutInfo.checkOpinion,
            checkAduitor: findStoreOutInfo.checkAduitor,
            checkAduitorPhone: findStoreOutInfo.checkAduitorPhone,
            checkAduitStatus: JUDGETOSTR[parseInt(findStoreOutInfo.checkAduitStatus, 10)],
            checkAduitTime: findStoreOutInfo.checkAduitTime,
            checkAduitOpinion: findStoreOutInfo.checkAduitOpinion,
            operator: findStoreOutInfo.operator,
            opType: findStoreOutInfo.opType,
            nextOperator: findStoreOutInfo.nextOperator,
            opinion: findStoreOutInfo.opinion,
            storeOutItems: findStoreOutDetail.list
        },
        enableReinitialize: true,
    };
}

const DealWithStoreOutContainer = connect(mapStateToProps, {
    fetchStoreOutInfo,
    fetchStoreOutDetail,
    fetchStoreOutTrackAction,
    fetchStoreOutDevice,
    fetchStoreOutRoom,
    fetchStoreOutOperation,
    fetchStoreOutOperators,
    toSaveStoreOutInfo,
    toDeleteStoreOutInfo,
    toSubmitStoreOut,
})(
    reduxForm({
        form: DEALWITHSTOREOUTFORM,
    })(DealWithStoreOutForm)
);

const formSelector = formValueSelector(DEALWITHSTOREOUTFORM);

export default DealWithStoreOutContainer;
