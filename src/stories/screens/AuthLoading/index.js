import * as React from "react";
import { ActivityIndicator, AsyncStorage, StatusBar } from "react-native";
import { Container, Content } from "native-base";

import styles from "./styles";

export interface Props {
	navigation: any;
}

export interface State {}

class AuthLoadingScreen extends React.Component<Props, State> {

    constructor() {
        super();
        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        const authorization = await AsyncStorage.getItem("authorization");
        await this.props.getAuth();
        this.props.navigation.navigate(authorization ? "App" : "Auth");
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

export default AuthLoadingScreen;
