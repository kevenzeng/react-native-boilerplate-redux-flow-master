import variable from "./../variables/platform";
import screenUtil from "../../boot/screenUtil";
const { px2dp } = screenUtil;

export default (variables = variable) => {
	const platform = variables.platform;

	const segmentTheme = {
		height: px2dp(45),
		borderColor: variables.segmentBorderColorMain,
		flexDirection: "row",
		justifyContent: "center",
		backgroundColor: variables.segmentBackgroundColor,
		"NativeBase.Button": {
			alignSelf: "center",
			borderRadius: 0,
			paddingHorizontal: px2dp(20),
			height: px2dp(30),
			backgroundColor: "transparent",
			borderWidth: px2dp(1),
			borderLeftWidth: 0,
			borderColor: variables.segmentBorderColor,
			elevation: 0,
			".active": {
				backgroundColor: variables.segmentActiveBackgroundColor,
				"NativeBase.Text": {
					color: variables.segmentActiveTextColor,
				},
			},
			".first": {
				borderTopLeftRadius: platform === "ios" ? 5 : undefined,
				borderBottomLeftRadius: platform === "ios" ? 5 : undefined,
				borderLeftWidth: 1,
			},
			".last": {
				borderTopRightRadius: platform === "ios" ? 5 : undefined,
				borderBottomRightRadius: platform === "ios" ? 5 : undefined,
			},
			"NativeBase.Text": {
				color: variables.segmentTextColor,
				fontSize: px2dp(14),
			},
		},
	};

	return segmentTheme;
};
