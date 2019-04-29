import * as React from "react";
import { View, StatusBar, ScrollView, Image, TouchableOpacity } from "react-native";
import {
    Container,
    Button,
    Text, Left, Icon, Body, Right, Header, Title,
} from "native-base";
import { Row, Cell, TableWrapper, Table } from "react-native-table-component";
import ProgressDialog from "react-native-simple-dialogs/src/ProgressDialog";
import renderIf from "../../../../services/utils/renderIf";
import styles from "./styles";
import cStyles from "../../../../styles/dealWithPages";
import emptyPageStyle from "../../../../styles/todoPages";
import { isEmpty } from "lodash";
import ImageViewer from "react-native-image-zoom-viewer";
import Modal from "react-native-modalbox";
import formUrlEncoded from "form-urlencoded";

const {
    arrowBackFontSize,
    progressDialogStyle,
    theHeight,
} = cStyles;

const {
    emptyListText,
    emptyListPic,
    emptyListInfo,
} = emptyPageStyle;

const {
    contentStyle, tableHeight, rowTextStyle, tableBottomLine,
    footBtnContainer, footBtnContent, footBtn,
    iconLineContainer, peoIconMainStyle, peoPic
} = styles;

export interface Props {
    navigation: any;
}

export interface State {
}

class ConstructRecordScreen extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            avatarSource: [], // 照片阵列
            modalVisible: false,
            picIndex: 0,
        };
    }

    render() {
        const { navigation, fetchedSupervisionRecordList, user, serverIp } = this.props;
        const { userName } = user.authorization;
        const { currentServerIp } = serverIp;
        const { isFetching, responses }  = fetchedSupervisionRecordList;
        const { recordData, sr_id, sg_tag } = responses && responses;

        const tableHeader = [ "执行顺序", "手册编号", "手册名称", "步骤名称", "输出结果", "关键步骤", "备注", "图片" ];
        let tableData = [];
        const tableColWidthArr = [ 90, 180, 240, 190, 95, 95, 120, 190 ];
        recordData && recordData.map((data, index) => {
            let tempArr = [], tempObj = {
                order: "",
                sg_sc_tag: "",
                sg_sc_name: "",
                sc_bz_name: "",
                bz_jieguo: "",
                sc_bz_gjbz: "",
                sr_remark_bz: "",
                sr_jianlipic: "",
            };
            tempObj.order = data.order;
            tempObj.sg_sc_tag = data.sg_sc_tag;
            tempObj.sg_sc_name = data.sg_sc_name;
            tempObj.sc_bz_name = data.sc_bz_name;
            tempObj.bz_jieguo = data.bz_jieguo;
            tempObj.sc_bz_gjbz = parseInt(data.sc_bz_gjbz, 10) === 1 ? "是" : "否";
            tempObj.sr_remark_bz = data.sr_remark_bz;
            tempObj.sr_jianlipic = data.sr_jianlipic; // 7

            Object.entries(tempObj).forEach(([key, value]) => {
                tempArr.push(value);
            });

            tableData.push(tempArr);
        });
        const { navigate, getParam } = this.props.navigation;

        // 侧向图集
        const PicRoll = (picList) => (
            <View style={[picList.length > 0 && iconLineContainer, { alignItems: "center" }]}>
                <ScrollView horizontal={true}>
                    {
                        picList && picList.map((data, index) => {
                            return <View key={`pic_${index}`}>
                                <TouchableOpacity style={[ peoIconMainStyle, peoPic, styles.photoMain ]} onPress={() => {
                                    this.setState({ picIndex: index, modalVisible: true, avatarSource: picList });
                                }}>
                                    <Image source={{ uri: data.url, width: "100%", height: "100%" }} />
                                </TouchableOpacity>
                            </View>;
                        })
                    }
                </ScrollView>
            </View>
        );

        return (
            <Container style={styles.container}>
                <StatusBar hidden={true}/>
                <Header hasSegment>
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => navigation.goBack()}>
                            <Icon name="ios-arrow-back" style={arrowBackFontSize}/>
                        </Button>
                    </Left>

                    <Body style={{ flex: 1, alignItems:"center" }}>
                    <Title>标准化施工监理记录</Title>
                    </Body>

                    <Right style={{ flex: 1 }}><Text style={{ color: "white" }}>当前用户：{userName && userName}</Text></Right>
                </Header>
                {
                    renderIf(isEmpty(recordData))(
                        <View style={emptyListInfo}>
                            <View>
                                <Image
                                    source={require("../../../../../assets/loading/icon_list_empty_3x.png")}
                                    style={emptyListPic}
                                />
                                <Text style={emptyListText}>还没有相关的列表呢</Text>
                            </View>
                        </View>
                    )
                }
                {
                    renderIf(!isEmpty(recordData))(
                        <View style={[contentStyle]}>
                            <View  style={[tableHeight]}>
                                <Table borderStyle={{ borderColor: "#E4E4E4" }}>
                                    <Row data={tableHeader} style={styles.tableHeader} flexArr={tableColWidthArr}
                                         textStyle={rowTextStyle}/>
                                </Table>
                                <Table  borderStyle={{ borderColor: "#E4E4E4" }}>
                                    <ScrollView style={styles.scrollViewStyle}>
                                        {
                                            tableData.map((row, index) => {
                                                return <TableWrapper key={index}
                                                                     style={[ styles.tableWrapperStyle, index % 2 && { backgroundColor: "#F2F2F2" } ]}>
                                                    {
                                                        row.map((cellData, cellIndex) => {
                                                            return <Cell key={cellIndex}
                                                                         data={cellIndex === 7 ? PicRoll(cellData && cellData.map((url) => {
                                                                             return {
                                                                                 url: `http://${currentServerIp}/nzx/yunwei/sggl_new/${url}`,
                                                                                 freeHeight: true
                                                                             };
                                                                         })) : cellData}
                                                                         style={{ flex: tableColWidthArr[ cellIndex ], borderColor: "#E4E4E4" }}
                                                                         textStyle={[ rowTextStyle ]}/>;
                                                        })
                                                    }
                                                </TableWrapper>;
                                            })
                                        }
                                        <View style={tableBottomLine}/>
                                    </ScrollView>
                                </Table>
                            </View>
                            <View style={[footBtnContainer]}>
                                <View style={footBtnContent}>
                                    <View>
                                        <Button full info style={footBtn}
                                                onPress={() => navigation.goBack()}><Text style={{ color: "#f30" }}>上一步</Text></Button>
                                    </View>
                                    <View>
                                        <Button full info style={footBtn}
                                                onPress={() => {
                                                    navigation.navigate("sggl_09", {
                                                        requestParams: formUrlEncoded({
                                                            user: userName,
                                                            displayCode: 11,
                                                            readOnlyFlag: true,
                                                            sggl_tag: sg_tag,
                                                            sr_id,
                                                            recStatus: 2,
                                                        }, { ignorenull : true, skipIndex: true, sorted: false }),
                                                    });
                                                }}
                                        >
                                            <Text style={{ color: "#f30" }}>下一步</Text>
                                        </Button>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )
                }
                <ProgressDialog
                    visible={ isFetching }
                    title="更新施工单"
                    message="更新中，请稍后..."
                    dialogStyle={ progressDialogStyle }
                    overlayStyle={theHeight}
                />
                <Modal style={{ width: "100%", height: "100%" }} isOpen={this.state.modalVisible} transparent={true} onRequestClose={() => this.setState({ modalVisible: false })}>
                    <ImageViewer imageUrls={this.state.avatarSource} index={this.state.picIndex} enableSwipeDown={true} onSwipeDown={() =>{ this.setState({modalVisible: false}); }}
                    onClick={() =>{ this.setState({modalVisible: false}); }} />
                </Modal>
            </Container>
        );
    }
}

export default ConstructRecordScreen;
