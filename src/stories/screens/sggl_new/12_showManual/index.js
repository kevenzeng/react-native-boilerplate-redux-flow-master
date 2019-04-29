import * as React from "react";
import { AsyncStorage, ScrollView, StatusBar, TouchableOpacity, View, Image } from "react-native";
import { Body, Button, Container, H3, Header, Icon, Left, Right, Text, Title } from "native-base";
import ProgressDialog from "react-native-simple-dialogs/src/ProgressDialog";
import ImageViewer from "react-native-image-zoom-viewer";
import Modal from "react-native-modalbox";
import { isEmpty } from "lodash";
import styles from "./styles";
import cStyles from "../../../../styles/dealWithPages";
import commonStyles from "../../../../styles/commonStyles";
import { DOMAIN_ROOT, SCGL_PICS } from "../../../../boot/config";

// styles
const { progressDialogStyle, theHeight } = cStyles;
const { sideBarBtn, disableOpacity } = commonStyles;

const {
    mainPosition,
    container,
    btnSideBarContainer, sideBarBtnContainer,
    colorWhite, iconStyle, iconTextStyle,
    contentContainer,
    contentStyle,
    rightSideBar,
    footerContainer, footerContent, footerBtnContainer, footerBtnStyle,
    indexBarStyle, sectionGap,
    inContentStyle,
    contentTitle,
    iconLineContainer, peoIconMainStyle, peoPic, photoMain
} = styles;


export interface Props {
    navigation: any;
}

export interface State {
    serverIp: String;
    picIndex: Number;
    modalVisible: Boolean;
}

class ToCheckAfterConstructScreen extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            serverIp: "",
            picIndex: 0,
            modalVisible: false,
        };
        this.asyncGetServerAddress();
    }

    // 取得客制化服务器地址
    asyncGetServerAddress = async() => {
      try {
          await AsyncStorage.getItem("serverIp")
              .then(serverIp => {
                  this.setState({ serverIp : serverIp });
              });
      } catch (e) {
          console.log("Error retrieving data: ", e);
      }
    };

    render() {
        const { navigation, showedManual, user } = this.props;
        const { userName } = user.authorization;
        const { isFetching, responses }  = showedManual;
        const { sc_owner, sc_introduction, sc_Introduction_pic } = responses && responses;
        let prefix = !isEmpty(this.state.serverIp) ? this.state.serverIp + SCGL_PICS : DOMAIN_ROOT + SCGL_PICS;
        const images = sc_Introduction_pic && sc_Introduction_pic.map(data => {
           return {
               url: "http://" + prefix + data,
               freeHeight: true
           };
        });

        return <Container style={container}>
            <StatusBar hidden={true}/>
            <Header hasSegment>
                <Left style={{ flex: 1 }}>
                    {/*<Button transparent onPress={() => navigation.goBack()}>*/}
                        {/*<Icon name="ios-arrow-back" style={arrowBackFontSize}/>*/}
                    {/*</Button>*/}
                </Left>

                <Body style={{ flex: 1, alignItems:"center" }}>
                <Title>手册说明</Title>
                </Body>

                <Right style={{ flex: 1 }}><Text style={{ color: "white" }}>当前用户：{userName && userName}</Text></Right>
            </Header>
            <View style={[mainPosition]}>
                <View style={btnSideBarContainer}>
                    {/*在手册页显示侧边栏按钮，不提供功能*/}
                    <View style={sideBarBtnContainer}>
                        <TouchableOpacity style={[sideBarBtn, disableOpacity]} onPress={() => {}} disabled>
                            <Icon style={[colorWhite, iconStyle]} name="close-circle" />
                            <Text style={[colorWhite, iconTextStyle]}>异常结束</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={sideBarBtnContainer}>
                        <TouchableOpacity style={[sideBarBtn, disableOpacity]} disabled>
                            <Icon style={[colorWhite, iconStyle]} name="exit" />
                            <Text style={[colorWhite, iconTextStyle]}>退出施工</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={contentContainer}>
                    <View style={contentStyle}>
                        <View style={[inContentStyle]}>
                            <ScrollView>
                                <View style={[contentTitle]}>
                                    <View style={indexBarStyle}>{}</View>
                                    <View><H3>适用对象</H3></View>
                                </View>
                                <Text>{sc_owner}</Text>
                                <View style={sectionGap}>{}</View>
                                <View style={[contentTitle]}>
                                    <View style={indexBarStyle}>{}</View>
                                    <View><H3>设备（组件）概述</H3></View>
                                </View>
                                <Text>{sc_introduction}</Text>
                                <View style={sectionGap}>{}</View>
                                <View style={[contentTitle]}>
                                    <View style={indexBarStyle}>{}</View>
                                    <View><H3>设备（组件）示意图</H3></View>
                                </View>
                                <View style={[iconLineContainer]}>
                                    {
                                        images && images.map( (data, index) => {
                                            return <View key={`pic_${index}`}>
                                                <TouchableOpacity onPress={() => {
                                                    this.setState({ picIndex: index, modalVisible: true });
                                                }} style={[peoIconMainStyle, peoPic, photoMain]}>
                                                    <Image source={{ uri: data.url, width: "100%", height: "100%" }} />
                                                </TouchableOpacity>
                                            </View>;
                                        })
                                    }
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </View>
                <View style={rightSideBar}>{}</View>
            </View>
            <View style={footerContainer}>
                <View style={footerContent}>
                    <View style={footerBtnContainer}>
                        <Button bordered style={footerBtnStyle} onPress={() => navigation.goBack()}>
                            <Text style={colorWhite}>返      回</Text>
                        </Button>
                    </View>
                </View>
            </View>
            <Modal style={{ width: "100%", height: "100%" }} isOpen={this.state.modalVisible} transparent={true} onRequestClose={() => this.setState({ modalVisible: false })}>
                <ImageViewer imageUrls={images} index={this.state.picIndex} enableSwipeDown={true} onSwipeDown={() =>{ this.setState({modalVisible: false}); }} />
            </Modal>
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

export default ToCheckAfterConstructScreen;
