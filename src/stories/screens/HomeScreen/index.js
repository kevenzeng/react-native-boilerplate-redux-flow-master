import * as React from "react";
import { StatusBar, Image, TouchableOpacity } from "react-native";
import PopupDialog, { ScaleAnimation, DialogTitle } from "react-native-popup-dialog";
import { Container, Header, Title, Content, Text, Body, Left, Right, View } from "native-base";
import renderIf from "../../../services/utils/renderIf";

import styles from "./styles";

export interface Props {
    navigation: any;
}

export interface State {
}

class HomePage extends React.Component<Props, State> {
    render() {
        const param = this.props.navigation.state.params;
        const {
            container,
            contentLayout,
            iconLayout,
            iconStyle,
            whiteText,
            popUpDialogItemsLayout,
            popUpDialogTitle,
            popUpDialogTitleText,
            popUpDialogStyle,
            itemLayout
        } = styles;

        const scaleAnimation = new ScaleAnimation({
            toValue: 0,
            useNativeDriver: true
        });

        const testing = false;

        return (
            <Container style={container}>
                <StatusBar hidden={true}/>
                <Header style={{backgroundColor: "white"}}>
                    <Left style={{ flex: 1 }}/>
                    <Body style={{ flex: 1, alignItems: "center" }}>
                    <Title style={{color: "#333"}}>{param ? param.name.item : "分类导航"}</Title>
                    </Body>
                    <Right style={{ flex: 1 }}/>
                </Header>
                <Content>
                    <View style={contentLayout}>

                            <View style={iconLayout}>
                                {/* <TouchableOpacity activeOpacity={1} onPress={() => {
                                    this._directPageTo("sggl_03", {
                                        userName: this.props.userName
                                    });
                                }}> */}
                                    <Image
                                        source={require("../../../../assets/mainPage/icon_desktop_3x.png")}
                                        style={iconStyle}
                                    />
                                    <Text style={{ alignSelf: "center" }}>机房巡检</Text>
                                {/* </TouchableOpacity> */}
                            </View>

                            <View style={iconLayout}>
                                <TouchableOpacity activeOpacity={1} onPress={() => {
                                    this._directPageTo("sggl_00", {
                                        userName: this.props.userName
                                    });
                                }}>
                                    <Image
                                        source={require("../../../../assets/mainPage/icon_hammer_3x.png")}
                                        style={iconStyle}
                                    />
                                    <Text style={{ alignSelf: "center" }}>施工管理</Text>
                                </TouchableOpacity>
                            </View>
                            
                            <View style={iconLayout}>
                                <TouchableOpacity activeOpacity={1} onPress={() => {
                                    this.storeRoomManagementPopupDialog.show();
                                }}>
                                    <Image
                                        source={require("../../../../assets/mainPage/icon_filing_3x.png")}
                                        style={iconStyle}
                                    />
                                </TouchableOpacity>

                                <Text>库房管理</Text>
                            </View>

                            {/* <View style={iconLayout}>
                                <Image
                                    source={require("../../../../assets/mainPage/icon_book_3x.png")}
                                    style={iconStyle}
                                />
                                <Text>报表管理</Text>
                            </View>

                            <View style={iconLayout}>
                                <Image
                                    source={require("../../../../assets/mainPage/icon_information_circle_outline_3x.png")}
                                    style={iconStyle}
                                />
                                <Text>故障处理</Text>
                            </View>

                            <View style={iconLayout}>
                                <Image
                                    source={require("../../../../assets/mainPage/icon_people_3x.png")}
                                    style={iconStyle}
                                />
                                <Text>值班管理</Text>
                            </View>

                            <View style={iconLayout}>
                                <Image
                                    source={require("../../../../assets/mainPage/icon_today_3x.png")}
                                    style={iconStyle}
                                />
                                <Text>设备清单</Text>
                            </View>

                            <View style={iconLayout}>
                                <Image
                                    source={require("../../../../assets/mainPage/icon_voting_management_3x.png")}
                                    style={iconStyle}
                                />
                                <Text>投票管理</Text>
                            </View>

                            <View style={iconLayout}>
                                <Image
                                    source={require("../../../../assets/mainPage/icon_exam_management_3x.png")}
                                    style={iconStyle}
                                />
                                <Text>考试管理</Text>
                            </View>
                        {
                            renderIf(testing)(
                                <View>
                                    <View style={iconLayout}>
                                        <TouchableOpacity activeOpacity={1} onPress={() => {
                                            this._directPageTo("sggl_04", {
                                                userName: this.props.userName
                                            });
                                        }}>
                                            <Image
                                                source={require("../../../../assets/mainPage/icon_desktop_3x.png")}
                                                style={iconStyle}
                                            />
                                            <Text style={{ alignSelf: "center" }}>测试用：施工前检查页</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={iconLayout}>
                                        <TouchableOpacity activeOpacity={1} onPress={() => {
                                            this._directPageTo("sggl_07", {
                                                userName: this.props.userName
                                            });
                                        }}>
                                            <Image
                                                source={require("../../../../assets/mainPage/icon_desktop_3x.png")}
                                                style={iconStyle}
                                            />
                                            <Text style={{ alignSelf: "center" }}>测试用：施工方案主页</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={iconLayout}>
                                        <TouchableOpacity activeOpacity={1} onPress={() => {
                                            this._directPageTo("sggl_08", {
                                                userName: this.props.userName
                                            });
                                        }}>
                                            <Image
                                                source={require("../../../../assets/mainPage/icon_desktop_3x.png")}
                                                style={iconStyle}
                                            />
                                            <Text style={{ alignSelf: "center" }}>测试用：查看步骤内容</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={iconLayout}>
                                        <TouchableOpacity activeOpacity={1} onPress={() => {
                                            this._directPageTo("sggl_09", {
                                                userName: this.props.userName
                                            });
                                        }}>
                                            <Image
                                                source={require("../../../../assets/mainPage/icon_desktop_3x.png")}
                                                style={iconStyle}
                                            />
                                            <Text style={{ alignSelf: "center" }}>测试用：施工结束前检查</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={iconLayout}>
                                        <TouchableOpacity activeOpacity={1} onPress={() => {
                                            this._directPageTo("sggl_12", {
                                                userName: this.props.userName
                                            });
                                        }}>
                                            <Image
                                                source={require("../../../../assets/mainPage/icon_desktop_3x.png")}
                                                style={iconStyle}
                                            />
                                            <Text style={{ alignSelf: "center" }}>测试用：手册说明</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={iconLayout}>
                                        <TouchableOpacity activeOpacity={1} onPress={() => {
                                            this._directPageTo("sggl_10", {
                                                userName: this.props.userName
                                            });
                                        }}>
                                            <Image
                                                source={require("../../../../assets/mainPage/icon_desktop_3x.png")}
                                                style={iconStyle}
                                            />
                                            <Text style={{ alignSelf: "center" }}>测试用：施工监理记录</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={iconLayout}>
                                        <TouchableOpacity activeOpacity={1} onPress={() => {
                                            this._directPageTo("sggl_15", {
                                                userName: this.props.userName
                                            });
                                        }}>
                                            <Image
                                                source={require("../../../../assets/mainPage/icon_desktop_3x.png")}
                                                style={iconStyle}
                                            />
                                            <Text style={{ alignSelf: "center" }}>测试用：施工安全监理</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        } */}
                        </View>
                </Content>
                <PopupDialog
                    dialogTitle={
                        <DialogTitle
                            title="库房管理"
                            hasTitleBar={false}
                            titleTextStyle={popUpDialogTitleText}
                            titleStyle={popUpDialogTitle}
                        />}
                    width={0.50}
                    height={0.6}
                    dialogAnimation={scaleAnimation}
                    dialogStyle={popUpDialogStyle}
                    ref={(popupDialog) => {
                        this.storeRoomManagementPopupDialog = popupDialog;
                    }}>
                    <View style={{ flex: 1 }}>
                        <View style={popUpDialogItemsLayout}>
                            <View style={[itemLayout]}>
                                <TouchableOpacity activeOpacity={0.5} onPress={() => {
                                    this._directPageTo("NewStoreIn");
                                }}>
                                    <Image
                                        source={require("../../../../assets/mainPage/icon_archive_3x.png")}
                                        style={iconStyle}
                                    />
                                </TouchableOpacity>
                                <Text style={whiteText}>入库管理</Text>
                            </View>

                            <View  style={itemLayout}>
                                <TouchableOpacity activeOpacity={0.5} onPress={() => {
                                    this._directPageTo("StoreOut");
                                }}>
                                    <Image
                                        source={require("../../../../assets/mainPage/icon_arrow_round_up_3x.png")}
                                        style={iconStyle}
                                    />
                                </TouchableOpacity>
                                <Text style={whiteText}>出库管理</Text>
                            </View>

                            <View  style={itemLayout}>
                                <TouchableOpacity activeOpacity={0.5} onPress={() => {
                                    this._directPageTo("kfgl_device");
                                }}>
                                    <Image
                                        source={require("../../../../assets/mainPage/icon_reserve_3x.png")}
                                        style={iconStyle}
                                    />
                                </TouchableOpacity>
                                <Text style={whiteText}>库存管理</Text>
                            </View>
                        </View>
                        <View style={popUpDialogItemsLayout}>
                            <View  style={itemLayout}>
                                <TouchableOpacity activeOpacity={0.5} onPress={() => {
                                    this._directPageTo("kfgl_storetrans");
                                }}>
                                    <Image
                                        source={require("../../../../assets/mainPage/icon_transfer_3x.png")}
                                        style={iconStyle}
                                    />
                                </TouchableOpacity>
                                <Text style={whiteText}>移库管理</Text>
                            </View>
                            <View  style={itemLayout}>
                                <TouchableOpacity activeOpacity={0.5} onPress={() => {
                                    this._directPageTo("kfgl_storecheck");
                                }}>
                                    <Image
                                        source={require("../../../../assets/mainPage/icon_inventory_3x.png")}
                                        style={iconStyle}
                                    />
                                </TouchableOpacity>
                                <Text style={whiteText}>盘点管理</Text>
                            </View>
                            <View style={[itemLayout, iconStyle]}>{}</View>
                        </View>
                    </View>
                </PopupDialog>
            </Container>

        );
    }
    _directPageTo(path, params) {
        this.props.navigation.navigate(path, params);
    }
}

export default HomePage;
