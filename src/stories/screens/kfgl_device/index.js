import * as React from "react";
import { connect } from "react-redux";
import { View, ScrollView, FlatList, StatusBar, TouchableOpacity, Image, BackHandler } from "react-native";
import { Container, Content, Text, H1, H3, Button, Icon, Header, Left, Right, Body, Title } from "native-base";
import _ from "lodash";
import PopupDialog, { DialogTitle } from "react-native-popup-dialog";
import { ProgressDialog } from "react-native-simple-dialogs";
import SearchForm from "../../../components/formComponents/kfgl_device/DeviceSearchForm";
import renderIf from "../../../services/utils/renderIf";

import styles from "../../../styles/todoPages";
import {
    DEVICETYPETOSTR,
    STORE_STATUS,
    DEAL_WITH_DEVICE_SCREEN,
    QR_SCANNER_SCREEN,
    DEVICE_SCREEN
} from "../../../boot/config";
import { selectListItem } from "../../../actions/toDoListSelectAction";
import { fetchDevice } from "../../../actions/kfgl_device/findDeviceAction";

export interface Props {
    navigation: any;
}

export interface State {
}

class KFGLDevicePage extends React.Component<Props, State> {

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
                    <Title>备件汇总列表</Title>
                </Body>

                <Right style={ styles.iconPosition }>
                    <Button transparent style={[ styles.icon_scanner_position ]} onPress={ () => navigation.navigate(QR_SCANNER_SCREEN, { routeName: DEVICE_SCREEN }) }>
                        <Icon name="md-qr-scanner" style={styles.icon}/>
                    </Button>
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
        this.fetchDeviceRequest();
        BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
    }

    handleBackButton() {
        console.log("Device handleBackButton");
        return true;
    }

    triggerDialog(value) {
        if (value) {
            this.popUpDialogForSearch.show();
        } else {
            this.popUpDialogForSearch.dismiss();
        }
    }

    fetchDeviceRequest() {
        const { userName } = this.props.user.authorization;
        this.props.fetchDevice({
            user: userName,
            status: "2"
        });
    }

    _keyExtractor = (item, index) => `list-item-${index}`;

    render() {
        const {
            leftPaneStyle,
            leftPaneTitle,
            flatListItem,
            flatListItemFontSize,
            popUpDialogContainer,
            popUpDialogTitle,
            popUpDialogTitleText,
            msgListItem,
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
            emptyListPic,
            emptyListText,
            emptyListInfo,
            progressDialogStyle,
            msgListButton
        } = styles;

        const { summaryNo, deviceName, summaryNum, unitName, roomName, sheetName, deviceType, brandName, belongUnit, usability, inDate, expireDate, lastCheckDate, status, remark, inNo } = this.props.testSelectedToDoList;
        const { isFetching } = this.props.deviceFindDevice;

        return <Container style={styles.container}>
            <StatusBar hidden={true} />
            <Content>
                <View>
                    {
                        renderIf(_.isEmpty(this.props.deviceFindDevice.list))(
                            <View style={emptyListInfo}>
                                <Image
                                    source={require("../../../../assets/loading/icon_list_empty_3x.png")}
                                    style={emptyListPic}
                                />
                                <Text style={emptyListText}>还没有相关的列表呢</Text>
                            </View>
                        )
                    }
                    {
                        renderIf(!_.isEmpty(this.props.deviceFindDevice.list))(
                            <View  style={ mainPosition }>
                                <View style={ leftPaneStyle }>
                                    <View style={ leftPaneTitle }>
                                        <H1>备件汇总列表</H1>
                                    </View>
                                    <View style={ flatList }>
                                        <FlatList data={this.props.deviceFindDevice.list}
                                                  keyExtractor={this._keyExtractor}
                                                  extraData={ summaryNo }
                                                  renderItem={({ item }) => {
                                                      let b = summaryNo === item.summaryNo;
                                                      return (
                                                          <View>
                                                              <TouchableOpacity style={ [flatListItem, b && oBackgroundColor] } onPress={ () => {
                                                                  this.props.selectListItem(item);
                                                              } }>
                                                                  <View style={ flatListItemTitle }>
                                                                      <Text style={ [flatListItemFontSize, b && whiteFontColor] }>备件汇总号</Text>
                                                                  </View>
                                                                  <View style={ flatListItemValue }>
                                                                      <Text style={ [flatListItemFontSize, b && whiteFontColor] }>{item.summaryNo}</Text>
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
                                    <ScrollView>
                                        <View style={ msgListPane }>
                                            <View style={ msgListTitleContainer }>
                                                <H1>库存明细</H1>
                                                <View style={{ flexDirection: "row" }}>
                                                    <Button danger style={msgListButton}
                                                            onPress={() => {
                                                                console.log("currentSummaryNo", summaryNo);
                                                                this.props.navigation.navigate(DEAL_WITH_DEVICE_SCREEN, {
                                                                    headerTitle: "库存信息",
                                                                    currentSummaryNo: summaryNo,
                                                                    currentStatus: status,
                                                                });
                                                            }}><Text>查看库存信息</Text>
                                                    </Button>
                                                </View>
                                            </View>
                                            <View>
                                                <View style={ coloredMsgListItem }>
                                                    <H3 style={ msgListItemTitle }>备件名称</H3>
                                                    <H3 style={ msgListItemValue }>{deviceName}</H3>
                                                </View>
                                                <View style={ msgListItem }>
                                                    <H3 style={ msgListItemTitle }>库存数量</H3>
                                                    <H3 style={ msgListItemValue }>{summaryNum}</H3>
                                                </View>
                                                <View style={ coloredMsgListItem }>
                                                    <H3 style={ msgListItemTitle }>单    位</H3>
                                                    <H3 style={ msgListItemValue }>{unitName}</H3>
                                                </View>
                                                <View style={ msgListItem }>
                                                    <H3 style={ msgListItemTitle }>库    房</H3>
                                                    <H3 style={ msgListItemValue }>{roomName}</H3>
                                                </View>
                                                <View style={ coloredMsgListItem }>
                                                    <H3 style={ msgListItemTitle }>货架名称</H3>
                                                    <H3 style={ msgListItemValue }>{sheetName}</H3>
                                                </View>
                                                <View style={ msgListItem }>
                                                    <H3 style={ msgListItemTitle }>备件类型</H3>
                                                    <H3 style={ msgListItemValue }>{DEVICETYPETOSTR[parseInt(deviceType, 10)]}</H3>
                                                </View>
                                                <View style={ coloredMsgListItem }>
                                                    <H3 style={ msgListItemTitle }>厂    商</H3>
                                                    <H3 style={ msgListItemValue }>{brandName}</H3>
                                                </View>
                                                <View style={ msgListItem }>
                                                    <H3 style={ msgListItemTitle }>初次入库日期</H3>
                                                    <H3 style={ msgListItemValue }>{inDate}</H3>
                                                </View>
                                                <View style={ coloredMsgListItem }>
                                                    <H3 style={ msgListItemTitle }>状    态</H3>
                                                    <H3 style={ msgListItemValue }>{STORE_STATUS[status] && STORE_STATUS[status].status}</H3>
                                                </View>
                                                <View style={ msgListItem }>
                                                    <H3 style={ msgListItemTitle }>初次入库单号</H3>
                                                    <H3 style={ msgListItemValue }>{inNo}</H3>
                                                </View>
                                                <View style={ coloredMsgListItem }>
                                                    <H3 style={ msgListItemTitle }>归属单位</H3>
                                                    <H3 style={ msgListItemValue }>{belongUnit}</H3>
                                                </View>
                                                <View style={ msgListItem }>
                                                    <H3 style={ msgListItemTitle }>可用性</H3>
                                                    <H3 style={ msgListItemValue }>{usability}</H3>
                                                </View>
                                                <View style={ coloredMsgListItem }>
                                                    <H3 style={ msgListItemTitle }>过期日期</H3>
                                                    <H3 style={ msgListItemValue }>{expireDate}</H3>
                                                </View>
                                                <View style={ msgListItem }>
                                                    <H3 style={ msgListItemTitle }>最近盘点日期</H3>
                                                    <H3 style={ msgListItemValue }>{lastCheckDate}</H3>
                                                </View>
                                                <View style={ coloredMsgListItem }>
                                                    <H3 style={ msgListItemTitle }>备注</H3>
                                                    <H3 style={ msgListItemValue }>{remark}</H3>
                                                </View>
                                            </View>
                                        </View>
                                    </ScrollView>
                                </View>
                            </View>
                        )
                    }
                </View>
                <PopupDialog
                    ref={ (popUpDialog) => this.popUpDialogForSearch = popUpDialog }
                    onDismissed={() => {
                        this.setState({
                            dialogVisible: false
                        });
                    }}
                    width={0.7}
                    height={0.78}
                    containerStyle={popUpDialogContainer}
                    dialogTitle={
                        <DialogTitle
                            title="备件汇总列表搜索"
                            hasTitleBar={false}
                            titleTextStyle={popUpDialogTitleText}
                            titleStyle={popUpDialogTitle}
                        />
                    }>
                    { <SearchForm popUpIns={this.popUpDialogForSearch} /> }
                </PopupDialog>
                <ProgressDialog
                    visible={ isFetching }
                    title="更新备件列表"
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
        deviceFindDevice: state.deviceFindDevice,
    };
}

export default connect(mapStateToProps, {
    selectListItem,
    fetchDevice,
})(KFGLDevicePage);
