import * as React from "react";
import { View, StatusBar, ScrollView, TouchableOpacity, Alert, Slider, Image, Picker } from "react-native";
import { FileSystem,ImagePicker, Permissions, MediaLibrary } from "expo";
import { Container, Text, Button, Header, Left, Icon, Body, Title, Right, H3, CheckBox, Label, Textarea, Item, Input, ActionSheet, Form } from "native-base";
import PopupDialog from "react-native-popup-dialog";
import ProgressDialog from "react-native-simple-dialogs/src/ProgressDialog";
import DatePicker from "react-native-datepicker";
import { Row, Table, TableWrapper, Cell } from "react-native-table-component";
import ImageViewer from "react-native-image-zoom-viewer";
import Modal from "react-native-modalbox";
import { toaster } from "../../../../services/utils/toastUtils";
import { head, cloneDeep, isEmpty } from "lodash";
import formUrlEncoded from "form-urlencoded";
import AddOldItemsForm from "../../../../components/formComponents/sggl_new/09_addOldItemForm";

// styles
import todoStyles from "../../../../styles/todoPages";
import styles from "./styles";
import cStyles from "../../../../styles/dealWithPages";
import commonStyles from "../../../../styles/commonStyles";
import aInputDialogStyle from "../../../../styles/aInputDialog";
import renderIf from "../../../../services/utils/renderIf";
const { arrowBackFontSize, progressDialogStyle, theHeight, } = cStyles;
const { sideBarBtn, disableOpacity } = commonStyles;

const {  dialogStyle, textAndInputContainer, textContainer,
    dialogText, dialogInputStyle, dialogBtnContainer,
    dialogBtn, dialogCancelBtn, dialogBtnText,
} = aInputDialogStyle;

const {
    mainPosition,
    container,
    btnSideBarContainer, sideBarBtnContainer,
    colorWhite, iconStyle, iconTextStyle,
    contentContainer,
    contentStyle,
    rightSideBar,
    footerContainer, footerContent, footerBtnContainer, footerBtnStyle,
    indexBarStyle, sectionGap,
    inContentStyle,
    tableContainer, contentTitle, tableHeader, tableWrapperStyle, rowTextStyle,
    checkBoxContainer,
    iconLineContainer, inputLineContainer, lineTitle, lineContent,
    peoIconMainStyle, peoPic, deletePicBtn, deleteIcon,
    dateTimeLineContainer, addPeopleBtn, colorMain,
    addNewBtnContainer, addNewItemStyle, deleteBtnStyle, deleteIconStyle
} = styles;

const {
    popUpDialogOverBtn,
} = todoStyles;


export interface Props {
    navigation: any,
    setEndTimeAction: Function,
    setProgressAction: Function,
    setReasonAction: Function,
    addNewRowAction: Function,
    afterConstructInfo: Object,
}

export interface State {
    avatarSource: Array,
    modalVisible: Boolean,
    picIndex: Number,
}

class ToCheckAfterConstructScreen extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            newName: "",
            currentOpType: "",
            deletedOperators: [],
            avatarSource: [],
            picIndex: 0,
            modalVisible: false,
        };
    }

    closeDialog = (values) => {
        if (!isEmpty(values)) {
            this.props.addNewRowAction(values);
        }
        this.addOldItemsDialog.dismiss();
    };

    albumNameGetter() {
        return `标准化施工图片/标准化施工_${this.props.navigation.getParam("sr_id")}`;
    }

    /**
     * Get picture from camera
     */
    takePic = async () => {
        const { status : CameraStatus } = await Permissions.askAsync(Permissions.CAMERA);
        const { status : CameraRollStatus } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (CameraStatus === "granted" && CameraRollStatus === "granted") {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: "Images",
                quality: 1,
            }).catch(error => console.log("take pic error: ", { error }));

            console.log("成功取得拍照照片信息: ", result);
            // Save to Album
            if (!result.cancelled) {
                await this._handleAssetPicked(result);
            } else {
                console.log("Take Photo Cancelled");
            }
        }
    };

    /**
     * Select picture from gallery.
     */
    selectPic = async () => {
        const permissions = Permissions.CAMERA_ROLL;
        const { status } = await Permissions.askAsync(permissions);
        console.log(permissions, status);
        if (status === "granted") {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: "Images",
            }).catch(error => console.log(permissions, { error }));
            console.log(permissions, "SUCCESS", result);
            if (!result.cancelled) {
                await this._handleAssetPicked(result);
            }
        }
    };

    /**
     *  Having asset copy in sr_id album.
     */
    _handleAssetPicked = async (result) => {
        const { uri } = result;
        const albumName = this.albumNameGetter();
        const cachedAsset = await MediaLibrary.createAssetAsync(uri); // Creates an asset from existing file
        const album = await MediaLibrary.getAlbumAsync(albumName); // Need Album or its ID, not String type name
        if (album === null) {
            let albumCreated = await MediaLibrary.createAlbumAsync(albumName, cachedAsset, false);
            if (albumCreated) {
                await this.getAssetFromAlbum(albumCreated, cachedAsset);
            } else {
                console.log("Album not created");
            }
        } else {
            let assetAdded = await MediaLibrary.addAssetsToAlbumAsync([cachedAsset], album, false);
            if (assetAdded) {
                await this.getAssetFromAlbum(album, cachedAsset);
            } else {
                console.log("Asset Not Added");
            }
        }
    };

    // 重新从相册取得最新生成的照片地址
    getAssetFromAlbum = async (album, asset) => {
        const { filename } = asset;
        const assetsObject = await MediaLibrary.getAssetsAsync({
            first: 500,
            album: album,
            sortBy: MediaLibrary.SortBy.creationTime,
            mediaType: MediaLibrary.MediaType.photo,
        });
        let selectedAsset = assetsObject.assets.filter(a => { return a.uri.includes(filename); });
        head(selectedAsset) && this._setImage(head(selectedAsset).uri);
    };

    // 添加图片地址
    _setImage(uri) {
        this.props.addPhotoAction(uri);
    }

    isReadOnly() {
        const { readOnlyFlag } = this.props.afterConstructInfo.responses;
        return readOnlyFlag === undefined ?  false :  readOnlyFlag;
    }

    render() {
        const { navigation, afterConstructInfo, user, serverIp } = this.props;
        const { userName } = user.authorization;
        const { currentServerIp } = serverIp;
        const { isUploading, isFetching, responses }  = afterConstructInfo;
        const { displayCode, readOnlyFlag, recStatus, sggl_tag, sr_id,
            sr_endtime, sr_progress = 0, sr_reason, sr_endpic, sr_endpic_local, sr_end_remarks, sr_end_remarksList, 
            endCheckListData = [{}, ], olditemData, item_names, store_rooms
        } = responses && responses;
        const photosArray = this.isReadOnly() ? sr_endpic : sr_endpic_local;
        const checkListTableHeader = ["序号", "施工结束前检查项", "操作"];
        const oldItemsInfoTableHeader = ["备件序列号", "备件名称", "数量", "存放库房", "操作"];
        const checkListTableColWidthArr = [100, 830, 116];
        const oldItemsTableColWidthArr = [200, 210, 80, 435, 120];
        const checkListTableData = [];
        const oldItemTableData = [];
        const oldItemNames = [];
        const oldItemStores = [];
        const checkListDesc = [
            "变更完成后没有机柜之间非合理连线",
            "变更后机房环境清洁，无任何非生产设备及零配件留放机房",
            "变更未进行变更方案外的其他操作",
            "此次变更是否已完成",
            "变更未触发变更回退",
            "变更完成时间点是否在变更回退时间点之前",
            "变更完成后是否已经流转或关闭相应的运维工单",
        ];

        const commonRequestBody = {
            user: userName,
            displayCode,
            readOnlyFlag,
            sggl_tag,
            sr_id,
            recStatus,
        };

        for (let i in checkListDesc) {
            let tempArr = [], tempObj = {
                rowIndex: 0,
                desc: "",
                idDone: 1,
            };
            tempObj.rowIndex = parseInt(i, 10) + 1;
            tempObj.desc = checkListDesc[i];
            tempObj.idDone = endCheckListData[0] && endCheckListData[0][`sr_end_O${parseInt(i, 10) + 1}`];

            Object.entries(tempObj).forEach(([key, value]) => {
                tempArr.push(value);
            });

            checkListTableData.push(tempArr);
        }

        olditemData && olditemData.map((data) => {
            let tempArr = [], tempObj = {
                olditem_sn: "",
                olditem_name: "",
                olditem_num: "",
                olditem_kufang: "",
            };

            tempObj.olditem_sn = data.olditem_sn;
            tempObj.olditem_name = data.olditem_name;
            tempObj.olditem_num = data.olditem_num;
            tempObj.olditem_kufang = data.olditem_kufang;
            tempObj.delete = "";

            Object.entries(tempObj).forEach(([key, value]) => {
                tempArr.push(value);
            });

            oldItemTableData.push(tempArr);
        });

        item_names && item_names.map((data) => {
            oldItemNames.push({itemname:data});
        });

        store_rooms && store_rooms.map((data) => {
            oldItemStores.push({roomname:data});
				});
				
        const remarksList = sr_end_remarks !== null ? [{remarkname:sr_end_remarks}]:[{remarkname:""}];
        sr_end_remarksList && sr_end_remarksList.map((data) => {
            remarksList.push({remarkname:data});
        });
		

        const checkBoxEle = (index, value) => (
            <View style={checkBoxContainer}>
                <CheckBox disabled={this.isReadOnly()} style={[{ left: 0 }, this.isReadOnly() && disableOpacity]} color="#ff3300" checked={value === 1} onPress={() => {
                    this.props.triggerDoneAction(index + 1);
                }} />
            </View>
        );

        const cellEle = (rowIndex, itemName) => (
            <View style={[{ width: "100%" }]}>
                <Button disabled={this.isReadOnly()} style={[deleteBtnStyle, this.isReadOnly() && { opacity: 0.3 }]} danger transparent onPress={() => {
                    Alert.alert("提示", `确认删除该项备件？：${JSON.stringify(itemName)}`, [
                        { text: "取消", onPress: () => {}},
                        { text: "确认", onPress: () => {
                                this.props.deleteARowAction(rowIndex);
                            }},
                    ]);
                }}>
                    <Icon style={deleteIconStyle} name="md-remove-circle" />
                </Button>
            </View>
        );

        return <Container style={container}>
            <StatusBar hidden={true}/>
            <Header hasSegment>
                <Left style={{ flex: 1 }}>
                    {/*<Button transparent onPress={() => { console.log(photosArray); }}>*/}
                        {/*<Icon name="ios-arrow-back" style={arrowBackFontSize}/>*/}
                    {/*</Button>*/}
                </Left>

                <Body style={{ flex: 1, alignItems:"center" }}>
                <Title>施工结束前检查</Title>
                </Body>

                <Right style={{ flex: 1 }}><Text style={{ color: "white" }}>当前用户：{userName && userName}</Text></Right>
            </Header>
            <View style={[mainPosition]}>
                <View style={btnSideBarContainer}>
                    <View style={sideBarBtnContainer}>
                        <TouchableOpacity disabled={this.isReadOnly()} style={[sideBarBtn, this.isReadOnly() && disableOpacity]}
                                          onPress={() => {this.abnormalEndDialog.show();}}
                        >
                            <Icon style={[colorWhite, iconStyle]} name="close-circle" />
                            <Text style={[colorWhite, iconTextStyle]}>异常结束</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={sideBarBtnContainer}>
                        <TouchableOpacity
                            disabled={this.isReadOnly()}
                            style={[sideBarBtn, this.isReadOnly() && disableOpacity]}
                            onPress={() => {
                                Alert.alert("操作提示", "本次施工将退出，未保存的信息将丢失", [
                                    { text: "取消", onPress: () => {}},
                                    {
                                        text: "确认", onPress: () => {
                                            this.props.exitConstructAction(formUrlEncoded(commonRequestBody));
                                        }
                                    },
                                ]);
                            }}
                        >
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
                                    <View><H3>施工信息</H3></View>
                                </View>
                                <View style={[{ flexDirection: "row" }]}>
                                    <View style={{ flex: 1, flexDirection: "row" }}>
                                        <View style={[lineTitle]}>
                                            <Text>施工结束时间<Label style={{color: "red"}}>  *</Label></Text>
                                        </View>
                                        <View style={[lineContent, { flex: 3 }]}>
                                            <View style={[inputLineContainer, dateTimeLineContainer]}>
                                                <Item regular>
                                                    <DatePicker
                                                        style={styles.inputFieldStyle}
                                                        placeholder="点击选择日期时间"
                                                        locale={"zh-cn"}
                                                        mode="datetime"
                                                        format="YYYY-MM-DD HH:mm:ss"
                                                        onDateChange={this.props.setEndTimeAction}
                                                        date={sr_endtime}
                                                        disabled={this.isReadOnly()}
                                                        customStyles={{
                                                            dateInput: styles.dateInput,
                                                            dateText: styles.dateText,
                                                            placeholderText: styles.placeHolderText,
                                                        }}
                                                    />
                                                </Item>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: "row" }}>
                                        <View style={lineTitle}>
                                            <Text>作业完成百分比<Label style={{color: "red"}}>  *</Label></Text>
                                        </View>
                                        <View style={[lineContent, { flex: 2.5 }]}>
                                            <View style={[inputLineContainer]}>
                                                <Slider disabled={this.isReadOnly()} style={[styles.sliderStyle]} thumbTintColor="#f30" minimumTrackTintColor="#f30" onSlidingComplete={(value) => this.props.setProgressAction(parseInt(value, 10)) } maximumValue={100} minimumValue={0} set={1} value={parseInt(sr_progress !== null ? sr_progress : 0 , 10)} />
                                            </View>
                                        </View>
                                        <Text style={{ color: "#f30", alignSelf: "center" }}>{`${sr_progress}%`}</Text>
                                    </View>
                                </View>
                                <View style={[{ flexDirection: "row", width: "50%" }]}>
                                    <View style={lineTitle}>
                                        <Text>未完成原因</Text>
                                    </View>
                                    <View style={[lineContent, { flex: 3 }]}>
                                        <View style={[inputLineContainer, { width: "80%" }]}>
                                            <Item regular>
                                                <Input disabled={this.isReadOnly()} onChangeText={(text) => this.props.setReasonAction(text) } value={sr_reason} />
                                            </Item>
                                        </View>
                                    </View>
                                </View>
                                <View style={sectionGap}>{}</View>
                                <View style={[contentTitle]}>
                                    <View style={indexBarStyle}>{}</View>
                                    <View style={{ flexDirection: "row" }}><H3>结束前检查项</H3><Label style={{color: "red"}}>  *</Label></View>
                                </View>
                                <View style={tableContainer}>
                                    <Table borderStyle={{ borderColor: "#E4E4E4" }}>
                                        <Row data={checkListTableHeader} style={tableHeader} flexArr={checkListTableColWidthArr}
                                             textStyle={rowTextStyle}/>
                                    </Table>
                                    <Table  borderStyle={{ borderColor: "#E4E4E4" }}>
                                        {
                                            checkListTableData.map((row, index) => {
                                                return <TableWrapper key={index}
                                                                     style={[ tableWrapperStyle, index % 2 && { backgroundColor: "#F2F2F2" } ]}>
                                                    {
                                                        row.map((cellData, cellIndex) => {
                                                            return <Cell key={cellIndex}
                                                                         data={cellIndex === 2 ? checkBoxEle(index, cellData) : cellData}
                                                                         style={{ flex: checkListTableColWidthArr[ cellIndex ], borderColor: "#E4E4E4" }}
                                                                         textStyle={[ rowTextStyle ]}/>;
                                                        })
                                                    }
                                                </TableWrapper>;
                                            })
                                        }
                                    </Table>
                                </View>
                                <View style={sectionGap}>{}</View>
                                <View style={[contentTitle]}>
                                    <View style={indexBarStyle}>{}</View>
                                    <View style={{ flexDirection: "row" }}><H3>旧备件信息</H3><Label style={{color: "red"}}>  *</Label></View>
                                </View>
                                <View style={tableContainer}>
                                    <Table borderStyle={{ borderColor: "#E4E4E4" }}>
                                        <Row data={oldItemsInfoTableHeader} style={tableHeader} flexArr={oldItemsTableColWidthArr}
                                             textStyle={rowTextStyle}/>
                                    </Table>
                                    <Table  borderStyle={{ borderColor: "#E4E4E4" }}>
                                        {
                                            oldItemTableData.map((row, index) => {
                                                return <TableWrapper key={index}
                                                                     style={[ tableWrapperStyle, index % 2 && { backgroundColor: "#F2F2F2" } ]}>
                                                    {
                                                        row && row.map((cellData, cellIndex) => {
                                                            return <Cell key={cellIndex}
                                                                         data={cellIndex === 4 ? cellEle(index, row[1]) : cellData}
                                                                         style={{ flex: oldItemsTableColWidthArr[ cellIndex ], borderColor: "#E4E4E4" }}
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
                                                            this.addOldItemsDialog.show();
                                                        }} style={addNewItemStyle}>
                                                    <Text>+新增备件信息</Text>
                                                </Button>
                                            </View>
                                        )
                                    }
                                </View>
                                <View style={sectionGap}>{}</View>
                                <View style={[contentTitle]}>
                                    <View style={indexBarStyle}>{}</View>
                                    <View style={{ flexDirection: "row" }}><H3>拍照上传</H3><Label style={{color: "red"}}>  *</Label></View>
                                </View>
                                <View style={[iconLineContainer]}>
                                    {
                                        renderIf(!this.isReadOnly())(
                                            <TouchableOpacity style={[peoIconMainStyle, addPeopleBtn, styles.photoMain]}
                                                              onPress={() => {
                                                                  ActionSheet.show({
                                                                      options: ["拍摄", "相册", "取消"],
                                                                      cancelButtonIndex: 2,
                                                                      title: "施工现场拍摄"
                                                                  }, buttonIndex => {
                                                                      if (buttonIndex === 0) {
                                                                          this.takePic();
                                                                      }
                                                                      else if (buttonIndex === 1) {
                                                                          this.selectPic();
                                                                      }
                                                                  });
                                                              }}
                                            >
                                                <Icon name="md-camera" style={[colorMain, styles.cameraIcon]}/>
                                            </TouchableOpacity>
                                        )
                                    }
                                    <ScrollView horizontal={true}>
                                        {
                                            photosArray && photosArray.filter(url => {
                                                return url !== "";
                                            }).map((localUri, index) => {
                                                return <View key={`pic_${index}`}>
                                                    <TouchableOpacity style={[ peoIconMainStyle, peoPic, styles.photoMain ]} onPress={() => {
                                                        this.setState({ picIndex: index, modalVisible: true });
                                                    }}>
                                                        <Image source={{ uri: this.isReadOnly() ? `http://${currentServerIp}/nzx/yunwei/sggl_new/${localUri}` : localUri, width: "100%", height: "100%" }} />
                                                    </TouchableOpacity>
                                                    {
                                                        renderIf(!this.isReadOnly())(
                                                            <TouchableOpacity style={[ deletePicBtn, styles.deletePhotoBtn ]} onPress={() => {
                                                                Alert.alert("操作提示", "删除该照片？", [
                                                                    { text: "取消", onPress: () => {}},
                                                                    {
                                                                        text: "确认", onPress: () => {
                                                                            this.props.deletePhotoAction(localUri.slice(localUri.lastIndexOf("/") + 1)); // 使用图片名
                                                                            (async() => {
                                                                                let album = await MediaLibrary.getAlbumAsync("标准化施工");
                                                                                let assetsObj = await MediaLibrary.getAssetsAsync({
                                                                                    first: 500,
                                                                                    album: album,
                                                                                    mediaType: MediaLibrary.MediaType.photo,
                                                                                });
                                                                                let willDeleteAsset = assetsObj.assets.filter(asset => { return asset.uri.includes(localUri); });
                                                                                let deleteResult = await MediaLibrary.deleteAssetsAsync([willDeleteAsset[0].id]);
                                                                                if (deleteResult) {
                                                                                    toaster.showToast("照片删除成功！");
                                                                                } else {
                                                                                    toaster.showToast("照片删除发生错误！");
                                                                                }
                                                                            })();
                                                                        }
                                                                    },
                                                                ]);
                                                            }}>
                                                                <Icon name="ios-close-circle"
                                                                      style={[ colorMain, deleteIcon ]}/>
                                                            </TouchableOpacity>
                                                        )
                                                    }
                                                </View>;
                                            })
                                        }
                                    </ScrollView>
                                </View>
                                <View style={sectionGap}>{}</View>
                                <View style={[contentTitle]}>
                                    <View style={indexBarStyle}>{}</View>
                                    <View><H3>备注信息</H3></View>
                                </View>
																<View style={{borderWidth: 1,borderColor:"#E5E5E5"}}>
                                    <Picker
                                        style={{ height: 50, width: "100%" }}
                                        onValueChange={itemValue => this.props.remarkUpdatesAction(itemValue) }>
                                        {remarksList.map((item, key) => {
                                            return <Picker.Item label={`${item.remarkname}`} value={item.remarkname} key={key} />;
                                        })}
                                    </Picker>
                                </View>
                                <View>
                                    <Textarea disabled={this.isReadOnly()} onChangeText={(text) => this.props.remarkUpdatesAction(text) } value={sr_end_remarks} rowSpan={3} bordered placeholder="施工结束前备注信息" />
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
                                onPress={()=> {
                                    if (recStatus === 2) {
                                        this.props.backToHistoryPageAction();
                                    } else {
                                        let tempOldTools = cloneDeep(olditemData);
                                        let formattedItems = {
                                            olditem_sn: [],
                                            olditem_name: [],
                                            olditem_num: [],
                                            olditem_kufang: [],
                                        };
                                        tempOldTools.map(data => {
                                            formattedItems.olditem_sn.push(data.olditem_sn);
                                            formattedItems.olditem_name.push(data.olditem_name);
                                            formattedItems.olditem_num.push(data.olditem_num);
                                            formattedItems.olditem_kufang.push(data.olditem_kufang);
                                        });
                                        this.props.confirmSupervisionAction(formUrlEncoded({
                                            user: userName,
                                            displayCode,
                                            readOnlyFlag,
                                            // sggl_tag, in endCheckListData
                                            // sr_id,
                                            recStatus,
                                            sr_endtime,
                                            sr_progress,
                                            sr_reason,
                                            sr_endpic: sr_endpic && ( (sr_endpic.length === 1 && sr_endpic[0] === "") ? [""] : [...sr_endpic].filter(item => { return item !== ""; }) ),
                                            sr_endpic_local: sr_endpic_local && ( (sr_endpic_local.length === 1 && sr_endpic_local[0] === "") ? [""] : [...sr_endpic_local].filter(item => { return item !== ""; }) ),
                                            sr_end_remarks,
                                            ...endCheckListData[0],
                                            ...formattedItems, // 旧备件
                                        }, { ignorenull : true, skipIndex: true, sorted: false }));
                                    }
                                }}
                        >
                            <Text style={colorWhite}>{["提  交  保  存", "提  交  保  存", "完  成"][recStatus]}</Text>
                        </Button>
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
            <ProgressDialog
                visible={ isUploading }
                title="图片上传"
                message="上传中，请稍后..."
                dialogStyle={progressDialogStyle}
                overlayStyle={theHeight}
            />
            <PopupDialog
                ref={(popupDialog) => {
                    this.addOldItemsDialog = popupDialog;
                }}
                overlayOpacity={0.5}
                containerStyle={popUpDialogOverBtn}
                width={0.5}
                height={0.55}
                onShown={() => {
                }}
            >
                <View style={inContentStyle}>
                    { <AddOldItemsForm itemNames={oldItemNames} roomNames={oldItemStores} onClose={(values) => this.closeDialog(values)} /> }
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

            <Modal style={{ width: "100%", height: "100%" }} isOpen={this.state.modalVisible} transparent={true} onRequestClose={() => this.setState({ modalVisible: false })}>
                <ImageViewer
                    imageUrls={
                        this.isReadOnly() ? sr_endpic && sr_endpic.map(uri => {
                            return { url: `http://${currentServerIp}/nzx/yunwei/sggl_new/${uri}`, freeHeight: true };
                        }) : sr_endpic_local && sr_endpic_local.map(uri => {
                            return { url: uri, freeHeight: true };
                        })
                    }
                    index={this.state.picIndex}
                    enableSwipeDown={true}
                    onSwipeDown={() =>{ this.setState({modalVisible: false}); }}
                    onClick={()=>{ this.setState({modalVisible: false}); }}
                />
            </Modal>
        </Container>;
    }
}

export default ToCheckAfterConstructScreen;
