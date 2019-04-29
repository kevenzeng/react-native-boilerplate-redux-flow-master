// @flow
import * as React from "react";
import { connect } from "react-redux";
import ShowManualScreen from "../../../stories/screens/sggl_new/12_showManual";
import { fetchManual } from "../../../actions/sggl/12_showManualAction";

export interface Props {
    navigation: any,
    user: any,
    showManual: any,
    fetchManual: Function,
}

export interface State {
}

class ShowManualContainer extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {};
    }

    static navigationOptions = () => ({
        header:null
    });

    componentDidMount() {
        this.mainRequests();
    }

    mainRequests() {
        const requestParams = this.props.navigation.getParam("requestParams");
        console.log("requestParams", requestParams);
        this.props.fetchManual(requestParams);
    }

    render() {
        return <ShowManualScreen
            navigation={this.props.navigation}
            user={this.props.user}
            showedManual={ this.props.showManual }
            currentUser={ this.props.user.authorization }
        />;
    }
}

function mapStateToProps({ showManual, user }) {
    return {
        user,
        showManual,
    };
}

export default connect(mapStateToProps, {
    fetchManual,
})(ShowManualContainer);
