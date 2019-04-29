// @flow
import * as React from "react";
import { connect } from "react-redux";
import TransInfo from "../../stories/screens/TransInfo";
export interface Props {
    navigation: any,
}
export interface State {}
class TransInfoContainer extends React.Component<Props, State> {
    static navigationOptions = {
        header: null
    };
    render() {
        return <TransInfo
            navigation={this.props.navigation}
            fetchedStoreInTrack={this.props.fetchedStoreInTrack}
            fetchedStoreOutTrack={this.props.fetchedStoreOutTrack}
            fetchedStoreTransTrack={this.props.fetchedStoreTransTrack}
        />;
    }
}

const mapStateToProps = state => ({
    fetchedStoreInTrack: state.findStoreInTrack.list,
    fetchedStoreOutTrack: state.findStoreOutTrack.list,
    fetchedStoreTransTrack: state.findStoreTransTrack.list,
});

export default connect(mapStateToProps)(TransInfoContainer);
