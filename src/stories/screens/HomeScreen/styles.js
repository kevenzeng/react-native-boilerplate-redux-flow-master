import { StyleSheet } from "react-native";
import screenUtil from "../../../boot/screenUtil";

const { px2dp, height, width } = screenUtil;

let cols = 5;
let boxWidth = px2dp(90);
let vMargin = (width - cols * boxWidth) / (cols + 1);
let hMargin = px2dp(76);
let marTop = height > 730 ? px2dp(80) : 0;

const styles: any = StyleSheet.create({
    container: {
        backgroundColor: "#FBFAFA",
    },
    contentLayout: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 0,
    },
    iconLayout: {
        alignItems: "center",
        width: boxWidth,
        marginLeft: vMargin,
        marginTop: hMargin
    },
    iconStyle: {
        height: px2dp(80),
        width: px2dp(80),
        marginBottom: px2dp(20),
    },
    iconText: {
        fontSize: px2dp(20)
    },
    whiteText: {
        color: "white",
        fontSize: px2dp(22),
        marginTop: px2dp(-10),
        marginLeft: px2dp(-4)
    },
    popUpDialogStyle: {
        backgroundColor: "rgba(0,0,0,0.6)",
        borderRadius: 20
    },
    popUpDialogTitle: {
        backgroundColor: "rgba(0,0,0,0.0)",
        padding: px2dp(24),
    },
    popUpDialogTitleText: {
        color: "white",
        fontSize: px2dp(30)
    },
    popUpDialogItemsLayout: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: px2dp(35)
    },
    itemLayout: {
        marginLeft: vMargin / 1.4,
        alignItems: "center",
    }
});
export default styles;
