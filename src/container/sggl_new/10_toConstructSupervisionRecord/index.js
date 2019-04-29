// @flow
import * as React from "react";
import { connect } from "react-redux";
// actions
import { fetchSupervisionRecordList } from "../../../actions/sggl/10_ConstructRecordAction";
// page
import SupervisionRecord from "../../../stories/screens/sggl_new/10_toConstructSupervisionRecord";
export interface Props {
    navigation: any,
    user: Object,
    currentServerIp: Object,
    fetchSupervisionRecordList: Function,
    fetchedSupervisionRecordList: Object,
}
export interface State {}
class ConstructRecordContainer extends React.Component<Props, State> {

    static navigationOptions = () => ({
        header: null
    });

    componentDidMount() {
        const requestParams = this.props.navigation.getParam("requestParams");
        console.log("requestParams", requestParams);
        this.props.fetchSupervisionRecordList(requestParams);
    }

    render() {
        return <SupervisionRecord
            navigation={this.props.navigation}
            user={this.props.user}
            serverIp={this.props.currentServerIp}
            fetchedSupervisionRecordList={this.props.fetchedSupervisionRecordList}
            fetchSupervisionRecordListAction={this.props.fetchSupervisionRecordList}
        />;
    }
}

const mapStateToProps = state => ({
    user: state.user,
    fetchedSupervisionRecordList: state.supervisionRecordList,
    currentServerIp: state.currentServerIp,
});

export default connect(mapStateToProps, {
    fetchSupervisionRecordList,
})(ConstructRecordContainer);
