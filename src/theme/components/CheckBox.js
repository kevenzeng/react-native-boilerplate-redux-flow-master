import variable from "./../variables/platform";
import screenUtil from "../../boot/screenUtil";
const { px2dp } = screenUtil;

export default (variables = variable) => {
	const checkBoxTheme = {
		".checked": {
			"NativeBase.Icon": {
				color: variables.checkboxTickColor,
			},
			"NativeBase.IconNB": {
				color: variables.checkboxTickColor,
			},
		},
		"NativeBase.Icon": {
			color: "transparent",
			lineHeight: variables.CheckboxIconSize,
			marginTop: variables.CheckboxIconMarginTop,
			fontSize: variables.CheckboxFontSize,
		},
		"NativeBase.IconNB": {
			color: "transparent",
			lineHeight: variables.CheckboxIconSize,
			marginTop: variables.CheckboxIconMarginTop,
			fontSize: variables.CheckboxFontSize,
		},
		borderRadius: variables.CheckboxRadius,
		overflow: "hidden",
		width: variables.checkboxSize,
		height: variables.checkboxSize,
		borderWidth: variables.CheckboxBorderWidth,
		paddingLeft: variables.CheckboxPaddingLeft - px2dp(1),
		paddingBottom: variables.CheckboxPaddingBottom,
		left: px2dp(10),
	};

	return checkBoxTheme;
};
