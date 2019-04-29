// @flow
// import { AsyncStorage } from "react-native";
import { composeWithDevTools } from "remote-redux-devtools";
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { persistStore } from "redux-persist";
import reducer from "../reducers";
import rootSaga from "../sagas/index";

const sagaMiddleWare = createSagaMiddleware();

export default function configureStore(onCompletion: () => void): any {

  const store = createStore(reducer, composeWithDevTools(applyMiddleware(sagaMiddleWare)));

  persistStore(store, onCompletion);

  sagaMiddleWare.run(rootSaga);
  return store;
}
