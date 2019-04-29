// @flow
import * as React from "react";
import { connect } from "react-redux";
import TransInfo from "../../stories/screens/kfgl_storecheck_TransInfo";
export interface Props {
    navigation: any,
}
export interface State {}
class StoreCheckTransInfoContainer extends React.Component<Props, State> {
    static navigationOptions = {
        header: null
    };
    render() {
        return <TransInfo
            navigation={this.props.navigation}
            fetchedStoreCheckTrack={this.props.fetchedStoreCheckTrack}
        />;
    }
}

const mapStateToProps = state => ({
    fetchedStoreCheckTrack: state.findStoreCheckTrack.list,
});

export default connect(mapStateToProps)(StoreCheckTransInfoContainer);
