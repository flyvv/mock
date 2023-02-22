import {
  createMessageBridge,
  createURL,
  getHttpMockingInfo,
  getRequestContentType,
  xhrOpen,
} from "./libs";

const { getMockConfig, postPageMessage } = createMessageBridge();

const postHttpResponseData = (xhr: XMLHttpRequest, xhrRequest, sendParams) => {
  if (!xhr.responseURL) return;
  console.log(xhr,'----xhr----');
  
  const requestContentType = getRequestContentType(xhrRequest);
  const url = new URL(xhr.responseURL);
  const xhrInfo = {
    isMtop: false,
    pageURL: window.location.host + window.location.pathname,
    method: xhrRequest.method,
    query: xhrRequest.query,
    requestParams: sendParams,
    host: url.host,
    url: url.host + url.pathname,
    responseText: xhr.responseText,
    requestContentType,
  };
  postPageMessage({
    type: "responseData",
    data: xhrInfo,
  });
};

const postRequestData = (info) => {
  const data = {
    isMtop: info.isMtop,
    pageURL: window.location.host + window.location.pathname,
    method: info.method,
    requestParams: info.requestParams,
    query: info.query,
    version: info.version,
    url: info.url,
  };

  postPageMessage({
    type: "requestData",
    data,
  });
};

(function () {
  const xhrMap: Map<XMLHttpRequest, any>= new Map();
  const { send } = XMLHttpRequest.prototype;

  xhrOpen(xhrMap ,getMockConfig )

  XMLHttpRequest.prototype.send = function (sendParams) {
    const xhr = this;
    const { method, url, query, isMtop } = xhrMap.get(xhr);
    // mtop的响应代理、请求魔改单独处理，不在此处解。
    if (isMtop) {
      send.apply(this, arguments);
      return;
    }

    const {
      appMockingEnable,
      apiMockingEnable,
      responseText,
      mode,
      debugInfo,
      apiCapture,
    } = getHttpMockingInfo(xhr, sendParams, method, url, query, getMockConfig);

    let postResult = false;

    if (!appMockingEnable) {
      send.apply(this, arguments);
      return;
    }

    if (apiMockingEnable && mode === "fronted" && !apiCapture) {
      setTimeout(() => {
        postRequestData({
          isMtop: true,
          url: url.href,
          method,
          query,
          requestParams: sendParams,
        });

        const responseData = JSON.parse(responseText as string);

        console.log(
          "xc代理成功目",
          "color: green; font-weight: bold; font-size: 16px;",
          url.href,
          sendParams || query,
          responseData
        );
        Object.defineProperty(xhr, "readyState", { value: 4 });
        Object.defineProperty(xhr, "status", { value: 200 });
        Object.defineProperty(xhr, "response", { value: responseText });
        Object.defineProperty(xhr, "responseText", {
          value: responseText,
        });
        xhr.onreadystatechange?.apply(xhr, new Event("readystatechange"));
        xhr.onloadend?.apply(xhr, new Event("loadend"));
        xhr.onload?.apply(xhr, new Event("load"));
        xhr.dispatchEvent(new Event("load"));
        xhr.dispatchEvent(new Event("readystatechange"));
        xhr.dispatchEvent(new Event("loadend"));
      }, 500);
      return;
    }

    // 最后处理 mode ==='backend',以及接口数据抓取
    let _onloadend = xhr.onloadend;
    xhr.onloadend = () => {
      debugger;
      if (!postResult) {
        postResult = true;
        postHttpResponseData(xhr, xhrMap.get(xhr), sendParams);
        // if (
        // 	!apiCapture &&
        // 	apiMockingEnable &&
        // 	debugInfo?.mappingResponse
        // ) {
        // 	modifyXHRResponse(xhr, debugInfo.mappingResponse)
        // }
      }
      if (typeof _onloadend === "function") {
        _onloadend.apply(xhr, arguments);
      }
    };

    Object.defineProperty(xhr, "onloadend", {
      get: () => _onloadend,
      set: (value) => {
        _onloadend = value;
      },
    });

    let _onreadystatechange = xhr.onreadystatechange;
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && !postResult) {
        postResult = true;
        postHttpResponseData(xhr, xhrMap.get(xhr), sendParams);

        // if (
        // 	!apiCapture &&
        // 	apiMockingEnable &&
        // 	debugInfo?.mappingResponse
        // ) {
        // 	modifyXHRResponse(xhr, debugInfo.mappingResponse)
        // }
      }
      if (typeof _onreadystatechange === "function") {
        _onreadystatechange.apply(xhr, arguments);
      }
    };
    Object.defineProperty(xhr, "onreadystatechange", {
      get: () => _onreadystatechange,
      set: (value) => {
        _onreadystatechange = value;
      },
    });
    if (!debugInfo?.requestParams?.length) {
      send.call(xhr, sendParams);
      return;
    }
    let sendParamString;

    try {
      // @ts-ignore
      const actualSendParams = JSON.parse(sendParams || "{}");
      debugInfo.requestParams.forEach((param) => {
        actualSendParams[param.key] = param.value;
      });
      sendParamString = JSON.stringify(actualSendParams);
    } catch (err) {
      try {
        const actualSendParams = new URLSearchParams(sendParams as string);
        debugInfo.requestParams.forEach((param) => {
          actualSendParams.append(param.key, param.value);
        });
        sendParamString = actualSendParams.toString();
      } catch (e) {
        console.warn("解析sendParams出错", e);
      }
    }
    send.call(xhr, sendParamString);
  };
})();
