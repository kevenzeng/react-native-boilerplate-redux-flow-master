// @flow
import * as React from "react";
import { connect } from "react-redux";
import ToConstructPrepareScreen from "../../../stories/screens/sggl_new/03_toConstructPrepare";
import { fetchConstructPrepare, triggerReady, addNewRow, deleteARow } from "../../../actions/sggl/03_toConstructPrepareAction";
import { toEndByException } from "../../../actions/sggl/05_endByExpectionAction"; // 异常结束
import { exitConstruct } from "../../../actions/sggl/06_exitConstructAction"; // 退出施工

export interface Props {
    navigation: any,
    user: Object,
    toConstructPrepare: Object,
    triggerReady: Function,
    addNewRow: Function,
    deleteARow: Function,
    fetchConstructPrepare: Function,
    toEndByException: Function,
    exitConstruct: Function,
}

export interface State {
}

class ToConstructPrepareContainer extends React.Component<Props, State> {

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
        const sggl_tag = getParam("currentSgglTag");
        const displayCode = getParam("displayCode");
        const readOnlyFlag = getParam("readOnlyFlag");
        const recStatus = getParam("recStatus");
        const sr_id = getParam("sr_id");
        this.props.fetchConstructPrepare({
            user: userName,
            displayCode,
            readOnlyFlag,
            sggl_tag,
            sr_id,
            recStatus,
        });
    }

    render() {
        return <ToConstructPrepareScreen
            navigation={this.props.navigation}
            user={this.props.user}
            preparedInfo={ this.props.toConstructPrepare }
            currentUser={ this.props.user.authorization }
            triggerReadyAction={this.props.triggerReady}
            addRowAction={this.props.addNewRow}
            deleteARowAction={this.props.deleteARow}
            toEndByExceptionAction={this.props.toEndByException}
            exitConstructAction={this.props.exitConstruct}
        />;
    }
}

function mapStateToProps({ toConstructPrepare, user }) {
    return {
        user,
        toConstructPrepare,
    };
}

export default connect(mapStateToProps, {
    fetchConstructPrepare,
    triggerReady,
    addNewRow,
    deleteARow,
    toEndByException,
    exitConstruct,
})(ToConstructPrepareContainer);
