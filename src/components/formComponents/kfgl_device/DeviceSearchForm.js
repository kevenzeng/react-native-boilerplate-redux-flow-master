import React, { Component } from "react";
import { View, ScrollView } from "react-native";
import { connect } from "react-redux";
import { Field, reduxForm, } from "redux-form";
import { StyleSheet } from "react-native";
import { Button, Text, Picker } from "native-base";
import screenUtil from "../../../boot/screenUtil";
import { renderDateField, renderSimpleInput2, renderSelect2 } from "./../renderItems";
import { fetchDevice } from "../../../actions/kfgl_device/findDeviceAction";
import { STORE_STATUS, DEVICE_TYPE, EXPIRE_FLAG } from "../../../boot/config";

export interface Props {

}

export interface State {

}

const { px2dp } = screenUtil;



class DeviceSearchForm extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { reset, handleSubmit } = this.props;
        const { rowContainer, rowItem } = styles;

        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 8 }}>
                    <ScrollView>
                        <View style={rowContainer}>
                            <View style={rowItem}>
                                <Field name="inDateSt" label="入库日期开始" component={renderDateField} wrapped />
                            </View>
                            <View style={rowItem}>
                                <Field name="inDateEn" label="入库日期结束" component={renderDateField} wrapped />
                            </View>
                        </View>
                        <View style={rowContainer}>
                            <View style={rowItem}>
                                <Field name="outDateSt" label="出库日期开始" component={renderDateField} wrapped />
                            </View>
                            <View style={rowItem}>
                                <Field name="outDateEn" label="出库日期结束" component={renderDateField} wrapped />
                            </View>
                        </View>
                        <View style={rowContainer}>
                            <View style={rowItem}>
                                <Field name="lastCheckDateSt" label="盘点日期开始" component={renderDateField} wrapped />
                            </View>
                            <View  style={rowItem}>
                                <Field name="lastCheckDateEn" label="盘点日期结束" component={renderDateField} wrapped />
                            </View>
                        </View>

                        <View style={rowContainer}>
                            <View style={rowItem}>
                                <Field name="summaryNo" label="备件汇总号" component={renderSimpleInput2} wrapped />
                            </View>
                            <View  style={rowItem}>
                                <Field name="deviceName" label="备件名称" component={renderSimpleInput2} wrapped />
                            </View>
                        </View>
                        <View style={rowContainer}>
                            <View style={rowItem}>
                                <Field name="storeRoomId" label="备件库房" component={renderSelect2} wrapped>
                                    {this.props.deviceFindStoreRoom.list.map((value, key) => {
                                        return <Picker.Item label={`${value.roomName}`} value={value.id} key={key} />;
                                    })}
                                </Field>
                            </View>
                            <View  style={rowItem}>
                                <Field name="deviceType" label="备件类型" component={renderSelect2} wrapped>
                                    {DEVICE_TYPE.map((value, key) => {
                                        return <Picker.Item label={`${value.status}`} value={value.value} key={key} />;
                                    })}
                                </Field>
                            </View>
                        </View>
                        <View style={rowContainer}>
                            <View style={rowItem}>
                                <Field name="brandName" label="入库厂商" component={renderSimpleInput2} wrapped />
                            </View>
                            <View  style={rowItem}>
                                <Field name="sheetName" label="货架名称" component={renderSimpleInput2} wrapped/>
                            </View>
                        </View>

                        <View style={rowContainer}>
                            <View style={rowItem}>
                                <Field name="belongUnit" label="归属单位" component={renderSimpleInput2} wrapped/>
                            </View>
                            <View  style={rowItem}>
                                <Field name="inNo" label="入库单号" component={renderSimpleInput2} wrapped/>
                            </View>
                        </View>
                        <View style={rowContainer}>
                            <View style={rowItem}>
                                <Field name="outNo" label="出库单号" component={renderSimpleInput2} wrapped/>
                            </View>
                            <View  style={rowItem}>
                                <Field name="checkNo" label="盘点单号" component={renderSimpleInput2} wrapped/>
                            </View>
                        </View>

                        <View style={rowContainer}>
                            <View style={rowItem}>
                                <Field name="status" label="库存状态" component={renderSelect2}  wrapped>
                                    {STORE_STATUS.map((value, key) => {
                                        return <Picker.Item label={`${value.status}`} value={value.value} key={key} />;
                                    })}
                                </Field>
                            </View>
                            <View  style={rowItem}>
                                <Field name="expireFlag" label="是否过期" component={renderSelect2}  wrapped>
                                    {EXPIRE_FLAG.map((value, key) => {
                                        return <Picker.Item label={`${value.status}`} value={value.value} key={key} />;
                                    })}
                                </Field>
                            </View>
                        </View>

                        <View style={styles.rowContainer}>
                            <View style={styles.rowItem}>
                                <Field name="summaryNumSt" label="库存数量起" component={renderSimpleInput2} wrapped/>
                            </View>
                            <View style={styles.rowItem}>
                                <Field name="summaryNumEn" label="库存数量止" component={renderSimpleInput2} wrapped/>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <View style={{ flex: 1.5, justifyContent: "center" }}>
                    <View
                        style={{ flexDirection: "row", justifyContent: "space-around", width: "70%", alignSelf: "center" }}>
                        <View style={{ width: px2dp(210) }}>
                            <Button full success style={{ borderRadius: 6 }}
                                    onPress={handleSubmit((values) => {
                                        this.props.fetchDevice(values);
                                        this.props.popUpIns.dismiss();
                                    })}
                            >
                                <Text>查   询</Text>
                            </Button>
                        </View>
                        <View style={{ width: px2dp(210) }}>
                            <Button full danger style={{ borderRadius: 6 }} onPress={() => reset()}>
                                <Text>重   置</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

}

function mapStateToProps({ user, deviceFindStoreRoom }) {
    return {
        deviceFindStoreRoom,
        initialValues: {
            status: "2",
        }
    };
}

export default connect(mapStateToProps, { fetchDevice })(
    reduxForm({
        form: "KFGLDeviceSearchForm"
    })(DeviceSearchForm)
);

const styles: any = StyleSheet.create({
    rowContainer: {
        flexDirection: "row",
        justifyContent: "center",
        width: "80%",
        alignSelf: "center",
    },
    rowItem: {
        flex: 1
    }
});
