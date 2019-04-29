import * as React from "react";
import { View, StatusBar, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Container, Text, Button, Header, Left, Icon, Body, Title, Right, H3, Form, Item, Input } from "native-base";
import ProgressDialog from "react-native-simple-dialogs/src/ProgressDialog";
import formUrlEncoded from "form-urlencoded";
import PopupDialog from "react-native-popup-dialog";
import renderIf from "../../../../services/utils/renderIf";

// styles
const { arrowBackFontSize, progressDialogStyle, theHeight, } = cStyles;
import styles from "./styles";
import cStyles from "../../../../styles/dealWithPages";
import commonStyles from "../../../../styles/commonStyles";
import aInputDialogStyle from "../../../../styles/aInputDialog";
const { sideBarBtn, disableOpacity } = commonStyles;

const {
    mainPosition,
    container,
    btnSideBarContainer, sideBarBtnContainer,
    colorWhite, iconStyle, iconTextStyle,
    contentContainer,
    contentStyle,
    rightSideBar,
    footerContainer, footerContent, footerBtnContainer, footerBtnStyle, widthBtn,
    indexBarStyle, sectionGap, contentTitle,
    inContentStyle,
    listContainer, leftList, leftActive, rightList, rightActive
} = styles;

const {  dialogStyle, textAndInputContainer, textContainer,
    dialogText, dialogInputStyle, dialogBtnContainer,
    dialogBtn, dialogCancelBtn, dialogBtnText,
} = aInputDialogStyle;

export interface Props {
    navigation: any;
}

export interface State {
}

class ToConstructPlanScreen extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            sc_index: 0,
        };
    }

    isReadOnly() {
        const { readOnlyFlag } = this.props.constructPlanInfo.responses;
        return readOnlyFlag === undefined ?  false :  readOnlyFlag;
    }

    render() {
        const { navigation, constructPlanInfo, user } = this.props;
        const { userName } = user.authorization;
        const { isFetching, responses }  = constructPlanInfo;
        const { scData = [{}, ], displayCode, readOnlyFlag, recStatus, finishCheck, } = responses && responses;
        const isKeyStep = ["普通步骤", "关键步骤"];
        const commonRequestBody = {
            user: userName,
            displayCode,
            readOnlyFlag,
            sggl_tag: scData[0].sr_sg_tag,
            sr_id: scData[0].sr_id,
            recStatus,
        };

        const listItem = (label, index, activeStyle, isLeft, isEnable, { sc_tag = "", sc_bz_step = 1 }) => (
            <TouchableOpacity key={`key_${index}`}
                              style={[ styles.listItem, activeStyle ]}
                              onPress={() => {
                                  isLeft && this.setState({ sc_index: index });
                                  if (!isLeft && isEnable) {
                                      navigation.navigate("sggl_08", {
                                          requestParams: formUrlEncoded({
                                              user: userName,
                                              displayCode,
                                              readOnlyFlag,
                                              sggl_tag: scData[0].sr_sg_tag,
                                              sr_id: scData[0].sr_id,
                                              recStatus,
                                              sc_tag,
                                              sc_bz_step,
                                              sr_isPreStep: true,
                                          }, { ignorenull : true, skipIndex: true, sorted: false }),
                                          sr_id: scData[0].sr_id,
                                      });
                                  }
                              }}
                              disabled={!isEnable}
            >
                <Text style={styles.listLabel}>{label}</Text>
                {isLeft && <Icon name="ios-arrow-forward" style={styles.listIcon}/>}
            </TouchableOpacity>
        );

        return <Container style={container}>
            <StatusBar hidden={true}/>
            <Header hasSegment>
                <Left style={{ flex: 1 }}>
                    <Button transparent onPress={() => navigation.goBack()}>
                        <Icon name="ios-arrow-back" style={arrowBackFontSize}/>
                    </Button>
                </Left>

                <Body style={{ flex: 1, alignItems:"center" }}>
                <Title>施工方案主页</Title>
                </Body>

                <Right style={{ flex: 1 }}><Text style={{ color: "white" }}>当前用户：{userName && userName}</Text></Right>
            </Header>
            <View style={[mainPosition]}>
                <View style={btnSideBarContainer}>
                    <View style={sideBarBtnContainer}>
                        <TouchableOpacity style={[sideBarBtn, this.isReadOnly() && disableOpacity]}
                                          onPress={() => { this.abnormalEndDialog.show(); }}
                                          disabled={this.isReadOnly()}
                        >
                            <Icon style={[colorWhite, iconStyle]} name="close-circle" />
                            <Text style={[colorWhite, iconTextStyle]}>异常结束</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={sideBarBtnContainer}>
                        <TouchableOpacity style={[sideBarBtn, this.isReadOnly() && disableOpacity]} disabled={this.isReadOnly()} onPress={() => {
                            Alert.alert("操作提示", "本次施工将退出，未保存的信息将丢失", [
                                { text: "取消", onPress: () => {}},
                                {
                                    text: "确认", onPress: () => {
                                        this.props.exitConstructAction(formUrlEncoded(commonRequestBody));
                                    }
                                },
                            ]);
                        }}>
                            <Icon style={[colorWhite, iconStyle]} name="exit" />
                            <Text style={[colorWhite, iconTextStyle]}>退出施工</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={contentContainer}>
                    <View style={contentStyle}>
                        <View style={[inContentStyle]}>
                            <ScrollView>
                                <View style={sectionGap}>{}</View>
                                <View style={[contentTitle]}>
                                    <View style={indexBarStyle}>{}</View>
                                    <View><H3>标准化施工手册</H3></View>
                                </View>
                                <View style={[listContainer]}>
                                    <View style={[leftList]}>
                                        {
                                            scData && scData.map((data, index) => {
                                                let label = data.sc_tag ? `${data.sc_tag}_${data.sc_name}` : "";
                                                return listItem(label, index, this.state.sc_index === index ? leftActive : {}, true, data.sc_enable, {});
                                            })
                                        }
                                    </View>
                                    <View style={[rightList]}>
                                        {
                                            scData && scData[this.state.sc_index].bzData && scData[this.state.sc_index].bzData.map((data, index) => {
                                                const { sc_tag, sc_bz_step, sc_bz_name, sc_bz_gjbz, sc_bz_bzgs, sc_bz_enable} = data;
                                                let label = sc_bz_step ? `步骤${sc_bz_step}: ${sc_bz_name}【${isKeyStep[parseInt(sc_bz_gjbz, 10)]}-${sc_bz_bzgs}min】` : "";
                                                return listItem(label, index, sc_bz_enable ? rightActive : {}, false, sc_bz_enable, { sc_tag, sc_bz_step });
                                            })
                                        }
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </View>
                <View style={rightSideBar}>{}</View>
            </View>
            <View style={footerContainer}>
                <View style={[footerContent]}>
                    <View style={footerBtnContainer}>
                        {/* <Button bordered style={footerBtnStyle}>
                            <Text style={colorWhite}>上一步</Text>
                        </Button> */}
                        {
                            renderIf(finishCheck)(
                                <Button bordered style={[footerBtnStyle, widthBtn]} onPress={() => {
                                    navigation.navigate("sggl_09", {
                                        requestParams: formUrlEncoded({
                                            user: userName,
                                            displayCode,
                                            readOnlyFlag,
                                            sggl_tag: scData[0].sr_sg_tag,
                                            sr_id: scData[0].sr_id,
                                            recStatus,
                                        }, { ignorenull : true, skipIndex: true, sorted: false }),
                                        sr_id: scData[0].sr_id,
                                    });
                                }}>
                                    <Text style={colorWhite}>进入施工结束前检查</Text>
                                </Button>
                            )
                        }
                    </View>
                </View>
            </View>

            <PopupDialog
                ref={(popupDialog) => {
                    this.abnormalEndDialog = popupDialog;
                }}
                dialogStyle={dialogStyle}
                overlayOpacity={0.5}
                onShown={() => {}}
            >
                <View>
                    <View style={textAndInputContainer}>
                        <View style={textContainer}>
                            <Text style={dialogText}>请填写异常原因: </Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Form>
                                <Item regular style={dialogInputStyle}>
                                    <Input placeholder="异常原因"
                                           onChangeText={(errorText) => this.setState({errorText})}
                                           value={this.state.errorText}
                                           placeholderTextColor ={"#cccccc"}
                                           style={{ textAlign: "left"}}
                                    />
                                </Item>
                            </Form>
                        </View>
                    </View>
                    <View style={dialogBtnContainer}>
                        <Button style={[dialogBtn, dialogCancelBtn]}
                                onPress={() => { this.abnormalEndDialog.dismiss(); }}>
                            <Text style={[dialogBtnText, { color: "#999999", }]}>取  消</Text>
                        </Button>
                        <Button style={[dialogBtn, { backgroundColor: "#ff3300" }]}
                                onPress={() => {
                                    this.props.toEndByExceptionAction(formUrlEncoded({
                                        ...commonRequestBody,
                                        sr_end_remarks: this.state.errorText,
                                    }));
                                    this.abnormalEndDialog.dismiss();
                                }}>
                            <Text style={dialogBtnText}>保  存</Text>
                        </Button>
                    </View>
                </View>
            </PopupDialog>
            <ProgressDialog
                visible={isFetching}
                title="更新施工单"
                message="更新中，请稍后..."
                dialogStyle={progressDialogStyle}
                overlayStyle={theHeight}
            />
        </Container>;
    }
}

export default ToConstructPlanScreen;
