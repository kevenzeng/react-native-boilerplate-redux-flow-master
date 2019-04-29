import React, { Component } from "react";
import { StyleSheet, View,  ScrollView } from "react-native";
import { connect } from "react-redux";
import { Field, reduxForm, } from "redux-form";
import { Button, Text, Picker } from "native-base";
import screenUtil from "../../../boot/screenUtil";
import { renderSearchDialogDateField, renderSimpleInput2, renderSelect2 } from "./../renderItems";
import { fetchStoreTrans } from "../../../actions/kfgl_storetrans/findStoreTransAction";
import { RECIPIENT_STATUS } from "../../../boot/config";

export interface Props {

}

export interface State {

}

const { px2dp } = screenUtil;

class StoreTransSearchForm extends Component {

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
                                <Field name="applyDateSt" label="申请日期" component={renderSearchDialogDateField}/>
                            </View>
                            <View style={rowItem}>
                                <Field name="applyDateEn" label="至" component={renderSearchDialogDateField}/>
                            </View>
                        </View>
                        <View style={rowContainer}>
                            <View style={rowItem}>
                                <Field name="transDateSt" label="移库日期" component={renderSearchDialogDateField}/>
                            </View>
                            <View style={rowItem}>
                                <Field name="transDateEn" label="至" component={renderSearchDialogDateField}/>
                            </View>
                        </View>
                        <Field name="transNo" label="移库单号" component={renderSimpleInput2}/>
                        <Field name="status" label="单据状态" component={renderSelect2}>
                            {RECIPIENT_STATUS.map((value, key) => {
                                return <Picker.Item label={`${value.status}`} value={value.value} key={key} />;
                            })}
                        </Field>
                        <Field name="applyer" label="申请人" component={renderSimpleInput2}/>
                        <Field name="applyAduitor" label="申请审批人" component={renderSimpleInput2}/>
                        <Field name="operator" label="当前处理人" component={renderSimpleInput2}/>
                    </ScrollView>
                </View>
                <View style={{ flex: 1.5, justifyContent: "center" }}>
                    <View
                        style={styles.btnContainer}>
                        <View style={styles.btnWidth}>
                            <Button full success style={{ borderRadius: 6 }}
                                    onPress={handleSubmit((values) => {
                                        const { userName, } = this.props.user.authorization;
                                        values.user = userName;
                                        this.props.fetchStoreTrans(values);
                                        this.props.popUpIns.dismiss();
                                    })}
                            >
                                <Text>查   询</Text>
                            </Button>
                        </View>
                        <View style={styles.btnWidth}>
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
        user: user,
        initialValues: {
            operator: user.authorization.userName,
        }
    };
}

export default connect(mapStateToProps, { fetchStoreTrans })(
    reduxForm({
        form: "storeTransSearch"
    })(StoreTransSearchForm)
);

const styles: any = StyleSheet.create({
    rowContainer: {
        flexDirection: "row",
        justifyContent: "center",
        width: "80%",
        alignSelf: "center",
        marginBottom: px2dp(5)
    },
    rowItem: {
        flex: 1,
    },
    btnContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "70%",
        height: "18%",
        alignSelf: "center",
        alignItems: "center"
    },
    btnWidth: {
        width: px2dp(210)
    }
});
