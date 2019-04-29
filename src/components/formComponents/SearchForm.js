import React, { Component } from "react";
import { View, ScrollView } from "react-native";
import { connect } from "react-redux";
import { Field, reduxForm, } from "redux-form";
import { Input, Item, Label, Button, Text } from "native-base";
import screenUtil from "../../boot/screenUtil";
import { renderDateField } from "./renderItems";
import { fetchStoreIn } from "../../actions/storeIn/findStoreInAction";

export interface Props {

}

export interface State {

}

const { px2dp } = screenUtil;

export const renderSimpleInput = ({ input, label, type, disable, placeHolder, necessary, meta: { touched, error, warning } }) => (
    <Item fixedLabel style={{ borderBottomWidth: 0, height: px2dp(45) }}>
        <Label style={{ flex: 1, textAlign: "right", marginRight: px2dp(15) }}>{necessary ?
            <Label style={{ color: "red" }}>* </Label> : ""}{label}</Label>
        <Input disabled={!!disable} {...input} type={type} placeholder={placeHolder}
               style={[ disable ? "" : { borderWidth: 1 }, {
                   flex: 3,
                   borderColor: "#E5E5E5",
                   marginTop: px2dp(10),
                   marginBottom: px2dp(10),
                   height: px2dp(40)
               } ]}/>
        <View style={{ flex: 1 }}>{touched && ((error &&
            <Text style={{ color: "red", marginLeft: px2dp(8) }}>{error}</Text>) || (warning &&
            <Text>{warning}</Text>))}</View>
    </Item>
);

class SearchForm extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { reset, handleSubmit } = this.props;

        return (
            <View style={{ flex: 1 }}>
                <View  style={{ flex: 8 }}>
                    <ScrollView>
                        <Field name="inNo" label="入库单号" component={renderSimpleInput}/>
                        <Field name="applyDateSt" label="申请日期开始" component={renderDateField}/>
                        <Field name="applyDateEn" label="申请日期结束" component={renderDateField}/>
                        <Field name="applyer" label="申请人名称" component={renderSimpleInput}/>
                        <Field name="inType" label="入库单类型" component={renderSimpleInput}/>
                        <Field name="brandName" label="厂商名称" component={renderSimpleInput}/>
                        <Field name="operator" label="入库单当前处理人" component={renderSimpleInput}/>
                        <Field name="applyAduitor" label="申请审批人" component={renderSimpleInput}/>
                        <Field name="checker" label="复核人" component={renderSimpleInput}/>
                        <Field name="status" label="入库单状态" component={renderSimpleInput}/>
                    </ScrollView>
                </View>
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <View
                        style={{ flexDirection: "row", justifyContent: "space-around", width: "70%", alignSelf: "center" }}>
                        <View style={{ width: px2dp(210) }}>
                            <Button full success style={{ borderRadius: 6 }}
                                    onPress={handleSubmit((values) => {
                                        this.props.fetchStoreIn(values);
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

export default connect(mapStateToProps, { fetchStoreIn })(
    reduxForm({
        form: "itemSearch"
    })(SearchForm)
);
