import React, { Component } from "react";
import { View } from "react-native";
import { Field, reduxForm, } from "redux-form";
import { Input, Item, Label, Button, Text,Picker } from "native-base";
import screenUtil from "../../../boot/screenUtil";
import { renderDateField } from "./../renderItems";
import { postInt, required } from "../../../services/utils/formValidateUtils";

export interface Props {

}

export interface State {

}

const { px2dp, height } = screenUtil;

export const renderSimpleInput = ({ input, label, type, disable, placeHolder, necessary, meta: { touched, error, warning } }) => (
    <Item fixedLabel style={{ borderBottomWidth: 0, height: px2dp(45) }}>
        <Label style={{ flex: 1, textAlign: "right", marginRight: px2dp(15) }}>{label}</Label>
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

const renderSimpleSBSelect =  ({ input, disable, label, labelStyle, wrapped, children, meta: { touched, error }, ...custom }) => (
  <Item fixedLabel style={{ marginTop: px2dp(10), marginBottom: px2dp(10), borderBottomWidth: 0, height: px2dp(40) }}>
      <Label style={[{ flex: 1, textAlign: "right", marginRight: px2dp(15) }, labelStyle]}>{label}</Label>
			<View style={[{flex: 3, borderWidth:px2dp(1), borderColor: "#E5E5E5"}]}>
				<Picker mode="dropdown" {...input}
						selectedValue={input.value}
						enabled={ !disable }
						onValueChange={(value) => {
								setTimeout(() => {
									if(value === "请选择") return;
									input.onChange(value);
								}, 10);
						}} children={children} {...custom} />
			</View>
      <View style={[!wrapped && { flex: 1 }]}>{}</View>
  </Item>
);

class AddNewItemsForm extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { reset, handleSubmit,itemNames } = this.props;

        return (
            <View style={{ height: height * 0.5 }}>
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <Field name="newitem_sn" label="序列号" component={renderSimpleInput} validate={[required]}/>
                    <Field name="newitem_name" label="备件名称" component={renderSimpleSBSelect} validate={[required]}>
                      <Picker.Item label={"请选择"} value={"请选择"} key={0} />
                      {itemNames.map((value, key) => {
                          return <Picker.Item label={`${value.itemname}`} value={value.itemname} key={key} />;
                      })}
                    </Field>
                    <Field name="newitem_num" label="数      量" component={renderSimpleInput} validate={[required, postInt]}/>
                    <Field name="newitem_retime" label="到货时间" datetimeMode dateFormat="YYYY-MM-DD HH:mm:ss" component={renderDateField} validate={[required]} datePickerMode="datetime" />
                    <View
                        style={{ flexDirection: "row", justifyContent: "space-around", width: "70%", alignSelf: "center", marginTop: px2dp(30) }}>
                        <View style={{ width: px2dp(196), height: px2dp(48) }}>
                            <Button full danger style={{ borderRadius: 6 }}
                                    onPress={handleSubmit((values) => {
                                        this.props.onClose(values);
                                        reset();
                                    })}
                            >
                                <Text>确   定</Text>
                            </Button>
                        </View>
                        <View style={{ width: px2dp(196), height: px2dp(48) }}>
                            <Button full warning style={{ borderRadius: 6 }}
                                    onPress={() => {
                                        this.props.onClose();
                                        reset();
                                    }}
                            >
                                <Text>取   消</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

export default reduxForm({
    form: "sgzb_addItemsForm"
})(AddNewItemsForm);
