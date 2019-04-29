import React from "react";
import { Alert, Button, Platform, StyleSheet, Text, View } from "react-native";
import { connect } from "react-redux";
import { BarCodeScanner, Permissions } from "expo";
import { qrInfoForDeviceDetail } from "../../../actions/kfgl_device/findDeviceInfoAction";
import { qrInfoForStoreTransDeviceInfo } from "../../../actions/kfgl_storetrans/findDeviceAction";
import { qrInfoForStoreOutDevice } from "../../../actions/storeOut/findStoreOutDeviceAction";
import { qrInfoForStoreInDevice } from "../../../actions/storeIn/findDeviceAction";

import {
    DEAL_WITH_STORE_IN_SCREEN,
    DEAL_WITH_STORE_OUT_SCREEN,
    DEAL_WITH_STORE_TRANS_SCREEN,
    DEVICE_SCREEN
} from "../../../boot/config";

const BUTTON_COLOR = Platform.OS === "ios" ? "#fff" : "#666";

class BarCodeScannerScreen extends React.Component {
    static navigationOptions = {
        // title: "二维码扫描", // 纯字符名，不是组件
        header: null,
    };

    state = {
        hasCameraPermission: null,
        type: BarCodeScanner.Constants.Type.back,
    };

    alertPresent = false;

    async componentWillMount() {
        let { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === "granted" });
    }

    toggleType = () => this.setState({ type:
            this.state.type === BarCodeScanner.Constants.Type.back
                ? BarCodeScanner.Constants.Type.front
                : BarCodeScanner.Constants.Type.back,
    });

    handleBarCodeScanned = ({ type, data }) => {
        let cPath = this.props.navigation.getParam("routeName");
        let cRoI = this.props.navigation.getParam("currentRowOfItems"); // To add a line of new item correctly
        if (!this.alertPresent) {
            //  will fire after all the frame has flushed
            requestAnimationFrame(() => {
                this.alertPresent = true;
                Alert.alert("扫描成功！", `确认当前备件汇总号：${data}`, [
                    { text: "取消", onPress: () => { this.alertPresent = false; }},
                    { text: "确认", onPress: () => {
                        console.log(`Screen ${cPath} using QR Scanner.`);
                            // dispatch action
                            switch (cPath) {
                                case DEAL_WITH_STORE_IN_SCREEN:
                                    this.props.qrInfoForStoreInDevice({ currentRowOfItems: cRoI, summaryNo: data });
                                    break;
                                case DEAL_WITH_STORE_OUT_SCREEN:
                                    this.props.qrInfoForStoreOutDevice({ currentRowOfItems: cRoI, summaryNo: data });
                                    break;
                                case DEAL_WITH_STORE_TRANS_SCREEN:
                                    this.props.qrInfoForStoreTransDeviceInfo({ currentRowOfItems: cRoI, summaryNo: data });
                                    break;
                                case DEVICE_SCREEN:
                                    this.props.qrInfoForDeviceDetail(data);
                                    break;
                                default :
                                    return;
                            }
                            this.alertPresent = false;
                        }},
                ]);
            });
        }
    };

    render() {
        const { hasCameraPermission } = this.state;

        if (hasCameraPermission === null) {
            return <Text>正在请求摄像头使用权限</Text>;
        }
        if (hasCameraPermission === false) {
            return <Text>您暂时未取得摄像头的使用权！</Text>;
        }

        return (
            <View style={styles.container}>
                <BarCodeScanner
                    onBarCodeScanned={this.handleBarCodeScanned}
                    barCodeTypes={[
                        BarCodeScanner.Constants.BarCodeType.qr,
                        BarCodeScanner.Constants.BarCodeType.pdf417,
                    ]}
                    type={this.state.type}
                    style={styles.preview}
                />
                <View style={[styles.toolbar]}>
                    <Button color={BUTTON_COLOR} title="返  回" onPress={ () => { this.props.navigation.goBack(); } } />
                    <Button color={BUTTON_COLOR} title="切换摄像头" onPress={this.toggleType} />
                </View>
            </View>
        );
    }
}

export default connect(null, {
    qrInfoForStoreInDevice,
    qrInfoForStoreOutDevice,
    qrInfoForDeviceDetail,
    qrInfoForStoreTransDeviceInfo,
})(BarCodeScannerScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    preview: {
        ...StyleSheet.absoluteFillObject,
    },
    toolbar: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        paddingVertical: 10,
        paddingHorizontal: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "rgba(255,255,255,0.2)",
    },
});
