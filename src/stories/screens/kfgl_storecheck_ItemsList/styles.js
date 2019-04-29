import { StyleSheet } from "react-native";
import screenUtil from "../../../boot/screenUtil";

const { px2dp } = screenUtil;

const styles: any = StyleSheet.create({
    container: {
        backgroundColor: "#FBFAFA",
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
        backgroundColor: "#FFCC99",
        height: px2dp(52)
    },
    tableRows: {
        height: px2dp(52)
    },
    rowTextStyle: {
        textAlign: "center",
        fontSize: px2dp(18)
    },
    tableWrapperStyle: {
        height: px2dp(52),
        flexDirection: "row",
    },
    dialogText: {
        fontSize: px2dp(18)
    },
    dialogContent: {
        height: px2dp(120),
        marginTop: px2dp(15)
    }
});
export default styles;
