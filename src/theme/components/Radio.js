import { Platform } from "react-native";
import screenUtil from "../../boot/screenUtil";
const { px2dp } = screenUtil;

import variable from "./../variables/platform";

export default (variables = variable) => {
	const radioTheme = {
		".selected": {
			"NativeBase.IconNB": {
				color: Platform.OS === "ios" ? variables.brandPrimary : variables.radioSelectedColorAndroid,
				lineHeight: Platform.OS === "ios" ? px2dp(25) : variables.radioBtnLineHeight,
				height: Platform.OS === "ios" ? px2dp(20) : undefined,
			},
		},
		"NativeBase.IconNB": {
			color: Platform.OS === "ios" ? "transparent" : "#f30",
			lineHeight: Platform.OS === "ios" ? undefined : variables.radioBtnLineHeight,
			fontSize: Platform.OS === "ios" ? undefined : variables.radioBtnSize,
		},
	};

	return radioTheme;
};
