import * as React from "react";
import { View, StatusBar, ScrollView, Image, BackHandler } from "react-native";
import {
    Container,
    Button,
    Text, Left, Icon, Body, Segment, Right, Header,
} from "native-base";
import { Row, Cell, TableWrapper, Table } from "react-native-table-component";
import ProgressDialog from "react-native-simple-dialogs/src/ProgressDialog";
import SearchForm from "../../../../components/formComponents/sggl_new/FollowUpHisListSearchForm";
import renderIf from "../../../../services/utils/renderIf";
import formUrlEncoded from "form-urlencoded";
import styles from "./styles";
import cStyles from "../../../../styles/dealWithPages";
import emptyPageStyle from "../../../../styles/todoPages";
import { isEmpty } from "lodash";

const {
    arrowBackFontSize, segmentFirstStyle, segmentLastStyle, segmentStyle,
    progressDialogStyle,
} = cStyles;

const {
    emptyListText,
    emptyListPic,
    emptyListInfo,
} = emptyPageStyle;

export interface Props {
    navigation: any;
}

export interface State {
}

class FindToFollowUpList extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            segmentIndex : 0,
        };
    }

    componentDidMount() {
      BackHandler.addEventListener("hardwareBackPress", this.onBackButtonPressed);
    }
  
    componentWillUnmount() {
      BackHandler.removeEventListener("hardwareBackPress", this.onBackButtonPressed);
    }
  
    onBackButtonPressed() {
      return true;
    }

    render() {
        const tableHeader = [ "施工单号", "作业单位", "作业区域", "作业内容", "计划开始时间", "计划结束时间" ];
        let tableData = [];
        let tableList = [];
        const tableColWidthArr = [ 1.8, 1, 1.4, 4, 2.2, 2.2 ];
        const { isFetching : toIsFetching, list: toList } = this.props.fetchedToFollowUpList;
        const { isFetching : hisIsFetching, list: hisList } = this.props.fetchedFollowUpHisList;
        const { userName } = this.props.user.authorization;
        const isFetching = toIsFetching || hisIsFetching;
        const isFirstSegment = this.state.segmentIndex === 0;
        isFirstSegment ? tableList = toList : tableList = hisList;
        tableList && tableList.map((data, index) => {
            let tempArr = [], tempObj = {
                sggl_tag: "",
                sggl_unit: "",
                sggl_site: "",
                sggl_doinfo: "",
                //sggl_type: "",
                //sggl_urgent: "",
                sg_plan_bgtime: "",
                sg_plan_endtime: "",
                ind: "",
            };
            tempObj.ind = data.ind;
            tempObj.sggl_tag = data.sggl_tag;
            tempObj.sggl_unit = data.sggl_unit;
            tempObj.sggl_site = data.sggl_site;
            tempObj.sggl_doinfo = data.sggl_doinfo;
            //tempObj.sggl_type = data.sggl_type;
            //tempObj.sggl_urgent = parseInt(data.status, 10) === 1 ? "是" : "否";
            tempObj.sg_plan_bgtime = data.sg_plan_bgtime;
            tempObj.sg_plan_endtime = data.sg_plan_endtime;

            Object.entries(tempObj).forEach(([key, value]) => {
                tempArr.push(value);
            });

            tableData.push(tempArr);
        });
        const { navigate, getParam } = this.props.navigation;
        const cellEle = (sggl_tag, ind) => (
            <View style={{ alignSelf: "center" }}>
                <Button danger transparent onPress={() => {
                    console.log("sggl_tag and ind: ", sggl_tag, ind);
                    if (isFirstSegment) {
                        navigate("sggl_02", {
                            currentSgglTag: sggl_tag,
                            // currentSrId: ind,
                            currentDisplayCode: 1,
                        });
                    } else {
                        navigate("sggl_15", {
                            requestParams: formUrlEncoded({
                                user: userName,
                                displayCode: 1,
                                readOnlyFlag: true,
                                sggl_tag,
                            })
                        });
                    }
                }} style={{ width: "100%" }}>
                    <Text style={styles.rowTextStyle}>{`${sggl_tag}`}</Text>
                </Button>
            </View>
        );
        return (
            <Container style={styles.container}>
                <StatusBar hidden={true}/>
                <Header hasSegment>
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => navigate("Home")}>
                            <Icon name="ios-arrow-back" style={arrowBackFontSize} />
                        </Button>
                    </Left>

                    <Body style={{ flex: 1 }}>
                    <Segment style={ segmentStyle }>
                        <Button active={isFirstSegment} style={ segmentFirstStyle } onPress={() => {
                            this.setState({ segmentIndex : 0 });
                            this.props.fetchToFollowUpAction({
                                user: getParam("userName")
                            });
                        }} first><Text>    待跟进施工单    </Text></Button>
                        <Button active={!isFirstSegment} style={ segmentLastStyle }
                                onPress={() => {
                                    this.setState({ segmentIndex : 1  });
                                    //if (isEmpty(hisList)) {
                                        this.props.fetchFollowUpHisAction({
                                            user: getParam("userName")
                                        });
                                    //}
                                }}
                                last>
                            <Text>      历史施工单      </Text>
                        </Button>
                    </Segment>
                    </Body>

                    <Right style={{ flex: 1 }} ><Text style={{ color: "white" }}>当前用户：{ getParam("userName") }</Text></Right>
                </Header>
                {renderIf(!isFirstSegment)(
                    <SearchForm />
                )}
                {
                    renderIf(isEmpty(tableList))(
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
                    renderIf(!isEmpty(tableList))(
                        <View>
                            <View>
                                <Table borderStyle={{ borderColor: "#E4E4E4" }}>
                                    <Row data={tableHeader} style={styles.tableHeader} flexArr={tableColWidthArr}
                                         textStyle={styles.rowTextStyle}/>
                                </Table>
                                <Table  borderStyle={{ borderColor: "#E4E4E4" }}>
                                    <ScrollView style={ isFirstSegment ? styles.scrollViewStyle : styles.scrollViewHisStyle}>
                                        {
                                            tableData.map((row, index) => {
                                                // TableWrapper as a row
                                                let slicedTableRow = row.slice(0, row.length - 1);
                                                return <TableWrapper key={index}
                                                                     style={[ styles.tableWrapperStyle, index % 2 && { backgroundColor: "#F2F2F2" } ]}>
                                                    {
                                                        slicedTableRow.map((cellData, cellIndex) => {
                                                            return <Cell key={cellIndex}
                                                                         data={cellIndex === 0 ? cellEle(row[ 0 ], row[ row.length - 1 ]) : cellData}
                                                                         style={{ flex: tableColWidthArr[ cellIndex ], borderColor: "#E4E4E4" }}
                                                                         textStyle={[ styles.rowTextStyle ]}/>;
                                                        })
                                                    }
                                                </TableWrapper>;
                                            })
                                        }
                                        <View style={styles.tableBottomLine}/>
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
                    animationType="fade"
                    overlayStyle={styles.theHeight}
                />
            </Container>
        );
    }
}

export default FindToFollowUpList;
