import { StyleSheet } from "react-native";
import screenUtil from "../boot/screenUtil";

const { px2dp, width, height } = screenUtil;

const styles: any = StyleSheet.create({
    // c
    arrowBackFontSize: {
        fontSize: px2dp(30)
    },
    segmentStyle: {
        backgroundColor: "transparent",
        borderColor: "transparent",
        alignSelf: "center",
        width: "100%",
        marginRight: 0,
    },
    segmentFirstStyle: {
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10
    },
    segmentLastStyle: {
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10
    },
    storeRoomItemStyle: {
        flex: 1,
        borderColor: "#E5E5E5",
        // borderWidth: px2dp(1), 无用，还需明确定义 left bottom
        marginLeft: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderLeftWidth: px2dp(1),
        borderBottomWidth: px2dp(1),
    },
    storeRoomItemTextStyle: {
        fontSize: px2dp(17),
        paddingLeft: 0,
        paddingRight: 0,
    },
    renderPickerStyle:{
        flex: 1,
        marginTop: px2dp(10),
        marginBottom: px2dp(10)
    },
    nextOpLabelStyle: {
        flex: 1,
        textAlign: "right",
        marginRight: px2dp(15)
    },
    contentGapStyle: {
        backgroundColor: "#F2F2F2",
        flex: 1,
        height: px2dp(15)
    },
    // common
    padding10: {
        padding: px2dp(10)
    },
    padding8: {
        padding: px2dp(8)
    },
    height20: {
        height: px2dp(20)
    },
    disableBgColor: {
        backgroundColor: "#F2F2F2"
    },
    errorBorderStyle: {
        borderColor: "red",
        borderWidth: px2dp(1)
    },
    // 备件列表
    itemsRowStyle: {
        height: px2dp(45)
    },
    itemsRowTextStyle: {
        textAlign: "center",
        fontSize: px2dp(17)
    },
    // popup dialog
    popUpTitleTextStyle: {
        color: "black",
        fontSize: px2dp(22)
    },
    popUpContainerStyle: {
        marginTop: px2dp(600),
        width: width
    },
    popUpContainerForStoreTrans: {
        marginTop: px2dp(150),
        width: width,
    },
    popUpRowStyle: {
        height: px2dp(32)
    },
    popUpTableBorderStyle: {
        borderColor: "#E5E5E5" // useless when using in react-native-table-component
    },
    popUpFindDeviceContentStyle: {
        height: height * 0.45,
        width: "100%"
    },
    popUpFindRoomContentStyle: {
        height: height * 0.3,
        width: "100%"
    },
    progressDialogStyle: {
        // fix width and height
        width: 400,
        height: 140,
        alignSelf: "center"
    },
    theHeight: {
        height: height,
        // height: "100%",
    },
});
export default styles;
