declare module 'antd'

declare interface IConfigType {
	/** 插件是否开启 */
	isOpen: boolean
	/** 刷新页面 */
	reload?: boolean
	/** 使用方 前端 后端  */
	mode: 'fronted' | 'backed'
	/** 请求host白名单 */
	hostWhiteList: string[]

	defaultRequestContentType?: 'application/x-www-form-urlencoded'
	/** 过滤请求参数 */
	ignoreParams?: {
		[key: string]: string | number | boolean
	}
}

declare interface ICurrentPageInfoType {
	id: string
	url: string
	title: string
	/** 是抓取请求中 */
	apiCapture: boolean
}
declare interface IPages {
	id: string
	url: string
	title: string
	/** 是否开启代理 */
	isMocking?: boolean
	/** 接口描述 */
	desc?: string
	/** 是否收藏 */
	stared?: boolean
	/** 请求方式 */
	method?: 'post' | 'get'
	/** 场景 */
	scece?: any[]
	/** 最终请求参数 */
	lastedParams?: {
		[key: string]: string | number | boolean
	}
}
declare interface IMockDataType {
	/** 页面信息 */
	pages?: IPages[]
	/** 配置信息 */
	config?: IConfigType
	/** 当前页面信息 */
	currentPageInfo?: ICurrentPageInfoType
	/** 扩展 */
	extends?: any
}
