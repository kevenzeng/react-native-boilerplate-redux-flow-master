import { StyleSheet } from "react-native";
import screenUtil from "../../../../boot/screenUtil";

const { px2dp, height, APPBAR_HEIGHT } = screenUtil;

const FOOTER_HEIGHT = 80;

const styles: any = StyleSheet.create({
    container: {
        backgroundColor: "#FBFAFA",
    },
    mainPosition: {
        display: "flex",
        flexDirection: "row",
        height: height - px2dp(APPBAR_HEIGHT + FOOTER_HEIGHT),
    },
    btnSideBarContainer: {
        flex: 146,
        backgroundColor: "#f30"
    },
    sideBarBtnContainer: {
        alignItems: "center",
        marginTop: px2dp(46),
    },
    iconStyle: {
        fontSize: px2dp(48),
    },
    iconTextStyle: {
        paddingTop: px2dp(12),
    },
    colorWhite: {
        color: "white",
    },
    contentContainer: {
        flex: 1110,
        backgroundColor: "#ff3300",
    },
    contentStyle: {
        width: "100%",
        height: "100%",
        backgroundColor: "#ffffff",
        borderRadius: 20,
    },
    inContentStyle: {
        marginTop: px2dp(20),
        marginBottom: px2dp(20),
        marginLeft: px2dp(60),
        marginRight: px2dp(60),
        // row 需设定高度
        height: height - px2dp(APPBAR_HEIGHT + FOOTER_HEIGHT + 40),
    },
    contentTitle: {
        flexDirection: "row",
        marginBottom: px2dp(18),
    },
    indexBarStyle: {
        height: px2dp(20),
        width: px2dp(6),
        backgroundColor: "#f30",
        marginRight: px2dp(8),
    },
    rightSideBar: {
        flex: 24,
        backgroundColor: "#ff3300"
    },
    footerContainer: {
        flex: 1,
        backgroundColor: "#ff3300",
        justifyContent: "center",
    },
    footerContent: {
        marginLeft: px2dp(146),
        height: px2dp(44),
        width: px2dp(1110),
    },
    footerBtnContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    footerBtnStyle: {
        width: px2dp(160),
        height: px2dp(44),
        justifyContent: "center",
        borderColor: "white",
        borderRadius: 5,
        marginLeft: px2dp(50),
    },
    sectionGap: {
        height: px2dp(44),
    },
    iconLineContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        minHeight: px2dp(92)
    },
    // 添加人员按钮样式
    peoIconMainStyle: {
        width: px2dp(72),
        height: px2dp(72),
        borderWidth: px2dp(1),
        justifyContent: "center",
        alignItems: "center",
        marginRight: px2dp(28),
        marginTop: px2dp(10),
        marginBottom: px2dp(10),
    },
    peoPic: {
        borderColor: "#666",
        backgroundColor: "#999",
    },
    photoMain: {
        width: px2dp(150),
        height: px2dp(150),
    },
});

export default styles;
