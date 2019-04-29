import * as React from "react";
import { View, StatusBar, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Container, Text, Title, H3, Button, Body, Header, Left, Right, Icon, CheckBox, Form, Item, Input } from "native-base";
import PopupDialog from "react-native-popup-dialog";
import ProgressDialog from "react-native-simple-dialogs/src/ProgressDialog";
import { Row, Table, TableWrapper, Cell } from "react-native-table-component";
import renderIf from "../../../../services/utils/renderIf";
import AddNewItemsForm from "../../../../../src/components/formComponents/sggl_new/03_addNewItemForm";
import { cloneDeep, isEmpty } from "lodash";
import formUrlEncoded from "form-urlencoded";

// styles
const { progressDialogStyle, theHeight } = cStyles;
import todoStyles from "../../../../styles/todoPages";
import aInputDialogStyle from "../../../../styles/aInputDialog";
import styles from "./styles";
import cStyles from "../../../../styles/dealWithPages";

const {
    mainPosition,
    container,
    btnSideBarContainer, sideBarBtnContainer, sideBarBtn,
    colorWhite, iconStyle, iconTextStyle,
    contentContainer,
    contentStyle,
    rightSideBar,
    footerContainer, footerContent, footerBtnContainer, footerBtnStyle,
    indexBarStyle,
    inContentStyle,
    tableContainer, contentTitle, tableHeader, tableWrapperStyle, rowTextStyle,
    checkBoxContainer, deleteBtnStyle, addNewBtnContainer, addNewItemStyle,
} = styles;

const {  dialogStyle, textAndInputContainer, textContainer,
    dialogText, dialogInputStyle, dialogBtnContainer,
    dialogBtn, dialogCancelBtn, dialogBtnText,
} = aInputDialogStyle;

const {
    popUpDialogOverBtn,
} = todoStyles;


export interface Props {
    navigation: any;
    preparedInfo: any;
    addRowAction: String;
    triggerReadyAction: String;
    deleteARowAction: String;
}

export interface State {
    errorText: String;
}

class ToConstructPrepareScreen extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            sgObjIndex: 0,
            newItemTableDataState: [],
            errorText: "",
        };
    }

    closeDialog = (values) => {
        if (!isEmpty(values)) {
            this.props.addRowAction(values);
        }
        this.addNewItemsDialog.dismiss();
    };

    // 是否只读 true 是 false 否
    isReadOnly() {
        return this.props.preparedInfo.responses.readOnlyFlag;
    }

    render() {
        const { navigation, preparedInfo, user } = this.props;
        const { userName } = user.authorization;
        const { isFetching, responses }  = preparedInfo;
        const { displayCode, readOnlyFlag, recStatus, sr_id, sggl_tag, toolsData = [{}, ], newitemData = [{}, ],item_names } = responses;
        const toolsTableHeader = ["设备", "型号", "数量", "备注", "操作"];
        const toolsTableColWidthArr = [19, 24, 14, 28, 10.5];
        const toolsTableData = [];
        const newItemsInfoTableHeader = ["备件序列号", "备件名称", "数量", "到货时间", "操作"];
        const newItemsTableColWidthArr = [19, 40, 12, 21, 13];
        const newItemTableData = [];
        const newItemNames = [];
        const commonRequestBody = {
            user: userName,
            displayCode,
            readOnlyFlag,
            sggl_tag,
            sr_id,
            recStatus,
        };

        toolsData && toolsData.map((data) => {
            let tempArr = [], tempObj = {
                sc_fzgj_name: "",
                sc_fzgj_type: "",
                sc_fzgj_number: "",
                sc_fzgj_mask: "",
                sr_gongju: "",
            };

            tempObj.sc_fzgj_name = data.sc_fzgj_name;
            tempObj.sc_fzgj_type = data.sc_fzgj_type;
            tempObj.sc_fzgj_number = data.sc_fzgj_number;
            tempObj.sc_fzgj_mask = data.sc_fzgj_mask;
            tempObj.sr_gongju = data.sr_gongju;

            Object.entries(tempObj).forEach(([key, value]) => {
                tempArr.push(value);
            });

            toolsTableData.push(tempArr);
        });

        newitemData && newitemData.map((data) => {
            let tempArr = [], tempObj = {
                newitem_sn: "",
                newitem_name: "",
                newitem_num: "",
                newitem_retime: "",
            };

            tempObj.newitem_sn = data.newitem_sn;
            tempObj.newitem_name = data.newitem_name;
            tempObj.newitem_num = data.newitem_num;
            tempObj.newitem_retime = data.newitem_retime;
            tempObj.delete = "";

            Object.entries(tempObj).forEach(([key, value]) => {
                tempArr.push(value);
            });

            newItemTableData.push(tempArr);
        });

        item_names && item_names.map((data) => {
            newItemNames.push({itemname:data});
        });


        const cellEle = (rowIndex, itemName) => (
            <View style={[{ width: "100%" }]}>
                <Button disabled={this.isReadOnly()} style={[deleteBtnStyle, this.isReadOnly() && { opacity: 0.3 }]} danger transparent onPress={() => {
                    Alert.alert("提示", `确认删除该项备件：${JSON.stringify(itemName)}?`, [
                        { text: "取消", onPress: () => {}},
                        { text: "确认", onPress: () => {
                            this.props.deleteARowAction(rowIndex);
                        }},
                    ]);
                }}>
                    <Icon style={styles.deleteIconStyle} name="md-remove-circle" />
                </Button>
            </View>
        );

        const checkBoxEle = (index, value) => (
            <View style={checkBoxContainer}>
                <CheckBox disabled={this.isReadOnly()}  color="#ff3300" style={[{ left: 0 }, this.isReadOnly() && { opacity: 0.3 }]} checked={value === 1} onPress={() => {
                    this.props.triggerReadyAction(index);
                }} />
            </View>
        );

        return <Container style={container}>
            <StatusBar hidden={true}/>
            <Header hasSegment>
                <Left style={{ flex: 1 }} />

                <Body style={{ flex: 1, alignItems:"center" }}>
                <Title>施工准备</Title>
                </Body>

                <Right style={{ flex: 1 }}><Text style={{ color: "white" }}>当前用户：{userName && userName}</Text></Right>
            </Header>
            <View style={[mainPosition]}>
                <View style={btnSideBarContainer}>
                    <View style={sideBarBtnContainer}>
                        <TouchableOpacity style={[sideBarBtn, this.isReadOnly() && { opacity: 0.3 }]} disabled={this.isReadOnly()}
                                          onPress={() => {
                                              this.abnormalEndDialog.show();
                                          }}
                        >
                            <Icon style={[colorWhite, iconStyle]} name="close-circle" />
                            <Text style={[colorWhite, iconTextStyle]}>异常结束</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={sideBarBtnContainer}>
                        <TouchableOpacity style={[sideBarBtn, this.isReadOnly() && { opacity: 0.3 }]} disabled={this.isReadOnly()} onPress={() => {
                            Alert.alert("操作提示", "本次施工将退出，未保存的信息将丢失", [
                                { text: "取消", onPress: () => {}},
                                {
                                    text: "确认", onPress: () => {
                                        this.props.exitConstructAction(formUrlEncoded(commonRequestBody));
                                    }
                                },
                            ]);
                        }}>
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
                                    <View><H3>辅助工具/软件</H3></View>
                                </View>
                                <View style={tableContainer}>
                                    <Table borderStyle={{ borderColor: "#E4E4E4" }}>
                                        <Row data={toolsTableHeader} style={tableHeader} flexArr={toolsTableColWidthArr}
                                             textStyle={rowTextStyle}/>
                                    </Table>
                                    <Table  borderStyle={{ borderColor: "#E4E4E4" }}>
                                        {
                                            toolsTableData.map((row, index) => {
                                                // TableWrapper as a row
                                                // let slicedTableRow = row.slice(0, row.length - 1);
                                                return <TableWrapper key={index}
                                                                     style={[ tableWrapperStyle, index % 2 && { backgroundColor: "#F2F2F2" } ]}>
                                                    {
                                                        row.map((cellData, cellIndex) => {
                                                            return <Cell key={cellIndex}
                                                                         data={cellIndex === 4 ? checkBoxEle(index, cellData) : cellData}
                                                                         style={{ flex: toolsTableColWidthArr[ cellIndex ], borderColor: "#E4E4E4" }}
                                                                         textStyle={[ rowTextStyle ]}/>;
                                                        })
                                                    }
                                                </TableWrapper>;
                                            })
                                        }
                                    </Table>
                                </View>
                                <View style={[contentTitle]}>
                                    <View style={indexBarStyle}>{}</View>
                                    <View><H3>新备件信息</H3></View>
                                </View>
                                <View style={tableContainer}>
                                    <Table borderStyle={{ borderColor: "#E4E4E4" }}>
                                        <Row data={newItemsInfoTableHeader} style={tableHeader} flexArr={newItemsTableColWidthArr}
                                             textStyle={rowTextStyle}/>
                                    </Table>
                                    <Table  borderStyle={{ borderColor: "#E4E4E4" }}>
                                        {
                                            newItemTableData.map((row, index) => {
                                                // TableWrapper as a row
                                                // let slicedTableRow = row.slice(0, row.length - 1);
                                                return <TableWrapper key={index}
                                                                     style={[ tableWrapperStyle, index % 2 && { backgroundColor: "#F2F2F2" } ]}>
                                                    {
                                                        row && row.map((cellData, cellIndex) => {
                                                            return <Cell key={cellIndex}
                                                                         data={cellIndex === 4 ? cellEle(index, row[1]) : cellData}
                                                                         style={{ flex: newItemsTableColWidthArr[ cellIndex ], borderColor: "#E4E4E4" }}
                                                                         textStyle={[ rowTextStyle ]}/>;
                                                        })
                                                    }
                                                </TableWrapper>;
                                            })
                                        }
                                    </Table>
                                    {
                                        renderIf(!this.isReadOnly())(
                                            <View style={addNewBtnContainer}>
                                                <Button disabled={this.isReadOnly()} transparent danger
                                                        onPress={ () => {
                                                            this.addNewItemsDialog.show();
                                                        }} style={addNewItemStyle}>
                                                    <Text>+新增备件信息</Text>
                                                </Button>
                                            </View>
                                        )
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
                        <Button bordered style={footerBtnStyle} onPress={() => { navigation.goBack(); }}>
                            <Text style={colorWhite}>上一步</Text>
                        </Button>
                        <Button bordered style={footerBtnStyle}
                                onPress={() => {
                                    // 下一步 making request
                                    let tempTools = cloneDeep(toolsData);
                                    let tempNewItems = cloneDeep(newitemData);
                                    let formattedTools = {
                                        sc_fzgj_id: [],
                                        sc_fzgj_tag: [],
                                        sc_fzgj_name: [],
                                        sc_tag: [],
                                        sr_gongju: [],
                                    };
                                    let formattedItems = {
                                        newitem_id: [],
                                        newitem_sn: [],
                                        newitem_name: [],
                                        newitem_num: [],
                                        newitem_retime: [],
                                    };
                                    tempTools.map(data => {
                                       formattedTools.sc_fzgj_id.push(data.sc_fzgj_id);
                                       formattedTools.sc_fzgj_tag.push(data.sc_fzgj_tag);
                                       formattedTools.sc_fzgj_name.push(data.sc_fzgj_name);
                                       formattedTools.sc_tag.push(data.sc_tag);
                                       formattedTools.sr_gongju.push(data.sr_gongju);
                                    });
                                    tempNewItems.map(data => {
                                        formattedItems.newitem_id.push(data.newitem_id ? data.newitem_id : "");
                                        formattedItems.newitem_sn.push(data.newitem_sn);
                                        formattedItems.newitem_name.push(data.newitem_name);
                                        formattedItems.newitem_num.push(data.newitem_num);
                                        formattedItems.newitem_retime.push(data.newitem_retime);
                                    });
                                    // console.log("04: ", formattedTools, formattedItems);
                                    // console.log(formUrlEncoded({ displayCode, readOnlyFlag, sggl_tag, sr_id, recStatus, ...formattedTools, ...formattedItems }, { ignorenull : true, skipIndex: true, sorted: false }));
                                    navigation.navigate("sggl_04", {
                                        requestParams: formUrlEncoded({
                                            user: userName,
                                            displayCode,
                                            readOnlyFlag,
                                            sggl_tag,
                                            sr_id,
                                            recStatus,
                                            ...formattedTools,
                                            ...formattedItems
                                        }, { ignorenull : true, skipIndex: true, sorted: false }),
                                        sr_id,
                                    });
                                }}
                        >
                            <Text style={colorWhite}>下一步</Text>
                        </Button>
                    </View>
                </View>
            </View>
            <ProgressDialog
                visible={isFetching}
                title="更新施工准备单"
                message="更新中，请稍后..."
                dialogStyle={progressDialogStyle}
                overlayStyle={theHeight}
            />
            <PopupDialog
                ref={(popupDialog) => {
                    this.addNewItemsDialog = popupDialog;
                }}
                overlayOpacity={0.5}
                containerStyle={popUpDialogOverBtn}
                width={0.5}
                height={0.55}
                onShown={() => {
                }}
            >
                <View style={inContentStyle}>
                    { <AddNewItemsForm itemNames={newItemNames} onClose={(values) => this.closeDialog(values)} /> }
                </View>
            </PopupDialog>
            <PopupDialog
                ref={(popupDialog) => {
                    this.abnormalEndDialog = popupDialog;
                }}
                dialogStyle={dialogStyle}
                overlayOpacity={0.5}
                onShown={() => {}}
            >
                <View>
                    <View style={textAndInputContainer}>
                        <View style={textContainer}>
                            <Text style={dialogText}>请填写异常原因: </Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Form>
                                <Item regular style={dialogInputStyle}>
                                    <Input placeholder="异常原因"
                                           onChangeText={(errorText) => this.setState({errorText})}
                                           value={this.state.errorText}
                                           placeholderTextColor ={"#cccccc"}
                                           style={{ textAlign: "left"}}
                                    />
                                </Item>
                            </Form>
                        </View>
                    </View>
                    <View style={dialogBtnContainer}>
                        <Button style={[dialogBtn, dialogCancelBtn]}
                                onPress={() => { this.abnormalEndDialog.dismiss(); }}>
                            <Text style={[dialogBtnText, { color: "#999999", }]}>取  消</Text>
                        </Button>
                        <Button style={[dialogBtn, { backgroundColor: "#ff3300" }]}
                                onPress={() => {
                                    this.props.toEndByExceptionAction(formUrlEncoded({
                                        ...commonRequestBody,
                                        sr_end_remarks: this.state.errorText,
                                    }));
                                    this.abnormalEndDialog.dismiss();
                                }}>
                            <Text style={dialogBtnText}>保  存</Text>
                        </Button>
                    </View>
                </View>
            </PopupDialog>
        </Container>;

    }
}

export default ToConstructPrepareScreen;
