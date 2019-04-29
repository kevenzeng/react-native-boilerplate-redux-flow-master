import {StyleSheet} from "react-native";

const styles: any = StyleSheet.create({
    container: {
        backgroundColor: "#FBFAFA",
    },
    tableContainer: {
        flex: 1,
        padding: 16,
        paddingBottom: 10
    },
    tableWrapper: {
        flexDirection: "row",
    },
    headerTitle: {
        alignItems: "center",
    },
    tableTitle: {
        flex: 1,
        backgroundColor: "#f1f8ff"
    },
    text: {
        margin: 6,
        fontSize: 20,
    },
    row: {
        minHeight: 40,
    },
    detailsBtnContainer: {
        alignSelf: "flex-end",
    },
    detailsBtn: {
        fontSize: 16,
    }
});
export default styles;
