import { call, put } from "redux-saga/effects";


/*
resource - action
api      - api.xxx
payload  - spec params
* */

export function* fetchResource(resource, api, payload) {
    // request start
    yield put(resource.request(payload));
    const { data, error } = yield call(api, payload);

    console.log("Response!!", data);
    console.log("Error!!", JSON.stringify(error));
    if (data) {
        // Request completed. payload should be 'meta' data field, take document to understand.
        yield put(resource.success(data, payload));
        if (resource.successfulCallback) {
            yield put(resource.successfulCallback(payload));
        }
    } else {
        yield put(resource.failure(data, payload)); // payload 起补充描述作用
    }
}
