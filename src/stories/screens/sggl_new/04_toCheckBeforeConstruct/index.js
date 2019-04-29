import * as React from "react";
import { View, StatusBar, ScrollView, TouchableOpacity, Alert, Image, Picker } from "react-native";
import { FileSystem,ImagePicker, Permissions, MediaLibrary } from "expo";
import { Container, Text, Button, Header, Left, Icon, Body, Title, Right, H3, CheckBox, Label, Textarea, Item, Input, ActionSheet, Form } from "native-base";
import PopupDialog from "react-native-popup-dialog";
import ProgressDialog from "react-native-simple-dialogs/src/ProgressDialog";
import DatePicker from "react-native-datepicker";
import ImageViewer from "react-native-image-zoom-viewer";
import Modal from "react-native-modalbox";
import { toaster } from "../../../../services/utils/toastUtils";
import { Row, Table, TableWrapper, Cell } from "react-native-table-component";
import { isEmpty, head } from "lodash";
import formUrlEncoded from "form-urlencoded";
import renderIf from "../../../../services/utils/renderIf";

// styles
import todoStyles from "../../../../styles/todoPages";
import styles from "./styles";
import cStyles from "../../../../styles/dealWithPages";
import commonStyles from "../../../../styles/commonStyles";
import aInputDialogStyle from "../../../../styles/aInputDialog";
const { arrowBackFontSize, progressDialogStyle, theHeight } = cStyles;
const { sideBarBtn, disableOpacity } = commonStyles;

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
    peoIconMainStyle, peoPic, peoPicIcon, picHoverName, deletePicBtn, deleteIcon,
    dateTimeLineContainer, addPeopleBtn, colorMain,
    addOperatorDialogContent, addItem, addItemBtn, addItemText,
    inputDialogContainer, inputDialogContent, inputDialogBtn, inputDialogBtnContainer, inputDialogText,
} = styles;

const {  dialogStyle, textAndInputContainer, textContainer,
    dialogText, dialogInputStyle, dialogBtnContainer,
    dialogBtn, dialogCancelBtn, dialogBtnText,
} = aInputDialogStyle;

const {
    popUpDialogOverBtn,
} = todoStyles;


export interface Props {
    navigation: any,
    addOperatorAction: any,
    deleteOperatorAction: any,
    triggerDoneAction: any,
    dateUpdateAction: any,
    rackUpdateAction: any,
    remarkUpdatesAction: any,
    addPhotoAction: Function,
    deletePhotoAction: Function,
    beforeConstructInfo: Object,
}

export interface State {
    deletedOperators: Array,
    currentOpType: String,
    newName: String,
    avatarSource: Array,
    modalVisible: Boolean,
    picIndex: Number,
}

class ToCheckBeforeConstructScreen extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            newName: "",
            currentOpType: "", // 人员类型
            deletedOperators: [],
            avatarSource: [], // 图片对象
            picIndex: 0,
						modalVisible: false,
        };
    }

    albumNameGetter() {
        return `标准化施工图片/标准化施工_${this.props.navigation.getParam("sr_id")}`;
    }

    addPeopleFunc(peoType, name) {
        this.props.addOperatorAction({
            key: peoType,
            name: name,
        });
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

    _setImage(uri) {
        this.props.addPhotoAction(uri);
    }

    isReadOnly() {
        const { readOnlyFlag } = this.props.beforeConstructInfo.responses;
        return readOnlyFlag === undefined ?  false :  readOnlyFlag;
    }

    async _isFileExists(url){
      const res = await FileSystem.getInfoAsync(url, null);
      return res.exists;
    }

    render() {
        const { navigation, beforeConstructInfo, user, serverIp } = this.props;
        const { userName } = user.authorization;
        const { currentServerIp } = serverIp;
        const { isFetching, responses }  = beforeConstructInfo;
        const { displayCode, readOnlyFlag, recStatus, checkListData, checkData = [{}, ] } = responses;
        const { sr_sg_tag, sr_id, sr_remarks, sr_remarksList, sr_bgtime, sr_rack, sr_opers, sr_man3, sr_man2, sr_man1, sr_prepic, sr_prepic_local } = checkData[0];
        const photosArray = this.isReadOnly() ? sr_prepic : sr_prepic_local;
        const operatorsArr = !isEmpty(sr_opers) && sr_opers.split(",");
        const man3Arr = !isEmpty(sr_man3) && sr_man3.split(","); // 财险值班人员
        const man2Arr = !isEmpty(sr_man2) && sr_man2.split(","); // 施工方
				const man1Arr = !isEmpty(sr_man1) && sr_man1.split(","); // 监理方
        const checkListTableHeader = ["序号", "施工前检查项", "操作"];
        const checkListTableColWidthArr = [100, 830, 116];
        const checkListTableData = [];
        const checkListDesc = [
            "工单是否审批通过",
            "施工方、财险值班人员和运维团队按时到达机房楼现场",
            "是否穿戴鞋套和消除静电",
            "变更所需备件已到位,有配件更换",
            "实际进场施工人员包含在工单的“施工人员名单中”",
            "进入机房人员未携带易燃易爆、食品饮料等违禁用品",
            "作业区域是否按要求布置隔离带",
        ];
        const imageUrls = photosArray && [ ...photosArray ].filter(url => {
          return url !== "";
        }).map(uri => {
            return {
                url: this.isReadOnly() ? `http://${currentServerIp}/nzx/yunwei/sggl_new/${uri}` : uri,
                freeHeight: true
            };
        });
        const commonRequestBody = {
            user: userName,
            displayCode,
            readOnlyFlag,
            sggl_tag: sr_sg_tag,
            sr_id,
            recStatus,
				};
				
        const remarksList = sr_remarks !==null ? [{remarkname:sr_remarks}] : [{remarkname:""}];
        sr_remarksList && sr_remarksList.map((data) => {
            remarksList.push({remarkname:data});
        });
		
        for (let i in checkListDesc) {
            let tempArr = [], tempObj = {
                rowIndex: 0,
                desc: "",
                idDone: 1,
            };
            tempObj.rowIndex = parseInt(i, 10) + 1;
            tempObj.desc = checkListDesc[i];
            tempObj.idDone = responses.checkListData && responses.checkListData[0][`sr_O${parseInt(i, 10) + 1}`];

            Object.entries(tempObj).forEach(([key, value]) => {
                tempArr.push(value);
            });

            checkListTableData.push(tempArr);
        }

        const checkBoxEle = (index, value) => (
            <View style={checkBoxContainer}>
                <CheckBox disabled={this.isReadOnly()} style={[{ left: 0 }, this.isReadOnly() && disableOpacity]} color="#ff3300" checked={value === 1} onPress={() => {
                    this.props.triggerDoneAction(index + 1);
                }} />
            </View>
        );

        const addPeopleModel = (peoType) => (
            <TouchableOpacity style={[peoIconMainStyle, addPeopleBtn]}
                              onPress={() => {
                                  this.setState({ currentOpType: peoType });
                                  this.addOperatorDialog.show();
                              }}
            >
                <Icon name="md-person-add" style={colorMain}/>
            </TouchableOpacity>
        );
        
        const applyman = (data) => {
            return <View key={"0"}>
                <View style={[peoIconMainStyle, peoPic]}>
                    <Icon name="md-person" style={peoPicIcon}/>
                </View>
                <View style={picHoverName}>
                    <Text style={colorWhite}>{data}</Text>
                </View>
            </View>;
        }

        const peoples = (arr, peoType) => (
            arr.length > 0 &&  arr.map( (data, index) => {
                return <View key={`o_${index}`}>
                    <View style={[peoIconMainStyle, peoPic]}>
                        <Icon name="md-person" style={peoPicIcon}/>
                    </View>
                    <View style={picHoverName}>
                        <Text style={colorWhite}>{data}</Text>
                    </View>
                    {
                        renderIf(!this.isReadOnly())(
                            <TouchableOpacity style={[deletePicBtn]}
                                              onPress={() => {
                                                  Alert.alert("操作提示", `删除用户：${data}？`, [
                                                      { text: "取消", onPress: () => {}},
                                                      { text: "确认", onPress: () => {
                                                              this.setState({
                                                                  deletedOperators: this.state.deletedOperators.concat(data)
                                                              });
                                                              this.props.deleteOperatorAction({
                                                                  key: peoType,
                                                                  name: data,
                                                              });
                                                          }},
                                                  ]);
                                              }}
                            >
                                <Icon name="ios-close-circle" style={[colorMain, deleteIcon]}/>
                            </TouchableOpacity>
                        )
                    }
                </View>;
            })
        );

        return <Container style={container}>
            <StatusBar hidden={true}/>
            <Header hasSegment>
                <Left style={{ flex: 1 }}>
                    {/*<Button transparent onPress={() => navigation.goBack()}>*/}
                        {/*<Icon name="ios-arrow-back" style={arrowBackFontSize}/>*/}
                    {/*</Button>*/}
                </Left>

                <Body style={{ flex: 1, alignItems:"center" }}>
                <Title>施工前检查</Title>
                </Body>

                <Right style={{ flex: 1 }}><Text style={{ color: "white" }}>当前用户：{userName && userName}</Text></Right>
            </Header>
            <View style={[mainPosition]}>
                <View style={btnSideBarContainer}>
                    <View style={sideBarBtnContainer}>
                        <TouchableOpacity style={[sideBarBtn, this.isReadOnly() && disableOpacity]}
                                          onPress={() => {this.abnormalEndDialog.show();}}
                                          disabled={this.isReadOnly()}
                        >
                            <Icon style={[colorWhite, iconStyle]} name="close-circle" />
                            <Text style={[colorWhite, iconTextStyle]}>异常结束</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={sideBarBtnContainer}>
                        <TouchableOpacity style={[sideBarBtn, this.isReadOnly() && disableOpacity]}
                                          disabled={this.isReadOnly()}
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
                                <View style={[{ flexDirection: "row" }]}>
                                    <View style={lineTitle}>
                                        <Text>实际入场人员名单<Label style={{color: "red"}}>  *</Label></Text>
                                    </View>
                                    <View style={lineContent}>
                                        <View style={[iconLineContainer]}>
                                            { renderIf(!this.isReadOnly())(addPeopleModel("sr_opers")) }
                                            {
                                                peoples(operatorsArr, "sr_opers")
                                            }
                                        </View>
                                    </View>
                                </View>
                                <View style={[{ flexDirection: "row" }]}>
                                    <View style={lineTitle}>
                                        <Text>财险值班人员<Label style={{color: "red"}}>  *</Label></Text>
                                    </View>
                                    <View style={lineContent}>
                                        <View style={[iconLineContainer]}>
                                            { renderIf(!this.isReadOnly())(addPeopleModel("sr_man3")) }
                                            {
                                                peoples(man3Arr, "sr_man3")
                                            }
                                        </View>
                                    </View>
                                </View>
                                <View style={[{ flexDirection: "row" }]}>
                                    <View style={lineTitle}>
                                        <Text>申请人<Label style={{color: "red"}}>  *</Label></Text>
                                    </View>
                                    <View style={lineContent}>
                                        <View style={[iconLineContainer]}>
                                            {
                                               man2Arr && man2Arr.length > 0 && applyman(man2Arr[0])
                                            }
                                        </View>
                                    </View>
                                </View>
                                <View style={[{ flexDirection: "row" }]}>
                                    <View style={lineTitle}>
                                        <Text>监理人<Label style={{color: "red"}}>  *</Label></Text>
                                    </View>
                                    <View style={lineContent}>
                                        <View style={[iconLineContainer]}>
                                            { renderIf(!this.isReadOnly())(addPeopleModel("sr_man1")) }
                                            {
                                                peoples(man1Arr, "sr_man1")
                                            }
                                        </View>
                                    </View>
                                </View>
                                <View style={[{ flexDirection: "row" }]}>
                                    <View style={lineTitle}>
                                        <Text>施工开始时间<Label style={{color: "red"}}>  *</Label></Text>
                                    </View>
                                    <View style={lineContent}>
                                        <View style={[inputLineContainer, dateTimeLineContainer]}>
                                            <Item regular>
                                                <DatePicker
                                                    style={styles.inputFieldStyle}
                                                    placeholder="点击选择日期时间"
                                                    locale={"zh-cn"}
                                                    mode="datetime"
                                                    format="YYYY-MM-DD HH:mm:ss"
                                                    onDateChange={this.props.dateUpdateAction}
                                                    date={sr_bgtime}
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
                                <View style={[{ flexDirection: "row" }]}>
                                    <View style={lineTitle}>
                                        <Text>作业区域核实<Label style={{color: "red"}}>  *</Label></Text>
                                    </View>
                                    <View style={lineContent}>
                                        <View style={[inputLineContainer]}>
                                            <Item regular>
                                                <Input disabled={this.isReadOnly()} onChangeText={(text) => this.props.rackUpdateAction(text) } value={sr_rack} />
                                            </Item>
                                        </View>
                                    </View>
                                </View>
                                <View style={sectionGap}>{}</View>
                                <View style={[contentTitle]}>
                                    <View style={indexBarStyle}>{}</View>
                                    <View><H3>施工前检查项</H3></View>
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
                                                                { text: "取消", onPress: () => { navigation.goBack(); }},
                                                                { text: "确认", onPress: () => {
                                                                        this.props.deletePhotoAction(localUri.slice(localUri.lastIndexOf("/") + 1));  // 使用图片名
                                                                        (async() => {
                                                                            let album = await MediaLibrary.getAlbumAsync(this.albumNameGetter());
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
                                                                    }},
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
                                    <Textarea disabled={this.isReadOnly()} onChangeText={(text) => this.props.remarkUpdatesAction(text) } value={sr_remarks} rowSpan={3} bordered placeholder="施工前备注信息" />
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
                        <Button bordered style={footerBtnStyle}
                                onPress={() => {this.props.navigation.goBack();}}
                        >
                            <Text style={colorWhite}>上一步</Text>
                        </Button>
                        <Button bordered style={footerBtnStyle} onPress={() => {
                            if (recStatus === 2) {
                                navigation.navigate("sggl_10", {
                                    requestParams: formUrlEncoded(commonRequestBody, { ignorenull : true, skipIndex: true, sorted: false }),
                                });
                            } else {
                                let formattedData = {
                                    ...checkListData[0],
                                    ...checkData[0],
                                    user: userName,
                                    displayCode,
                                    readOnlyFlag,
                                    sggl_tag: sr_sg_tag, 
                                    sr_id,
                                    recStatus,
                                    sr_prepic: (sr_prepic.length === 1 && sr_prepic[0] === "") ? [""] : [...sr_prepic].filter(item => { return item !== ""; }),
                                    sr_prepic_local: (sr_prepic_local.length === 1 && sr_prepic_local[0] === "") ? [""] : [...sr_prepic_local].filter(item => { return item !== ""; }),
                                };
                                console.log("formatted data: ", formattedData);
                                // console.log("form format", formUrlEncoded(formattedData, { ignorenull : true, skipIndex: true, sorted: false }));
                                navigation.navigate("sggl_07", {
                                    requestParams: formUrlEncoded(formattedData, { ignorenull : true, skipIndex: true, sorted: false }),
                                });
                            }
                        }}>
                            <Text style={colorWhite}>下一步</Text>
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

            <PopupDialog
                ref={(popupDialog) => {
                    this.addOperatorDialog = popupDialog;
                }}
                overlayOpacity={0.5}
                containerStyle={popUpDialogOverBtn}
                width={0.15}
                height={0.55}
                onShown={() => {
                }}
            >
                <View style={[addOperatorDialogContent]}>
                    <View style={[addItem]}>
                        <TouchableOpacity style={[addItemBtn]} onPress={() => {
                            this.addOperatorDialog.dismiss();
                            this.addOperatorInputDialog.show();
                        }}>
                            <Text style={addItemText}>添加其他人员</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        {
                            this.state.deletedOperators.map((data, index) => {
                                return <View key={`i_${index}`} style={[addItem]}>
                                    <TouchableOpacity style={[addItemBtn]} onPress={() => {
                                        this.setState({
                                            deletedOperators: this.state.deletedOperators.filter(item => {
                                                return item !== data;
                                            })
                                        });
                                        this.addPeopleFunc(this.state.currentOpType, data);
                                        this.addOperatorDialog.dismiss();
                                    }}>
                                        <Text style={addItemText}>{data}</Text>
                                    </TouchableOpacity>
                                </View>;
                            })
                        }
                    </ScrollView>
                </View>
            </PopupDialog>

            {/*人员输入框弹窗*/}
            <PopupDialog
                ref={(popupDialog) => {
                    this.addOperatorInputDialog = popupDialog;
                }}
                overlayOpacity={0.5}
                containerStyle={popUpDialogOverBtn}
                width={0.3}
                height={0.3125}
                onShown={() => {
                    this.setState({ newName: "" });
                }}
            >
                <View style={[inputDialogContainer]}>
                    <View style={[inputDialogContent]}>
                        <Text style={inputDialogText}>请输入新增人员姓名：</Text>
                        <Item regular>
                            <Input onChangeText={(text) => this.setState({ newName: text})} value={this.state.newName} />
                        </Item>
                        <View style={[inputDialogBtnContainer]}>
                            <Button light style={inputDialogBtn} onPress={() => { this.addOperatorInputDialog.dismiss(); }}>
                                <Text>取  消</Text>
                            </Button>
                            <Button
                                light
                                disabled={this.state.newName.length === 0}
                                onPress={() => {
                                    this.addOperatorInputDialog.dismiss();
                                    this.addPeopleFunc(this.state.currentOpType, this.state.newName);
                                    this.setState({
                                        deletedOperators: this.state.deletedOperators.filter(item => {
                                            return item !== this.state.newName;
                                        })
                                    });
                                }}
                                style={inputDialogBtn}
                            >
                                <Text>确  定</Text>
                            </Button>
                        </View>
                    </View>
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
                <ImageViewer imageUrls={imageUrls} index={this.state.picIndex} enableSwipeDown={true} onSwipeDown={() =>{ this.setState({modalVisible: false}); }}
                  onClick={()=>{ this.setState({modalVisible: false}); }}
                />
            </Modal>
        </Container>;
    }
}

export default ToCheckBeforeConstructScreen;
