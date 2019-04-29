// @flow
import * as React from "react";
import NewStoreIn from "../../stories/screens/NewStoreIn";


export interface Props {
    navigation: any,
}

export interface State {
}

export default class NewStoreInContainer extends React.Component<Props, State> {

    render() {
        return <NewStoreIn navigation={this.props.navigation}/>;
    }
}
