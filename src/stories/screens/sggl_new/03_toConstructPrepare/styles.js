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
    sideBarBtn: {
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        width: px2dp(80),
        height: px2dp(100),
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
        margin: px2dp(20),
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
    tableContainer: {
        marginBottom: px2dp(22),
    },
    tableHeader: {
        backgroundColor: "#E4E4E4",
        height: px2dp(52),
        borderColor: "#E4E4E4"
    },
    tableRows: {
        height: px2dp(52)
    },
    rowTextStyle: {
        textAlign: "center",
        fontSize: px2dp(18)
    },
    checkBoxContainer: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    deleteBtnStyle: {
        width: "100%",
        justifyContent: "center"
    },
    deleteIconStyle: {
        color: "red",
    },
    tableWrapperStyle: {
        height: px2dp(52),
        flexDirection: "row",
    },
    addNewBtnContainer: {
        borderColor: "#E5E5E5",
        borderWidth: 1,
        borderTopWidth: 0,
        width: "100%",
        flexDirection: "row"
    },
    addNewItemStyle: {
        width: "100%",
        justifyContent: "center",
        flex: 1
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
        marginLeft: px2dp(504),
        height: px2dp(44),
        width: px2dp(520),
    },
    footerBtnContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    footerBtnStyle: {
        width: px2dp(160),
        height: px2dp(44),
        justifyContent: "center",
        borderColor: "white",
        borderRadius: 5,
    }
});

export default styles;
