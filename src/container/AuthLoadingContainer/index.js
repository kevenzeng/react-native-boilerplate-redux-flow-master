// @flow
import * as React from "react";
import { connect } from "react-redux";
import AuthLoadingPage from "../../stories/screens/AuthLoading";
import { getUserFromStorage } from "../../actions/authorizeAction";

export interface Props {
	navigation: any,
}
export interface State {}

class AuthLoadingContainer extends React.Component<Props, State> {
	render() {
		return <AuthLoadingPage navigation={this.props.navigation} getAuth={ () => { this.props.getUserFromStorage(); }}/>;
	}
}

export default connect(null, { getUserFromStorage })(AuthLoadingContainer);
