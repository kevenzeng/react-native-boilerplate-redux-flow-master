// @flow
import * as React from "react";
import { connect } from "react-redux";
import ShowConstructFormInfoScreen from "../../../stories/screens/sggl_new/02_showConstructFormInfo";
import { fetchConstructFormInfo } from "../../../actions/sggl/02_showConstructFormInfoAction";

export interface Props {
    navigation: any,
    user: Object,
    showConstructFormInfo: Object,
    fetchConstructFormInfo: Function,
}

export interface State {
}

class ShowConstructFormInfoContainer extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {};
    }

    static navigationOptions = ({navigation}) => ({
        header:null
    });

    componentDidMount() {
        this.mainRequests();
    }

    mainRequests() {
        const { getParam } = this.props.navigation;
        const { userName } = this.props.user.authorization;
        const sgglTag = getParam("currentSgglTag");
        const srId = getParam("currentSrId");
        const displayCode = getParam("currentDisplayCode");
        this.props.fetchConstructFormInfo({
            user: userName,
            sggl_tag: sgglTag,
            sr_id: srId,
            displayCode: displayCode,
        });
    }

    render() {
        return <ShowConstructFormInfoScreen
            navigation={this.props.navigation}
            user={this.props.user}
            constructFormInfo={ this.props.showConstructFormInfo }
            currentUser={ this.props.user.authorization}
        />;
    }
}

function mapStateToProps({ showConstructFormInfo, user }) {
    return {
        user,
        showConstructFormInfo,
    };
}

export default connect(mapStateToProps, {
    fetchConstructFormInfo,
})(ShowConstructFormInfoContainer);
