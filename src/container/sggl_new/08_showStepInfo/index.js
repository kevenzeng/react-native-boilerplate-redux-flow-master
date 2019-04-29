// @flow
import * as React from "react";
import { connect } from "react-redux";
import ShowStepInfoScreen from "../../../stories/screens/sggl_new/08_showStepInfo";
import { fetchStepInfo, startDateUpdate, finishDateUpdate, triggerResult,triggerSite , remarkUpdates, addPhoto, deletePhoto, } from "../../../actions/sggl/08_showStepInfoAction";
import { toEndByException } from "../../../actions/sggl/05_endByExpectionAction";
import { exitConstruct } from "../../../actions/sggl/06_exitConstructAction";
import { endManualAction } from "../../../actions/sggl/16_endManualAction";


export interface Props {
    navigation: any,
    user: Object,
    currentServerIp: String,
    fetchStepInfo: Function,
    showStepInfo: Object,
    startDateUpdate: Object,
    finishDateUpdate: Object,
    triggerResult: Object,
    triggerSite: Object,
    remarkUpdates: Object,
    toEndByException: Function,
    exitConstruct: Function,
    addPhoto: Function,
    deletePhoto: Function,
    endManualAction: Function,
}

export interface State {
}

class ShowStepInfoContainer extends React.Component<Props, State> {

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
        this.props.fetchStepInfo(requestParams);
    }

    render() {
        return <ShowStepInfoScreen
            navigation={this.props.navigation}
            user={this.props.user}
            serverIp={this.props.currentServerIp}
            showStepInfo={ this.props.showStepInfo }
            currentUser={ this.props.user.authorization }
            startDateUpdateAction={this.props.startDateUpdate}
            finishDateUpdateAction={this.props.finishDateUpdate}
            triggerResultAction={this.props.triggerResult}
            triggerSiteAction={this.props.triggerSite}
            remarkUpdatesAction={this.props.remarkUpdates}
            toEndByExceptionAction={this.props.toEndByException}
            exitConstructAction={this.props.exitConstruct}
            addPhotoAction={this.props.addPhoto}
            deletePhotoAction={this.props.deletePhoto}
            requestStepInfoAction={this.props.fetchStepInfo}
            endManualAction={this.props.endManualAction}
        />;
    }
}

function mapStateToProps({ showStepInfo, user, currentServerIp }) {
    return {
        user,
        showStepInfo,
        currentServerIp,
    };
}

export default connect(mapStateToProps, {
    fetchStepInfo,
    startDateUpdate,
    finishDateUpdate,
    triggerResult,
    triggerSite,
    remarkUpdates,
    toEndByException,
    exitConstruct,
    addPhoto,
    deletePhoto,
    endManualAction,
})(ShowStepInfoContainer);
