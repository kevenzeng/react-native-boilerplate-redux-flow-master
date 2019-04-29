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
});
export default styles;
