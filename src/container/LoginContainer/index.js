// @flow
import * as React from "react";
import { StyleSheet } from "react-native";
import { connect } from "react-redux";
import { Item, Input, Icon, Form, View } from "native-base";
import { Field, reduxForm } from "redux-form";
import { LOGINFORM } from "../../boot/config";
import { userLogin } from "../../actions/authorizeAction";
import Login from "../../stories/screens/Login";
import screenUtil from "../../../src/boot/screenUtil";
import { required } from "../../services/utils/formValidateUtils";
const { px2dp } = screenUtil;

export interface Props {
  navigation: any;
}
export interface State {}
class LoginForm extends React.Component<Props, State> {
  textInput: any;

  renderInput({ input, label, type, meta: { touched, error, warning } }) {
    return (
        <View padder>
          <Item rounded error={error && touched} style={styles.inputFieldStyle}>
            <Icon active name={input.name === "username" ? "person" : "lock"} style={styles.ionicIcon} />
            <Input
              ref={c => (this.textInput = c)}
              placeholder={input.name === "username" ? "用户账号" : "密码"}
              placeholderTextColor="rgb(204, 204, 204)"
              secureTextEntry={input.name === "password"}
              {...input}
            />
          </Item>
        </View>
    );
  }

  login(values) {
      this.props.userLogin(values);
  }

    render() {
        const { handleSubmit } = this.props;
        const form = (
            <Form>
                <Field
                    name="username"
                    component={this.renderInput}
                    validate={[ required ]}
                />
                <Field
                    name="password"
                    component={this.renderInput}
                    validate={[ required ]}
                />
            </Form>
        );
        return (
            <Login
                navigation={this.props.navigation}
                loginForm={form}
                onLogin={handleSubmit((values) => { this.login(values); })}
            />
        );
    }
}

const LoginContainer = connect(null, {
    userLogin
})(
    reduxForm({
        form: LOGINFORM
    })(LoginForm)
);

const styles = StyleSheet.create({
    ionicIcon: {
        marginLeft: px2dp(32),
        color: "rgb(204, 204, 204)",
        textAlign: "center",
        minWidth: px2dp(36)
    },
    inputFieldStyle: {
        width: px2dp(500),
        height: px2dp(60)
    }
});

export default LoginContainer;
