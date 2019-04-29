// @flow
import * as React from "react";
import SMRPage from "../../stories/screens/SMR";

import LeftRightHeader from "../common/Header/LeftAndRight";

export interface Props {
    navigation: any,
}

export interface State {
}

export default class SMRContainer extends React.Component<Props, State> {

    static navigationOptions = ({navigation}) => ({
        header: <LeftRightHeader navigation={navigation} headerTitle="待办列表"/>
    });

    render() {
        return <SMRPage navigation={this.props.navigation}/>;
    }
}
