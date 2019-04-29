import * as React from "react";
import { AsyncStorage, View } from "react-native";
import { connect } from "react-redux";
import { Container, Header, Title, Content, Text, Body, Left, Right, Button, Icon } from "native-base";

import styles from "./styles";

export interface Props {
    navigation: any;
}

const { buttonLineContainer, buttonStyle, buttonIconStyle, textStyle, msgTextFontSize, rightPanelContext } = styles;

export interface State {
}

class Settings extends React.Component<Props, State> {
    render() {
        const param = this.props.navigation.state.params;
        if (!this.props.testUser) {
            alert("No testing user");
            return;
        }

        const { userAc, userPhone, userMail, userTeam, userComp, userName } = this.props.user.authorization;

        return (
            <Container style={styles.container}>
                <Header style={{ backgroundColor: "white" }}>
                    <Left style={{ flex: 1 }}/>
                    <Body style={{ flex: 1, alignItems: "center" }}>
                    <Title style={{ color: "#333" }}>{param ? param.name.item : "个人中心"}</Title>
                    </Body>
                    <Right style={{ flex: 1 }}/>
                </Header>

                <Content style={styles.container}>
                    <View style={styles.settingsMainLayout}>
                        <View style={styles.leftPane}>
                            <View style={buttonLineContainer}>
                                <View>
                                    <Button iconLeft transparent danger large style={buttonStyle}>
                                        <Icon name="contact" style={buttonIconStyle}/>
                                        <Text>个人信息</Text>
                                    </Button>
                                </View>
                            </View>
                            <View style={buttonLineContainer}>
                                <Button iconLeft transparent danger large style={buttonStyle}>
                                    <Icon name="star" style={buttonIconStyle}/>
                                    <Text>我的收藏</Text>
                                </Button>
                            </View>
                            <View style={buttonLineContainer}>
                                <Button iconLeft transparent danger large style={buttonStyle}>
                                    <Icon name="cube" style={buttonIconStyle}/>
                                    <Text>我的应用</Text>
                                </Button>
                            </View>
                            <View style={buttonLineContainer}>
                                <Button iconLeft transparent danger large style={buttonStyle}>
                                    <Icon name="key" style={buttonIconStyle}/>
                                    <Text>更改密码</Text>
                                </Button>
                            </View>
                            <View style={buttonLineContainer}>
                                <Button iconLeft transparent danger large style={buttonStyle}
                                        onPress={this._signOutAsync}>
                                    <Icon name="exit" style={buttonIconStyle}/>
                                    <Text>退出登录</Text>
                                </Button>
                            </View>
                            <View style={{ flex: 1 }}>
                                {}
                            </View>
                        </View>
                        <View style={styles.rightPane}>
                            <View style={styles.picPanel}>
                                <View style={styles.picMsgContainer}>
                                    <View style={{ flex: 1 }}>
                                        <Icon name="contact" style={styles.iconImgStyle}/>
                                    </View>
                                    <View style={styles.textContainer}>
                                        <Text style={textStyle}>{ userName }</Text>
                                        <Text style={textStyle}>ID:{ userAc }</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <View style={[{ flex: 1, flexDirection: "row" }, rightPanelContext] }>
                                    <View style={{ flex: 1, alignItems: "center" }}>
                                        <Text style={msgTextFontSize}>团队/处室</Text>
                                        <Text style={msgTextFontSize}>单 位</Text>
                                        <Text style={msgTextFontSize}>个人邮箱</Text>
                                        <Text style={msgTextFontSize}>联系方式</Text>
                                    </View>
                                    <View style={{ flex: 2 }}>
                                        <Text style={msgTextFontSize}>{userTeam}</Text>
                                        <Text style={msgTextFontSize}>{userComp}</Text>
                                        <Text style={msgTextFontSize}>{userMail}</Text>
                                        <Text style={msgTextFontSize}>{userPhone}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }

    _signOutAsync = async () => {
        await AsyncStorage.removeItem("authorization");
        this.props.navigation.navigate("Auth");
    };
}

function mapStateToProps(state) {
    return {
        testUser: state.testUser,
        user: state.user
    };
}

export default connect(mapStateToProps)(Settings);
