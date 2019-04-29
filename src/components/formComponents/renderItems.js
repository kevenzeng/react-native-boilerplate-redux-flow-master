import { Icon, Input, Item, Label, Picker, Text } from "native-base";
import { View } from "react-native";
import * as React from "react";
import DatePicker from "react-native-datepicker";
import screenUtil from "../../boot/screenUtil";
const { px2dp } = screenUtil;

export const renderSimpleInput = ({ input, label, type, disable, placeHolder, necessary, meta: { touched, error, warning }}) => (
    <Item fixedLabel style={{ borderBottomWidth: 0 }}>
        <Label style={{ flex: 1, textAlign: "right", marginRight: px2dp(15) }}>{ necessary ? <Label style={{color: "red"}}>*  </Label> : "" }{ label }</Label>
        <Input disabled={disable} {...input} type={type} placeholder={placeHolder} style={[ disable ? "" : { borderWidth: px2dp(1) }, { flex: 3, borderColor: "#E5E5E5", marginTop: px2dp(10), marginBottom: px2dp(10) }]} />
        <View style={{ flex: 1 }}>{ touched && ( (error && <Text style={{ color: "red", marginLeft: px2dp(8) }}>{error}</Text>) || (warning && <Text>{warning}</Text>) ) }</View>
    </Item>
);

// renderSimpleInput2 used for to do list search
export const renderSimpleInput2 = ({ input, label, type, disable, placeHolder, necessary, wrapped, meta: { touched, error, warning } }) => (
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
               }, wrapped && { flex: 2.5 } ]}/>
        <View style={[!wrapped && { flex: 1 }]}>{touched && ((error &&
            <Text style={{ color: "red", marginLeft: px2dp(8) }}>{error}</Text>) || (warning &&
            <Text>{warning}</Text>))}</View>
    </Item>
);

// TODO: 单据状态
// renderSelect2 used for to do list search
export const renderSelect2 = ({ input, disable, label, labelStyle, wrapped, children, meta: { touched, error }, ...custom }) => (
    <Item fixedLabel style={{ borderBottomWidth: 0, height: px2dp(45) }}>
        <Label style={[{ flex: 1, textAlign: "right", marginRight: px2dp(15) }, labelStyle]}>{label}</Label>
    <Picker style={[{ flex: 3, marginTop: px2dp(10), marginBottom: px2dp(10), height: px2dp(40) }]}
            mode="dropdown" {...input}
            selectedValue={input.value}
            enabled={ !disable }
            onValueChange={(value) => {
                setTimeout(() => {
                    input.onChange(value);
                }, 10);
            }} children={children} {...custom} />
        <View style={[!wrapped && { flex: 1 }]}>{}</View>
    </Item>
);

export const renderDialogInput = ({ input, label, disable, meta: { touched, error, warning } }) => (
    <Item fixedLabel style={{ borderBottomWidth: 0, marginLeft: px2dp(5) }}>
        <Label style={{ flex: 1, textAlign: "center" }}>{label}</Label>
        <Input {...input} disabled={disable} style={{ flex: 2.5, borderColor: "#E5E5E5", borderWidth: px2dp(1), height: px2dp(35) }}/>
        {touched && ((error && <Text style={{ color: "red" }}>{error}</Text>) || (warning && <Text>{warning}</Text>))}
    </Item>
);

export const renderSelect = ({ input, disable, label, children, meta: { touched, error }, ...custom }) => (
    <Picker style={[touched && error && { borderColor: "red", borderWidth: px2dp(1) }, { flex: 1, marginTop: px2dp(10), marginBottom: px2dp(10) }]}
            mode="dropdown" {...input}
            selectedValue={input.value}
            enabled={ !disable }
            onValueChange={(value) => {
                setTimeout(() => {
                    input.onChange(value);
                }, 10);
            }} children={children} {...custom} />
);

export const renderDateField = ({ input: { onChange, value, ...restInput }, disable, necessary, dateFormat = "YYYY-MM-DD", datetimeMode, wrapped, label, datePickerMode = "date", meta: { touched, error }, ...custom }) => {
    return (
        <Item fixedLabel style={{ borderBottomWidth: 0, height: px2dp(50), alignItems: "center" }}>
            <Label style={[{ flex: 1, textAlign: "right", marginRight: px2dp(15), alignSelf: "center" }, wrapped && { flex: 0.6 }]}>{ necessary ? <Label style={{color: "red"}}>*  </Label> : "" }{label}</Label>
            <DatePicker
                style={[{ flex: 1, marginLeft: px2dp(6) }, datetimeMode && { flex: 2 }]}
                disabled={ disable }
                customStyles={{
                    dateInput: {
                        borderColor: "#E5E5E5",
                        alignItems: "flex-start",
                        height: px2dp(40)
                    },
                    dateText: {
                        marginLeft: px2dp(5)
                    },
                    placeholderText: {
                        marginLeft: px2dp(5),
                        fontSize: px2dp(16),
                    }
                }}
                date={value}
                placeholder="点击选择日期"
                locale={"zh-cn"}
                format={dateFormat}
                confirmBtnText="确定"
                cancelBtnText="取消"
                onDateChange={onChange}
                showIcon={false}
                mode={datePickerMode}
            />
            <Icon name="calendar" style={{ marginLeft: px2dp(5), fontSize: px2dp(32), color: "#999999" }} />
            <View style={[!wrapped && { flex: 3}, datetimeMode && { flex: 2 }]}>{ touched && (error && <Text style={{ color: "red" }}>{error}</Text>) }</View>
        </Item>
    );
};

export const renderSearchDialogDateField = ({ input: { onChange, value, ...restInput }, label }) => {
    return (
        <Item fixedLabel style={{ borderBottomWidth: 0, height: px2dp(50) }}>
            <Label style={[{ flex: 0.6, textAlign: "right", marginRight: px2dp(15) }]}>{label}</Label>
            <DatePicker
                style={{ flex: 1, marginLeft: px2dp(6) }}
                customStyles={{
                    dateInput: {
                        borderColor: "#E5E5E5",
                        alignItems: "flex-start",
                        height: px2dp(40)
                    },
                    dateText: {
                        marginLeft: px2dp(5)
                    },
                    placeholderText: {
                        marginLeft: px2dp(5),
                        fontSize: px2dp(16),
                    }
                }}
                date={value}
                placeholder="点击选择日期"
                locale={"zh-cn"}
                format="YYYY-MM-DD"
                confirmBtnText="确定"
                cancelBtnText="取消"
                onDateChange={onChange}
                showIcon={false}
            />
            <Icon name="calendar" style={{ marginLeft: px2dp(5), fontSize: px2dp(32), color: "#999999" }} />
            <View style={[{ flex: 0.4 }]}>{}</View>
        </Item>
    );
};

export const renderTextArea = ({ input, label, disable, placeHolder, meta: { touched, error, warning }}) => (
    <Item fixedLabel style={{ borderBottomWidth: 0 }}>
        <Label style={{ flex: 1, textAlign: "right", marginRight: px2dp(15) }}><Label style={{color: "red"}}>*  </Label>{label}</Label>
        <View style={{ flex: 3, marginBottom: px2dp(6), marginRight: px2dp(15) }}>
            <Input bordered disabled={disable} multiline {...input} placeholder={placeHolder} style={[ disable ? "" : { borderWidth: px2dp(1) }, { height: px2dp(75), borderColor: "#E5E5E5" }]} />
        </View>
        <View style={{ flex: 1 }}>{ touched && ( (error && <Text style={{ color: "red", marginLeft: px2dp(8) }}>{error}</Text>) || (warning && <Text>{warning}</Text>) ) }</View>
    </Item>
);

// TODO: 好件 input or Picker
export const renderItemDetails = ({ input, label, type, disable, placeHolder, fontSize, itemStyle, necessary, meta: { touched, error, warning }}) => (
    <Item regular style={[{ flex: 1, borderColor: "#E5E5E5", borderWidth: px2dp(1), borderLeftWidth: px2dp(1), borderBottomWidth: px2dp(1), marginLeft: 0, borderRightWidth: 0, borderTopWidth: 0 }, itemStyle && itemStyle]}>
        <Input disabled={disable} style={[touched && error && { borderColor: "red", borderWidth: px2dp(1) }, fontSize && { fontSize: fontSize }, disable && { backgroundColor: "#F2F2F2", color: "#666666" } , { textAlign: "center", paddingLeft: 0, paddingRight: 0 }]}{...input} />
    </Item>
);
