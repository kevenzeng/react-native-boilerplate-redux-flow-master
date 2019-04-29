import { StyleSheet } from "react-native";
import screenUtil from "../../../boot/screenUtil";

const { px2dp, width, height } = screenUtil;


const styles: any = StyleSheet.create({
    settingsStyle: {
        position: "absolute",
        top: height * 0.02,
        right: width * 0.02,
    },
    settingIcon: {
        fontSize: px2dp(48),
        color: "#666666",
    },
    headerStyle: {
        height: px2dp(128),
        backgroundColor: "white"
    },
    mainPic: {
        width: px2dp(632),
        height: px2dp(160)
    },
    sidePic: {
        width: px2dp(380),
        height: px2dp(436)
    },
    loginForm: {
        alignItems: "center",
        marginTop: px2dp(94)
    },
    loginBtn: {
        width: px2dp(500),
        height: px2dp(60),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgb(255, 51, 0)"
    },
    loginBtnSize: {
        fontSize: px2dp(24),
        height: px2dp(28),
        textAlignVertical: "bottom"
    },
    footer: {
        backgroundColor: "#F8F8F8",
        height: px2dp(60)
    },
    footerContainer: {
        alignItems: "center",
        flexDirection: "row"
    },
    footerText: {
        color: "#000",
        opacity: 0.5
    },
    footerImage: {
        width: px2dp(95),
        height: px2dp(29)
    },
    // dialog styles
    dialogBtnContainer: {
        marginTop: px2dp(32),
        marginLeft: px2dp(158),
        flexDirection: "row",
    },
    dialogBtn: {
        height: px2dp(52),
        width: px2dp(160),
        borderRadius: 10,
        alignSelf: "center",
        justifyContent: "center",
    },
    dialogCancelBtn: {
        backgroundColor: "#ffffff",
        borderColor: "#cccccc",
        borderWidth: 1,
        marginRight: px2dp(24)
    },
    dialogBtnText: {
        fontSize: px2dp(24),
        lineHeight: px2dp(26),
    },
    dialogStyle: {
        width: px2dp(660),
        height: px2dp(378)
    },
    textAndInputContainer: {
        marginLeft: px2dp(76),
        marginRight: px2dp(76),
        marginTop: px2dp(87),
    },
    errorIcon: {
        marginLeft: px2dp(20),
        height: px2dp(32),
        width: px2dp(32),
        fontSize: px2dp(32)
    },
    textContainer: {
        marginBottom: px2dp(19),
    },
    dialogInputStyle: {
      height: px2dp(52),
      width: px2dp(500),
    },
    errorContainer: {
      marginLeft: px2dp(16),
      marginTop: px2dp(23),
    },
    errorTextStyle: {
      fontSize: px2dp(24),
      color: "#fd6161",
    },
    dialogText: {
        fontSize: px2dp(24),
        color: "#333333",
    }
});

export default styles;
