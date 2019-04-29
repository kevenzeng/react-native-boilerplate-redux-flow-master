import * as React from "react";
import { View, StatusBar, ScrollView } from "react-native";
import { Container, Text, Button } from "native-base";
import { DEVICE_SCREEN } from "../../../boot/config";

import styles from "./styles";

export interface Props {
    navigation: any;
    DealWithDeviceForm: any
}

export interface State {
}

class DealWithDevicePage extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {
            leftPaneStyle,
            msgListContainer,
            mainPosition,
            footBtnContainer,
            footBtn,
        } = styles;

        return <Container style={styles.container}>
            <StatusBar hidden={true}/>
            <View style={mainPosition}>
                <View style={leftPaneStyle}>{}</View>
                <View style={msgListContainer}>
                    <View style={{ flex: 6 }}>
                        <ScrollView>
                            {this.props.DealWithDeviceForm}
                        </ScrollView>
                    </View>
                    <View style={footBtnContainer}>
                        <View style={footBtn}>
                            <Button full info
                                    onPress={() => this.props.navigation.navigate(DEVICE_SCREEN)}><Text>返回库存管理</Text></Button>
                        </View>
                    </View>
                </View>
            </View>
        </Container>;
    }
}

export default DealWithDevicePage;
