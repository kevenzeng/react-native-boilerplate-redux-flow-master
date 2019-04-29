import * as React from "react";
import { View, StatusBar, ScrollView, Image } from "react-native";
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

const { contentStyle, rowTextStyle } = styles;

export interface Props {
    navigation: any;
}

export interface State {
}

class ConstructRecordScreen extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { navigation, fetchedSupervisionList, user } = this.props;
        const { userName } = user.authorization;
        const { isFetching, responses }  = fetchedSupervisionList;
        const { data : recordData, sg_tag } = responses && responses;

        const tableHeader = [ "操作", "施工入场人员", "工作区域", "携带物品", "配件存放库房", "配件名称", "配件序列号", "施工开始时间", "施工结束时间", "进度" ];
        let tableData = [];
        const tableColWidthArr = [ 65, 120, 105, 95, 130, 120, 150, 215, 215, 70 ];
        recordData && recordData.map((data, index) => {
            let tempArr = [], tempObj = {
                operation: "",
                sr_opers: "",
                sr_rack: "",
                sr_tool: "",
                sr_room: "",
                sr_item: "",
                sr_item_sn: "",
                sr_bgtime: "",
                sr_endtime: "",
                sr_progress: "",
                sr_id: "",
                sr_tag: "",
            };
            tempObj.operation = "查看";
            tempObj.sr_opers = data.sr_opers;
            tempObj.sr_rack = data.sr_rack;
            tempObj.sr_tool = data.sr_tool;
            tempObj.sr_room = data.sr_room;
            tempObj.sr_item = data.sr_item;
            tempObj.sr_item_sn = data.sr_item_sn;
            tempObj.sr_bgtime = data.sr_bgtime;
            tempObj.sr_endtime = data.sr_endtime;
            tempObj.sr_progress = data.sr_progress;
            tempObj.sr_id = data.sr_id;
            tempObj.sr_tag = data.sr_tag;

            Object.entries(tempObj).forEach(([key, value]) => {
                tempArr.push(value);
            });

            tableData.push(tempArr);
        });
        const { navigate, getParam } = this.props.navigation;
        const cellEle = (operation, sr_id) => (
            <View style={{ alignSelf: "center" }}>
                <Button danger transparent onPress={() => {
                    // navigate(); 施工单信息页
                    navigation.navigate("sggl_02", {
                        user: userName,
                        currentSgglTag: sg_tag,
                        currentSrId: sr_id,
                        currentDisplayCode: 10,
                    });
                }} style={{ width: "100%" }}>
                    <Text style={rowTextStyle}>查看</Text>
                </Button>
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
                    <Title>施工安全监理</Title>
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
                            <View>
                                <Table borderStyle={{ borderColor: "#E4E4E4" }}>
                                    <Row data={tableHeader} style={styles.tableHeader} flexArr={tableColWidthArr}
                                         textStyle={rowTextStyle}/>
                                </Table>
                                <Table  borderStyle={{ borderColor: "#E4E4E4" }}>
                                    <ScrollView>
                                        {
                                            tableData.map((row, index) => {
                                                let slicedTableRow = row.slice(0, row.length - 2);
                                                return <TableWrapper key={index}
                                                                     style={[ styles.tableWrapperStyle, index % 2 && { backgroundColor: "#F2F2F2" } ]}>
                                                    {
                                                        slicedTableRow.map((cellData, cellIndex) => {
                                                            return <Cell key={cellIndex}
                                                                         data={cellIndex === 0 ? cellEle(row[ 0 ], row[ row.length - 2 ]) : cellData}
                                                                         style={{ flex: tableColWidthArr[ cellIndex ], borderColor: "#E4E4E4" }}
                                                                         textStyle={[ rowTextStyle ]}/>;
                                                        })
                                                    }
                                                </TableWrapper>;
                                            })
                                        }
                                    </ScrollView>
                                </Table>
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
            </Container>
        );
    }
}

export default ConstructRecordScreen;
