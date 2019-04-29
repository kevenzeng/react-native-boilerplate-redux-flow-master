// @flow
import * as React from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import DealWithDevice from "../../stories/screens/DealWithDevice";
import { Field, reduxForm } from "redux-form";
import { Body, Button, Form, Header, Icon, Input, Item, Label, Left, Right, Text, Title } from "native-base";
import { ProgressDialog } from "react-native-simple-dialogs";
import _ from "lodash";
import { DEALWITHDEVICEFORM, DEVICE_SCREEN } from "../../boot/config";
import { fetchDeviceInfo } from "../../actions/kfgl_device/findDeviceInfoAction";
import DatePicker from "react-native-datepicker";
import styles from "./styles";

export interface Props {
    navigation: any,
}

export interface State {
}

export const renderSimpleInput = ({ input, label, type, disable, multiline, placeHolder, meta: { touched, error, warning } }) => (
    <Item fixedLabel style={styles.renderInput}>
        <Label style={styles.renderInputLabel}>{label}</Label>
        <Input disabled={disable} {...input} type={type} multiline={multiline} placeholder={placeHolder}
               style={[ disable ? "" : styles.borderWidth1, styles.renderInputInput ]}/>
    </Item>
);

export const renderDateField = ({ input: { onChange, value, ...restInput }, disable, label, meta: { touched, error } }) => {
    return (
        <Item fixedLabel style={styles.renderInput}>
            <Label style={styles.renderInputLabel}>{label}</Label>
            <DatePicker
                style={styles.pickerStyle}
                disabled={disable}
                customStyles={{
                    dateInput: styles.pickerCustomStyleDateInput,
                    dateText: styles.pickerCustomStyleDateText,
                    placeholderText: styles.pickerCustomStylePlaceholderText
                }}
                date={value}
                placeholder=""
                locale={"zh-cn"}
                format="YYYY-MM-DD"
                confirmBtnText="确定"
                cancelBtnText="取消"
                onDateChange={onChange}
                showIcon={false}
            />
            <View style={[ { flex: 2 } ]}>{touched && (error && <Text style={{ color: "red" }}>{error}</Text>)}</View>
        </Item>
    );
};

class DealWithDeviceForm extends React.Component<Props, State> {

    constructor(props) {
        super(props);
    }

    static navigationOptions = ({ navigation }) => ({
        header: <Header>
            <Left style={{ flex: 1 }}>
                <Button transparent onPress={() => navigation.navigate(DEVICE_SCREEN)}>
                    <Icon name="ios-arrow-back" style={styles.icon} />
                </Button>
            </Left>

            <Body style={styles.headerItem}>
            <Title>库存信息</Title>
            </Body>

            <Right style={styles.headerItem} />
        </Header>,
    });

    componentDidMount() {
        this.mainRequests();
    }

    mainRequests() {
        const { userName } = this.props.user.authorization;
        const cSummaryNo = this.props.navigation.getParam("currentSummaryNo");
        if (!_.isEmpty(cSummaryNo)) {
            this.props.fetchDeviceInfo({
                user: userName,
                summaryNo: cSummaryNo,
            });
        }
    }

    render() {

        // loader controller
        const isFetching = this.props.deviceFindDeviceInfo.isFetching;

        const form = (
            <Form>
                <View style={styles.container}>
                    <View style={{ flex: 1 }}>
                        <Field name="summaryNo" disable type="input" label="备件汇总号" component={renderSimpleInput}/>
                        <Field name="deviceName" disable type="text" label="备件名称" component={renderSimpleInput}/>
                        <Field name="summaryNum" disable type="text" label="库存数量" component={renderSimpleInput}/>
                        <Field name="unitName" disable type="text" label="单位" component={renderSimpleInput}/>
                        <Field name="deviceTypeName" disable type="text" label="类型名称" component={renderSimpleInput}/>
                        <Field name="brandName" disable type="text" label="厂商" component={renderSimpleInput}/>
                        <Field name="deviceModel" disable type="text" label="适用设备" component={renderSimpleInput}/>
                        <Field name="deviceSN" disable type="text" label="序列号" component={renderSimpleInput}/>
                        <Field name="roomName" disable type="text" label="库房名称" component={renderSimpleInput}/>
                        <Field name="sheetName" disable type="text" label="货架名称" component={renderSimpleInput}/>
                        <Field name="validMonths" disable type="text" label="有效月数" component={renderSimpleInput}/>
                        <Field name="remark" disable type="text" multiline label="备注" component={renderSimpleInput}/>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Field name="inNo" disable type="text" label="入库单号" component={renderSimpleInput}/>
                        <Field name="statusName" disable type="text" label="库存状态名称" component={renderSimpleInput}/>
                        <Field name="usability" disable type="text" label="可用性" component={renderSimpleInput}/>
                        <Field name="belongUnit" disable type="text" label="归属单位" component={renderSimpleInput}/>
                        <Field name="contractName" disable type="text" label="采购合同名称" component={renderSimpleInput}/>
                        <Field name="signNo" disable type="text" label="报签号" component={renderSimpleInput}/>
                        <Field name="outNo" disable type="text" label="出库单号" component={renderSimpleInput}/>
                        <Field name="checkNo" disable type="text" label="盘点单号" component={renderSimpleInput}/>
                        <Field name="inDate" disable type="text" label="入库日期" component={renderDateField}/>
                        <Field name="outDate" disable type="text" label="出库日期" component={renderDateField}/>
                        <Field name="lastCheckDate" disable type="text" label="盘点日期" component={renderDateField}/>
                        <Field name="expireDate" disable type="text" label="过期日期" component={renderDateField}/>
                    </View>
                </View>
                {/* Loader */}
                <ProgressDialog
                    visible={isFetching}
                    title="更新备件列表"
                    message="更新中，请稍后..."
                    dialogStyle={styles.progressBarStyle}
                >
                </ProgressDialog>
            </Form>
        );

        return <DealWithDevice
            navigation={this.props.navigation}
            DealWithDeviceForm={form}
            currentUser={this.props.user.authorization}
        />;
    }
}

function mapStateToProps({ deviceFindDeviceInfo, user }) {
    let { data = {}, msg = "" } = deviceFindDeviceInfo.list;
    return _.isEqual(msg, "success") ? {
        deviceFindDeviceInfo,
        user,
        initialValues: {
            summaryNo: data.summaryNo,
            deviceTypeId: data.deviceTypeId,
            deviceName: data.deviceName,
            summaryNum: data.summaryNum,
            unitName: data.unitName,
            deviceType: data.deviceType,
            deviceTypeName: data.deviceTypeName,
            brandName: data.brandName,
            deviceModel: data.deviceModel,
            deviceSN: data.deviceSN,
            storeRoomId: data.storeRoomId,
            roomName: data.roomName,
            sheetId: data.sheetId,
            sheetName: data.sheetName,
            inDate: data.inDate,
            inNo: data.inNo,
            status: data.status,
            statusName: data.statusName,
            usability: data.usability,
            belongUnit: data.belongUnit,
            contractName: data.contractName,
            signNo: data.signNo,
            outNo: data.outNo,
            checkNo: data.checkNo,
            lastCheckDate: data.lastCheckDate,
            remark: data.remark,
            validMonths: data.validMonths,
            expireDate: data.expireDate,
        },
        enableReinitialize: true,
    } : { deviceFindDeviceInfo, user };
}

const DealWithDeviceContainer = connect(mapStateToProps, {
    fetchDeviceInfo,
})(
    reduxForm({
        form: DEALWITHDEVICEFORM,
    })(DealWithDeviceForm)
);

export default DealWithDeviceContainer;
