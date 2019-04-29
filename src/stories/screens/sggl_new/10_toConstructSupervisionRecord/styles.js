import { StyleSheet } from "react-native";
import screenUtil from "../../../../boot/screenUtil";

const { px2dp, height, APPBAR_HEIGHT } = screenUtil;
const contentHeight = height - px2dp(APPBAR_HEIGHT);

const styles: any = StyleSheet.create({
    container: {
        backgroundColor: "#FBFAFA",
    },
    contentStyle: {
        height: contentHeight,
    },
    row: {
        flex: 1,
        alignItems: "center",
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
        fontSize: px2dp(16)
    },
    tableWrapperStyle: {
        height: px2dp(52),
        flexDirection: "row",
    },
    tableHeight: {
        height: contentHeight - px2dp(78),
    },
    scrollViewStyle: {
        height: contentHeight - px2dp(78 + 56),
    },
    // 底部还有 TableWrapper 生成的一条边，这是仿制边
    tableBottomLine: {
        borderBottomColor: "#E4E4E4",
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    footBtnContainer:  {
        height: px2dp(78),
        backgroundColor: "#E4E4E4",
        alignItems: "center",
        justifyContent: "center",
    },
    footBtnContent: {
        width: "50%",
        flexDirection: "row",
        justifyContent: "space-around",
    },
    footBtn:{
        width: px2dp(210),
        borderWidth: px2dp(2),
        borderColor: "#f30",
        backgroundColor: "white",
        borderRadius: 6,
    },
    // 侧边图集
    iconLineContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        minHeight: px2dp(52)
    },
    // 图片基础样式
    peoIconMainStyle: {
        width: px2dp(47),
        height: px2dp(47),
        borderWidth: px2dp(1),
        justifyContent: "center",
        alignItems: "center",
        marginRight: px2dp(6),
        marginTop: px2dp(0),
        marginBottom: px2dp(0),
    },
    peoPic: {
        borderColor: "#E5E5E5",
        backgroundColor: "#999",
    },
});
export default styles;
