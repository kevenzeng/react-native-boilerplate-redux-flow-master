import { StyleSheet } from "react-native";
import screenUtil from "../../../../src/boot/screenUtil";

const { px2dp, height } = screenUtil;
const fixHeight = height >= 800 ? height : 300;
const styles: any = StyleSheet.create({
    container: {
        backgroundColor: "#FBFAFA"
    },
    settingsMainLayout: {
        flex: 1,
        flexDirection: "row",
        height: height - px2dp(112)
    },
    leftPane: {
        flex: 1,
        backgroundColor: "rgb(230, 230, 230)",
    },
    rightPane: {
        flex: 3,
    },
    buttonLineContainer: {
        height: px2dp(108),
        width: px2dp(322),
        justifyContent: "center",
        alignSelf: "center",
        borderBottomColor: "#bbb",
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    picPanel: {
        flexDirection: "row",
        backgroundColor: "rgb(250, 159, 136)",
        height: px2dp(200)
    },
    picMsgContainer: {
        height: px2dp(115),
        marginLeft: px2dp(80),
        flex: 1,
        flexDirection: "row",
        alignSelf: "center",
    },
    buttonIconStyle: {
        fontSize: px2dp(50)
    },
    buttonStyle: {
        alignSelf: "center"
    },
    iconImgStyle: {
        fontSize: px2dp(120),
        color: "white",
        alignSelf: "center"
    },
    textContainer: {
        flex: 4,
        alignSelf: "center",
    },
    textStyle: {
        color: "white",
        fontSize: px2dp(30)
    },
    msgTextFontSize: {
        fontSize: px2dp(24),
        marginBottom: px2dp(28)
    },
    rightPanelContext: {
      marginTop: px2dp(40)
    }
});
export default styles;
