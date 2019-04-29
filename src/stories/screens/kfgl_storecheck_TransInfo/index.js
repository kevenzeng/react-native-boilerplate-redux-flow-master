import * as React from "react";
import { View } from "react-native";
import {
    Container,
    Header,
    Content,
    Button,
    Icon,
    Left,
    Body,
    Right, Segment, Text,
} from "native-base";

import styles from "./styles";
import { Row, Rows, Table } from "react-native-table-component";
import { ROUNDED_STATUS, DEAL_WITH_STORE_CHECK_SCREEN, STORE_CHECK_ITEMS_LIST_SCREEN } from "../../../boot/config";
import renderIf from "../../../services/utils/renderIf";
export interface Props {
    navigation: any;
}
export interface State {}
class TransInfo extends React.Component<Props, State> {

    render() {
        const tableHeader = [ "序号", "环节名称", "处理人", "处理人电话", "到达时间", "操作", "状态", "提交时间", "处理意见" ];
        let tableData = [];
        const { getParam } = this.props.navigation;
        this.props.fetchedStoreCheckTrack.map((data) => {
            let tempArr = [], tempObj = {
                ind: "",
                trackName: "",
                operator: "",
                operatorPhone: "",
                insertTime: "",
                opTypeName: "",
                status: "",
                submitTime: "",
                opinion: ""
            };
            tempObj.ind = data.ind;
            tempObj.trackName = data.trackName;
            tempObj.operator = data.operator;
            tempObj.operatorPhone = data.operatorPhone;
            tempObj.insertTime = data.insertTime;
            tempObj.opTypeName = data.opTypeName;
            tempObj.status = ROUNDED_STATUS[ parseInt(data.status, 10) ];
            tempObj.submitTime = data.submitTime;
            tempObj.opinion = data.opinion;
            Object.entries(tempObj).forEach(([ key, value ]) => {
                if (![ "trackStatus", "opType" ].includes(key)) {
                    tempArr.push(value);
                }
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
                        {renderIf(getParam("isShowItems"))(
                            <Button onPress={() => this.props.navigation.navigate(STORE_CHECK_ITEMS_LIST_SCREEN)}>
                                <Text>盘点库存备件列表</Text>
                            </Button>
                        )}
                        <Button active style={styles.rightSeBtn} last>
                            <Text>盘点流程流转信息</Text>
                        </Button>
                    </Segment>
                    </Body>
                    <Right  style={{ flex: 1 }}/>
                </Header>
                <Content>
                    <View>
                        <Table>
                            <Row data={tableHeader} style={styles.tableHeader}
                                 textStyle={styles.rowTextStyle}/>
                            <Rows data={tableData} style={styles.tableRows}
                                  textStyle={styles.rowTextStyle}/>
                        </Table>
                    </View>
                </Content>
            </Container>
        );
    }
}

export default TransInfo;
