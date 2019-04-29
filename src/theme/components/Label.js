import variable from "./../variables/platform";
import screenUtil from "../../boot/screenUtil";
const { px2dp } = screenUtil;

export default (variables = variable) => {
	const labelTheme = {
		".focused": {
			width: 0,
		},
		fontSize: px2dp(17),
	};

	return labelTheme;
};
