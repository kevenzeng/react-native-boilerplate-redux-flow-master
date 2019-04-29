import { StyleSheet } from "react-native";
import screenUtil from "../../../boot/screenUtil";

const { px2dp, height } = screenUtil;

const styles: any = StyleSheet.create({
    container: {
        backgroundColor: "#FBFAFA",
        height: height - px2dp(56),
    },
    mainPosition: {
        display: "flex",
        flexDirection: "row",
    },
    leftPaneStyle: {
        flex: 1,
        backgroundColor: "#F2F2F2",
        height: height - px2dp(56)
    },
    leftPaneTitle: {
        marginLeft: px2dp(20),
        marginTop: px2dp(20)
    },
    flatList: {
        alignItems: "center",
        marginTop: px2dp(15),
        height: height - px2dp(120)
    },
    flatListItem: {
        flexDirection: "row",
        backgroundColor: "white",
        height: px2dp(72),
        width: px2dp(330)
    },
    flatListItemFontSize: {
        fontSize: px2dp(20),
    },
    oBackgroundColor: {
        backgroundColor: "#FF3300"
    },
    flatListItemTitle: {
        flex: 1,
        alignItems: "flex-end",
        justifyContent: "center"
    },
    flatListItemValue: {
        flex: 2,
        justifyContent: "center",
        alignItems: "center"
    },
    whiteFontColor: {
        color: "white",
    },
    flatListItemFooter: {
        backgroundColor: "#F2F2F2",
        height: px2dp(5),
    },
    msgListItem: {
        flexDirection: "row",
        height: px2dp(56),
        alignItems: "center"
    },
    msgListContainer: {
        flex: 2.5,
        height: height - px2dp(56),
    },
    msgListPane: {
        paddingLeft: px2dp(30),
        paddingTop: px2dp(30),
        paddingRight: px2dp(30)
    },
    msgListTitleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingBottom: px2dp(20),
        alignItems: "center"
    },
    msgListButton: {
        marginRight: px2dp(5),
        borderRadius: 8,
        height: px2dp(40)
    },
    coloredMsgListItem: {
        flexDirection: "row",
        backgroundColor: "#F2F2F2",
        height: px2dp(56),
        alignItems: "center"
    },
    msgListItemTitle: {
        flex: 1,
        marginLeft: px2dp(10)
    },
    msgListItemValue: {
        flex: 4
    },
    segmentStyle: {
        backgroundColor: "transparent",
        borderColor: "transparent",
        alignSelf: "flex-end"
    },
    iconPosition: {
        flex: 1,
        marginRight: px2dp(15),
    },
    icon: {
        fontSize: px2dp(30)
    },
    leftRoundBorder: {
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    rightRoundBorder: {
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    spinnerStyle: {
        position: "absolute",
        left: 0,
        right: 0,
        top: px2dp(-100),
        bottom: 0,
        backgroundColor: "black",
        opacity: 0.5,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyListPic: {
        height: px2dp(92),
        width: px2dp(92),
        alignSelf: "center"
    },
    emptyListText: {
        color: "#999999",
        marginTop: px2dp(10),
        alignSelf: "center"
    },
    emptyListInfo: {
        flex: 1,
        width: "100%",
        height: height - px2dp(56),
        justifyContent: "center",
        alignItems: "center",
    },
    emptyBtnContainerStyle: {
        marginTop: px2dp(20),
        flexDirection: "row",
    },
    emptyBtnStyle: {
        borderColor: "#999999"
    },
    emptyBtnText: {
        color: "#666666"
    },
    popUpDialogContainer: {
        marginTop: px2dp(-50),
    },
    popUpDialogTitle: {
        padding: px2dp(24),
    },
    popUpDialogTitleText: {
        fontSize: px2dp(24)
    },
    progressDialogStyle: {
        // fix width and height
        width: 400,
        height: 140,
        alignSelf: "center"
    }
});
export default styles;
