import * as React from "react";
import { Image, AsyncStorage, StatusBar } from "react-native";
import { connect } from "react-redux";
import appInfo from "../../../../app.json";
import {
    Container,
    Content,
    Header,
    Right,
    Button,
    Text,
    View,
    Footer,
    Icon,
    Form,
    Item,
    Input
} from "native-base";
import * as Expo from "expo";
import { userLogin, resetAuthorization, resetAuthorizationResult, cleanCache } from "../../../actions/authorizeAction";

import styles from "./styles";
import { validateIp } from "../../../services/utils/formValidateUtils";
import { toaster } from "../../../services/utils/toastUtils";
import renderIf from "../../../services/utils/renderIf";
import PopupDialog from "react-native-popup-dialog";
import { isEmpty } from "lodash";
import { distinctUntilKeyChanged } from "rxjs/operator/distinctUntilKeyChanged";

export interface Props {
    loginForm: any,
}
export interface State {}
class Login extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            text: "",
       };
    }

    componentDidMount() {
        // doesn't work in apk
        Expo.SplashScreen.hide();
    }

    componentWillReceiveProps(nextProps) {
        let { authorization, hasError, result } = nextProps.user;
        if (hasError) {
            toaster.showToast(`喔噢，登录失败: ${authorization[1]}`);
            nextProps.resetAuthorization();
        }

        if (result) {
            this.props.resetAuthorizationResult();
            authorization = JSON.stringify(authorization);
            AsyncStorage.setItem("authorization", authorization)
            .then(() => {
                // // Remove all cache except authorization.
                this.props.cleanCache({ isLogin: true });
                toaster.showToast("登录成功!");
                // Redirect to home page
                this.props.navigation.navigate("App");
            });
        }
    }

    _configLocalIp = async (configIp) => {
        try {
            await AsyncStorage.setItem("serverIp", configIp);
            toaster.showToast(`已配置服务器 IP 地址为: ${configIp}`);
            this.ipSettingsDialog.dismiss();
        } catch (e) {
            console.log("Config Ip Error!", configIp);
        }
    };

    _fetchLocalIp = async () => {
        try {
            const value = await AsyncStorage.getItem("serverIp");
            if (value !== null) {
                this.setState({ text: value });
            }
        } catch (e) {
            console.log("Error fetch config ip");
        }
    };

    render() {

        const {
            settingsStyle,
            settingIcon,
            headerStyle,
            mainPic,
            sidePic,
            loginForm,
            loginBtn,
            loginBtnSize,
            footer,
            footerContainer,
            footerText,
            dialogBtn,
            dialogBtnText,
            dialogStyle,
            dialogText,
            textAndInputContainer,
            textContainer,
            dialogInputStyle,
            errorContainer,
            errorTextStyle,
            dialogBtnContainer,
            dialogCancelBtn,
            errorIcon,
        } = styles;

        return (
			<Container>
                <StatusBar hidden={true} />
				<Header noShadow style={ headerStyle }>
                    <Right>
                        <View style={settingsStyle}>
                            <Button transparent onPress={() => { this.ipSettingsDialog.show(); }}>
                                <Icon name={"settings"} style={settingIcon} />
                            </Button>
                        </View>
                    </Right>
				</Header>
				<Content>
                    <View>
                        <View style={{alignItems: "center"}}>
                            <Image
                                source={require("../../../../assets/loginPage/icon_logo_picc_3x.png")}
                                style={ mainPic }
                            />
                        </View>
                        <View style={{flexDirection: "row"}}>
                            <View>
                                <Image
                                    source={require("../../../../assets/loginPage/bg_line_left_3x.png")}
                                    style={ sidePic }
                                />
                            </View>
                            <View style={ loginForm }>
                                {this.props.loginForm}
                                <View padder>
                                    <Button
                                        rounded
                                        onPress={() => { this.props.onLogin(); }}
                                        style={ loginBtn }
                                    >
                                        <Text style={ loginBtnSize }>登        录</Text>
                                    </Button>
                                </View>
                            </View>
                            <View>
                                <Image
                                    source={require("../../../../assets/loginPage/bg_line_right_3x.png")}
                                    style={ sidePic }
                                />
                            </View>
                        </View>
                    </View>
				</Content>
				<Footer style={ footer }>
					<View style={ footerContainer }>
						<View padder>
							<Text style={footerText}>版本信息:{appInfo.expo.version} </Text>
						</View>
					</View>
				</Footer>
                <PopupDialog
                    ref={(popupDialog) => {
                        this.ipSettingsDialog = popupDialog;
                    }}
                    dialogStyle={dialogStyle}
                    overlayOpacity={0.5}
                    onShown={() => {
                        this._fetchLocalIp();
                    }}
                >
                    <View>
                        <View style={textAndInputContainer}>
                            <View style={textContainer}>
                                <Text style={dialogText}>IP 地址: </Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Form>
                                    <Item regular style={dialogInputStyle}>
                                        <Input placeholder="请输入 IP 地址  如: xxx.xxx.xxx.xxx"
                                               onChangeText={(text) => this.setState({text})}
                                               value={this.state.text}
                                               placeholderTextColor ={"#cccccc"}
                                               style={{ textAlign: "left"}}
                                        />
                                    </Item>
                                </Form>
                                <View>
                                    {renderIf(false)(
                                        <Icon name={"md-checkmark-circle"} style={[errorIcon, { color: "#00c292" }]}/>
                                    )}
                                </View>
                            </View>
                            <View style={errorContainer}>
                                {renderIf(false)(
                                    <Text style={errorTextStyle}>此 IP 地址不合理</Text>
                                )}
                            </View>
                        </View>
                        <View style={dialogBtnContainer}>
                            <Button style={[dialogBtn, dialogCancelBtn]}
                                    onPress={() => {this.ipSettingsDialog.dismiss(); }}>
                                <Text style={[dialogBtnText, { color: "#999999", }]}>取  消</Text>
                            </Button>
                            <Button style={[dialogBtn, { backgroundColor: "#ff3300" }]}
                                    onPress={() => {
                                        const configIp = this.state.text;
                                        this._configLocalIp(configIp);
                                    }}>
                                <Text style={dialogBtnText}>保  存</Text>
                            </Button>
                        </View>
                    </View>
                </PopupDialog>
			</Container>
		);
	}
}

function mapStateToProps(state) {
    return {
        user: state.user,
    };
}

export default connect(mapStateToProps, {
    userLogin,
    resetAuthorization,
    resetAuthorizationResult,
    cleanCache
})(Login);
