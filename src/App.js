// @flow
import React from "react";
import { createBottomTabNavigator, createSwitchNavigator, createStackNavigator } from "react-navigation";
import NavigationService from "./services/NavigationService";
import { Root, Drawer } from "native-base";
import AuthLoadingScreen from "./container/AuthLoadingContainer";
import Login from "./container/LoginContainer";
import HomeScreen from "./container/HomeScreenContainer";
import Trends from "./container/TrendsContainer";
import Settings from "./container/SettingsContainer";
import Blank from "./container/BlankPageContainer";

// StoreRoomManagement
import StoreManagementRedirector from "./container/SMRContainer";
import NewStoreIn from "./stories/screens/NewStoreIn";
import StoreOut from "./stories/screens/StoreOut";
import kfgl_device from "./stories/screens/kfgl_device";
import kfgl_storetrans from "./stories/screens/kfgl_storetrans";
import kfgl_storecheck from "./stories/screens/kfgl_storecheck";
import DealWithDevice from "./container/DealWithDeviceContainer";
import DealWithStoreIn from "./container/DealWithStoreInContainer";
import DealWithStoreOut from "./container/DealWithStoreOutContainer";
import DealWithStoreTrans from "./container/DealWithStoreTransContainer";
import DealWithStoreCheck from "./container/DealWithStoreICheckContainer";
import StoreCheckItemsList from "./container/StoreCheckItemsListContainer";
import TransInfo from "./container/TransInfoContainer";
import StoreCheckTransInfo from "./container/StoreCheckTransInfoContainer";
import BarCodeScannerScreen from "./stories/screens/BarCodeScanner";

// sggl_new
import sggl_findToFollowUpList from "./container/sggl_new/00_findToFollowUpList";
import sggl_showConstructFormInfo from "./container/sggl_new/02_showConstructFormInfo";
import sggl_toConstructPrepare from "./container/sggl_new/03_toConsturctPrepare";
import sggl_toCheckBeforeConstruct from "./container/sggl_new/04_toCheckBeforeConstruct";
import sggl_toConstructPlan from "./container/sggl_new/07_toConstructPlan";
import sggl_showStepInfo from "./container/sggl_new/08_showStepInfo";
import sggl_toCheckAfterConstruct from "./container/sggl_new/09_toCheckAfterConstruct";
import sggl_toConstructSupervisionRecord from "./container/sggl_new/10_toConstructSupervisionRecord";
import sggl_showManual from "./container/sggl_new/12_showManual";
import sggl_findConstructSupervisionList from "./container/sggl_new/15_findConstructSupervisionList";
import { Ionicons } from "@expo/vector-icons";

// The dark drawer issue
Drawer.defaultProps.styles.mainOverlay.elevation = 0;

const AppStack = createBottomTabNavigator(
    {
        Trends: {screen: Trends, navigationOptions: {tabBarLabel: "动态监控"}},
        Home: {screen: HomeScreen, navigationOptions: {tabBarLabel: "分类导航"}},
        Settings: {screen: Settings, navigationOptions: {tabBarLabel: "个人中心"}},
    },
    {
        navigationOptions: ({navigation}) => ({
            tabBarIcon: ({focused, tintColor}) => {
                const {routeName} = navigation.state;
                let iconName;
                if (routeName === "Home") {
                    iconName = "ios-grid";
                } else if (routeName === "Settings") {
                    iconName = "md-person";
                } else if (routeName === "Trends") {
                    iconName = "ios-easel";
                }

                // You can return any component that you like here! We usually use an
                // icon component from react-native-vector-icons
                return <Ionicons name={iconName} size={25} color={tintColor}/>;
            },
        }),
        tabBarOptions: {
            activeTintColor: "tomato",
            inactiveTintColor: "gray",
        },
        animationEnabled: false,
        swipeEnabled: false,
        initialRouteName: "Home",
    }
);

const StoreManagementStack = createStackNavigator(
    {
        SMR: StoreManagementRedirector,
        NewStoreIn: NewStoreIn,
        StoreOut: StoreOut,
        kfgl_device: kfgl_device,
        kfgl_storetrans: kfgl_storetrans,
        kfgl_storecheck: kfgl_storecheck,
        DealWithStoreIn: DealWithStoreIn,
        DealWithStoreOut: DealWithStoreOut,
        DealWithDevice: DealWithDevice,
        DealWithStoreTrans: DealWithStoreTrans,
        DealWithStoreCheck: DealWithStoreCheck,
        StoreCheckItemsList: StoreCheckItemsList,
        StoreCheckTransInfo: StoreCheckTransInfo,
        TransInfo: TransInfo,
        BarCodeScanner: BarCodeScannerScreen,

        // sggl
        sggl_00: sggl_findToFollowUpList,
        sggl_02: sggl_showConstructFormInfo,
        sggl_03: sggl_toConstructPrepare,
        sggl_04: sggl_toCheckBeforeConstruct,
        sggl_07: sggl_toConstructPlan,
        sggl_08: sggl_showStepInfo,
        sggl_09: sggl_toCheckAfterConstruct,
        sggl_10: sggl_toConstructSupervisionRecord,
        sggl_12: sggl_showManual,
        sggl_15: sggl_findConstructSupervisionList,
    },
    {
        initialRouteName: "SMR",
        navigationOptions: {
            headerStyle: {
                backgroundColor: "#FF3300",
            },
            headerTintColor: "#FFF",
            headerTitleStyle: {
                textAlign: "center",
                width: "95%",
            }
        }
    }
);

const App = createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        Auth: Login,
        App: AppStack,
        Blank: Blank,
        StoreManagement: StoreManagementStack,
    },
    {
        initialRouteName: "AuthLoading",
    }
);

export default () => (
	<Root>
		<App
            ref={ navigatorRef => {
                NavigationService.setTopLevelNavigator(navigatorRef);
            }}
        />
	</Root>
);
