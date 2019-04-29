import React from "react";
import {Header, Left, Right, Button, Icon, Body, Title} from "native-base";

const SelfHeader = (props) => {
    return (
        <Header>
            <Left>
                <Button transparent onPress={() => props.navigation.navigate("Home")}>
                    <Icon name="ios-arrow-back" style={styles.icon}/>
                </Button>
            </Left>

            <Body style={{flex: 3}}>
            <Title>
                {props.headerTitle}
            </Title>
            </Body>

            <Right style={styles.iconPosition}>
                <Button transparent>
                    <Icon name="search" style={styles.icon}/>
                </Button>
                <Button transparent>
                    <Icon name="more" style={styles.icon}/>
                </Button>
            </Right>
        </Header>
    );
};

const styles = {
    iconPosition: {
        marginRight: 15,
    },
    icon: {
        fontSize: 30
    }
};

export default SelfHeader;
