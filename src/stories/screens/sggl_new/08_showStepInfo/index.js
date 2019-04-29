import * as React from "react";
import { View, StatusBar, ScrollView, TouchableOpacity, Alert, Image, Picker } from "react-native";
import { FileSystem,ImagePicker, Permissions, MediaLibrary } from "expo";
import { Container, Text, Button, Header, Left, Icon, Body, Title, Right, H3, Radio, Label, Textarea, Item, ActionSheet, Form, Input, } from "native-base";
import ProgressDialog from "react-native-simple-dialogs/src/ProgressDialog";
import DatePicker from "react-native-datepicker";
import ImageViewer from "react-native-image-zoom-viewer";
import Modal from "react-native-modalbox";
import { toaster } from "../../../../services/utils/toastUtils";
import { head } from "lodash";
import formUrlEncoded from "form-urlencoded";

// styles
const { progressDialogStyle, theHeight } = cStyles;
import styles from "./styles";
import cStyles from "../../../../styles/dealWithPages";
import commonStyles from "../../../../styles/commonStyles";
import renderIf from "../../../../services/utils/renderIf";
import PopupDialog from "react-native-popup-dialog";
import aInputDialogStyle from "../../../../styles/aInputDialog";

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
    contentTitle,
    iconLineContainer, inputLineContainer, lineTitle, lineContent,
    peoIconMainStyle, peoPic, deletePicBtn, deleteIcon,
    dateTimeLineContainer, addPeopleBtn, colorMain,
} = styles;

const {  dialogStyle, textAndInputContainer, textContainer,
    dialogText, dialogInputStyle, dialogBtnContainer,
    dialogBtn, dialogCancelBtn, dialogBtnText,
} = aInputDialogStyle;

export interface Props {
    navigation: any;
    startDateUpdateAction: Function;
    finishDateUpdateAction: Function;
    triggerResultAction: Function;
    triggerSiteAction: Function;
}

export interface State {
    picsSource: Array;
    modalVisible: Boolean;
    picsModalVisible: Boolean;
    picIndex: Number;
}

class ShowStepInfoScreen extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            picsSource: [], // 浏览照片
            modalVisible: false,
            picsModalVisible: false,
            picIndex: 0,
            errorText: "",
        };
    }

    _scroll;

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
        console.log("selectedAsset", selectedAsset);
        head(selectedAsset) && this._setImage(head(selectedAsset).uri);
    };

    _setImage(uri) {
        this.props.addPhotoAction(uri);
    }

    isReadOnly() {
        const { readOnlyFlag } = this.props.showStepInfo.responses;
        return readOnlyFlag === undefined ?  false :  readOnlyFlag;
    }

    render() {
        const { navigation, showStepInfo, user, serverIp } = this.props;
        const { userName } = user.authorization;
        const { currentServerIp } = serverIp;
        const { isFetching, responses }  = showStepInfo;
        const { displayCode, readOnlyFlag, recStatus, sggl_tag, sr_id, bzData = [{}, ] } = responses && responses;
        const {
            sc_bz_step, sc_tag, sc_bz_name, sc_bz_text, sc_bz_pic_path,
            sc_bz_normaltext, sc_bz_normaltext_pic_path,
            sc_bz_errotext, sc_bz_errotext_pic_path, jlData = [{}, ],
            sc_bz_step_pre, sc_bz_step_next
        } = bzData[0];
        const { sr_bz_startTime, sr_bz_endTime, bz_jieguo, bz_site, sr_remark_bz, sr_remark_bzList, sr_jianlipic, sr_jianlipic_local, } = jlData[0];
        const photosArray = this.isReadOnly() ? sr_jianlipic : sr_jianlipic_local;
        // request body
        const formattedData = {
            user: userName,
            displayCode,
            readOnlyFlag,
            sggl_tag,
            sr_id,
            recStatus,
            sc_tag,
            sc_bz_step: sc_bz_step_next ? sc_bz_step_next : sc_bz_step,
            sr_isPreStep: false,
            sr_bz_startTime,
            sr_bz_endTime,
            bz_jieguo,
            bz_site,
            sr_remark_bz,
            sr_jianlipic: sr_jianlipic && ( (sr_jianlipic.length === 1 && sr_jianlipic[0] === "") ? [""] : [...sr_jianlipic].filter(item => { return item !== ""; }) ),
            sr_jianlipic_local: sr_jianlipic_local && ( (sr_jianlipic_local.length === 1 && sr_jianlipic_local[0] === "") ? [""] : [...sr_jianlipic_local].filter(item => { return item !== ""; }) ),
        };
        
        const commonRequestBody = {
            user: userName,
            displayCode,
            readOnlyFlag,
            sggl_tag,
            sr_id,
            recStatus,
        };

        const imageUrls = photosArray && [ ...photosArray ].filter(url => {
            return url !== "";
        }).map(uri => {
            return {
                url: uri,
                freeHeight: true
            };
        }); 

        const remarksList = sr_remark_bz !== null ? [{remarkname:sr_remark_bz}] : [{remarkname:""}];
        sr_remark_bzList && sr_remark_bzList.map((data) => {
            remarksList.push({remarkname:data});
        });

        // 侧向图集
        const PicRoll = (picList, paths) => (
            <View style={[picList && picList.length > 0 && iconLineContainer]}>
                <ScrollView horizontal={true}>
                    {
                        picList && picList.map((picObj, index) => {
                            return <View key={`pic_${index}`}>
                                <TouchableOpacity style={[ peoIconMainStyle, peoPic, styles.photoMain ]} onPress={() => {
                                    this.setState({
                                        picIndex: index,
                                        picsModalVisible: true,
                                        picsSource: paths.map(url => {
                                            return {
                                                url: `http://${currentServerIp}/nzx/yunwei/scgl/${url}`,
                                                freeHeight: true,
                                            };
                                        })
                                    });
                                }}>
                                    <Image source={{ uri: `http://${currentServerIp}/nzx/yunwei/scgl/${picObj.url}`, width: "100%", height: "100%" }} />
                                </TouchableOpacity>
                            </View>;
                        })
                    }
                </ScrollView>
            </View>
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
                <Title>步骤{sc_bz_step}: {sc_bz_name}</Title>
                </Body>

                <Right style={{ flex: 1 }}><Text style={{ color: "white" }}>当前用户：{userName && userName}</Text></Right>
            </Header>
            <View style={[mainPosition]}>
                <View style={btnSideBarContainer}>
                    <View style={sideBarBtnContainer}>
                        <TouchableOpacity style={[sideBarBtn, this.isReadOnly() && disableOpacity]}
                                          disabled={this.isReadOnly()}
                                          onPress={() => {
                                              this.abnormalEndDialog.show();
                                          }}
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
                    <View style={sideBarBtnContainer}>
                        <TouchableOpacity
                            style={[sideBarBtn, this.isReadOnly() && disableOpacity]}
                            disabled={this.isReadOnly()}
                            onPress={() => {
                                navigation.navigate("sggl_12", {
                                    requestParams: formUrlEncoded({
                                        user: userName,
                                        displayCode,
                                        readOnlyFlag,
                                        sggl_tag,
                                        sr_id,
                                        recStatus,
                                        sc_tag,
                                    }, { ignorenull : true, skipIndex: true, sorted: false }),
                                });
                            }}
                        >
                            <Icon style={[colorWhite, iconStyle]} name="book" />
                            <Text style={[colorWhite, iconTextStyle]}>手册说明</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={contentContainer}>
                    <View style={contentStyle}>
                        <View style={[inContentStyle]}>
                            <ScrollView ref={(scroll) => this._scroll = scroll}>
                                <View style={[contentTitle]}>
                                    <View style={indexBarStyle}>{}</View>
                                    <View><H3>{sc_bz_name}</H3></View>
                                </View>
                                <View>
                                    <Text>{sc_bz_text}</Text>
                                </View>
                                {
                                    PicRoll(sc_bz_pic_path && sc_bz_pic_path.map((url) => {
                                        return {
                                            url: url,
                                            freeHeight: true
                                        };
                                    }), sc_bz_pic_path)
                                }
                                <View style={sectionGap}>{}</View>
                                <View style={[contentTitle]}>
                                    <View style={indexBarStyle}>{}</View>
                                    <View><H3>正常输出</H3></View>
                                </View>
                                <View>
                                    <Text>{sc_bz_normaltext}</Text>
                                </View>
                                {
                                    PicRoll(sc_bz_normaltext_pic_path && sc_bz_normaltext_pic_path.map((url) => {
                                        return {
                                            url: url,
                                            freeHeight: true
                                        };
                                    }), sc_bz_normaltext_pic_path)
                                }
                                <View style={sectionGap}>{}</View>
                                <View style={[contentTitle]}>
                                    <View style={indexBarStyle}>{}</View>
                                    <View><H3>异常输出</H3></View>
                                </View>
                                <View>
                                    <Text>{sc_bz_errotext}</Text>
                                </View>
                                {
                                    PicRoll(sc_bz_errotext_pic_path && sc_bz_errotext_pic_path.map((url) => {
                                        return {
                                            url: url,
                                            freeHeight: true
                                        };
                                    }), sc_bz_errotext_pic_path)
                                }
                                <View style={sectionGap}>{}</View>
                                <View style={[contentTitle]}>
                                    <View style={indexBarStyle}>{}</View>
                                    <View><H3>时间</H3></View>
                                </View>
                                <View style={[{ flexDirection: "row" }]}>
                                    <View style={[{ flex: 1, flexDirection: "row" }]}>
                                        <View style={lineTitle}>
                                            <Text>步骤开始时间</Text>
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
                                                        onDateChange={this.props.startDateUpdateAction}
                                                        date={sr_bz_startTime}
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
                                            <Text>步骤结束时间</Text>
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
                                                        onDateChange={this.props.finishDateUpdateAction}
                                                        date={sr_bz_endTime}
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
                                </View>
                                <View style={sectionGap}>{}</View>
                                <View style={[contentTitle]}>
                                    <View style={indexBarStyle}>{}</View>
                                    <View style={{ flexDirection: "row" }}><H3>实际操作地点</H3></View>
                                </View>
                                <View style={{ flexDirection: "row" }}>
                                    <View style={[{ flexDirection: "row" }, styles.marginRight30]}>
                                        <Radio style={[this.isReadOnly() && disableOpacity]} disabled={this.isReadOnly()} color="#D9D5DC" selected={bz_site === "办公区"} onPress={() => this.props.triggerSiteAction(1)}/>
                                        <Text style={styles.marginLeft5}>办公区</Text>
                                    </View>
                                    <View style={{ flexDirection: "row" }}>
                                        <Radio style={[this.isReadOnly() && disableOpacity]} disabled={this.isReadOnly()} color="#D9D5DC" selected={bz_site === "机房"} onPress={() => this.props.triggerSiteAction(0)}/>
                                        <Text style={styles.marginLeft5}>机房</Text>
                                    </View>
                                </View>
                                <View style={sectionGap}>{}</View>
                                <View style={[contentTitle]}>
                                    <View style={indexBarStyle}>{}</View>
                                    <View style={{ flexDirection: "row" }}><H3>选择输出结果</H3></View>
                                </View>
                                <View style={{ flexDirection: "row" }}>
                                    <View style={[{ flexDirection: "row" }, styles.marginRight30]}>
                                        <Radio style={[this.isReadOnly() && disableOpacity]} disabled={this.isReadOnly()} color="#D9D5DC" selected={bz_jieguo === "正常"} onPress={() => this.props.triggerResultAction(1)}/>
                                        <Text style={styles.marginLeft5}>正常输出</Text>
                                    </View>
                                    <View style={{ flexDirection: "row" }}>
                                        <Radio style={[this.isReadOnly() && disableOpacity]} disabled={this.isReadOnly()} color="#D9D5DC" selected={bz_jieguo === "异常"} onPress={() => this.props.triggerResultAction(0)}/>
                                        <Text style={styles.marginLeft5}>异常输出</Text>
                                    </View>
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
                                        onValueChange={(itemValue) => {
                                                if(itemValue && itemValue !== "")	
                                                this.props.remarkUpdatesAction(itemValue) 
                                            }}>
                                        {remarksList.map((item, key) => {
                                            return <Picker.Item label={`${item.remarkname}`} value={item.remarkname} key={key} />;
                                        })}
                                    </Picker>
                                </View>
                                <View>
                                    <Textarea disabled={this.isReadOnly()} onChangeText={(text) => this.props.remarkUpdatesAction(text) } value={sr_remark_bz} rowSpan={3} bordered placeholder="输入备注信息" />
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
                        <View style={{ flexDirection: "row", justifyContent: "center", }}>
                            <Button
                                bordered
                                style={[footerBtnStyle, styles.marginRight30]}
                                onPress={() => {
                                    console.log("08", formattedData);
                                    console.log("08", formattedData.sc_bz_step);
                                    if (sc_bz_step_pre === 0) {
                                        navigation.goBack(); // 步骤 1，返回施工方案界面
                                    } else {
                                        // refresh page
                                        this._scroll.scrollTo({ y: 0 });
                                        this.props.requestStepInfoAction(formUrlEncoded({
                                            user: userName,
                                            displayCode,
                                            readOnlyFlag,
                                            sggl_tag,
                                            sr_id,
                                            recStatus,
                                            sc_tag,
                                            sc_bz_step: sc_bz_step_pre,
                                            sr_isPreStep: true,
                                        }, { ignorenull : true, skipIndex: true, sorted: false }));
                                    }
                                }}
                            >
                                <Text style={colorWhite}>上一步</Text>
                            </Button>
                            {
                                renderIf(sc_bz_step_next !== -1)(
                                    <Button
                                        bordered
                                        style={footerBtnStyle}
                                        onPress={() => {
                                            this._scroll.scrollTo({ y: 0 });
                                            console.log("Step testing: ", formattedData);
                                            this.props.requestStepInfoAction(formUrlEncoded(formattedData, { ignorenull : true, skipIndex: true, sorted: false }));
                                        }}
                                    >
                                        <Text style={colorWhite}>下一步</Text>
                                    </Button>
                                )
                            }
                        </View>
                        <Button bordered style={[footerBtnStyle]} onPress={() => {
                            Alert.alert("操作提示", "是否结束本手册", [
                                { text: "取消", onPress: () => {}},
                                {
                                    text: "确认", onPress: () => {
                                        // 保存本步骤信息，跳到施工方案主页
																				console.log("结束本手册", formattedData);
                                        this.props.endManualAction(formUrlEncoded(formattedData, { ignorenull : true, skipIndex: true, sorted: false }));
                                    }
                                },
                            ]);
                        }}>
                            <Text style={colorWhite}>结束本手册</Text>
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
            {/*照片集*/}
            <Modal style={{ width: "100%", height: "100%" }} isOpen={this.state.modalVisible} transparent={true} onRequestClose={() => this.setState({ modalVisible: false })}>
                <ImageViewer imageUrls={imageUrls} index={this.state.picIndex} enableSwipeDown={true} onSwipeDown={() =>{ this.setState({modalVisible: false}); }} 
                    onClick={()=>{ this.setState({modalVisible: false}); }} />
            </Modal>
            {/*图片集*/}
            <Modal style={{ width: "100%", height: "100%" }} isOpen={this.state.picsModalVisible} transparent={true} onRequestClose={() => this.setState({ picsModalVisible: false })}>
                <ImageViewer imageUrls={this.state.picsSource} index={this.state.picIndex} enableSwipeDown={true} onSwipeDown={() =>{ this.setState({picsModalVisible: false}); }} 
                  onClick={()=>{ this.setState({picsModalVisible: false}); }} />
            </Modal>
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

export default ShowStepInfoScreen;
