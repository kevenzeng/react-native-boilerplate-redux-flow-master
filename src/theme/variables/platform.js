import color from "color";

import { Platform, Dimensions, PixelRatio } from "react-native";
import screenUtil from "../../boot/screenUtil";
const { px2dp } = screenUtil;

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const platform = Platform.OS;
const platformStyle = undefined;

export default {
	platformStyle,
	platform,
	// AndroidRipple
	androidRipple: true,
	androidRippleColor: "rgba(256, 256, 256, 0.3)",
	androidRippleColorDark: "rgba(0, 0, 0, 0.15)",

	// Badge
	badgeBg: "#ED1727",
	badgeColor: "#fff",
	// New Variable
	badgePadding: platform === "ios" ? 3 : 0,

	// Button
	btnFontFamily: platform === "ios" ? "System" : "Roboto_medium",
	btnDisabledBg: "#b5b5b5",
	btnDisabledClr: "#f1f1f1",

	// CheckBox
	CheckboxRadius: platform === "ios" ? px2dp(13) : 0,
	CheckboxBorderWidth: platform === "ios" ? px2dp(1) : px2dp(2),
	CheckboxPaddingLeft: platform === "ios" ? px2dp(4) : px2dp(2),
	CheckboxPaddingBottom: platform === "ios" ? 0 : px2dp(5),
	CheckboxIconSize: platform === "ios" ? px2dp(21) : px2dp(14),
	CheckboxIconMarginTop: platform === "ios" ? undefined : px2dp(1),
	CheckboxFontSize: platform === "ios" ? px2dp(23) / 0.9 : px2dp(18),
	DefaultFontSize: px2dp(17),
	checkboxBgColor: "#039BE5",
	checkboxSize: px2dp(20),
	checkboxTickColor: "#fff",

	// Segment
	segmentBackgroundColor: platform === "ios" ? "#F8F8F8" : "#3F51B5",
	segmentActiveBackgroundColor: platform === "ios" ? "#007aff" : "#fff",
	segmentTextColor: platform === "ios" ? "#007aff" : "#fff",
	segmentActiveTextColor: platform === "ios" ? "#fff" : "#FF3300",
	segmentBorderColor: platform === "ios" ? "#007aff" : "#fff",
	segmentBorderColorMain: platform === "ios" ? "#a7a6ab" : "#3F51B5",

	// New Variable
	get defaultTextColor() {
		return this.textColor;
	},

	get btnPrimaryBg() {
		return this.brandPrimary;
	},
	get btnPrimaryColor() {
		return this.inverseTextColor;
	},
	get btnInfoBg() {
		return this.brandInfo;
	},
	get btnInfoColor() {
		return this.inverseTextColor;
	},
	get btnSuccessBg() {
		return this.brandSuccess;
	},
	get btnSuccessColor() {
		return this.inverseTextColor;
	},
	get btnDangerBg() {
		return this.brandDanger;
	},
	get btnDangerColor() {
		return this.inverseTextColor;
	},
	get btnWarningBg() {
		return this.brandWarning;
	},
	get btnWarningColor() {
		return this.inverseTextColor;
	},
	get btnTextSize() {
		return platform === "ios" ? this.fontSizeBase * 1.1 : this.fontSizeBase - px2dp(1);
	},
	get btnTextSizeLarge() {
		return this.fontSizeBase * 1.5;
	},
	get btnTextSizeSmall() {
		return this.fontSizeBase * 0.8;
	},
	get borderRadiusLarge() {
		return this.fontSizeBase * 3.8;
	},

	buttonPadding: px2dp(6),

	get iconSizeLarge() {
		return this.iconFontSize * 1.5;
	},
	get iconSizeSmall() {
		return this.iconFontSize * 0.6;
	},

	// Card
	cardDefaultBg: "#fff",

	// Color
	brandPrimary: platform === "ios" ? "#007aff" : "#3F51B5",
	brandInfo: "#62B1F6",
	brandSuccess: "#5cb85c",
	brandDanger: "#FF3300",
	brandWarning: "#f0ad4e",
	brandSidebar: "#252932",

	// Font
	fontFamily: platform === "ios" ? "System" : "Roboto",
	fontSizeBase: px2dp(15),

	get fontSizeH1() {
		return this.fontSizeBase * 1.8;
	},
	get fontSizeH2() {
		return this.fontSizeBase * 1.6;
	},
	get fontSizeH3() {
		return this.fontSizeBase * 1.4;
	},

	// Footer
	footerHeight: px2dp(55),
	footerDefaultBg: platform === "ios" ? "#F8F8F8" : "#3F51B5",

	// FooterTab
	tabBarTextColor: platform === "ios" ? "#6b6b6b" : "#b3c7f9",
	tabBarTextSize: platform === "ios" ? px2dp(14) : px2dp(11),
	activeTab: platform === "ios" ? "#007aff" : "#fff",
	sTabBarActiveTextColor: "#007aff",
	tabBarActiveTextColor: platform === "ios" ? "#007aff" : "#fff",
	tabActiveBgColor: platform === "ios" ? "#cde1f9" : "#3F51B5",

	// Tab
	tabDefaultBg: platform === "ios" ? "#F8F8F8" : "#3F51B5",
	topTabBarTextColor: platform === "ios" ? "#6b6b6b" : "#b3c7f9",
	topTabBarActiveTextColor: platform === "ios" ? "#007aff" : "#fff",
	topTabActiveBgColor: platform === "ios" ? "#cde1f9" : undefined,
	topTabBarBorderColor: platform === "ios" ? "#a7a6ab" : "#fff",
	topTabBarActiveBorderColor: platform === "ios" ? "#007aff" : "#fff",

	// Header
	toolbarBtnColor: platform === "ios" ? "#007aff" : "#fff",
	toolbarDefaultBg: platform === "ios" ? "#F8F8F8" : "#FF3300",
	toolbarHeight: platform === "ios" ? px2dp(64) : px2dp(56),
	toolbarIconSize: platform === "ios" ? px2dp(20) : px2dp(22),
	toolbarSearchIconSize: platform === "ios" ? px2dp(20) : px2dp(23),
	toolbarInputColor: platform === "ios" ? "#CECDD2" : "#fff",
	searchBarHeight: platform === "ios" ? px2dp(30) : px2dp(40),
	toolbarInverseBg: "#222",
	toolbarTextColor: platform === "ios" ? "#000" : "#fff",
	toolbarDefaultBorder: platform === "ios" ? "#a7a6ab" : "#3F51B5",
	iosStatusbar: platform === "ios" ? "dark-content" : "light-content",
	get statusBarColor() {
		return color(this.toolbarDefaultBg)
			.darken(0.2)
			.hex();
	},

	// Icon
	iconFamily: "Ionicons",
	iconFontSize: platform === "ios" ? px2dp(30) : px2dp(28),
	iconMargin: px2dp(7),
	iconHeaderSize: platform === "ios" ? px2dp(33) : px2dp(24),

	// InputGroup
	inputFontSize: px2dp(17),
	inputBorderColor: "#D9D5DC",
	inputSuccessBorderColor: "#2b8339",
	inputErrorBorderColor: "#ed2f2f",

	get inputColor() {
		return this.textColor;
	},
	get inputColorPlaceholder() {
		return "#575757";
	},

	inputGroupMarginBottom: px2dp(10),
	inputHeightBase: px2dp(50),
	inputPaddingLeft: px2dp(5),

	get inputPaddingLeftIcon() {
		return this.inputPaddingLeft * 8;
	},

	// Line Height
	btnLineHeight: px2dp(19),
	lineHeightH1: px2dp(32),
	lineHeightH2: px2dp(27),
	lineHeightH3: px2dp(22),
	iconLineHeight: platform === "ios" ? px2dp(37) : px2dp(30),
	lineHeight: platform === "ios" ? px2dp(20) : px2dp(24),

	// List
	listBorderColor: "#c9c9c9",
	listDividerBg: "#f4f4f4",
	listItemHeight: px2dp(45),
	listBtnUnderlayColor: "#DDD",

	// Card
	cardBorderColor: "#ccc",

	// Changed Variable
	listItemPadding: platform === "ios" ? px2dp(10) : px2dp(12),

	listNoteColor: "#808080",
	listNoteSize: 13,

	// Progress Bar
	defaultProgressColor: "#E4202D",
	inverseProgressColor: "#1A191B",

	// Radio Button
	radioBtnSize: platform === "ios" ? px2dp(25) : px2dp(23),
	radioSelectedColorAndroid: "#f30",

	// New Variable
	radioBtnLineHeight: platform === "ios" ? px2dp(29) : px2dp(24),

	radioColor: "#7e7e7e",

	get radioSelectedColor() {
		return color(this.radioColor)
			.darken(0.2)
			.hex();
	},

	// Spinner
	defaultSpinnerColor: "#45D56E",
	inverseSpinnerColor: "#1A191B",

	// Tabs
	tabBgColor: "#F8F8F8",
	tabFontSize: px2dp(15),
	tabTextColor: "#222222",

	// Text
	textColor: "#000",
	inverseTextColor: "#fff",
	noteFontSize: px2dp(14),

	// Title
	titleFontfamily: platform === "ios" ? "System" : "Roboto_medium",
	titleFontSize: platform === "ios" ? px2dp(17) : px2dp(23),
	subTitleFontSize: platform === "ios" ? px2dp(12) : px2dp(14),
	subtitleColor: platform === "ios" ? "#8e8e93" : "#FFF",

	// New Variable
	titleFontColor: platform === "ios" ? "#000" : "#FFF",

	// Other
	borderRadiusBase: platform === "ios" ? 5 : 2,
	borderWidth: px2dp(1) / PixelRatio.getPixelSizeForLayoutSize(1),
	contentPadding: px2dp(10),

	get darkenHeader() {
		return color(this.tabBgColor)
			.darken(0.03)
			.hex();
	},

	dropdownBg: "#000",
	dropdownLinkColor: "#414142",
	inputLineHeight: px2dp(24),
	jumbotronBg: "#C9C9CE",
	jumbotronPadding: px2dp(30),
	deviceWidth,
	deviceHeight,

	// New Variable
	inputGroupRoundedBorderRadius: 30,
};
