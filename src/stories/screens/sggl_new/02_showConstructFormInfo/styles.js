import { StyleSheet } from "react-native";
import screenUtil from "../../../../boot/screenUtil";

const { px2dp, height, width, APPBAR_HEIGHT } = screenUtil;

const styles: any = StyleSheet.create({
    container: {
        backgroundColor: "#FBFAFA",
    },
    mainPosition: {
        display: "flex",
        flexDirection: "row"
    },
    leftPaneStyle: {
        flex: 0.05,
        backgroundColor: "#F2F2F2"
    },
    drawerContent: {
        width: width / 2
    },
    flatList: {
        height: "100%",
        alignItems: "center",
        backgroundColor: "#F2F2F2"
    },
    flatListItem: {
        flexDirection: "row",
        backgroundColor: "white",
        height: px2dp(72),
        width: px2dp(260),
        justifyContent: "center",
        alignItems: "center"
    },
    flatListItemText: {
        color: "black",
        fontSize: px2dp(20)
    },
    flatListItemWidth: {
        width: px2dp(260)
    },
    flatListBtn: {
        width: (260),
        height: px2dp(72)
    },
    sideBar: {
        height: height - px2dp(APPBAR_HEIGHT),
        width: "100%",
    },
    sideBarButtonText: {
        flexDirection: "row",
        color: "gray",
        fontSize: px2dp(15),
        alignSelf: "center",
        marginTop: height / 2.5,
        marginLeft: px2dp(5)
    },
    flatListTopGap: {
      height: px2dp(15),
    },
    flatListItemFooter: {
        backgroundColor: "#F2F2F2",
        height: px2dp(10),
    },
    msgListContainer: {
        flex: 3,
        height: height - px2dp(56)
    },
    contentContainer: {
        marginLeft: px2dp(188),
        marginRight: px2dp(188),
    },
    footBtnContainer:  {
        flex: 0.8,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    footBtn:{
        width: px2dp(210)
    },
    paddingTop20: {
        paddingTop: px2dp(20),
    },
    paddingBottom20: {
        paddingBottom: px2dp(20),
    },
    sectionDivider: {
        width: width,
        borderBottomWidth: px2dp(20),
        borderBottomColor: "#F2F2F2",
    },
    titleDivider: {
        width: "100%",
        // borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: px2dp(2),
        borderBottomColor: "#E5E5E5",
        marginBottom: px2dp(20),
    },
    sgObjContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    sgObjItemContainer: {
        alignItems: "center",
        paddingRight: px2dp(40),
    },
    sgObjBtn: {
        width: px2dp(120),
        height: px2dp(120),
        borderColor: "#666666",
        borderWidth: px2dp(1),
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    coloredMsgListItem: {
        flexDirection: "row",
        // backgroundColor: "#F2F2F2",
        height: px2dp(56),
        alignItems: "center"
    },
    dialogStyle: {
        height: height * 0.5,
        justifyContent: "center", // 主轴对齐
        // flexDirection: "row",
    },
    dialogListTitle: {
        flex: 1.5,
        alignItems: "center",
        marginLeft: px2dp(10)
    },
    dialogValue: {
        color: "#666666",
        flex: 3
    }
});
export default styles;
