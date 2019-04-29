import * as React from "react";
import { ActivityIndicator, StatusBar } from "react-native";
import { Container, Content } from "native-base";

import styles from "./styles";

export interface Props {
    navigation: any;
}

export interface State {
}

class SMRPage extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this._redirector();
    }

    _redirector = async() => {
        const authorization = await this.props.navigation.getParam("toHome");
        console.log(authorization);
        await authorization && this.props.navigation.navigate("App");
    };

    render() {
        return (
            <Container style={styles.container}>
                <Content padder>
                    <ActivityIndicator size="large" />
                    <StatusBar hidden={true} />
                </Content>
            </Container>
        );
    }
}

export default SMRPage;
