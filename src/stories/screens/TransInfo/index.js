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
import { ROUNDED_STATUS } from "../../../boot/config";
export interface Props {
    navigation: any;
}
export interface State {}
class TransInfo extends React.Component<Props, State> {

    render() {
        const tableHeader = [ "序号", "环节名称", "处理人", "处理人电话", "到达时间", "操作", "状态", "提交时间", "处理意见" ];
        let tableData = [];
        let targetArray = [];
        const { getParam } = this.props.navigation;
        switch (getParam("currentPage")) {
            case "storeIn":
                targetArray = this.props.fetchedStoreInTrack;
                break;
            case "storeOut":
                targetArray = this.props.fetchedStoreOutTrack;
                break;
            case "storeTrans":
                targetArray = this.props.fetchedStoreTransTrack;
                break;
            default:
                targetArray = [];
        }
        targetArray.map((data, index) => {
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
                    <Left>
                        <Button transparent>
                            <Icon
                                active
                                name="ios-arrow-back"
                                onPress={() => this.props.navigation.goBack()}
                                style={styles.arrowBackFontSize}
                            />
                        </Button>
                    </Left>
                    <Body>
                    <Segment style={styles.segmentStyle}>
                        <Button style={styles.leftSeBtn}
                                onPress={() => this.props.navigation.goBack()} first><Text>{ getParam("leftSegmentTitle") }</Text></Button>
                        <Button active style={styles.rightSeBtn} last>
                            <Text>{ getParam("rightSegmentTitle") }</Text>
                        </Button>
                    </Segment>
                    </Body>
                    <Right />
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
