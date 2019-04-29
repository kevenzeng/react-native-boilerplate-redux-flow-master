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
        width: px2dp(48),
        height: px2dp(48),
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
        marginLeft: px2dp(146),
        height: px2dp(44),
        width: px2dp(900),
        alignSelf: "center",
    },
    footerBtnContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    footerBtnStyle: {
        width: px2dp(160),
        height: px2dp(44),
        justifyContent: "center", // center font
        borderColor: "white",
        borderRadius: 5,
    },
    lineTitle: {
        flex: 1,
        justifyContent: "center"
    },
    lineContent: {
        flex: 3,
        justifyContent: "center"
    },
    iconLineContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        minHeight: px2dp(92)
    },
    inputLineContainer: {
        minHeight: px2dp(92),
        justifyContent: "center",
        alignItems: "center",
    },
    dateTimeLineContainer: {
        alignItems: "flex-start",
    },
    inputFieldStyle: {
        width: "80%",
    },
    dateInput: {
        borderColor: "#E5E5E5",
        alignItems: "flex-start",
    },
    dateText: {
        marginLeft: px2dp(5)
    },
    placeholderText: {
        marginLeft: px2dp(5),
        fontSize: px2dp(16),
    },
    // Radio btn
    marginRight30: {
        marginRight: px2dp(30),
    },
    marginLeft5: {
        marginLeft: px2dp(5),
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
    addPeopleBtn: {
        borderColor: "#f30",
    },
    peoPic: {
        borderColor: "#666",
        backgroundColor: "#999",
    },
    picHoverName: {
        marginTop: px2dp(-30),
        backgroundColor: "black",
        width: px2dp(72),
        height: px2dp(20),
        opacity: 0.6,
        justifyContent: "center",
        alignItems: "center",
    },
    deletePicBtn: {
        width: px2dp(24),
        height: px2dp(24),
        marginLeft: px2dp(60),
        marginTop: px2dp(-84),
        justifyContent: "center",
        alignItems: "center",
    },
    deletePhotoBtn: {
        marginLeft: px2dp(138),
        marginTop: px2dp(-172),
    },
    deleteIcon: {
        fontSize: px2dp(22),
    },
    // 拍照按钮样式
    photoMain: {
        width: px2dp(150),
        height: px2dp(150),
    },
    cameraIcon: {
        fontSize: px2dp(52)
    },
    sectionGap: {
        height: px2dp(44),
    },
    // 弹窗样式
    addOperatorDialogContent: {
        height: height * 0.55,
    },
    addItem: {
        height: px2dp(48),
    },
    addItemBtn: {
        height: "100%",
        width: "100%",
        justifyContent: "center"
    },
    addItemText: {
        marginLeft: px2dp(15),
    },
    // 弹窗样式 - 输入框
    inputDialogContainer: {
        height: height * 0.3125,
    },
    inputDialogContent: {
        margin: px2dp(20),
        height: height * 0.3125 - px2dp(40),
        alignItems: "center",
        justifyContent: "center",
    },
    inputDialogText: {
        marginBottom: px2dp(15),
    },
    inputDialogBtnContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: px2dp(15),
    },
    inputDialogBtn: {
        width: px2dp(120),
        height: px2dp(48),
        justifyContent: "center",
    },
});

export default styles;
