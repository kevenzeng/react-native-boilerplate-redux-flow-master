// @flow
// 用于编辑入库单时弹出窗的检索项查询
import React, { Component } from "react";
import { connect } from "react-redux";
import { View } from "react-native";
import { Field, reduxForm, } from "redux-form";
import { Form, Label, Button, Text, Picker } from "native-base";
import { renderDialogInput } from "./renderItems";
import { fetchDeviceType } from "../../actions/storeIn/findDeviceTypeAction";
import screenUtil from "../../boot/screenUtil";

const { px2dp } = screenUtil;

export interface Props {

}

export interface State {

}

class FindDeviceTypeForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: 0,
        };
    }

    renderSelect = ({ input, disable, label, children, ...custom }) => (
        <Picker
            mode="dropdown"
            supportedOrientations="Landscape-right"
            selectedValue={input.value}
            onValueChange={(value) => {
                setTimeout(() => {
                    input.onChange(value);
                }, 10);
            }}
            style={{ flex: 2, color: "#575757" }}
            children={children}
            {...input}
            {...custom}
        />
    );

    render() {
        const { handleSubmit, reset } = this.props;

        return (
            <Form>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ flex: 1 , paddingLeft: px2dp(3) }}>
                        <Field name="deviceName" type="text" label="备件名称" component={renderDialogInput}/>
                    </View>
                    <View style={{ flex: 1, paddingRight: px2dp(5) }}>
                        <Field name="brandName" type="text" label="厂  商" component={renderDialogInput}/>
                    </View>
                </View>
                <View style={{ flexDirection: "row", padding: px2dp(15) }}>
                    <View style={{ flex: 2, flexDirection: "row", alignItems: "center" }}>
                        <Label style={{ flex: 0.46 ,textAlign: "right", color: "#575757", fontSize: px2dp(17), paddingRight: px2dp(5) }}>备件类型</Label>
                        <Field name="deviceType" component={this.renderSelect}>
                            <Picker.Item label="请选择" value=""/>
                            <Picker.Item label="整机" value="1"/>
                            <Picker.Item label="组件" value="2"/>
                            <Picker.Item label="辅助配件" value="3"/>
                        </Field>
                    </View>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <View style={{ width: "70%", alignSelf: "center" }}>
                            <Button full small danger style={{ borderRadius: 6 }}
                                    onPress={handleSubmit((values) => {
                                            this.props.fetchDeviceTypeAction(values);
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

export default connect(null, { fetchDeviceType })(
    reduxForm({
        form: "findDeviceTypeForm"
    })(FindDeviceTypeForm)
);
