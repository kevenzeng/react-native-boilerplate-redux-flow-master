import variable from "./../variables/platform";
import screenUtil from "../../boot/screenUtil";
const { px2dp } = screenUtil;

export default (variables = variable) => {
	const textAreaTheme = {
		".underline": {
			borderBottomWidth: variables.borderWidth,
			marginTop: px2dp(5),
			borderColor: variables.inputBorderColor,
		},
		".bordered": {
			borderWidth: px2dp(1),
			marginTop: px2dp(5),
			borderColor: variables.inputBorderColor,
		},
		color: variables.textColor,
		paddingLeft: px2dp(10),
		paddingRight: px2dp(5),
		fontSize: px2dp(15),
		textAlignVertical: "top",
	};

	return textAreaTheme;
};
