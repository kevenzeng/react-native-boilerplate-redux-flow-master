// @flow
// 用于编辑出库单时弹出窗的检索项查询
import React, { Component } from "react";
import { connect } from "react-redux";
import { View } from "react-native";
import { Field, reduxForm, } from "redux-form";
import { Form, Label, Button, Text, Picker, Item, Input } from "native-base";
import { fetchStoreOutDevice } from "../../../actions/storeOut/findStoreOutDeviceAction";
import { USABILITY, EXPIRE_FLAG, DEVICE_TYPE } from "../../../boot/config";
import { renderSelect2 } from "../renderItems";
import screenUtil from "../../../boot/screenUtil";
const { px2dp } = screenUtil;

export interface Props {

}

export interface State {

}

const renderDialogInput = ({ input, label, meta: { touched, error, warning } }) => (
    <Item fixedLabel style={{ borderBottomWidth: 0, marginLeft: px2dp(5) }}>
        <Label style={{ flex: 1, textAlign: "center" }}>{label}</Label>
        <Input {...input} style={{ flex: 2.5, borderColor: "#E5E5E5", borderWidth: 1, height: px2dp(35) }}/>
        {touched && ((error && <Text style={{ color: "red" }}>{error}</Text>) || (warning && <Text>{warning}</Text>))}
    </Item>
);

class StoreOutFindDeviceForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: 0,
        };
    }

    render() {
        const { handleSubmit, reset } = this.props;

        return (
            <Form>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ flex: 1, paddingLeft: px2dp(3) }}>
                        <Field name="summaryNo" type="text" label="汇总号" component={renderDialogInput}/>
                    </View>
                    <View style={{ flex: 1, paddingLeft: px2dp(3) }}>
                        <Field name="deviceName" type="text" label="备件名称" component={renderDialogInput}/>
                    </View>
                    <View style={{ flex: 1, paddingRight: px2dp(5) }}>
                        <Field name="deviceType" type="text" label="类型" component={renderSelect2} wrapped>
                            {DEVICE_TYPE.map((value, key) => {
                                return <Picker.Item label={`${value.status}`} value={value.value} key={key} />;
                            })}
                        </Field>
                    </View>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ flex: 1, paddingLeft: px2dp(3) }}>
                        <Field name="belongUnit" label="归属单位" component={renderDialogInput} />
                    </View>
                    <View style={{ flex: 1, paddingLeft: px2dp(3) }}>
                        <Field name="sheetName" type="text" label="货架" component={renderDialogInput}/>
                    </View>
                    <View style={{ flex: 1, paddingRight: px2dp(5) }}>
                        <Field name="usability" type="text" label="可用性" component={renderSelect2} wrapped>
                            {USABILITY.map((value, key) => {
                                return <Picker.Item label={`${value.status}`} value={value.value} key={key} />;
                            })}
                        </Field>
                    </View>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ flex: 1, paddingLeft: px2dp(3) }}>
                        <Field name="storeRoomId" label="备件库房" component={renderSelect2} labelStyle={{ flex: 1.1 }} wrapped>
                            {this.props.findStoreOutRoom.list.map((value, key) => {
                                return <Picker.Item label={`${value.roomName}`} value={value.id} key={key} />;
                            })}
                        </Field>
                    </View>
                    <View style={{ flex: 1, paddingLeft: px2dp(3) }}>
                        <Field name="status" type="text" label="状态" disable component={renderSelect2}>
                            <Picker.Item label={"在库"} key={0} />
                        </Field>
                    </View>
                    <View style={{ flex: 1, paddingRight: px2dp(5) }}>
                        <Field name="expireFlag" type="text" label="是否过期" component={renderSelect2} labelStyle={{ flex: 1.1 }} wrapped>
                            {EXPIRE_FLAG.map((value, key) => {
                                return <Picker.Item label={`${value.status}`} value={value.value} key={key} />;
                            })}
                        </Field>
                    </View>
                </View>
                <View style={{ flexDirection: "row", padding: px2dp(15) }}>
                    <View style={{ flex: 1.4, flexDirection: "row", alignItems: "center" }}>
                        <Field name="brandName" label="厂商" component={renderDialogInput} />
                    </View>
                    <View style={{ flex: 1 }}>{}</View>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <View style={{ width: "70%", alignSelf: "center" }}>
                            <Button full small danger style={{ borderRadius: 6 }}
                                    onPress={handleSubmit((values) => {
                                            this.props.fetchStoreOutDevice(values);
                                        }
                                    )}>
                                <Text>查 询</Text>
                            </Button>
                        </View>
                    </View>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <View style={{ width: "70%", alignSelf: "center" }}>
                            <Button full small info style={{ borderRadius: 6 }} onPress={() => reset()}><Text>重 置</Text></Button>
                        </View>
                    </View>
                </View>
            </Form>
        );
    }
}

function mapStateToProps({ user, findStoreOutRoom }) {
    return {
        findStoreOutRoom,
        initialValues: {
            status: "2",
        }
    };
}

export default connect(mapStateToProps, { fetchStoreOutDevice })(
    reduxForm({
        form: "storeOutFindDeviceForm"
    })(StoreOutFindDeviceForm)
);
