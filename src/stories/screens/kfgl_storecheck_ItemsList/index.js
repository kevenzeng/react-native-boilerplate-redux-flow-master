import * as React from "react";
import { View, Alert, Dimensions, ScrollView } from "react-native";
import {
    Container,
    Header,
    Content,
    Input,
    Button,
    Icon,
    Left,
    Body,
    Right,
    Segment,
    Text,
    Form,
    Item,
} from "native-base";

import styles from "./styles";
import cStyles from "../../../styles/todoPages";
import { Row, Table, TableWrapper, Cell } from "react-native-table-component";
import { DEAL_WITH_STORE_CHECK_SCREEN, STORE_CHECK_TRANS_INFO_SCREEN } from "../../../boot/config";
import PopupDialog, { DialogTitle } from "react-native-popup-dialog";
import { ProgressDialog } from "react-native-simple-dialogs";
import { postInt } from "../../../services/utils/formValidateUtils";
import _ from "lodash";

export interface Props {
    navigation: any;
}
export interface State {}

export default class StoreCheckItemsList extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            text: "",
            currentSummaryNo: "",
            currentSummaryNum: "",
        };
    }

    render() {
        const tableHeader = [ "序号", "备件汇总号", "备件名称", "库存数量", "盘点后数量", "单位", "有效月数", "库房名称", "货架名称", "好/坏件", "归属单位", "过期日期", "操作" ]; // 13
        const flexArr = [30, 120, 160, 90, 90, 80, 80, 100, 100, 100, 120, 100, 120];
        const isFetching = this.props.statusOfUpdateDetail.isFetching ||
            this.props.fetchedStoreCheckDetail.isFetching;
        let tableData = [];
        const { userName } = this.props.user.authorization;
        const { checkNo, status } = this.props.selectedCheckList;
        const cellEle = (summaryNo, summaryNum, rowIndex) => (
            <View style={{ alignSelf: "center" }}>
                <Button danger onPress={() => {
                    this.setState({ currentSummaryNo: `${summaryNo}`, currentSummaryNum: `${summaryNum}`, currentRowIndex: `${rowIndex}` });
                    this.summaryNumDialog.show();
                }} style={{ width: "100%" }}>
                    <Text>修改库存数量</Text>
                </Button>
            </View>
        );
        this.props.fetchedStoreCheckDetail.list.map((data, index) => {
            let tempArr = [], tempObj = {
                index: "",
                summaryNo: "", // 1
                deviceName: "",
                oldSummaryNum: "", // 3
                summaryNum: "", // 4
                unitName: "",
                validMonths: "",
                roomName: "",
                sheetName: "",
                usability: "",
                belongUnit: "",
                expireDate: "",
                operate: "",
            };
            tempObj.index = index + 1;
            tempObj.summaryNo = data.summaryNo;
            tempObj.deviceName = data.deviceName;
            tempObj.oldSummaryNum = data.oldSummaryNum; // 3
            tempObj.summaryNum = data.summaryNum;
            tempObj.unitName = data.unitName;
            tempObj.validMonths = data.validMonths;
            tempObj.roomName = data.roomName;
            tempObj.sheetName = data.sheetName;
            tempObj.usability = data.usability;
            tempObj.belongUnit = data.belongUnit;
            tempObj.expireDate = data.expireDate;
            // tempObj.operate = data.operate; // 不存在的字段
            Object.entries(tempObj).forEach(([ key, value ]) => {
                tempArr.push(value);
            });
            tableData.push(tempArr);
        });
        return (
            <Container style={styles.container}>
                <Header hasSegment>
                    <Left style={{ flex: 1 }}>
                        <Button transparent>
                            <Icon
                                active
                                name="ios-arrow-back"
                                onPress={() => this.props.navigation.goBack()}
                            />
                        </Button>
                    </Left>
                    <Body style={{ flex: 1.5 }}>
                    <Segment style={styles.segmentStyle}>
                        <Button style={styles.leftSeBtn}
                                onPress={() => this.props.navigation.navigate(DEAL_WITH_STORE_CHECK_SCREEN)} first><Text>     盘点单信息     </Text></Button>

                        <Button active>
                            <Text>盘点库存备件列表</Text>
                        </Button>

                        <Button
                            style={styles.rightSeBtn}
                            onPress={() => this.props.navigation.navigate(STORE_CHECK_TRANS_INFO_SCREEN, {
                                isShowItems: true
                            })}
                            last
                        >
                            <Text>盘点流程流转信息</Text>
                        </Button>
                    </Segment>
                    </Body>
                    <Right  style={{ flex: 1 }}/>
                </Header>
                <Content>
                    <View>
                        <ScrollView>
                            <View>
                                <Table>
                                    <Row data={tableHeader}
                                         style={styles.tableHeader}
                                         flexArr={flexArr}
                                         textStyle={styles.rowTextStyle}
                                    />
                                    { tableData.map((row, index) => {
                                        // TableWrapper as A row
                                        return <TableWrapper key={index} style={[ styles.tableWrapperStyle, index % 2 && {backgroundColor: "#F2F2F2"}, row[3] !== row[4] && { backgroundColor: "#8CC9EB" }, row[4] === "0" && { backgroundColor: "#FCD8D8" }]}>
                                                {
                                                    row.map((cellData, cellIndex) => {
                                                        return <Cell key={cellIndex} data={cellIndex === 12 && status === "03" ? cellEle(row[1], row[4], index) : cellData} style={{ flex: flexArr[cellIndex] }} textStyle={[styles.rowTextStyle, (cellIndex === 4 && cellData !== row[3]) && { color: "red" }]}/>;
                                                    })
                                                }
                                        </TableWrapper>;
                                    }) }
                                </Table>
                            </View>
                        </ScrollView>
                    </View>
                </Content>
                <ProgressDialog
                    visible={ isFetching }
                    title="更新盘点单"
                    message="更新中，请稍后..."
                    dialogStyle={cStyles.progressDialogStyle}
                />
                <PopupDialog
                    dialogTitle={
                        <DialogTitle
                            title="库存数量修改"
                            hasTitleBar={false}
                            titleTextStyle={cStyles.popUpDialogTitleText}
                        />
                    }
                    ref={(popupDialog) => {
                        this.summaryNumDialog = popupDialog;
                    }}
                    overlayOpacity={0.5}
                    containerStyle={{
                        // TODO: dynamic height
                        marginTop: 0,
                        width: Dimensions.get("window").width,
                    }}
                    width={0.4}
                    height={0.4}
                    onShown={() => {}}
                >
                    <View>
                        <View style={cStyles.padding8}>
                            <Text style={cStyles.dialogText}>请输入对汇总号: {this.state.currentSummaryNo} 新的盘点数量,如果输入 0 ,则备件全部出库</Text>
                        </View>
                        <View style={cStyles.dialogContent}>
                            <Form>
                                <Item style={{ width: "90%" }}>
                                    <Input placeholder="请输入正整数"
                                           onChangeText={(text) => this.setState({text})}
                                           value={this.state.text}
                                           style={{ textAlign: "center"}}
                                    />
                                </Item>
                            </Form>
                        </View>
                        <View style={{ width: "100%" }}>
                            <Button full info small style={{ borderRadius: 6, width: "30%", alignSelf: "center" }}
                                     onPress={() => {
                                         const { text , currentSummaryNo } = this.state;
                                         if (!postInt(text) || _.isEqual(text, "0")) {
                                             this.props.toUpdateStoreCheckDetail({
                                                 user: userName,
                                                 checkNo: checkNo,
                                                 summaryNo: currentSummaryNo,
                                                 summaryNum: text,
                                             });
                                             this.summaryNumDialog.dismiss();
                                         } else {
                                             Alert.alert("出现错误", "盘点数量只能是正整数或 0");
                                         }
                                         }
                                     }>
                                <Text>确  认</Text>
                            </Button>
                        </View>
                    </View>
                </PopupDialog>
            </Container>
        );
    }
}
