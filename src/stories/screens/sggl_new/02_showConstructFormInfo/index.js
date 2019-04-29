import * as React from "react";
import { View, StatusBar, ScrollView, TouchableOpacity } from "react-native";
import { Container, Text, Button, Drawer, Header, Left, Icon, Body, Title, Right, H1, H3 } from "native-base";
import PopupDialog from "react-native-popup-dialog";
import screenUtil from "../../../../boot/screenUtil";
import renderIf from "../../../../services/utils/renderIf";
import { isEmpty } from "lodash";

const {
    arrowBackFontSize,
    progressDialogStyle,
    theHeight,
} = cStyles;
import todoStyles from "../../../../styles/todoPages";
import styles from "./styles";
import cStyles from "../../../../styles/dealWithPages";
import ProgressDialog from "react-native-simple-dialogs/src/ProgressDialog";

const { height } = screenUtil;

export interface Props {
    navigation: any;
}

export interface State {
}

const {
    msgListItem,
    msgListItemTitle,
    msgListItemValue,
    msgListTitleContainer,
    msgListPane,
    popUpDialogOverBtn,
} = todoStyles;

const {
    leftPaneStyle,
    flatListItem,
    flatListTopGap,
    flatListItemFooter,
    msgListContainer,
    mainPosition,
    flatList, flatListBtn, flatListItemText, flatListItemWidth,
    footBtnContainer, footBtn,
    sideBar, sideBarButtonText,
    sectionDivider,
    titleDivider,
    contentContainer,
    dialogStyle,
    paddingBottom20,
    sgObjContainer, sgObjItemContainer, sgObjBtn,
    coloredMsgListItem,
    dialogListTitle, dialogValue,
} = styles;

class ShowConstructFormInfoPage extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            sgObjIndex: 0
        };
    }

    _scroll;

    closeDrawer = () => {
        this.drawer._root.close();
    };
    openDrawer = () => {
        this.drawer._root.open();
    };

    render() {
        const { navigation, constructFormInfo, user } = this.props;
        const { userName } = user.authorization;
        const { isFetching, responses }  = constructFormInfo;
        const { displayCode, readOnlyFlag, recStatus, sgdData = [{}, ], sgobjData = [{}, ], sgauditData = [{}, ], sgscData = [] } = responses;
        const { sggl_tag, sr_id, sggl_appl, sggl_operator, sggl_unit, sggl_doinfo, sggl_site, sggl_tools, sggl_date, sggl_type, sg_plan_bgtime, sg_plan_endtime } = sgdData[0];
        const { sd_dev_sn, sd_room, sd_rack, sd_manu, sd_model, sd_appl } = !isEmpty(sgobjData) && sgobjData[this.state.sgObjIndex];  // 不定项
        const { sg_cm_no, sg_daily_no, sg_cm_status, sg_group_no, sg_group_status, sg_pb, sg_duty } = sgauditData[0];
        const { sc_tag, sc_name } = sgscData;  // 不定项
        const commonRequestBody = {
            displayCode,
            readOnlyFlag,
            recStatus,
            currentSgglTag: sggl_tag,
        };
        return <Drawer
            ref={ref => {
                this.drawer = ref;
            }}
            onClose={() => this.closeDrawer()}
            openDrawerOffset={0.75}
            panCloseMask={0.75}
            content={
                <View style={flatList}>
                    <View style={[ flatListItemFooter, flatListTopGap ]}>{}</View>
                    <View style={flatListItem}>
                        <Button full transparent large style={flatListBtn}
                                onPress={() => {
                                    this._scroll.scrollTo({ y: 0 });
                                }}>
                            <Text style={flatListItemText}>施工单基本信息</Text>
                        </Button>
                    </View>
                    { renderIf(!isEmpty(sgobjData))(
                        <View style={{ alignItems: "center" }}>
                            <View style={flatListItemFooter}>{}</View>
                            <View style={flatListItem}>
                                <Button full transparent large style={flatListBtn}
                                        onPress={() => {
                                            this._scroll.scrollTo({ y: height * 2 - 550 });
                                        }}>
                                    <Text style={flatListItemText}>施工对象信息</Text>
                                </Button>
                            </View>
                        </View>
                    ) }
                    <View style={flatListItemWidth}>
                        <View style={flatListItemFooter}>{}</View>
                        <View style={flatListItem}>
                            <Button full transparent large style={flatListBtn}
                                    onPress={() => {
                                        this._scroll.scrollToEnd();
                                    }}>
                                <Text style={flatListItemText}>施工单审核情况</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            }
        >
            <Container style={styles.container}>
                <StatusBar hidden={true}/>
                <Header hasSegment>
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => navigation.goBack()}>
                            <Icon name="ios-arrow-back" style={arrowBackFontSize}/>
                        </Button>
                    </Left>

                    <Body style={{ flex: 1, alignItems:"center" }}>
                        <Title>施工单信息</Title>
                    </Body>

                    <Right style={{ flex: 1 }}><Text style={{ color: "white" }}>当前用户：{userName && userName}</Text></Right>
                </Header>
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
                        <View style={[{ flex: 1 }]}>
                            <View style={{ flex: 6 }}>
                                <ScrollView ref={(scroll) => this._scroll = scroll}>
                                    {
                                        <View>
                                            <View style={[msgListPane, contentContainer]}>
                                                <View style={[msgListTitleContainer]}>
                                                    <H1>施工单基本信息</H1>
                                                </View>
                                                <View style={titleDivider}>{}</View>
                                                <View>
                                                    <View style={coloredMsgListItem}>
                                                        <H3 style={msgListItemTitle}>施工单号</H3>
                                                        <H3 style={msgListItemValue}>{sggl_tag}</H3>
                                                    </View>
                                                    <View style={msgListItem}>
                                                        <H3 style={msgListItemTitle}>作业申请人</H3>
                                                        <H3 style={msgListItemValue}>{sggl_appl}</H3>
                                                    </View>
                                                    <View style={coloredMsgListItem}>
                                                        <H3 style={msgListItemTitle}>施工人员名单</H3>
                                                        <H3 style={msgListItemValue}>{sggl_operator}</H3>
                                                    </View>
                                                    <View style={msgListItem}>
                                                        <H3 style={msgListItemTitle}>作业人单位</H3>
                                                        <H3 style={msgListItemValue}>{sggl_unit}</H3>
                                                    </View>
                                                    <View style={coloredMsgListItem}>
                                                        <H3 style={msgListItemTitle}>作业内容</H3>
                                                        <H3 style={msgListItemValue}>{sggl_doinfo}</H3>
                                                    </View>
                                                    <View style={msgListItem}>
                                                        <H3 style={msgListItemTitle}>作业区域</H3>
                                                        <H3 style={msgListItemValue}>{sggl_site}</H3>
                                                    </View>
                                                    <View style={coloredMsgListItem}>
                                                        <H3 style={msgListItemTitle}>携带工具</H3>
                                                        <H3 style={msgListItemValue}>{sggl_tools}</H3>
                                                    </View>
                                                    <View style={msgListItem}>
                                                        <H3 style={msgListItemTitle}>申请日期</H3>
                                                        <H3 style={msgListItemValue}>{sggl_date}</H3>
                                                    </View>
                                                    <View style={coloredMsgListItem}>
                                                        <H3 style={msgListItemTitle}>作业类型</H3>
                                                        <H3 style={msgListItemValue}>{sggl_type}</H3>
                                                    </View>
                                                    <View style={msgListItem}>
                                                        <H3 style={msgListItemTitle}>计划施工开始时间</H3>
                                                        <H3 style={msgListItemValue}>{sg_plan_bgtime}</H3>
                                                    </View>
                                                    <View style={coloredMsgListItem}>
                                                        <H3 style={msgListItemTitle}>计划施工结束时间</H3>
                                                        <H3 style={msgListItemValue}>{sg_plan_endtime}</H3>
                                                    </View>
                                                </View>
                                            </View>
                                            {renderIf(!isEmpty(sgobjData))(
                                                <View>
                                                    <View style={sectionDivider}>{}</View>
                                                    <View style={[msgListPane, contentContainer, paddingBottom20]}>
                                                        <View style={[msgListTitleContainer]}>
                                                            <H1>施工对象信息</H1>
                                                        </View>
                                                        <View style={titleDivider}>{}</View>
                                                        <View style={sgObjContainer}>
                                                            {
                                                                sgobjData.map((value, index) => {
                                                                    return <View key={`obj_${index}`} style={sgObjItemContainer}>
                                                                        <TouchableOpacity style={sgObjBtn} onPress={() => {
                                                                            this.setState({
                                                                                sgObjIndex : index
                                                                            });
                                                                            this.sgObjInfoDialog.show();
                                                                        }}>
                                                                            <Text>施工对象{index}</Text>
                                                                        </TouchableOpacity>
                                                                        <Text>{value.sd_dev_sn}</Text>
                                                                    </View>;
                                                                })
                                                            }
                                                        </View>
                                                    </View>
                                                </View>
                                            )}
                                            <View style={sectionDivider}>{}</View>
                                            <View style={[msgListPane, contentContainer]}>
                                                <View style={[msgListTitleContainer]}>
                                                    <H1>施工单审核情况</H1>
                                                </View>
                                                <View style={titleDivider}>{}</View>
                                                <View style={coloredMsgListItem}>
                                                    <H3 style={msgListItemTitle}>变更工单</H3>
                                                    <H3 style={msgListItemValue}>{sg_cm_no}</H3>
                                                </View>
                                                <View style={msgListItem}>
                                                    <H3 style={msgListItemTitle}>日常运维工单</H3>
                                                    <H3 style={msgListItemValue}>{sg_daily_no}</H3>
                                                </View>
                                                <View style={coloredMsgListItem}>
                                                    <H3 style={msgListItemTitle}>运维系统工单是否审核通过</H3>
                                                    <H3 style={msgListItemValue}>{sg_cm_status}</H3>
                                                </View>
                                                <View style={msgListItem}>
                                                    <H3 style={msgListItemTitle}>集团南中心运行管理平台工单编号</H3>
                                                    <H3 style={msgListItemValue}>{sg_group_no}</H3>
                                                </View>
                                                <View style={coloredMsgListItem}>
                                                    <H3 style={msgListItemTitle}>集团南中心审核是否通过</H3>
                                                    <H3 style={msgListItemValue}>{sg_group_status}</H3>
                                                </View>
                                                <View style={msgListItem}>
                                                    <H3 style={msgListItemTitle}>屏蔽告警情况</H3>
                                                    <H3 style={msgListItemValue}>{sg_pb}</H3>
                                                </View>
                                                <View style={coloredMsgListItem}>
                                                    <H3 style={msgListItemTitle}>跟进值班</H3>
                                                    <H3 style={msgListItemValue}>{sg_duty}</H3>
                                                </View>
                                                <View style={msgListItem}>
                                                    <H3 style={msgListItemTitle}>标准化施工文档</H3>
                                                    <H3 style={msgListItemValue}>
                                                        {
                                                            sgscData.map((val) => {
                                                              return   `${val.sc_name}\n`;
                                                            })
                                                        }
                                                    </H3>
                                                </View>
                                            </View>
                                        </View>
                                    }
                                </ScrollView>
                            </View>
                            <View style={footBtnContainer}>
                                <View style={footBtn}>
                                    <Button full info
                                            onPress={() => {
                                                if (recStatus === 2) {
                                                    this.props.navigation.navigate("sggl_03", {
                                                        ...commonRequestBody,
                                                        sr_id,
                                                    });
                                                } else {
                                                    this.props.navigation.navigate("sggl_03", commonRequestBody);
                                                }
                                            }}>
                                        <Text>{["监  理", "继续监理", "查  看"][recStatus]}</Text>
                                    </Button>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <ProgressDialog
                    visible={isFetching}
                    title="更新施工单"
                    message="更新中，请稍后..."
                    dialogStyle={progressDialogStyle}
                    overlayStyle={theHeight}
                />
                <PopupDialog
                    ref={(popupDialog) => {
                        this.sgObjInfoDialog = popupDialog;
                    }}
                    overlayOpacity={0.5}
                    containerStyle={popUpDialogOverBtn}
                    width={0.5}
                    height={0.5}
                    onShown={() => {
                    }}
                >
                    <View style={dialogStyle}>
                        <View style={msgListItem}>
                            <View style={dialogListTitle}>
                                <H3>设备序列号</H3>
                            </View>
                            <H3 style={dialogValue}>{sd_dev_sn}</H3>
                        </View>
                        <View style={msgListItem}>
                            <View style={dialogListTitle}>
                                <H3>机            房</H3>
                            </View>
                            <H3 style={dialogValue}>{sd_room}</H3>
                        </View>
                        <View style={msgListItem}>
                            <View style={dialogListTitle}>
                                <H3>机            柜</H3>
                            </View>
                            <H3 style={dialogValue}>{sd_rack}</H3>
                        </View>
                        <View style={msgListItem}>
                            <View style={dialogListTitle}>
                                <H3>品            牌</H3>
                            </View>
                            <H3 style={dialogValue}>{sd_manu}</H3>
                        </View>
                        <View style={msgListItem}>
                            <View style={dialogListTitle}>
                                <H3>型            号</H3>
                            </View>
                            <H3 style={dialogValue}>{sd_model}</H3>
                        </View>
                        <View style={msgListItem}>
                            <View style={dialogListTitle}>
                                <H3>应            用</H3>
                            </View>
                            <H3 style={dialogValue}>{sd_appl}</H3>
                        </View>
                    </View>
                </PopupDialog>
            </Container>
        </Drawer>;
    }
}

export default ShowConstructFormInfoPage;
