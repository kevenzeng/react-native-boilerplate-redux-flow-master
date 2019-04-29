import { StyleSheet } from "react-native";
import screenUtil from "../boot/screenUtil";

const { px2dp, height } = screenUtil;

const commonStyles: any = StyleSheet.create({
    dialogStyle: {
        width: px2dp(660),
        height: px2dp(378)
    },
    textAndInputContainer: {
        marginLeft: px2dp(76),
        marginRight: px2dp(76),
        marginTop: px2dp(87),
    },
    textContainer: {
        marginBottom: px2dp(19),
    },
    dialogText: {
        fontSize: px2dp(24),
        color: "#333333",
    },
    dialogInputStyle: {
        height: px2dp(52),
        width: px2dp(500),
    },
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
});
export default commonStyles;
