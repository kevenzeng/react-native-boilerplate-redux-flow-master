// @flow
import * as React from "react";
import { View, ScrollView, TouchableOpacity, Alert, Dimensions } from "react-native";
import { connect } from "react-redux";
import DealWithStoreCheck from "../../stories/screens/DealWithStoreCheck";
import { Field, reduxForm, FieldArray, change, formValueSelector } from "redux-form";
import { Form, Text, Item, Button, Label, Picker, Icon, H3, Header, Left, Right, Body, Segment, CheckBox } from "native-base";
import PopupDialog, { DialogTitle } from "react-native-popup-dialog";
import { ProgressDialog } from "react-native-simple-dialogs";
import { Table, Row, Cell, TableWrapper } from "react-native-table-component";
import renderIf from "../../services/utils/renderIf";
import { required, maxLength500CN, maxLength1000CN, postInt } from "../../services/utils/formValidateUtils";
import _ from "lodash";
import storeCheckStyles from "./styles";
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
import FindSheetForm from "../../components/formComponents/FindSheetForm";
import {
    JUDGETOSTR,
    REVIEWTOSTR,
    DEAL_WITH_STORE_CHECK_FORM,
    STORE_CHECK_TRANS_INFO_SCREEN,
    STORE_CHECK_ITEMS_LIST_SCREEN,
} from "../../boot/config";
import { fetchStoreCheckInfo } from "../../actions/kfgl_storecheck/findStoreCheckInfoAction";
import { fetchStoreCheckDetail } from "../../actions/kfgl_storecheck/findStoreCheckDetailAction";
import { fetchStoreCheckDetailForType1 } from "../../actions/kfgl_storecheck/findStoreCheckDetailForType1Action";
import { fetchStoreCheckTrack as fetchStoreCheckTrackAction } from "../../actions/kfgl_storecheck/findStoreCheckTrackAction";
import { fetchStoreCheckDeviceType } from "../../actions/kfgl_storecheck/findDeviceTypeAction";
import { fetchStoreCheckRoom } from "../../actions/kfgl_storecheck/findRoomAction";
import { fetchStoreCheckStoreRoom } from "../../actions/kfgl_storecheck/findStoreRoomAction";
import { fetchStoreCheckSheet } from "../../actions/kfgl_storecheck/findSheetAction";
import { fetchStoreCheckOperators } from "../../actions/kfgl_storecheck/findOperatersAction";
import { getStoreCheckOperate as getStoreCheckOperateAction } from "../../actions/kfgl_storecheck/getStoreCheckOperateAction";
import { toSaveStoreCheckInfo } from "../../actions/kfgl_storecheck/saveStoreCheckInfoAction";
import { deleteStoreCheckInfo } from "../../actions/kfgl_storecheck/deleteStoreCheckInfoAction";
import { toSubmitStorecheck } from "../../actions/kfgl_storecheck/submitStorecheckAction";
import { fetchSheetsByCheckNo } from "../../actions/kfgl_storecheck/findSheetsByCheckNoAction";
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
    renderPickerStyle,
    storeRoomItemTextStyle, storeRoomItemStyle,
    nextOpLabelStyle,
    contentGapStyle, padding10, height20,
    itemsRowStyle, itemsRowTextStyle,
    progressDialogStyle,
    popUpTitleTextStyle, popUpRowStyle, popUpFindDeviceContentStyle
} = styles;

class DealWithStoreCheckForm extends React.Component<Props, State> {

    constructor(props) {
        super(props);

        this.state = {
            selected: "key0",
            currentRowOfItems: 0, // 获得当前行次序
            indexForSelectRoomAndSheet: 0,
            selectedSheets: []
        };
    }

    static navigationOptions = ({navigation}) => ({
        header: _.isEqual(navigation.getParam("currentOperateType"), "add")
            ? <LeftHeader navigation={navigation} headerTitle={ navigation.getParam("headerTitle") } />
            : <Header hasSegment>
                <Left style={{ flex: 1 }}>
                    <Button transparent onPress={() => navigation.goBack()}>
                        <Icon name="ios-arrow-back" style={arrowBackFontSize}/>
                    </Button>
                </Left>

                <Body style={{ flex: 1.5 }}>
                <Segment style={{backgroundColor: "transparent", borderColor: "transparent", alignSelf: "flex-start"}}>
                    <Button active style={segmentFirstStyle} first><Text>     盘点单信息     </Text></Button>

                    {renderIf(!_.isEqual(navigation.getParam("currentStatus"), "01"))(
                        <Button onPress={ () => {
                            navigation.navigate(STORE_CHECK_ITEMS_LIST_SCREEN, {
                                isShowItems: !_.isEqual(navigation.getParam("currentStatus"), "01"),
                            });
                        } }><Text>盘点库存备件列表</Text></Button>
                    )}

                    <Button style={segmentLastStyle}
                            onPress={() => {
                                navigation.navigate(STORE_CHECK_TRANS_INFO_SCREEN, {
                                    isShowItems: !_.isEqual(navigation.getParam("currentStatus"), "01"),
                                });
                            }}
                            last>
                        <Text>盘点流程流转信息</Text>
                    </Button>
                </Segment>
                </Body>

                <Right style={{ flex: 1 }} />
            </Header>
    });

    componentDidMount() {
        // The Hidden Fields Setting
        const { getParam } = this.props.navigation;
        this.props.dispatch(change(DEAL_WITH_STORE_CHECK_FORM, "status", getParam("currentStatus") || "01"));
        this.props.dispatch(change(DEAL_WITH_STORE_CHECK_FORM, "operateType", getParam("currentOperateType")));
        this.props.dispatch(change(DEAL_WITH_STORE_CHECK_FORM, "storeRoomId", ""));
        this.mainRequests();
    }

    mainRequests() {
        const { getParam } = this.props.navigation;
        const { userName } = this.props.user.authorization;
        const checkNo = getParam("currentCheckNo");
        const status = getParam("currentStatus");
        const operator = getParam("currentOperator");
        const operateType = getParam("currentOperateType");
        if (_.isEqual(operateType, "update") && !_.isEmpty(checkNo)) {
            this.props.fetchStoreCheckInfo({
                user: userName,
                checkNo: checkNo,
                operateType: "update",
            });
            this.props.fetchSheetsByCheckNo({
                user: userName,
                checkNo: checkNo,
            });
            this.props.fetchStoreCheckTrackAction({
                user: userName,
                checkNo: checkNo
            });

            if (_.isEqual(operator, userName)) {
                this.props.getStoreCheckOperateAction({
                    user: userName,
                    status: status,
                });
            }
            this.props.fetchStoreCheckDetail({
                user: userName,
                checkNo: checkNo,
                sourceType: "2",
            });
            if (_.isEqual(status, "03")) {
                this.props.fetchStoreCheckDetailForType1({
                    user: userName,
                    checkNo: checkNo,
                });
            }
        } else {
            // 为新建单 operation type 赋值
            this.props.dispatch(change(DEAL_WITH_STORE_CHECK_FORM, "opType", "01"));
            // 获取新建单下一处理人
            this.props.fetchStoreCheckOperators({
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
     * 显示盘点单，控制信息是否只读
     * 控制是否显示操作信息，不匹配不显示操作信息
     * @returns {boolean|*}
     */
    isCurrentUserAsOperator() {
        // operator 不是登录人 user 时，只显示盘点单，所有信息都是只读，不显示操作信息
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
        const cStatus = getParam("currentStatus");
        return (_.isEqual(cStatus, "03"));
    }

    status01Editable() {
        const { getParam } = this.props.navigation;
        const cStatus = getParam("currentStatus");
        return ((_.isEqual(cStatus, "01")) || this.isNewReceipt()) && this.isCurrentUserAsOperator();
    }

    //申请中和申请审批时隐藏盘点入库信息
    renderItemsControl() {
        return _.includes(["01", "02"], this.props.navigation.getParam("currentStatus"));
    }

    removeAllSheetFieldArray() {
        // 不用更新 state, 勾选的时候已经更新过了
        this.props.array.removeAll("sheetInfoIds");
    }

    // Render Local Redux Form Components
    // 盘点库房
    renderStoreCheckRoom = ({ input: { onFocus, value , ...restInput }, itemStyle, label, disable, placeHolder, necessary, meta: { touched, error }}) => (
        <Item fixedLabel style={storeCheckStyles.renderStoreCheckRoomItem}>
            <Label style={nextOpLabelStyle}>{ necessary ? <Label style={{color: "red"}}>*  </Label> : "" }{ label }</Label>
            <Button transparent dark
                    onPress={
                        () => { this.roomNameSettingsDialog.show(); }
                    }
                    disabled={disable}
                    style={[ touched && error && errorBorderStyle
                        , disable && disableBgColor
                        , storeCheckStyles.renderStoreCheckRoomBtn ]}
            >
                <Text style={[ storeCheckStyles.renderStoreCheckRoomBtnText, disable && { color: "#666666" }]}{...restInput}>
                    {value}{!value && "点击选择库房"}
                </Text>
            </Button>
            <Icon name="home" style={storeCheckStyles.renderStoreCheckRoomIcon} />
            <View style={{ flex: 3 }}>{ touched && ( (error && <Text style={storeCheckStyles.renderStoreCheckRoomError}>{error}</Text>))}</View>
        </Item>);

    // 备件货架
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

    renderNextOperationSel = ({ input, disable, label, children, meta: { touched, error }, ...custom }) => (
        <Picker style={[touched && error && errorBorderStyle, renderPickerStyle]}
                mode="dropdown" {...input}
                selectedValue={input.value}
                enabled={ !disable }
                onValueChange={(value) => {
                    setTimeout(() => {
                        input.onChange(value);
                        if (!_.isEqual(value, "05")) {
                            this.props.fetchStoreCheckOperators({
                                user: this.props.user.authorization.userName,
                                checkNo: this.props.navigation.getParam("currentCheckNo"),
                                status: this.props.navigation.getParam("currentStatus"),
                                opType: value
                            });
                        }
                    }, 10);
                }} children={children} {...custom} />
    );

    // 备件 FieldArray
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
                        <Field name={`${item}.roomName`} disable type="text" label="库房" component={renderItemDetails} itemStyle={{ flex: 2 }} validate={this.isStoreRoomRequired() ? [] : [required]} />
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
                        <Text>添加数据来源：备件类型</Text>
                    </Button>
                </View>
            )}
        </View>
    );

    // FieldArray 货架
    renderSheet = ({ input: { onFocus, value , ...restInput }, itemStyle, label, disable }) => (
        <Button transparent success
                disabled={disable}
                style={[storeCheckStyles.sheetBtn]}
        >
            <Text style={[storeCheckStyles.sheetBtnText]}{...restInput}>
                {value}
            </Text>
        </Button>
    );

    // storeCheck 新加 FieldArray
    renderSheets = ({ fields }) => (
        <View>
            <View style={{ flexDirection: "row", flex: 1, padding: 15, flexWrap: "wrap" }}>
                {fields.map((item, index) => (
                    <View name={item} key={`${index}`} style={{ flexDirection: "row", padding: 5 }}>
                        <Field name={`${item}.sheetName`} disable type="text" label="货架名称" component={this.renderSheet} />
                    </View>
                ))}
            </View>
            {renderIf(this.status01Editable())(
                <View style={{  borderColor: "#E5E5E5", borderWidth: 1, borderTopWidth: 0, width: "100%", flexDirection: "row" }}>
                    <Button transparent danger
                            onPress={ () => {
                                if (_.isEmpty(this.props.currentStoreCheckRoomId)) {
                                    Alert.alert("提示", "请先选择库房", [
                                        { text: "确认", onPress: () => {}},
                                    ]);
                                    return;
                                }
                                this.sheetSettingsDialog.show();
                                // 清空货架们，多选货架添加
                            }} style={{ width: "100%", justifyContent: "center", flex: 1 }}>
                        <Text>+选择货架</Text>
                    </Button>
                    <Button transparent danger
                            onPress={ () => {
                                // TODO: 清空 FieldArray
                                this.removeAllSheetFieldArray();
                            }
                            } style={{ width: "100%", justifyContent: "center", flex: 1 }}
                    >
                        <Text>-清空</Text>
                    </Button>
                </View>
            )}
        </View>
    );

    saveHelper(values) {
        const { getParam } = this.props.navigation;
        let tempValues = _.cloneDeep(values); // 不能直接操作 values
        let formattedValues = {
            "sourceType": [],
            "summaryNo": [],
            "summaryNum": [],
            "oldSummaryNum": [],
            "storeRoomId1": [],
            "sheetId1": [],
            "deviceTypeId": [],
            "deviceSN": [],
            "unitName": [],
            "validMonths": [],
            "usability": [],
            "belongUnit": [],
        };
        let { storeCheckItems: storeCheckItems } = tempValues;
        if (!_.isEmpty(storeCheckItems)) {
            for ( let item in storeCheckItems) {
                formattedValues.sourceType.push(storeCheckItems[item].sourceType || "");
                formattedValues.summaryNo.push(storeCheckItems[item].summaryNo || "");
                formattedValues.summaryNum.push(storeCheckItems[item].summaryNum || "");
                formattedValues.oldSummaryNum.push(storeCheckItems[item].oldSummaryNum || "");
                formattedValues.storeRoomId1.push(storeCheckItems[item].storeRoomId1 || "");
                formattedValues.sheetId1.push(storeCheckItems[item].sheetId1 || "");
                formattedValues.deviceTypeId.push(storeCheckItems[item].deviceTypeId || "");
                formattedValues.deviceSN.push(storeCheckItems[item].deviceSN || "");
                formattedValues.validMonths.push(storeCheckItems[item].validMonths || "");
                formattedValues.unitName.push(storeCheckItems[item].unitName || "");
                formattedValues.usability.push(storeCheckItems[item].usability || "");
                formattedValues.belongUnit.push(storeCheckItems[item].belongUnit || "");
            }
            delete tempValues.storeCheckItems;
        }

        formattedValues = { ...tempValues, ...formattedValues };
        formattedValues.user = this.props.user.authorization.userName;
        formattedValues.operateType = getParam("currentOperateType");
        // formattedValues.sheetInfoIds = this.state.selectedSheets.join(",");
        // reformat sheetInfoIds
        formattedValues.sheetInfoIds = formattedValues.sheetInfoIds.map(function(item){
            return item.sheetId;
        }).join(",");
        console.log("Save Value: ", formattedValues);
        this.props.toSaveStoreCheckInfo(formUrlEncoded(formattedValues, { ignorenull : true, skipIndex: true, sorted: false }));
    }

    // 不使用
    deleteHelper() {
        const checkNo = this.props.navigation.getParam("currentCheckNo");
        const { userName } = this.props.user.authorization;
        this.props.deleteStoreCheckInfo({
            user: userName,
            checkNo: checkNo
        });
        this.props.navigation.goBack();
    }

    submitHelper(values) {
        const { getParam } = this.props.navigation;
        const cStatus = getParam("currentStatus");
        const operator = getParam("currentOperator");
        const currentCheckNo = getParam("currentCheckNo");
        const { userName } = this.props.user.authorization;
        const { currentOperateTypeFromPicker,
            currentOpinion,
            currentNextOperator
        } = this.props;

        let submittedObj = {
            user: userName,
            checkNo: currentCheckNo,
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
        this.props.toSubmitStorecheck(submittedObj);
    }

    selectASheet = item => {
        const { selectedSheets } = this.state;
        if (!selectedSheets.includes(item)) {
            this.setState({ selectedSheets: [...selectedSheets, item] });
        } else {
            this.setState({ selectedSheets: selectedSheets.filter( i => i !== item )});
        }
    };

    render() {
        const { handleSubmit } = this.props;
        const { userName } = this.props.user.authorization;

        // loader controller
        const isFetching = this.props.findStoreCheckTrack.isFetching ||
            this.props.isFindStoreCheckInfoFetching ||
            this.props.findStoreCheckDeviceType.isFetching ||
            this.props.findStoreCheckDetail.isFetching ||
            this.props.findStoreCheckDetailForType1.isFetching ||
            this.props.storeCheckFindOperaters.isFetching ||
            this.props.saveStoreCheckInfo.isFetching ||
            this.props.submitStorecheck.isFetching ||
            this.props.findStoreCheckRoom.isFetching ||
            this.props.findSheetsByCheckNo.isFetching ||
            this.props.findStoreCheckSheet.isFetching;

        const popUpDeviceType = ["整机", "组件", "辅助配件"]; // 下拉列表

        // 复选货架
        const checkBoxEle = (data) => (
            <View style={{ alignSelf: "center" }}>
                <CheckBox checked={this.state.selectedSheets.includes(data)} onPress={() => { this.selectASheet(data); }} />
            </View>
        );

        // Tables Header
        const findDeviceTypeTableHeader = ["", "备件名称", "厂商", "设备型号", "有效月数", "类型"]; // 备件
        const findRoomHeader = ["", "库房名称", "库房楼层", "面积"]; // 库房
        const findSheetHeader = ["", "库房名称", "库房楼层", "货架名称", "货架备注"]; // 货架

        // Tables Column Width
        const findDeviceTypeTableColWidthArr = [1, 3, 2, 3, 2, 2];
        const findRoomColWidthArr = [1, 3, 2, 2];
        const findSheetColWidthArr = [1, 3, 2, 3, 2];

        // Tables Row Data
        let findDeviceTypeTableData = [];
        let findRoomTableData = [];
        let findSheetTableData = [];

        // Construct Table Data
        // 从备件类型
        this.props.findStoreCheckDeviceType.list.map(
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

        // 选库房
        this.props.findStoreCheckRoom.list.map((row, index) => {
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
        this.props.findStoreCheckSheet.list.map((row, index) => {
            let tempArr = [], tempObj = {
                index: "",
                roomName: "",
                roomLevel: "",
                sheetName: "",
                remark: "",
                sheetId: "",
                roomId: "",
            };
            tempObj.index = index + 1;
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
            opTypePickerItem = this.props.getStoreCheckOperate.list.map((value, key) => {
                    return <Picker.Item label={`${value.operateTypeName}`}
                                        value={value.operateType} key={key}/>;
            });
        } else {
            opTypePickerItem = [<Picker.Item label = "请选择" value="" key={"0"} />, <Picker.Item label = "提交审批" value="01" key={"1"}/>];
        }

        const tableHeader = ["备件汇总号", "备件名称", "入库数量", "单位", "有效月数", "库房", "货架", "SN/PN", "可用性", "归属单位", "操作"];

        const form = (
            <Form>
                <Field name="checkNo" disable label="盘点单号" component={renderSimpleInput} />
                <Field name="applyDate" disable label="申请日期" component={renderDateField} />
                <Field name="applyer" disable label="盘点申请人" component={renderSimpleInput} />
                <Field name="applyerPhone" disable label="联系电话" component={renderSimpleInput} />
                <Field name="expectedDate" disable={this.isEditAreaEditable()} label="预计盘点日期" necessary component={renderDateField} validate={[required]}/>
                <Field name="actualDate" disable placeHolder="-" label="实际盘点日期" component={renderDateField} />
                <Field name="roomName" disable={!this.status01Editable()} label="盘点库房" component={this.renderStoreCheckRoom} />
                <Field name="statusName" disable placeHolder="申请中" label="盘点单状态" necessary component={renderSimpleInput} />
                <Field name="remark" disable={this.isEditAreaEditable()} label="描述信息" necessary component={renderSimpleInput} validate={[required, maxLength1000CN]} />
                <View style={contentGapStyle}>{}</View>
                <View>
                    <H3 style={padding10}>盘点货架</H3>
                    <FieldArray name="sheetInfoIds" component={this.renderSheets} />
                </View>
                {renderIf(!this.renderItemsControl())(
                    <View>
                        <View style={contentGapStyle}>{}</View>
                        <View style={padding10}>
                            <H3 style={padding10}>盘点入库备件明细</H3>
                            <Table borderStyle={{ borderColor: "#E5E5E5" }}>
                                <Row data={tableHeader} flexArr={[2.5, 2.5, 1, 0.5, 1, 2, 2, 2, 1, 1, 0.7]} style={itemsRowStyle} textStyle={itemsRowTextStyle} />
                            </Table>
                            <FieldArray name="storeCheckItems" component={this.renderItems} />
                        </View>
                    </View>
                )}
                {renderIf(!this.isNewReceipt() && !_.isNull(this.props.findStoreCheckInfo.applyAduitStatus))(
                    <View>
                        <View style={contentGapStyle}>{}</View>
                        <View>
                            <H3 style={padding10}>盘点申请审批信息</H3>
                            <Field name="applyAduitor" type="text" label="盘点申请审批人" disable component={renderSimpleInput} />
                            <Field name="applyAduitorPhone" type="text" label="联系电话" disable component={renderSimpleInput} />
                            <Field name="applyAduitStatus" type="text" label="申请审批状态" disable component={renderSimpleInput} />
                            <Field name="applyAduitTime" type="text" label="审批时间" disable component={renderSimpleInput} />
                            <Field name="applyAduitOpinion" type="text" label="审批意见" disable component={renderSimpleInput} />
                        </View>
                    </View>
                )}
                {renderIf(!this.isNewReceipt() && !_.isNull(this.props.findStoreCheckInfo.checkStatus))(
                    <View>
                        <View style={contentGapStyle}>{}</View>
                        <View>
                            <H3 style={padding10}>盘点复核信息</H3>
                            <Field name="checker" type="text" label="复核人" disable component={renderSimpleInput} />
                            <Field name="checkerPhone" type="text" label="联系电话" disable component={renderSimpleInput} />
                            <Field name="checkStatus" type="text" label="复核提交状态" disable component={renderSimpleInput} />
                            <Field name="checkTime" type="text" label="复核提交时间" disable component={renderSimpleInput} />
                            <Field name="checkOpinion" type="text" label="复核提交意见" disable component={renderSimpleInput} />
                        </View>
                    </View>
                )}
                {renderIf(!this.isNewReceipt() && !_.isNull(this.props.findStoreCheckInfo.checkAduitStatus))(
                    <View>
                        <View style={contentGapStyle}>{}</View>
                        <View>
                            <H3 style={padding10}>盘点复核审批信息</H3>
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
                            {renderIf(this.toShowNextOperatorControl() && this.props.storeCheckFindOperaters.list.length)(
                                <View>
                                    <Item fixedLabel style={{ borderBottomWidth: 0 }}>
                                        <Label style={nextOpLabelStyle} ><Label style={{color: "red"}}>*  </Label>下一步处理人</Label>
                                        <Field name="nextOperator" type="text" label="选择处理人" component={renderSelect} validate={[required]}>
                                            {this.props.storeCheckFindOperaters.list.map((value, key) => {
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
                {/* Four PopUpDialogs - findDeviceTypeDialog */}
                <PopupDialog
                    dialogTitle={
                        <DialogTitle
                            title="备件类型选择"
                            hasTitleBar={false}
                            titleTextStyle={popUpTitleTextStyle}
                        />
                    }
                    ref={(popupDialog) => {
                        this.findDeviceTypeDialog = popupDialog;
                    }}
                    overlayOpacity={0.5}
                    containerStyle={{
                        // TODO: dynamic height
                        marginTop: 300,
                        width: Dimensions.get("window").width,
                    }}
                    width={0.9}
                    height={0.9}
                    onShown={() => {
                        if (_.isEmpty(this.props.findStoreCheckDeviceType.list)) {
                            this.props.fetchStoreCheckDeviceType({
                                user: userName,
                            });
                        }
                    }}
                >
                    <View>
                        { <FindDeviceTypeForm fetchDeviceTypeAction={this.props.fetchStoreCheckDeviceType}/> }
                        <View style={popUpFindDeviceContentStyle}>
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
                                                                this.props.array.push("storeCheckItems", {
                                                                    deviceName: `${row[1]}`,
                                                                    summaryNum: "1",
                                                                    roomName: this.props.currentStoreCheckRoomName,
                                                                    validMonths: `${row[4]}`,
                                                                    unitName: `${row[6]}`,
                                                                    usability: "好件",
                                                                    belongUnit: `${row[2]}`
                                                                });
                                                                this.props.change(`storeCheckItems.${this.state.currentRowOfItems}.storeRoomId1`, this.props.currentStoreCheckRoomId);
                                                                this.props.change(`storeCheckItems.${this.state.currentRowOfItems}.oldSummaryNum`, "0");
                                                                this.props.change(`storeCheckItems.${this.state.currentRowOfItems}.deviceTypeId`, row[row.length - 1] + "");
                                                                this.props.change(`storeCheckItems.${this.state.currentRowOfItems}.sourceType`, "1"); // sourceType == 1 表示从备件类型中添加
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

                {/* findSheetDialog, 不需要 findRoom */}
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
                    containerStyle={{
                        // TODO: dynamic height
                        marginTop: 300,
                        width: Dimensions.get("window").width,
                    }}
                    width={0.7}
                    height={0.6}
                    onShown={() => {
                        if (_.isEmpty(this.props.findStoreCheckStoreRoom.list)) {
                            this.props.fetchStoreCheckStoreRoom({
                                user: userName
                            });
                        }
                        // 每次都请求，满足根据有没有库房进行判断
                        if (_.isEmpty(this.props.findStoreCheckSheet.list)) {
                            this.props.fetchStoreCheckSheet({
                                user: userName,
                                storeRoomId: this.props.currentStoreCheckRoomId || ""
                            });
                        }
                    }}
                >
                    <View>
                        { <FindSheetForm
                            fetchSheetAction={this.props.fetchStoreCheckSheet}
                            storeRoomList={this.props.findStoreCheckStoreRoom.list}
                            disableStoreRoomSelection={true}
                        /> }
                        <View style={popUpFindDeviceContentStyle}>
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
                                                                this.props.change(`storeCheckItems.${this.state.indexForSelectRoomAndSheet}.roomName`, row[1] + "");
                                                                this.props.change(`storeCheckItems.${this.state.indexForSelectRoomAndSheet}.storeRoomId1`, row[6] + "");
                                                                this.props.change(`storeCheckItems.${this.state.indexForSelectRoomAndSheet}.sheetName`, row[3] + "");
                                                                this.props.change(`storeCheckItems.${this.state.indexForSelectRoomAndSheet}.sheetId1`, row[5] + "");
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

                {/* roomNameSettingsDialog */}
                <PopupDialog
                    dialogTitle={
                        <DialogTitle
                            title="库房信息"
                            hasTitleBar={false}
                            titleTextStyle={popUpTitleTextStyle}
                        />
                    }
                    ref={(popupDialog) => {
                        this.roomNameSettingsDialog = popupDialog;
                    }}
                    overlayOpacity={0.5}
                    containerStyle={{
                        // TODO: dynamic height
                        marginTop: 0,
                        width: Dimensions.get("window").width,
                    }}
                    width={0.6}
                    height={0.6}
                    onShown={ () => {
                        if (_.isEmpty(this.props.findStoreCheckRoom.list)) {
                            this.props.fetchStoreCheckRoom({
                                user: userName
                            });
                        }
                    }}
                >
                    <View>
                        <View style={popUpFindDeviceContentStyle}>
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
                                                                this.props.change("storeRoomId", row[row.length - 1] + "");
                                                                this.props.change("roomName", row[1] + "");
                                                                this.roomNameSettingsDialog.dismiss();
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

                {/* sheetSettingsDialog */}
                <PopupDialog
                    dialogTitle={
                        <DialogTitle
                            title="货架选择"
                            hasTitleBar={false}
                            titleTextStyle={popUpTitleTextStyle}
                        />
                    }
                    ref={(popupDialog) => {
                        this.sheetSettingsDialog = popupDialog;
                    }}
                    overlayOpacity={0.5}
                    containerStyle={{
                        // TODO: dynamic height
                        marginTop: 0,
                        width: Dimensions.get("window").width,
                    }}
                    width={0.7}
                    height={0.65}
                    onShown={() => {
                        // 更新库房下拉列表
                        if (_.isEmpty(this.props.findStoreCheckStoreRoom.list)) {
                            this.props.fetchStoreCheckStoreRoom({
                                user: userName
                            });
                        }
                        // 每次都请求，满足根据有没有库房进行判断
                        // TODO: 在 saga 配已选库房
                        if (_.isEmpty(this.props.findStoreCheckSheet.list)) {
                            this.props.fetchStoreCheckSheet({
                                user: userName,
                                storeRoomId: this.props.currentStoreCheckRoomId || ""
                            });
                        }
                        // Align selectedSheets and FieldArray
                        this.props.currentSheetInfoIds && this.setState({
                            selectedSheets: this.props.currentSheetInfoIds.map(function (item) {
                                return item.sheetId;
                            })
                        });
                    }}
                >
                    <View>
                        { // TODO: 添加给盘点用的 Form，disable 了库房下拉框的 Search Bar
                            <FindSheetForm
                            fetchSheetAction={this.props.fetchStoreCheckSheet}
                            storeRoomList={this.props.findStoreCheckStoreRoom.list}
                            disableStoreRoomSelection={true}
                        /> }
                        <View style={ storeCheckStyles.sheetDataGrid }>
                            <Table borderStyle={{ borderColor: "#E5E5E5" }} style={ [findSheetTableData.length && { borderBottomWidth: 0 }] }>
                                <Row data={findSheetHeader} flexArr={findSheetColWidthArr} style={ popUpRowStyle } textStyle={{ textAlign: "center" }} />
                            </Table>
                            <ScrollView>
                                <Table borderStyle={{ borderColor: "#E5E5E5" }}>
                                    {
                                        findSheetTableData.map((row, index) => {
                                            let tableRow = row.slice(0, row.length - 2); // tableRow 作显示用，不显示 sheetId, storeRoomId
                                            return <TableWrapper key={index} style={[ popUpRowStyle, { flexDirection: "row" }, index % 2 && disableBgColor ]}>
                                                {
                                                    tableRow.map((cellData, cellIndex) => {
                                                        return <Cell key={cellIndex} data={cellIndex === 0 ? checkBoxEle(row[5]) : cellData} style={{ flex: findSheetColWidthArr[cellIndex] }} textStyle={{ textAlign: "center" }} borderStyle={{ borderColor: "#E5E5E5" }} />;
                                                    })
                                                }
                                            </TableWrapper>;
                                        })
                                    }
                                </Table>
                            </ScrollView>
                        </View>
                        <View style={{ width: "100%", alignItems: "center", justifyContent: "center", alignContent: "center" }}>
                            <Button style={storeCheckStyles.sheetDialogSelectBtn} onPress={() => {
                                if (_.isEmpty(this.state.selectedSheets)) {
                                    Alert.alert("出现错误", "没有勾选货架");
                                    return;
                                }
                                this.removeAllSheetFieldArray();
                                findSheetTableData.map((row) => {
                                    if (_.includes(this.state.selectedSheets, row[5])) {
                                        this.props.array.push("sheetInfoIds", {
                                            sheetName: `${row[3]}`,
                                            sheetId: `${row[5]}`,
                                        });
                                    }
                                });
                                this.sheetSettingsDialog.dismiss();
                            }}>
                                <Text>选  择</Text>
                            </Button>
                        </View>
                    </View>
                </PopupDialog>

                {/* Loader */}
                <ProgressDialog
                    visible={ isFetching }
                    title="更新盘点单"
                    message="更新中，请稍后..."
                    dialogStyle={progressDialogStyle}
                />
            </Form>
        );

        return <DealWithStoreCheck
            navigation={this.props.navigation}
            DealWithStoreCheckForm={form}
            fetchedStoreCheckTrack={this.props.findStoreCheckTrack}
            storeCheckInfo={ this.props.findStoreCheckInfo }
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
    let { storeCheckFindOperaters,
        getStoreCheckOperate,
        findStoreCheckDeviceType,
        findStoreCheckRoom,
        findStoreCheckStoreRoom,
        findStoreCheckSheet,
        findStoreCheckInfo,
        findStoreCheckDetail,
        findStoreCheckDetailForType1,
        findStoreCheckTrack,
        saveStoreCheckInfo,
        submitStorecheck,
        findSheetsByCheckNo,
        user } = state;
    const isFindStoreCheckInfoFetching = findStoreCheckInfo.isFetching;
    const { getParam } = ownProps.navigation;
    let operateType = getParam("currentOperateType");
    findStoreCheckInfo = findStoreCheckInfo.list;
    return {
        currentOperateTypeFromPicker : formSelector(state, "opType"),
        currentOpinion : formSelector(state, "opinion"),
        currentNextOperator : formSelector(state, "nextOperator"),
        currentStoreCheckItems: formSelector(state, "storeCheckItems"),
        currentSheetInfoIds: formSelector(state, "sheetInfoIds"),
        currentStoreCheckRoomId: formSelector(state, "storeRoomId"),
        currentStoreCheckRoomName: formSelector(state, "roomName"),
        storeCheckFindOperaters,
        getStoreCheckOperate,
        findStoreCheckDeviceType,
        findStoreCheckDetail,
        findStoreCheckDetailForType1,
        findStoreCheckRoom,
        findStoreCheckStoreRoom,
        findStoreCheckInfo,
        isFindStoreCheckInfoFetching,
        findStoreCheckTrack,
        findStoreCheckSheet,
        saveStoreCheckInfo,
        submitStorecheck,
        findSheetsByCheckNo,
        user,
        initialValues: _.isEqual(operateType, "add") ? {
            applyer: getParam("currentApplier"),
            applyerPhone: getParam("currentPhoneNum"),
            statusName: getParam("currentStatusName"),
            status: getParam("currentStatus"),
            operator: getParam("currentOperator"),
        } : {
            checkNo: findStoreCheckInfo.checkNo,
            operator: findStoreCheckInfo.operator,
            expectedDate: findStoreCheckInfo.expectedDate,
            actualDate: findStoreCheckInfo.actualDate,
            status: findStoreCheckInfo.status,
            statusName: findStoreCheckInfo.statusName,
            storeRoomId: findStoreCheckInfo.storeRoomId, // 隐藏值
            roomName: findStoreCheckInfo.roomName,
            remark: findStoreCheckInfo.remark,
            applyer: findStoreCheckInfo.applyer,
            applyerPhone: findStoreCheckInfo.applyerPhone,
            applyDate: findStoreCheckInfo.applyDate,
            applyAduitor: findStoreCheckInfo.applyAduitor,
            applyAduitorPhone: findStoreCheckInfo.applyAduitorPhone,
            applyAduitStatus: JUDGETOSTR[parseInt(findStoreCheckInfo.applyAduitStatus, 10)],
            applyAduitTime: findStoreCheckInfo.applyAduitTime,
            applyAduitOpinion: findStoreCheckInfo.applyAduitOpinion,
            checker: findStoreCheckInfo.checker,
            checkerPhone: findStoreCheckInfo.checkerPhone,
            checkStatus: REVIEWTOSTR[parseInt(findStoreCheckInfo.checkStatus, 10)],
            checkTime: findStoreCheckInfo.checkTime,
            checkOpinion: findStoreCheckInfo.checkOpinion,
            checkAduitor: findStoreCheckInfo.checkAduitor,
            checkAduitorPhone: findStoreCheckInfo.checkAduitorPhone,
            checkAduitStatus: JUDGETOSTR[parseInt(findStoreCheckInfo.checkAduitStatus, 10)],
            checkAduitTime: findStoreCheckInfo.checkAduitTime,
            checkAduitOpinion: findStoreCheckInfo.checkAduitOpinion,
            insertTime: findStoreCheckInfo.insertTime, // 初次保存时间
            nextOperator: findStoreCheckInfo.nextOperator,
            opType: findStoreCheckInfo.opType,
            opinion: findStoreCheckInfo.opinion,
            storeCheckItems: findStoreCheckDetailForType1.list,
            sheetInfoIds: findSheetsByCheckNo.list,
        },
        enableReinitialize: true,
    };
}

const DealWithStoreInContainer = connect(mapStateToProps, {
    fetchStoreCheckInfo,
    fetchStoreCheckDetail,
    fetchStoreCheckDetailForType1,
    fetchStoreCheckTrackAction,
    fetchStoreCheckDeviceType,
    fetchStoreCheckRoom,
    fetchStoreCheckStoreRoom,
    fetchStoreCheckSheet,
    getStoreCheckOperateAction,
    fetchStoreCheckOperators,
    toSaveStoreCheckInfo,
    deleteStoreCheckInfo,
    toSubmitStorecheck,
    fetchSheetsByCheckNo,
    resetFindSheetForm,
})(
    reduxForm({
        form: DEAL_WITH_STORE_CHECK_FORM,
    })(DealWithStoreCheckForm)
);

const formSelector = formValueSelector(DEAL_WITH_STORE_CHECK_FORM);

export default DealWithStoreInContainer;
