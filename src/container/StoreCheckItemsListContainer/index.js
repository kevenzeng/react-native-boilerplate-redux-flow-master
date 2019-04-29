// @flow
import * as React from "react";
import { connect } from "react-redux";
import StoreCheckItemsList from "../../stories/screens/kfgl_storecheck_ItemsList";
import { toUpdateStoreCheckDetail } from "../../actions/kfgl_storecheck/updateStoreCheckDetailAction";

export interface Props {
    navigation: any,
}
export interface State {}
class StoreCheckItemsListContainer extends React.Component<Props, State> {
    static navigationOptions = {
        header: null
    };
    render() {
        return <StoreCheckItemsList
            navigation={this.props.navigation}
            fetchedStoreCheckDetail={this.props.fetchedStoreCheckDetail}
            selectedCheckList={this.props.selectedCheckList}
            toUpdateStoreCheckDetail={this.props.toUpdateStoreCheckDetail}
            statusOfUpdateDetail={this.props.updateStoreCheckDetail}
            user={this.props.user}
        />;
    }
}

const mapStateToProps = state => ({
    fetchedStoreCheckDetail: state.findStoreCheckDetail,
    updateStoreCheckDetail: state.updateStoreCheckDetail,
    selectedCheckList: state.testSelectedToDoList,
    user: state.user
});

export default connect(mapStateToProps, {
    toUpdateStoreCheckDetail
})(StoreCheckItemsListContainer);
