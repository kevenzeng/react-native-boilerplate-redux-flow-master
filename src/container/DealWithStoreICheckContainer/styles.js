import { StyleSheet } from "react-native";
import screenUtil from "../../boot/screenUtil";

const { px2dp, height } = screenUtil;

const styles: any = StyleSheet.create({
    // renders Style
    sheetDataGrid: {
        height: height * 0.3,
    },
    sheetDialogSelectBtn: {
        width: px2dp(120),
        height: px2dp(36),
        alignSelf: "center",
        justifyContent: "center",
        marginTop: px2dp(15),
        borderRadius: 6,
    },
    sheetBtn: {
        width: px2dp(180),
        height: px2dp(48),
        justifyContent: "center",
        backgroundColor: "#cde69c",
        borderColor: "#a5d24a",
        borderWidth: px2dp(1)
    },
    sheetBtnText: {
        fontSize: px2dp(19),
        paddingLeft: 0,
        paddingRight: 0,
        color: "#638421"
    },
    renderStoreCheckRoomItem: {
        borderBottomWidth: 0,
        height: px2dp(50)
    },
    renderStoreCheckRoomBtn: {
        flex: 1,
        marginLeft: px2dp(6),
        width: "100%",
        height: "100%",
        justifyContent: "center",
    },
    renderStoreCheckRoomBtnText: {
        fontSize: px2dp(17),
        paddingLeft: 0,
        paddingRight: 0,
    },
    renderStoreCheckRoomIcon: {
        marginLeft: px2dp(5),
        fontSize: px2dp(32),
        color: "#999999"
    },
    renderStoreCheckRoomError: {
        color: "red",
        marginLeft: px2dp(8)
    }
});
export default styles;
