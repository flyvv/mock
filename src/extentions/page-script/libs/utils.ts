/**
 * 直接new URL报错，处理补全http开头。
 * @param urlString sulstring可能是"//"开头，
 * @returns
 */
export const createURL = (urlString) => {
  const url =
    urlString.indexOf("http") === 0 ? urlString : location.protocol + urlString;
  return new URL(url);
};


/**
 * 获取请求头设置
 * @param xhrRequest 
 * @returns 
 */
export const getRequestContentType = (xhrRequest: any) => {
  if (
    xhrRequest?.customRequestHeaders?.["Content-Type"]?.includes(
      "application/json"
    )
  )
    return "application/json";
  return "application/x-www-form-urlencoded";
};

// 获取http接口代理信息
export const getHttpMockingInfo = (
  xhr,
  request,
  method,
  url,
  query,
  getMockConfig: () => IConfigType
) => {
  const mockConfig = getMockConfig();
  /* 白名单没有 当前请求的host */
  if (!mockConfig?.hostWhiteList?.includes(url.host)) {
    return {
      // 插件是否开启
      appMockingEnable: mockConfig.isOpen,
      // 当前请求mock 不开启
      apiMockingEnable: false,
    };
  }

  const urlKey = `${url.host}${url.pathname}`;

  const requestData = mockConfig?.currentPageInfo?.apis?.find(
    (r) => r.url === urlKey && r.method === method
  ) as IPages;

  let params;
  if (request) {
    try {
      params = JSON.parse(request);
    } catch (err) {
      try {
        params = [...new URLSearchParams(request)?.entries()].reduce(
          (total, [key, value]) => {
            total[key] = value;
            return total;
          },
          {}
        );
      } catch (e) {
        console.warn("解析请求参数错误:11", e);
      }
    }
  }
  const requestParams = { ...query, ...params };
  if (!requestData) {
    return {
      appMockingEnable: mockConfig.isOpen,
      apiMockingEnable: false,
    };
  }

  const responseScene =
    requestData?.scece?.find((s) => s.active) || requestData?.scece?.[0];
  const mapRuleRequest = responseScene?.mapRuleRequests?.find((ruleRequest) => {
    try {
      // eslint-disable-next-line no-new-func
      return new Function("data", `with(data){return ${ruleRequest.rule}}`)(
        requestParams
      );
    } catch (e) {
      console.warn(`解析规则"${ruleRequest.rule}"出错`, e);
    }
    return false;
  });
  const responseText =
    mapRuleRequest?.responseText ||
    responseScene?.defaultResponse?.responseText;
  return {
    responseText,
    mode: mockConfig.mode,
    appMockingEnable: mockConfig.isOpen,
    apiMockingEnable: requestData.isMocking !== false,
    debugInfo: requestData.debugInfo,
    apiCapture: mockConfig?.currentPageInfo?.apiCapture,
  };
};
