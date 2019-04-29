// @flow
import * as React from "react";
import { connect } from "react-redux";
import ToCheckBeforeConstructScreen from "../../../stories/screens/sggl_new/04_toCheckBeforeConstruct";
import {
    fetchCheckBeforeConstruct,
    triggerIsDone, remarkUpdates, dateUpdate, rackUpdate,
    deleteOperator, addOperator,
    addPhoto, deletePhoto,
} from "../../../actions/sggl/04_toCheckBeforeConstructAction";
import { toEndByException } from "../../../actions/sggl/05_endByExpectionAction"; // 异常结束
import { exitConstruct } from "../../../actions/sggl/06_exitConstructAction"; // 退出施工

export interface Props {
    navigation: any,
    user: any,
    currentServerIp: String,
    toCheckBeforeConstruct: any,
    triggerIsDone: Function,
    remarkUpdates: Function,
    dateUpdate: Function,
    rackUpdate: Function,
    deleteOperator: Function,
    addOperator: Function,
    fetchCheckBeforeConstruct: Function,
    addPhoto: Function,
    deletePhoto: Function,
    toEndByException: Function,
    exitConstruct: Function,
}

export interface State {
}

class ToCheckBeforeConstructContainer extends React.Component<Props, State> {

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
        this.props.fetchCheckBeforeConstruct(requestParams);
    }

    render() {
        return <ToCheckBeforeConstructScreen
            navigation={this.props.navigation}
            user={this.props.user}
            serverIp={this.props.currentServerIp}
            beforeConstructInfo={ this.props.toCheckBeforeConstruct }
            currentUser={ this.props.user.authorization }
            triggerDoneAction={this.props.triggerIsDone}
            remarkUpdatesAction={this.props.remarkUpdates}
            dateUpdateAction={this.props.dateUpdate}
            rackUpdateAction={this.props.rackUpdate}
            deleteOperatorAction={this.props.deleteOperator}
            addOperatorAction={this.props.addOperator}
            addPhotoAction={this.props.addPhoto}
            deletePhotoAction={this.props.deletePhoto}
            toEndByExceptionAction={this.props.toEndByException}
            exitConstructAction={this.props.exitConstruct}
        />;
    }
}

function mapStateToProps({ toCheckBeforeConstruct, user, currentServerIp }) {
    return {
        user,
        toCheckBeforeConstruct,
        currentServerIp,
    };
}

export default connect(mapStateToProps, {
    fetchCheckBeforeConstruct,
    triggerIsDone,
    remarkUpdates,
    dateUpdate,
    rackUpdate,
    deleteOperator,
    addOperator,
    addPhoto,
    deletePhoto,
    toEndByException,
    exitConstruct,
})(ToCheckBeforeConstructContainer);
