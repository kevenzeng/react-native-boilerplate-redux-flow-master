import React, { Component } from "react";
import { View, ScrollView } from "react-native";
import { connect } from "react-redux";
import { Field, reduxForm, } from "redux-form";
import { Button, Text, Picker } from "native-base";
import screenUtil from "../../../boot/screenUtil";
import { renderDateField, renderSimpleInput2, renderSelect2 } from "./../renderItems";
import { fetchStoreOut } from "../../../actions/storeOut/findStoreOutAction";
import { RECIPIENT_STATUS, STORE_OUT_RECIPIENT_TYPE } from "../../../boot/config";

export interface Props {

}

export interface State {

}

const { px2dp } = screenUtil;



class StoreOutSearchForm extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { reset, handleSubmit } = this.props;

        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 8 }}>
                    <ScrollView>
                        <Field name="applyDateSt" label="申请日期开始" component={renderDateField}/>
                        <Field name="applyDateEn" label="申请日期结束" component={renderDateField}/>
                        <Field name="outNo" label="出库单号" component={renderSimpleInput2}/>
                        <Field name="brandName" label="出库厂商" component={renderSimpleInput2}/>
                        <Field name="outType" label="出库单类型" component={renderSelect2}>
                            {RECIPIENT_STATUS.map((value, key) => {
                                return <Picker.Item label={`${value.status}`} value={value.value} key={key} />;
                            })}
                        </Field>
                        <Field name="status" label="单据状态" component={renderSelect2}>
                            {STORE_OUT_RECIPIENT_TYPE.map((value, key) => {
                                return <Picker.Item label={`${value.status}`} value={value.value} key={key} />;
                            })}
                        </Field>
                        <Field name="applyer" label="申请人" component={renderSimpleInput2}/>
                        <Field name="applyAduitor" label="申请审批人" component={renderSimpleInput2}/>
                        <Field name="operator" label="出库单当前处理人" component={renderSimpleInput2}/>
                        <Field name="checker" label="复核人" component={renderSimpleInput2}/>
                        <Field name="checkAduitor" label="复核人审批人" component={renderSimpleInput2}/>
                    </ScrollView>
                </View>
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <View
                        style={{ flexDirection: "row", justifyContent: "space-around", width: "70%", alignSelf: "center" }}>
                        <View style={{ width: px2dp(210) }}>
                            <Button full success style={{ borderRadius: 6 }}
                                    onPress={handleSubmit((values) => {
                                        this.props.fetchStoreOut(values);
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

function mapStateToProps({ user }) {
    return {
        initialValues: {
            operator: user.authorization.userName,
        }
    };
}

export default connect(mapStateToProps, { fetchStoreOut })(
    reduxForm({
        form: "storeOutToDoSearch"
    })(StoreOutSearchForm)
);
