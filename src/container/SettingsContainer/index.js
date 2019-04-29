// @flow
import * as React from "react";
import Settings from "../../stories/screens/Settings";
export interface Props {
	navigation: any,
}
export interface State {}
export default class TrendsContainer extends React.Component<Props, State> {
	render() {
		return <Settings navigation={this.props.navigation} />;
	}
}
