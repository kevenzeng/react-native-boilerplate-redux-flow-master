import { NavigationActions, StackActions } from "react-navigation";

let _navigator;

function setTopLevelNavigator(navigatorRef) {
    _navigator = navigatorRef;
}

function navigate(routeName, params) {
    _navigator.dispatch(
        NavigationActions.navigate({
            routeName,
            params,
        })
    );
}

function back() {
    _navigator.dispatch(
        NavigationActions.back()
    );
}

// with v1: NavigationActions.reset
// with v2: StackActions.reset
function reset(routeName, params = {}) {
    _navigator.dispatch(
        StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName, params }),
            ],
        })
    );
}

function resetAll(routeName, params = {}) {
    _navigator.dispatch(
        StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName, params }),
            ],
            key: null, // THIS LINE
        })
    );
}

function popToTop(options = {}) {
    _navigator.dispatch(
        StackActions.popToTop(options)
    );
}

function getRoute() {
    return _navigator.state.nav.routes;
}

export default {
    navigate,
    back,
    reset,
    resetAll,
    popToTop,
    getRoute,
    setTopLevelNavigator,
};
