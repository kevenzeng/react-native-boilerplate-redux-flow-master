// @flow
import * as React from "react";
import { connect } from "react-redux";
import { AsyncStorage } from "react-native";
import HomeScreen from "../../stories/screens/HomeScreen";
import { DOMAIN_ROOT } from "../../boot/config";
import { getServerIpFromStorage } from "../../actions/getServerAddressAction";

export interface Props {
    navigation: any,
    userName: String,
    getServerIpFromStorage: Function,
}
export interface State {}
class HomeScreenContainer extends React.Component<Props, State> {

    // 取得当前 ServerIp
    componentDidMount() {
        (async () => {
            await AsyncStorage.getItem("serverIp")
            .then(serverIp => {
                this.props.getServerIpFromStorage(serverIp ? serverIp : DOMAIN_ROOT);
            });
        })();
    }

    render() {
        return <HomeScreen navigation={this.props.navigation} userName={this.props.userName}/>;
    }
}

const mapStateToProps = state => ({
    userName: state.user.authorization.userName,
});

export default connect(mapStateToProps, { getServerIpFromStorage })(HomeScreenContainer);
