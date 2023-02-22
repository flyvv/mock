import { createURL, getHttpMockingInfo } from "./utils";

export const xhrOpen = (xhrMap, getMockConfig) => {
  XMLHttpRequest.prototype.open = function (method, path) {
    const url: URL = createURL(path);
    const query = {};
    [...url.searchParams].forEach((entry) => {
      query[entry[0]] = entry[1];
    });

    xhrMap.set(this, { method, url, query });

    const { appMockingEnable, mode, debugInfo, apiCapture } =
      getHttpMockingInfo(this, null, method, url, query, getMockConfig);
      console.log(appMockingEnable, mode, debugInfo, apiCapture, 'appMockingEnable, mode, debugInfo, apiCapture ');
      

    if (!appMockingEnable || mode === "fronted" || apiCapture) {
      open.apply(this, arguments);
      return;
    }

    const actualMethod = debugInfo?.method || method;
    const actualURL = createURL(debugInfo?.url || path);
    // 如果实际的请求方法是GET，DELETE，则把魔改的入参加到地址的query上

    if (
      (actualMethod === "GET" || actualMethod === "DELETE") &&
      debugInfo?.requestParams?.length
    ) {
      debugInfo.requestParams.forEach((param) => {
        actualURL.searchParams.append(param.key, param.value);
      });
    }
    const args = [...arguments];
    args[0] = actualMethod;
    args[1] = actualURL.href;
    open.apply(this, args);
  };
};
