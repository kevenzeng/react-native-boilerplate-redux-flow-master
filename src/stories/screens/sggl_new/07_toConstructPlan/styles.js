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
    colorMain: {
        color: "#f30"
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
    listContainer: {
        width: "100%",
        flexDirection: "row",
        minHeight: px2dp(60),
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#E4E4E4",
    },
    leftList: {
        flex: 414,
    },
    leftActive: {
        backgroundColor: "#F93",
    },
    rightActive: {
        backgroundColor: "#FC6",
    },
    rightList:{
        flex: 571,
    },
    listItem: {
        height: px2dp(60),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    listIcon: {
        flex: 1,
        fontSize: px2dp(24),
        color: "#666",
        textAlign: "right",
        marginRight: px2dp(15),
    },
    listLabel: {
        flex: 20,
        marginLeft: px2dp(10),
    },
    deleteBtnStyle: {
        width: "100%",
        justifyContent: "center"
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
        justifyContent: "flex-end",
    },
    footerBtnStyle: {
        width: px2dp(160),
        height: px2dp(44),
        justifyContent: "center",
        borderColor: "white",
        borderRadius: 5,
        marginLeft: px2dp(50),
    },
    widthBtn: {
        width: px2dp(332),
        marginLeft: px2dp(0),
        marginRight: px2dp(50),
    },
    sectionGap: {
        height: px2dp(44),
    },
});

export default styles;
