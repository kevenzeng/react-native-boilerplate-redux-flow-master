import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { Field, reduxForm, } from "redux-form";
import { Button, Text } from "native-base";
import screenUtil from "../../../boot/screenUtil";
import { renderSearchDialogDateField, renderSimpleInput2 } from "./../renderItems";
import { fetchFollowUpHisList } from "../../../actions/sggl/01_findFollowUpHisListAction";

export interface Props {

}

export interface State {

}

const { px2dp } = screenUtil;

class FollowUpHisListSearchForm extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { handleSubmit } = this.props;
        const { rowContainer, rowItem } = styles;

        return (
            <View style={rowContainer}>
                <View style={rowItem}>
                    <Field name="bgtime" label="开始日期" component={renderSearchDialogDateField}/>
                </View>
                <View style={rowItem}>
                    <Field name="endtime" label="结束日期" component={renderSearchDialogDateField}/>
                </View>
                <View style={rowItem}>
                    <Field name="sggl_cm" label="单号" component={renderSimpleInput2}/>
                </View>
                <View style={rowItem}>
                    <View style={styles.btnWidth}>
                        <Button full danger style={{ borderRadius: 6 }}
                                onPress={handleSubmit((values) => {
                                    this.props.fetchFollowUpHisList(values);
                                })}
                        >
                            <Text style={styles.btnText}>查 找</Text>
                        </Button>
                    </View>
                </View>
            </View>
        );
    }

}

function mapStateToProps({ user }) {
    return {
        initialValues: {
            user: user.authorization.userName,
        }
    };
}

export default connect(mapStateToProps, { fetchFollowUpHisList })(
    reduxForm({
        form: "followUpHisListSearch"
    })(FollowUpHisListSearchForm)
);

const styles: any = StyleSheet.create({
    rowContainer: {
        flexDirection: "row",
        justifyContent: "center",
        height: px2dp(56),
        width: "95%",
        alignSelf: "center",
        padding: px2dp(5)
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
        width: px2dp(200),
        height: px2dp(48),
    },
    btnText: {
        fontSize: px2dp(16)
    }
});
