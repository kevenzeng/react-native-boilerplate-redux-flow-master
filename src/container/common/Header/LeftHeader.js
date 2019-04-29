import React from "react";
import {Header, Left, Button, Icon, Body, Title} from "native-base";

const LeftHeader = (props) => {

    return (
        <Header>
            <Left>
                <Button transparent onPress={() => props.navigation.goBack()}>
                    <Icon name="ios-arrow-back" style={styles.icon}/>
                </Button>
            </Left>

            <Body style={{flex: 3}}>
            <Title>
                {props.headerTitle}
            </Title>
            </Body>

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

export default LeftHeader;
