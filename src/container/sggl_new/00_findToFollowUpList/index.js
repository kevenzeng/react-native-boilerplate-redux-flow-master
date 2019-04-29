// @flow
import * as React from "react";
import { connect } from "react-redux";
// actions
import { fetchToFollowUpList } from "../../../actions/sggl/00_findToFollowUpListAction";
import { fetchFollowUpHisList } from "../../../actions/sggl/01_findFollowUpHisListAction";
// page
import FindToFollowUpList from "../../../stories/screens/sggl_new/00_findToFollowUpList";
export interface Props {
    navigation: any,
    user: Object,
    fetchedToFollowUpList: Object,
    fetchedFollowUpHisList: Object,
    fetchToFollowUpList: Function,
    fetchFollowUpHisList: Function,
}
export interface State {}
class FindToFollowUpListContainer extends React.Component<Props, State> {

    static navigationOptions = ({navigation}) => ({
        header: null
    });

    componentDidMount() {
        const { userName } = this.props.user.authorization;
        this.props.fetchToFollowUpList({
            user: userName,
        });
    }

    render() {
        return <FindToFollowUpList
            navigation={this.props.navigation}
            user={this.props.user}
            fetchedToFollowUpList={this.props.fetchedToFollowUpList}
            fetchedFollowUpHisList={this.props.fetchedFollowUpHisList}
            fetchToFollowUpAction={this.props.fetchToFollowUpList}
            fetchFollowUpHisAction={this.props.fetchFollowUpHisList}
        />;
    }
}

const mapStateToProps = state => ({
    user: state.user,
    fetchedToFollowUpList: state.findToFollowUpList,
    fetchedFollowUpHisList: state.findFollowUpHisList,
});

export default connect(mapStateToProps, {
    fetchToFollowUpList,
    fetchFollowUpHisList,
})(FindToFollowUpListContainer);
