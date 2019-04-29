import { StyleSheet } from "react-native";
import screenUtil from "../../../../boot/screenUtil";

const { px2dp, height, APPBAR_HEIGHT } = screenUtil;

const styles: any = StyleSheet.create({
    container: {
        backgroundColor: "#FBFAFA",
    },
    theHeight: {
        height: height + APPBAR_HEIGHT,
    },
    row: {
        flex: 1,
        alignItems: "center",
    },
    segmentStyle: {
        backgroundColor: "transparent",
        borderColor: "transparent",
        alignSelf: "flex-start"
    },
    leftSeBtn: {
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    rightSeBtn: {
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
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
    // 因为 ScrollView 需要指定高度
    scrollViewHisStyle: {
        height: height - px2dp(160),
    },
    scrollViewStyle: {
        height: height - px2dp(108),
    },
    // 底部还有 TableWrapper 生成的一条边，这是仿制边
    tableBottomLine: {
        borderBottomColor: "#E4E4E4",
        borderBottomWidth: StyleSheet.hairlineWidth,
    }
});
export default styles;
