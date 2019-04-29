// @flow
import * as React from "react";
import { connect } from "react-redux";
import ToConstructPlanScreen from "../../../stories/screens/sggl_new/07_toConstructPlan";
import { fetchConstructPlan } from "../../../actions/sggl/07_toConstructPlanAction";
import { toEndByException } from "../../../actions/sggl/05_endByExpectionAction"; // 异常结束
import { exitConstruct } from "../../../actions/sggl/06_exitConstructAction"; // 退出施工

export interface Props {
    navigation: any,
    user: Object,
    toConstructPlan: Object,
    fetchConstructPlan: Function,
    toEndByException: Function,
    exitConstruct: Function,
}

export interface State {
}

class ToConstructPlanContainer extends React.Component<Props, State> {

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
        this.props.fetchConstructPlan(requestParams);
    }

    render() {
        return <ToConstructPlanScreen
            navigation={this.props.navigation}
            user={this.props.user}
            constructPlanInfo={ this.props.toConstructPlan }
            currentUser={ this.props.user.authorization }
            toEndByExceptionAction={this.props.toEndByException}
            exitConstructAction={this.props.exitConstruct}
        />;
    }
}

function mapStateToProps({ toConstructPlan, user }) {
    return {
        user,
        toConstructPlan,
    };
}

export default connect(mapStateToProps, {
    fetchConstructPlan,
    toEndByException,
    exitConstruct,
})(ToConstructPlanContainer);
