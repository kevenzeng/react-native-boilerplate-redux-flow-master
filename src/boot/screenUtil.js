import { Dimensions, Platform, PixelRatio } from "react-native";

const deviceWidthDp = Dimensions.get("window").width;
const uiWidthPx = 1280;


export default {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    onePixel: 1 / PixelRatio.get(),
    STATUSBAR_HEIGHT: (Platform.OS === "ios" ? 20 : 0),
    APPBAR_HEIGHT: (Platform.OS === "ios" ? 44 : 56),
    px2dp: (uiElementPx) => {
        return uiElementPx * deviceWidthDp / uiWidthPx;
    },
    pixelRatio: PixelRatio.get()
};
