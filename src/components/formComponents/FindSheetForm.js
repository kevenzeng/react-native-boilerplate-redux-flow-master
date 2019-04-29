// @flow
// 用于编辑入库单时弹出窗的检索项查询
import React, { Component } from "react";
import { connect } from "react-redux";
import { View } from "react-native";
import { Field, reduxForm, } from "redux-form";
import { Form, Label, Button, Text, Picker } from "native-base";
import { renderDialogInput, renderSelect } from "./renderItems";
import { FINDSHEETFORM } from "../../boot/config";
import { fetchSheet } from "../../actions/storeIn/findSheetAction";
import screenUtil from "../../boot/screenUtil";

const { px2dp } = screenUtil;

class FindSheetForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { handleSubmit } = this.props;
        const disableFlag = this.props.disableStoreRoomSelection;
        return (
            <Form>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                        <Label style={{ marginLeft: px2dp(5), color: "#575757", fontSize: px2dp(17) }}>库房名称</Label>
                        <Field name="storeRoomId" type="text" label="库房名称" component={renderSelect} disable={disableFlag}>
                            {this.props.storeRoomList && this.props.storeRoomList.map((value, key) => {
                                return <Picker.Item label={`${value.roomName}`} value={value.id} key={key}/>;
                            })}
                        </Field>
                    </View>
                    <View style={{ flex: 0.8, paddingRight: px2dp(5) }}>
                        <Field name="roomLevel" type="text" label="楼层" component={renderDialogInput} disable={disableFlag}/>
                    </View>
                    <View style={{ flex: 1.2, paddingRight: px2dp(5) }}>
                        <Field name="sheetName" type="text" label="货架名称" component={renderDialogInput} disable={disableFlag}/>
                    </View>
                    <View style={{ flex: 0.6, paddingRight: px2dp(5) }}>
                        <Button full disabled={disableFlag} small danger style={{ borderRadius: 6 }} onPress={ handleSubmit((values) => {
                            this.props.fetchSheetAction(values);
                        })}><Text>查 询</Text></Button>
                    </View>
                </View>
            </Form>
        );
    }
}

function mapStateToProps({ findRoom }) {
    return {
        findRoom
    };
}

export default connect(mapStateToProps, { fetchSheet })(
    reduxForm({
        form: FINDSHEETFORM
    })(FindSheetForm)
);
