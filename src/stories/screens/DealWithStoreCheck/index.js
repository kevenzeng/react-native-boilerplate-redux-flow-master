import * as React from "react";
import { View, StatusBar, ScrollView, TouchableOpacity } from "react-native";
import { Container, Text, Button, Drawer } from "native-base";
import renderIf from "../../../services/utils/renderIf";
import screenUtil from "../../../boot/screenUtil";
import _ from "lodash";
import { STORE_CHECK_SCREEN } from "../../../boot/config";

import styles from "./styles";
const { px2dp } = screenUtil;

export interface Props {
    navigation: any;
    DealWithStoreCheckForm: any
}

export interface State {
}

class DealWithStoreCheckPage extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {};
    }

    _scroll;

    /**
     * 辨识身份
     * 控制是否只显示 "返回上级" 按钮
     * @returns {boolean|*}
     */
    currentUserReadOnlyControl() {
        const { userName } = this.props.currentUser;
        const { operator } = this.props.storeCheckInfo; // 既有单的逻辑
        return _.isEqual(userName, operator);
    }

    saveButtonControl() {
        const { status } = this.props.storeCheckInfo;
        if (this.isNewReceipt()) {
            return true;
        } else {
            return this.currentUserReadOnlyControl() &&
                _.includes([ "01", "03" ], status) &&
                !((_.isEqual(status, "01") && _.isEqual(this.props.currentOperateTypeFromPicker, "05"))); // 申请中关闭不显示
        }
    }

    submitBtnControl() {
        const { status } = this.props.storeCheckInfo;
        if (this.isNewReceipt()) {
            return true;
        } else {
            return this.currentUserReadOnlyControl() && !(_.includes([ "07", "08" ], status));
        }
    }

    //  盘点入库信息控制，状态 1，2 不显示
    deviceTypeControl() {
        const { status } = this.props.storeCheckInfo;
        return _.includes(["01", "02"], status);
    }

    delBtnControl() {
        return false;
/*        const { status } = this.props.storeCheckInfo;
        const { userPkfgl } = this.props.currentUser;
        return !this.isNewReceipt() && _.isEqual(status, "01") && (this.currentUserReadOnlyControl() || _.isEqual(userPkfgl, 3));*/
    }

    isNewReceipt() {
        return _.isEqual(this.props.navigation.getParam("currentOperateType"), "add");
    }

    closeDrawer = () => {
        this.drawer._root.close();
    };
    openDrawer = () => {
        this.drawer._root.open();
    };

    render() {
        const {
            leftPaneStyle,
            flatListItem,
            flatListTopGap,
            flatListItemFooter,
            msgListContainer,
            mainPosition,
            flatList,
            flatListBtn,
            flatListItemText,
            flatListItemWidth,
            footBtnContainer,
            footBtn,
            sideBar,
            sideBarButtonText,
        } = styles;

        return <Drawer
            ref={ref => {
                this.drawer = ref;
            }}
            onClose={() => this.closeDrawer()}
            openDrawerOffset={0.75}
            panCloseMask={0.75}
            content={
                <View style={flatList}>
                    <View style={[flatListItemFooter, flatListTopGap]}>{}</View>
                    <View style={flatListItem}>
                        <Button full transparent large style={flatListBtn}
                                onPress={() => {
                                    this._scroll.scrollTo({ y: 0 });
                                }}>
                            <Text style={ flatListItemText }>盘点申请信息</Text>
                        </Button>
                    </View>
                    <View style={flatListItemFooter}>{}</View>
                    <View style={flatListItem}>
                        <Button full transparent large style={flatListBtn}
                                onPress={() => {
                                    this._scroll.scrollTo({ y: px2dp(1030) });
                                }}>
                            <Text style={flatListItemText}>盘点货架</Text>
                        </Button>
                    </View>
                    {renderIf(!this.deviceTypeControl())(
                        <View style={flatListItemWidth}>
                            <View style={flatListItemFooter}>{}</View>
                            <View style={flatListItem}>
                                <Button full transparent large style={flatListBtn}
                                        onPress={() => {
                                            this._scroll.scrollTo({ y: px2dp(1200) });
                                        }}>
                                    <Text style={flatListItemText}>盘点入库备件明细</Text>
                                </Button>
                            </View>
                        </View>
                    )}
                    {renderIf(!this.isNewReceipt() && !_.isNull(this.props.storeCheckInfo.applyAduitStatus))(
                        <View style={flatListItemWidth}>
                            <View style={flatListItemFooter}>{}</View>
                            <View style={flatListItem}>
                                <Button full transparent large style={flatListBtn}
                                        onPress={() => {
                                            this._scroll.scrollTo({ y: px2dp(1605) });
                                        }}>
                                    <Text style={flatListItemText}>盘点申请审批信息</Text>
                                </Button>
                            </View>
                        </View>
                    )}
                    {renderIf(!this.isNewReceipt() && !_.isNull(this.props.storeCheckInfo.checkStatus))(
                        <View style={flatListItemWidth}>
                            <View style={flatListItemFooter}>{}</View>
                            <View style={flatListItem}>
                                <Button full transparent large style={flatListBtn}
                                        onPress={() => {
                                            this._scroll.scrollTo({ y: px2dp(2010) });
                                        }}>
                                    <Text style={flatListItemText}>盘点复核信息</Text>
                                </Button>
                            </View>
                        </View>
                    )}
                    {renderIf(!this.isNewReceipt() && !_.isNull(this.props.storeCheckInfo.checkAduitStatus))(
                        <View style={flatListItemWidth}>
                            <View style={flatListItemFooter}>{}</View>
                            <View style={flatListItem}>
                                <Button full transparent large style={flatListBtn}
                                        onPress={() => {
                                            this._scroll.scrollTo({ y: px2dp(2410) });
                                        }}>
                                    <Text style={flatListItemText}>盘点复核审批信息</Text>
                                </Button>
                            </View>
                        </View>
                    )}
                    {renderIf(this.isNewReceipt() || this.currentUserReadOnlyControl())(
                        <View style={flatListItemWidth}>
                            <View style={flatListItemFooter}>{}</View>
                            <View style={flatListItem}>
                                <Button full transparent large style={flatListBtn}
                                        onPress={() => {
                                            this._scroll.scrollToEnd();
                                            console.log("提交测试");
                                            console.log("currentOperateType", this.props.currentOperateTypeFromPicker);
                                            console.log("currentNextOperator", this.props.currentNextOperator);
                                        }}>
                                    <Text style={flatListItemText}>操作信息</Text>
                                </Button>
                            </View>
                        </View>
                    )}
                </View>
            }
        >
            <Container style={styles.container}>
                <StatusBar hidden={true}/>
                <View style={mainPosition}>
                    <View style={leftPaneStyle}>
                        <View>
                            <TouchableOpacity transparent style={sideBar}
                                              onPress={() => {
                                                  this.openDrawer();
                                              }}>
                                <Text style={sideBarButtonText}>》</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={msgListContainer}>
                        <View style={{ flex: 6 }}>
                            <ScrollView ref={(scroll) => this._scroll = scroll}>
                                {this.props.DealWithStoreCheckForm}
                            </ScrollView>
                        </View>
                        <View style={footBtnContainer}>
                            {renderIf(this.submitBtnControl())(
                                <View style={footBtn}>
                                    <Button full danger
                                            onPress={() => this.props.onSubmit()}
                                    >
                                        <Text>提 交</Text>
                                    </Button>
                                </View>
                            )
                            }
                            {renderIf(this.saveButtonControl())(
                                <View style={footBtn}>
                                    <Button full success
                                            onPress={() => this.props.onSave()}
                                    ><Text>保 存</Text></Button>
                                </View>
                            )
                            }
                            {renderIf(this.delBtnControl())(
                                <View style={footBtn}>
                                    <Button full warning onPress={() => this.props.onDelete()}><Text>删 除</Text></Button>
                                </View>
                            )
                            }
                            <View style={footBtn}>
                                <Button full info
                                        onPress={() => this.props.navigation.navigate(STORE_CHECK_SCREEN)}><Text>返回盘点管理</Text></Button>
                            </View>
                        </View>
                    </View>
                </View>
            </Container>
        </Drawer>;
    }
}

export default DealWithStoreCheckPage;
