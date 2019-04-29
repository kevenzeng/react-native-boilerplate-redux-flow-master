import { StyleSheet } from "react-native";
import screenUtil from "../../boot/screenUtil";

const { px2dp } = screenUtil;

const styles: any = StyleSheet.create({
    // renders Style
    renderInput: {
        borderBottomWidth: 0,
        height: px2dp(60)
    },
    renderInputLabel: {
        flex: 1,
        textAlign: "right",
        marginRight: px2dp(15)
    },
    borderWidth1: {
        borderWidth: px2dp(1)
    },
    renderInputInput: {
        flex: 3,
        borderColor: "#E5E5E5",
        marginTop: px2dp(10),
        marginBottom: px2dp(10)
    },
    pickerStyle: {
        flex: 1,
        marginLeft: px2dp(6)
    },
    pickerCustomStyleDateInput: {
        borderColor: "#E5E5E5",
        alignItems: "flex-start"
    },
    pickerCustomStyleDateText: {
        marginLeft: px2dp(5)
    },
    pickerCustomStylePlaceholderText: {
        marginLeft: px2dp(5)
    },
    container: {
        flexDirection: "row",
        marginTop: px2dp(15),
        marginLeft: px2dp(20),
        marginRight: px2dp(20),
    },
    progressBarStyle: {
        width: 400,
        height: 140,
        alignSelf: "center"
    },
    headerItem: {
        flex: 1,
        alignItems: "center"
    },
    icon: {
        fontSize: 30,
        color: "white",
    }
});
export default styles;
