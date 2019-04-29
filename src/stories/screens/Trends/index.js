import * as React from "react";
import { Container, Header, Title, Content, Text, Body, Left, Right } from "native-base";

import styles from "./styles";
export interface Props {
	navigation: any;
}
export interface State {}
class Trends extends React.Component<Props, State> {
	render() {
		const param = this.props.navigation.state.params;
		return (
			<Container style={styles.container}>
				<Header>
                    <Left style={ {flex: 1} }/>
					<Body style={{ flex: 1, alignItems: "center"}}>
						<Title>{param ? param.name.item : "动态监控"}</Title>
					</Body>
                    <Right style={ {flex: 1}}/>
				</Header>

				<Content padder>
					<Text>{param !== undefined ? param.name.item : "Trends..."}</Text>
				</Content>
			</Container>
		);
	}
}

export default Trends;
