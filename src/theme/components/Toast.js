import variable from "./../variables/platform";
import screenUtil from "../../boot/screenUtil";
const { px2dp } = screenUtil;

export default (variables = variable) => {
	const platform = variables.platform;

	const toastTheme = {
		".danger": {
			backgroundColor: variables.brandDanger,
		},
		".warning": {
			backgroundColor: variables.brandWarning,
		},
		".success": {
			backgroundColor: variables.brandSuccess,
		},
		backgroundColor: "rgba(0,0,0,0.8)",
		borderRadius: platform === "ios" ? px2dp(5) : 0,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: px2dp(10),
		minHeight: px2dp(50),
		"NativeBase.Text": {
			color: "#fff",
			flex: 1,
		},
		"NativeBase.Button": {
			backgroundColor: "transparent",
			height: px2dp(30),
			elevation: 0,
			"NativeBase.Text": {
				fontSize: px2dp(14),
			},
		},
	};

	return toastTheme;
};
