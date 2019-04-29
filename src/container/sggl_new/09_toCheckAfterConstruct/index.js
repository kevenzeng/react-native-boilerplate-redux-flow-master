// @flow
import * as React from "react";
import { connect } from "react-redux";
import ToCheckAfterConstructScreen from "../../../stories/screens/sggl_new/09_toCheckAfterConstruct";
import { fetchCheckAfterConstruct, setProgress, setEndTime, setReason, triggerIsDone, remarkUpdates,
    addNewRow, deleteARow,
    addPhoto, deletePhoto,
    backToHistoryPage,
} from "../../../actions/sggl/09_toCheckAfterConstructAction";
import { confirmSupervisionAction } from "../../../actions/sggl/17_confirmSupervisionAction";
import { toEndByException } from "../../../actions/sggl/05_endByExpectionAction"; // 异常结束
import { exitConstruct } from "../../../actions/sggl/06_exitConstructAction"; // 退出施工

export interface Props {
    navigation: any,
    user: Object,
    currentServerIp: String,
    toCheckAfterConstruct: Object,
    triggerIsDone: Function,
    setProgress: Function,
    setEndTime: Function,
    setReason: Function,
    remarkUpdates: Function,
    addNewRow: Function,
    deleteARow: Function,
    addPhoto: Function,
    deletePhoto: Function,
    fetchCheckAfterConstruct: Function,
    confirmSupervisionAction: Function,
    toEndByException: Function,
    exitConstruct: Function,
    backToHistoryPage: Function,
}

export interface State {
}

class ToCheckAfterConstructContainer extends React.Component<Props, State> {

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
        const requestParams = this.props.navigation.getParam("requestParams");
        console.log("requestParams", requestParams);
        this.props.fetchCheckAfterConstruct(requestParams);
    }

    render() {
        return <ToCheckAfterConstructScreen
            navigation={this.props.navigation}
            user={this.props.user}
            serverIp={this.props.currentServerIp}
            afterConstructInfo={ this.props.toCheckAfterConstruct }
            currentUser={ this.props.user.authorization }
            triggerDoneAction={this.props.triggerIsDone}
            setProgressAction={this.props.setProgress}
            setEndTimeAction={this.props.setEndTime}
            setReasonAction={this.props.setReason}
            remarkUpdatesAction={this.props.remarkUpdates}
            addNewRowAction={this.props.addNewRow}
            deleteARowAction={this.props.deleteARow}
            addPhotoAction={this.props.addPhoto}
            deletePhotoAction={this.props.deletePhoto}
            confirmSupervisionAction={this.props.confirmSupervisionAction}
            toEndByExceptionAction={this.props.toEndByException}
            exitConstructAction={this.props.exitConstruct}
            backToHistoryPageAction={this.props.backToHistoryPage}
        />;
    }
}

function mapStateToProps({ toCheckAfterConstruct, user, currentServerIp }) {
    return {
        user,
        toCheckAfterConstruct,
        currentServerIp,
    };
}

export default connect(mapStateToProps, {
    fetchCheckAfterConstruct,
    setProgress,
    setEndTime,
    setReason,
    triggerIsDone,
    remarkUpdates,
    addNewRow,
    deleteARow,
    addPhoto,
    deletePhoto,
    confirmSupervisionAction,
    toEndByException,
    exitConstruct,
    backToHistoryPage
})(ToCheckAfterConstructContainer);
