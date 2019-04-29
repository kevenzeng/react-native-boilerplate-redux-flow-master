// @flow
import * as React from "react";
import { View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { connect } from "react-redux";
import DealWithStoreTrans from "../../stories/screens/DealWithStoreTrans";
import { Field, reduxForm, FieldArray, change, formValueSelector } from "redux-form";
import { Form, Text, Item, Button, Label, Picker, Icon, H3, Header, Left, Right, Body, Segment } from "native-base";
import PopupDialog, { DialogTitle } from "react-native-popup-dialog";
import { ProgressDialog } from "react-native-simple-dialogs";
import { Table, Row } from "react-native-table-component";
import renderIf from "../../services/utils/renderIf";
import { required, maxLength500CN, maxLength30, maxLength1000CN } from "../../services/utils/formValidateUtils";
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
import FindDeviceForm from "../../components/formComponents/FindDeviceForm";
import FindSheetForm from "../../components/formComponents/FindSheetForm";
import { JUDGETOSTR, DEALWITHSTORETRANSFORM, DEVICETYPETOSTR, INSTORESTATUSTOSTR, QR_SCANNER_SCREEN, DEAL_WITH_STORE_TRANS_SCREEN } from "../../boot/config";
import { fetchStoreTransInfo } from "../../actions/kfgl_storetrans/findStoreTransInfoAction";
import { fetchStoreTransDetail } from "../../actions/kfgl_storetrans/findStoreTransDetailAction";
import { fetchStoreTransTrack as fetchStoreTransTrackAction } from "../../actions/kfgl_storetrans/findStoreTransTrackAction";
import { fetchDevice } from "../../actions/kfgl_storetrans/findDeviceAction";
import { fetchRoom } from "../../actions/kfgl_storetrans/findRoomAction";
import { fetchStoreRoom } from "../../actions/kfgl_storetrans/findStoreRoomAction";
import { fetchSheet } from "../../actions/kfgl_storetrans/findSheetAction";
import { fetchStoreTransOperators } from "../../actions/kfgl_storetrans/findOperatersAction";
import { fetchStoreTransOperate } from "../../actions/kfgl_storetrans/getStoreTransOperateAction";
import { saveStoreTransInfo as saveStoreTransInfoAction } from "../../actions/kfgl_storetrans/saveStoreTransInfoAction";
import { deleteStoreTransInfo } from "../../actions/kfgl_storetrans/deleteStoreTransInfoAction";
import { submitStoreTrans } from "../../actions/kfgl_storetrans/submitStoretransAction";
import { resetFindSheetForm } from "../../actions/formActions/resetFormAction";

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
    popUpTitleTextStyle, popUpContainerForStoreTrans, popUpRowStyle, popUpFindDeviceContentStyle, popUpFindRoomContentStyle
} = styles;

class DealWithStoreTransForm extends React.Component<Props, State> {

    constructor(props) {
        super(props);

        this.state = {
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
                        <Icon name="ios-arrow-back" style={ arrowBackFontSize }/>
                    </Button>
                </Left>

                <Body style={{ flex: 1 }}>
                <Segment style={{backgroundColor: "transparent", borderColor: "transparent", alignSelf: "flex-end"}}>
                    <Button active style={segmentFirstStyle} first><Text>     移库单信息     </Text></Button>
                    <Button style={segmentLastStyle}
                            onPress={() => {
                                navigation.navigate("TransInfo", {
                                    "currentPage": "storeTrans",
                                    "leftSegmentTitle": "     移库单信息     ",
                                    "rightSegmentTitle": "移库流程流转信息",
                                });
                            }}
                            last>
                        <Text>移库流程流转信息</Text>
                    </Button>
                </Segment>
                </Body>

                <Right style={{ flex: 1 }} />
            </Header>
    });

    componentDidMount() {
        // The Hidden Fields Setting
        const { getParam } = this.props.navigation;
        this.props.dispatch(change(DEALWITHSTORETRANSFORM, "status", getParam("currentStatus") || "01"));
        this.props.dispatch(change(DEALWITHSTORETRANSFORM, "operateType", getParam("currentOperateType")));
        this.mainRequests();
    }

    mainRequests() {
        const { getParam } = this.props.navigation;
        const { userName } = this.props.user.authorization;
        const transNo = getParam("currentTransNo");
        const status = getParam("currentStatus");
        const operator = getParam("currentOperator");
        const operateType = getParam("currentOperateType");
        if (_.isEqual(operateType, "update") && !_.isEmpty(transNo)) {
            this.props.fetchStoreTransInfo({
                user: userName,
                transNo: transNo,
                operateType: "update",
            });
            this.props.fetchStoreTransTrackAction({
                user: userName,
                transNo: transNo
            });

            if (_.isEqual(operator, userName)) {
                this.props.fetchStoreTransOperate({
                    user: userName,
                    status: status,
                });
            }
            this.props.fetchStoreTransDetail({
                user: userName,
                transNo: transNo
            });
        } else {
            // 为新建单 operation type 赋值
            this.props.dispatch(change(DEALWITHSTORETRANSFORM, "opType", "01"));
            // 获取新建单下一处理人
            this.props.fetchStoreTransOperators({
                user: userName,
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
        return !(this.isCurrentUserAsOperator() && (_.includes(["01"], cStatus)));
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
            !((_.isEqual(cStatus, "01") && _.isEqual(this.props.currentOperateTypeFromPicker, "05"))); // 申请中关闭
    }

    // 库存、货架和归属单位填写控制 true: not required
    isStoreRoomRequired() {
        const { getParam } = this.props.navigation;
        const cStatus = getParam("currentStatus");
        return !(_.includes(["01"], cStatus));
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
                        <Field name={`${item}.summaryNo`} disable type="text" label="备件汇总号" component={renderItemDetails} itemStyle={{ flex: 2.3 }} />
                        <Field name={`${item}.deviceName`} disable type="text" label="备件名称" component={renderItemDetails} itemStyle={{ flex: 2.3 }} />
                        <Field name={`${item}.brandName`} disable type="text" label="厂商" component={renderItemDetails} itemStyle={{ flex: 1 }} />
                        <Field name={`${item}.summaryNum`} disable type="text" label="库存数量" component={renderItemDetails} itemStyle={{ flex: 0.5 }} />
                        <Field name={`${item}.unitName`} disable type="text" label="单位" component={renderItemDetails} itemStyle={{ flex: 1 }} />
                        <Field name={`${item}.oldRoomName`} disable type="text" label="原库房" component={renderItemDetails} itemStyle={{ flex: 1.7 }} />
                        <Field name={`${item}.oldSheetName`} disable type="text" label="原货架" component={renderItemDetails} itemStyle={{ flex: 1.7 }} />
                        <Field name={`${item}.roomName`} disable={this.isEditAreaEditable()} type="text" label="新库房" component={this.renderItemStoreRoom} itemStyle={{ flex: 1.7 }} currentRowIndex={index} validate={this.isStoreRoomRequired() ? [] : [required]} />
                        <Field name={`${item}.sheetName`} disable={this.isEditAreaEditable()} type="text" label="新货架" component={this.renderItemSheet} itemStyle={{ flex: 1.7 }} currentRowIndex={index} validate={this.isStoreRoomRequired() ? [] : [required]} />
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
                <View style={{  borderColor: "#E5E5E5", borderWidth: 1, borderTopWidth: 0, width: "100%", flexDirection: "row" }}>
                    <Button transparent danger
                            onPress={ () => {
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
                                this.props.navigation.navigate(QR_SCANNER_SCREEN, { routeName: DEAL_WITH_STORE_TRANS_SCREEN, currentRowOfItems: fields.length });
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
                            this.props.fetchStoreTransOperators({
                                user: this.props.user.authorization.userName,
                                status: this.props.navigation.getParam("currentStatus"),
                                opType: value,
                                transNo: this.props.navigation.getParam("currentTransNo"),
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
            "storeRoomId": [],
            "sheetId": [],
            "oldStoreRoomId": [],
            "oldSheetId": [],
            "deviceTypeId": [],
            "unitName": [],
            "validMonths": [],
            "usability": [],
            "belongUnit": [],
            "brandName": [],
        };
        let { storeTransItems } = tempValues;
        if (_.isEmpty(storeTransItems)) {
            Alert.alert(
                "表单填写错误",
                "请添加至少一条移库明细信息",
                [{
                    text: "确认",
                    onPress: () => {}
                }]
            );
            return;
        }
        for ( let item in storeTransItems) {
            formattedValues.sourceType.push(storeTransItems[item].sourceType || "");
            formattedValues.summaryNo.push(storeTransItems[item].summaryNo || "");
            formattedValues.summaryNum.push(storeTransItems[item].summaryNum || "");
            formattedValues.storeRoomId.push(storeTransItems[item].storeRoomId || "");
            formattedValues.sheetId.push(storeTransItems[item].sheetId || "");
            formattedValues.oldStoreRoomId.push(storeTransItems[item].oldStoreRoomId || "");
            formattedValues.oldSheetId.push(storeTransItems[item].oldSheetId || "");
            formattedValues.deviceTypeId.push(storeTransItems[item].deviceTypeId || "");
            formattedValues.validMonths.push(storeTransItems[item].validMonths || "");
            formattedValues.unitName.push(storeTransItems[item].unitName || "");
            formattedValues.usability.push(storeTransItems[item].usability || "");
            formattedValues.belongUnit.push(storeTransItems[item].belongUnit || "");
            formattedValues.brandName.push(storeTransItems[item].brandName || "");
        }
        delete tempValues.storeTransItems;
        formattedValues = { ...tempValues, ...formattedValues };
        formattedValues.user = this.props.user.authorization.userName;
        formattedValues.operateType = getParam("currentOperateType");
        this.props.saveStoreTransInfoAction(formUrlEncoded(formattedValues, { ignorenull : true, skipIndex: true, sorted: false }));
    }

    deleteHelper() {
        const transNo = this.props.navigation.getParam("currentTransNo");
        const { userName } = this.props.user.authorization;
        this.props.deleteStoreTransInfo({
            user: userName,
            transNo: transNo
        });
        this.props.navigation.goBack();
    }

    submitHelper(values) {
        const { getParam } = this.props.navigation;
        const cStatus = getParam("currentStatus");
        const operator = getParam("currentOperator");
        const currentTransNo = getParam("currentTransNo");
        const { userName } = this.props.user.authorization;
        const { currentOperateTypeFromPicker,
            currentOpinion,
            currentNextOperator
        } = this.props;

        let submittedObj = {
            user: userName,
            transNo: currentTransNo,
            opType: currentOperateTypeFromPicker,
            status: cStatus,
        };

        if (_.includes(["01"], cStatus) && !_.isEqual(currentOperateTypeFromPicker, "05")) {
            this.saveHelper(values);
        }
        if (!_.isEqual(cStatus, "05") &&
            !_.isEqual(currentOperateTypeFromPicker, "05"))
        {
            submittedObj.operator = operator;
            submittedObj.nextOperator = currentNextOperator;
            submittedObj.opinion = currentOpinion;
        } else {
            submittedObj.operator = null;
        }
        this.props.submitStoreTrans(submittedObj);
    }

    render() {
        const { handleSubmit } = this.props;
        const { userName } = this.props.user.authorization;

        // loader controller
        const isFetching = this.props.findStoreTransTrack.isFetching ||
            this.props.isFindStoreTransInfoFetching ||
            this.props.findDeviceType.isFetching ||
            this.props.findStoreTransDevice.isFetching ||
            this.props.findStoreTransOperaters.isFetching ||
            this.props.saveStoreTransInfo.isFetching ||
            this.props.submitStoretrans.isFetching ||
            this.props.findStoreTransRoom.isFetching ||
            this.props.findStoreTransSheet.isFetching;

        // Tables Header
        const findDeviceTableHeader = ["", "备件汇总号", "备件名称", "厂商", "库存数量", "单位" , "有效月数", "可用性", "适用设备", "类型", "库房", "货架", "归属单位", "过期日期"]; // 库存
        const findRoomHeader = ["", "库房名称", "库房楼层", "面积"]; // 库房
        const findSheetHeader = ["", "库房名称", "库房楼层", "货架名称", "货架备注"]; // 货架

        // Tables Column Width
        const findDeviceTableColWidthArr = [20, 120, 120, 90, 60, 30, 60, 60, 60, 70, 100, 70, 70, 90];
        const findRoomColWidthArr = [1, 3, 2, 2];
        const findSheetColWidthArr = [1, 3, 2, 3, 2];

        // Tables Row Data
        let findDeviceTableData = [];
        let findRoomTableData = [];
        let findSheetTableData = [];

        // 从库存
        this.props.findStoreTransDevice.list.map(
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
        this.props.findStoreTransRoom.list.map((row, index) => {
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
        this.props.findStoreTransSheet.list.map((row, index) => {
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
            opTypePickerItem = this.props.getStoreTransOperate.list.map((value, key) => {
                    return <Picker.Item label={`${value.operateTypeName}`}
                                        value={value.operateType} key={key}/>;
            });
        } else {
            opTypePickerItem = [<Picker.Item label = "请选择" value="" key={"0"} />, <Picker.Item label = "提交审批" value="01" key={"1"}/>];
        }

        const tableHeader = ["备件汇总号", "备件名称", "厂商", "库存数量", "单位", "原库房", "原货架", "新库房", "新货架", "可用性", "归属单位", "删除"];

        const form = (
            <Form>
                <Field name="transNo" disable type="input" label="移库单号" component={renderSimpleInput} />
                <Field name="applyDate" disable type="text" label="申请日期" component={renderDateField} />
                <Field name="applyer" disable type="text" label="移库申请人" component={renderSimpleInput} />
                <Field name="applyerPhone" disable type="text" label="联系电话" component={renderSimpleInput} />
                <Field name="transDate" disable={this.isEditAreaEditable()} type="text" label="移库日期" necessary component={renderDateField} validate={[required]}/>
                <Field name="clause" disable={this.isEditAreaEditable()} type="text" label="移库原因" component={renderSimpleInput} validate={[maxLength30]} />
                <Field name="statusName" disable placeHolder="申请中" type="text" label="移库单状态" necessary component={renderSimpleInput} />
                <Field name="remark" disable={this.isEditAreaEditable()} type="text" label="描述信息" necessary component={renderSimpleInput} validate={[required, maxLength1000CN]} />
                <View style={contentGapStyle}>{}</View>
                <View style={padding10}>
                    <H3 style={padding10}>移库备件明细</H3>
                    <Table borderStyle={{ borderColor: "#E5E5E5" }}>
                        <Row data={tableHeader} flexArr={[2.3, 2.3, 1, 0.5, 1, 1.7, 1.7, 1.7, 1.7, 1, 1, 0.7]} style={itemsRowStyle} textStyle={itemsRowTextStyle} />
                    </Table>
                    <FieldArray name="storeTransItems" component={this.renderItems} />
                </View>
                {renderIf(!this.isNewReceipt() && !_.isNull(this.props.findStoreTransInfo.applyAduitStatus))(
                    <View>
                        <View style={contentGapStyle}>{}</View>
                        <View>
                            <H3 style={padding10}>移库申请审批信息</H3>
                            <Field name="applyAduitor" type="text" label="移库申请审批人" disable component={renderSimpleInput} />
                            <Field name="applyAduitorPhone" type="text" label="联系电话" disable component={renderSimpleInput} />
                            <Field name="applyAduitStatus" type="text" label="申请审批状态" disable component={renderSimpleInput} />
                            <Field name="applyAduitTime" type="text" label="审批时间" disable component={renderSimpleInput} />
                            <Field name="applyAduitOpinion" type="text" label="审批意见" disable component={renderSimpleInput} />
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
                            {renderIf(this.toShowNextOperatorControl() && this.props.findStoreTransOperaters.list.length)(
                                <View>
                                    <Item fixedLabel style={{ borderBottomWidth: 0 }}>
                                        <Label style={nextOpLabelStyle} ><Label style={{color: "red"}}>*  </Label>下一步处理人</Label>
                                        <Field name="nextOperator" type="text" label="选择处理人" component={renderSelect} validate={[required]}>
                                            {this.props.findStoreTransOperaters.list.map((value, key) => {
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
                {/* Three PopUpDialogs - findDeviceDialog */}
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
                    containerStyle={popUpContainerForStoreTrans}
                    width={0.9}
                    height={0.9}
                    onShown={() => {
                        if (_.isEmpty(this.props.findStoreTransDevice.list)) {
                            this.props.fetchDevice({
                                user: userName,
                                status: "2" // 在库
                            });
                        }
                        if (_.isEmpty(this.props.findStoreTransStoreRoom.list)) {
                            this.props.fetchStoreRoom({
                                user: userName
                            });
                        }
                    }}
                >
                    <View>
                        { <FindDeviceForm searchAction={this.props.fetchDevice} storeRoomList={this.props.findStoreTransStoreRoom.list} /> }
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
                                                            let currentBrandName = row[3];
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
                                                            if (_.find(this.props.currentStoreTransItems, function(o) { return _.isEqual(o.summaryNo, currentSummaryNo); })) {
                                                                Alert.alert("填写提示", "您已添加过该备件");
                                                            } else {
                                                                if (!_.isEqual(cOldSumNum, "0")) {
                                                                    Alert.alert("库存备件选择确认", `汇总号：${currentSummaryNo},\n设备名：${currentDeviceName},\n库房：${cRoomName},\n货架名：${cSheetName}`, [
                                                                        { text: "取消", onPress: () => {} },
                                                                        { text: "确认", onPress: () => {
                                                                                this.props.array.push("storeTransItems", {
                                                                                    summaryNo: currentSummaryNo,
                                                                                    deviceName: currentDeviceName,
                                                                                    summaryNum: cOldSumNum,
                                                                                    unitName: currentUnitName, // 单位
                                                                                    usability: cUsability,
                                                                                    oldRoomName: cRoomName,
                                                                                    oldSheetName: cSheetName,
                                                                                    deviceSN: _.isNull(cSN) ? "" : cSN,
                                                                                    belongUnit: cBelongUnit,
                                                                                    brandName: currentBrandName,
                                                                                });
                                                                                this.props.change(`storeTransItems.${this.state.currentRowOfItems}.deviceTypeId`, cDeviceTypeId + "");
                                                                                this.props.change(`storeTransItems.${this.state.currentRowOfItems}.validMonths`, cValidMonths + "");
                                                                                this.props.change(`storeTransItems.${this.state.currentRowOfItems}.oldSheetId`, cSheetId + "");
                                                                                this.props.change(`storeTransItems.${this.state.currentRowOfItems}.oldStoreRoomId`, cStoreRoomId + "");
                                                                                this.props.change(`storeTransItems.${this.state.currentRowOfItems}.sourceType`, "2"); // sourceType === 2 表示从库存中添加
                                                                                this.findDeviceDialog.dismiss();
                                                                            }
                                                                        },
                                                                    ]);
                                                                } else {
                                                                    Alert.alert("库存备件选择确认", `汇总号：${currentSummaryNo},\n设备名：${currentDeviceName},\n库房：${cRoomName},\n货架名：${cSheetName}\n\n因原数量为 0，需判断当前可用性`, [
                                                                        { text: "取消", onPress: () => {} },
                                                                        { text: "确认并为好件", onPress: () => {
                                                                                this.props.array.push("storeTransItems", {
                                                                                    summaryNo: currentSummaryNo,
                                                                                    deviceName: currentDeviceName,
                                                                                    summaryNum: cOldSumNum,
                                                                                    unitName: currentUnitName, // 单位
                                                                                    usability: "好件",
                                                                                    oldRoomName: cRoomName,
                                                                                    oldSheetName: cSheetName,
                                                                                    deviceSN: _.isNull(cSN) ? "" : cSN,
                                                                                    belongUnit: cBelongUnit,
                                                                                    brandName: currentBrandName,
                                                                                });
                                                                                this.props.change(`storeTransItems.${this.state.currentRowOfItems}.deviceTypeId`, cDeviceTypeId + "");
                                                                                this.props.change(`storeTransItems.${this.state.currentRowOfItems}.validMonths`, cValidMonths + "");
                                                                                this.props.change(`storeTransItems.${this.state.currentRowOfItems}.oldSheetId`, cSheetId + "");
                                                                                this.props.change(`storeTransItems.${this.state.currentRowOfItems}.oldStoreRoomId`, cStoreRoomId + "");
                                                                                this.props.change(`storeTransItems.${this.state.currentRowOfItems}.sourceType`, "2"); // sourceType === 2 表示从库存中添加
                                                                                this.findDeviceDialog.dismiss();
                                                                            }
                                                                        },
                                                                        { text: "确认并为坏件", onPress: () => {
                                                                                this.props.array.push("storeTransItems", {
                                                                                    summaryNo: currentSummaryNo,
                                                                                    deviceName: currentDeviceName,
                                                                                    summaryNum: cOldSumNum,
                                                                                    unitName: currentUnitName, // 单位
                                                                                    usability: "坏件",
                                                                                    oldRoomName: cRoomName,
                                                                                    oldSheetName: cSheetName,
                                                                                    deviceSN: _.isNull(cSN) ? "" : cSN,
                                                                                    belongUnit: cBelongUnit,
                                                                                    brandName: currentBrandName,
                                                                                });
                                                                                this.props.change(`storeTransItems.${this.state.currentRowOfItems}.deviceTypeId`, cDeviceTypeId + "");
                                                                                this.props.change(`storeTransItems.${this.state.currentRowOfItems}.validMonths`, cValidMonths + "");
                                                                                this.props.change(`storeTransItems.${this.state.currentRowOfItems}.oldSheetId`, cSheetId + "");
                                                                                this.props.change(`storeTransItems.${this.state.currentRowOfItems}.oldStoreRoomId`, cStoreRoomId + "");
                                                                                this.props.change(`storeTransItems.${this.state.currentRowOfItems}.sourceType`, "2"); // sourceType === 2 表示从库存中添加
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
                    containerStyle={popUpContainerForStoreTrans}
                    width={0.6}
                    height={0.6}
                    onShown={ () => {
                        if (_.isEmpty(this.props.findStoreTransRoom.list)) {
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
                                                                this.props.change(`storeTransItems.${this.state.indexForSelectRoomAndSheet}.storeRoomId`, row[row.length - 1] + "");
                                                                this.props.change(`storeTransItems.${this.state.indexForSelectRoomAndSheet}.roomName`, row[1] + "");
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
                    containerStyle={popUpContainerForStoreTrans}
                    width={0.7}
                    height={0.6}
                    onShown={() => {
                        if (_.isEmpty(this.props.findStoreTransStoreRoom.list)) {
                            this.props.fetchStoreRoom({
                                user: userName,
                            });
                        }
                        // 每次都请求，满足根据有没有库房进行判断
                        let currentIndex = this.state.indexForSelectRoomAndSheet;
                        let cStoreRoomId = this.props.currentStoreTransItems[currentIndex].storeRoomId;
                        this.props.fetchSheet({
                            user: userName,
                            storeRoomId: cStoreRoomId || ""
                        });
                    }}
                >
                    <View>
                        { <FindSheetForm
                            fetchSheetAction={this.props.fetchSheet}
                            storeRoomList={this.props.findStoreTransStoreRoom.list}
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
                                                                this.props.change(`storeTransItems.${this.state.indexForSelectRoomAndSheet}.roomName`, row[1] + "");
                                                                this.props.change(`storeTransItems.${this.state.indexForSelectRoomAndSheet}.storeRoomId`, row[6] + "");
                                                                this.props.change(`storeTransItems.${this.state.indexForSelectRoomAndSheet}.sheetName`, row[3] + "");
                                                                this.props.change(`storeTransItems.${this.state.indexForSelectRoomAndSheet}.sheetId`, row[5] + "");
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
                    title="更新移库单"
                    message="更新中，请稍后..."
                    dialogStyle={progressDialogStyle}
                >
                </ProgressDialog>
            </Form>
        );

        return <DealWithStoreTrans
            navigation={this.props.navigation}
            DealWithStoreTransForm={form}
            fetchedStoreTransTrack={this.props.findStoreTransTrack}
            storeTransInfo={ this.props.findStoreTransInfo }
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
    let { findStoreTransOperaters,
        getStoreTransOperate,
        findDeviceType,
        findStoreTransDevice,
        findStoreTransRoom,
        findStoreTransStoreRoom,
        findStoreTransSheet,
        findStoreTransInfo,
        findStoreTransDetail,
        findStoreTransTrack,
        saveStoreTransInfo,
        submitStoretrans,
        user } = state;
    const isFindStoreTransInfoFetching = findStoreTransInfo.isFetching;
    const { getParam } = ownProps.navigation;
    let operateType = getParam("currentOperateType");
    findStoreTransInfo = findStoreTransInfo.list;
    return {
        currentOperateTypeFromPicker : formSelector(state, "opType"),
        currentOpinion : formSelector(state, "opinion"),
        currentNextOperator : formSelector(state, "nextOperator"),
        currentStoreTransItems: formSelector(state, "storeTransItems"),
        findStoreTransOperaters,
        getStoreTransOperate,
        findDeviceType,
        findStoreTransDevice,
        findStoreTransRoom,
        findStoreTransStoreRoom,
        findStoreTransInfo,
        isFindStoreTransInfoFetching,
        findStoreTransTrack,
        findStoreTransSheet,
        saveStoreTransInfo,
        submitStoretrans,
        user,
        initialValues: _.isEqual(operateType, "add") ? {
            applyer: getParam("currentApplier"),
            applyerPhone: getParam("currentPhoneNum"),
            statusName: getParam("currentStatusName"),
            status: getParam("currentStatus"),
            operator: getParam("currentOperator"),
        } : {
            transNo: findStoreTransInfo.transNo,
            applyDate: findStoreTransInfo.applyDate,
            applyer: findStoreTransInfo.applyer,
            applyerPhone: findStoreTransInfo.applyerPhone,
            brandName: findStoreTransInfo.brandName,
            brandInfo: findStoreTransInfo.brandInfo,
            transDate: findStoreTransInfo.transDate,
            statusName: findStoreTransInfo.statusName,
            status: findStoreTransInfo.status,
            remark: findStoreTransInfo.remark,
            applyAduitor: findStoreTransInfo.applyAduitor,
            applyAduitorPhone: findStoreTransInfo.applyAduitorPhone,
            applyAduitStatus: JUDGETOSTR[parseInt(findStoreTransInfo.applyAduitStatus, 10)],
            applyAduitTime: findStoreTransInfo.applyAduitTime,
            applyAduitOpinion: findStoreTransInfo.applyAduitOpinion,
            operator: findStoreTransInfo.operator,
            opType: findStoreTransInfo.opType,
            nextOperator: findStoreTransInfo.nextOperator,
            opinion: findStoreTransInfo.opinion,
            storeTransItems: findStoreTransDetail.list
        },
        enableReinitialize: true,
    };
}

const DealWithStoreTransContainer = connect(mapStateToProps, {
    fetchStoreTransInfo,
    fetchStoreTransDetail,
    fetchStoreTransTrackAction,
    fetchDevice,
    fetchRoom,
    fetchStoreRoom,
    fetchSheet,
    fetchStoreTransOperate,
    fetchStoreTransOperators,
    saveStoreTransInfoAction,
    deleteStoreTransInfo,
    submitStoreTrans,
    resetFindSheetForm,
})(
    reduxForm({
        form: DEALWITHSTORETRANSFORM,
    })(DealWithStoreTransForm)
);

const formSelector = formValueSelector(DEALWITHSTORETRANSFORM);

export default DealWithStoreTransContainer;
