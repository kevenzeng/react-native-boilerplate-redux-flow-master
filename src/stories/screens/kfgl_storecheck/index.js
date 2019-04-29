import * as React from "react";
import { connect } from "react-redux";
import { View, FlatList, StatusBar, TouchableOpacity, BackHandler, Image } from "react-native";
import { Container, Content, Text, H1, H3, Button, Icon, Header, Left, Right, Body, Title } from "native-base";
import _ from "lodash";
import PopupDialog, { DialogTitle } from "react-native-popup-dialog";
import { ProgressDialog } from "react-native-simple-dialogs";
import SearchForm from "../../../components/formComponents/kfgl_storecheck/StoreCheckSearchForm";
import renderIf from "../../../services/utils/renderIf";
import { RECIPIENT_STATUS, DEAL_WITH_STORE_CHECK_SCREEN } from "../../../boot/config";

import styles from "../../../styles/todoPages";
import { selectListItem } from "../../../actions/toDoListSelectAction";
import { fetchStoreCheck } from "../../../actions/kfgl_storecheck/findStoreCheckAction";
import { fetchStoreCheckStoreRoom } from "../../../actions/kfgl_storecheck/findStoreRoomAction";

export interface Props {
    navigation: any;
}

export interface State {
}

class StoreCheckPage extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            dialogVisible: false,
        };
    }

    static navigationOptions = ({ navigation }) => {
        return {
            header: <Header hasSegment>
                <Left style={{ flex:1 }}>
                    <Button transparent onPress={() => navigation.navigate("Home")}>
                        <Icon name="ios-arrow-back" style={styles.icon}/>
                    </Button>
                </Left>

                <Body style={{ flex:1, alignItems:"center" }}>
                    <Title>盘点待办列表</Title>
                </Body>

                <Right style={ styles.iconPosition }>
                    <Button transparent onPress={ navigation.getParam("popUpDialog") }>
                        <Icon name="search" style={styles.icon}/>
                    </Button>
                </Right>
            </Header>,
        };
    };

    _searchPopUpDialog = () => {
        this.setState((prevState) => ({
            dialogVisible: !prevState.dialogVisible
        }), () => {
            this.triggerDialog(this.state.dialogVisible);
        });
    };

    componentDidMount() {
        const { userName, userPhone, } = this.props.user.authorization;
        this.props.navigation.setParams({
            userName: userName,
            userPhone: userPhone,
            popUpDialog: this._searchPopUpDialog
        });
        this.fetchFindStoreCheck();
        BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
    }

    handleBackButton() {
        console.log("StoreCheck handleBackButton");
        return true;
    }

    triggerDialog(value) {
        if (value) {
            this.popUpDialogForSearch.show();
        } else {
            this.popUpDialogForSearch.dismiss();
        }
    }

    fetchFindStoreCheck() {
        const { userName } = this.props.user.authorization;
        this.props.fetchStoreCheck({
            user: userName,
            operator: userName,
        });
        if (_.isEmpty(this.props.findStoreCheckStoreRoom.list)) {
            this.props.fetchStoreCheckStoreRoom({
                user: userName
            });
        }
    }

    _keyExtractor = (item, index) => `list-item-${index}`;

    render() {
        const {
            leftPaneStyle,
            leftPaneTitle,
            flatListItem,
            msgListItem,
            flatListItemFontSize,
            popUpDialogContainer,
            popUpDialogTitle,
            popUpDialogTitleText,
            flatListItemTitle,
            flatListItemValue,
            flatListItemFooter,
            coloredMsgListItem,
            msgListItemTitle,
            msgListItemValue,
            msgListTitleContainer,
            msgListPane,
            msgListContainer,
            mainPosition,
            flatList,
            oBackgroundColor,
            whiteFontColor,
            emptyListText,
            emptyListPic,
            emptyListInfo,
            emptyBtnContainerStyle,
            emptyBtnStyle,
            emptyBtnText,
            progressDialogStyle,
            msgListButton
        } = styles;

        const { applyDate, applyAduitor, operator, applyer, checker, checkAduitor, status, remark, checkNo } = this.props.testSelectedToDoList;
        const { isFetching } = this.props.findStoreCheck;

        let userName = this.props.navigation.getParam("userName");
        let userPhone = this.props.navigation.getParam("userPhone");
        let paramsObj = {
            currentApplier: userName,
            currentPhoneNum: userPhone,
            currentOperator: userName,
            currentOperateType: "add",
            currentStatus: "01", // 盘点单状态
            currentStatusName: "申请中", // 盘点单状态显示值
            headerTitle: "添加盘点单",
        };

        return <Container style={styles.container}>
            <StatusBar hidden={true} />
            <Content>
                <View>
                    <PopupDialog
                        ref={ (popUpDialog) => this.popUpDialogForSearch = popUpDialog }
                        onDismissed={() => {
                            this.setState({
                                dialogVisible: false
                            });
                        }}
                        width={0.7}
                        height={0.65}
                        containerStyle={popUpDialogContainer}
                        dialogTitle={
                        <DialogTitle
                            title="盘点单搜索"
                            hasTitleBar={false}
                            titleTextStyle={popUpDialogTitleText}
                            titleStyle={popUpDialogTitle}
                        />
                    }>
                        { <SearchForm popUpIns={this.popUpDialogForSearch}  storeRoomList={this.props.findStoreCheckStoreRoom.list} /> }
                    </PopupDialog>
                    {
                        renderIf(_.isEmpty(this.props.findStoreCheck.list))(
                            <View style={emptyListInfo}>
                                <View>
                                    <Image
                                        source={require("../../../../assets/loading/icon_list_empty_3x.png")}
                                        style={emptyListPic}
                                    />
                                    <Text style={emptyListText}>还没有相关的列表呢</Text>
                                </View>
                                <View style={emptyBtnContainerStyle}>
                                    <Button bordered dark style={[msgListButton, emptyBtnStyle]} onPress={() => {
                                        let tObj = _.cloneDeep(paramsObj);
                                        this.props.navigation.navigate(DEAL_WITH_STORE_CHECK_SCREEN, tObj);
                                    }}>
                                        <Text style={emptyBtnText}>添加盘点单</Text>
                                    </Button>
                                </View>
                            </View>
                        )
                    }
                    {
                        renderIf(!_.isEmpty(this.props.findStoreCheck.list))(
                            <View  style={ mainPosition }>
                                <View style={ leftPaneStyle }>
                                    <View style={ leftPaneTitle }>
                                        <H1>盘点单列表</H1>
                                    </View>
                                    <View style={ flatList }>
                                        <FlatList data={this.props.findStoreCheck.list}
                                                  keyExtractor={this._keyExtractor}
                                                  extraData={ checkNo }
                                                  renderItem={({ item }) => {
                                                      let b = checkNo === item.checkNo;
                                                      return (
                                                          <View>
                                                              <TouchableOpacity style={ [flatListItem, b && oBackgroundColor] } onPress={ () => {
                                                                  this.props.selectListItem(item);
                                                              } }>
                                                                  <View style={ flatListItemTitle }>
                                                                      <Text style={ [flatListItemFontSize, b && whiteFontColor] }>盘点单号</Text>
                                                                  </View>
                                                                  <View style={ flatListItemValue }>
                                                                      <Text style={ [flatListItemFontSize, b && whiteFontColor] }>{item.checkNo}</Text>
                                                                  </View>
                                                              </TouchableOpacity>
                                                              <View style={ flatListItemFooter } />
                                                          </View>
                                                      );
                                                  }
                                                  }
                                        />
                                    </View>
                                </View>
                                <View style={ msgListContainer }>
                                    <View style={ msgListPane }>
                                        <View style={ msgListTitleContainer }>
                                            <H1>盘点单信息</H1>
                                            <View style={{ flexDirection: "row" }}>
                                                <Button info style={msgListButton} onPress={() => {
                                                    let tObj = _.cloneDeep(paramsObj);
                                                    this.props.navigation.navigate(DEAL_WITH_STORE_CHECK_SCREEN, tObj);
                                                }}>
                                                    <Text>添加盘点单</Text>
                                                </Button>
                                                <Button danger style={msgListButton}
                                                        onPress={() => {
                                                            this.props.navigation.navigate("DealWithStoreCheck", {
                                                                headerTitle: "添加盘点单",
                                                                currentCheckNo: checkNo,
                                                                currentOperator: operator || "",
                                                                currentStatus: status,
                                                                currentOperateType: "update" // 保存表单用，新建为 add
                                                            });
                                                        }}><Text>处理盘点单</Text>
                                                </Button>
                                            </View>
                                        </View>
                                        <View>
                                            <View style={ coloredMsgListItem }>
                                                <H3 style={ msgListItemTitle }>申请日期</H3>
                                                <H3 style={ msgListItemValue }>{applyDate}</H3>
                                            </View>
                                            <View style={ msgListItem }>
                                                <H3 style={ msgListItemTitle }>处理人</H3>
                                                <H3 style={ msgListItemValue }>{operator}</H3>
                                            </View>
                                            <View style={ coloredMsgListItem }>
                                                <H3 style={ msgListItemTitle }>申请人</H3>
                                                <H3 style={ msgListItemValue }>{applyer}</H3>
                                            </View>
                                            <View style={ msgListItem }>
                                                <H3 style={ msgListItemTitle }>申请审批人</H3>
                                                <H3 style={ msgListItemValue }>{applyAduitor}</H3>
                                            </View>
                                            <View style={ coloredMsgListItem }>
                                                <H3 style={ msgListItemTitle }>复核人</H3>
                                                <H3 style={ msgListItemValue }>{checker}</H3>
                                            </View>
                                            <View style={ msgListItem }>
                                                <H3 style={ msgListItemTitle }>复核审批人</H3>
                                                <H3 style={ msgListItemValue }>{checkAduitor}</H3>
                                            </View>
                                            <View style={ coloredMsgListItem }>
                                                <H3 style={ msgListItemTitle }>单据状态</H3>
                                                <H3 style={ msgListItemValue }>{status && RECIPIENT_STATUS[parseInt(status, 10)].status}</H3>
                                            </View>
                                            <View style={ msgListItem }>
                                                <H3 style={ msgListItemTitle }>描述信息</H3>
                                                <H3 style={ msgListItemValue }>{remark}</H3>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )
                    }
                </View>
                <ProgressDialog
                    visible={ isFetching }
                    title="更新待办列表"
                    message="更新中，请稍后..."
                    dialogStyle={progressDialogStyle}
                >
                </ProgressDialog>
            </Content>
        </Container>;
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        testSelectedToDoList: state.testSelectedToDoList,
        findStoreCheck: state.findStoreCheck,
        findStoreCheckStoreRoom: state.findStoreCheckStoreRoom,
    };
}

export default connect(mapStateToProps, {
    selectListItem,
    fetchStoreCheck,
    fetchStoreCheckStoreRoom,
})(StoreCheckPage);
