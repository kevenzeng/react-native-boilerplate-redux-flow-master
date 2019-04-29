import { StyleSheet } from "react-native";
import screenUtil from "../../../boot/screenUtil";

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
        width: px2dp(260),
        height: px2dp(72)
    },
    sideBar: {
        height: height - px2dp(APPBAR_HEIGHT),
        width: "100%",
    },
    sideBarButtonText: {
        flexDirection: "row",
        color: "gray",
        fontSize: 15,
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
    footBtnContainer:  {
        flex: 0.5,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    footBtn:{
        width: px2dp(210)
    },
});
export default styles;
