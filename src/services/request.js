import { AsyncStorage } from "react-native";
import MessageBar from "./messageBar";
import { DOMAIN_ROOT } from "../boot/config";
import { isEmpty } from "lodash";

function parseJSON(response) {
  //console.log(response);
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function handleError(error) {
  if (error) {
    if (error.message === "Network request failed") {
      MessageBar.show({
        message: "请检查网络是否通畅",
        type: "warning"
      });
    } else if (error.response && error.response.state >= 500) {
      MessageBar.show({
        message: "服务器异常，请检查网页版能否登录",
        type: "warning"
      });
    }
    console.log("error:", error);
  }

  return { error };
}

export default function request(url, options) {
  // url 是 const
  console.log("OutSide of the request", DOMAIN_ROOT, url, options);
  return AsyncStorage.getItem("serverIp")
    .then(serverIp => {
      let fIp = "";
      if (serverIp) {
        if (isEmpty(serverIp)) {
          fIp = `http://${DOMAIN_ROOT}${url}`;
        } else {
          fIp = `http://${serverIp}${url}`;
        }
      } else {
        fIp = `http://${DOMAIN_ROOT}${url}`;
      }
      console.log("In the request", fIp);
      return fetch(fIp, options)
        .then(checkStatus)
        .then(parseJSON)
        .then(data => ({ data }))
        .catch(handleError);
    });
}
