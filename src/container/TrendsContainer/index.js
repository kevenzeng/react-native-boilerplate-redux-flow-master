// @flow
import * as React from "react";
import Trends from "../../stories/screens/Trends";
export interface Props {
	navigation: any,
}
export interface State {}
export default class TrendsContainer extends React.Component<Props, State> {
	render() {
		return <Trends navigation={this.props.navigation} />;
	}
}
