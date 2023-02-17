/** 插件配置初始值 */
export const INIT_CONFIG: IConfigType = {
	mode: 'fronted',
	isOpen: true,
	hostWhiteList: [],
	ignoreParams: {},
	defaultRequestContentType: 'application/x-www-form-urlencoded',
}

/** 页面数据初始化 */
export const INIT_PAGES: IPages[] = [
	{
		id: '123123',
		title: '测试数据',
		url: 'https://www.baidu.com',
	},
]
