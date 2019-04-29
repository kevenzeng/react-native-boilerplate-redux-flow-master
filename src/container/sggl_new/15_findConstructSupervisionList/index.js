// @flow
import * as React from "react";
import { connect } from "react-redux";
// actions
import { fetchSupervisionList } from "../../../actions/sggl/15_ConstructSupervisionListAction";
// page
import SupervisionList from "../../../stories/screens/sggl_new/15_findConstructSupervisionList";
export interface Props {
    navigation: any,
    user: Object,
    fetchedSupervisionList: Object,
    fetchSupervisionList: Function,
}
export interface State {}
class ConstructSupervisionListContainer extends React.Component<Props, State> {

    static navigationOptions = () => ({
        header: null
    });

    componentDidMount() {
        const requestParams = this.props.navigation.getParam("requestParams");
        console.log("requestParams", requestParams);
        this.props.fetchSupervisionList(requestParams);
    }

    render() {
        return <SupervisionList
            navigation={this.props.navigation}
            user={this.props.user}
            fetchedSupervisionList={this.props.fetchedSupervisionList}
            fetchSupervisionListAction={this.props.fetchSupervisionList}
        />;
    }
}

const mapStateToProps = state => ({
    user: state.user,
    fetchedSupervisionList: state.supervisionList,
});

export default connect(mapStateToProps, {
    fetchSupervisionList,
})(ConstructSupervisionListContainer);
