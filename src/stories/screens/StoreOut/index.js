import * as React from "react";
import { connect } from "react-redux";
import { View, FlatList, StatusBar, TouchableOpacity, Image, BackHandler } from "react-native";
import { Container, Content, Text, H1, H3, Button, Icon, Header, Left, Right, Body, Title } from "native-base";
import _ from "lodash";
import PopupDialog, { DialogTitle } from "react-native-popup-dialog";
import { ProgressDialog } from "react-native-simple-dialogs";
import SearchForm from "../../../components/formComponents/kfgl_storeout/StoreOutSearchForm";
import renderIf from "../../../services/utils/renderIf";

import styles from "../../../styles/todoPages";
import { selectListItem } from "../../../actions/toDoListSelectAction";
import { fetchStoreOut } from "../../../actions/storeOut/findStoreOutAction";

export interface Props {
    navigation: any;
}

export interface State {
}

const PATHNAME = "DealWithStoreOut";

class StoreOutPage extends React.Component<Props, State> {

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
                    <Title>出库待办列表</Title>
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
        this.fetchFindStoreOut();
        BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
    }

    handleBackButton() {
        console.log("StoreOut handleBackButton");
        return true;
    }

    triggerDialog(value) {
        if (value) {
            this.popUpDialogForSearch.show();
        } else {
            this.popUpDialogForSearch.dismiss();
        }
    }

    fetchFindStoreOut() {
        const { userName } = this.props.user.authorization;
        this.props.fetchStoreOut({
            user: userName,
            operator: userName,
        });
    }

    _keyExtractor = (item, index) => `list-item-${index}`;

    render() {
        const {
            leftPaneStyle,
            leftPaneTitle,
            flatListItem,
            msgListItem,
            flatListItemTitle,
            flatListItemFontSize,
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
            emptyListPic,
            emptyListInfo,
            emptyListText,
            emptyBtnContainerStyle,
            emptyBtnStyle,
            emptyBtnText,
            popUpDialogContainer,
            popUpDialogTitle,
            popUpDialogTitleText,
            progressDialogStyle,
            msgListButton
        } = styles;

        const { applyDate, operator, applyer, applyAduitor, checker, checkAduitor, outType, status, remark, outNo } = this.props.testSelectedToDoList;
        const { isFetching } = this.props.findStoreOut;
        const outTypeString = ["一般出库", "施工出库"];
        const outStatusString = ["申请中", "申请待审批", "复核中", "复核待审批", "完成", "取消", "完成关闭", "取消关闭"];

        let userName = this.props.navigation.getParam("userName");
        let userPhone = this.props.navigation.getParam("userPhone");
        let paramsObj = {
            currentOperateType: "add",
            currentOutType: "1",
            currentApplier: userName,
            currentPhoneNum: userPhone,
            currentOperator: userName,
            currentStatus: "01", // 出库单状态
            currentStatusName: "申请中", // 出库单状态显示值
            headerTitle: "添加一般出库单",
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
                        height={0.75}
                        containerStyle={popUpDialogContainer}
                        dialogTitle={
                        <DialogTitle
                            title="出库单搜索"
                            hasTitleBar={false}
                            titleTextStyle={popUpDialogTitleText}
                            titleStyle={popUpDialogTitle}
                        />
                    }>
                        { <SearchForm popUpIns={this.popUpDialogForSearch} /> }
                    </PopupDialog>
                    {
                        renderIf(_.isEmpty(this.props.findStoreOut.list))(
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
                                        this.props.navigation.navigate(PATHNAME, tObj);
                                    }}>
                                        <Text style={emptyBtnText}>添加一般出库单</Text>
                                    </Button>
                                    <Button bordered dark style={[msgListButton, emptyBtnStyle]} onPress={() => {
                                        let tObj = _.cloneDeep(paramsObj);
                                        tObj.currentOutType = "2";
                                        tObj.headerTitle = "添加施工出库单";
                                        this.props.navigation.navigate(PATHNAME, tObj);
                                    }}>
                                        <Text style={emptyBtnText}>添加施工出库单</Text>
                                    </Button>
                                </View>
                            </View>
                        )
                    }
                    {
                        renderIf(!_.isEmpty(this.props.findStoreOut.list))(
                            <View  style={ mainPosition }>
                                <View style={ leftPaneStyle }>
                                    <View style={ leftPaneTitle }>
                                        <H1>出库单列表</H1>
                                    </View>
                                    <View style={ flatList }>
                                        <FlatList data={this.props.findStoreOut.list}
                                                  keyExtractor={this._keyExtractor}
                                                  extraData={ outNo }
                                                  renderItem={({ item }) => {
                                                      let b = outNo === item.outNo;
                                                      return (
                                                          <View>
                                                              <TouchableOpacity style={ [flatListItem, b && oBackgroundColor] } onPress={ () => {
                                                                  this.props.selectListItem(item);
                                                              } }>
                                                                  <View style={ flatListItemTitle }>
                                                                      <Text style={ [flatListItemFontSize, b && whiteFontColor] }>出库单号</Text>
                                                                  </View>
                                                                  <View style={ flatListItemValue }>
                                                                      <Text style={ [flatListItemFontSize, b && whiteFontColor] }>{item.outNo}</Text>
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
                                            <H1>出库单信息</H1>
                                            <View style={{ flexDirection: "row" }}>
                                                <Button info style={msgListButton} onPress={() => {
                                                    let tObj = _.cloneDeep(paramsObj);
                                                    this.props.navigation.navigate(PATHNAME, tObj);
                                                }}>
                                                    <Text>添加一般出库单</Text>
                                                </Button>
                                                <Button warning style={msgListButton} onPress={() => {
                                                    let tObj = _.cloneDeep(paramsObj);
                                                    tObj.currentOutType = "2";
                                                    tObj.headerTitle = "添加施工出库单";
                                                    this.props.navigation.navigate(PATHNAME, tObj);
                                                }}>
                                                    <Text>添加施工出库单</Text>
                                                </Button>
                                                <Button danger style={msgListButton}
                                                        onPress={() => {
                                                            const pageTypeBoolean = _.isEqual(outType, "1");
                                                            this.props.navigation.navigate(PATHNAME, {
                                                                headerTitle: pageTypeBoolean ? "一般出库单" : "施工出库单",
                                                                currentOutType: outType,
                                                                currentOutNo: outNo,
                                                                currentOperator: operator || "",
                                                                currentStatus: status,
                                                                currentOperateType: "update" // 保存表单用，新建为 add
                                                            });
                                                        }}><Text>处理出库单</Text>
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
                                                <H3 style={ msgListItemTitle }>类型</H3>
                                                <H3 style={ msgListItemValue }>{outTypeString[parseInt(outType, 10) - 1]}</H3>
                                            </View>
                                            <View style={ msgListItem }>
                                                <H3 style={ msgListItemTitle }>单据状态</H3>
                                                <H3 style={ msgListItemValue }>{outStatusString[parseInt(status, 10) - 1]}</H3>
                                            </View>
                                            <View style={ coloredMsgListItem }>
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
        findStoreOut: state.findStoreOut,
    };
}

export default connect(mapStateToProps, {
    selectListItem,
    fetchStoreOut,
})(StoreOutPage);
